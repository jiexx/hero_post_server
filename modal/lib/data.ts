import {Joint} from './joint';
import { Extra, Visitor } from './traverse';

export class EqualLevelDataCreator implements Visitor {
    visit(that: any, ext: Extra){
        var parent = <Data>ext.extra;
        var child = new Data(ext.name, parent, that);
        if(parent){
            parent.addChild(child)
        }
        return child;
    }
}

export class ZeroLevelDataCreator implements Visitor {
    data: Object = null;
    constructor(data: Object){
        this.data = data;
    }
    visit(that: any, ext: Extra){
        var parent = <Data>ext.extra;
        var child = new Data(ext.name, parent, this.data);
        if(parent){
            parent.addChild(child)
        }
        return child;
    }
}

export class LessLevelDataCreator implements Visitor {
    list: Data[] = null;
    constructor(list: Data[] = null){
        this.list = list;
    }
    visit(that: any, ext: Extra){
        var parent = <Data>ext.extra;
        var d = this.list.find(val => {
            return val.name == that.name;
        })
        var child =!d ? new Data(ext.name, parent, {}) : new Data(ext.name, parent, d.input);
        if(parent){
            parent.addChild(child)
        }
        return child;
    }
}

export class Data extends Joint {
    input: any = null;
    value: any[] = [];
    output: any = null;
    constructor(name:string, parent:Joint, input: Object) {
        super(name,parent);
        this.input = input;
    }
}