import { DBManager } from "../../modal/db/database_manager";

import * as util from "util"
import * as request from "request-promise-native";
import * as querystring from "querystring";

//const requestPost = util.promisify(request.post);

module.exports = (that)=>{
    that.once('message', async (msg) => {
        var data = JSON.parse(msg);
        //require("fs").writeFileSync("workers.txt", " runnable : "+msg);
        var obj = {
            isPagination: true,
            sqlId: 'COMMON_SSE_XXPL_CXJL_SSGSGFBDQK_S',
            'pageHelp.pageSize': data.pageSize,
            'pageHelp.pageNo': data.index,
            'pageHelp.beginPage': data.index,
            'pageHelp.cacheSize':1
        }

        var url = 'http://query.sse.com.cn/commonQuery.do?'+querystring.stringify(obj);
        var result = await request.post({ url: url, method: "POST", headers:{Referer:'http://www.sse.com.cn/disclosure/credibility/supervision/change/'}});
        require("fs").appendFileSync("workers.txt", " \r\n runnable : "+url);
        if(result && result.body){
            var r = JSON.parse(result.body);
            try{
                const stock = await DBManager.bulkInsert('stock','shares_change', r.result);
                if (stock.affectedRows == r.result.length) {
                    that.postMessage(JSON.stringify({code:'done',msg:'RUNNABLE['+data.index+'] done bulkInsert len:'+stock.affectedRows+' == result len:'+r.result.length+' total:'+r.pageHelp.total}));
                }else {
                    that.postMessage(JSON.stringify({code:'warning',msg:'RUNNABLE['+data.index+'] bulkInsert len:'+stock.affectedRows+' <> result len:'+r.result.length+' total:'+r.pageHelp.total}));
                }
            }catch(e){
                that.postMessage(JSON.stringify({code:'done',msg:'RUNNABLE['+data.index+'] error '+e}));
            }
            
        }
        
    });
}