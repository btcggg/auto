/*
binance 自动添加提币白名单
by wx\tw: gggxin

操作步骤:

1. 打开地址添加页面, 快捷入口如下:  
https://www.binance.com/zh-CN/my/security/address-management/vip-batch-add

2. 打开本文件: binance_addr_add_1.js , 修改 wallet_address 里的 "备注1": "地址1" 信息
内容可以通过以下网站转换
https://csvjson.com/csv2json

再配置好默认币种: default_coin 和 默认网络:default_network
如添加后50个钱包,把curr_group改成 2或 3...

3. 打开chrome开发者⼯具, 复制该文件所有代码, 在chome 控制台里运行

4. 静待花开


 */


// 50个钱包为1组,添加第几组, 比如添加好第2组,就成2
let curr_group  =  1;

// 通用地址,ETH,BTC 
let default_coin = "通用地址";

// BTC,BSC,ETH,ARBITRUM,BASE,MANTA,OPTIMISM,ZKSYNCERA
let default_network = "BTC";



let wallet_address = {

    "ggg_ok_A01_01": "0xA6cBb1e75d42b3abAE7c419E5ce5ceB2B0b2CEE7"
    ,"ggg_ok_A01_02": "0x3220a03b9fc4C74Ca42494D1552d0844025f5EDb"
    ,"ggg_ok_A01_03": "0x54458887d8ec8bF4780D025c863B8d5422106811"
    ,"ggg_ok_A01_04": "0xA54967B49679AD2332368bb28E65215400E9103d"
    ,"ggg_ok_A01_05": "0xb3Ae5c4943170Fd5159d5eA13B6C52c6E4a0831e"
    ,"ggg_ok_A01_06": "0xf9BB33c43D852206728Db4EEf0c1D708aB48Ab49"

};


//  一次最多添加几个地址,
let one_group_count = 50;




// 以下代码不要修改

// 每次填充间隔时间
let g_interval_time = 3000;

var wallet_address_keys = Object.keys(wallet_address);
let wallet_count = wallet_address_keys.length;
let add_count = wallet_count;

if(add_count >= one_group_count){
  add_count = one_group_count ;
}

let group_start_index = (curr_group-1) * one_group_count;


if((wallet_count - group_start_index ) < one_group_count){
  add_count = wallet_count - group_start_index ;
}

let sleep_time =2500
let chain_table_inputs = undefined;

// 点几次添加按钮
// let g_add_max = add_count - 1;

// const g_intervalId = setInterval(DepositAddressBook_add, sleep_time);


// --------- comm.js

// setTimeout(function(){fn()}, tmp_sleep_time);


// 模拟回车
const event_keydown_obj = document.createEvent('Event');
event_keydown_obj.initEvent('keydown', true, false);
//注意这块触发的是keydown事件，在awx的ui源码中bind监控的是keypress事件，所以这块要改成keypress
event_keydown = Object.assign(event_keydown_obj, {
  ctrlKey: false,
  metaKey: false,
  altKey: false,
  which: 13,
  keyCode: 13,
  key: 'Enter',
  code: 'Enter'
});



const comm_clickEvent = new MouseEvent('click');
// targetButton.dispatchEvent(clickEvent);




function comm_input_value(elmObj,value) {

    elmObj.focus();
    //模拟粘贴操作
    elmObj.setSelectionRange(0,elmObj.value.length)
    document.execCommand('delete', null, false);
    document.execCommand('inserttext', false, value);

}

// tmp_obj.focus();
// tmp_obj.dispatchEvent(event_keydown);





// -------- binance_comm.js


// 币安公共库
// 点击添加按钮
function DepositAddressBook_add_click(start_sleep_time) {

  setTimeout(function(){

   document.querySelector("#__APP > div > div > div > div.bn-flex.flex-1.flex-col > div.mica-sticky > div.child > div > button").click();

  }, start_sleep_time );

}

// function DepositAddressBook_add() {
// document.querySelector("#__APP > div.css-tq0shg > main > main > div > div > div > div > div > div.css-1k5gphu > div > button").click();
//   g_add_max--;
//   if (g_add_max === 0) {
//     clearInterval(g_intervalId);
//   }
//   console.log(g_add_max);
// }


