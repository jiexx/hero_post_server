import { AHandler } from "../../route/handler";
import { ERR, OK, REDIRECT, DIRECT } from "../../common/result";
import * as config from '../../config';
import * as request from "request-promise-native";
import { Log } from "../../common/log";

export class WxCode extends AHandler {
    async handle(path:string, q:any){
        if(!q.user.OPENID){
            var taskid = q.taskid ? q.taskid : null;
            var redirect_uri = encodeURIComponent(config.DOMAIN+'/wx/openid?finished='+taskid+'&uid='+q.user.ID);
            var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+config.WXPAY.app_id
                +'&redirect_uri='+redirect_uri+
                +'&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
            return REDIRECT(url);
        }
        return OK(q.user.OPENID);
    }
}