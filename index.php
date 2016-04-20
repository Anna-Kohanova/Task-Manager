<!DOCTYPE html>
<html>
    <head>
        <title>Task Manager</title>
        <meta charset="UTF-8">
        <link rel="stylesheet" href="style.css"/>        
        <link rel ="stylesheet" href="jquery-ui-1.11.4.custom/jquery-ui.css">
		
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap-theme.min.css">
		<link rel="stylesheet" href="https://raw.githubusercontent.com/noizwaves/bootstrap-social-buttons/v1.0.0/social-buttons.css">		
		
		<link rel="stylesheet" href="bootstrap-social.css">
		

		

        <script src="jquery-2.2.1.js"></script>
        <script src="jquery-ui-1.11.4.custom/jquery-ui.js"></script>
        <script src="jquery-ui-1.11.4.custom/jquery-ui.min.js"></script>

        <script async src="taskManager.js"></script>		
		
		
		
    </head>
    <body>	
	
	<div id="header">
	
		<p>
			<img class="avatar smaller-image" src="">
			Task Manager
		</p>
	<div id="sign">
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

echo $link = '<a href="' . $url . '?' . urldecode(http_build_query($params)) . '" style =""> <button class="btn btn-xs btn-google"><i class="icon-google"></i> Sign in</button></a>';

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
echo '<img class="avatar smaller-image" 	src="' . $userInfo['picture'] . '" style = "width: 40px; height: 40px;"/>';
}
?>

</div>
	</div>
		
			
		
		<div id="div_tasks">
		
                        <div id="inputContainer">
							<input id="taskInput" class="new-todo form-control" name = "new" placeholder="Add new task"  maxlength="25" autofocus>
                            <a id="plus"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></a>
                        </div>
						<div id="listWrapper">
							<ul id="taskList"></ul>
						</div>

        </div>
    </body>
</html>
