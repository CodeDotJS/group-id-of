import childProcess from 'child_process';
import test from 'ava';

test.cb('main', t => {
	const cp = childProcess.spawn('./cli.js', {stdio: 'inherit'});

	cp.on('error', t.ifError);

	cp.on('close', code => {
		t.is(code, 1);
		t.end();
	});
});

test.cb('groupID', t => {
	childProcess.execFile('./cli.js', ['linuxscreenshots'], {
		cwd: __dirname
	}, (err, stdout) => {
		t.ifError(err);
		t.true(stdout === `\u001b[?25l\n› Fetching Group's ID. Please wait!\n\u001b[?25l\u001b[1000D\u001b[K\u001b[1A\u001b[1000D\u001b[K\u001b[1A\u001b[1000D\u001b[K\n› linuxscreenshots is a facebook group!\n\n\u001b[?25l\u001b[1000D\u001b[K\u001b[1A\u001b[1000D\u001b[K\u001b[1A\u001b[1000D\u001b[K\u001b[1A\u001b[1000D\u001b[K\n› Group ID of linuxscreenshots is 399649303388324\n\n\u001b[?25h`);
		t.end();
	});
});

test.cb('notAfacebookgroup', t => {
	childProcess.execFile('./cli.js', ['Humorous.Sperm.Official'], {
		cwd: __dirname
	}, (err, stdout) => {
		t.ifError(err);
		t.true(stdout === `\u001b[?25l\n› Fetching Group's ID. Please wait!\n\u001b[?25l\u001b[1000D\u001b[K\u001b[1A\u001b[1000D\u001b[K\u001b[1A\u001b[1000D\u001b[K\n› Humorous.Sperm.Official is a facebook group!\n\n\u001b[?25l\u001b[1000D\u001b[K\u001b[1A\u001b[1000D\u001b[K\u001b[1A\u001b[1000D\u001b[K\u001b[1A\u001b[1000D\u001b[K\n› Sorry \"Humorous.Sperm.Official\" is not a facebook group!\n\n\u001b[?25h`);
		t.end();
	});
});
