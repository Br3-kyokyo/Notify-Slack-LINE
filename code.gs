//slackからPOSTリクエストを受信
function doPost(e) {
  
  //リクエストをパースしてJSONに
  var params = JSON.parse(e.postData.getDataAsString());
  
  //tokenをチェックしてだめなら弾く
  var recv_token = params.token;
  if(tokens().VERIFY_SLACK_TOKEN !== recv_token){
    return;
  }
  
  //JSONから各種情報を取得
  var teamid = params.team_id;
  var chid = params.event.channel;
  var userid = params.event.user;
  var text = params.event.text;
  
  //チーム名を取得
  var res_team = UrlFetchApp.fetch("https://slack.com/api/team.info?token=" + tokens().SLACK_TOKEN).getContentText();
  var params_team = JSON.parse(res_team);
  var teamName = params_team.team.name;
  
  //チャンネル名を取得
  var res_ch = UrlFetchApp.fetch("https://slack.com/api/channels.info?token=" + tokens().SLACK_TOKEN + "&channel=" + chid).getContentText();
  var params_ch = JSON.parse(res_ch);
  var chName = params_ch.channel.name;
  
  //ユーザー名を取得
  var res_user = UrlFetchApp.fetch("https://slack.com/api/users.info?token=" + tokens().SLACK_TOKEN + "&user=" + userid).getContentText();
  var params_user = JSON.parse(res_user);
  var userName = params_user.user.real_name;
  
  //LINEに送信する文面を構成
  var msg = "\nWorkspase: "+teamName+"\nChannel: "+chName+"\nUser: "+userName+ "\n----------\n"+text;
  
  //LINEnotifyへ送信
  sendtoLINE(msg);
}

function sendtoLINE(message)
{

  var op =
      {
        "method" : "post",
        "payload": "message=" + message,
        "headers":{"Authorization" : "Bearer " + tokens().LINETOKEN}
      };
  UrlFetchApp.fetch("https://notify-api.line.me/api/notify",op);
}