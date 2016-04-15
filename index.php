<!DOCTYPE html>
<html>
    <head>
        <title>Task Manager</title>
        <meta charset="UTF-8">
        <link rel="stylesheet" href="style.css"/>        
        <link rel ="stylesheet" href="jquery-ui-1.11.4.custom/jquery-ui.css">
        <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">

        <script src="jquery-2.2.1.js"></script>
        <script src="jquery-ui-1.11.4.custom/jquery-ui.js"></script>
        <script src="jquery-ui-1.11.4.custom/jquery-ui.min.js"></script>

        <script async src="taskManager.js"></script>
		
    </head>
    <body>	
		
		<?php
$client_id = '165219503046-uec4qg1cqbaok7fq754t4bcqbl90hj82.apps.googleusercontent.com';
$client_secret = 'hgCcpVqhENP26Rn2pbukoXjM'; // Client secret
$redirect_uri = 'http://my/index.php'; // Redirect URI

$url = 'https://accounts.google.com/o/oauth2/auth';

$params = array(
    'redirect_uri'  => $redirect_uri,
    'response_type' => 'code',
    'client_id'     => $client_id,
    'scope'         => 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
);

echo $link = '<p><a href="' . $url . '?' . urldecode(http_build_query($params)) . '">Аутентификация через Google</a></p>';

if (isset($_GET['code'])) {
	$result = false;

    $params = array(
        'client_id'     => $client_id,
        'client_secret' => $client_secret,
        'redirect_uri'  => $redirect_uri,
        'grant_type'    => 'authorization_code',
        'code'          => $_GET['code']
    );

	$url = 'https://accounts.google.com/o/oauth2/token';
	
	$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, trim($url));
curl_setopt($curl, CURLOPT_POST, 1);
curl_setopt($curl, CURLOPT_POSTFIELDS, urldecode(http_build_query($params)));
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
$result = curl_exec($curl);
curl_close($curl);

$tokenInfo = json_decode($result, true);

if (isset($tokenInfo['access_token'])) {
    $params['access_token'] = $tokenInfo['access_token'];
	
	$userInfo = json_decode(file_get_contents("https://www.googleapis.com/oauth2/v1/userinfo" . "?" . urldecode(http_build_query($params))), true);
	
	
    if (isset($userInfo['id'])) {
        $userInfo = $userInfo;
        $result = true;
    }
}
if ($result) {
    echo "Социальный ID пользователя: " . $userInfo['id'] . '<br />';
    echo "Имя пользователя: " . $userInfo['name'] . '<br />';
    echo "Email: " . $userInfo['email'] . '<br />';
    echo "Ссылка на профиль пользователя: " . $userInfo['link'] . '<br />';
    echo "Пол пользователя: " . $userInfo['gender'] . '<br />';
	echo "<br />";
}


}


?>


        <h1>
            Task Manager
        </h1>

        <div id="content">
            <div class="accordion">
                <div class="group">
                    <h3>All day</h3> 

                    <div class="div_tasks">
                        <div id="input">
                            <input id="inputTask" class="new-todo form-control" name = "new" placeholder="Add new task"  autofocus> 
                            <a id="plus"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></a>
                        </div>

                        <ul id="taskList">
                        </ul>
                    </div>
                </div>

                <div class="group">
                    <h3>Morning</h3>
                    <div class="div_tasks">
                        <div id="input">
                            <input class="new-todo form-control" placeholder="Add new task"> 
                            <a id="plus"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></a>
                        </div>
                    </div>
                </div>
                <div class="group">
                    <h3>Day</h3>
                    <div class="div_tasks">
                        <div id="input">
                            <input class="new-todo form-control" placeholder="Add new task"> 
                            <a id="plus"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></a>
                        </div>
                    </div>
                </div>
                <div class="group">
                    <h3>Evening</h3>
                    <div class="div_tasks">
                        <div id="input">
                            <input class="new-todo form-control" placeholder="Add new task"> 
                            <a id="plus"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>
