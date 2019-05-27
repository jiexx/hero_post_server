import { Joint } from './joint';
import { Param } from './param';
import { ObjectTraverser, Visitor, Extra } from './traverse';
import { Context } from '../context';
import { Data } from './data';
import { Log } from '../../common/log';
import { ParamString } from './param_string';
import { ParamFiles } from './param_files';
import { ParamOutput } from './param_ouput';
import { ParamId } from './param_id';

export class ModalCreator implements Visitor {
    visit(that: any, ext: Extra){
        var parent = <Modal>ext.extra;
        var child = new Modal(ext.name, parent, that);
        if(parent) {
            parent.addChild(child)
        }
        return child;
    }
}

export class Modal extends Joint{
    sql: string = null;
    params: Param[] = [];
    constructor(name:string, parent:Modal, o:any){
        super(name, parent);
        if (!o.sql) {
            Log.error('modal '+name+' has error');
            return null;
        }
        if (!o.params) {
            Log.warning('modal '+name+' no params');
            this.sql = o.sql;
        }else {
            this.sql = o.sql;
            this.params = this.createParams(o.params);
        }
    }

    createParams(params: any[]):Param[] {
        var res = [];
        for (var i = 0; i < params.length; i++) {
            var param = params[i];
            if (param) {
                if ("string" == typeof param) {
                    res.push(new ParamString(param));
                } else if("object" == typeof param) {
                    if (param.files_upload) {
                        res.push( new ParamFiles(param));
                    } else if(param.parent_out) {
                        res.push( new ParamOutput(param));
                    } else if(param.id) {
                        res.push( new ParamId(param));
                    }
                }
            }
        }
        return res;
    }
    
    async prepare(data: Data) {
        for (var i = 0; i < this.params.length; i++){
            //data.value[this.params[i].get()] = await this.params[i].prepare(data);
            const value = await this.params[i].prepare(data);
            if(undefined !== value)
                data.value.push(value);
        }
    }
    async execute(data: Data) {
        for (var i = 0; i < this.params.length; i++){
            //data.value[this.params[i].get()] = await this.params[i].exectue(data);
            const value = await this.params[i].execute(data);
            if(undefined !== value)
                data.value.push(value);
        }
    }
}
