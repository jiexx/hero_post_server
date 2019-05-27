import { Data } from './data';
import { ParamString } from './param_string';
import { ParamFiles } from './param_files';
import { ParamOutput } from './param_ouput';

export abstract class Param {
    protected _param: string = null;
    public constructor(param: string) {
        this._param = param;
    }
    public get() {
        return this._param;
    }
    abstract async prepare(data: Data);
    abstract async execute(data: Data);
}