import * as log from './log'
import * as utils from './utilities'
import { IMonadMultiState } from './monad'

enum EResult {
	Value,
	Error
}

interface IValue<A> extends
	IMonadMultiState<A, EResult>,
	IResult<A>,
	IToLog<A> {
	tag: B
	value: A
}

/*
interface IValue<T> extends
	IMonad<T>,
	ICheck,
	IMap<T>,
	IMatch<T>,
	IDo<T>,
	IFlatten<T>,
	IExpect<T>,
	IToLog<T>,
	IString<T & string>,
	INumber<T & number>,
	IBoolean<T & boolean> {
	tag: EResult
	value: T
}
*/

interface IError<A> extends
	IMonadMultiState<A, EResult>,
	IResult<A>,
	IToLog<A> {
	tag: B
	error: string
}

/*
interface IError<T> extends
	IMonad<T>,
	ICheck,
	IMap<T>,
	IMatch<T>,
	IDo<T>,
	IFlatten<T>,
	IExpect<T>,
	IToLog<T>,
	IString<T & string>,
	INumber<T & number>,
	IBoolean<T & boolean> {
	tag: EResult
	error: string
}
*/

export type Result<A> = (IValue<A> | IError<A>)
	& IMonadMultiState<A, EResult>
	& IResult<A>
	& IToLog<A>

/*
export type Result<T> = (IValue<T> | IError<T>)
	& IMonad<T>
	& ICheck
	& IMap<T>
	& IMatch<T>
	& IDo<T>
	& IFlatten<T>
	& IExpect<T>
	& IToLog<T>
	& IString<T extends string ? T : never>
	& INumber<T extends number ? T : never>
	& IBoolean<T extends boolean ? T : never>
*/

export namespace Result {
	class Value<A> implements IValue<A> {
		public tag = EResult.Value
		public value: A
		
		public constructor(value: A) {
			this.value = value
		}
		
