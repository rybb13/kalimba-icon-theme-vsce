import * as g from './generics'

export interface IMonad<A> extends
	IMonadBase<A>,
	IMonadArray<g.Extends<A, []>>,
	IMonadString<g.Extends<A, string>>,
	IMonadNumber<g.Extends<A, number>>,
	IMonadBoolean<g.Extends<A, boolean>> {}

export interface IMonadBase<A> extends g.IGenericOneParam<A> {
	flattenS(): A
	mapS<C>(f: (value: A) => C): IMonadBase<C>
	flatMapS<C>(f: (value: A) => C): C
	doS(f: (value: A) => void): IMonadBase<A>
}

export interface IMonadSingleState<A> extends IMonad<A> {
	matchS<B>(f: (value: A) => B): B
}

export interface IMonadMultiState<A, B> extends IMonad<A> {
	getState(): B;
	isState(state: B): boolean;
	matchS<C>(f: (state: B) => (type: IMonadMultiState<A, B>) => C): C
}

export interface IMonadArray<A> extends
	IMonadArrayWrapped<g.Extends<A, []>> {}

export interface IMonadArrayWrapped<A extends [], B = g.InferElement<A>> {
	flattenA(): B[]
	mapA<C>(f: (element: B) => C): IMonadArray<C[]>
	flatMapA<C>(f: (element: B) => C): C[]
	doA(f: (element: B) => void): IMonadArray<A>
	filterA(f: (element: B) => boolean): IMonadArray<A>
}

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
