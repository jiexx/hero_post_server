import {Param} from './param';
import {Data} from './data';
import {Context} from '../context';
import { Log } from '../../common/log';

export class ParamFiles extends Param {
    public constructor(param: string) {
        super(param);
        this._param = param['files_upload'];
    }
    async prepare(data: Data){
        try {
            const fid = 'test';
            return fid;
        } catch (err) {
            Log.error('upload failed. ' + err);
        }
    }
    async execute(data: Data){
    }

        
}
