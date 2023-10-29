import * as g from './generics'
import * as m from './monad'
import * as l from './log'

export enum EResult { Value, Error }

interface IValue<A> extends m.IMonadMultiState<A, EResult>, IResultBase<A>, IToLog<A> {
	state: EResult
	value: A
}

interface IError<A> extends m.IMonadMultiState<A, EResult>, IResultBase<A>, IToLog<A> {
	state: EResult
	error: string
}

export type Result<A> = m.IMonadMultiState<A, EResult> & IResultBase<A> & IToLog<A> &
	(IValue<A> | IError<A>)

export namespace Result {
	class Value<A> implements IValue<A> {
		public state = EResult.Value
		public value: A
		
		public constructor(value: A) {
			this.value = value
		}
		
		// #region IMonadBase
		
		flattenS(): A {
			return this.value
		}
		
		mapS<B>(f: (value: A) => B): m.IMonadBase<B> {
			return value(f(this.value))
		}
		
		flatMapS<B>(f: (value: A) => B): B {
			return this.mapS(a => f(a)).flattenS()
		}
		
		doS(f: (value: A) => void): m.IMonadBase<A> {
			f(this.value)
			
			return value(this.value)
		}
		
		// #endregion IMonadBase
		
		// #region IMonadMultiState
		
		getState(): EResult {
			return this.state
		}
		
		isState(state: EResult): boolean {
			return state == this.state
		}
		
		matchS<B>(f: (state: EResult) => (type: m.IMonad<A>) => B): B {
			return f(EResult.Value)(this)
		}
		
		// #endregion IMonadMultiState
		
		// #region IMonadArray
		
		flattenA(): g.InferElement<A>[] {
			return this.value as g.InferElement<A>[]
		}
		
		mapA<B>(f: (element: g.InferElement<A>) => B): m.IMonadArray<B[]> {
			let output: B[] = []
			
			for (var a of this.value as g.InferElement<A>[]) output.push(f(a))
			
			return value(output)
		}
		
		flatMapA<B>(f: (element: g.InferElement<A>) => B): B[] {
			return this.mapA(a => f(a)).flattenA()
		}
		
		doA(f: (element: g.InferElement<A>) => void): m.IMonadArray<A> {			
			for (var a of this.value as g.InferElement<A>[]) f(a)
			
			return value(this.value)
		}
		
		filterA(f: (element: g.InferElement<A>) => boolean): m.IMonadArray<A> {
			let output: g.InferElement<A>[] = []
			
			for (var a of this.value as g.InferElement<A>[]) if (f(a)) output.push(a)
			
			return value(output)
		}
		
		// #endregion IMonadArray
		
		// #region IMonadString
		
		append(a: A & string): m.IMonadString<A & string> {
			return value((this.value as A & string) + a)
		}
		
		// #endregion IMonadString
		
		// #region IMonadNumber
		
		add(a: A & number): m.IMonadNumber<A & number> {
			return value((this.value as A & number) + a)
		}
		
		sub(a: A & number): m.IMonadNumber<A & number> {
			return value((this.value as A & number) - a)
		}
		
		subFrom(a: A & number): m.IMonadNumber<A & number> {
			return value(a - (this.value as A & number))
		}
		
		mul(a: A & number): m.IMonadNumber<A & number> {
			return value((this.value as A & number) * a)
		}
		
		div(a: A & number): m.IMonadNumber<A & number> {
			return value((this.value as A & number) / a)
		}
		
		divFrom(a: A & number): m.IMonadNumber<A & number> {
			return value(a / (this.value as A & number))
		}
		
		// #endregion IMonadNumber
		
		// #region IMonadBoolean
		
		not(): m.IMonadBoolean<A & boolean> {
			return value(!(this.value as A & boolean))
		}
		
		and(a: A & boolean): m.IMonadBoolean<A & boolean> {
			return value((this.value ? 1 : 0) & (a ? 1 : 0) ? true : false)
		}
		
		andCond(a: A & boolean): m.IMonadBoolean<A & boolean> {
			return value((this.value as A & boolean) && a)
		}
		
		andCondFrom(a: A & boolean): m.IMonadBoolean<A & boolean> {
			return value(a && (this.value as A & boolean))
		}
		
		or(a: A & boolean): m.IMonadBoolean<A & boolean> {
			return value((this.value ? 1 : 0) | (a ? 1 : 0) ? true : false)
		}
		
		orCond(a: A & boolean): m.IMonadBoolean<A & boolean> {
			return value((this.value as A & boolean) || a)
		}
		
		orCondFrom(a: A & boolean): m.IMonadBoolean<A & boolean> {
			return value(a || (this.value as A & boolean))
		}
		
		xor(a: A & boolean): m.IMonadBoolean<A & boolean> {
			return value((this.value ? 1 : 0) ^ (a ? 1 : 0) ? true : false)
		}
		
		// #endregion IMonadBoolean
		
		// #region IResultBase
		
		isValue(): boolean { return true }
		
		isError(): boolean { return false }
		
		flattenOr(_: never): A {
			return this.value
		}
		
		expect(_: never): A {
			return this.value
		}
		
		// #endregion IResultBase
		
		// #region IToLog
		
		toLog(): l.Log<Result<A>> {
			return l.Log.log(value(this.value))
		}
		
