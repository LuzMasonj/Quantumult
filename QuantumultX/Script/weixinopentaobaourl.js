/**
 * @江湖中人
 * ^https?:\/\/weixin110\.qq\.com\/cgi-bin\/mmspamsupport-bin\/newredirectconfirmcgi url script-response-body https://raw.githubusercontent.com/LuzMasonj/Quantumult/master/QuantumultX/Script/weixinopentaobaourl.js
 */

 // 在微信中点击淘宝链接，quanx会弹出通知，点击通知自动跳转到淘宝中打开(只测试了quanx)
 
var str = ($response.body);
str = "{"+str.match(/cgiData = {(\S*)(};)/)[1]+"}"
var obj = JSON.parse(str);
if( "url"   in  obj ) 
{
	str = obj.url
}
else if( "desc"   in  obj ) 
{
	str = obj.desc
}
str = str.replace(/&#x2f;/g, '/');
str = str.replace(/&amp;/g, '&');
//console.log(str);
var option1={"open-url": "taobao://"}
if((str.indexOf("taobao.com") != -1 )||(str.indexOf("tb.cn") != -1 )||(str.indexOf("tmall.com") != -1 ))
{
	str = str.match(/\/\/(\S*)/)[1]
	option1["open-url"]="taobao://"+str
	$notify(``, "","点击打开淘宝", option1);
}
else
{
	option1["open-url"]=str
	$notify(``, "","点击用浏览器打开", option1);
}
console.log(option1["open-url"]+"\n\n")

$done({body: $response.body});
