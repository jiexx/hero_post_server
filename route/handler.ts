import { Router } from "./router";
import { Log } from "../common/log";
import { Singleton } from "../common/singleton";

export abstract class Handler extends Singleton{

    abstract async handle(path:string, q:any);

    protected abstract createRouter(path: string): Router;

    public routers(): Router[] {
        const path = '/'+ this.constructor.name.split(/(?=[A-Z])/).join("/").toLowerCase();
        return [this.createRouter(path)];
    };
};

// need auth
export abstract class AHandler extends Handler {
    abstract async handle(path:string, q:any);

    protected createRouter(path: string) : Router{
        return new Router(path, this, true);
    }
};

//not need auth
export abstract class UHandler extends Handler {
    abstract async handle(path:string, q:any);

    protected createRouter(path: string): Router{
        return new Router(path, this, false, true, true);
    }
};

export abstract class PatternAHandler extends Handler {
    abstract async handle(path:string, q:any);

    protected createRouter(path: string){
        return new Router(path, this, true, true, true, true);
    }
};
export abstract class PatternUHandler extends Handler {
    abstract async handle(path:string, q:any);

    protected createRouter(path: string){
        return new Router(path, this, false, true, true, true);
    }
};


export abstract class FileHandler extends Handler {

    public type: string = ''; 
    public base: string = '';   
    abstract async handle(path:string, q:any);

    protected createRouter(path: string){
        return new Router(path, this, false, true, true, true);
    }
};


