
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as multer from 'multer';
import * as fs from 'fs';
import * as sharp from 'sharp';
import { CronJob } from 'cron';


import { Router } from "./route/router";
import { Log } from './common/log';
import { Context } from './modal/context';
import { Handler } from './route/handler';
import { AuthCheckin } from './app/auth_checkin';
import { AuthSign } from './app/auth_sign';

import config = require('./config');
import { AuthApply } from './app/auth_apply';
import { AuthConfirm } from './app/auth_confirm';
import { AuthCheckout } from './app/auth_checkout';
import { AuthUser } from './app/auth_user';
import { MyProfile } from './app/my/my_profile';
import { CharImage } from './app/image/char_image';
import { File } from './common/file';
import { ID } from './common/id';
import { Files } from './app/image/files';
import { PosterUpload } from './app/image/poster_upload';
import { PosterDown } from './app/image/poster_down';
import { Pay } from './app/pay/pay';
import { PosterPublish } from './app/image/poster_publish';
import { Qrcode } from './app/image/qrcode';




const app = express();
app.use('/', express.static('./assets'));
//app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '50mb' })); // for parsing application/json
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); // for parsing application/x-www-form-urlencoded
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
    if (req.method == 'OPTIONS') {
        res.send(200);
    }else {
        next();
    }
});



const HandlerFactory : Handler[] = [
    Context.instance,
    AuthApply.instance,
    AuthCheckin.instance,
    AuthCheckout.instance,
    AuthConfirm.instance,
    AuthSign.instance,
    AuthUser.instance,
    MyProfile.instance,
    Files.instance,
    PosterUpload.instance,
    PosterDown.instance,
    PosterPublish.instance,
    Pay.instance,
    Qrcode.instance
];

// register all application routes
HandlerFactory.forEach(handler => {
    var h = <Handler>handler;
    var routers:Router[] = h.routers();
    routers.forEach(router => {
        router.process(app);
    })
});
// run app
var server = app.listen(config.PORT, () => {
    // Success callback
    
    console.log('Listening at http://localhost:'+config.PORT);

});
//const upload = multer({ dest: 'uploads/' }); 
//app.post('/upload', upload.array(), function (req, res) {
//    
//    let  b : any = File.deBase64(req.body.file);
//    var desc = File.makeFileDesc(b.type);
//
//    fs.writeFile(desc.path, b.data, (err) =>{
//        if(!err){
//            res.json({ code: 'OK', msg: '', data: desc.fd });
//            Log.info('OK upload '+desc.fd);
//        }else {
//            res.json({ code: 'ERR', msg: '写失败', data: null });
//            Log.error(err.message);
//        }
//    });
//});

// app.get("/f/:fileId", upload.array(), async function (req, res) {
//     var fd = req.params.fileId;
//     //var token = req.params.token;
//     var desc = File.extractFileDesc(fd);
//     if(desc.type.indexOf('image') > -1){
//         if(!fs.existsSync(desc.path)){
//             var matches = fd.match(/^([^_]+)_([^x]*)x(.*)$/);
//             if (!matches || matches.length !== 4 || !fs.existsSync(matches[1])) {
//                 res.json({ code: 'ERR', msg: '文件不存在', data: null });
//             }else if(!matches[2] || !matches[3]){
//                 res.header("Content-Type", "image/gif");
//                 res.sendFile(desc.path,{ root: "." });
//             }else {
//                 var w = parseInt(matches[2]), h = parseInt(matches[3]);
//                 sharp(matches[1]).resize(w, h)
//                 .toFile(desc.path, (err, info) => {
//                     if(!err){
//                         res.header("Content-Type", "image/gif");
//                         res.sendFile(desc.path,{ root: "." });
//                     }else{
//                         res.json({ code: 'ERR', msg: '文件不存在', data: null });
//                     }
//                 });
//             }
//         }else{
//             if(desc.type.indexOf('svg') > -1) {
//                 //res.header("Content-Type", "image/svg+xml svg svgz");
//                 res.header("Content-Type", "text/html");
//                 //res.header('Content-Encoding', 'gzip')
//                 //res.header("Content-Type", "image/svg+xml");
//             }else{
//                 res.header("Content-Type", "image/gif");
//             }
//             res.sendFile(desc.path,{ root: "." });
//         }
//     }else if(desc.type.indexOf('text') > -1){
//         if(!fs.existsSync(desc.path)){
//             res.json({ code: 'ERR', msg: '文件不存在', data: null });
//         }else{
//             res.header('Content-Type', 'text/html');
//             res.sendFile(desc.path,{ root: "." });
//         }
//     }
    // else if(desc.type.indexOf('share') > -1){
    //     try {
    //         var result =  await g.E().hasLabel(fd).values('posterid').next();//await g.E().hasLabel(fd).inV().repeat(__.in_()).until(__.has('posterid')).values('posterid').next();
    //         if(result && result.value){
    //             desc = File.extractFileDesc(result.value);
    //             if(!fs.existsSync(desc.path)){
    //                 res.json({ code: 'ERR', msg: '文件不存在', data: null });
    //             }else{
    //                 res.header('Content-Type', 'text/html');
    //                 res.sendFile(desc.path,{ root: __dirname });
    //             }
    //         }else {
    //             res.json({ code: 'ERR', msg: 'shareid', data: null });
    //         }
    //     } catch (error) {
    //         // Runs if user.profile() rejects
    //         return res.status(500);
    //     }
    // }
    
//});

const job = new CronJob('00 */120 * * * 1-5', function() {
    const d = new Date();
    //StockDailyR0ger.instance.handle('/stock/daily',{});
	console.log('CronJob:', d);
});
job.start();