		stateToLog(f: (state: EResult) => l.ILogEntry): l.Log<Result<A>> {
			return this.toLog().with(f(this.state))
		}
		
		resultToLog(value: l.ILogEntry, _: never): l.Log<Result<A>> {
			return this.toLog().with(value)
		}
		
		valueToLog(value: l.ILogEntry): l.Log<Result<A>> {
			return this.toLog().with(value)
		}
		
		errorToLog(_: never): l.Log<Result<A>> {
			return this.toLog()
		}
		
		// #endregion IToLog
	}
	
	class Error<A> implements IError<A> {
		public state = EResult.Error
		public error: string
		
		public constructor(error: string) {
			this.error = error
		}
		
		// #region IMonadBase
		
		flattenS(): A {
			// throw new Error('Flatten called on an error type.')
			
			return null as A
		}
		
		mapS<B>(_: (_: never) => never): m.IMonadBase<B> {
			return error<B>(this.error)
		}
		
		flatMapS<B>(_: (_: never) => never): B {
			// throw new Error('Flat map called on an error type.')
			
			return null as B
		}
		
		doS(_: (_: never) => void): m.IMonadBase<A> {
			return error(this.error)
		}
		
		// #endregion IMonadBase
		
		// #region IMonadMultiState
		
		getState(): EResult {
			return this.state
		}
		
		isState(state: EResult): boolean {
			return state == this.state
		}
		
		matchS<B>(f: (state: EResult) => (type: m.IMonad<A>) => B): B {
			return f(EResult.Error)(this)
		}
		
		// #endregion IMonadMultiState
		
		// #region IMonadArray
		
		flattenA(): g.InferElement<A>[] {
			// throw new Error('Flatten called on an error type.')
			
			return []
		}
		
		mapA(_: (_: never) => never): m.IMonadArray<never> {
			return error(this.error)
		}
		
		flatMapA(_: (_: never) => never): [] {
			return []
		}
		
		doA(_: (_: never) => never): m.IMonadArray<never> {			
			return error(this.error)
		}
		
		filterA(_: (_: never) => never): m.IMonadArray<never> {
			return error(this.error)
		}
		
		// #endregion IMonadArray
		
		// #region IMonadString
		
		append(_: never): m.IMonadString<never> {
			return error(this.error)
		}
		
		// #endregion IMonadString
		
		// #region IMonadNumber
		
		add(_: never): m.IMonadNumber<never> {
			return error(this.error)
		}
		
		sub(_: never): m.IMonadNumber<never> {
			return error(this.error)
		}
		
		subFrom(_: never): m.IMonadNumber<never> {
			return error(this.error)
		}
		
		mul(_: never): m.IMonadNumber<never> {
			return error(this.error)
		}
		
		div(_: never): m.IMonadNumber<never> {
			return error(this.error)
		}
		
		divFrom(_: never): m.IMonadNumber<never> {
			return error(this.error)
		}
		
		// #endregion IMonadNumber
		
		// #region IMonadBoolean
		
		not(): m.IMonadBoolean<never> {
			return error(this.error)
		}
		
		and(_: never): m.IMonadBoolean<never>  {
			return error(this.error)
		}
		
		andCond(_: never): m.IMonadBoolean<never> {
			return error(this.error)
		}
		
		andCondFrom(_: never): m.IMonadBoolean<never>  {
			return error(this.error)
		}
		
		or(_: never): m.IMonadBoolean<never>  {
			return error(this.error)
		}
		
		orCond(_: never): m.IMonadBoolean<never>  {
			return error(this.error)
		}
		
		orCondFrom(_: never): m.IMonadBoolean<never>  {
			return error(this.error)
		}
		
		xor(_: never): m.IMonadBoolean<never> {
			return error(this.error)
		}
		
		// #endregion IMonadBoolean
		
		// #region IResult
		
		isValue(): boolean { return false }
		
		isError(): boolean { return true }
		
		flattenOr(value: A): A {
			return value
		}
		
		expect(error: string): A {
			throw new Error(error)
		}
		
		// #endregion
		
		// #region IToLog
		
		toLog(): l.Log<Result<A>> {
			return l.Log.log(error(this.error))
		}
		
		stateToLog(f: (state: EResult) => l.ILogEntry): l.Log<Result<A>> {
			return this.toLog().with(f(this.state))
		}
		
		resultToLog(_: never, error: l.ILogEntry): l.Log<Result<A>> {
			return this.toLog().with(error)
		}
		
		valueToLog(_: never): l.Log<Result<A>> {
			return this.toLog()
		}
		
		errorToLog(error: l.ILogEntry): l.Log<Result<A>> {
			return this.toLog().with(error)
		}
		
		// #endregion IToLog
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

interface IResultBase<A> {
	isValue(): boolean
	isError(): boolean
	flattenOr(value: A): A
	expect(error: string): A
}

export interface IToLog<A> {
	toLog(): l.Log<Result<A>>
	stateToLog(f: (state: EResult) => l.ILogEntry): l.Log<Result<A>>
	resultToLog(value: l.ILogEntry, error: l.ILogEntry): l.Log<Result<A>>
	valueToLog(value: l.ILogEntry): l.Log<Result<A>>
	errorToLog(error: l.ILogEntry): l.Log<Result<A>>
}
