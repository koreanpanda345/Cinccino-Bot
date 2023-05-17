import { sync } from "glob";
import { relative } from "path";
export async function loadFolder(dir: string) {
	let status = process.env.STATUS as string;
	console.log(status);
	try {
		let path = status === 'DEVELOPMENT' ? `./src/Bot/modules/${dir}/**/*.ts` : `./src/Bot/modules/${dir}/**/*.ts`;
		console.log(path);
		let files: string[] = sync(path);
		console.log(files);
		for(let file of files) {
			await import(
				relative("./src/Bot/utils", `${file}`)
			);
			console.log(`File ${file} has been loaded`);
		}
	} catch (err) {
		console.error(err);
		return null;
	}
}