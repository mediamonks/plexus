const config = require('./config');

function send(message, isRunning) {
	const postback = config.get('postback');
	if (!postback?.url) return;
	
	fetch(postback.url, {
		method: 'POST',
		headers: postback.headers,
		body: JSON.stringify({ message, isRunning }),
	}).then();
}

async function wrap(message, fn) {
	send(message, fn && true);
	
	if (!fn) return;
	
	const result = await fn();
	
	send(message, false);
	
	return result;
}

module.exports = { send, wrap };
