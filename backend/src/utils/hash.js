const crypto = require('node:crypto');

module.exports = (...strings) => {
	const hash = crypto.createHash('md5');
	for (const str of strings) hash.update(str);
	return BigInt('0x' + hash.digest('hex')).toString(36);
}
