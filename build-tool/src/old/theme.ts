export interface Theme {
	fonts: Font[],
	iconDefinitions: Object // Map<string, IconDefinition>
	file: string,
	fileExtensions: Object // Map<string, string>,
	fileNames: Object // Map<string, string>,
	folder: string,
	folderNames: Object // Map<string, string>
}

export enum ThemeMode {
	Dark = 0xcccccc,
	Light = 0x333333
}

export interface Font {
	id: string,
	src: FontSrc[],
	weight: string,
	style: string,
	size: string
}

export interface FontSrc {
	path: string,
	format: string
}

export interface IconDefinition {
	// iconPath: string,
	fontCharacter: string,
	fontColor: string,
	// fontSize: string,
	// fontId: string,
}
