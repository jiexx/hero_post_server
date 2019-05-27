import {Param} from './param';
import {Data} from './data';
import {Context} from '../context'
import { Log } from '../../common/log';
import { ID } from '../../common/id';


export class ParamId extends Param {
    public constructor(param: string) {
        super(param);
        this._param = param['id'];
    }
    
    async prepare(data: Data){

        if('short' == this._param) {
            return ID.short;
        }
        return ID.long;
    }
    async execute(data: Data){
    }
}

