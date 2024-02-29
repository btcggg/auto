
let sleep_time =3000
let add_count_max = 1000000

let add_count = 0

function click_it() {

  document.querySelector("#root > div > div.chakra-stack.css-14e7mdt > div.chakra-stack.css-i4ghpt > div.css-79elbk > div.css-1y1tdff > div > div.css-i6bazn > div.css-1xq42jv > div > div > div.css-1aoc199 > button").click()

  add_count++;
  if (add_count < add_count_max) {
    clearInterval(intervalId);
  }
  console.log(add_count);
}

const intervalId = setInterval(click_it, sleep_time);