function handleMessage(request, sender, sendResponse) {
 if(request && request.action && request.action == "downloadBody"){
   browser.downloads.download({
	  filename: 'ChatGPT-log.json',
	  url: window.URL.createObjectURL(new Blob([ request.body ],{type : "text/plain;charset=utf-8"}))
   });
 }
}

browser.runtime.onMessage.addListener(handleMessage); 
