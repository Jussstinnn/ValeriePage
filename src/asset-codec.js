/* Lossless transport, not a new image encoding. Native PNG/WebP pixels remain unchanged. */
(() => {
 const alphabet='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!#$%()*+,-.:;=?@[]^_{|}',index=new Int16Array(128).fill(-1);for(let n=0;n<85;n++)index[alphabet.charCodeAt(n)]=n;
 function decode(text,bytes){if(!Number.isInteger(bytes)||bytes<0||bytes>100000000||text.length!==Math.ceil(bytes/4)*5)throw new Error('Recurso incorporado incompleto.');const out=new Uint8Array(bytes);for(let i=0,k=0;i<text.length;i+=5,k+=4){let value=0;for(let j=0;j<5;j++){const code=text.charCodeAt(i+j),digit=code<128?index[code]:-1;if(digit<0)throw new Error('Recurso incorporado no válido.');value=value*85+digit;}if(value>0xffffffff)throw new Error('Recurso incorporado fuera de rango.');for(let j=0;j<4&&k+j<bytes;j++)out[k+j]=(value>>>((3-j)*8))&255;}return out;}
 VF.AssetCodec={decode};
})();
