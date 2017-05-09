#!/usr/bin/env node

'use strict';

const dns = require('dns');
const https = require('https');
const ora = require('ora');
const logUpdate = require('log-update');
const colors = require('colors/safe');

const arg = process.argv[2];
const arrow = colors.cyan.bold('›');

if (!arg || arg === '-h' || arg === '--help') {
	console.log(`
 ${colors.cyan('Usage   :')} group-id-of ${colors.blue('<group\'s name>\n')}
 ${colors.cyan('Example :')} group-id-of ${colors.yellow('linuxscreenshots\n')}
 ${colors.cyan('Help    :')} group-id-of ${colors.green('-h')} ${colors.dim('--help')}
 `);
	process.exit(1);
}

const updateNotifier = require('update-notifier');
const pkg = require('./package.json');

updateNotifier({pkg}).notify();

const spinner = ora();

const options = {
	hostname: 'www.facebook.com',
	port: 443,
	path: `/groups/${arg}`,
	method: 'GET',
	headers: {
		'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36',
		'Accept-Language': 'en-GB,en-US;q=0.8,en;q=0.6'
	}
};

dns.lookup('facebook.com', err => {
	if (err) {
		logUpdate(`\n${colors.red.bold(arrow)} Please check your internet connection`);
		process.exit(1);
	} else {
		logUpdate();
		spinner.text = `Fetching ${arg}'s ID`;
		spinner.start();
	}
});

const req = https.request(options, res => {
	if (res.statusCode === 200) {
		logUpdate();
		spinner.text = `${arg} is a Facebook group`;
	}

	let store = '';
	res.setEncoding('utf8');

	res.on('data', d => {
		store += d;
	});

	res.on('end', () => {
		const rePattern = new RegExp(/entity_id":"\d*/);
		const arrMatches = store.match(rePattern);

		if (arrMatches && arrMatches[0]) {
			logUpdate(`\n› ${arg}'s group id is ${arrMatches[0].replace('entity_id":"', '')}\n`);
			spinner.stop();
		} else {
			logUpdate(`${colors.cyan.bold('\n›')} ${colors.dim(`Sorry "${arg}" is not a Facebook group!`)}\n`);
			spinner.stop();
		}
	});
});
req.end();