		/*
		// #region check
		
		is(tag: EResult): boolean {
			switch (tag) {
				case EResult.Value:
					return true
				default:
					return false
			}
		}
		
		isValue(): boolean {
			return true
		}
		
		isError(): boolean {
			return false
		}
		
		// #endregion check
		
		// #region map
		
		map<U>(f: (value: T) => U): Result<U> {
			return value(f(this.value))
		}
		
		mapErr(_f: (error: never) => never): Result<U> {
			return value(this.value)
		}
		
		// #endregion map
		
		// #region match
		
		match<U>(fValue: (value: T) => U, _fError: (error: never) => never): U {
			return fValue(this.value)
		}
		
		matchValue<U>(f: (value: T) => U): U {
			return fValue(this.value)
		}
		
		matchError<U>(f: (error: never) => never): U {
			return 
		}
		
		// #endregion match
		
		// #region do
		
		do(fValue: (value: T) => void, _fError: (error: never) => void): Result<T> {
			fValue(this.value)
			
			return value(this.value)
		}
		
		doValue(f: (value: T) => void): Result<T> {
			f(this.value)
			
			return value(this.value)
		}
		
		doError(_f: (value: never) => never): Result<T> {
			return value(this.value)
		}
		
		// #endregion do
		
		// #region flatten
		
		flatten(): T {
			return this.value
		}
		
		flattenOr(_value: never): T {
			return this.value
		}
		
		flattenLog(): log.Log<T> {
			return log.Log.log(this.value)
		}
		
		// #endregion flatten
		
		// #region expect
		
		expect(_error: never): T {
			return this.value
		}
		
		expectLog(_error: never): log.Log<T> {
			return log.Log.log(this.value)
		}
		
		// #endregion expect
		
		// #region toLog
		
		toLog(): log.Log<Result<T>> {
			return log.Log.log(this)
		}
		
		toLogMap(value: log.ILogEntry, _error: never): log.Log<Result<T>> {
			return this.toLogValue(value)
		}
		
		toLogValue(value: log.ILogEntry): log.Log<Result<T>> {
			return this.toLog().with(value)
		}
		
		toLogError(_error: never): log.Log<Result<T>> {
			return this.toLog()
		}
		
		// #endregion toLog
		
		// #region string
		
		append(x: T & string): Result<T & string> {
			return value((this.value as string + x as string) as T & string)
		}
		
		// #endregion string
		
		// #region number
		
		add(x: T & number): Result<T & number> {
			return value((this.value as number) + (x as number) as T & number)
		}
		
		addFrom(x: T & number): Result<T & number> {
			return value((x as number) + (this.value as number) as T & number)
		}
		
		sub(x: T & number): Result<T & number> {
			return value((this.value as number) - (x as number) as T & number)
		}
		
		subFrom(x: T & number): Result<T & number> {
			return value((x as number) - (this.value as number) as T & number)
		}
		
		mul(x: T & number): Result<T & number> {
			return value((this.value as number) * (x as number) as T & number)
		}
		
		mulFrom(x: T & number): Result<T & number> {
			return value((x as number) * (this.value as number) as T & number)
		}
		
		div(x: T & number): Result<T & number> {
			return value((this.value as number) / (x as number) as T & number)
		}
		
		divFrom(x: T & number): Result<T & number> {
			return value((x as number) / (this.value as number) as T & number)
		}
		
		// #endregion number
		
		// #region boolean
		
		not(): Result<T & boolean> {
			return value(!(this.value as boolean) as T & boolean)
		}
		
		and(x: T & boolean): Result<T & boolean> {
			return value((((this.value ? 1 : 0) & (x ? 1 : 0)) ? true : false) as T & boolean)
		}
		
		andCond(x: T & boolean): Result<T & boolean> {
			return value(((this.value as boolean) && (x as boolean)) as T & boolean)
		}
		
		or(x: T & boolean): Result<T & boolean> {
			return value((((this.value ? 1 : 0) | (x ? 1 : 0)) ? true : false) as T & boolean)
		}
		
		orCond(x: T & boolean): Result<T & boolean> {
			return value(((this.value as boolean) || (x as boolean)) as T & boolean)
		}
		
		xor(x: T & boolean): Result<T & boolean> {
			return value((((this.value ? 1 : 0) ^ (x ? 1 : 0)) ? true : false) as T & boolean)
		}
		
		// #endregion boolean
		
		// #region array
		
		mapArray<U>(f: (element: utils.ElementOf<T>) => U): Result<U[]> {
			return value(this.matchArray(f))
		}
		
		matchArray<U>(f: (element: utils.ElementOf<T>) => U): U[] {
			const input = this.value as utils.AsArray<T>
			let output = new Array<U>(input.length)
			
			for (let i = 0; i < input.length; i++) {
				output[i] = f(input[i])
			}
			
			return output
		}
		
		doArray(f: (element: utils.ElementOf<T>) => void): Result<utils.ElementOf<T>[]> {
			const input = this.value as utils.AsArray<T>
			
			for (var a of input) f(a)
			
			return value(this.value as utils.AsArray<T>)
		}
		
		filter(f: (element: utils.ElementOf<T>) => boolean): Result<utils.ElementOf<T>[]> {
			const input = this.value as utils.AsArray<T>
			let output = new Array<utils.ElementOf<T>>()
			
			for (var a of input) if (f(a)) output.push(a)
			
			return value(output)
		}
		
		///
		reduce(f: (left: utils.ElementOf<T>, right: utils.ElementOf<T>) => utils.ElementOf<T>): Result<utils.ElementOf<T>> {
			
		}
		
		fold(init: utils.ElementOf<T>, f: (left: utils.ElementOf<T>, right: utils.ElementOf<T>) => utils.ElementOf<T>): Result<utils.ElementOf<T>> {
			
		}
		///
		
		// #endregion array
		
		// #region array flat map
		
		flatMap<U>(): Result<U[]> {
			const input = this.value as utils.AsArray<utils.OuterOneParam<utils.ElementOf<T>>>
			let result = value(new Array<U>())
			
			for (var a of input) {
				(a as utils.OuterOneParam<utils.ElementOf<T>>)
				.flatten().doError()
			}
			
			return result
		}
		
		// #endregion array flat map
		*/
		
		
	}
	
	class Error<A> implements IError<A> {
		public tag = EResult.Error
		public error: string
		
		public constructor(error: string) {
			this.error = error
		}
		
