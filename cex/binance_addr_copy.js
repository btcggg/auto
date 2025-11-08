/*
binance 自动填地址

1. 打开地址添加页面, 快捷入口如下:  
https://www.binance.com/zh-CN/my/security/address-management/vip-batch-add

 
https://www.binance.com/zh-CN/my/security/address-management/vip-batch-add

2. 先选好 币种、 转账网络、地址来源

3. 打开 binance_addr_add_1.js , 修改 wallet_address 里的 "备注1": "地址1" 信息

内容可以通过以下网站转换
https://csvjson.com/csv2json

4. 打开开发者⼯具, 复制该文件所有代码, 在chome 控制台里运行

5. 根据提示, 打开 binance_addr_add_2.js , 复制该文件所有代码, 在chome 控制台里运行

6. 静待花开

 */

// 一次增加几个
let add_count = 20;

// 以下不要修改
let sleep_time =900

const intervalId = setInterval(function(){

  document.querySelector("#__APP > div.theme-root.dark > div > main > main > div > div > div > div > div > div.css-1k5gphu > div > div.css-1267ixm > div.css-1y2olgo").click();
  add_count--;
  if (add_count === 0) {
    clearInterval(intervalId);
  }
  console.log(add_count);

}, sleep_time);
