/*
binance 自动填地址2 
使用说明查看 binance_addr_add_1.js 文件

 */



let start_sleep_time = 0;

let index = 1;

for(; index <= add_count; index++){

  // 填上地址、备注

  start_sleep_time +=  g_interval_time;    
  select_network(index,default_network,start_sleep_time);

  console.log(index+"/"+add_count);
}


setTimeout(
  function(){
      alert("大佬,久等了,大餐已准备好了,请先点击填写的第一个地址备注,然后按TAB键不动,直到游走到最后一条地址,再点完成键.");
  }
  , start_sleep_time + g_interval_time
);



console.log('finished');
