import { FileHandler } from "../../route/handler";
import { ERR, OK, FILE } from "../../common/result";
import { registerFont, createCanvas } from "canvas";

import * as S from "simplebig";
import * as fs from "fs";
import * as config from '../../config';
import { Log } from "../../common/log";


export class CharImage extends FileHandler {
	constructor(){
		super();
		this.type = config.MEDIA_HOST.DIRS['image/char'].PREFIX;
		this.base = config.MEDIA_HOST.DIRS['image/char'].PATH;
		registerFont('./assets/DFOYangXunW5-B5.ttf', { family: 'oyang', weight:'normal' });
	}
	location(type:string, code:number) { 
		let d = code - 0x4E00;
		let first = d & 0x1F;
		let second = (d >> 5) & 0x1F;
		let third = (d >> 10) & 0x1F;
		let path = this.base+((first+100)+'').substr(1)+'/'+((second+100)+'').substr(1)+'/'+((third+100)+'').substr(1);
		if(!fs.existsSync(path)) fs.mkdirSync(path,{ recursive: true });
		return path+'/'+code+'.'+type;
	}
	createCharSVG(ch: string, path: string){
		let canvas = createCanvas(32, 32, 'svg');
		let ctx = canvas.getContext('2d');
		ctx.font = '28px DFOYangXunW5-B5';
		ctx.fillText(ch, 1, 27);
		fs.writeFileSync(path, canvas.toBuffer())
	}
	
	async handle(path:string, q:any){
		if(!q || !q.id) return ERR('null');
		try {
			let ch = S.s2t(String.fromCharCode(q.id));
			let location = this.location('svg', ch[0].charCodeAt(0));
			if(!fs.existsSync(location)){
				this.createCharSVG(ch[0], location);
			}
			if(q.clazz0){
				let data = 'data:image/svg+xml;base64,'+fs.readFileSync(location, { encoding: 'base64' });
				return OK(data);
			}else if(q.clazz3){
				return FILE('image/svg+xml svg svgz',location);
			}
		} catch (error) {
			Log.error(error);
			return ERR(path);
		}
	}
}