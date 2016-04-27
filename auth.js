var CLIENT_ID = '121706767932-v6bt4jgv4kn3295p46kk46255g237njv.apps.googleusercontent.com';
var SCOPES = ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/plus.login'];

var metadata = {}; // file metadata for creating/updating
var appData = {}; // data for saving
var contentType = 'application/json';
var fileDefault = {}; // default source file with data	



/**
 * Called when the client library is loaded to start the auth flow.
 */

function handleClientLoad() {
    window.setTimeout(checkAuth, 1);
}


/**
 * Check if the current user has authorized the application.
 */
function checkAuth() {
    gapi.auth.authorize({'client_id': CLIENT_ID, 'scope': SCOPES[0], 'immediate': true}, handleAuthResult);
}

/**
 * Get user avatar
 */

function printAbout() {
    var request = gapi.client.drive.about.get();
    request.execute(function (resp) {
        document.getElementById('avatar').src = resp.user.picture.url;

        document.getElementById('avatar').style.visibility = 'visible';
    });
}


/**
 * Called when authorization server replies.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult(authResult) {

    var authButton = document.getElementById('authorizeButton');
    authButton.style.display = 'none';

    if (authResult && !authResult.error) {

        document.getElementById('loading').style.display = 'block';
        document.getElementById('taskInput').readOnly = true;
        gapi.client.load('drive', 'v2', function () {

            printAbout();
            getFile();
        });

    } else {
        authButton.style.display = 'block';

        authButton.onclick = function () {
            gapi.auth.authorize(
                    {'client_id': CLIENT_ID, 'scope': SCOPES[0], 'immediate': false},
            handleAuthResult);
        };
    }
}

function saveData() {
    metadata = getFileMetadata();
    checkFileExists(metadata.title, saveDataHandle);
}


function saveDataHandle(fileExists) {
    if (fileExists) {
        console.log('File already exists...');
        updateFile(fileExists);

    } else {
        console.log('Will create a new file...');
        createFile();
    }
}


function getFileMetadata() {
    return {
        'title': 'tasks',
        'mimeType': contentType
    }
}

function createFile() {
    console.log('Creating a new file (' + metadata.title + ') without data:');
            const boundary = '-------314159265358979323846264';
            const delimiter = "\r\n--" + boundary + "\r\n";
            const close_delim = "\r\n--" + boundary + "--";
            var base64Data = btoa(appData);
    var multipartRequestBody =
            delimiter +
            'Content-Type: application/json\r\n\r\n' +
            JSON.stringify(metadata) +
            delimiter +
            'Content-Type: ' + contentType + '\r\n' +
            'Content-Transfer-Encoding: base64\r\n' +
            '\r\n' +
            base64Data +
            close_delim;
    var request = gapi.client.request({
        'path': '/upload/drive/v2/files',
        'method': 'POST',
        'params': {'uploadType': 'multipart'},
        'headers': {
            'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
        },
        'body': multipartRequestBody});

    request.execute(function (res) {
        console.log('New file created! Fileinfo:');
        console.log(res);
        fileDefault.id = res.id;
        fileDefault.title = res.title;
        updateFile(fileDefault.id);
    });
}


function updateFile(fileId) {
    if (!fileId) {
        return;
    }
    console.log('Updating file (' + metadata.title + ') with data:');
    console.log(document.getElementById('json').value);
            const boundary = '-------314159265358979323846';
            const delimiter = "\r\n--" + boundary + "\r\n";
            const close_delim = "\r\n--" + boundary + "--";
            var base64Data = btoa(document.getElementById('json').value);
    var multipartRequestBody =
            delimiter +
            'Content-Type: application/json\r\n\r\n' +
            JSON.stringify(metadata) +
            delimiter +
            'Content-Type: ' + contentType + '\r\n' +
            'Content-Transfer-Encoding: base64\r\n' +
            '\r\n' +
            base64Data +
            close_delim;
    var request = gapi.client.request({
        'path': '/upload/drive/v2/files/' + fileId,
        'method': 'PUT',
        'params': {'uploadType': 'multipart', 'alt': 'json'},
        'headers': {
            'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
        },
        'body': multipartRequestBody});
    request.execute(function (res) {
        console.log('File successfully updated!');
    });
}


function findFile(fname) {

    var req = gapi.client.drive.files.list({q: "title='tasks'"});

    req.execute(function (r) {
        console.log('We are loading data...');

        if (r.items && r.items.length && r.items[0].id) {
            var request = gapi.client.drive.files.get({
                'fileId': r.items[0].id
            });
            request.execute(function (resp) {
                downloadFile(resp);
            });
        }

        else {
            document.getElementById('json').value = '';
            createFile();
        }

    });

}

function getFile() {
    metadata = getFileMetadata();
    findFile(metadata.title);
}


function downloadFile(file) {
    if (file.downloadUrl) {
        var accessToken = gapi.auth.getToken().access_token;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', file.downloadUrl);
        xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
        xhr.onload = function () {
            console.log('Data downloaded:')
            appData = xhr.responseText;
            document.getElementById('json').value = appData;
            console.log(appData);

            setTasks();
            document.getElementById('loading').style.display = 'none';
            document.getElementById('taskInput').readOnly = false;
        };
        xhr.onerror = function () {
            console.log('XHR error!');
        };
        xhr.send();
    } else {
        console.log('Can\'t download...');
    }
}



function checkFileExists(fname, callback) {

    var req = gapi.client.drive.files.list({q: "title='tasks'"});

    req.execute(function (r) {

        if (r.items && r.items.length && r.items[0].id) {
            callback(r.items[0].id);
        } else {
            callback();
        }
    });
}