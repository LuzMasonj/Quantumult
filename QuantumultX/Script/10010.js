const chavy = init()
const cookieName = '中国联通'
const KEY_loginurl = 'chavy_tokenurl_10010'
const KEY_loginheader = 'chavy_tokenheader_10010'
const KEY_signurl = 'chavy_signurl_10010'
const KEY_signheader = 'chavy_signheader_10010'
const KEY_loginlotteryurl = 'chavy_loginlotteryurl_10010'
const KEY_loginlotteryheader = 'chavy_loginlotteryheader_10010'
const KEY_findlotteryurl = 'chavy_findlotteryurl_10010'
const KEY_findlotteryheader = 'chavy_findlotteryheader_10010'

const signinfo = {}
let VAL_loginurl = chavy.getdata(KEY_loginurl)
let VAL_loginheader = chavy.getdata(KEY_loginheader)
let VAL_signurl = chavy.getdata(KEY_signurl)
let VAL_signheader = chavy.getdata(KEY_signheader)
let VAL_loginlotteryurl = chavy.getdata(KEY_loginlotteryurl)
let VAL_loginlotteryheader = chavy.getdata(KEY_loginlotteryheader)
let VAL_findlotteryurl = chavy.getdata(KEY_findlotteryurl)
let VAL_findlotteryheader = chavy.getdata(KEY_findlotteryheader)

;(sign = async () => {
    chavy.log(`🔔 ${cookieName}`)
    await loginapp()
    await signapp()
    showmsg()
    chavy.done()
})().catch((e) => chavy.log(`❌ ${cookieName} 签到失败: ${e}`), chavy.done())

function loginapp() {
    return new Promise((resolve, reject) => {
        const url = { url: VAL_loginurl, headers: JSON.parse(VAL_loginheader) }
        chavy.post(url, (error, response, data) => {
            try {
                resolve()
            } catch (e) {
                chavy.msg(cookieName, `登录结果: 失败`, `说明: ${e}`)
                chavy.log(`❌ ${cookieName} loginapp - 登录失败: ${e}`)
                chavy.log(`❌ ${cookieName} loginapp - response: ${JSON.stringify(response)}`)
                resolve()
            }
        })
    })
}

function signapp() {
    return new Promise((resolve, reject) => {
        if (VAL_signurl.endsWith('.do')) VAL_signurl = VAL_signurl.replace('.do', '')
        const url = { url: 'https://act.10010.com/SigninApp/signin/daySign', headers: JSON.parse(VAL_signheader) }
        chavy.post(url, (error, response, data) => {
            try {
                signinfo.signapp = JSON.parse(data)
                resolve()
            } catch (e) {
                chavy.msg(cookieName, `签到结果: 失败`, `说明: ${e}`)
                chavy.log(`❌ ${cookieName} signapp - 签到失败: ${e}`)
                chavy.log(`❌ ${cookieName} signapp - response: ${JSON.stringify(response)}`)
                resolve()
            }
        })
    })
}

function gettel() {
    const reqheaders = JSON.parse(VAL_signheader)
    const reqreferer = reqheaders.Referer
    const reqCookie = reqheaders.Cookie
    let tel = ''
    if (reqreferer.indexOf(`desmobile=`) >= 0) tel = reqreferer.match(/desmobile=(.*?)(&|$)/)[1]
    if (tel == '' && reqCookie.indexOf(`u_account=`) >= 0) tel = reqCookie.match(/u_account=(.*?);/)[1]
    return tel
}


function showmsg() {
    let subTitle = ''
    let detail = ''

    // 签到结果
    if (signinfo.signapp.signinMedal) {
        subTitle = `签到: 成功`
        detail = `积分: +${signinfo.signapp.prizeCount}, 成长值: +${signinfo.signapp.growthV}, 鲜花: +${signinfo.signapp.flowerCount}`
    } else if (signinfo.signapp.msg == '用户今日已签到！') {
        subTitle = `签到: 重复`
    } else {
        subTitle = `签到: 失败`
        chavy.log(`❌ ${cookieName} signapp - response: ${JSON.stringify(signinfo.signapp)}`)
    }

    chavy.msg(cookieName, subTitle, detail)
}

function init() {
    isSurge = () => {
        return undefined === this.$httpClient ? false : true
    }
    isQuanX = () => {
        return undefined === this.$task ? false : true
    }
    getdata = (key) => {
        if (isSurge()) return $persistentStore.read(key)
        if (isQuanX()) return $prefs.valueForKey(key)
    }
    setdata = (key, val) => {
        if (isSurge()) return $persistentStore.write(key, val)
        if (isQuanX()) return $prefs.setValueForKey(key, val)
    }
    msg = (title, subtitle, body) => {
        if (isSurge()) $notification.post(title, subtitle, body)
        if (isQuanX()) $notify(title, subtitle, body)
    }
    log = (message) => console.log(message)
    get = (url, cb) => {
        if (url['headers'] != undefined) {
            delete url['headers']['Content-Length']
            console.log(url['headers'])
        }
        if (isSurge()) {
            $httpClient.get(url, cb)
        }
        if (isQuanX()) {
            url.method = 'GET'
            $task.fetch(url).then((resp) => cb(null, resp, resp.body))
        }
    }
    post = (url, cb) => {
        if (url['headers'] != undefined) {
            delete url['headers']['Content-Length']
            console.log(url['headers'])
        }
        if (isSurge()) {
            $httpClient.post(url, cb)
        }
        if (isQuanX()) {
            url.method = 'POST'
            $task.fetch(url).then((resp) => cb(null, resp, resp.body))
        }
    }
    done = (value = {}) => {
        $done(value)
    }
    return { isSurge, isQuanX, msg, log, getdata, setdata, get, post, done }
}
