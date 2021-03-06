var assert = require('assert');
var s3 = require('../').load('s3');
var path = 'foo~!@#$&*()=:,;?+\'.txt';

var callbacks = {
	put: false,
	get: false,
	del: false
};

s3.setCredentials(process.env.AWS_ACCEESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY);
s3.setBucket(process.env.AWS2JS_S3_BUCKET);

s3.putFile(path, './data/foo.txt', false, {}, function (err, res) {
	callbacks.put = true;
	assert.ifError(err);
	s3.get(path, 'buffer', function (err, res) {
		callbacks.get = true;
		assert.ifError(err);
		assert.deepEqual(res.headers['content-type'], 'text/plain');
		assert.deepEqual(res.buffer.toString(), 'bar\n');
		s3.del(path, function (err) {
			callbacks.del = true;
			assert.ifError(err);
		});
	});
});

process.on('exit', function () {
	for (var i in callbacks) {
		assert.ok(callbacks[i]);
	}
});
