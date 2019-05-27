

import { SelectSql, DeleteSql, InsertSql, UpdateSql, BulkInsertSql } from './sql';

export class DataBase {
    private master = null;
    private slaver = null;
    constructor(master:String, slaver:String){
        this.master = master;
        this.slaver = slaver;
    }
    
    select(table:String, where:Object) {
        return new SelectSql().prepare({ db: this.master, table: table }).and(where).complete();
    };
    delete(table:String, where:Object) {
        return new DeleteSql().prepare({ db: this.master, table: table }).and(where).complete();
    };
    insert(table, json) {
        return new InsertSql(json).prepare({ db: this.master, table: table }).complete();
    };
    bulkInsert(table, json){
        return new BulkInsertSql(json).prepare({ db: this.master, table: table }).complete();
    }
    update(table, json, where) {
        return new UpdateSql(json).prepare({ db: this.master, table: table }).and(where).complete();
    };

}

