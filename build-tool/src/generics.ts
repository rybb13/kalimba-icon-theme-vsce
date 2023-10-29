export type Extends<A, B> = A extends B ? A : never

export type InferElement<T> = T extends readonly (infer E)[] ? E : never
export type InferArray<T> = Extends<T, Array<InferElement<T>>>

export interface Generic {}

export interface IGenericOneParam<_> extends Generic {}
export type InferOneParam<A> = A extends IGenericOneParam<infer A1> ? A1 : never

export interface IGenericTwoParams<_A, _B> extends Generic {}
export type InferTwoParams<A, B> =
	A extends IGenericTwoParams<infer A1, infer _> ? A1 : never &
	B extends IGenericTwoParams<infer _, infer B1> ? B1 : never

export interface IGenericThreeParams<_A, _B, _C> extends Generic {}
export type InferThreeParams<A, B, C> =
	A extends IGenericThreeParams<infer A1, infer _, infer _> ? A1 : never &
	B extends IGenericThreeParams<infer _, infer B1, infer _> ? B1 : never &
	C extends IGenericThreeParams<infer _, infer _, infer C1> ? C1 : never
