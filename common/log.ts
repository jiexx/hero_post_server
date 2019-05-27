import { ID } from "./id";

export class Log {
    static error(str: string) {
        console.log(ID.now, str);
    }
    static warning(str: string) {
        console.log(ID.now,str);
    }
    static info(str: string) {
        console.log(ID.now,str);
    }
}