import { sync } from "glob";

export async function loadFolder(dir: string) {
	let status = process.env.STATUS as string;
	console.log(status);
	try {
		let path = status === 'DEVELOPMENT' ? `./src/Bot/modules/${dir}/**/*.ts` : `./src/Bot/modules/${dir}/**/*.js`;
		let files: string[] = sync(path);
		console.log(files);
		for(let file of files) {
			await import(
				file.replace(status === 'DEVELOPMENT' ? `src\\Bot` : `\\src\\Bot`, '../')
			)
			console.log(`File ${file} has been loaded`);
		}
	} catch (err) {
		console.error(err);
		return null;
	}
}