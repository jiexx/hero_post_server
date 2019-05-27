import { FileHandler } from "../../route/handler";
import { ERR, OK, FILE } from "../../common/result";

import * as S from "simplebig";
import * as fs from "fs";
import * as config from '../../config';
import { Log } from "../../common/log";
import { CharImage } from "./char_image";



export class CaliImage extends FileHandler {
	//static input = {'欧阳询':1,'虞世南':2,'褚遂良':3,'卫夫人':4,'赵孟頫':5,'董美人墓志':6,'智永':7,'柳公权':8,'王羲之':9};
	//static type =['ks','xs','cs'];
	constructor(){
		super();
		this.type = config.MEDIA_HOST.DIRS['image/caligraph'].PREFIX;
		this.base = config.MEDIA_HOST.DIRS['image/caligraph'].PATH;
	}
	location(type:string, code:number, who: number, no: number) { 
		let d = code - 0x4E00;
		let first = d & 0x1F;
		let second = (d >> 5) & 0x1F;
		let third = (d >> 10) & 0x1F;
		let path = this.base+((first+100)+'').substr(1)+'/'+((second+100)+'').substr(1)+'/'+((third+100)+'').substr(1)+'/'+type;
		if(!fs.existsSync(path)) fs.mkdirSync(path,{ recursive: true });
		return path+'/'+who+'_'+code+'_'+no+'.png';
	}

	locationRandom(type:string, code:number) { 
		let d = code - 0x4E00;
		let first = d & 0x1F;
		let second = (d >> 5) & 0x1F;
		let third = (d >> 10) & 0x1F;
		let path = this.base+((first+100)+'').substr(1)+'/'+((second+100)+'').substr(1)+'/'+((third+100)+'').substr(1)+'/'+type;
		let files = fs.readdirSync(path);
		let i = Math.floor(Math.random() * files.length);
		return path+'/'+files[i];
	}
	
	async handle(path:string, q:any){
		if(!q || !q.id) return ERR('null');
		try {
			if(q.rand){
				let location = this.locationRandom(q.ftype, q.id);
				if(fs.existsSync(location)){
					if(q.clazz0){
						let data = 'data:image/png;base64,'+fs.readFileSync(location, { encoding: 'base64' });
						return OK(data);
					}else if(q.clazz3){
						return FILE('image/png gz',location);
					}
				}
			}
			let i = 1;
			for(i = 1; i < 9; i++){
				let location = this.location('ks', q.id, i, 0);
				if(fs.existsSync(location)){
					if(q.clazz0){
						let data = 'data:image/png;base64,'+fs.readFileSync(location, { encoding: 'base64' });
						return OK(data);
					}else if(q.clazz3){
						return FILE('image/png gz',location);
					}
				}
			}
			for(i = 1; i < 9; i++){
				let location = this.location('xs', q.id, i, 0);
				if(fs.existsSync(location)){
					if(q.clazz0){
						let data = 'data:image/png;base64,'+fs.readFileSync(location, { encoding: 'base64' });
						return OK(data);
					}else if(q.clazz3){
						return FILE('image/png gz',location);
					}
				}
			}
			
			return await CharImage.instance.handle(path,q);
		} catch (error) {
			Log.error(error);
			return ERR(path);
		}
	}
}