import * as crypto from 'crypto'; 
import * as request from "request-promise-native";
import * as urlencode from 'urlencode';

export class SMS {
    apikey: string = '9c8ac43e28bf7233bb814740bf9158c5';
    userid: string = 'E107RW';
    pwd: string = 'k75LqD';
    password(timestamp:number){
        let pwd = this.userid+'00000000'+this.pwd+timestamp;
        return crypto.createHash('md5').update(pwd,'utf8').digest('hex')
    }
    async emit(mobile:string, content:string){
        var timestamp = new Date().getTime();
        var result = await request.post({ 
            url: 'http://api01.monyun.cn:7901/sms/v2/std/single_send', 
            method: "POST", 
            json:{
                apikey:this.apikey,
                mobile:mobile,
                content:urlencode(content,'gbk'),
                timestamp:timestamp
            }
        });
    }
    async send(mobile:string, code:number){//海优良品登录验证码：{w1-8}，请惠存。 '登录验证码：'+code+'，如非本人操作，请忽略此短信。'
        this.emit(mobile, '海优良品登录验证码：'+code+'，请惠存。');
    }
}