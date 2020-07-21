var mosca = require('mosca')
var CronJob = require('cron').CronJob

process.stdin.on('readable', oncmd)

var settings = {
	port: 1883,
}

var server = new mosca.Server(settings)

server.on('clientConnected', function(client) {
	console.log('client connected', client.id)
})

// fired when a message is received
server.on('published', function(packet, client) {
	console.log(packet.topic)
	console.log('Published', packet.payload)
})

server.on('ready', ()=>{
	console.log('Mosca server is up and running')
})

function publish(topic, payload){
	var message = {
		topic,
		payload,
		qos: 0, // 0, 1, or 2
		retain: false // or true
	}
	server.publish(message, function() {
		console.log('done!')
	})
}

function oncmd() {
	process.stdin.resume()
	let chunk = process.stdin.read()
	if (chunk == null) {
		return
	}
	let cmd = chunk.toString().trim()
	let index = cmd.indexOf(' ')
	let main = cmd.substring(0, index)
	let sub = cmd.substring(index)
	publish(main, sub)
}

let oled_text = [
	'Initial D!',
	'God of Harunasan!',
	'I\'m AE86.',
]

new CronJob('0 0 9,14 * * *', ()=>publish('back_led', 10)).start()
new CronJob('0 40 11,17 * * *', ()=>publish('back_led_mode', 2)).start()
new CronJob('0 * * * * *', ()=>publish('oled_center', oled_text[Math.floor(Math.random()*oled_text.length)])).start()

// let intv = 5000
// setInterval(()=>{
// 	for (let i=0; i++; i<oled_text.length){
// 		setTimeout(publish, i*intv, 'oled_center', oled_text[i])
// 	}
// }, (oled_text.length+1)*intv)
// setInterval(()=>{
// 	for (let i=0; i<oled_text.length; i++){
// 		setTimeout(publish, i*intv, 'oled_center', oled_text[i])
// 	}
// }, (oled_text.length+1)*intv)
