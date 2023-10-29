import { Command } from 'commander'
import * as f from 'figlet'
import { Result } from './result'
import * as utils from './utilities'
import * as config from './config'
import { build, Output } from './build'

(() => {
	const program = new Command()
	
	program
		.description('CLI Build tool for generating theme files.')
		.option('-v, --version', 'output version number')
		.option('-i, --input <path>', 'set path to input config file (defaults to build.config.json in current directory)')
		.option('-o, --output <path>', 'set path to output directory (defaults to current directory)')
		.parse(process.argv)
	
	const options = program.opts()
	const version = '0.1.0'
	
	console.log(f.textSync('Theme Generator'))
	
	if (options.version) console.log(`version ${version}`)
	
	let inputPath = `${__dirname}/build.config.json`
	let outputPath = __dirname
	
	utils.validateFile(options.input ? options.input : inputPath, 'json')
		.flattenS().doS(a => inputPath = a)
	utils.validateDirectory(options.output ? options.output : outputPath)
		.flattenS().doS(a => outputPath = a)
	
	build(inputPath, outputPath)
		.matchS(a => {
			return a.mapA(({ path, name, value }: Output) =>
				utils.writeFile(path, name, value, true)
			).flatMapA(a =>
				a.flattenS()
			)
		})
})()
