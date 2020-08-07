const KEY_mobile = 'mobile_10010'
let VAL_mobile = KEY_mobile
//上行引号内填入联通号码，使用前请登陆一次联通支付宝小程序
//有问题请通过Telegram反馈 https://t.me/Leped_Bot
var remainTime = "-";
var remainFee = "-";
var remainFlow = "-";
var queryTime = "-";

function get_basic(tel) {
    console.log("get_basic")
    let basicurl = {
        url: "https://mina.10010.com/wxapplet/bind/getIndexData/alipay/alipaymini?user_id=" + VAL_mobile,
        headers: {},
    };
    $task.fetch(basicurl).then(response => {
        console.log(response.body)
        var obj = JSON.parse(response.body);
        remainFee = obj.dataList[0].number;
        remainFlow = obj.dataList[1].number;
        remainTime = obj.dataList[2].number;
        queryTime = obj.flush_date_time;
        $notify("中国联通10010", "剩余语音 " + remainTime + "分钟", " 已用流量 " + remainFlow + "GB" + "\n话费余额 " + remainFee + "元");
    }, reason => {
    $notify("10010", tel + '登录失败', reason.error);
    });
}
//$notify("中国联通10010", "截止至 " + queryTime, "剩余语音 " + remainTime + "分钟" + " 已用流量 " + remainFlow + "GB" + "\n话费余额 " + remainFee + "元");
    

get_basic(tel)
