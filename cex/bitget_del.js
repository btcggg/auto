/*
bitget 删除白名单脚本
wx\tw: gggxin


先打开删除入口:
https://www.bitget.com/zh-CN/asset/address?addressType=1

以下代码请在chome 控制台里运行

 */
// 总计删除几页, 一页10条, 30页即300个地址, 请修改
let do_times = 30;


//------- 以下内容不要修改
let g_interval_time =1500
let start_sleep_time = 300;

function do_action(do_times) {

  let index = 1;

  for(; index <= do_times; index++){


    setTimeout(function(){

      // 全选
      document.querySelector("#__layout > div > div > div.main-box.lay-box.clearfix > div > div > div.withdraw-address-container.assetsv1-common-box > div.account-common-table > div.pc-show > ul > li.list-title.list-header > div > div:nth-child(1) > label > span > input").click();

      // 删除地址
      document.querySelector("#__layout > div > div > div.main-box.lay-box.clearfix > div > div > div.withdraw-address-container.assetsv1-common-box > div.adderss-bottom-wrap > div > div > button:nth-child(3)").click();


    }, start_sleep_time );


    start_sleep_time +=  g_interval_time;    

    setTimeout(function(){


      // 确定删除
      document.querySelector("#__layout > div > div > div.main-box.lay-box.clearfix > div > div > div.withdraw-address-container.assetsv1-common-box > div.el-dialog__wrapper.verify-box > div > div.el-dialog__footer > div > button.operation-btn.box-border.rounded.cursor-pointer.w-full.flex.items-center.justify-center.space-x-2.rtl\\:space-x-reverse.px-4.h-40px.text-fs12.border-0.bg-primary.text-whiteText.hover\\:bg-primaryHoverBg.active\\:bg-primaryPressedBg").click();

    }, start_sleep_time );


    start_sleep_time +=  g_interval_time;    

    setTimeout(function(){

      // 下一页
      document.querySelector("#__layout > div > div > div.main-box.lay-box.clearfix > div > div > div.withdraw-address-container.assetsv1-common-box > div.account-common-table > div.pc-show > div > a.common-page.next").click();


    }, start_sleep_time );

    start_sleep_time +=  g_interval_time;    

  }

}

do_action(do_times);

setTimeout(
  function(){
      alert("大佬,房间已打扫干净!");
  }
  , start_sleep_time+g_interval_time
);


