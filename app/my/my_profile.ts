import { AHandler } from "../../route/handler";
import { ERR, OK } from "../../common/result";
import { DBManager } from "../../modal/db/database_manager";
import crypto = require('crypto');

export class MyProfile extends AHandler {
    async handle(path:string, q:any){
        const profile = {
            USERNAME: q.username,
            USERPWD: crypto.createHash('md5').update(q.password).digest('hex'),
            ADDRESS: q.address,
            AVATAR: q.avatar,
            TEL: q.mobile,
            STATE: 'LOGIN'
        }
        const user = await DBManager.update('user','users', profile, {ID: q.user.ID});
		if (user.affectedRows == 1) {
            return OK(path);
		}else {
			return ERR(path);
		}
    }
}