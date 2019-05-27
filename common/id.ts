import shortid = require('shortid');
import uuidv4 = require('uuid/v4');

class Id {
    get short(){
        return shortid.generate()
    }
    get long(){
        return uuidv4();
    }
    get now(){
        return new Date().toLocaleString();
    }
    get today(){
        var d = new Date();
        return d.getFullYear()+'-'+("0"+(d.getMonth()+1)).slice(-2)+'-'+d.getDate();
    }
    get code(){
        return Math.floor(Math.random() * 10000);
    }
}
export const ID = new Id();