
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

