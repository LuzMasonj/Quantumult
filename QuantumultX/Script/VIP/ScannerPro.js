/*
[rewrite_local]
# Scanner Pro 解锁Plus 一次性解锁勿卸载（20201219）
https://license.pdfexpert.com/api/2.0/scanner/subscription/refresh url script-response-body https://raw.githubusercontent.com/LuzMasonj/Quantumult/master/QuantumultX/Script/VIP/ScannerPro.js
[mitm]
hostname = license.pdfexpert.com
*/
let body= $response.body; 
var obj = JSON.parse(body); 
obj={
    "receiptStatus": "ok",
    "isEligibleForIntroPeriod": true,
    "subscriptionState": "notActive",
    "receiptId": 1607775478000,
    "isScanner7User": true,
    "inAppStates": [
        {
            "type": "custom purchase",
            "productId": "scannerpro7-user",
            "entitlements": []
        }
    ],
    "chargingPlatform": "iOS AppStore",
    "bundleId": "com.readdle.Scanner"
}
$done({body: JSON.stringify(obj)});
