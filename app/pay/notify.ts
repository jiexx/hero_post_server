import { AHandler, UHandler } from "../../route/handler";
import { ERR, OK, REDIRECT, DIRECT } from "../../common/result";
import { DBManager } from "../../modal/db/database_manager";
import * as config from '../../config';
import { ID } from "../../common/id";

export class Noitfy extends UHandler {
    async handle(path:string, q:any){
        if(q.finished){
            const order = await DBManager.update('users','orders', {STATE:'支付成功', UPDATETIME:ID.now }, {ID:q.finished});
            if(order.affectedRows == 1) {
                return OK(q.finished);
            }
        }
        return ERR(path);
    }
}