import { Theme, ThemeMode, Font, FontSrc, IconDefinition } from './theme';

export interface FontOutline {
	name: string,
	path: string,
	format: string
}

export function fontFromOutline(font: FontOutline): Font {
	return {
		id: font.name,
		src: [
			{
				path: font.path,
				format: font.format
			}
		],
		weight: 'normal',
		style: 'normal',
		size: '125%'
	}
}

export interface IconOutline {
	id: string,
	character: string
}

function hexToString(x: number): string {
	return x.toString(16).padStart(2, '0');
}

export function iconDefinitionFromOutline(mode: ThemeMode, icon: IconOutline, _font: string): IconDefinition {
	return {
		fontCharacter: icon.character,
		fontColor: `#${hexToString(mode)}`,
		// fontId: font
	}
}

export function themeModeFlags(mode: ThemeMode): ThemeMode[] {
	let result: ThemeMode[] = [];
	
	if ((mode & ThemeMode.Dark) === ThemeMode.Dark) result.push(ThemeMode.Dark);
	if ((mode & ThemeMode.Light) === ThemeMode.Light) result.push(ThemeMode.Light);
	
	return result;
}

export function themeModeToString(mode: ThemeMode): string {
	switch (mode) {
		case ThemeMode.Dark:
			return "Dark";
			break;
		case ThemeMode.Light:
			return "Light";
			break;
	}
}