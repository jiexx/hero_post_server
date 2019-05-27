
const { Worker, isMainThread } = require('worker_threads');

var task = `
    const {parentPort} = require("worker_threads");
    var runnable = require("./bin/app/my/runnable.js");
    runnable(parentPort);
`;


export class ThreadTask {
    private worker: any;
    public result: any;
    constructor(protected data: Object,private runnable:string){
        process.setMaxListeners(0);
        this.worker = new Worker(task,{eval:true});
        
    };
    _start(done: Function) {
        this.worker.on('message',(msg) => {
            var m = JSON.parse(msg);
            console.log(m.msg);
            if(m.code=='done'){
                if(done) done();
            }
        });
        this.worker.postMessage(JSON.stringify(this.data));       
    }
}

export class  TaskManager{
    constructor(public tasks: ThreadTask[] = []){
    }
    add(runnable:string, data:Object){
        this.tasks.push(new ThreadTask(data, runnable));
    }
    clean(){
        this.tasks.forEach(t=>{
            t.result == null;
        })
        for(var i = 0; i< this.tasks.length ; i ++)
            this.tasks.pop();
    }
    async run(){
        //if(isMainThread) {
            let prs = [];
            this.tasks.forEach(task =>{
                let pr = new Promise(function(resolve, reject) {
                    task._start( ()=>{
                         if(resolve) resolve();
                    });
                });
                prs.push(pr);
            })
            return Promise.all(prs);
        //}
    }
}

