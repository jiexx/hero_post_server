import { ERR, OK } from "../common/result";
import { DBManager } from "../modal/db/database_manager";

import config = require('../config');
import { AHandler } from "../route/handler";

import captcha = require('trek-captcha');
import crypto = require('crypto');

export class AuthApply extends AHandler{
    async handle(path:string, q:any){
        if(!q.username) {
            return ERR('手机号空','username');
		}
		if(!q.username.match(/^((13[0-9])|(15[^4])|(18[0-9])|(17[0-9])|(147))\d{8}$/g)){
            return ERR('非手机号','username');
		}
		if( q.user.TEL && q.user.STATE != 'REG'){
            return ERR('已注册,请登录','username');
        }
        const pwd = await captcha({ size: 5, style: 0 });
		var password = crypto.createHash('md5').update(pwd.token).digest('hex') ;
        const r = await DBManager.update('user', 'users',{ TEL: q.username, USERPWD: password, STATE:'REG' }, {ID: q.user.ID});
        if (r.affectedRows == 1) {
            let base64 = 'data:image/png;base64, '+ Buffer.from(pwd.buffer).toString('base64');
            return OK(base64);
        }else {
            return ERR('apply', 'username');
        }
    }
}
