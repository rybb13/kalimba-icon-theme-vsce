import * as g from './generics'

export interface IMonad<A> extends
	IMonadBase<A>,
	IMonadArray<g.Extends<A, []>>,
	IMonadString<g.Extends<A, string>>,
	IMonadNumber<g.Extends<A, number>>,
	IMonadBoolean<g.Extends<A, boolean>> {}

export interface IMonadBase<A> extends g.IGenericOneParam<A> {
	flattenB(): A
	mapB<C>(f: (value: A) => C): IMonadBase<C>
	flatMapB<C>(f: (value: A) => C): C
	doB(f: (value: A) => void): IMonadBase<A>
}

export interface IMonadSingleState<A> extends IMonad<A> {
	matchB<C>(f: (value: A) => C): C
}

export interface IMonadMultiState<A, B> extends IMonad<A> {
	getState(): B;
	isState(state: B): boolean;
	matchB<C>(f: (state: B) => (type: IMonadMultiState<A, B>) => C): C
}

export type IMonadState<A, B> = B extends never ? IMonadStateSingle<A> : IMonadStateMulti<A, B>

export interface IMonadStateSingle<A> {
	matchB<C>(f: (value: A) => C): C
}

export interface IMonadStateMulti<A, B> {
	matchB<C>(f: (state: B) => (value: A) => C): C
}

export interface IMonadArray<A> extends
	IMonadArrayWrapped<g.Extends<A, []>> {}

export interface IMonadArrayWrapped<A extends [], E = g.InferElement<A>> {
	flattenA(): E[]
	mapA<B>(f: (element: E) => B): IMonadArray<B[]>
	flatMapA<B>(f: (element: E) => B): B[]
	doA(f: (element: E) => void): IMonadArray<A>
	filterA(f: (element: E) => boolean): IMonadArray<A>
}

/*
export interface IMonadArrayWrapped<A extends [], EO = g.InferElement<A> & g.IGenericOneParam<g.InferElement<A>>, EI = g.InferOneParam<g.InferElement<A>>> {
	flattenA(): EI[]
	mapA<B>(f: (element: EO) => B): IMonadArray<B[]>
	flatMapA<B>(f: (element: EO) => B): B[]
	doA(f: (element: EO) => void): A
	filterA(f: (element: EO) => boolean): A
}
*/

export interface IMonadString<A extends string> {
	append(value: A & string): IMonadString<A & string>
}

export interface IMonadNumber<A extends number> {
	add(value: A & number): IMonadNumber<A & number>
	sub(value: A & number): IMonadNumber<A & number>
	subFrom(value: A & number): IMonadNumber<A & number>
	mul(value: A & number): IMonadNumber<A & number>
	div(value: A & number): IMonadNumber<A & number>
	divFrom(value: A & number): IMonadNumber<A & number>
}

export interface IMonadBoolean<A extends boolean> {
	not(): IMonadBoolean<A & boolean>
	and(value: A & boolean): IMonadBoolean<A & boolean>
	andCond(value: A & boolean): IMonadBoolean<A & boolean>
	andCondFrom(value: A & boolean): IMonadBoolean<A & boolean>
	or(value: A & boolean): IMonadBoolean<A & boolean>
	orCond(value: A & boolean): IMonadBoolean<A & boolean>
	orCondFrom(value: A & boolean): IMonadBoolean<A & boolean>
	xor(value: A & boolean): IMonadBoolean<A & boolean>
}
