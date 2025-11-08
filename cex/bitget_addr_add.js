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


// 50个钱包为1组,添加第几组, 比如添加第2组,就改成2
let curr_group  =  1;

// 以下备注、地址修改成自己要添加的钱包地址信息
let wallet_address = {

    "备注1": "地址1",
    "备注2": "地址2",
    "备注3": "地址3"


};

// 一次只能加几个地址
let one_group_count = 50;

let wallet_address_keys = Object.keys(wallet_address);
let wallet_count = wallet_address_keys.length;
// 试用
// if(wallet_count > 5){
//   wallet_count = 5;
// }  
let add_count = wallet_count-1;

if(add_count >= one_group_count){
  add_count = one_group_count - 1;
}

let group_start_index = (curr_group-1) * one_group_count;

// 处理当前组实际添加数量问题
// 30   - 20 
if((wallet_count - group_start_index ) < one_group_count){
  add_count = wallet_count - group_start_index -1;
}

let sleep_time =900
let chain_table_inputs = undefined;

add_max = add_count;



function comm_input_value(elmObj,value) {

    elmObj.focus();
    //模拟粘贴操作
    elmObj.setSelectionRange(0,elmObj.value.length)
    document.execCommand('delete', null, false);
    document.execCommand('inserttext', false, value);
    console.log("input value:" + value)

}
function DepositAddressBook_add() {


  if (add_count === 0) {
    clearInterval(intervalId);
    return;

  }
  add_count--;  
  // WithdrawBatchAddChainAddressAddRow

  const element = document.querySelector('[data-testid="WithdrawBatchAddChainAddressAddRow"]');

  element.click();

  console.log(add_count);
}

const intervalId = setInterval(DepositAddressBook_add, sleep_time);

// bitget 自动添加地址
// let address_inputs = document.querySelectorAll("div.chain-table >  div.other-row > div.column4 > div > input");
// let remark_inputs = document.querySelectorAll("div.chain-table >  div.other-row > div.column6 > div > input");

tmp_sleep_time = sleep_time * (add_max+2);
console.log("tmp_sleep_time:"+tmp_sleep_time);

function input_values(){ 

  console.log("start input_values");

  const address_inputs = document.querySelectorAll('[data-testid="WithdrawBatchAddChainAddressInput"]');
  const remark_inputs = document.querySelectorAll('[data-testid="WithdrawBatchAddChainAddressRemarksInput"]');


  for(var index=0; index< address_inputs.length; index++){

    address_input = address_inputs[index]
    remark_input = remark_inputs[index]



    comm_input_value(remark_input,wallet_address_keys[index+group_start_index])
    comm_input_value(address_input,wallet_address[wallet_address_keys[index+group_start_index]])

    console.log(wallet_address_keys[index+group_start_index]);
  }
  alert("大佬, 都准备好了,请确认后点保存下筷.\n by @gggxin");

}

setTimeout("input_values()", tmp_sleep_time);