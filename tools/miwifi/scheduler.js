/**
 * 小米路由器定时调度器 (Daemon 模式)
 * 支持每个设备独立配置 blockTime 和 unblockTime，未配置时继承全局 schedule 时间
 * 支持 config.json 热重载 (修改配置即时自动更新所有设备计时器)
 */

const fs = require('fs');
const path = require('path');
const MiWiFiClient = require('./miwifi_api');

let activeTimers = []; // 存储所有设备的定时器句柄
let activeClient = null;

function getNextTriggerDelay(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0, 0);

  if (next.getTime() <= now.getTime()) {
    // 如果今天的时间点已过，定为明天同一时间
    next.setDate(next.getDate() + 1);
  }

  return {
    delayMs: next.getTime() - now.getTime(),
    targetDate: next
  };
}

function formatDate(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

async function executeSingleDeviceAction(client, target, action, maxRetries = 3) {
  let success = false;
  let attempts = 0;
  while (!success && attempts < maxRetries) {
    attempts++;
    try {
      if (action === 'block') {
        console.log(`[${formatDate(new Date())}] 🔒 [尝试 ${attempts}] 正在禁用设备 [${target.name || target.mac}] (${target.mac}) 外网访问...`);
        await client.blockDevice(target.mac);
        console.log(`[${formatDate(new Date())}] ✅ [${target.name || target.mac}] 外网已成功断开！`);
      } else {
        console.log(`[${formatDate(new Date())}] 🔓 [尝试 ${attempts}] 正在恢复设备 [${target.name || target.mac}] (${target.mac}) 外网访问...`);
        await client.unblockDevice(target.mac);
        console.log(`[${formatDate(new Date())}] ✅ [${target.name || target.mac}] 外网已成功恢复！`);
      }
      success = true;
    } catch (err) {
      console.error(`[${formatDate(new Date())}] ⚠️ 操作失败: ${err.message}`);
      if (attempts < maxRetries) {
        console.log(`将在 10 秒后重试...`);
        await new Promise(r => setTimeout(r, 10000));
      }
    }
  }
}

function clearAllTimers() {
  activeTimers.forEach(t => clearTimeout(t));
  activeTimers = [];
}

function getEffectiveSchedule(target, globalSchedule = {}) {
  const blockTime = target.blockTime || globalSchedule.blockTime || '22:30';
  const unblockTime = target.unblockTime || globalSchedule.unblockTime || '06:30';
  return { blockTime, unblockTime };
}

function scheduleTasks() {
  clearAllTimers();

  let config;
  try {
    config = MiWiFiClient.loadConfig();
  } catch (e) {
    console.error(`[${formatDate(new Date())}] ❌ 读取配置文件失败: ${e.message}`);
    return;
  }

  activeClient = new MiWiFiClient(config);

  const globalSchedule = config.schedule || { blockTime: '22:30', unblockTime: '06:30' };
  const allTargets = config.targets || [];
  const validTargets = allTargets.filter(t => t.mac && t.mac !== 'AA:BB:CC:DD:EE:FF' && t.enabled !== false);
  const disabledTargets = allTargets.filter(t => t.mac && t.mac !== 'AA:BB:CC:DD:EE:FF' && t.enabled === false);

  console.log('----------------------------------------------------');
  console.log(`[${formatDate(new Date())}] 📋 当前生效配置与调度计划:`);
  console.log(`📍 路由器 IP: ${config.routerIp}`);
  console.log(`⏰ 全局默认策略: 每天【${globalSchedule.blockTime || '22:30'}】断网，【${globalSchedule.unblockTime || '06:30'}】恢复`);
  console.log(`📱 管控设备清单 (${validTargets.length} 个启用, ${disabledTargets.length} 个停用):`);

  if (validTargets.length === 0) {
    console.log(`   (当前没有启用的管控设备)`);
  }

  validTargets.forEach(t => {
    const { blockTime, unblockTime } = getEffectiveSchedule(t, globalSchedule);
    const hasCustomTime = t.blockTime || t.unblockTime ? '🎯 [单独定制时间]' : '🌐 [继承全局时间]';
    const { delayMs: bDelay, targetDate: bDate } = getNextTriggerDelay(blockTime);
    const { delayMs: uDelay, targetDate: uDate } = getNextTriggerDelay(unblockTime);

    console.log(`   - ▶️ ${t.name || '设备'} (${t.mac}) ${hasCustomTime}`);
    console.log(`       断网时间: ${blockTime} -> 下次: ${formatDate(bDate)} (约 ${(bDelay / 60000).toFixed(1)} 分钟后)`);
    console.log(`       恢复时间: ${unblockTime} -> 下次: ${formatDate(uDate)} (约 ${(uDelay / 60000).toFixed(1)} 分钟后)`);

    // 为该设备调度独立的 block 定时器
    const blockTimer = setTimeout(async () => {
      try {
        const latestConfig = MiWiFiClient.loadConfig();
        const latestTarget = (latestConfig.targets || []).find(item => item.mac.toUpperCase() === t.mac.toUpperCase());
        if (latestTarget && latestTarget.enabled !== false) {
          await executeSingleDeviceAction(activeClient, latestTarget, 'block');
        }
      } catch (err) {
        console.error(`[${formatDate(new Date())}] 设备 [${t.name}] 定时断网执行异常: ${err.message}`);
      } finally {
        scheduleTasks(); // 重新计算所有调度
      }
    }, bDelay);
    activeTimers.push(blockTimer);

    // 为该设备调度独立的 unblock 定时器
    const unblockTimer = setTimeout(async () => {
      try {
        const latestConfig = MiWiFiClient.loadConfig();
        const latestTarget = (latestConfig.targets || []).find(item => item.mac.toUpperCase() === t.mac.toUpperCase());
        if (latestTarget && latestTarget.enabled !== false) {
          await executeSingleDeviceAction(activeClient, latestTarget, 'unblock');
        }
      } catch (err) {
        console.error(`[${formatDate(new Date())}] 设备 [${t.name}] 定时恢复执行异常: ${err.message}`);
      } finally {
        scheduleTasks(); // 重新计算所有调度
      }
    }, uDelay);
    activeTimers.push(unblockTimer);
  });

  if (disabledTargets.length > 0) {
    console.log(`⏸️ 已停用设备 (${disabledTargets.length} 个，已忽略):`);
    disabledTargets.forEach(t => console.log(`   - ⏸️ ${t.name || '设备'}: ${t.mac}`));
  }

  console.log('----------------------------------------------------\n');
}

function watchConfigFile() {
  const configPath = path.resolve(__dirname, 'config.json');
  let debounceTimer = null;

  fs.watch(configPath, (eventType) => {
    if (eventType === 'change' || eventType === 'rename') {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        console.log(`\n[${formatDate(new Date())}] 🔄 检测到 config.json 已修改，正在重新计算每个设备专属调度时间...`);
        scheduleTasks();
      }, 500);
    }
  });
}

