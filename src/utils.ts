

/** 
 * This allow to make any type partial (usefull when building up the object before returning it)
 * See: https://www.typescriptlang.org/docs/handbook/advanced-types.html#mapped-types
 */
export type Partial<T> = {
	[P in keyof T]?: T[P];
}

interface Person{
	firstName: string, 
	lastName: string
}

var partialPerson: Partial<Person> = {}

partialPerson.firstName = "joe"