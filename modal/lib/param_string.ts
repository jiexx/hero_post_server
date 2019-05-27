import {Param} from './param';
import {Data} from './data';
import {Context} from '../context'
import { Log } from '../../common/log';

export class ParamString extends Param {
    async prepare(data: Data){
        var input = data.input[this._param];
        var parent = <Data>data.parent;
        while (undefined == input && parent) {
            input = parent.input[this._param];
            parent = <Data>parent.parent;
        }
        if (undefined != input) {
            return input;
        } else {
            Log.error('find input failed. modal may have error');
        }
    }
    async execute(data: Data){
    }
}