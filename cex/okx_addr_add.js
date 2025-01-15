/*
okx 充币地址快速添加
by wx\tw: gggxin


1.进入批量添加入口,点击新增提币地址,比如添加Eth的提现
https://www.okx.com/cn/balance/withdrawal-address/eth/2 

2. 先选好 提币网络

3. 修改 wallet_address 里的 "备注1": "地址1" ,”备注2“ .... 信息, 一次可以导入100+地址

内容可以通过以下网站转换
https://csvjson.com/csv2json
- 只选中 Transpose 、 Array 

4. 打开开发者⼯具, 复制该文件所有代码, 在chome 控制台里运行

5. 静待花开

6. 修改 curr_group = 2 ; 表示继续添加第二组

7. 回到第4步

 */

// 20个钱包为1组,添加第几组, 比如添加好第2组,就改成2
let curr_group  =  1;

// let g_form_type  =  "normal";
// 填写普通表单:normal 或包含memo内容的表单:memo
let g_form_type  =  "normal";  // normal , memo

// 指定提币网络, 如果不需要就填 false
// let default_network = "Bitcoin";
let default_network = false;


// 以下备注、地址修改成自己要添加的钱包地址信息, "地址名称" : "地址"
let wallet_address = {
    "备注1": "地址1",
    "备注2": "地址2",
    "备注3": "地址3"

  };

// okx 每次只能加50个地址
let one_group_count = 50;

// 每次填充间隔时间
let g_interval_time = 1500;

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

  // 继续添加地址
  document.querySelector("#root > div > div > div.balance-bottom > div > form > button").click()
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


// document.querySelector("#scroll-box > div > div > form > div:nth-child(6) > div > div > div > div > div:nth-child(3) > div.balance_okui-form-item-control > div > div > div > div > input.balance_okui-input-input")

// document.querySelector("#scroll-box > div > div > form > div:nth-child(6) > div > div > div > div > div:nth-child(8) > div.balance_okui-form-item-control > div > div > div > div > input.balance_okui-input-input")


// document.querySelector("#root > div > div > div.balance-bottom > div > form > div.addressListWrap > div > div > div > div.balance_okui-table-content > table > tbody > tr:nth-child(2) > td:nth-child(2) > div.balance_okui.AddressInput_addressInputWrap__dzvve.balance_okui-form-item-md.balance_okui-form-item.balance_okui-form-item-no-label.balance_okui-form-item-has-error > div > div.balance_okui-form-item-control-input > div > div > div.balance_okui-input-box > input.balance_okui-input-input")
// document.querySelector("#root > div > div > div.balance-bottom > div > form > div.addressListWrap > div > div > div > div.balance_okui-table-content > table > tbody > tr:nth-child(3) > td:nth-child(2) > div.balance_okui.AddressInput_addressInputWrap__dzvve.balance_okui-form-item-md.balance_okui-form-item.balance_okui-form-item-no-label > div > div > div > div > div > input.balance_okui-input-input")
// document.querySelector(" tr:nth-child(4) > td:nth-child(2) > div.balance_okui.AddressInput_addressInputWrap__dzvve.balance_okui-form-item-md.balance_okui-form-item.balance_okui-form-item-no-label > div > div > div > div > div > input.balance_okui-input-input")



  // chain_table_inputs = document.querySelector("#scroll-box > div > div > form > div:nth-child(6) > div > div > div > div");
  // chain_table_inputs = document.querySelector("#root > div > div > div.balance-bottom > div > form > div.addressListWrap > div > div > div > div.balance_okui-table-content > table > tbody ");
  chain_table_inputs = document.querySelector('#root > div > div > div.balance-bottom > div > form > div.addressListWrap > div > div > div > div.balance_okui-table-content > table > tbody ');


  // chain_table_inputs = document.querySelector("#scroll-box > .okui-dialog-container > div >form.okui-form >  div .withdraw-book-list")
  // chain_table_inputs = document.querySelector("#scroll-box > .okui-dialog-container > div >form.okui-form >  div .withdraw-book-list")

  /*
  
<div class="withdraw-book-list">

  3 , 5
  8 , 10
  13 , 15

   */
  let address_index = 2

  
  let remark_index = 2
  let next_index = 1

  if(g_form_type == "memo"){
    // 处理包含memo的字段
    remark_index = 6
    next_index = 6    
  }

  let wallet_address_index = 0;

// address_input = chain_table_inputs.querySelector("div:nth-child("+address_index+") > div.okui-form-item-control  input.okui-input-input");