const PID_FILE = path.resolve(__dirname, '.daemon.pid');

function recordPid() {
  fs.writeFileSync(PID_FILE, String(process.pid), 'utf8');
}

function cleanupPid() {
  try {
    if (fs.existsSync(PID_FILE)) {
      fs.unlinkSync(PID_FILE);
    }
  } catch (e) {}
}

function start() {
  recordPid();

  console.log('====================================================');
  console.log(`🚀 小米路由器定时断网服务已启动 (PID: ${process.pid})`);
  console.log(`💡 支持单设备定制断网/联网时间段`);
  console.log(`💡 支持配置文件热重载: 随时修改 config.json 都会即时自动更新`);
  console.log(`💡 停止运行方式: 终端按 Ctrl+C 或执行 node cli.js stop`);
  console.log('====================================================\n');

  scheduleTasks();
  watchConfigFile();

  // 优雅退出处理
  const handleExit = (signal) => {
    console.log(`\n[${formatDate(new Date())}] 🛑 接收到 ${signal} 信号，正在停止定时服务...`);
    clearAllTimers();
    cleanupPid();
    process.exit(0);
  };

  process.on('SIGINT', () => handleExit('SIGINT (Ctrl+C)'));
  process.on('SIGTERM', () => handleExit('SIGTERM'));
  process.on('exit', cleanupPid);
}

if (require.main === module) {
  start();
}

module.exports = { start, getEffectiveSchedule };
