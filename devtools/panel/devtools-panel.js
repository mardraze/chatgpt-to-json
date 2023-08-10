/**
Handle errors from the injected script.
Errors may come from evaluating the JavaScript itself
or from the devtools framework.
See https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/devtools.inspectedWindow/eval#Return_value
*/

var chatGptLog = [];

function updateCounter(){
	document.getElementById("messages_count").textContent = chatGptLog.length + '';
}

document.getElementById("button_clear").addEventListener("click", () => {
	chatGptLog = [];
	updateCounter();
});
document.getElementById("button_download").addEventListener("click", () => {
  browser.runtime.sendMessage({
    action: "downloadBody",
    body: '['+chatGptLog.join(',')+']'
  });
});

function handleMessage(request, sender, sendResponse) {
  if (sender.url == browser.runtime.getURL("/devtools/devtools-page.html")) {
    if(request && request.action == 'saveChatGptLog'){
		for(var i=0; i<request.data.length; i++){
			chatGptLog.push(request.data[i]);
		}
		updateCounter();
	}
  }
}

browser.runtime.onMessage.addListener(handleMessage); 
