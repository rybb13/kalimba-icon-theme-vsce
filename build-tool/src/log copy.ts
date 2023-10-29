import { IMonadSingleState } from './monad'

interface ILog<A> extends IMonadSingleState<A> {
	value: A,
	entries: ILogEntry[]
	
	with(entry: ILogEntry): Log<A>
	withMany(entries: ILogEntry[]): Log<A>
}

/*
interface ILog<T> extends IMap<T>, IMatch<T>, IWith<T>, IWithMut<T>, IFlatten<T> {
	value: T,
	entries: ILogEntry[]
}
*/

export type Log<A> = ILog<A> & IMonadSingleState<A>

/*
export type Log<T> = ILog<T>
	& utils.GenericOneParam<T>
	& IMap<T>
	& IMatch<T>
	& IWith<T>
	& IWithMut<T>
	& IFlatten<T>
*/

export namespace Log {
	class Log<A> implements ILog<A> {
		value: A
		entries: ILogEntry[] = []
		
		constructor(value: A, entries?: ILogEntry[]) {
			this.value = value
			this.entries = entries || []
		}
		
		/*
		map<U>(f: (value: T) => U): Log<U> {
			let next = log(f(this.value))
			
			next.entries = this.entries.concat(next.entries)
			
			return next
		}
		
		match<U>(f: (value: T) => U): U {
			return f(this.value)
		}
		
		with(entry: ILogEntry): Log<T> {
			let result = log(this.value)
			
			result.entries = this.entries.concat(entry)
			
			return result
		}
		
		withMany(entries: ILogEntry[]): Log<T> {
			let result = log(this.value)
			
			result.entries = this.entries.concat(entries)
			
			return result
		}
		
		withMut(entry: ILogEntry): Log<T> {
			this.entries.concat(entry)
			
			return this
		}
		
		withManyMut(entries: ILogEntry[]): Log<T> {
			this.entries.concat(entries)
			
			return this
		}
		
		flatten(): T {
			this.entries.forEach(entry => entry.log())
			
			return this.value
		}
		*/
		
		
	}
	
	export function log<A>(value: A): Log<A> {
		return new Log(value)
	}
}

/*
export interface IMap<T> {
	map<U>(f: (value: T) => U): Log<U>
}

export interface IMatch<T> {
	match<U>(f: (value: T) => U): U
}

export interface IWith<T> {
	with(entry: ILogEntry): Log<T>
	withMany(entries: ILogEntry[]): Log<T>
}

export interface IWithMut<T> {
	withMut(entry: ILogEntry): Log<T>
	withManyMut(entries: ILogEntry[]): Log<T>
}

export interface IFlatten<T> {
	flatten(): T
}
*/

export interface ILogEntry {
	value: string
	log(): void;
}

export class Message implements ILogEntry {
	constructor(value: string) {
		this.value = value
	}
	
	value: string
	log(): void {
		console.log(this.value)
	}
}

export class Note implements ILogEntry {
	constructor(value: string) {
		this.value = value
	}
	
	value: string
	log(): void {
		console.log(`Note: ${this.value}`)
	}
}

export class Warning implements ILogEntry {
	constructor(value: string) {
		this.value = value
	}
	
	value: string
	log(): void {
		console.log(`Warning: ${this.value}`)
	}
}

export class Error implements ILogEntry {
	constructor(value: string) {
		this.value = value
	}
	
	value: string
	log(): void {
		console.error(`Error: ${this.value}`)
	}
}
