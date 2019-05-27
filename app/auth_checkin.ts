import { ERR, OK } from "../common/result";
import { DBManager } from "../modal/db/database_manager";

import config = require('../config');
import { AHandler } from "../route/handler";
import { ID } from "../common/id";
import { SMS } from "../common/sms";
import { Log } from "../common/log";
import { Signature } from "../common/signature";

export class AuthCheckin extends AHandler{
    private sms: SMS = new SMS();

    async handle(path:string, q:any){
        if(!q.tel) {
            return ERR('手机号空', 'tel');
		}
		if(!q.tel.match(/^((13[0-9])|(15[^4])|(18[0-9])|(17[0-1|3|5-8])|(14[5|7|9]))\d{8}$/g)){
            return ERR('非手机号', 'tel');
        }
        let code = ID.code;
        let now = ID.now;
        let userid = q.user.ID;

        var t = new Date(q.user.UPDATETIME).getTime();
        if(t > 0 && new Date(now).getTime()-t<60000){
            return ERR('1分钟内只能获取一次验证码', 'tel');
        }

        const result = await DBManager.update('user', 'users', {STATE:'CHECKIN',OPENID:code,UPDATETIME:now,TEL:q.tel}, {ID:userid});
        if (result.affectedRows != 1) {
            return ERR(path);
        }
        
        this.sms.send(q.tel, code);
        Log.info('verify code:'+code);
        //var token = Signature.instance.sign(userid);
        return OK(path);
    }
}
