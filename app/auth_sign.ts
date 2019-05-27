import { UHandler } from "../route/handler";
import { DBManager } from "../modal/db/database_manager";
import { Signature } from "../common/signature";
import { ERR, OK } from "../common/result";
import config = require('../config');
import { File } from "../common/file";
import { WxCode } from "./pay/wx_code";
import { ID } from "../common/id";


export class AuthSign extends UHandler {
    async handle(path:string, q:any){
        if(q && q.orderid) {
            const u = await DBManager.select('user','orders', {id:q.orderid});
            if (u && u.length == 1) {
                var token = Signature.instance.sign(u[0].CUSTOMERID);
                return OK(token);
            }
            return ERR(path);
        }
        const user = await DBManager.insert('user','users', {CREATETIME:ID.now,UPDATETIME:ID.now});
        if (user.affectedRows == 1) {
            var token = Signature.instance.sign(user.UUID);
            // if(q.wx){
            //     WxCode.instance.handle(path, {user: user.UUID});
            // }
            return OK(token);
        }
        return ERR(path);
    }
}