function whitelist_switch() {
  document.querySelector("#__APP > div > div > div > div.flex.w-full.flex-col.justify-between.gap-2xs.py-m.desktop\\:flex-row.desktop\\:items-center.desktop\\:gap-2xl.desktop\\:py-l > div.bn-flex.items-center > div").click()
}






// 填入地址备注
function remark_input(curr_row,start_sleep_time = 0 ) {


  if(start_sleep_time == 0 ){
    start_sleep_time = (curr_row - 1) * 4 * g_interval_time +   g_interval_time*3;    
  }

  let remark_input = "";

    console.log('remark_input sleep_time: '+start_sleep_time+' , curr_row: '+curr_row );

  setTimeout(function(){

    let remark_input = getRemarkInputElm(curr_row);

    comm_input_value(remark_input, wallet_address_keys[curr_row - 1+group_start_index]);

    remark_input.dispatchEvent(comm_clickEvent);

    // remark_input.focus();
    // //模拟粘贴操作
    // remark_input.setSelectionRange(0,remark_input.value.length)
    // document.execCommand('delete', null, false);
    // document.execCommand('inserttext', false, wallet_address_keys[curr_row - 1+group_start_index]);

    remark_input.click();

  }, start_sleep_time );


}



// 选择币种
function select_coin(curr_row, input_value , start_sleep_time=0) {

  // let start_sleep_time = (curr_row - 1) * 6 * g_interval_time +  g_interval_time;

  if(start_sleep_time == 0 ){
    // 操作一行要停4次
    start_sleep_time = (curr_row - 1) * 4 * g_interval_time;
  }

  // let tmp_sleep_time = 1000 * curr_row;
  // let curr_row = 1;
  // let coinName = "AAVE";
  let curr_count = curr_row;

  console.log('select_coin sleep_time: '+start_sleep_time+' , curr_row: '+curr_row +" , "+input_value);

  // 点击币种
  let select_obj = "";

  let input_obj  = "";

  setTimeout(function(){

    // 点击币种
    select_obj = get_selected_coin_elm(curr_row);

    // input_obj  = document.querySelector("#__APP > div.css-tq0shg > main > main > div > div > div > div > div > div.css-1k5gphu > div > div:nth-child("+curr_row+") > div:nth-child(2) > div > div > div.bn-sdd-dropdown > div > div > input")


    select_obj.click();


  }, start_sleep_time );



  start_sleep_time += g_interval_time;

  setTimeout(function(){


    var options = document.querySelectorAll("#__APP > div > div > div > div.bn-flex.flex-1.flex-col > div.flex-1 > div:nth-child("+curr_row+") > div:nth-child(2) > div > div > div.bn-trans.data-show.bn-tooltips-trans > div > div > div > div.bn-select-overlay-options > div");

    // 遍历所有元素,找到文本内容为"BSC"的元素
    for (var i = 0; i < options.length; i++) {
      console.log(options[i].innerText)
      if (options[i].innerText == input_value) {
        console.log('选中的元素:', options[i]);
        options[i].click();
        break;
      }
    }



  }, start_sleep_time);



}




// 填入地址
function address_input(curr_row,start_sleep_time = 0 ) {


  if(start_sleep_time == 0 ){
    start_sleep_time = (curr_row - 1) * 4 * g_interval_time +   g_interval_time*3;    
  }

  
    console.log('address_input sleep_time: '+start_sleep_time+' , curr_row: '+curr_row );
  let address_input = "";

  setTimeout(function(){

    address_input = getAddressInputElm(curr_row);

    address_input.focus();

    //模拟粘贴操作
    document.execCommand('delete');
    document.execCommand('inserttext', false, wallet_address[wallet_address_keys[curr_row - 1 +group_start_index]]);

    // address_input.value = wallet_address[wallet_address_keys[index]];
    address_input.dispatchEvent(new Event('input'));
    address_input.click();

  }, start_sleep_time );


}




// 转账网络

