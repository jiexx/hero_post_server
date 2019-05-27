import * as passport from "passport";
import jwt = require('jsonwebtoken');

import { Strategy, ExtractJwt } from "passport-jwt";
import { DBManager } from "../modal/db/database_manager";
import { Log } from "./log";
import { ERR } from "./result";
import { UHandler } from "../route/handler";
import { Router } from "../route/router";
import { Singleton } from "./singleton";

export class Signature extends Singleton {
    options = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: '123!@#'
    };
    constructor(){
        super();
        passport.use('logined', new Strategy(this.options, async (jwt_payload, next) => {
            Log.info('signature received '+jwt_payload.id);
            if(!jwt_payload.id){
                next(null, false);
                return;
            }
			try{
                const user = await DBManager.select('user', 'users', { ID: jwt_payload.id });
                if (user.length == 1) {
                    next(null, user[0]);
                }else {
                    next(null, false);
                }
            }catch(err){
                Log.error(err);
                next(null, false);
            }
		}));
    }
    sign(id: String) {
        var payload = {id: id};
        return jwt.sign(payload, this.options.secretOrKey);
    }

    get check() {
		return passport.authenticate('logined', { session: false }) ;
    };


}