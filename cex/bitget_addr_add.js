/**

bitget 充币地址快速添加脚本

by wx\tw: gggxin


1. 批量添加 入口:
https://www.bitget.com/zh-CN/asset/batchAdd?batchType=1

2. 先选好 类型、 币种、转账⽹

3. 修改 wallet_address 里的 "备注1": "地址1" 信息

内容可以通过以下网站转换
https://csvjson.com/csv2json

4. 打开开发者⼯具, 复制该文件所有代码, 在chome 控制台里运行

5. 静待花开

 */

// 以下备注、地址修改成自己要添加的钱包地址信息
let wallet_address = {
    "备注1": "地址1",
    "备注2": "地址2",
    "备注3": "地址3",

};

let wallet_address_keys = Object.keys(wallet_address);
let wallet_count = wallet_address_keys.length;
// // 试用
// if(wallet_count > 10){
//   wallet_count = 10;
// }  
let add_count = wallet_count-1;

// let add_count = 12;
let sleep_time =900
let chain_table_inputs = undefined;



function DepositAddressBook_add() {

  // document.querySelector("#__layout .batch-adress-wrap .asset-address-box > div:nth-child(3) .chain-table > .table-footer .delete-btn").click();
  document.querySelector("#__layout   div.main-box.lay-box.clearfix > div > div.asset-address-box.asset-common > div:nth-child(3) > div > div.chain-table div.left > button").click();

  add_count--;
  if (add_count === 0) {
    clearInterval(intervalId);
  }
  console.log(add_count);
}

const intervalId = setInterval(DepositAddressBook_add, sleep_time);

// bitget 自动添加地址
// let address_inputs = document.querySelectorAll("div.chain-table >  div.other-row > div.column4 > div > input");
// let remark_inputs = document.querySelectorAll("div.chain-table >  div.other-row > div.column6 > div > input");

tmp_sleep_time = sleep_time * (wallet_count+2);
console.log("tmp_sleep_time:"+tmp_sleep_time);

function input_values(){ 

  console.log("start input_values");
  chain_table_inputs = document.querySelectorAll("div.chain-table >  div.other-row");

  for(var index=0; index< chain_table_inputs.length; index++){

    address_input = chain_table_inputs[index].querySelector("div.column4 > div > input");
    remark_input = chain_table_inputs[index].querySelector("div.column6 > div > input");

    remark_input.value = wallet_address_keys[index]; 
    remark_input.dispatchEvent(new Event('input'));
    // remark_input.click()

    address_input.value = wallet_address[wallet_address_keys[index]];
    address_input.dispatchEvent(new Event('input'));
    // address_input.click()

    console.log(wallet_address_keys[index]);
  }
  alert("大佬, 都准备好了,请确认后点保存下筷. ");

}

setTimeout("input_values()", tmp_sleep_time);