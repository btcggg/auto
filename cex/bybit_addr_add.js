/*
okx 充币地址快速添加
by wx\tw: gggxin


1.进入批量添加入口,点击新增提币地址,比如添加Eth的提现
https://www.bybit.com/user/assets/money-address/batch

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
let curr_group  =  10;

// let g_form_type  =  "normal";
// 填写普通表单:normal 或包含memo内容的表单:memo
let g_form_type  =  "normal";  // normal , memo

// 指定提币网络, 如果不需要就填 false
let default_network = "SUI";
// let default_network = false;


// 以下备注、地址修改成自己要添加的钱包地址信息, "地址名称" : "地址"
let wallet_address = {

    "备注1": "地址1",
    "备注2": "地址2",
    "备注3": "地址3"

  };

// okx 每次只能加50个地址
let one_group_count = 5;

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
  document.querySelector("#dynamic_form_nest_item > button").click()
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
// targetButton.dispatchEvent(comm_clickEvent);

/*

// 获取需要点击的元素
var element = document.getElementById('yourElementId');

// 创建一个鼠标点击事件
var tmp_clickEvent = new MouseEvent('click', {
  'view': window,
  'bubbles': true,
  'cancelable': true
});

// 触发点击事件
element.dispatchEvent(tmp_clickEvent);


 */


function comm_input_value(elmObj,value) {

    elmObj.focus();
    //模拟粘贴操作
    elmObj.setSelectionRange(0,elmObj.value.length)
    document.execCommand('delete', null, false);
    document.execCommand('inserttext', false, value);
    console.log("input value:" + value)

}



function comm_keypress_value(elmObj,pressKey,isClear=true) {

    elmObj.focus();
    if(isClear){
      //模拟粘贴操作
      elmObj.setSelectionRange(0,elmObj.value.length)
      document.execCommand('delete', null, false);
    }
    tmp_event = new KeyboardEvent("keypress", { pressKey });
    elmObj.dispatchEvent(tmp_event);

    // for (let i = 0; i < value.length; i++) {
    //   tmp_key = value[i];
    //   tmp_event = new KeyboardEvent("keypress", { tmp_key });
    //   elmObj.dispatchEvent(tmp_event);
    // }


  // 使用示例
  // const inputElement = document.getElementById("myInput");
  // const textToType = "TON";
  // comm_keypress_value(inputElement, textToType);

    // document.execCommand('inserttext', false, value);
    console.log("keypress value:" + pressKey)

}


function comm_mouse_left_click(targetElement) {

    const mouseDownEvent = new MouseEvent("mousedown", {
      bubbles: true,
      cancelable: true,
      view: window,
      button: 0, // 鼠标左键
    });
    targetElement.dispatchEvent(mouseDownEvent);

  // 使用示例
  // const inputElement = document.getElementById("myInput");
  // comm_mouse_left_click(inputElement);

}


// tmp_obj.focus();
// tmp_obj.dispatchEvent(event_keydown);



// !--------- comm.js


//  自动添加地址

let tmp_sleep_time = sleep_time * (add_count+2);


console.log("tmp_sleep_time:"+tmp_sleep_time);

function input_values(){ 

  console.log("start input_values");
  chain_table_inputs = document.querySelector("#dynamic_form_nest_item");

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

  let start_sleep_time = 1;

  for(; wallet_address_index <= add_count; wallet_address_index++){

    row_index = wallet_address_index + 1

    console.log("start select row_index "+row_index)


      start_sleep_time +=    g_interval_time;    

  // network_select = chain_table_inputs.querySelector("tr:nth-child("+index+") > td:nth-child(4) > div > div > div > div > div > div.balance_okui-select-value-box ");
    if(default_network){
      select_network(row_index, default_network,start_sleep_time);
      start_sleep_time += g_interval_time*3;
    }

  }

  wallet_address_index = 0;
  for(; wallet_address_index <= add_count; wallet_address_index++){

    input_row_index = wallet_address_index + 1;

    console.log("start input row_index "+input_row_index);

      start_sleep_time +=    g_interval_time;    

  setTimeout(function(input_row_index,wallet_address_index){

    //  document.querySelector("#dynamic_form_nest_item_data_1_remark")
    // document.querySelector("#dynamic_form_nest_item_data_0_remark")
    // document.querySelector("#dynamic_form_nest_item_data_0_address")
      address_input = document.querySelector("#dynamic_form_nest_item_data_"+(input_row_index-1)+"_address");

      remark_input = document.querySelector("#dynamic_form_nest_item_data_"+(input_row_index-1)+"_remark");


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


    }.bind(null, input_row_index,wallet_address_index), start_sleep_time);

  }


  start_sleep_time += 3

  setTimeout(function(){
    alert("大佬, 都准备好了,请确认后点保存下筷. \n by @gggxin");


  }, start_sleep_time);
}



// 得到转账网络元素
function getNetworksInputElm(row_index) {


    network_select = chain_table_inputs.querySelector("div:nth-child("+(row_index*2)+") > div:nth-child(2) > div > div > div.ant-col.ant-form-item-control.css-5megei > div > div >div >div ");

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
    comm_mouse_left_click(tmp_select_obj);

    // document.execCommand('insertText', false, input_value);



    console.log('select_network sleep_time: '+start_sleep_time+' , row_index: '+row_index +" , "+input_value);

  }, start_sleep_time);


  start_sleep_time += g_interval_time;


  setTimeout(function(){

    // document.querySelector("body > div:nth-child(7) > div > div > div > span > input")
    // document.querySelector("body > div:nth-child(8) > div > div > div > span > input")
    // document.querySelector("body > div:nth-child(9) > div > div > div > span > span.ant-input-suffix")

    var check_search =  document.querySelector("body > div:nth-child(6) > div > div > div > span > input");
    var tmp_skip_index = 5;

    if(!check_search){
      tmp_skip_index = 6;
    }

    // 2 , document.querySelector("body > div:nth-child(8) > div > div > div > span > input")
    var search_input = document.querySelector("body > div:nth-child("+(row_index+tmp_skip_index)+") > div > div > div > span > input")

    comm_input_value(search_input, input_value);

    search_input.dispatchEvent(event_keydown);

  }, start_sleep_time);


  start_sleep_time += g_interval_time + 500;

  setTimeout(function(){

    var option_row_index = row_index+5;
    if(row_index > 2)
        option_row_index = row_index+6;

    // var search_input = document.querySelector("body > div:nth-child("+(row_index+5)+") > div > div > div > span > input")

    // comm_input_value(search_input, input_value);

    var options = document.querySelectorAll("body > div:nth-child("+(option_row_index)+") > div > div > div > div.rc-virtual-list > div.rc-virtual-list-holder > div > div > div")

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





