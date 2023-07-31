/*
bitget 加充值地址
by wx\tw: gggxin


 */
// 一次增加几个
let add_count = 50;

// 以下不要修改
let sleep_time =900

const intervalId = setInterval(function(){

  document.querySelector("#__layout > div > div > div.main-box.lay-box.clearfix > div > div.asset-recharge-container > div.asset-recharge-box.asset-common.assetsv1-common-box > div.asset-content > div.asset-left > div:nth-child(4) > div.context-item.flexible > div.global-form-box.recharge-qrcode-box.w-full > div > div > div > div.relative > div.select-popup-box.bg-bg.rounded.mt-2.absolute.z-99.w-full.border.border-solid.border-inputBorder > div > div > div").click();
  add_count--;
  if (add_count === 0) {
    clearInterval(intervalId);
  }
  console.log(add_count);

}, sleep_time);
