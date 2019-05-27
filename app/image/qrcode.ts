import { FileHandler, AHandler } from "../../route/handler";
import { ERR, OK, FILE } from "../../common/result";
import * as QR from "qr-image";
import * as config from '../../config';
import { Log } from "../../common/log";


export class Qrcode extends AHandler {
	
	async handle(path:string, q:any){
        let margin = q.margin ? q.margin : 1;
		let qr = QR.imageSync(q.url, { type: 'png',margin:margin });
        return OK({url:q.url,qr:'data:image/png;base64,'+Buffer.from(qr).toString('base64')});
	}
}