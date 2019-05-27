import { AHandler } from "../../route/handler";
import { ERR, OK, REDIRECT, DIRECT } from "../../common/result";
import { DBManager } from "../../modal/db/database_manager";
import * as config from '../../config';
import * as request from "request-promise-native";
import { Log } from "../../common/log";
import * as util from "util";
import * as crypto from 'crypto'; 
import * as ejs from 'ejs';
import * as xml2js from 'xml2js';
import { WxCode } from "./wx_code";
import { ID } from "../../common/id";

const xmlParser = util.promisify(xml2js.Parser().parseString);

export class WxPay extends AHandler {
    PREPAY: string = 
        `<xml>
            <appid><%= appid %></appid>
            <body><%= title %></body>
            <mch_id><%= mchid %></mch_id>
            <nonce_str><%= nonce %></nonce_str>
            <notify_url><%= notify_url %></notify_url>
            <openid><%= openid %></openid>
            <out_trade_no><%= orderid %></out_trade_no>
            <spbill_create_ip></spbill_create_ip>
            <total_fee><%= amount %></total_fee>
            <trade_type>JSAPI</trade_type>
            <sign><%= signature %></sign>
        </xml>`;
    PAY: string =
        `<html>
            <head>
                <meta charset="UTF-8">
                <script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
                <script>
                    document.addEventListener('DOMContentLoaded', function() {
                        if (typeof WeixinJSBridge == "undefined"){
                            if (document.addEventListener){
                                document.addEventListener('WeixinJSBridgeReady', jsApiCall, false);
                            }else if (document.attachEvent){
                                document.attachEvent('WeixinJSBridgeReady', jsApiCall);
                                document.attachEvent('onWeixinJSBridgeReady', jsApiCall);
                            }
                        } else {
                            WeixinJSBridge.invoke('getBrandWCPayRequest', {
                                "appId": , "<%= appid %>" ,
                                "timeStamp": , "<%= timeStamp %>" ,
                                "nonceStr": , "<%= nonce %>",
                                "package": , "<%= package %>" ,
                                "signType": , "<%= signType %>",
                                "paySign": , "<%= paySign %>"
                            }, function (res) {
                                if (res.err_msg == "get_brand_wcpay_request：ok") { }
                            });
                        }
                    }, false);
                </script>
            </head>
        </html>`;
    sort(args: object) {
		var keys = Object.keys(args);
		keys = keys.sort();
		var newArgs = {};
		keys.forEach(function (key) {
			newArgs[key] = args[key];
		});
		var string = '';
		for (var k in newArgs) {
			string += '&' + k + '=' + newArgs[k];
		}
		string = string.substr(1) + '&key=' + config.WXPAY.secret;
		return string;
    }
    md5(obj:object){
        var uri = this.sort(obj);
        var md5 = crypto.createHash('md5').update(uri,'utf8').digest('hex');
        return md5;
    }
    async prepay(nonce:string,notify_url:string,openid:string,title:string,orderid:string,amount:number){
        var obj = {
			appid : config.WXPAY.app_id,
			body : title,
			mch_id : config.WXPAY.mch_id,
			nonce_str : nonce,
			notify_url : notify_url,
			openid : openid,
			out_trade_no : orderid,
			spbill_create_ip : '',
			total_fee : amount,
			trade_type : 'JSAPI'
		};
		obj['signature'] = this.md5(obj);
        var xml  = ejs.render(this.PREPAY, obj);
        const result = await request.post({url:'https://api.mch.weixin.qq.com/pay/unifiedorder', method:'POST', body: xml});
        const prepay = xmlParser(result.toString("utf-8"));
        return prepay.prepay_id;
    }
    paying(nonce:string,prepay_id:any) {
		var obj = {
			appId : config.WXPAY.app_id,
			nonceStr : nonce,
			package : 'prepay_id=' + prepay_id,
			signType : 'MD5',
			timeStamp : new Date().getTime()
		};
        obj['paySign'] = this.md5(obj);
		return ejs.render(this.PAY, obj);
    };
    isReturnOpenid(orderid: string, user: any){
        return orderid && !user;
    }
    isWithOpenid(user: any, title: string, amount: string){
        return user && user.OPENID && title && amount;
    }
    isWithoutOpenid(user: any, title: string, amount: string){
        return user && !user.OPENID && title && amount;
    }
    
    async handle(path:string, q:any){
        var orderid: string, openid: string, title: string, amount: number; 
        if(this.isReturnOpenid(q.orderid, q.user)){
            const order = await DBManager.select('user','orders', {ID: q.orderid});
            const user = await DBManager.select('user','users', {ID: order.USERID});
            orderid = q.orderid;
            openid = user.OPENID;
            title = order.TITLE;
            amount = order.AMOUNT;
        }else {
            const order = await DBManager.insert('user','orders', {USERID: q.user.ID, TITLE:q.title, POSTERID:q.posterid, STATE:'待支付', AMOUNT:q.amount, CREATETIME:ID.now, UPDATETIME:ID.now });
            if (order.affectedRows != 1) {
                return ERR(path);
            }
            if(this.isWithoutOpenid(q.user, q.title, q.amount)){
                return WxCode.instance.handle(path, {taskid:order.UUID});
            }else if(this.isWithOpenid(q.user, q.title, q.amount)){
                orderid = order.orderid;
                openid = q.user.OPENID;
                title = q.title;
                amount = q.amount;
            }
        }
        var nonce = new Date().getSeconds()+'';
        var notify_url = config.DOMAIN+'/notify?finished='+orderid;
        var payid = await this.prepay(nonce,notify_url,openid,title,orderid,amount);
        const pay = this.paying(nonce, payid);
        return DIRECT(pay, 'html/text');
    }
}