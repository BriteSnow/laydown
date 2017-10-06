import readline = require('readline');

export function prompt(msg: string): Promise<string> {
	return new Promise(function (resolve, reject) {
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		});
		rl.question(msg, (answer) => {
			resolve(answer);
			rl.close();
		});
	})
}


