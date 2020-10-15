/*
Surge4.2:

[Script]
Search = type=http-request,pattern=^https:\/\/duckduckgo.com\/\?q=,script-path=Search.js

[MITM]
hostname= duckduckgo.com
*/

const engineData = {
  "bd": "https://www.baidu.com/s?wd=%@",
  "db": "https://m.douban.com/search/?query=%@",
  "gh": "https://github.com/search?q=%@",
  "gl": "https://www.google.com/search?q=%@",
  "gm": "https://www.google.com/search?&tbm=isch&q=%@",
  "yd": "http://dict.youdao.com/search?q=%@",
  "ddg": "https://duckduckgo.com/?ia=about&q=%@",
  "wiki": "https://zh.wikipedia.org/wiki/%@",
  "tf": "https://www.google.com/search?as_q=%@&as_sitesearch=testflight.apple.com",
  "zh": "https://www.zhihu.com/search?type=content&q=%@",
  "wb": " https://s.weibo.com/weibo/%@",
  "wx": "https://weixin.sogou.com/weixinwap?query=%@",
  "tw": "https://twitter.com/search?q=%@",
  "zdm": "https://search.m.smzdm.com/?v=b&s=%@",
  "amz": "https://www.amazon.cn/gp/aw/s/?k=%@",
  "jd": "https://so.m.jd.com/ware/search.action?keyword=%@",
  "tm": "https://s.m.tmall.com/m/search.htm?q=%@",
  "ytb": "https://www.youtube.com/results?search_query=%@",
  "ph": "https://cn.pornhub.com/video/search?search=%@",
  "gd": "https://www.google.com/search?q=%22Google+Drive%22+%@",
  "tgd": "https://t.me/s/gdurl?q=%@",
  "@default": "gl"
}

let commands = Object.keys(engineData)
let url = $request.url
let keyword = url.match(/duckduckgo.com\/\?q=([^&]+)/)
if (keyword) {
  keyword = keyword[1]
  let patt = new RegExp(`^(${commands.join("|")})\\+`, "g")
  let command = keyword.match(patt)
  if (command) {

    url = engineData[command[0].replace(/\+/, "")].replace(/%@/, keyword.replace(command[0], ""))

  } else if (url.match(/\/\?q=https?:\/\/.+&t=iphone$/)) {
    url = decodeURIComponent(url.match(/\?q=(.+)&t=iphone/)[1])

  } else if (url.match(/\/\?q=.+(com|cn|net)&t=iphone$/)){

    url = `http://${url.match(/\?q=(.+)&t=iphone/)[1]}`

  } else {
    url = engineData[engineData["@default"]].replace(/%@/, keyword)
}
console.log('Return => 302\n\n' + url + '\n')
  $done({
    response: {
      status: 302,
      headers: {
        Location: url,
      }
    }
  })
} else {
  $done({})
}