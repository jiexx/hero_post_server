//  exports.FDFS_HOST = "127.0.0.1";
//  exports.FDFS_PORT = "9900";
// exports.IMG_HOST_DIR = "./images";
// exports.HOST_DIR = { "html": './files', "htmlimg": './htmlimgs' };
// exports.IMG_URL = 'http://' + this.IMG_HOST + ':' + this.IMG_HOST_PORT + '/';
// exports.IMG_HOST_FDFS = false;
exports.MEDIA_HOST = {
    ADDR: "127.0.0.1",
    PORT: "8999",
    URL: 'http://127.0.0.1:8999/',
    FDFS_ENABLED: false,
    FDFS: "127.0.0.1",
    FDFS_PORT: "9900",
    DIRS: {
        "image/jpg": {
            PATH: "images/jpg/",
            PREFIX: "a",
            TYPE: "image/gif gz"
        },
        "image/png": {
            PATH: "images/png/",
            PREFIX: "b",
            TYPE: "image/png gz"
        },
        "image/jpeg": {
            PATH: "images/jpeg/",
            PREFIX: "c",
            TYPE: "image/gif gz"
        },
        "image/gif": {
            PATH: "images/gif/",
            PREFIX: "d",
            TYPE: "image/gif gz"
        },
        "image/svg": {
            PATH: "images/svg/",
            PREFIX: "e",
            TYPE: "image/svg+xml svg svgz"
        },
		"image/char": {
            PATH: "images/char/",
            PREFIX: "f",
            TYPE: "image/svg+xml svg svgz"
        },
        "image/caligraph": {
            PATH: "images/cali/",
            PREFIX: "g",
            TYPE: "image/png gz"
        },
        "image/pattern": {
            PATH: "images/pattern/",
            PREFIX: "h",
            TYPE: "image/svg+xml"
        },
        "image/resource": {
            PATH: "images/resource/",
            PREFIX: "i",
            TYPE: "image/svg+xml"
        },
        "text/html": {
            PATH: "text/html/",
            PREFIX: "j",
            TYPE: "text/html gz"
        },
        "html": {
            PATH: "text/html/",
            PREFIX: "k",
            TYPE: "text/html gz"
        },
        "poster": {
            PATH: 'poster/',
            PREFIX: "l",
            TYPE: "image/svg+xml svg svgz"
        },
        "food": {
            PATH: 'images/food/',
            PREFIX: "m",
            TYPE: "image/gif gz"
        },
        "life": {
            PATH: 'images/life/',
            PREFIX: "n",
            TYPE: "image/gif gz"
        },
    }
}
exports.ANONYMOUS_AVATAR = "data:image/svg+xml;utf8,%3Csvg%20viewBox%3D%27-27%2024%20100%20100%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20xmlns%3Axlink%3D%27http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%27%3E%3Cg%3E%3Cg%3E%3Cdefs%3E%3Ccircle%20cx%3D%2723%27%20cy%3D%2774%27%20id%3D%27circle%27%20r%3D%2750%27%2F%3E%3C%2Fdefs%3E%3Cuse%20fill%3D%27%23F5EEE5%27%20overflow%3D%27visible%27%20xlink%3Ahref%3D%27%23circle%27%2F%3E%3CclipPath%20id%3D%27circle_1_%27%3E%3Cuse%20overflow%3D%27visible%27%20xlink%3Ahref%3D%27%23circle%27%2F%3E%3C%2FclipPath%3E%3Cg%20clip-path%3D%27url%28%23circle_1_%29%27%3E%3Cdefs%3E%3Cpath%20d%3D%27M36%2C95.9c0%2C4%2C4.7%2C5.2%2C7.1%2C5.8c7.6%2C2%2C22.8%2C5.9%2C22.8%2C5.9c3.2%2C1.1%2C5.7%2C3.5%2C7.1%2C6.6v9.8H-27v-9.8%2Cc1.3-3.1%2C3.9-5.5%2C7.1-6.6c0%2C0%2C15.2-3.9%2C22.8-5.9c2.4-0.6%2C7.1-1.8%2C7.1-5.8c0-4%2C0-10.9%2C0-10.9h26C36%2C85%2C36%2C91.9%2C36%2C95.9z%27%20id%3D%27shoulders%27%2F%3E%3C%2Fdefs%3E%3Cuse%20fill%3D%27%23E6C19C%27%20overflow%3D%27visible%27%20xlink%3Ahref%3D%27%23shoulders%27%2F%3E%3CclipPath%20id%3D%27shoulders_1_%27%3E%3Cuse%20overflow%3D%27visible%27%20xlink%3Ahref%3D%27%23shoulders%27%2F%3E%3C%2FclipPath%3E%3Cpath%20clip-path%3D%27url%28%23shoulders_1_%29%27%20d%3D%27M23.2%2C35c0.1%2C0%2C0.1%2C0%2C0.2%2C0c0%2C0%2C0%2C0%2C0%2C0%20%20%20%20%20%20c3.3%2C0%2C8.2%2C0.2%2C11.4%2C2c3.3%2C1.9%2C7.3%2C5.6%2C8.5%2C12.1c2.4%2C13.7-2.1%2C35.4-6.3%2C42.4c-4%2C6.7-9.8%2C9.2-13.5%2C9.4c0%2C0-0.1%2C0-0.1%2C0%2Cc-0.1%2C0-0.1%2C0-0.2%2C0c-0.1%2C0-0.1%2C0-0.2%2C0c0%2C0-0.1%2C0-0.1%2C0c-3.7-0.2-9.5-2.7-13.5-9.4c-4.2-7-8.7-28.7-6.3-42.4%2Cc1.2-6.5%2C5.2-10.2%2C8.5-12.1c3.2-1.8%2C8.1-2%2C11.4-2c0%2C0%2C0%2C0%2C0%2C0C23.1%2C35%2C23.1%2C35%2C23.2%2C35L23.2%2C35z%27%20fill%3D%27%23D4B08C%27%20id%3D%27head-shadow%27%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3Cpath%20d%3D%27M22.6%2C40c19.1%2C0%2C20.7%2C13.8%2C20.8%2C15.1c1.1%2C11.9-3%2C28.1-6.8%2C33.7c-4%2C5.9-9.8%2C8.1-13.5%2C8.3%2Cc-0.2%2C0-0.2%2C0-0.3%2C0c-0.1%2C0-0.1%2C0-0.2%2C0C18.8%2C96.8%2C13%2C94.6%2C9%2C88.7c-3.8-5.6-7.9-21.8-6.8-33.8C2.3%2C53.7%2C3.5%2C40%2C22.6%2C40z%27%20fill%3D%27%23F2CEA5%27%20id%3D%27head%27%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E";



