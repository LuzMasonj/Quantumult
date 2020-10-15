/*
Quantumult X:
[rewrite_local]
^https:\/\/(www|m)\.baidu.com.*?(wd|word)=https?:\/\/.+$ url script-echo-response https://raw.githubusercontent.com/MisterGlasses/Quantumult/master/QuantumultX/Script/Q-Search.js
^https:\/\/(www|m)\.baidu.com.*?(wd|word)=.+\.(com|cn|net)$ url script-echo-response https://raw.githubusercontent.com/MisterGlasses/Quantumult/master/QuantumultX/Script/Q-Search.js

[mitm]
hostname = www.baidu.com, m.baidu.com
 */
let url = $request.url;
if (url.match(/(www|m)\.baidu.com.*?(wd|word)=https?:\/\/.+$/)) {
	url = decodeURIComponent(url.match(/(wd|word)=(.+)/)[2])
} else if (url.match(/(www|m)\.baidu.com.*?(wd|word)=.+\.(com|cn|net)$/)){
	url = `http://${url.match(/(wd|word)=(.+)/)[2]}`
}

	const isQuanX = typeof $notify != "undefined";
	const newstatus = isQuanX ? "HTTP/1.1 302 Temporary Redirect" : 302;
	const redirect = {
		status: newstatus,
		headers: {
			Location: url,
		},
	};
	const resp = isQuanX ? redirect : { response: redirect };
	$done(resp);
