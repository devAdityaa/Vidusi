chrome.webNavigation.onCompleted.addListener((details)=>{
    if(details.url){
        if(details.url.includes("amazon.")){
            chrome.tabs.sendMessage(details.tabId,{
                type:'start',
                tabid:details.tabId,
                message:"amazon"
            })
        }
    }
})

chrome.runtime.onMessage.addListener((req,sen,res)=>{
    console.log("Received!",req)
if(req.type==='translate'){
    const headers = {
        'Content-Type': 'application/json',
        "Authorization":"jJMLg0c0QjUiXHb_D7DjRVU1vV9FEPc72XeaAeZ5G1FSwGXFJQPCm9oytt4orGkW"
    }

    const url = "https://dhruva-api.bhashini.gov.in/services/inference/pipeline"
    const body2 = {
        "pipelineTasks": [
            {
                "taskType": "translation",
                "config": {
                    "language": {
                        "sourceLanguage": "bn",
                        "targetLanguage": "en"
                    },
                    "serviceId": "ai4bharat/indictrans-v2-all-gpu--t4"
                }
            }
        ],
        "inputData": {
            "input": [
                {
                    "source": `${req.value}`
                }
            ],
            "audio": [
                {
                    "audioContent": null
                }
            ]
        }
    }
    fetch(url,{ method: 'POST', headers: headers, body: JSON.stringify(body2) }).then(ob => ob.json()).then(data => {
        const translated = data['pipelineResponse'][0]['output'][0]['target'];
        console.log(translated)
        console.log(sen)
        chrome.tabs.sendMessage(sen.tab.id,{type:'translated',translated:translated})
    })
}
})

chrome.webNavigation.onCompleted.addListener((details)=>{

    if(details.url.includes('amazon.com/s?k=')){
        chrome.tabs.sendMessage(details.tabId,{type:'search'});
    }
});