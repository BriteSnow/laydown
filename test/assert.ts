import { ok as _ok, equal as _equal } from 'assert';
import * as path from 'path';
import * as fs from 'fs-extra-plus';

export const ok = _ok;
export const equal = _equal;

export async function pathExists(...paths: string[]): Promise<void> {
	const fullPath = path.join.apply(path, paths);
	const exists = await fs.pathExists(fullPath);

	if (!exists) {
		throw new Error(`File ${fullPath} not found`);
	}

}





