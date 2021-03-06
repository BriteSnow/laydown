

/** 
 * This allow to make any type partial (usefull when building up the object before returning it)
 * See: https://www.typescriptlang.org/docs/handbook/advanced-types.html#mapped-types
 */
export type Partial<T> = {
	[P in keyof T]?: T[P];
}

type AnyButArray = object | number | string | boolean;

export function asArray<T extends AnyButArray>(a: T | Array<T>): Array<T> {
	return (a instanceof Array) ? a : [a];
}