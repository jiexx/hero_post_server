var ajax = { host: '' };
ajax.x = function () {
    if (typeof XMLHttpRequest !== 'undefined') {
        return new XMLHttpRequest();
    }
    var versions = [
        "MSXML2.XmlHttp.6.0",
        "MSXML2.XmlHttp.5.0",
        "MSXML2.XmlHttp.4.0",
        "MSXML2.XmlHttp.3.0",
        "MSXML2.XmlHttp.2.0",
        "Microsoft.XmlHttp"
    ];
    var xhr;
    for (var i = 0; i < versions.length; i++) {
        try {
            xhr = new ActiveXObject(versions[i]);
            break;
        }
        catch (e) {
        }
    }
    return xhr;
};
ajax.send = function (url, callback, method, data, async) {
    if (async === undefined) {
        async = true;
    }
    var x = ajax.x();
    x.open(method, ajax.host + url, async);
    x.onreadystatechange = function () {
        if (x.readyState == 4 && x.responseText) {
            var ct = x.getResponseHeader("content-type") || "";
            if (ct.indexOf('html') > -1) {
                document.open();
                document.write(x.responseText);
                document.close();
            }
            if (ct.indexOf('json') > -1) {
            // handle json here
                setTimeout(function(){
                    var r = JSON.parse(x.responseText);
                    if(r && r.data && r.data.image){
                        var img = document.createElement('img');
                        img.src = r.data.image;
                        document.open();
                        document.appendChild(img);
                        document.close();
                        if(r.data.confirm) {
                            localStorage.setItem('token',r.data.confirm.data.token);
                        }
                    }
                },0);
            }
            if (ct.indexOf('image') > -1){
                var img = document.createElement('img');
                img.src = x.responseText;
                document.open();
                document.appendChild(img);
                document.close();
            }
            if( !(typeof history.pushState === 'undefined')) {
                history.pushState( 
                    { url: document.URL, title: document.title}, 
                    document.title, // Can also use json.title to set previous page title on server
                    document.URL
                );
            }
            if(callback) {
                callback((x.responseText));
            }
        }
    };
    if (method == 'POST') {
        //x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        x.setRequestHeader('Content-type', 'application/json');
        x.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('token'));
    }
    x.send(data);
};

ajax.redirect = function(url, data) {
    ajax.send(url, null, 'POST', JSON.stringify(data));
}
ajax.confirm = function(url, data) {
    this.post(url,data, function(result){
        var r = JSON.parse(result);
        localStorage.setItem('token',r.data);
    })
}
ajax.post = function (url, data, callback, async) {
    ajax.send(url, callback, 'POST', JSON.stringify(data), async);
};
ajax.sign = function(){
    if(!localStorage.getItem('token')){
        this.post('auth/sign',{wx:navigator.userAgent.toLowerCase().indexOf('micromessenger')>-1}, function(result){
            var r = JSON.parse(result);
            localStorage.setItem('token',r.data);
        })
    }
}
ajax.host = 'http://127.0.0.1:8999/';
ajax.sign();