const chavy = init()
const cookieName = '中国联通'
const KEY_loginurl = 'chavy_tokenurl_10010'
const KEY_loginheader = 'chavy_tokenheader_10010'
const KEY_signheader = 'chavy_signheader_10010'

const signinfo = {}
let VAL_loginurl = chavy.getdata(KEY_loginurl)
let VAL_loginheader = chavy.getdata(KEY_loginheader)
let VAL_signheader = chavy.getdata(KEY_signheader)


;(sign = async () => {
    chavy.log(`🔔 ${cookieName}`)
    await loginapp()
    await getinfo()
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

function gettel() {
    const reqheaders = JSON.parse(VAL_signheader)
    const reqreferer = reqheaders.Referer
    const reqCookie = reqheaders.Cookie
    let tel = ''
    if (reqreferer.indexOf(`desmobile=`) >= 0) tel = reqreferer.match(/desmobile=(.*?)(&|$)/)[1]
    if (tel == '' && reqCookie.indexOf(`u_account=`) >= 0) tel = reqCookie.match(/u_account=(.*?);/)[1]
    return tel
}


function getinfo() {
    return new Promise((resolve, reject) => {
        const url = { url: `https://m.client.10010.com/mobileService/home/queryUserInfoSeven.htm?version=iphone_c@7.0403&desmobiel=${gettel()}&showType=3`, headers: {"Cookie": JSON.parse(VAL_loginheader)["Cookie"]}}
        chavy.get(url, (error, response, data) => {
            try {
                signinfo.info = JSON.parse(data)
                resolve()
            } catch (e) {
                chavy.msg(cookieName, `获取余量: 失败`, `说明: ${e}`)
                chavy.log(`❌ ${cookieName} getinfo - 获取余量失败: ${e}`)
                chavy.log(`❌ ${cookieName} getinfo - response: ${JSON.stringify(response)}`)
                resolve()
            }
        })
    })
}

function showmsg() {
    let subTitle = ''
    let detail = ''

    if (signinfo.info.code == 'Y') {
        // 基本信息
        detail = detail ? `${detail}\n` : ``
        const traffic = signinfo.info.data.dataList[0]
        const flow = signinfo.info.data.dataList[1]
        const voice = signinfo.info.data.dataList[2]
        const credit = signinfo.info.data.dataList[3]
        const back = signinfo.info.data.dataList[4]
        const money = signinfo.info.data.dataList[5]
        subTitle = `${voice.remainTitle}: ${voice.number}${voice.unit}`
        detail = `${traffic.remainTitle}: ${traffic.number}${traffic.unit}\n${flow.remainTitle}: ${flow.number}${flow.unit}\n${credit.remainTitle}: ${credit.number}${credit.unit}`
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
