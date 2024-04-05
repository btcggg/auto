/*
gate 充币地址快速添加
by wx\tw: gggxin


1.进入批量添加入口,点击新增提币地址,比如添加Eth的提现
https://www.gate.io/zh/myaccount/add_withdraw_address_list

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
let curr_group  =  1;


// 以下备注、地址修改成自己要添加的钱包地址信息, "地址名称" : "地址"
let wallet_address = {
    "备注1": "地址1",
    "备注2": "地址2",
    "备注3": "地址3"
  };

// 一次只能加几个地址
let one_group_count = 10;

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

  if (add_count === 0) {
    clearInterval(intervalId);
    return;

  }
  add_count--;  
  document.querySelector("body > div.layout > div.myaccount-wrap.new-myaccount-wrap.account-wallet-page-container > div > div.main_content.acc-m-con > div > div > div > div.newAddressBox > div.add_footer > div.toAddNewAddress").click();

  console.log(add_count);

}

const intervalId = setInterval(DepositAddressBook_add, sleep_time);


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


tmp_sleep_time = sleep_time * (add_max+2);
console.log("tmp_sleep_time:"+tmp_sleep_time);

function input_values(){ 

  console.log("start input_values");
  chain_table_inputs = document.querySelectorAll("body > div.layout > div.myaccount-wrap.new-myaccount-wrap.account-wallet-page-container > div > div.main_content.acc-m-con > div > div > div > div.newAddressBox > div.address_content.sel_coin_content > div.address_list_wrap > div.address_list_box.batch_list.batch_list_add > div");

  let default_address_list_name = ""
  let default_address_list_index = 0

  for(var index=0; index< chain_table_inputs.length; index++){

    address_list_input = chain_table_inputs[index].querySelector(".batch_address_list >  .batch_address_list_content > .address_list_name > input");

    if(0 == index){
      default_address_list_name = address_list_input.value

      search_dom_list = document.querySelectorAll("body > div.layout > div.myaccount-wrap.new-myaccount-wrap.account-wallet-page-container > div > div.main_content.acc-m-con > div > div > div > div.newAddressBox > div.address_content.sel_coin_content > div.sel-coin-list > div.sel-coin-scroll > ul > li");
      for(var search_dom_index=0; search_dom_index< search_dom_list.length; search_dom_index++){
        if(default_address_list_name == search_dom_list[search_dom_index].textContent.trim()){
          default_address_list_index = search_dom_index;
          console.log(default_address_list_name+" , find address_list_index:"+default_address_list_index);

          break;
        }
      }


    }
    else{
      search_coin_input = document.querySelector("body > div.layout > div.myaccount-wrap.new-myaccount-wrap.account-wallet-page-container > div > div.main_content.acc-m-con > div > div > div > div.newAddressBox > div.address_content.sel_coin_content > div.sel-coin-list > div.search-coin-icon-box > input");

      address_list_input.click()
      comm_input_value(search_coin_input, default_address_list_name);
      document.querySelector("body > div.layout > div.myaccount-wrap.new-myaccount-wrap.account-wallet-page-container > div > div.main_content.acc-m-con > div > div > div > div.newAddressBox > div.address_content.sel_coin_content > div.sel-coin-list > div.sel-coin-scroll > ul > li:nth-child("+(default_address_list_index+1)+")").click();
    }


    address_input = chain_table_inputs[index].querySelector(".batch_address_list >  .batch_address_list_content > .address_list_value > input");

    comm_input_value(address_input, wallet_address[wallet_address_keys[index+group_start_index]])


    remark_input = chain_table_inputs[index].querySelector(".batch_address_list >  .batch_address_list_content > .address_list_receiver > input");

    // remark_input.value = wallet_address_keys[index]; 
    // remark_input.dispatchEvent(new Event('input'));
    // remark_input.click()
    comm_input_value(remark_input, wallet_address_keys[index+group_start_index])

    console.log(wallet_address_keys[index+group_start_index]);

  }
  alert("大佬, 都准备好了,请确认后点保存下筷. ");

}

setTimeout("input_values()", tmp_sleep_time);