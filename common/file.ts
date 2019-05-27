import * as fs from 'fs';
import * as path from 'path';

import config = require('../config');

import * as request from 'request-promise-native';

import util = require('util');
import { ID } from './id';

//const requestPost = util.promisify(request.post);
//const requestGet = util.promisify(request);

export class File {
    static load(location: any): string[]{
        var files:any = [];
        if('string' == typeof location){
            
            const filenames = fs.readdirSync(location);
            filenames.forEach(function(filename,index) {
                var content =  fs.readFileSync(path.resolve(location, filename), 'utf-8');
                var point = '/' + filename.substring(0, filename.indexOf('.')).replace(/-/g, '/');
                files[point] = content;
            });
            
        }else if(Array == location.constructor){
            for(var i in location){
                const filenames = fs.readdirSync(location[i]);
                filenames.forEach(function(filename,index) {
                    var content =  fs.readFileSync(path.resolve(location[i], filename), 'utf-8');
                    var point = '/' + filename.substring(0, filename.indexOf('.')).replace(/-|_/g, '/');
                    files[point] = content;
                });
            }
        }
        return files;
    }
    static async upload(base64: string){
        const result = await request.post({
                    url: config.MEDIA_HOST.URL+"upload",
                    method: "POST",
                    json: {
                        file: base64,
                    }
                });
        return result.body;
    }

    static async forwardSvg(fd: string,title: string){
        const result = await request.get( config.MEDIA_HOST.URL+"svg?fd="+fd+"&title="+title,{json: true});
        return result.body;
    }


    static htmlbase64(str: string){
        return 'data:text/html;base64,'+Buffer.from(str).toString('base64');
    }

    static media_url(fileId: string){
        return config.MEDIA_HOST.URL+fileId;
    }
    static deurl(url: string){
        return url.substr(config.MEDIA_HOST.URL.length);
    }

    static makeFileDesc = function (type) {
        var dir = config.MEDIA_HOST.DIRS[String(type)];
        var fd = dir.PREFIX+ID.short;
        var path = dir.PATH+fd;
        return {fd: fd, path: path};
    };

    static extractFileDesc = function (fd) {
        var dirs = config.MEDIA_HOST.DIRS;
        var key, path, prefix;
        for(key in dirs) {
            prefix = dirs[key].PREFIX
            if(fd.indexOf(prefix) == 0){
                path = dirs[key].PATH + fd;
                return {type: key, path: path};
            }
        }
    };
    static deBase64 (data:string) {
        //////console.log(dataString);
        let matches = data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      
        if (!matches || matches.length !== 3) {
          return new Error('Invalid input string');
        }
      
        return {type:matches[1], data:  Buffer.from(matches[2], 'base64')};
    }
      
    static enBase64(data:string) {
        return   Buffer.from(data).toString('base64');
    }

}