browser.devtools.panels.create(
  "Chat GPT Log",
  "/icons/star.png",
  "/devtools/panel/panel.html"
).then((newPanel) => {
  var isPanelVisible = false;
  var chatGptLog = [];

function sendLog() {
  if(chatGptLog.length){
	  browser.runtime.sendMessage({
		action: "saveChatGptLog",
		data: chatGptLog
	  });
	  chatGptLog = [];
  }
}

  newPanel.onShown.addListener(function() {
	  isPanelVisible = true;
	  sendLog();
  });
  
  newPanel.onHidden.addListener(function() {
	  isPanelVisible = false;
  });
  
function logChatGptResponse(request, response) {
	var arr = response.split("\n");
	for(var i=arr.length-1; i>=0; i--){
		if(arr[i].indexOf('"is_complete": true') !== -1){
			var resp = arr[i].substr(6)
		  chatGptLog.push('['+request+','+resp+']');
		  if(isPanelVisible){
			sendLog();
		  }
		  break;
		}
		
	}
	
}
  
function handleRequestFinished(req) {
	if(req.request && req.request.url == 'https://chat.openai.com/backend-api/conversation' && req.request.postData){
		var requestText = req.request.postData.text;
  	    req.getContent().then(([content, mimeType]) => {
			logChatGptResponse(requestText, content);
		});
	}
}

browser.devtools.network.onRequestFinished.addListener(handleRequestFinished);

}); 
