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
    let tmp_array = []
    for (var i = 0; i < options.length; i++) {
      console.log(options[i].innerText)
      tmp_array.push(options[i].innerText)
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


