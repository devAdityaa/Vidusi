const translateSearchResultsText =()=>{
    console.log("Trigger 1")
    const orientationType1 = document.querySelectorAll('div > div > div > div > span > div > div > div.a-section.a-spacing-small.puis-padding-left-small.puis-padding-right-small > div.a-section.a-spacing-none.a-spacing-top-small.s-title-instructions-style > h2');
    const orientationType2 = document.querySelectorAll('div > div > span > div > div > div > div.puisg-col.puisg-col-4-of-12.puisg-col-8-of-16.puisg-col-12-of-20.puisg-col-12-of-24.puis-list-col-right > div > div > div.a-section.a-spacing-none.puis-padding-right-small.s-title-instructions-style > h2');

    const htmlElements = orientationType1.length!=0? orientationType1:orientationType2;
console.log(htmlElements,orientationType1,orientationType2)
        const textElements = Array.from(htmlElements, element => element.innerText)
    let e = chrome.runtime.sendMessage({type:'translate-items', value:JSON.stringify(textElements)})
}

const insertTranslatedText = (textElements)=>{
    const orientationType1 = document.querySelectorAll('div > div > div > div > span > div > div > div.a-section.a-spacing-small.puis-padding-left-small.puis-padding-right-small > div.a-section.a-spacing-none.a-spacing-top-small.s-title-instructions-style > h2');
    const orientationType2 = document.querySelectorAll('div > div > span > div > div > div > div.puisg-col.puisg-col-4-of-12.puisg-col-8-of-16.puisg-col-12-of-20.puisg-col-12-of-24.puis-list-col-right > div > div > div.a-section.a-spacing-none.puis-padding-right-small.s-title-instructions-style > h2');
    const htmlElements = orientationType1.length!=0? orientationType1:orientationType2;
    htmlElements.forEach((element,index)=>{
        element.innerText = textElements[index];
    })

}



(()=>{
window.addEventListener('load',()=>{
        chrome.runtime.onMessage.addListener((req,res)=>{

    console.log("Injected!")
    if(req.type==='start'){
    const submit = document.querySelector('#nav-search-bar-form > div.nav-right > div');
    submit.setAttribute("style","display:none")
    if(!(document.getElementById('bhasa'))){
        const newSubmit = document.createElement('button');
        newSubmit.innerText = "Search";
        newSubmit.id = "bhasa";
        document.querySelector('#nav-search').appendChild(newSubmit);
    }

    const btn = document.getElementById('bhasa');
   
    btn.addEventListener('click',()=>{
        const form = document.querySelector('#twotabsearchtextbox');
        let val = form.value;
        chrome.runtime.sendMessage({type:'translate',value:val,id:req.tabId});
        
    })
}
else if(req.type==='translated'){
    console.log("Res",req)
    const form = document.querySelector('#twotabsearchtextbox');
    form.value = req.translated;
    const actualBtn = document.querySelector('#nav-search-submit-button');
    actualBtn.click();
    const res = document.querySelector('#search');
    res.style.opacity = 0.2;
    
}

else if(req.type==='search'){
    const res = document.querySelector('#search');
    res.style.opacity = 0.2;
    const img = document.createElement('img');
    console.log("URL:")
    console.log(chrome.runtime.getURL('loader.gif'))
    img.src = chrome.runtime.getURL('./assets/loader.gif');
    img.id = 'loader';
    res.appendChild(img);
    console.log("Trigger 0")
    translateSearchResultsText()
}
else if(req.type==='translated-items'){
    console.log("Trigger 4")
    const a = JSON.parse(req.translated)
    console.log(a)
    insertTranslatedText(a);
    const loader = document.getElementById('loader');
    const res = document.querySelector('#search');
    res.style.opacity = 1;
    loader.remove();
}
})

    })
        })()