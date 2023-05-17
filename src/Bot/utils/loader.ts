import { sync } from "glob";
import path = require("path");

export async function loadFolder(dir: string) {
	let status = process.env.STATUS as string;
	console.log(status);
	console.log(path.resolve())
	console.log(path.relative("./app/src/Bot/utils/loader.ts", "./app/src/Bot/modules/events/ready.ts"));
	try {
		let path = status === 'DEVELOPMENT' ? `./src/Bot/modules/${dir}/**/*.ts` : `/src/Bot/modules/${dir}/**/*.ts`;
		let files: string[] = sync(path);
		console.log(files);
		for(let file of files) {
			await import(
				file.replace(status === 'DEVELOPMENT' ? `src\\Bot` : `app\\src\\Bot`, '../')
			)
			console.log(`File ${file} has been loaded`);
		}
	} catch (err) {
		console.error(err);
		return null;
	}
}