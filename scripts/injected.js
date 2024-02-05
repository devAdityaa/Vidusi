(()=>{
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
    })
})()