		/*
		// #region check
		
		is(tag: EResult): boolean {
			switch (tag) {
				case EResult.Error:
					return true
				default:
					return false
			}
		}
		
		isValue(): boolean {
			return false
		}
		
		isError(): boolean {
			return true
		}
		
		// #endregion check
		
		// #region map
		
		map<U>(_fValue: (value: never) => never, fError: (error: string) => U): Result<U> {
			return value(fError(this.error))
		}
		
		mapValue(_f: (value: never) => never): Result<never> {
			return error(this.error)
		}
		
		mapError<U>(f: (error: string) => U): Result<U> {
			return value(f(this.error))
		}
		
		// #endregion map
		
		// #region match
		
		match<U>(_fValue: (value: never) => never, fError: (error: string) => U): U {
			return fError(this.error)
		}
		
		matchValue<U>(_f: (value: T) => U): U {
			return null as U
		}
		
		matchError<U>(f: (error: string) => U): U {
			return f(this.error)
		}
		
		// #endregion match
		
		// #region do
		
		do(_fValue: (value: never) => never, fError: (error: string) => void): Result<never> {
			fError(this.error)
			
			return error(this.error)
		}
		
		doValue(_f: (value: never) => void): Result<never> {
			return error(this.error)
		}
		
		doError(f: (error: string) => void): Result<T> {
			f(this.error)
			
			return error(this.error)
		}
		
		// #endregion do
		
		// #region flatten
		
		flatten(): never {
			throw new Error('Flatten called on error type')
		}
		
		flattenOr(value: T): T {
			return value
		}
		
		flattenLog(): log.Log<T> {
			return log.Log.log(null as T).with(new log.Error('Flatten called on error type'))
		}
		
		// #endregion flatten
		
		// #region expect
		
		expect(error: string): never {
			throw new Error(error)
		}
		
		expectLog(error: string): log.Log<T> {
			return log.Log.log(null as T).with(new log.Error(error))
		}
		
		// #endregion expect
		
		// #region toLog
		
		toLog(): log.Log<Result<T>> {
			return log.Log.log(this)
		}
		
		toLogMap(_value: never, error: log.ILogEntry): log.Log<Result<T>> {
			return this.toLogError(error)
		}
		
		toLogValue(_value: never): log.Log<Result<T>> {
			return this.toLog()
		}
		
		toLogError(error: log.ILogEntry): log.Log<Result<T>> {
			return this.toLog().with(error)
		}
		
		// #endregion toLog
		
		// #region string
		
		append(_x: never): Result<never> {
			return error(this.error)
		}
		
		// #endregion string
		
		// #region number
		
		add(_x: never): Result<never> {
			return error(this.error)
		}
		
		addFrom(_x: never): Result<never> {
			return error(this.error)
		}
		
		sub(_x: never): Result<never> {
			return error(this.error)
		}
		
		subFrom(_x: never): Result<never> {
			return error(this.error)
		}
		
		mul(_x: never): Result<never> {
			return error(this.error)
		}
		
		mulFrom(_x: never): Result<never> {
			return error(this.error)
		}
		
		div(_x: never): Result<never> {
			return error(this.error)
		}
		
		divFrom(_x: never): Result<never> {
			return error(this.error)
		}
		
		// #endregion number
		
		// #region boolean
		
		not(): Result<never> {
			return error(this.error)
		}
		
		and(_x: never): Result<never> {
			return error(this.error)
		}
		
		andCond(_x: never): Result<never> {
			return error(this.error)
		}
		
		or(_x: never): Result<never> {
			return error(this.error)
		}
		
		orCond(_x: never): Result<never> {
			return error(this.error)
		}
		
		xor(_x: never): Result<never> {
			return error(this.error)
		}
		
		// #endregion boolean
		*/
		
		
	}
	
	export function value<A>(value: A): Result<A> {
		let x = value;
		
		if (value === null || value === undefined) {
			return new Error('Value null or undefined')
		} else {
			return new Value(x)
		}
	}
	
	export function error<A>(error: string): Result<A> {
		return new Error(error)
	}
}

export interface IResult<A> {
	is(tag: EResult): boolean
	isValue(): boolean
	isError(): boolean
	flattenOr(value: A): A
	expect(error: string): A
}

/*
export interface IMap<T> {
	map<U>(f: (value: T) => U): Result<U>
	mapErr<U>(f: (error: string) => U): Result<U>
}

export interface IMatch<T> {
	match<U>(fA: (value: T) => U, fB: (error: string) => U): U
}

export interface IDo<T> {
	do(fA: (value: T) => void, fB: (error: string) => void): Result<T>
	doValue(f: (value: T) => void): Result<T>
	doError(f: (error: string) => void): Result<T>
}

export interface IFlatten<T> {
	flattenOr(value: T): T
	// flattenLog(): log.Log<T>
}

export interface IExpect<T> {
	expect(error: string): T
	// expectLog(error: string): log.Log<T>
}
*/

export interface IToLog<T> {
	toLog(): log.Log<Result<T>>
	toLogMap(value: log.ILogEntry, error: log.ILogEntry): log.Log<Result<T>>
	toLogValue(value: log.ILogEntry): log.Log<Result<T>>
	toLogError(error: log.ILogEntry): log.Log<Result<T>>
}

/*
export interface IString<T extends string> {
	append(x: T): Result<T>
}

export interface INumber<T extends number> {
	add(x: T): Result<T>
	addFrom(x: T): Result<T>
	sub(x: T): Result<T>
	subFrom(x: T): Result<T>
	mul(x: T): Result<T>
	mulFrom(x: T): Result<T>
	div(x: T): Result<T>
	divFrom(x: T): Result<T>
}

export interface IBoolean<T extends boolean> {
	not(): Result<T>
	and(x: T): Result<T>
	andCond(x: T): Result<T>
	or(x: T): Result<T>
	orCond(x: T): Result<T>
	xor(x: T): Result<T>
}
*/