// address_input.value = wallet_address[wallet_address_keys[index]];

  let start_sleep_time = 1;

  for(; wallet_address_index <= add_count; wallet_address_index++){

// document.querySelector(" > div:nth-child(3) > div.okui-form-item-control > div > div > div > div > input")    

    console.log("start: "+wallet_address_index+1)

    row_index = wallet_address_index + 2

// #root > div > div > div.balance-bottom > div > form > div.addressListWrap > div > div > div > div.balance_okui-table-content > table > tbody > tr:nth-child(2) > td:nth-child(4) > div
// #root > div > div > div.balance-bottom > div > form > div.addressListWrap > div > div > div > div.balance_okui-table-content > table > tbody > tr:nth-child(2) > td:nth-child(5) > div > div > div > div > div > div > input.balance_okui-input-input

      start_sleep_time +=    g_interval_time;    

  // network_select = chain_table_inputs.querySelector("tr:nth-child("+index+") > td:nth-child(4) > div > div > div > div > div > div.balance_okui-select-value-box ");
  if(default_network){
    select_network(row_index, default_network,start_sleep_time);
  }

//*[@id="root"]/div/div/div[2]/div/form/div[1]/div/div/div/div[2]/table/tbody/tr
//*[@id="root"]/div/div/div[2]/div/form/div[1]/div/div/div/div[2]/table/tbody/tr[2]/td[5]/div/div/div/div/div/div/input[2]


// #root > div > div > div.balance-bottom > div > form > div.addressListWrap > div > div > div > div.balance_okui-table-content > table > tbody

// #root > div > div > div.balance-bottom > div > form > div.addressListWrap > div > div > div > div.balance_okui-table-content > table > tbody > tr:nth-child(3) > td:nth-child(7) > div > div > div > div > div > div > input.balance_okui-input-input
// #root > div > div > div.balance-bottom > div > form > div.addressListWrap > div > div > div > div.balance_okui-table-content > table > tbody > tr:nth-child(3) > td:nth-child(5) > div > div > div > div > div > div > input.balance_okui-input-input
// #root > div > div > div.balance-bottom > div > form > div.addressListWrap > div > div > div > div.balance_okui-table-content > table > tbody > tr:nth-child(2) > td:nth-child(5) > div > div > div.balance_okui-form-item-control-input > div > div > div.balance_okui-input-box > input.balance_okui-input-input  
// #root > div > div > div.balance-bottom > div > form > div.addressListWrap > div > div > div > div.balance_okui-table-content > table > tbody > tr:nth-child(3) > td:nth-child(5) > div > div > div > div > div > div > input.balance_okui-input-input
    address_input = chain_table_inputs.querySelector("tr:nth-child("+row_index+") > td:nth-child(5) > div > div > div > div > div > div > input.balance_okui-input-input");

    // address_input = chain_table_inputs.querySelector("div:nth-child("+address_index+") > div.balance_okui-form-item-control > div > div > div > div > input.balance_okui-input-input");
    // address_input = chain_table_inputs.querySelector("div:nth-child("+address_index+") > div.okui-form-item-control  input.okui-input-input");

    // remark_input = chain_table_inputs.querySelector("div:nth-child("+remark_index+") > div.okui-form-item-control  input.okui-input-input");

// document.querySelector("#root > div > div > div.balance-bottom > div > form > div.addressListWrap > div > div > div > div.balance_okui-table-content > table > tbody > tr:nth-child(2) > td:nth-child(3) > div > div > div > div > div > div > input.balance_okui-input-input")

    remark_input = chain_table_inputs.querySelector("tr:nth-child("+row_index+") > td:nth-child(7) > div > div > div > div > div > div > input.balance_okui-input-input");
    // remark_input = chain_table_inputs.querySelector("div:nth-child("+(remark_index)+") > div.balance_okui-form-item-control > div > div > div > div > input.balance_okui-input-input");
    // remark_input = chain_table_inputs.querySelector("div:nth-child("+(remark_index)+") > div.okui-form-item-control > div > div > div > div > input.okui-input-input");

    if ( !remark_input){
      remark_input = chain_table_inputs.querySelector("div:nth-child("+row_index+") > div.okui-form-item-control  input.okui-input-input");

    }


    comm_input_value(address_input, wallet_address[wallet_address_keys[wallet_address_index+group_start_index]])

    // address_input.value = wallet_address[wallet_address_keys[index]];
    address_input.dispatchEvent(new Event('input'));
    // address_input.click()

    comm_input_value(remark_input, wallet_address_keys[wallet_address_index+group_start_index])

    // remark_input.value = wallet_address_keys[index]; 
    remark_input.dispatchEvent(new Event('input'));
    // remark_input.click()



    // address_index += next_index
    // remark_index += next_index
    console.log(wallet_address_keys[wallet_address_index+group_start_index]);
  }


  start_sleep_time += 3

  setTimeout(function(){
    alert("大佬, 都准备好了,请确认后点保存下筷. \n by @gggxin");


  }, start_sleep_time);
}



// 得到转账网络元素
function getNetworksInputElm(row_index) {

  // let tmp_elm = getRowElms()[row_index-1];

    network_select = chain_table_inputs.querySelector("tr:nth-child("+row_index+") > td:nth-child(4) > div > div > div > div > div > div.balance_okui-select-value-box ");

    return network_select
  // return  tmp_elm.querySelector("div:nth-child(4) > div > div > div > div  ");

}

// 转账网络

function select_network(row_index, input_value,start_sleep_time=0) {

  if(start_sleep_time == 0 ){
    start_sleep_time = (row_index - 1) *  g_interval_time ;
  }

  // let row_index = 2;
  // let coinName = "AAVE";


    let tmp_select_obj = "";

    let select_obj = "";

    let input_obj = "";


  setTimeout(function(){


    // var element = document.querySelector('.bn-select-option:contains("BSC")');


    tmp_select_obj = getNetworksInputElm(row_index)

    // 点击下拉框
    tmp_select_obj.click()


    console.log('select_network sleep_time: '+start_sleep_time+' , row_index: '+row_index +" , "+input_value);

  }, start_sleep_time);


  start_sleep_time += g_interval_time;

  setTimeout(function(){

    var options = document.querySelectorAll("#root > div > div > div.balance-bottom > div > form > div.addressListWrap > div > div > div > div.balance_okui-table-content > table > tbody > tr:nth-child("+row_index+") > td:nth-child(4) > div > div > div > div > div > div.balance_okui.balance_okui-popup.select-popup-reference > div > div > div > div > div > div.balance_okui-select-item-container.balance_okui-select-item-container-real > div")
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

setTimeout("input_values()", tmp_sleep_time);





