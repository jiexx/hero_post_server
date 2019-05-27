import { AHandler } from "../../route/handler";
import { ERR, OK } from "../../common/result";
import { DBManager } from "../../modal/db/database_manager";
import * as config from '../../config';
import * as fs from "fs";
import { ID } from "../../common/id";
import { Log } from "../../common/log";

export class PosterDown extends AHandler {
    location(posterid:string, num:number, index:number,type:string) {
        return config.MEDIA_HOST.DIRS['food'].PATH+''+posterid+'_'+(100+index).toString(10).substr(1)+'_'+num+'.'+type;
    }
    async handle(path:string, q:any){
        try{
            const poster = await DBManager.select('posters','posters',{POSTERID:q.posterid});
            if (poster.length != 1) {
                return ERR(path);
            }
            let svgs = [], jsons = [];
            for(var i = 0 ; i < q.posternum ; i ++) {
                let svg = this.location(q.posterid, q.posternum, i, 'svg');
                let json = this.location(q.posterid, q.posternum, i, 'json');
                let svgStr = fs.readFileSync(svg,{ encoding: 'utf8' });
                let jsonStr = fs.readFileSync(json,{ encoding: 'utf8' });
                svgs.push(svgStr);
                jsons.push(jsonStr);
            }
            let png = this.location(q.posterid, q.posternum, i, 'png');
            let pngStr = fs.readFileSync(png);
            return OK({title:poster[0].TITLE,qr:poster[0].URLQR,price:poster[0].PRICE,svg:svgs,json:jsons,png:'data:image/png;base64,'+ Buffer.from(pngStr).toString('base64')});
        } catch (error) {
            Log.error(error);
            return ERR(path);
        }
    }
}