import { AHandler } from "../../route/handler";
import { ERR, OK, REDIRECT, DIRECT, FILE } from "../../common/result";
import { DBManager } from "../../modal/db/database_manager";
import * as config from '../../config';
import { Log } from "../../common/log";

import * as ejs from 'ejs';
import { ID } from "../../common/id";
import * as QR from "qr-image";
import { Canvas } from "../../common/canvas";
import { SMS } from "../../common/sms";
import { AuthCheckin } from "../auth_checkin";
import { AuthConfirm } from "../auth_confirm";

export class Pay extends AHandler {
    PHONE: string =
    `<html>
        <head>
            <meta charset="UTF-8">
            <style>
                input {width:100%;padding:0.6rem; border: 1px solid #ced4da;border-radius: .25rem; letter-spacing: 2.8rem;word-spacing: 2.8rem;font-size:1.4rem}
                input:focus{border-color: rgba(255, 0, 0, 0.8);box-shadow: 0 1px 1px rgba(0, 0, 0, 0.075) inset, 0 0 8px rgba(255, 0, 0, 0.6);outline: 0 none;}
                button {width:100%;padding:0.8rem;background: rgba(255, 0, 0, 1.0);font-size:1rem;border-radius: .25rem;border: none;color: white;text-align: center;text-decoration: none;cursor: pointer;outline: none !important;box-shadow: none;}
                button:hover {background: rgba(200, 0, 0, 1.0);box-shadow: none;}
                button:active {background: rgba(200, 0, 0, 1.0);box-shadow: none;}
                div {padding:1.2rem 0 1.2rem 0; color:rgba(255, 0, 0, 1.0);white-space:nowrap;display:table; width:100%}
                div > * {display:table-cell}
                .space {width:5%}
                span {margin: 0.8rem 0 0.8rem 0}
                body{margin:2rem}
            </style>
            <script src="<%= domain %>/tool.js"></script>
        </head>
        <body>
            <div><span>因需要邮寄 务必填写可随时联系的手机号</span></div>
            <div><input type="tel" size="11" maxlength="11" name="tel"></div>
            <div><button onclick='ajax.redirect("pay",{title:"<%= title %>",amount:"<%= amount %>",price:"<%= price %>",posterid:"<%= posterid %>",tel:document.getElementsByName("tel")[0].value});'>获取验证码</button></div>
        </body>
    </html>`;
    CODE: string =
    `<html>
        <head>
            <meta charset="UTF-8">
            <style>
                input {width:100%;padding:0.6rem; border: 1px solid #ced4da;border-radius: .25rem; letter-spacing: 2.8rem;word-spacing: 2.8rem;font-size:1.4rem}
                input:focus{border-color: rgba(255, 0, 0, 0.8);box-shadow: 0 1px 1px rgba(0, 0, 0, 0.075) inset, 0 0 8px rgba(255, 0, 0, 0.6);outline: 0 none;}
                button {width:100%;padding:0.8rem;background: rgba(255, 0, 0, 1.0);font-size:1rem;border-radius: .25rem;border: none;color: white;text-align: center;text-decoration: none;cursor: pointer;outline: none !important;box-shadow: none;}
                button:hover {background: rgba(200, 0, 0, 1.0);box-shadow: none;}
                button:active {background: rgba(200, 0, 0, 1.0);box-shadow: none;}
                div {padding:1.2rem 0 1.2rem 0; color:rgba(255, 0, 0, 1.0);white-space:nowrap;display:table; width:100%}
                div > * {display:table-cell}
                .space {width:5%}
                span {margin: 0.8rem 0 0.8rem 0}
                body{margin:2rem}
            </style>
            <script src="<%= domain %>/tool.js"></script>
        </head>
        <body>
            <div><span>请填写短信收到的验证码</span></div>
            <div><input type="tel" size="4" maxlength="4" name="code"></div>
            <div><button type="submit" onclick='ajax.redirect("pay",{title:"<%= title %>",amount:"<%= amount %>",price:"<%= price %>",posterid:"<%= posterid %>",tel:"<%= tel %>",code:document.getElementsByName("code")[0].value});'>提交</button></div>
        </body>
    </html>`;
    WXQR = 
    `<html>
        <head>
            <meta charset="UTF-8">
            <style>
            </style>
        </head>
        <body>
            <div><img src="<%= qrcode %>"></div>
            <div><span>长按二维码，点击“识别图中二维码”付款</span></div>
        </body>
    </html>`;
    private sms: SMS = new SMS();
    private canvas: Canvas = new Canvas();
    async handle(path:string, q:any){
        if(!q.user.TEL && !q.tel){
            let d = {domain:config.DOMAIN,amount:q.amount,price:q.price,posterid:q.posterid,title:q.title};
            let pay = ejs.render(this.PHONE, d);
            return DIRECT(pay, 'text/html');
        }
        var result;
        if(q.tel && !q.code){
            result = await AuthCheckin.instance.handle(path, q);
            if(result.code == 'ERR'){
                return result;
            }
            let d = {domain:config.DOMAIN,amount:q.amount,price:q.price,posterid:q.posterid,title:q.title,tel:q.tel};
            let pay = ejs.render(this.CODE, d);
            return DIRECT(pay, 'text/html');
        }
        if(q.tel && q.code){
            result = await AuthConfirm.instance.handle(path, q);
            if(result.code == 'ERR'){
                return result;
            }
        }
        const order = await DBManager.insert('user','orders', {USERID: q.user.ID, TITLE:q.title, POSTERID:q.posterid, STATE:'待支付', AMOUNT:q.amount, CREATETIME:ID.now, UPDATETIME:ID.now });
        if (order.affectedRows != 1) {
            return ERR(path);
        }
        //let qr = QR.imageSync(q.price, { type: 'png',margin:1 });
        //let wxqr = ejs.render(this.WXQR, {qrcode: 'data:image/png;base64,'+new Buffer(qr).toString('base64')});
        let wxqr = await this.canvas.draw(q.price);
        //return DIRECT(wxqr, 'image/png');
        return OK({image:wxqr,confirm:result});
    }
}