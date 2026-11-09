// Fixed ASCII alphabet: safe inside JSON and an inline HTML script, no executable markup.
export const alphabet='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!#$%()*+,-.:;=?@[]^_{|}';
export function encode(bytes){const out=Buffer.alloc(Math.ceil(bytes.length/4)*5);for(let i=0,k=0;i<bytes.length;i+=4,k+=5){let n=bytes[i]*0x1000000+(bytes[i+1]||0)*0x10000+(bytes[i+2]||0)*0x100+(bytes[i+3]||0);for(let j=4;j>=0;j--){out[k+j]=alphabet.charCodeAt(n%85);n=Math.floor(n/85);}}return out.toString('ascii');}
