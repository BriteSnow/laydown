

export module laydown{
	export async function down(args: string[]): Promise<any>{

	}
}
export function foo(): void{
	console.log("boo!");
}

export class GitExporter {
	async download(path: string): Promise<any>{
		await wait(2000);
		return "downloaded path: " + path;
	}
}

async function wait(ms: number): Promise<any>{
	return new Promise((resolve, regject) => {
		setTimeout(() => resolve(), ms);
	});
}
