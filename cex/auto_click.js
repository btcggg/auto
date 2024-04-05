
let sleep_time =1000
let add_count_max = 50

let add_count = 0

function click_it() {

  // https://www.bitget.com/zh-CN/asset/rechargeAddress?title=BTC-BTC&coinId=1&chainCoinId=0
  document.querySelector("#__layout > div > div.main-box.lay-box.clearfix > div > div > div > div:nth-child(2) > div.flex.justify-between.items-center > div > button.bit-button.bit-button--main.bit-button--medium.is-round").click()

  add_count++;
  if (add_count > add_count_max) {
    clearInterval(intervalId);
  }
  console.log(add_count);
}

const intervalId = setInterval(click_it, sleep_time);