exports.DATA_HOST = "127.0.0.1"; //"114.55.139.196";
exports.DBUSER = "root";
exports.DBPWD = "Roger2019$%^";
exports.ORDERDB1 = "orders";
exports.ORDERDB2 = "orders_";
exports.USERDB1 = "users";
exports.USERDB2 = "users_";
exports.PRODCUTDB1 = "product";
exports.PRODCUTDB2 = "product_";
exports.HOST = "127.0.0.1";
exports.PORT = 8999;

exports.GDB = "ws://127.0.0.1:8182/gremlin";

exports.DOMAIN = "http://127.0.0.1:8999";

exports.APP_HOST = {
	ADDR: "127.0.0.1",
    PORT: "4200",
    URL: 'http://127.0.0.1:4200/',
};
exports.APP_DOMAIN = "http://127.0.0.1:4200/";

exports.ALIPAY = { host: "https://openapi.alipay.com/gateway.do", app_id: 2018090561306495, notify_url: "http://51tui.co/order/callback", pub_key: "-----BEGIN PUBLIC KEY-----\r\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvFKjd9uiKlWECHmwT78BnS9YleSCiU8CGDaSFisaKrd1zOHz7A2Bdj87Wnsd4Rv8fdiGHQtRu49jj+7GGRVjvmV/LHe9a2LgTm0OGoK/0cac9Ay1kp1VCN9ANXbauzQu/nxQ5UoJyvGNK8tIK8qKHkDJ2WMMxD9npPySEvCTAht8dkVY4KwMhysevQxSyIrfNnMSySFyJ5SkV2ZaNjmsisk/28uLDRh8u24M+xAC5e6rt9bu28fQvPhbwr86ImfK2esEBU4cMdBpfhNpWvfhG/u2bj0aH2IG/pRpxFVh+++PAbau+vjN3/yMbzVnWJRoelVOHTLmBCx+6v8j7E15mwIDAQAB-----END PUBLIC KEY-----\r\n", key: "-----BEGIN RSA PRIVATE KEY-----\r\nMIIEpQIBAAKCAQEArJCaP3Jmh97FiZ4nDMTJHf7YUn4q4dS5z2Rk/07F9TCD4z9XwMzTEsmpq40h97zTCoXHMWQdO0/pcj83CG218UD7yRWdPEPrdKTPTjklnpCaxVcEcojf2U5M10OIyDpR3CZX/mEytxKDuWuaWH92fGef+Ww7Gc6OSuTnSnoOsezoEs29Zd04lYlDHZlSBx6H0yos/rrL/ckA7ixpdBB6OfYyInHB5MEgwr1ZZhcCKrVIicDhIMqXO4BCQfpJ8alyKZA6PiGEc7h3rWyLiy8OXObqqN3t9zZLTnA3DzWKagJm/fl3D3H8czLGp83wCii4RsViVw+KUNURyXNDGF+6VwIDAQABAoIBAQCWQ+TNUuUNc2M4DsuaRtGKmRvt2Yel1wNmINoBp6qhc3mlLMdRUAqM1aY1iFQH0hlDlHJ8A92ghFmX7owRftdsGVYnJ/cfP1WM4ObUCtdDWFAtfzSUN7QVGiW3XUuCb6ZQueLt093BpRGnKJficDvQ4LthCmn8cu1dMi5loBujumXX1QjYSJF2kUKGX94KKxsC5JHG1zBTBXoPa3iJG84SevIaqMwITRSterv69gu4Ujd73vBtICchHS/OEVyitljXEqig8a0QWnI73UEaRLkQ6IIo9xEi6CQ7zessYTdI+zEO9f/cdXeqzsa9LL8I+DR2Ncr8kVHyeJb6QAh+jLHhAoGBANTeE0yiA+t5woFGsMXa3nsZ0ABvunJuiZu9hrYWSfHiCyVjkjhAZp+LGZIAWCOywtU5uXpUFu2oAR8UNxiMS28qgtX5UCFYRlWD9NEI3eSrlne4u6FWgK8eZ4QRnJsqzsM4+4slIrhJ4kJ4unqnuxtYSNLUEAfaTbK770d/4c1lAoGBAM+H7/aCkGOPSNMjf5ywj3r1wIC79qVqL6wCT22wZ2HBMCphjc+Us6lhoVT//y84vcmA/GIGvxdd5eC4J87Zku3aPAc3MD7Vk3X70ltbVecmmpiBTzPWxHiftGe5qVq39+WKbbJpytMdtkjz3WA4rVLwjtJbzt8Wm//1GVB09VsLAoGBAJNWi2E1myT4CEtW1LB+SBRIz5Idw53FKPZlfsK2NsR3w2NDwkexO9cefrpyBo/fAcB4zgr//UbOTMhoQ6J4KRZvBFR61p3d7gDu7xto2b2XjvSbJzQLHdMYZmohjpZQUQELhgDP2XJZoYSE7/5J7taEixNyuQ3WaoVWU87Xk0GJAoGAItbVR/LfPnd9aESbVbimPaQn7vSfEWHkIuI4Z1en41dFOLgr0F9MUfEb3mMjec/yvHM061fqmIeg4brIpAcOjXOHhEaViNbd7H6b785De4yVg2ih3Tf+v6k/5fHbJmmf6h71D3CHJi3kvhaCYXbiUfwkXdgfwH/RLIT+/OzFi8UCgYEArDUhqwO+jamijRlQvsMvI9rumFkPQFd+jOnLSbEY+3jIlCoXBnRPgenNqVXWKkaNl/VyhVXUDtCUUBcbStShrzQnyPY2IjROxDRp5YIweFxWQuym4WRuKGvfOAuekNOJb9tLMwkCuQ7CgMlptUmDn8RkvQi4PA0f1U8C41nPgig=\r\n-----END RSA PRIVATE KEY-----" };

exports.WXPAY = { app_id: 2018090561306495, notify_url: "http://51tui.co/order/callback", secret:"", mch_id:"" };