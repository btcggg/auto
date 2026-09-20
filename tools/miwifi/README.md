# 小米路由器设备定时断网控制工具 (MiWiFi Controller)

基于小米路由器（MiWiFi / OpenWrt 固件）Web API 接口，实现针对指定设备的**定时外网权限控制**（每天晚上 22:30 自动断网，早上 06:30 自动恢复联网）。

---

## 📁 目录结构

```text
tools/miwifi/
├── config.json         # 配置文件 (路由器IP、密码、目标MAC、定时规则)
├── miwifi_api.js       # 小米路由器核心 API (认证登录、设备列表、外网开关)
├── cli.js              # 命令行工具 (查询设备、查看状态、手动断网/联网)
├── scheduler.js        # 常驻定时任务调度器 (自动按时间触发)
└── README.md           # 使用说明文档
```

---

## ⚙️ 1. 快速配置

编辑 `tools/miwifi/config.json`：

```json
{
  "routerIp": "192.168.10.1",
  "password": "你的小米路由器管理员密码",
  "targets": [
    {
      "name": "孩子手机",
      "mac": "AA:BB:CC:DD:EE:F1",
      "enabled": true
    },
    {
      "name": "平板电脑",
      "mac": "AA:BB:CC:DD:EE:F2",
      "enabled": false
    }
  ],
  "schedule": {
    "enabled": true,
    "blockTime": "22:30",
    "unblockTime": "06:30"
  }
}
```

* **`enabled: true`**：启用管控，定时到点或执行 block/unblock 时自动对该设备生效。
* **`enabled: false`**：停用管控，脚本会直接**忽略**该设备，不会对其断网或恢复。

> **💡 不知道设备的 MAC 地址？**
> 先填好 `password`，然后直接运行下方的“扫描设备”命令，工具会自动列出所有连接设备的名称与 MAC 地址。

---

## 🛠️ 2. CLI 常用命令

进入工具目录后执行：

```bash
cd ~/www/bitggg_auto/tools/miwifi
```

### 1) 扫描所有在线设备与 MAC 地址
```bash
node cli.js devices
```
输出示例：
```text
📋 路由器当前设备列表 (共 12 个):
----------------------------------------------------------------------
| 设备名称                 | MAC 地址           | IP 地址         | 外网权限 |
----------------------------------------------------------------------
| iPad-Pro                 | 44:D8:84:11:22:33  | 192.168.31.105  | ✅ 正常外网 |
| Xiaomi-Phone             | 28:6C:07:AA:BB:CC  | 192.168.31.120  | ⛔ 已断外网 |
----------------------------------------------------------------------
```

### 2) 查询已配置目标设备的联网状态
```bash
node cli.js status
```

### 3) 手动断开/恢复目标设备外网
```bash
# 针对 config.json 中配置的目标设备
node cli.js block      # 立即断网
node cli.js unblock    # 立即恢复上网

# 或者针对任意指定的 MAC 地址
node cli.js block 44:D8:84:11:22:33
node cli.js unblock 44:D8:84:11:22:33
```

---

### 方案 A：使用内置守护进程 (推荐最简单)

直接启动内置调度器，服务会自动计算倒计时并在每天 **22:30** 断网、**06:30** 恢复：

```bash
# 启动常驻调度器
node cli.js daemon

# 或在后台静默运行
nohup node scheduler.js > miwifi.log 2>&1 &
```

> **🔥 动态热重载特性**：
> 守护进程在后台运行时，若你修改了 `config.json`（无论是增加/删除设备 MAC，还是调整 `blockTime`/`unblockTime` 时间），**无需重启，脚本会自动检测并实时生效**！

#### 如何退出/停止后台服务？
* **前台运行**：直接在终端按下 `Ctrl + C` 即可退出。
* **后台运行**：在任意终端进入 `tools/miwifi` 执行：
  ```bash
  node cli.js stop
  ```
* **使用 pm2 托管时**：
  ```bash
  pm2 stop miwifi-schedule
  ```

---

### 方案 B：使用系统原生 Crontab

在 Mac 或 Linux 系统中输入 `crontab -e`，添加以下两行规则：

```cron
# 每天晚上 22:30 自动断开指定设备外网
30 22 * * * /usr/local/bin/node ~/www/bitggg_auto/tools/miwifi/cli.js block >> ~/www/bitggg_auto/tools/miwifi/cron.log 2>&1

# 每天早上 06:30 自动恢复指定设备外网
30 6 * * * /usr/local/bin/node ~/www/bitggg_auto/tools/miwifi/cli.js unblock >> ~/www/bitggg_auto/tools/miwifi/cron.log 2>&1
```
*(注：请通过 `which node` 确认你本机的 node 实际绝对路径)*

---

## 🔒 隐私与安全性
- 配置文件 `config.json` 包含路由器管理密码，建议避免提交至公开 Git 仓库。
- 采用 SHA1 动态加盐哈希认证，与小米官方 Web 端登录逻辑保持一致。
