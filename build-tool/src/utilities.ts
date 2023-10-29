import * as fs from 'fs'
import * as l from './log'
import * as r from './result'
import * as c from './config'

export function validatePath(path: string, allowDefaultPath: boolean = false, defaultPath: string = __dirname): l.Log<r.Result<string>> {
	return (typeof path === 'string')
			? l.Log.log(r.Result.value(path))
			: (allowDefaultPath
				? l.Log.log(r.Result.value(defaultPath))
					.with(new l.Warning('Path is undefined, defaulting to current directory.'))
				: r.Result.error<string>('Path is undefined.').toLog()
			)
			.with(new l.Error('Failed to validate path.'))
}

export function ensureFileExists(path: string): l.Log<r.Result<string>> {
	return fs.existsSync(path)
		? r.Result.value(path).toLog()
		: r.Result.value(path).toLog()
			.with(new l.Warning('File not found. Creating file...'))
			.mapS((a: r.Result<string>) => {
				return a.flatMapS((b: string) => {
					let c = r.Result.value(b)
					
					fs.writeFile(b, c.defaultConfig(), function(err) {
						if (err) {
							c = r.Result.error<string>('Failed to create file.')
						}
					})
					
					return c
				})
			}) as l.Log<r.Result<string>>
}

export function ensureDirectoryExists(path: string): l.Log<r.Result<string>> {
	return fs.existsSync(path)
		? r.Result.value(path).toLog()
		: r.Result.value(path).toLog()
			.with(new l.Warning('Directory not found. Creating directory...'))
			.mapS((a: r.Result<string>) => {
				return a.flatMapS((b: string) => {
					fs.mkdirSync(b)
					
					return r.Result.value(b)
				})
			}) as l.Log<r.Result<string>>
}

export function validateFile(path: string, type: string): l.Log<r.Result<string>> {
	return validatePath(path, false).flatMapS(a => a.flatMapS(b => {
		const extension = `.${type.substring(type.lastIndexOf('.') + 1).toLowerCase()}`
		return ensureFileExists(b.endsWith(extension) ? b : b + extension)
	}))
}

export function validateDirectory(path: string): l.Log<r.Result<string>> {
	return validatePath(path, false).flatMapS(a => a.flatMapS(b => ensureDirectoryExists(b)))
}

export function readFile(path: string): l.Log<r.Result<string>> {
	return validatePath(path, false).mapS(a => a.mapS(b => fs.readFileSync(b, 'utf8'))) as l.Log<r.Result<string>>
}

export function writeFile(path: string, name: string, text: string, allowDefaultPath: boolean, defaultPath: string = __dirname): l.Log<r.Result<string>> {
	return validatePath(path, allowDefaultPath, defaultPath).matchS(
		a => a.matchS(
				(b: r.EResult) => {
					switch (b) {
						case r.EResult.Value:
							return c => {
								let result = r.Result.value(`${c.value}/${name}`).toLog()
								
								result.value.doS(d => {
									fs.writeFile(d, text, function(err) {
										result = err
											? result.mapS(_ => Result.error<string>('Failed to write file.')) as l.Log<r.Result<string>>
											: result.with(new l.Message(`Writing to file at: ${d}`))
									})
								})
								
								return result
							}
						case r.EResult.Error:
							return c => r.Result.error<string>(c.error).toLog()
					}
				}
			)
	)
}
