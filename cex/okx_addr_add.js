/*
okx 充币地址快速添加
by wx\tw: gggxin


1.进入批量添加入口,点击新增提币地址,比如添加Eth的提现
https://www.okx.com/cn/balance/withdrawal-address/eth/2 

2. 先选好 提币网络

3. 修改 wallet_address 里的 "备注1": "地址1" ,”备注2“ .... 信息, 一次可以导入100+地址

内容可以通过以下网站转换
https://csvjson.com/csv2json

4. 打开开发者⼯具, 复制该文件所有代码, 在chome 控制台里运行

5. 静待花开

6. 修改 curr_group = 2 ; 表示继续添加第二组

7. 回到第4步

 */

// 20个钱包为1组,添加第几组, 比如添加好第2组,就改成2
let curr_group  =  5;

// let g_form_type  =  "normal";
// 填写普通表单:normal 或包含memo内容的表单:memo
let g_form_type  =  "normal";  // normal , memo


// 以下备注、地址修改成自己要添加的钱包地址信息, "地址名称" : "地址"
let wallet_address = {
    "备注1": "地址1",
    "备注2": "地址2",
    "备注3": "地址3"


  };

// okx 第次只能加20个地址
let one_group_count = 20;

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
function DepositAddressBook_add() {
document.querySelector("div.okui-form-item-control div.okui-form-item-control-input-content > div.withdraw-book-list div.add-address-form-btn").click();
  add_max--;
  if (add_max === 0) {
    clearInterval(intervalId);
  }
  console.log(add_max);
}

const intervalId = setInterval(DepositAddressBook_add, sleep_time);

// --------
// 
// 
// 

// --------- comm.js


function comm_input_value(elmObj,value) {

    elmObj.focus();
    //模拟粘贴操作
    elmObj.setSelectionRange(0,elmObj.value.length)
    document.execCommand('delete', null, false);
    document.execCommand('inserttext', false, value);
    console.log("input value:" + value)

}

// !--------- comm.js


//  自动添加地址

let tmp_sleep_time = sleep_time * (add_count+2);


console.log("tmp_sleep_time:"+tmp_sleep_time);

function input_values(){ 

  console.log("start input_values");

  chain_table_inputs = document.querySelector("#scroll-box > .okui-dialog-container > div >form.okui-form >  div .withdraw-book-list")

  /*
  
<div class="withdraw-book-list">

  3 , 5
  8 , 10
  13 , 15

   */
  let address_index = 3

  
  let remark_index = 5
  let next_index = 5

  if(g_form_type == "memo"){
    // 处理包含memo的字段
    remark_index = 6
    next_index = 6    
  }

  var index=0;

// address_input = chain_table_inputs.querySelector("div:nth-child("+address_index+") > div.okui-form-item-control  input.okui-input-input");


// address_input.value = wallet_address[wallet_address_keys[index]];


  for(; index <= add_count; index++){

// document.querySelector(" > div:nth-child(3) > div.okui-form-item-control > div > div > div > div > input")    



    address_input = chain_table_inputs.querySelector("div:nth-child("+address_index+") > div.okui-form-item-control  input.okui-input-input");

    // remark_input = chain_table_inputs.querySelector("div:nth-child("+remark_index+") > div.okui-form-item-control  input.okui-input-input");

    remark_input = chain_table_inputs.querySelector("div:nth-child("+(remark_index)+") > div.okui-form-item-control > div > div > div > div > input.okui-input-input");

    if ( !remark_input){
      remark_input = chain_table_inputs.querySelector("div:nth-child("+remark_index+") > div.okui-form-item-control  input.okui-input-input");

    }


    comm_input_value(address_input, wallet_address[wallet_address_keys[index+group_start_index]])

    // address_input.value = wallet_address[wallet_address_keys[index]];
    address_input.dispatchEvent(new Event('input'));
    // address_input.click()

    comm_input_value(remark_input, wallet_address_keys[index+group_start_index])

    // remark_input.value = wallet_address_keys[index]; 
    remark_input.dispatchEvent(new Event('input'));
    // remark_input.click()



    address_index += next_index
    remark_index += next_index
    console.log(wallet_address_keys[index+group_start_index]);
  }
  alert("大佬, 都准备好了,请确认后点保存下筷. ");

}

setTimeout("input_values()", tmp_sleep_time);





