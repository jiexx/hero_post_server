import {Param} from './param';
import {Data} from './data';
import {Context} from '../context'
import { Log } from '../../common/log';


export class ParamOutput extends Param {
    public constructor(param: string) {
        super(param);
        this._param = param['parent_out'];
    }
    async prepare(data: Data){
    }
    async execute(data: Data){
        var input = data.output ? data.output[this._param] : undefined;
        var parent = <Data>data.parent;
        while (undefined == input && parent) {
            input = parent.output ? parent.output[this._param] : undefined;
            parent = <Data>parent.parent;
        }
        if (undefined != input) {
            return input;
        } else {
            Log.error('find input failed. modal may have error');
        }
    }
}

