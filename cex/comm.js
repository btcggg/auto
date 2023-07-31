
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

