/*
交易所自动点击生成充值地址
支持 okx 、bitget 、 bybit

使用方法: 
1. 进入 充值地址管理界面
比如: 
bitget: https://www.bitget.com/zh-CN/asset/rechargeAddress?title=BTC-BTC&coinId=1&chainCoinId=0
okx: https://www.okx.com/zh-hans/balance/recharge-address/eth/2-2
bybit: https://www.bybit.com/user/assets/deposit/chain-address?c=ZK&a=ZKV2
gate: https://www.gate.io/zh/myaccount/deposit/USDT ,要先打开充值地址列表

2. 打开开发者⼯具, 复制该文件所有代码, 在chome 控制台里运行

3. 结束后会有弹窗提示
*/

hostname_split = location.hostname.split(".")

// let exchange_name = "bybit"
let exchange_name = hostname_split[hostname_split.length-2]

let add_count = 0

let add_config = {
  "okx" : {
    "click_selector":"#root > div > div > div.balance-bottom > div > div.DepositAddressBookContent_title__9WMaM > button"
    ,"add_max": 20
    ,"sleep_time": 2000
  }
  ,"bitget" : {
    "click_selector":"#__layout > div > div.main-box.lay-box.clearfix > div > div > div > div:nth-child(2) > div.flex.justify-between.items-center > div > button.bit-button.bit-button--main.bit-button--medium.is-round"
    ,"add_max": 50
    ,"sleep_time": 2000
  }
  ,"bybit" : {
    "click_selector":"#root > div > div._coin_chain_address_1r3hz_1 > div._coin_chain_address_main_1r3hz_4 > div._coin_chain_address_top_1r3hz_10 > button"
    ,"add_max": 20
    ,"sleep_time": 2000
}
  ,"gate" : {
    "click_selector":"body > div.layout > div.select_deposit_address_shade > div > div.select_deposit_address_box_btn > div.select_deposit_address_box_btn_submit"
    ,"add_max": 20
    ,"sleep_time": 5000

  }

}

let curr_config = add_config[exchange_name]
let add_count_max = curr_config['add_max']
let sleep_time = curr_config['sleep_time']

console.log(curr_config)
function click_it() {

  document.querySelector(curr_config['click_selector']).click()

  add_count++;
  if (add_count > add_count_max) {
    clearInterval(intervalId);
    alert("添加结束")
  }
  console.log(add_count);
}

const intervalId = setInterval(click_it, sleep_time);