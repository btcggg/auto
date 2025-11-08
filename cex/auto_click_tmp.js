/*
 自动点击

使用方法: 
1. 进入 操作的 界面
2. 打开开发者⼯具, 复制该文件所有代码, 在chome 控制台里运行

3. 结束后会有弹窗提示

*/

hostname_split = location.hostname.split(".")

let exchange_name = hostname_split[hostname_split.length-2]

let add_count = 0

// 几分钟尝试一次
let sleep_minute = 1;

let add_config = {
  "midnight" : {
    "click_selector":"body > div.h-screen.w-screen.flex.items-center.justify-center.bg-surface-z-0-GD > div > main > div > div:nth-child(3) > div > button"
    ,"add_max": 10000
    ,"sleep_time": sleep_minute * 1000 * 60 
    ,"test_content": 'Start session'
  }
}

let curr_config = add_config[exchange_name]
let add_count_max = curr_config['add_max']
let sleep_time = curr_config['sleep_time']
let test_content = curr_config['test_content']



console.log(curr_config)
function click_it() {

  curr_selector = document.querySelector(curr_config['click_selector']);

  if(!curr_selector || curr_selector.textContent != test_content){
    console.log("click_it curr_selector false, waiting...");
    return false;
  }

  curr_selector.click();

  add_count++;
  if (add_count > add_count_max) {
    clearInterval(intervalId);
    alert("点击结束 \n by @gggxin")
  }
  const now = new Date();
  console.log("当前时间:", now.toLocaleTimeString(),"次数:"+add_count);
  console.log(add_count);


}

click_it();
const intervalId = setInterval(click_it, sleep_time);