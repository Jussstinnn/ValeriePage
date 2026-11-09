// Every mandatory derivation is checked. Optional source variants are named explicitly.
export function change(source,needle,replacement){
 const found=typeof needle==='string'?source.includes(needle):(needle.lastIndex=0,needle.test(source));
 if(found&&typeof needle==='string'&&source.split(needle).length!==2)throw new Error('Ambiguous RC04 adapter marker: '+needle.slice(0,110));
 if(!found)throw new Error('Required RC04 adapter marker missing: '+String(needle).slice(0,110));
 if(needle instanceof RegExp)needle.lastIndex=0;
 return source.replace(needle,replacement);
}
export function changeAll(source,needle,replacement){
 if(!source.includes(needle))throw new Error('Required RC04 sampling marker missing: '+needle);
 return source.replaceAll(needle,replacement);
}
