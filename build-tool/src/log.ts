import * as g from './generics'
import * as m from './monad'

interface ILog<A> extends m.IMonadSingleState<A>, ILogBase<A> {
	value: A,
	entries: ILogEntry[]
}

export type Log<A> = m.IMonadSingleState<A> & ILogBase<A> & ILog<A>

export namespace Log {
	class Log<A> implements ILog<A> {
		public value: A
		public entries: ILogEntry[] = []
		
		constructor(value: A, entries?: ILogEntry[]) {
			this.value = value
			this.entries = entries || []
		}
		
		// #region IMonadBase
		
		flattenS(): A {
			this.entries.forEach(a => a.log())
			
			return this.value
		}
		
		mapS<B>(f: (value: A) => B): m.IMonadBase<B> {
			return log(f(this.value)).withMany(this.entries)
		}
		
		flatMapS<B>(f: (value: A) => B): B {
			return this.mapS(a => f(a)).flattenS()
		}
		
		doS(f: (value: A) => void): m.IMonadBase<A> {
			f(this.value)
			
			return log(this.value)
		}
		
		// #endregion IMonadBase
		
		// #region IMonadSingleState
		
		matchS<B>(f: (value: A) => B): B {
			return f(this.value)
		}
		
		// #endregion IMonadSingleState
		
		// #region IMonadArray
		
		flattenA(): g.InferElement<A>[] {
			this.entries.forEach(entry => entry.log())
			
			return this.value as g.InferElement<A>[]
		}
		
		// why???
		mapA<B>(f: (element: g.InferElement<A>) => B): m.IMonadArray<B[]> {
			let output: B[] = []
			
			for (var a of this.value as g.InferElement<A>[]) output.push(f(a))
			
			return log(output).withMany(this.entries)
		}
		
		flatMapA<B>(f: (element: g.InferElement<A>) => B): B[] {
			return this.mapA(a => f(a)).flattenA()
		}
		
		doA(f: (element: g.InferElement<A>) => void): m.IMonadArray<A> {			
			for (var a of this.value as g.InferElement<A>[]) f(a)
			
			return log(this.value)
		}
		
		filterA(f: (element: g.InferElement<A>) => boolean): m.IMonadArray<A> {
			let output: g.InferElement<A>[] = []
			
			for (var a of this.value as g.InferElement<A>[]) if (f(a)) output.push(a)
			
			return log(output)
		}
		
		// #endregion IMonadArray
		
		// #region IMonadString
		
		append(a: A & string): m.IMonadString<A & string> {
			return log((this.value as A & string) + a)
		}
		
		// #endregion IMonadString
		
		// #region IMonadNumber
		
		add(a: A & number): m.IMonadNumber<A & number> {
			return log((this.value as A & number) + a)
		}
		
		sub(a: A & number): m.IMonadNumber<A & number> {
			return log((this.value as A & number) - a)
		}
		
		subFrom(a: A & number): m.IMonadNumber<A & number> {
			return log(a - (this.value as A & number))
		}
		
		mul(a: A & number): m.IMonadNumber<A & number> {
			return log((this.value as A & number) * a)
		}
		
		div(a: A & number): m.IMonadNumber<A & number> {
			return log((this.value as A & number) / a)
		}
		
		divFrom(a: A & number): m.IMonadNumber<A & number> {
			return log(a / (this.value as A & number))
		}
		
		// #endregion IMonadNumber
		
		// #region IMonadBoolean
		
		not(): m.IMonadBoolean<A & boolean> {
			return log(!(this.value as A & boolean))
		}
		
		and(a: A & boolean): m.IMonadBoolean<A & boolean> {
			return log((this.value ? 1 : 0) & (a ? 1 : 0) ? true : false)
		}
		
		andCond(a: A & boolean): m.IMonadBoolean<A & boolean> {
			return log((this.value as A & boolean) && a)
		}
		
		andCondFrom(a: A & boolean): m.IMonadBoolean<A & boolean> {
			return log(a && (this.value as A & boolean))
		}
		
		or(a: A & boolean): m.IMonadBoolean<A & boolean> {
			return log((this.value ? 1 : 0) | (a ? 1 : 0) ? true : false)
		}
		
		orCond(a: A & boolean): m.IMonadBoolean<A & boolean> {
			return log((this.value as A & boolean) || a)
		}
		
		orCondFrom(a: A & boolean): m.IMonadBoolean<A & boolean> {
			return log(a || (this.value as A & boolean))
		}
		
		xor(a: A & boolean): m.IMonadBoolean<A & boolean> {
			return log((this.value ? 1 : 0) ^ (a ? 1 : 0) ? true : false)
		}
		
		// #endregion IMonadBoolean
		
		// #region ILogBase
		
		with(entry: ILogEntry): Log<A> {
			let next = log(this.value)
			
			next.entries = this.entries.concat(entry)
			
			return next
		}
		
		withMany(entries: ILogEntry[]): Log<A> {
			let next = log(this.value)
			
			next.entries = this.entries.concat(entries)
			
			return next
		}
		
		// #endregion ILogBase
	}
	
	export function log<A>(value: A): Log<A> {
		return new Log(value)
	}
}

export interface ILogBase<A> {
	with(entry: ILogEntry): Log<A>
	withMany(entries: ILogEntry[]): Log<A>
}

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