function select_network(curr_row, input_value,start_sleep_time=0) {

  if(start_sleep_time == 0 ){
    start_sleep_time = (curr_row - 1) *  g_interval_time ;
  }

  // let curr_row = 2;
  // let coinName = "AAVE";


    let tmp_select_obj = "";

    let select_obj = "";

    let input_obj = "";


  setTimeout(function(){


    // var element = document.querySelector('.bn-select-option:contains("BSC")');


    tmp_select_obj = getNetworksInputElm(curr_row)

    // 点击下拉框
    tmp_select_obj.click()


    console.log('select_network sleep_time: '+start_sleep_time+' , curr_row: '+curr_row +" , "+input_value);

  }, start_sleep_time);


  start_sleep_time += g_interval_time;

  setTimeout(function(){


    // 获取所有class为"bn-select-option icon"的元素
    var options = document.querySelectorAll('#__APP > div > div > div > div.bn-flex.flex-1.flex-col > div.flex-1 > div:nth-child('+curr_row+') > div:nth-child(4) > div > div > div.bn-trans.data-show.bn-tooltips-trans > div > div > div > div > div.bn-select-option');

    // 遍历所有元素,找到文本内容为"BSC"的元素
    for (var i = 0; i < options.length; i++) {
      console.log(options[i].innerText)
      if (options[i].innerText == input_value) {
        console.log('选中的元素:', options[i]);
        options[i].click();
        break;
      }
    }



  }, start_sleep_time);

}




// ----------



function get_selected_coin_elm(curr_row) {



  let select_obj = document.querySelector("#__APP > div > div > div > div.bn-flex.flex-1.flex-col > div.flex-1 > div:nth-child("+curr_row+") > div:nth-child(2) > div > div > div > div");

  return select_obj;
}

function get_selected_network(curr_row) {

  let select_obj = document.querySelector("#__APP > div.css-tq0shg > main > main > div > div > div > div > div > div.css-1k5gphu > div > div:nth-child("+curr_row+") > div:nth-child(4) > div > div > div.css-dna0ir > input");

  return select_obj;
}



function get_select_address_source(curr_row) {

  let select_obj = document.querySelector("#__APP > div.css-tq0shg > main > main > div > div > div > div > div > div.css-1k5gphu > div > div:nth-child("+curr_row+") > div.css-fqmqly > div > div");


  return select_obj;
}



function select_address_source(curr_row, input_value, start_sleep_time = 0 ) {

  if(start_sleep_time == 0 ){
    // 操作一行要停4次  , 这是第二次    
    start_sleep_time = (curr_row - 1) * 4 * g_interval_time +   g_interval_time*2;    
  }

  // let curr_row = 2;
  // let coinName = "AAVE";

  console.log('select_address_source sleep_time: '+start_sleep_time+' , curr_row: '+curr_row +" , "+input_value);


// document.querySelector("#origin-selection-input > div > div > div")
  let tmp_select_obj = "";


  setTimeout(function(){

    tmp_select_obj = get_select_address_source(curr_row);
    // 点地址来源,弹出窗口
    tmp_select_obj.querySelector("#origin-selection-input").click()

  }, start_sleep_time);


// document.querySelector("#origin-selection-input")

// 选钱包地址
  start_sleep_time += g_interval_time;
  setTimeout(function(){

  // return document.querySelectorAll("#__APP > div.css-tq0shg > main > main > div > div > div > div > div > div.css-1k5gphu > div > div")

    // document.querySelector("body > div.css-1u2pn8e > div.css-1pd8kmg > div > div.css-4vj3ly > div.css-1iqe90x > div.css-dov8ww > div.css-8rgr1u").click();

    document.querySelector("body > div.css-1u2pn8e > div.css-1pd8kmg > div > div.css-4vj3ly > div.css-1iqe90x > div.css-dov8ww > div:nth-child(2)").click();
    // 选钱包 MetaMask
    if(document.querySelector("#exchange-platform-option-"+input_value)){
      document.querySelector("#exchange-platform-option-"+input_value).click()      
    }
    

    // 确定
    document.querySelector("#origin-selection-ok").click()

  }, start_sleep_time);


}


// 得到所有行元素
function getRowElms() {

  return document.querySelectorAll("#__APP > div > div > div > div.bn-flex.flex-1.flex-col > div.flex-1  > div")

}

