#!/usr/bin/env node

/**
 * 小米路由器设备外网控制 CLI 工具
 * 用法:
 *   node cli.js devices          # 扫描并列出路由器所有在线/离线设备及 MAC
 *   node cli.js status           # 查看 config.json 中目标设备的外网权限状态
 *   node cli.js block [mac]      # 手动禁用目标设备的外网访问 (断网)
 *   node cli.js unblock [mac]    # 手动恢复目标设备的外网访问 (恢复上网)
 *   node cli.js daemon           # 启动内置定时调度器 (每天 22:30 断网, 06:30 恢复，支持配置热更新)
 *   node cli.js stop             # 停止正在后台运行的 daemon 调度器
 */

const fs = require('fs');
const path = require('path');
const MiWiFiClient = require('./miwifi_api');

const PID_FILE = path.resolve(__dirname, '.daemon.pid');

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] ? args[0].toLowerCase().replace(/^--?/, '') : 'help';
  const paramMac = args[1];

  let config;
  try {
    config = MiWiFiClient.loadConfig();
  } catch (err) {
    console.error(`❌ 配置加载失败: ${err.message}`);
    process.exit(1);
  }

  const client = new MiWiFiClient(config);

  const getTargetMacs = (onlyEnabled = true) => {
    if (paramMac) return [{ name: '指定设备', mac: paramMac, enabled: true }];
    if (config.targets && config.targets.length > 0) {
      return config.targets.filter(t => {
        if (!t.mac || t.mac === 'AA:BB:CC:DD:EE:FF') return false;
        if (onlyEnabled && t.enabled === false) return false;
        return true;
      });
    }
    return [];
  };

  try {
    switch (command) {
      case 'devices':
      case 'list': {
        console.log(`🔍 正在连接路由器 (${config.routerIp}) 获取设备列表...`);
        const list = await client.getDeviceList();
        console.log(`\n📋 路由器当前设备列表 (共 ${list.length} 个):`);
        console.log('----------------------------------------------------------------------');
        console.log(`| ${'设备名称'.padEnd(24)} | ${'MAC 地址'.padEnd(18)} | ${'IP 地址'.padEnd(15)} | ${'外网权限'.padEnd(8)} |`);
        console.log('----------------------------------------------------------------------');
        for (const d of list) {
          const name = (d.name || (d.ip && d.ip[0] ? d.ip[0].name : '未知设备')).slice(0, 22);
          const mac = d.mac || '-';
          const ip = (d.ip && d.ip[0] ? d.ip[0].ip : '-').padEnd(15);
          const wanStatus = d.authority && d.authority.wan === 0 ? '⛔ 已断外网' : '✅ 正常外网';
          console.log(`| ${name.padEnd(24)} | ${mac.padEnd(18)} | ${ip} | ${wanStatus} |`);
        }
        console.log('----------------------------------------------------------------------');
        console.log(`💡 提示: 请将需要管控的设备 MAC 地址复制并填入 tools/miwifi/config.json 的 targets 中。\n`);
        break;
      }

      case 'status': {
        const targets = getTargetMacs(false); // 查看状态时展示全部配置设备
        if (targets.length === 0) {
          console.log(`⚠️ 请先在 config.json 中配置 targets 的 MAC 地址，或直接传入 MAC: node cli.js status <MAC>`);
          return;
        }
        console.log(`🔍 正在检查已配置设备的联网与策略状态...`);
        const globalSchedule = config.schedule || { blockTime: '22:30', unblockTime: '06:30' };
        for (const t of targets) {
          const status = await client.getDeviceStatus(t.mac);
          const statusDesc = status.wanAllowed === false ? '⛔ 已禁用外网权限 (断网中)' : '✅ 外网权限正常 (可上网)';
          const enableDesc = t.enabled === false ? '⏸️ [策略已停用]' : '▶️ [策略已启用]';
          const bTime = t.blockTime || globalSchedule.blockTime || '22:30';
          const uTime = t.unblockTime || globalSchedule.unblockTime || '06:30';
          const timeTag = (t.blockTime || t.unblockTime) ? '🎯 定制时间' : '🌐 全局时间';

          console.log(`\n📱 设备: ${t.name || status.name} (${status.mac})  ${enableDesc}`);
          console.log(`   - IP 地址: ${status.ip || '离线/未知'}`);
          console.log(`   - 外网权限: ${statusDesc}`);
          console.log(`   - 定时策略: ${bTime} 断网 ~ ${uTime} 恢复 (${timeTag})`);
        }
        break;
      }

      case 'block': {
        const targets = getTargetMacs(true);
        if (targets.length === 0) {
          console.log(`⚠️ 没有处于【已启用】状态的管控目标设备。若需生效，请在 config.json 中设置 enabled: true`);
          return;
        }
        for (const t of targets) {
          console.log(`🔒 正在对设备 [${t.name || t.mac}] (${t.mac}) 执行【禁用外网】操作...`);
          await client.blockDevice(t.mac);
          console.log(`✅ [${t.name || t.mac}] 已成功禁用外网访问！`);
        }
        break;
      }

      case 'unblock': {
        const targets = getTargetMacs(true);
        if (targets.length === 0) {
          console.log(`⚠️ 没有处于【已启用】状态的管控目标设备。若需生效，请在 config.json 中设置 enabled: true`);
          return;
        }
        for (const t of targets) {
          console.log(`🔓 正在对设备 [${t.name || t.mac}] (${t.mac}) 执行【恢复外网】操作...`);
          await client.unblockDevice(t.mac);
          console.log(`✅ [${t.name || t.mac}] 已成功恢复外网访问！`);
        }
        break;
      }

      case 'daemon':
      case 'start': {
        const scheduler = require('./scheduler');
        scheduler.start();
        break;
      }

      case 'stop': {
        if (!fs.existsSync(PID_FILE)) {
          console.log('ℹ️ 未检测到运行中的 daemon 进程（PID 文件不存在）。');
          return;
        }
        const pidStr = fs.readFileSync(PID_FILE, 'utf8').trim();
        const pid = parseInt(pidStr, 10);
        if (isNaN(pid)) {
          console.log('⚠️ 无效的 PID 文件，已清理。');
          fs.unlinkSync(PID_FILE);
          return;
        }
        try {
          process.kill(pid, 'SIGTERM');
          console.log(`🛑 已成功发送停止信号给定时进程 (PID: ${pid})`);
          if (fs.existsSync(PID_FILE)) fs.unlinkSync(PID_FILE);
        } catch (e) {
          if (e.code === 'ESRCH') {
            console.log(`ℹ️ 进程 (PID: ${pid}) 已经不存在，已清理状态文件。`);
            if (fs.existsSync(PID_FILE)) fs.unlinkSync(PID_FILE);
          } else {
            console.error(`❌ 停止进程失败: ${e.message}`);
          }
        }
        break;
      }

      default: {
        console.log(`
📖 小米路由器定时断网控制工具

使用方法:
  node cli.js devices          扫描局域网连接设备及 MAC 地址
  node cli.js status           查询 config.json 中目标设备的当前联网状态
  node cli.js block [MAC]      立即禁用目标设备外网 (断网)
  node cli.js unblock [MAC]    立即恢复目标设备外网 (允许上网)
  node cli.js daemon           启动常驻定时器 (支持配置热更新)
  node cli.js stop             停止后台常驻定时器

配置文件位置:
  ${path.resolve(__dirname, 'config.json')}
        `);
      }
    }
  } catch (err) {
    console.error(`\n❌ 执行出错: ${err.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };
