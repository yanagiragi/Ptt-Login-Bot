var fs = require('fs');
var iconv = require('iconv-lite'); 
var net = require('net');

/*user informatoin*/
var user = "username";
var psw = "password";

var g_data = "";
var g_conn ;//connecton to ptt-sever
var ip ="140.112.172.11";
var dname = "ptt.cc";
var name = "批踢踢實業坊";

function loginDataHandler(newdataStr, id, ps){

	if(newdataStr.indexOf("歡迎您再度拜訪") != -1){
		console.log("歡迎您再度拜訪!");
		g_conn.write( '\r' );
		g_conn.write( 'G\r' );
		g_conn.write( 'Y\r' );
		//console.log("(已按任意鍵繼續)");
	}

	else if (newdataStr.indexOf("您想刪除其他重複登入的連線嗎") != -1){
		g_conn.write( 'n\r' );
		//console.log( '已刪除其他重複登入的連線' );
	}

	else if (newdataStr.indexOf("登入中") != -1){
		console.log("登入中...");
	}

	else if (newdataStr.indexOf("請輸入您的密碼") != -1){
		console.log("請輸入您的密碼:");
		g_conn.write( ps+'\r' );
		console.log("(已輸入密碼)");
	}

	else if (newdataStr.indexOf("請輸入代號，或以 guest 參觀，或以 new 註冊:") != -1){
		console.log("請輸入代號，或以 guest 參觀，或以 new 註冊:");
		g_conn.write( id+'\r' );
		console.log("(已輸入帳號)");
	}

	else{
		//console.log("$");
	}

}

function login(id, ps, callback){
	g_conn = net.createConnection(23, "ptt.cc");
	g_conn.setTimeout(50);

	//Listeners
	g_conn.addListener('connect', function(){
			console.log('[1;31mconnected to ptt-sever[m');
			});

	g_conn.addListener('end',function(){
			console.log("[1;31mDisconnected...![m");
			});

	g_conn.addListener('data', function(data){
			g_data += iconv.decode(data,'big5');
			});

	g_conn.addListener('timeout', function(){
			//Emitted if the socket times out from inactivity. This is only to notify that the socket has been idle. The user must manually close the connection.
			loginDataHandler(g_data, id, ps);
			});

	return g_conn;
}


login(user,psw,function(){
		console.log("hi,"+user+", how are you?");
		});
