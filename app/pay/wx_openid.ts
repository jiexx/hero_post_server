import { AHandler, UHandler } from "../../route/handler";
import { ERR, OK, REDIRECT, DIRECT } from "../../common/result";
import { DBManager } from "../../modal/db/database_manager";
import * as config from '../../config';
import * as request from "request-promise-native";
import { Log } from "../../common/log";
import { WxPay } from "./wx_pay";

export class WxOpenid extends UHandler {
    async handle(path:string, q:any){
        if(q.code && q.uid){
            var url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+config.WXPAY.app_id+'&secret='+config.WXPAY.secret+'&code='
                +q.code+'&grant_type=authorization_code';
            const result = await request.get(url, { json: true });
            var openid = JSON.parse(result).openid;
            if(!openid) {
                return ERR(path);
            }
            const user = await DBManager.update('user','users', {OPENID:openid}, {ID: q.uid});
            if(user.affectedRows != 1) {
                return ERR(path);
            }
            if(q.finished) {
                q.orderid = q.finished;
                WxPay.instance.handle(path, q);
            }
            
        }
        return ERR(path);
    }
}