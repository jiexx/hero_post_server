import mysql = require('mysql');
import config = require('../config');

import { Modal, ModalCreator} from './lib/modal';
import { Data, EqualLevelDataCreator, ZeroLevelDataCreator, LessLevelDataCreator } from './lib/data';
import { ObjectTraverser, Depthor, JointTraverser, Listor, NamesVisitor, Visitor, Extra} from './lib/traverse'
import { Joint} from './lib/joint';
import { Param } from './lib/param';
import { Log } from '../common/log';
import { Router } from '../route/router';
import { File } from '../common/file';
import { DBManager } from './db/database_manager';
import { ERR } from '../common/result';
import { UHandler, AHandler } from '../route/handler';


class Outputor implements Visitor{
    out: any = null;
    visit(that: any, ext: Extra) {
        var parent = !ext.extra ? {} : ext.extra;
        parent[ext.name] = that.output;
        if(!this.out){
            this.out = parent;
        }
        return that.output;
    }
}

export class Context extends AHandler {
    private _modals: any = [];
    constructor() {
        super();
        const location:string = './sql';
        var files = File.load(location);
        for(var i in files) {
            this.load(i,files[i]);
        }
    }
    static pool = mysql.createPool({
        host: config.DATA_HOST,
        user: config.DBUSER,
        password: config.DBPWD,
        connectionLimit: 500,
    });
    private load(point: string, json: string) {
        var obj = JSON.parse(json);
        var root = ObjectTraverser.DFS(obj, new ModalCreator());
        var depthor = new Depthor();
        ObjectTraverser.DFS(obj, depthor);
        var level = depthor.d;
        var list = JointTraverser.DFS(root, new Listor());
        var names = JointTraverser.DFS(root, new NamesVisitor()).join(',');

        this._modals[point] = { modal: root, list:list, names:names, level: level };
    }
    private async prepare(point: string, data: Object) {
        var root = ObjectTraverser.DFS(data, new EqualLevelDataCreator());
        var depthor = new Depthor();
        ObjectTraverser.DFS(data, depthor);
        var level = depthor.d;
        var list = JointTraverser.DFS(root, new Listor());
        var names = JointTraverser.DFS(root, new NamesVisitor()).join(',');

        var modalNames = this._modals[point].names;
        if (modalNames.indexOf(names) < -1 && names.indexOf(modalNames) <-1) {
            Log.warning('modal name is not match input data name');
            return null;
        }
        var modalLevel = this._modals[point].level;
        var dataLevel = level;
        if (modalLevel != dataLevel) {
            Log.warning('modal level '+modalLevel+' is not match input data level '+dataLevel);
            if (0 == dataLevel) {
                var modal = this._modals[point].modal;
                root = JointTraverser.DFS(modal, new ZeroLevelDataCreator(data));
                list = JointTraverser.DFS(root, new Listor());
            }else if (dataLevel < modalLevel){
                var modal = this._modals[point].modal;
                root = JointTraverser.DFS(modal, new LessLevelDataCreator(list));
                list = JointTraverser.DFS(root, new Listor());
            }
        }
        var m = this._modals[point].list;
        for (var i = 0; i < m.length; i++){
            await m[i].prepare(list[i]);
        }
        return list;
    }
    private async execute(point: string, list: Data[]) {
        var m = this._modals[point].list;
        for (var i = 0; i < m.length; i++){
            await m[i].execute(list[i]);
            var result = await DBManager.exec(m[i].sql, list[i].value);
            if( Array != result.constructor ){
                list[i].output = result;
            }else if( result.length > 1 ){
                list[i].output = {a:result};
            }else if( result.length == 1 ) {
                list[i].output = result[0];
            }
        }
    }

    async handle(path:string, q:any){
        let r = {};
        if(q && q.user){
            for(var i in q){
                if(i!='user'){
                    r[i] = q[i];
                }
            }
            r['userid'] = q.user.ID;
        }else {
            r = q;
        }
        var list = await this.prepare(path, r);
        if(null == list) {
            return ERR('modal name is not match input data name', '');
        }
        await this.execute(path, list);
        var outputer = new Outputor();
        JointTraverser.DFS(list[0], outputer);
        return outputer.out.root;
    }
    routers(): Router[]{
        var routers: Router[] = [];
        for(var i in this._modals) {
            routers.push(this.createRouter(i));
        }
        return routers;
    }

}