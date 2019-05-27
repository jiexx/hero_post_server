import { UHandler, AHandler } from "../route/handler";
import { DBManager } from "../modal/db/database_manager";
import { Signature } from "../common/signature";
import { ERR, OK } from "../common/result";


export class AuthUser extends AHandler {
    async handle(path:string, q:any){
        return OK({USERNAME:q.user.USERNAME, USERPWD:q.user.USERPWD, TEL:q.user.TEL, ADDRESS:q.user.ADDRESS, AVATAR:q.user.AVATAR, STATE:q.user.STATE});
    }
}