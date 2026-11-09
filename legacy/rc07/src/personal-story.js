/* Optional real words from the author. Empty fields keep the existing story.
   Edit these values, then npm run build. Never invent private anecdotes. */
window.VPersonalStory={
 chapterLines:{vineyard:'',rabbit:'',mushroom:'',museum:'',couple:'',lily:'',memory07:'',memory08:'',memory09:''},
 flowerDedications:Array(14).fill(''),
 letterParagraphs:['','',''],
 signature:''
};
for(const chapter of window.VStory.chapters){const text=window.VPersonalStory.chapterLines[chapter.id];if(text?.trim())chapter.line=text;chapter.editorial={...chapter.editorial,persist:true,minSeconds:Math.max(18,9+(chapter.line||'').split(' ').length*.55)};}
window.VPersonalStory.flowerDedications.forEach((text,i)=>{if(text.trim())window.VStory.gardenDedications[i]=text;});
window.VPersonalStory.letterParagraphs.forEach((text,i)=>{if(text.trim())window.VStory.letter[i].text=text;});
if(window.VPersonalStory.signature.trim())window.VStory.signature=window.VPersonalStory.signature;
