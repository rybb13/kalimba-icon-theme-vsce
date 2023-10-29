import * as theme from './theme'
import * as utilities from './utilities'
import { Result, ResultType } from './result'
import * as fs from 'fs'
import * as path from 'path'

function buildTheme(
	mode: theme.ThemeMode,
	font: utilities.FontOutline,
	icons: utilities.IconOutline[],
	defaultFile: string,
	fileExtensions: Map<string, string>,
	fileNames: Map<string, string>,
	defaultFolder: string,
	folderNames: Map<string, string>
): string {
	let iconDefinitions = new Map(icons.map(icon => [icon.id, utilities.iconDefinitionFromOutline(mode, icon, font.name)]))
	
	let theme: theme.Theme = {
		fonts: [ utilities.fontFromOutline(font) ],
		iconDefinitions: Object.fromEntries(iconDefinitions),
		file: defaultFile,
		fileExtensions: Object.fromEntries(fileExtensions),
		fileNames: Object.fromEntries(fileNames),
		folder: defaultFolder,
		folderNames: Object.fromEntries(folderNames)
	}
	
	return JSON.stringify(theme, null, '\t')
}

interface FileNameGroup {
	icon: string,
	fileNames: string[]
}

interface FileTypeGroup {
	icon: string,
	fileExtensions: string[]
}

interface FolderNameGroup {
	icon: string,
	folderNames: string[]
}

