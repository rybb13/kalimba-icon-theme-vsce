/*
import * as g from './generics'

export interface IArray<T extends [], E extends g.InferElement<T>> {
	mapArray<A>(f: (element: E) => A): A[]
	matchArray<A>(f: (element: E) => A): E[]
	doArray(f: (element: E) => void): T
	selectArray(f: (element: E) => boolean): T
}

export interface IArrayFlatMap<T extends [], EO extends g.InferElement<T> & g.GenericOneParam<g.InferElement<T>>, EI extends g.InferOneParam<g.InferElement<T>>> {
	flattenArray(): EI[]
	flatMapArray<A>(f: (element: EO) => A): g.GenericOneParam<A[]>
}
*/
