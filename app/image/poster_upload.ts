import { AHandler } from "../../route/handler";
import { ERR, OK } from "../../common/result";
import { DBManager } from "../../modal/db/database_manager";
import * as config from '../../config';
import * as fs from "fs";
import { ID } from "../../common/id";
import { File } from "../../common/file";
import { registerFont, createCanvas,Image  } from "canvas";
import * as QR from "qr-image";

class Poster {
    location(userid:string, posterid:string, num:number, index:number,type:string) {
		let path = config.MEDIA_HOST.DIRS['poster'].PATH+''+userid+'/';
        if(!fs.existsSync(path)) fs.mkdirSync(path,{ recursive: true });
        return path+this.id(posterid, num, index)+'.'+type;
    }
    lifeLocation(userid:string, posterid:string, num:number, index:number,type:string) {
		let path = config.MEDIA_HOST.DIRS['life'].PATH;
        return path+this.id(posterid, num, index)+'.'+type;
    }
    foodLocation(userid:string, posterid:string, num:number, index:number,type:string) {
		let path = config.MEDIA_HOST.DIRS['food'].PATH;
        return path+this.id(posterid, num, index)+'.'+type;
    }
    url(userid:string,posterid:string, num:number, index:number, type:string){
        return config.MEDIA_HOST.URL+'lnk/'+config.MEDIA_HOST.DIRS['food'].PREFIX+posterid+'_'+(100+index).toString(10).substr(1)+'_'+num+'.'+type
    }
    id(posterid:string, num:number, index:number){
        return posterid+'_'+(100+index).toString(10).substr(1)+'_'+(num+1);
    }
    save(userid:string, posterid:string, index:number, num:number, file: string, type: string){
        let location = this.location(userid, posterid, num, index, type);
        let wc = this.location(userid, posterid, num-1, index, type);
        if(fs.existsSync(wc)) fs.unlinkSync(wc);
        fs.writeFileSync(location, file);
        let food = this.foodLocation(userid, posterid, num-1, index, type);
        if(fs.existsSync(food)) fs.unlinkSync(food);
        fs.writeFileSync(food, file);
        let life = this.lifeLocation(userid, posterid, num-1, index, type);
        if(fs.existsSync(life)) fs.unlinkSync(life);
        fs.writeFileSync(life, file);
        return this.url(userid, posterid,num,index,type);
    }
    copy(userid:string, posterid:string, index:number, num:number, file: string, type: string){
        let location = this.location(userid, posterid, num, index, type);
        let wc = this.location(userid, posterid, num-1, index, type);
        if(fs.existsSync(wc)) fs.unlinkSync(wc);
        fs.writeFileSync(location, file);
        return this.url(userid, posterid,num,index,type);
    }
    loadImage(url) {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = err =>  reject(err);
          img.src = url;
        });
    }
    async draw(url, b, w = 600, h = 900, d = 68) {
        
        const bg = await this.loadImage(b);
        let qr = QR.imageSync(url, { type: 'png',margin:1 });
        const img = await this.loadImage(qr) as Image;
        let canvas = createCanvas(w, h);
        let ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(bg, 0, 0);
        ctx.drawImage(img, w-img.width - 10, h - img.height -60);
        //ctx.fillStyle = 'white';
        //ctx.fillRect(w-img.width, h - img.height, img.width, 32);
        const txt = '长按扫描二维码获取';
        ctx.font = "bold 14px sans-serif";
        ctx.fillStyle = "#000000";
        //ctx.fillText(txt, w-ctx.measureText(txt).width-d - 10, h + 20 - 60);
        ctx.fillText(txt, w-img.width - 10, h + 20 - 60);
        return canvas.toBuffer() as any;
    }

    assemble(posterid:string, posternum:number, svgs:string[], namePrice: any){ //xmlns:xlink
        let str = '<html><head><meta charset="UTF-8"><script src="'+config.DOMAIN+'/tool.js"></script></head><body>';
        for(var i = 1 ; i < posternum ; i ++){
            var r = svgs[i];
            var ajax = 'onclick=\'ajax.redirect("pay",{title:"'+namePrice.name[i]+'",amount:"'+namePrice.amount[i]+'",price:"'+namePrice.price[i]+'",posterid:"'+this.id(posterid, posternum, i)+'"});\'';
            r = r.replace(/(<image.+HJkZjp[^>]+)>/g,'$1 '+ajax+'>');
            //r = r.replace(/(<svg[^>]+)>/g,'$1><script type="text/ecmascript"><![CDATA['+strAjax+']]></script>');
            str += '<div>'+r+'</div>';
        }
        str += '</body></html>';
        return str;
    }
    async writes(userid:string, posterid:string, posternum:number, svgs:string[], jsons:string[], png: string, namePrice: any){
        for(var i = 0 ; i < posternum ; i ++){
            this.save(userid,posterid, i, posternum,svgs[i],'svg');
            this.save(userid,posterid, i, posternum, jsons[i],'json');
        }
        let a = this.assemble(posterid, posternum, svgs, namePrice);
        let html = this.save(userid,posterid, i, posternum, a,'htm');
        let d = await this.draw(html, png);
        let url = this.save(userid,posterid, i, posternum, d,'png');
        let qr = QR.imageSync(url, { type: 'png',margin:1 });
        return {url:url,qr:'data:image/png;base64,'+Buffer.from(qr).toString('base64')};
    }
    getNamePrice(names: string, amounts:string, prices: string, posternum:number){
        let a = amounts.split(',');
        let n = names.split(',');
        let p = prices.split(',');
        if(posternum == n.length && posternum == p.length){
            return {name:n, price:p, amount:a};
        }
        return null;
    }
}

export class PosterUpload extends AHandler {
    poster: Poster = new Poster();
    async handle(path:string, q:any){
        const namePrice = this.poster.getNamePrice(q.names, q.amounts, q.prices, q.posternum-1);
        if(!namePrice){
            return ERR(path);
        }
        const pp = await DBManager.select('posters','posters', {POSTERID:q.posterid});
        if(pp.length > 0){
            const poster = {
                UPDATETIME: ID.now,
                POSTERNUM: q.posternum,
                USERID: q.user.ID,
                TITLE: q.names,
                URLQR: q.prices,
                PRICE: q.amounts
            }
            const uq = await this.poster.writes(q.user.ID, q.posterid, q.posternum, q.data.svg, q.data.json, q.data.png, namePrice);
            const user = await DBManager.update('posters','posters',poster, {POSTERID:q.posterid/*, USERID: q.user.ID*/});
            if (user.affectedRows == 1) {
                return OK(uq);
            }else {
                return ERR(path);
            }
        }else {
            const poster = {
                ID: ID.long,
                POSTERID: q.posterid,
                POSTERNUM: q.posternum,
                USERID: q.user.ID,
                CREATETIME: ID.now,
                UPDATETIME: ID.now,
                TITLE: q.names,
                URLQR: q.prices,
                PRICE: q.amounts
            }
            const uq = await this.poster.writes(q.user.ID, q.posterid, q.posternum, q.data.svg, q.data.json, q.data.png, namePrice);
            const user = await DBManager.insert('posters','posters',poster);
            if (user.affectedRows == 1) {
                return OK(uq);
            }else {
                return ERR(path);
            }
        }
        
    }
}