function generateThemeFile(path: string, mode: theme.ThemeMode): Result {
	let result: Result = {
		type: ResultType.Success,
		message: ''
	}
	
	let font: utilities.FontOutline = {
		name: 'material-icons',
		path: './fonts/material-icons.woff2',
		format: 'woff2'
	}
	
	let icons: utilities.IconOutline[] = [
		{ id: 'file-default', character: 'note' },
		{ id: 'file-format-tag', character: 'code' },
		{ id: 'file-name-changelog', character: 'format_list_bulleted' },
		{ id: 'file-name-launch', character: 'rocket_launch' },
		{ id: 'file-name-license', character: 'contract' },
		{ id: 'file-name-package', character: 'package_2' },
		{ id: 'file-name-readme', character: 'developer_guide' },
		{ id: 'file-name-todo', character: 'checklist' },
		{ id: 'file-type-archive', character: 'inventory_2' },
		{ id: 'file-type-asset-audio', character: 'volume_up' },
		{ id: 'file-type-asset-code', character: 'data_object' },
		{ id: 'file-type-asset-data', character: 'dataset' },
		{ id: 'file-type-asset-database', character: 'database' },
		{ id: 'file-type-asset-font', character: 'text_fields' },
		{ id: 'file-type-asset-image', character: 'image' },
		{ id: 'file-type-asset-material', character: 'group_work' },
		{ id: 'file-type-asset-model', character: 'deployed_code' },
		{ id: 'file-type-asset-style', character: 'tag' },
		{ id: 'file-type-asset-video', character: 'videocam' },
		{ id: 'file-type-document-audio', character: 'volume_up' },
		{ id: 'file-type-document-image', character: 'image' },
		{ id: 'file-type-document-material', character: 'group_work' },
		{ id: 'file-type-document-math', character: 'function' },
		{ id: 'file-type-document-model', character: 'deployed_code' },
		{ id: 'file-type-document-presentation', character: 'ad_group' },
		{ id: 'file-type-document-spreadsheet', character: 'table_chart' },
		{ id: 'file-type-document-text', character: 'article' },
		{ id: 'file-type-document-video', character: 'videocam' },
		{ id: 'file-type-drive', character: 'hard_drive_2' },
		{ id: 'file-type-executable', character: 'slideshow' },
		{ id: 'file-type-library', character: 'account_tree' },
		{ id: 'file-type-lock', character: 'lock' },
		{ id: 'file-type-package', character: 'package_2' },
		{ id: 'file-use-automation', character: 'conversion_path' },
		{ id: 'file-use-configuration', character: 'settings' },
		{ id: 'file-use-synchronization', character: 'sync_alt' },
		{ id: 'folder-default', character: 'folder' },
		{ id: 'folder-use-configuration', character: 'folder_managed' },
		{ id: 'folder-use-generation', character: 'topic' },
		{ id: 'folder-use-synchronization', character: 'folder_data' }
	]
	
	let fileExtensions = new Map<string, string>()
	let fileNames = new Map<string, string>()
	let folderNames = new Map<string, string>()
	
	let fileNameGroups: FileNameGroup[] = [
		// name
		{
			icon: 'file-name-changelog',
			fileNames: [
				"changelist.md",
				"changelist.txt",
				"changelog.md",
				"changelog.txt",
				"changes.md",
				"changes.txt",
				"summary.md",
				"summary.txt"
			]
		},
		{
			icon: 'file-name-launch',
			fileNames: [ "launch.json" ]
		},
		{
			icon: 'file-name-license',
			fileNames: [ "license.md", "license.txt" ]
		},
		{
			icon: 'file-name-package',
			fileNames: [ "package.json" ]
		},
		{
			icon: 'file-name-readme',
			fileNames: [
				"guide.md",
				"guide.txt",
				"outline.md",
				"outline.txt",
				"overview.md",
				"overview.txt",
				"readme.md",
				"readme.txt",
			]
		},
		{
			icon: 'file-name-todo',
			fileNames: [
				"plan.md",
				"plan.txt",
				"todo.md",
				"todo.txt"
			]
		},
		// use
		{
			icon: 'file-use-automation',
			fileNames: []
		},
		{
			icon: 'file-use-configuration',
			fileNames: [
				"config.json",
				"tsconfig.json",
				"webpack.config.js",
				"webpack.js"
			]
		}
	]
	
	// append to file names
	fileNameGroups.forEach(x => {
		x.fileNames.forEach(y => fileNames.set(y, x.icon))
	})
	
	let fileTypeGroups: FileTypeGroup[] = [
		// format
		{
			icon: 'file-format-tag',
			fileExtensions: [
				"dhtml",
				"htm",
				"html",
				"html5",
				"shtml",
				"xhtml",
				"xml"
			]
		},
		// type
		{
			icon: 'file-type-archive',
			fileExtensions: [
				"7z",
				"arj",
				"deb",
				"gz",
				"jar",
				"pkg",
				"rar",
				"rpm",
				"tar",
				"z",
				"zip"
			]
		},
		{
			icon: 'file-type-drive',
			fileExtensions: [
				"dmg",
				"iso",
				"toast",
				"vcd"
			]
		},
		{
			icon:'file-type-executable',
			fileExtensions: [
				"apk",
				"bat",
				"com",
				"exe",
				"msi",
				"o",
				"wsf"
			]
		},
		{
			icon: 'file-type-library',
			fileExtensions: [
				"bundle",
				"dll",
				"dylib"
			]
		},
		{
			icon: 'file-type-lock',
			fileExtensions: [ "lock" ]
		},
		{
			icon: 'file-type-package',
			fileExtensions: [ "vsix" ]
		},
		//     asset
		{
			icon: 'file-type-asset-audio',
			fileExtensions: [
				"aac",
				"aif",
				"aifc",
				"aiff",
				"au",
				"avr",
				"cda",
				"flac",
				"m3u",
				"m4a",
				"mid",
				"midi",
				"mp2",
				"mp3",
				"mpa",
				"mpc",
				"oga",
				"ogg",
				"plu",
				"vlc",
				"wav",
				"wma",
				"wpl"
			]
		},
		{
			icon: 'file-type-asset-code',
			fileExtensions: [
				"a",
				"a68",
				"ada",
				"asm",
				"c",
				"carbon",
				"cgi",
				"cl",
				"class",
				"clj",
				"cljc",
				"cljs",
				"coffee",
				"cpp",
				"cs",
				"d",
				"dart",
				"ex",
				"f",
				"f77",
				"f90",
				"for",
				"frag",
				"fs",
				"geom",
				"glsl",
				"go",
				"h",
				"hlsl",
				"hpp",
				"hs",
				"java",
				"jl",
				"js",
				"json",
				"kt",
				"kts",
				"l",
				"lisp",
				"litco",
				"lsp",
				"lua",
				"mat",
				"ml",
				"pas",
				"php",
				"pl",
				"py",
				"rs",
				"sc",
				"sh",
				"spv",
				"sql",
				"swift",
				"ts",
				"vb",
				"vert",
				"wasm",
				"wgsl"
			]
		},
		{
			icon: 'file-type-asset-data',
			fileExtensions: [
				"bin",
				"dat",
				"log",
				"sab",
				"sat",
				"sav"
			]
		},
		{
			icon: 'file-type-asset-database',
			fileExtensions: [
				"db",
				"dbf",
				"mdb"
			]
		},
		{
			icon: 'file-type-asset-font',
			fileExtensions: [
				"fnt",
				"fon",
				"otf",
				"ttf",
				"woff",
				"woff2"
			]
		},
		{
			icon: 'file-type-asset-image',
			fileExtensions: [
				"bmp",
				"dds",
				"gif",
				"heic",
				"heics",
				"heif",
				"heifs",
				"hif",
				"ico",
				"jpeg",
				"jpg",
				"png",
				"ps",
				"svg",
				"tif",
				"tiff",
				"webp"
			]
		},
		{
			icon: 'file-type-asset-material',
			fileExtensions: [
				"mdl",
				"mtl",
				"sbsar"
			]
		},
		{
			icon: 'file-type-asset-model',
			fileExtensions: [
				"3ds",
				"abc",
				"fbx",
				"gltf",
				"iges",
				"igs",
				"obj",
				"step",
				"stl",
				"stp",
				"x3d"
			]
		},
		{
			icon: 'file-type-asset-style',
			fileExtensions: [
				"css",
				"css3",
				"sass",
				"scss"
			]
		},
		{
			icon: 'file-type-asset-video',
			fileExtensions: [
				"3g2",
				"3gp",
				"avi",
				"flv",
				"h264",
				"hevc",
				"m4v",
				"mkv",
				"mov",
				"mp4",
				"mpeg",
				"mpg",
				"rm",
				"swf",
				"vob",
				"webm",
				"wmv"
			]
		},
		//     document
		{
			icon: 'file-type-document-audio',
			fileExtensions: [
				"als",
				"aup",
				"aup3",
				"avp",
				"cpr",
				"flp",
				"logic",
				"logicx",
				"sesx"
			]
		},
		{
			icon: 'file-type-document-image',
			fileExtensions: [
				"ai",
				"ase",
				"aseprite",
				"psd",
				"xcf"
			]
		},
		{
			icon: 'file-type-document-material',
			fileExtensions: [ "sbsprj", "spp" ]
		},
		{
			icon: 'file-type-document-math',
			fileExtensions: [ "tex" ]
		},
		{
			icon: 'file-type-document-model',
			fileExtensions: [
				"blend",
				"blend1",
				"c4d",
				"dwg",
				"dxf",
				"hip",
				"ma",
				"max",
				"prj",
				"skp",
				"zpr"
			]
		},
		{
			icon: 'file-type-document-presentation',
			fileExtensions: [ "ppt", "pptx", "key" ]
		},
		{
			icon: 'file-type-document-spreadsheet',
			fileExtensions: [
				"csv",
				"dif",
				"ods",
				"xls"
			]
		},
		{
			icon: 'file-type-document-text',
			fileExtensions: [
				"doc",
				"docx",
				"md",
				"odt",
				"pdf",
				"txt"
			]
		},
		{
			icon: 'file-type-document-video',
			fileExtensions: [
				"drp",
				"fcp",
				"prproj",
				"veg"
			]
		},
		// use
		{
			icon: 'file-use-automation',
			fileExtensions: [ "workflows/yaml", "workflows/yml" ]
		},
		{
			icon: 'file-use-configuration',
			fileExtensions: [
				"ini",
				"toml",
				"yaml",
				"yml"
			]
		},
		{
			icon: 'file-use-synchronization',
			fileExtensions: [ "gitattributes", "gitignore" ]
		}
	]
	
	// append to file extensions
	fileTypeGroups.forEach(x => {
		x.fileExtensions.forEach(y => fileExtensions.set(y, x.icon))
	})
	
	let folderNameGroups: FolderNameGroup[] = [
		{
			icon: 'file-use-automation',
			folderNames: [ "workflows" ]
		},
		{
			icon: 'folder-use-configuration',
			folderNames: [
				".cargo",
				".config",
				".vscode",
				"config"
			]
		},
		{
			icon: 'folder-use-generation',
			folderNames: [
				".bin",
				".build",
				".debug",
				".gen",
				".generated",
				".output",
				".release",
				".target",
				"bin",
				"build",
				"debug",
				"gen",
				"generated",
				"node_modules",
				"output",
				"release",
				"target"
			]
		},
		{
			icon: 'folder-use-synchronization',
			folderNames: [
				".git", ".github" ]
		}
	]
	
	// append to folder names
	folderNameGroups.forEach(x => {
		x.folderNames.forEach(y => folderNames.set(y, x.icon))
	})
	
	// generate theme file
	fs.writeFile(
		path,
		buildTheme(mode, font, icons, 'file-default', fileExtensions, fileNames, 'folder-default', folderNames), (error) => {
			if (error) {
				result.type = ResultType.Failure
				result.message = `Failed to write theme to file: ${error}`
			}
		}
	)
	
	return result
}

function main() {
	let modes = utilities.themeModeFlags(theme.ThemeMode.Dark)
	
	for (let mode of modes) {
		let directory = path.resolve(__dirname, '../../themes')
		let fileName = `kalimba-${utilities.themeModeToString(mode).toLowerCase()}`
		let filePath = `${directory}\\${fileName}.json`
		
		console.log(`Generating theme ${fileName}`)
		
		let result = generateThemeFile(filePath, mode)
		
		switch (result.type) {
			case ResultType.Success:
				console.log(`Successfully generated theme file at ${filePath}`)
				break;
			default:
				console.error(`Failed to generate theme file: ${result.message}`)
				break;
		}
	}
}

main()