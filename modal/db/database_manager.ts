import mysql = require('mysql');
import * as util from 'util';
import config = require('../../config');
import { DataBase } from './database';
import { ID } from '../../common/id';

class DataBaseManager {
    pool = mysql.createPool({
        host: config.DATA_HOST,
        user: config.DBUSER,
        password: config.DBPWD,
        connectionLimit: 500,
        queryFormat: function(query, values) {

            if (!values) return query;
            var i = 0;
            var q = query.replace(/\?|n\?|i?|I?/g, function(txt, key) {
                if (txt == '?') {
                    return "\'" + values[i++] + "\'";
                } else if (txt == 'n?') {
                    return values[i++];
                } else if (txt == 'i?') {
                    return "\'" + ID.short + "\'";
                }else if(txt == 'I?') {
                    return "\'" + ID.long + "\'";
                }
                return txt;
            });
            return q;
        }
    });
    private dbs: DataBase[] = [];
    constructor(){
        this.pool.getConnection((err, connection) => {
            if (err) {
                if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                    console.error('Database connection was closed.')
                }
                if (err.code === 'ER_CON_COUNT_ERROR') {
                    console.error('Database has too many connections.')
                }
                if (err.code === 'ECONNREFUSED') {
                    console.error('Database connection was refused.')
                }
            }
            if (connection) connection.release()
            return
        })
        this.pool.query = util.promisify(this.pool.query);

        this.dbs['user'] = new DataBase(config.USERDB1, config.USERDB2);
        this.dbs['order'] = new DataBase(config.ORDERDB1, config.ORDERDB2);
        this.dbs['product'] = new DataBase(config.PRODCUTDB1, config.PRODCUTDB2);
        this.dbs['posters']= new DataBase('posters', 'posters_');
    }

    async exec(sql: string, params: Object){
        return await this.pool.query(sql, params);
    }

    async insert(db: string, table: String, params: Object){
        if(!params['ID']){
            params['ID'] = ID.long;
        }
        var sql = this.dbs[db].insert(table, params);
        let result = await this.pool.query(sql);
        result['UUID'] = params['ID'];
        return result;
    }

    getBulkInsert(db: string, table: String, params: Object[]){
        var param = params.map((v,i)=>{if(!v['ID']) v['ID'] = ID.long; return v});
        var sql = this.dbs[db].bulkInsert(table, param);
        return sql;
    }

    async bulkInsert(db: string, table: String, params: Object[]){
        var param = params.map((v,i)=>{if(!v['ID']) v['ID'] = ID.long; return v});
        var sql = this.dbs[db].bulkInsert(table, param);
        let result = await this.pool.query(sql);
        if(Array.isArray(result)){
            result = result.map((v,i)=>{v['UUID'] = param[i]['ID']; return v;})
        }
        return result;
    }

    async delete(db: string, table: String, where: Object){
        var sql = this.dbs[db].delete(table, where);
        return await this.pool.query(sql);
    }

    async update(db: string, table: String, params: Object, where: Object){
        var sql = this.dbs[db].update(table, params, where);
        return await this.pool.query(sql);
    }

    async select(db: string, table: String, where: Object){
        var sql = this.dbs[db].select(table, where);
        return await this.pool.query(sql);
    }

}

export const DBManager = new DataBaseManager(); 