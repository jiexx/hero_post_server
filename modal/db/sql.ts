class SQL {
    protected sql: string = null;
    prepare(json: Object): SQL {
        for(var i in json) {
            var r1 = new RegExp('{'+i+'}', '');
            this.sql = this.sql.replace(r1, json[i]);
        }
        return this;
    };
    and(json: Object): SQL {
        if(this.sql.indexOf('WHERE')<0) {
            this.sql += ' WHERE ';
            for(var i in json) {
                this.sql += i+'="'+json[i]+'" AND ';
            }
            this.sql = this.sql.substr(0,this.sql.length-4);
        }else {
            for(var i in json) {
                this.sql += ' AND '+i+'="'+json[i]+'" ';
            }
        }
        return this;
    };
    or(json: Object): SQL {
        if(this.sql.indexOf('WHERE')<0) {
            this.sql += ' WHERE ';
            for(var i in json) {
                this.sql += i+'="'+json[i]+'" OR ';
            }
            this.sql = this.sql.substr(0,this.sql.length-3);
        }else {
            for(var i in json) {
                this.sql += ' OR '+i+'="'+json[i]+'" ';
            }
        }
        return this;
    }
    complete(json: Object = null){
        return this.sql;
    }
}

export class InsertSql extends SQL {
    constructor(json: Object){
        super();
        var fields = '', values = '';
        for(var i in json) {
            fields += i+',';
            if(json[i]=='#i'){
                values += json[i]+',';
            }else{
                values += '"'+json[i]+'",';
            }
        }
        fields = fields.substr(0, fields.length - 1);
        values = values.substr(0, values.length - 1);
        this.sql = 'INSERT INTO {db}.{table} ('+fields+') VALUES ('+values+');';
    }
}

export class BulkInsertSql extends SQL {
    constructor(bulk: Object[]){
        super();
        const fields = Object.keys(bulk[0]);
        const values = bulk.map((v,i)=>{return "('"+Object.values(v).join("','")+"')"}).join(",");
        this.sql = 'INSERT INTO {db}.{table} ('+fields+') VALUES '+values+';';
    }
}

export class UpdateSql extends SQL {
    constructor(json: Object){
        super();
        this.sql = 'UPDATE {db}.{table} SET ';
        var fieldvalue = '';
        for(var i in json) {
            fieldvalue += i+'="'+json[i]+'",';
        }
        fieldvalue = fieldvalue.substr(0, fieldvalue.length - 1);
        this.sql = 'UPDATE {db}.{table} SET ' + fieldvalue;
    }
}

export class SelectSql extends SQL {
    constructor(){
        super();
        this.sql = 'SELECT * FROM {db}.{table} ';
    }
}

export class DeleteSql extends SQL {
    constructor(){
        super();
        this.sql = 'DELETE FROM {db}.{table} ';
    }
}