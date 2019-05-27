import { registerFont, createCanvas,Image  } from "canvas";
import * as QR from "qr-image";

export class Canvas {
    loadImage(url: string) {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = err =>  reject(err);
          img.src = url;
        });
    }
    async draw(url, w = 600, h = 900,  b = 150) {
        let qr = QR.imageSync(url, { type: 'png',margin:1, size:10 });
        const img = await this.loadImage(qr) as Image;
        let canvas = createCanvas(w, h);
        let ctx = canvas.getContext('2d');
        ctx.fillStyle = '#439057';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, (w-img.width)/2, b);
        const txt = '长按二维码，点击“识别图中二维码”付款';
        ctx.font = "28px sans-serif";
        ctx.fillStyle = "white";
        ctx.fillText(txt, (w-ctx.measureText(txt).width)/2, img.height+b+100);
        ctx.fillStyle = 'white';
        ctx.fillRect(0, h-b, w, b);
        const title = '微信支付';
        ctx.fillStyle = "black";
        ctx.font = "42px sans-serif";
        ctx.fillText(title, (w-ctx.measureText(title).width)/2, h-b+100);
        return 'data:image/png;base64,'+canvas.toBuffer().toString('base64');
    }
}