import * as l from './log'
import { Result } from './result'
import * as utils from './utilities'
import { Config } from './theme'

export type Output = {
	path: string
	name: string
	value: string
}

export function build(configPath: string, outputPath: string): l.Log<Result<Output[]>> {
	return utils.readFile(configPath)
		.with(new l.Message('Generating theme...'))
		.mapS(a => a.mapS(b => JSON.parse(b) as Config))
		.mapS(a => a.flatMapS(b => map(b, outputPath))) as l.Log<Result<Output[]>>
}

function map(config: Config, outputPath: string): Result<Output[]> {
	return Result.value(config)
		.mapS(a => a.modes)
		.flatMapS(mode => generateTheme(config, mode.key).mapA(output => ({
			path: outputPath,
			name: `${config.name}-${mode.key}.json`,
			value: output
		} as Output))) as Result<Output[]>
}

function generateTheme(config: Config, mode: string): Result<string> {
	return Result.value(config)
		.mapS(_ => {
			return JSON.stringify(mode, null, '\t')
		}) as Result<string>
}
