import { AHandler, UHandler, FileHandler } from "../../route/handler";
import { ERR, OK, FILE } from "../../common/result";

import * as fs from "fs";
import * as config from '../../config';
import { Log } from "../../common/log";
import { Router } from "../../route/router";
import { CharImage } from "./char_image";
import { ID } from "../../common/id";
import { CaliImage } from "./cali_image";



export class Files extends UHandler {
	dir = {};
	constructor(){
		super();
		for(var i in config.MEDIA_HOST.DIRS) {
			let dir = config.MEDIA_HOST.DIRS[i].PATH;
			if(dir && !fs.existsSync(dir)) {
				fs.mkdirSync(dir, { recursive: true });
			}
			let type = (config.MEDIA_HOST.DIRS[i].TYPE) ? config.MEDIA_HOST.DIRS[i].TYPE: 'image/gif';
			this.dir[config.MEDIA_HOST.DIRS[i].PREFIX] = {path:config.MEDIA_HOST.DIRS[i].PATH,type:type};
		}
		this.register(CharImage.instance);
		this.register(CaliImage.instance);
	}
	private handlerFactory = {};
	private register(fHander: FileHandler){
		this.handlerFactory[fHander.type] = fHander;
	}

	routers(): Router[]{
		var routers: Router[] = [];
        for(var type in config.MEDIA_HOST.DIRS) {
			routers.push(this.createRouter('/b64/:clazz0('+config.MEDIA_HOST.DIRS[type].PREFIX+'):id(*)'));
			routers.push(this.createRouter('/lnk/:clazz3('+config.MEDIA_HOST.DIRS[type].PREFIX+'):id(*)'));
			routers.push(this.createRouter('/files/list/:clazz1('+config.MEDIA_HOST.DIRS[type].PREFIX+')'));
		}
		//routers.push(this.createRouter('/files/upload/:clazz2('+config.MEDIA_HOST.DIRS[type].PREFIX+')'));
        return routers;
	}
	dirs(clazz:string, subdir:string){
		return this.dir[clazz].path + subdir;
	}
	location(clazz:string, id:string) {
		return this.dir[clazz].path+id;
	}
	id(clazz:string){
		return clazz+ID.short;
	}
	type(clazz:string){
		return this.dir[clazz].type;
	}
	mime(path:string){
		let t = path.substr(path.lastIndexOf('.')).toLowerCase();
		if(t == '.png'){
			return 'image/gif gz';
		}else if(t == '.svg'){
			return 'image/svg+xml svg svgz';
		}else{
			return 'text/html gz';
		}
	}
	
	async handle(path:string, q:any){
		if(q.clazz0){
			if(this.handlerFactory[q.clazz0]) {
				return await this.handlerFactory[q.clazz0].handle(path, q);
			}else {
				let location = this.location(q.clazz0,q.id);
				if(!fs.existsSync(location)){
					return ERR('not found');
				}
				let data = 'data:'+this.type(q.clazz0)+';base64,'+fs.readFileSync(location, { encoding: 'base64' });
				return OK(data);
			}
		}else if(q.clazz1){
			try {
				let files = fs.readdirSync(this.dirs(q.clazz1, q.id?q.id:''));
				return OK(files);
			} catch (error) {
				Log.error(error);
				return ERR(path);
			}
		}else if(q.clazz2){
			if(!q.file) return ERR('null');
			try {
				let id = this.id(q.clazz2);
				let location = this.location(q.clazz2,id);
				fs.writeFile(location, q.file, (err) =>{
					if(!err){
						return OK(id);
					}else {
						return ERR('save error');
					}
				});
			} catch (error) {
				Log.error(error);
				return ERR(path);
			}
		}else if(q.clazz3){
			if(this.handlerFactory[q.clazz3]) {
				return await this.handlerFactory[q.clazz3].handle(path, q);
			}else {
				let location = this.location(q.clazz3,q.id);
				if(!fs.existsSync(location)){
					return ERR('not found');
				}
				return FILE(this.mime(q.id), location);
			}
		}
		
	}
}