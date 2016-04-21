var clientId = '165219503046-uec4qg1cqbaok7fq754t4bcqbl90hj82.apps.googleusercontent.com'; 
var apiKey = 'hgCcpVqhENP26Rn2pbukoXjM'; 
var scopes = 'https://www.googleapis.com/auth/plus.me'; 

function handleClientLoad() { 
gapi.client.setApiKey(apiKey); 
window.setTimeout(checkAuth, 1); 
} 
function checkAuth() { 
gapi.auth.authorize({ client_id: clientId, scope: scopes, immediate: true }, handleAuthResult); 
} 

function handleAuthResult(authResult) { 
console.log(authResult); 
var authorizeButton = document.getElementById('authorize-button'); 
if (authResult && !authResult.error) { 
authorizeButton.style.visibility = 'hidden'; 

makeApiCall(); 
} else { 
document.getElementById('start-panel').style.visibility = ''; 
authorizeButton.style.visibility = ''; 
authorizeButton.onclick = handleAuthClick; 

} 
} 
function handleAuthClick(event) { 
gapi.auth.authorize({ client_id: clientId, scope: scopes, immediate: false }, handleAuthResult); 
return false; 
} 

function makeApiCall() { 
gapi.client.load('plus', 'v1', function () { 
var request = gapi.client.plus.people.get({ 
'userId': 'me' 
}); 
request.execute(function (resp) { 
console.log(resp); 


document.getElementById("hello").appendChild(document.createTextNode("Hello, " + resp.name.givenName)); 
document.getElementById("hello").style.color = 'antiquewhite'; 

}); 
}); 
}
