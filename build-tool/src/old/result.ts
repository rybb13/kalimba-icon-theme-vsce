export interface Result {
	type: ResultType,
    message: string
}

export enum ResultType {
	Success = 1,
	Failure = 0
}
