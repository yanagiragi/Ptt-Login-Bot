var iconv = require('iconv-lite')
var net = require('net')

var data = require('./pass')

/* user informatoin */
var user = data.acc
var psw = data.pwd

var g_data = ''
var g_conn // connecton to ptt-sever
var ip = '140.112.172.11'
var dname = 'ptt.cc'
var name = '批踢踢實業坊'

function loginDataHandler (newdataStr, id, ps) {
	if (newdataStr.indexOf('歡迎您再度拜訪') != -1) {
		console.log('歡迎您再度拜訪!')
		g_conn.write('\r')
		g_conn.write('G\r')
		g_conn.write('Y\r')
		process.exit()
	}
	else if (newdataStr.indexOf('您想刪除其他重複登入的連線嗎') != -1) {
		g_conn.write('n\r')
		// console.log( '已刪除其他重複登入的連線' );
	}
	else if (newdataStr.indexOf('登入中') != -1) {
		console.log('登入中...')
	}
	/*else if (newdataStr.indexOf('請輸入您的密碼') != -1) {
		console.log('請輸入您的密碼:')
		g_conn.write(ps + '\r')
		console.log('(已輸入密碼)' + ps)
	} */
	else if (newdataStr.indexOf('請輸入代號，或以 guest 參觀，或以 new 註冊:') != -1) {
		console.log('請輸入代號，或以 guest 參觀，或以 new 註冊:')
		g_conn.write(id + '\r')
		g_conn.write(ps + '\r')
		console.log('(已輸入帳號)')
	}
	else {
		console.log(newdataStr)
	}
}

function login (id, ps) {
	g_conn = net.createConnection(23, 'ptt.cc')
	g_conn.setTimeout(50)

	// Listeners
	g_conn.addListener('connect', function () {
		console.log('[1;31mconnected to ptt-sever[m')
	})

	g_conn.addListener('end', function () {
		console.log('[1;31mDisconnected...![m')
	})

	g_conn.addListener('data', function (data) {
		g_data += iconv.decode(data, 'big5')
	})

	g_conn.addListener('timeout', function () {
		// Emitted if the socket times out from inactivity. This is only to notify that the socket has been idle. The user must manually close the connection.
		// wait 1 sec then preform action
		setTimeout(() => {loginDataHandler(g_data, id, ps)}, 1000)
	})

	return g_conn
}

if (require.main === module) {
	login(user, psw)
}
