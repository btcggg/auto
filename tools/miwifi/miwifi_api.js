/**
 * 小米路由器 (MiWiFi) API 客户端
 * 提供登录认证、获取在线设备列表、针对指定设备 MAC 开启/禁用外网访问权限
 * 内置 Raw Socket HTTP 解析器，完美兼容小米路由器 CGI 返回的非标 HTTP Header 输出
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const net = require('net');

function sha1(str) {
  return crypto.createHash('sha1').update(str).digest('hex');
}

class MiWiFiClient {
  constructor(config = {}) {
    this.routerIp = config.routerIp || '192.168.31.1';
    this.password = config.password || '';
    this.port = config.port || 80;
    this.baseUrl = `http://${this.routerIp}/cgi-bin/luci`;
    this.stok = null;
    this.deviceKey = null;
    this.routerMac = null;
  }

  /**
   * 加载配置文件
   */
  static loadConfig(configPath) {
    const targetPath = configPath || path.resolve(__dirname, 'config.json');
    if (!fs.existsSync(targetPath)) {
      throw new Error(`配置文件不存在: ${targetPath}`);
    }
    const raw = fs.readFileSync(targetPath, 'utf8');
    return JSON.parse(raw);
  }

  /**
   * 底层 HTTP 请求封装
   * 采用原生 TCP Socket 发送和接收 HTTP，避免 strict HTTP parser 对小米 CGI 调试输出报 Invalid Header Token
   */
  sendHttpRequest(urlPath, method = 'GET', postData = '') {
    return new Promise((resolve, reject) => {
      const socket = net.createConnection(this.port, this.routerIp, () => {
        let req = `${method} ${urlPath} HTTP/1.1\r\n`;
        req += `Host: ${this.routerIp}\r\n`;
        req += `User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)\r\n`;
        req += `Connection: close\r\n`;
        if (postData) {
          req += `Content-Type: application/x-www-form-urlencoded\r\n`;
          req += `Content-Length: ${Buffer.byteLength(postData)}\r\n\r\n`;
          req += postData;
        } else {
          req += `\r\n`;
        }
        socket.write(req);
      });

      let buffer = '';
      socket.on('data', chunk => {
        buffer += chunk.toString('utf8');
      });

      socket.on('end', () => {
        // 从响应数据中提取 JSON 结构
        const jsonMatch = buffer.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            const json = JSON.parse(jsonMatch[0]);
            return resolve({ status: 200, data: json, raw: buffer });
          } catch (e) {}
        }
        if (buffer.includes('succeeded') || buffer.includes('200 OK')) {
          return resolve({ status: 200, data: { code: 0 }, raw: buffer });
        }
        return resolve({ status: 200, data: null, raw: buffer });
      });

      socket.on('error', err => reject(err));
      socket.setTimeout(8000, () => {
        socket.destroy();
        reject(new Error(`连接路由器 (${this.routerIp}) 超时`));
      });
    });
  }

  /**
   * 生成小米路由器登录 Nonce
   */
  generateNonce(deviceId = '00:00:00:00:00:00') {
    const type = 0;
    const timestamp = Math.floor(Date.now() / 1000);
    const rand = Math.floor(Math.random() * 10000);
    return `${type}_${deviceId}_${timestamp}_${rand}`;
  }

  /**
   * 获取路由器页面参数 (从 /cgi-bin/luci/web/home 动态提取 key 与 deviceId)
   */
  async getInitInfo() {
    try {
      const res = await this.sendHttpRequest('/cgi-bin/luci/web/home', 'GET');
      if (res.raw) {
        const keyMatch = res.raw.match(/key:\s*['"]([^'"]+)['"]/);
        const deviceIdMatch = res.raw.match(/deviceId\s*[:=]\s*['"]([^'"]+)['"]/);
        
        if (keyMatch && keyMatch[1]) {
          this.deviceKey = keyMatch[1];
        }
        if (deviceIdMatch && deviceIdMatch[1]) {
          this.routerMac = deviceIdMatch[1];
        }
        return {
          key: this.deviceKey,
          deviceId: this.routerMac
        };
      }
    } catch (err) {}

    try {
      const res = await this.sendHttpRequest('/cgi-bin/luci/api/xqsystem/init_info', 'GET');
      if (res.data && res.data.code === 0) {
        this.deviceKey = this.deviceKey || res.data.key || res.data.mac || '';
        this.routerMac = this.routerMac || res.data.mac || res.data.id || '00:00:00:00:00:00';
        return res.data;
      }
    } catch (err) {}

    return {
      key: this.deviceKey || '',
      deviceId: this.routerMac || '00:00:00:00:00:00'
    };
  }

  /**
   * 登录小米路由器并获取 stok (Session Token)
   */
  async login() {
    if (!this.password) {
      throw new Error('未配置路由器管理密码，请在 config.json 中配置 password');
    }

    const initInfo = await this.getInitInfo();
    const key = this.deviceKey || (initInfo && initInfo.key) || '';
    const deviceId = this.routerMac || (initInfo && (initInfo.deviceId || initInfo.mac)) || '00:00:00:00:00:00';
    const nonce = this.generateNonce(deviceId);

    // 小米路由器标准加密算法:
    // oldPwd = sha1(nonce + sha1(password + key))
    const pwdHash = sha1(this.password + key);
    const encryptedPassword = sha1(nonce + pwdHash);

    const postBody = new URLSearchParams({
      username: 'admin',
      password: encryptedPassword,
      logtype: '2',
      nonce: nonce
    }).toString();

    const res = await this.sendHttpRequest('/cgi-bin/luci/api/xqsystem/login', 'POST', postBody);
    const data = res.data;

    if (data && data.code === 0 && (data.token || data.url)) {
      this.stok = data.token;
      if (!this.stok && data.url) {
        const match = data.url.match(/;stok=([^/]+)/);
        if (match) this.stok = match[1];
      }
      return this.stok;
    } else {
      const msg = (data && data.msg) || (res.raw ? res.raw.slice(0, 100) : '未知错误');
      throw new Error(`登录失败 (错误码 ${data ? data.code : 'unknown'}): ${msg}，请检查路由器 IP 与管理密码`);
    }
  }

  /**
   * 确保当前处于登录有效状态
   */
  async ensureLogin() {
    if (!this.stok) {
      await this.login();
    }
  }

  /**
   * 包装带 stok 的 API 请求，并在 token 过期时自动重试登录
   */
  async requestApi(apiPath, method = 'GET', postData = '') {
    await this.ensureLogin();
    const urlPath = `/cgi-bin/luci/;stok=${this.stok}/${apiPath.replace(/^\//, '')}`;
    
    let res = await this.sendHttpRequest(urlPath, method, postData);
    let data = res.data;

    // 如果未鉴权或 token 失效，重新登录一次
    if (!data || data.code === 401 || data.code === 1001 || (data.msg && data.msg.includes('Invalid token'))) {
      this.stok = null;
      await this.login();
      const retryPath = `/cgi-bin/luci/;stok=${this.stok}/${apiPath.replace(/^\//, '')}`;
      res = await this.sendHttpRequest(retryPath, method, postData);
      data = res.data;
    }

    return data;
  }

  /**
   * 获取所有连接设备列表
   */
  async getDeviceList() {
    const data = await this.requestApi('api/misystem/devicelist', 'GET');
    if (!data || data.code !== 0) {
      throw new Error(`获取设备列表失败: ${data ? (data.msg || data.code) : '网络异常'}`);
    }
    return data.list || [];
  }

  /**
   * 标准化 MAC 地址（转为大写、冒号分隔）
   */
  formatMac(mac) {
    if (!mac) return '';
    return mac.toUpperCase().replace(/[-_]/g, ':');
  }

  /**
   * 查询指定设备的状态
   */
  async getDeviceStatus(targetMac) {
    const formattedMac = this.formatMac(targetMac);
    const devices = await this.getDeviceList();
    const found = devices.find(d => this.formatMac(d.mac) === formattedMac);
    if (!found) {
      return {
        found: false,
        mac: formattedMac,
        name: '未知/离线设备',
        online: false,
        wanAllowed: null
      };
    }

    const wanAllowed = found.authority ? (found.authority.wan === 1) : true;
    return {
      found: true,
      mac: found.mac,
      name: found.name || (found.ip && found.ip[0] ? found.ip[0].name : '未知设备'),
      ip: found.ip && found.ip[0] ? found.ip[0].ip : '',
      online: found.online !== undefined ? found.online === 1 : true,
      wanAllowed: wanAllowed,
      raw: found
    };
  }

  /**
   * 设置设备外网访问权限 (wan: 1=允许外网, 0=禁止外网断网)
   * 小米官方原生使用的是 GET /api/xqsystem/set_mac_filter?mac=...&wan=1/0
   * @param {string} targetMac 设备 MAC 地址
   * @param {boolean} allowWan 是否允许访问外网
   */
  async setDeviceWanAccess(targetMac, allowWan) {
    const formattedMac = this.formatMac(targetMac);
    const wanValue = allowWan ? 1 : 0;

    // 优先调用小米官方原生 set_mac_filter
    const queryPath = `api/xqsystem/set_mac_filter?mac=${encodeURIComponent(formattedMac)}&wan=${wanValue}`;
    const data = await this.requestApi(queryPath, 'GET');
    
    if (data && data.code === 0) {
      return { success: true, mac: formattedMac, allowWan, endpoint: 'api/xqsystem/set_mac_filter' };
    }

    // 备选降级方案
    const backupData = await this.requestApi('api/misystem/set_band_device', 'POST', `mac=${encodeURIComponent(formattedMac)}&wan=${wanValue}`);
    if (backupData && backupData.code === 0) {
      return { success: true, mac: formattedMac, allowWan, endpoint: 'api/misystem/set_band_device' };
    }

    throw new Error(`设置设备 ${formattedMac} 外网权限失败: ${data ? data.msg || data.code : '路由器未返回正确状态'}`);
  }

  /**
   * 禁用指定设备的外网访问 (断网)
   */
  async blockDevice(targetMac) {
    return this.setDeviceWanAccess(targetMac, false);
  }

  /**
   * 恢复指定设备的外网访问 (联网)
   */
  async unblockDevice(targetMac) {
    return this.setDeviceWanAccess(targetMac, true);
  }
}

module.exports = MiWiFiClient;
