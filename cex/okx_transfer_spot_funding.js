/*
okx 采用资金划转借币(借币转出)
注意借币风险率, 一般是只借50%的资产, 小币种更要留足保证金, 不要借多.

by wx\tw: gggxin


1.进入资金划转界面
https://www.okx.com/cn/balance/transfer

2. 先选好资产、从交易账户到资金账户

3. 在界面上填上借币数量, 借币转出不用钩

4. 下面的代码设置重试借次数、每次重度间隔几秒

4. 打开开发者⼯具, 复制该文件所有代码, 在chome 控制台里运行
  - 打开chrome 右上角的三个点, 选更多工具->开发者工具 , 切换到console

5. 静待花开

 */


// 重试借多少次
let g_try_times  =  3;

// 每次重度间隔几秒
let g_sleep_time = 3;



// ----------- 以下代码不要修改

g_sleep_time = g_sleep_time * 1000

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



function comm_input_value(elmObj,value) {

    elmObj.focus();
    //模拟粘贴操作
    elmObj.setSelectionRange(0,elmObj.value.length)
    document.execCommand('delete', null, false);
    document.execCommand('inserttext', false, value);
    console.log("input value:" + value)

}


// -------

function do_task() {

  g_try_times--;
  if (g_try_times < 0) {
    clearInterval(g_intervalId);
    alert("大佬, 活干完了,看看结果怎么样? ");
    console.log("finished");
    return false
  }

  let curr_elm_obj = document.querySelector("#root > div > div > div.balance-bottom > div > div.TabPaneContainer_tabPaneContainer__6aTJC > div.TransferContainer_content__cmQGc > div > div:nth-child(3) > div.okui-input.okui-input-md > div.okui-input-box > input.okui-input-input");
  comm_input_value(curr_elm_obj,g_amount)


  // 刷新可借余额
  curr_elm_obj = document.querySelector("#root > div > div > div.balance-bottom > div > div.TabPaneContainer_tabPaneContainer__6aTJC > div.TransferContainer_content__cmQGc > div > div.transfer-direction-con > div.transfer-direction-icon > span > i")

  curr_elm_obj.click();
  curr_elm_obj.click();
    
  // 打开借币转出

  curr_elm_obj = document.querySelector("#root > div > div > div.balance-bottom > div > div.TabPaneContainer_tabPaneContainer__6aTJC > div.TransferContainer_content__cmQGc > div > div:nth-child(3) > div.transfer-all-in > div > div.transfer-all-right > label > span > input")
  if(!curr_elm_obj.checked){
    curr_elm_obj.click();
  }

  // 点确认
  curr_elm_obj = document.querySelector("#root > div > div > div.balance-bottom > div > div.TabPaneContainer_tabPaneContainer__6aTJC > div.TransferContainer_content__cmQGc > div > div.page-transfer-button > button");
  curr_elm_obj.click()

  console.log(g_try_times+", amount:"+g_amount);



}

let g_intervalId = false;
// 每次借几个币
let g_amount  =  parseFloat(document.querySelector("#root > div > div > div.balance-bottom > div > div.TabPaneContainer_tabPaneContainer__6aTJC > div.TransferContainer_content__cmQGc > div > div:nth-child(3) > div.okui-input.okui-input-md > div.okui-input-box > input.okui-input-input").value);
if(!g_amount){
    alert("请先输入要借的数量");

}else{

  g_intervalId = setInterval(do_task, g_sleep_time);

}


