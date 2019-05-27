import {Joint} from './joint';
export class Extra {
    name: string = '';
    extra: any = null;
    constructor(name, extra) {
        this.name = name;
        this.extra = extra;
    }
}

export interface Visitor {
    visit(that: any, ext: Extra);
}

export class Depthor implements Visitor {
    d: number = -1;
    visit(that: any, ext: Extra) {
        var last = <number>ext.extra;
        last = null === last ? 0 : last + 1;
        this.d = last;
        return last;
    }
} 
export class Listor implements Visitor {
    list: any[] = [];
    visit(that: any, ext: Extra) {
        this.list.push(that);
        return this.list;
    }
} 
export class NamesVisitor implements Visitor {
    list: any = [];
    visit(that: any, ext: Extra) {
        this.list.push(ext.name);
        return this.list;
    }
} 

abstract class Traverse {
    protected abstract RDFS(that: any, extra: Extra, visitor: Visitor):any;
    protected abstract SDFS(that: any, visitor: Visitor):any;
    DFS(that: any, visitor: Visitor): any{
        return this.RDFS(that, new Extra('root', null), visitor );
    }
}
class ObjectTraverse extends Traverse {
    //recurisive depth first search
    RDFS(that: any, extra: Extra, visitor: Visitor) { 
        if (that && "object" == typeof that  && Array != that.constructor ) {
            var result = visitor.visit(that, extra); // (current, parent)
            for (var i in that) {
                if ("object" == typeof that[i] && Array != that[i].constructor) {
                    this.RDFS(that[i], new Extra(i, result), visitor);
                } 
            }
            return result;
        }
        return null;
    };
    //statck depth first search
    SDFS(that: any, visitor: Visitor) {  
        if (that && "object" == typeof that) {
            var stack = [];
            var result = null;
            stack.push({that:that, ext: new Extra('root',null)});
            while (stack.length > 0) {
                var q = stack.pop();
                result = visitor.visit(q.that, q.ext); // (current, parent)
                for (var i in q.that) {
                    if (q.that[i] && "object" == typeof q.that[i]) {
                        stack.push({that:q.that[i], ext: new Extra(i, result)});
                    } 
                } 
            }
            return result;
        }
        return null;
    };
}

class JointTraverse extends Traverse {
    //recurisive depth first search
    RDFS(that: any, extra: Extra, visitor: Visitor) { 
        var result = visitor.visit(that, extra); // (current, parent)
        for (var i in that.children) {
            this.RDFS(that.children[i], new Extra(that.children[i].name, result), visitor);
        }
        return result;
    };
    //statck depth first search
    SDFS(that: any, visitor: Visitor) {  
        var stack = [];
        var result = null;
        stack.push({that:that, ext:new Extra('root',null)});
        while (stack.length > 0) {
            var q = stack.pop();
            result = visitor.visit(q.that, q.ext); // (current, parent)
            for (var i in q.that.children) {
                stack.push({that:q.that.children[i], ext:new Extra(q.that.children[i].name, result)});
            } 
        }
        return result;
    };
}

export const ObjectTraverser = new ObjectTraverse();
export const JointTraverser = new JointTraverse();
