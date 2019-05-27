import { JointTraverser } from "./traverse";

export class Joint{
    protected _parent: Joint = null;
    protected _children: Joint[] = [];
    public name: string = null;
    constructor(name: string, parent: Joint) {
        this.name = name;
        this._parent = parent;
    }
    setParent(p: Joint) {
        this._parent = p;
    }
    get parent() {
        return this._parent;
    }
    addChild(p: Joint) {
        this._children.push(p);
    }
    get children() {
        return this._children;
    }
}