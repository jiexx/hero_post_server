import { ERR, OK } from "../common/result";
import { DBManager } from "../modal/db/database_manager";

import config = require('../config');
import { AHandler } from "../route/handler";

export class AuthCheckout extends AHandler{
    async handle(path:string, q:any){
        const r = await DBManager.update('user', 'users', { STATE:'LOGOUT' }, {ID: q.user.ID});
        if (r.affectedRows == 1) {
            return OK();
        }else {
            return ERR('checkin', 'username');
        }
    }
}