chrome.webNavigation.onCompleted.addListener((details)=>{
    if(details.url){
        if(details.url.includes("amazon.")){
console.log("Start")
                        chrome.tabs.sendMessage(details.tabId,{
                type:'start',
                tabid:details.tabId,
                message:"amazon"
            })
        }
    }
})

chrome.runtime.onMessage.addListener(async (req,sen,res)=>{
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
                        "sourceLanguage": "hi",
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
else if(req.type==='translate-items'){
    console.log("Trigger 2")
    console.log("Received items")
    const headers = {
        'Content-Type': 'application/json',
        "Authorization":"jJMLg0c0QjUiXHb_D7DjRVU1vV9FEPc72XeaAeZ5G1FSwGXFJQPCm9oytt4orGkW"
    }
    const url = "https://dhruva-api.bhashini.gov.in/services/inference/pipeline"
    const elements = JSON.parse(req.value);
    console.log("Items array:", elements)
    let e=[]
    for(let i=0;i<elements.length;i++){
        
        const body2 = {
            "pipelineTasks": [
                {
                    "taskType": "translation",
                    "config": {
                        "language": {
                            "sourceLanguage": "en",
                            "targetLanguage": "hi"
                        },
                        "serviceId": "ai4bharat/indictrans-v2-all-gpu--t4"
                    }
                }
            ],
            "inputData": {
                "input": [
                    {
                        "source": `${elements[i]}`
                    }
                ],
                "audio": [
                    {
                        "audioContent": null
                    }
                ]
            }
        }
        let data = await fetch(url,{ method: 'POST', headers: headers, body: JSON.stringify(body2) }).then(ob => ob.json()).then(data => {
            const translated = data['pipelineResponse'][0]['output'][0]['target'];
            return translated
        })
        console.log(data)
        e.push(data)
    }
    chrome.tabs.sendMessage(sen.tab.id, {type:'translated-items', translated:JSON.stringify(e)})

}
})

chrome.webNavigation.onCompleted.addListener((details)=>{

    if(details.url.includes('amazon.com/s?k=')){
        chrome.tabs.sendMessage(details.tabId,{type:'search'});
    }
});