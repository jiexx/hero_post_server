import { ERR, OK } from "../common/result";
import { DBManager } from "../modal/db/database_manager";

import config = require('../config');
import { AHandler } from "../route/handler";

import crypto = require('crypto');
import { ID } from "../common/id";
import { Signature } from "../common/signature";

export class AuthConfirm extends AHandler{
    async handle(path:string, q:any){
        if(!q.tel) {
            return ERR('手机号空', 'tel');
		}
		if(!q.tel.match(/^((13[0-9])|(15[^4])|(18[0-9])|(17[0-9])|(147))\d{8}$/g)){
            return ERR('非手机号', 'tel');
        }
        if(!q.code || q.code.length != 4) {
            return ERR('错误的验证码', 'code');
        }
        let now = ID.now;
        let userid = q.user.ID;

		const user = await DBManager.select('user', 'users', {ID:userid,OPENID:q.code});
        if(user.length<1){
            return ERR('错误的验证码','code');
        }
        const other = await DBManager.select('user', 'users', {TEL:user[0].TEL});
        if(other.length > 1){
            const result = await DBManager.delete('user', 'users', {ID:userid,OPENID:q.code});
            if (result.affectedRows != 1) {
                return ERR(path);
            }
            userid = other.filter(e=>{return e.ID != userid;})[0].ID;
        }
        const result = await DBManager.update('user', 'users', {STATE:'LOGIN',OPENID:q.code,TEL:q.tel,UPDATETIME:now}, {ID:userid});
        if (result.affectedRows != 1) {
            return ERR(path);
        }
        let token = Signature.instance.sign(userid);
        let u = {token: token,USERNAME:user[0].USERNAME, TEL:user[0].TEL, ADDRESS:user[0].ADDRESS, AVATAR:user[0].AVATAR?user[0].AVATAR:config.ANONYMOUS_AVATAR, STATE:'LOGIN'};
        return OK(u);
    }
}