// 得到地址备注元素
function getRemarkInputElm(curr_row) {

  let tmp_elm = getRowElms()[curr_row-1];
  // let select_obj = document.querySelector("#__APP > div.css-tq0shg > main > main > div > div > div > div > div > div.css-1k5gphu > div > div:nth-child("+curr_row+") > div:nth-child(4) > div > div > div.css-dna0ir > input");

  // document.querySelector("#__APP > div > div > div > div.bn-flex.flex-1.flex-col > div.flex-1 > div:nth-child(1) > div.w-\\[15\\%\\] > div > div > input")

  return  tmp_elm.querySelector("div:nth-child(1) > div > div > input");
}


// 得到币种元素
function getCoinInputElm(curr_row) {

  let tmp_elm = getRowElms()[curr_row-1];

  return  tmp_elm.querySelector("div:nth-child(2) > div > div ");

}





// 得到地址来源元素
function getAddressInputElm(curr_row) {

  let tmp_elm = getRowElms()[curr_row-1];

  return  tmp_elm.querySelector("div:nth-child(3) > div > div > input ");

  // return tmp_elm.querySelector("div.css-64chtr > div > div > input");
  // return tmp_elm.querySelector("div:nth-child(3)   > div > div > input");
}



// 得到转账网络元素
function getNetworksInputElm(curr_row) {

  // let tmp_elm = getRowElms()[curr_row-1];

  // return  tmp_elm.querySelector("div:nth-child(4) > div > div > div > div  ");
  return  document.querySelector("#__APP > div > div > div > div.bn-flex.flex-1.flex-col > div.flex-1 > div:nth-child("+curr_row+") > div:nth-child(4) > div > div > div > div");

}


// 得到备注元素
function getMemoInputElm(curr_row) {

  let tmp_elm = getRowElms()[curr_row-1];

  return  tmp_elm.querySelector("div:nth-child(5) > div > div > input  ");

}





// !---- binance_comm.js

whitelist_switch();



console.log("default_network: "+default_network)



// 选择币种、转账网络、地址来源
function select_values(default_coin){ 

  console.log("start select_values");

  // let  sleep_t

  let start_sleep_time = 1;

  let index = 1;
  // let index = 20;

  for(; index <= add_count; index++){


    // 填上地址、备注
    if(index < add_count){
      start_sleep_time +=  ( g_interval_time / 2);    

      DepositAddressBook_add_click(start_sleep_time);
    }



    start_sleep_time +=  g_interval_time;    
    select_coin(index, default_coin, start_sleep_time);


    // 填上地址、备注
    start_sleep_time +=  g_interval_time;    
    remark_input(index, start_sleep_time);



    start_sleep_time +=    g_interval_time;    
    select_network(index, default_network,start_sleep_time)

    start_sleep_time += g_interval_time
    address_input(index , start_sleep_time);


    // select_address_source(index,default_address_source, start_sleep_time);


    console.log(wallet_address_keys[index+group_start_index]);
  }

  // 补错
  // start_sleep_time +=    g_interval_time;    
  // select_address_source(add_count,default_address_source, start_sleep_time);



setTimeout(
  function(){
      alert("大佬, 如果出现红框不能提交,请按点击选中第一个地址备注,然后长按tab键,就可快速消除红框. ");
  }
  , start_sleep_time + g_interval_time
);

/*
  start_sleep_time = 1000;
  index = 1
  select_address_source(index,default_address_source, start_sleep_time);

  index = 2
  start_sleep_time = start_sleep_time * 3;

  select_address_source(index,default_address_source, start_sleep_time);


  index = 3
  start_sleep_time = start_sleep_time * 3;

  select_address_source(index,default_address_source, start_sleep_time);



 */

  // alert("大佬, 都准备好了,请确认后点保存下筷. ");

}



// let tmp_sleep_time = sleep_time * (add_count+1);
let tmp_sleep_time = sleep_time ;

console.log("tmp_sleep_time:"+tmp_sleep_time);


setTimeout(
  function(){select_values(default_coin)}
  , tmp_sleep_time
);



// select_network(2,"")
// alert("大佬, 都准备好了,请确认后点保存下筷. ");
