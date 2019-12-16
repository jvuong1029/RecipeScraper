export interface Ingredient {
	name: string;
	quantity?: number;
	units?: string;
	special?: string;
}

export interface Direction {
	step?: number;
	info: string;
}

enum Level {
	Easy,
	Medium,
	Hard
}

export interface Recipe {
    name: string;
	prepTime?: number;
    cookTime?: number;
    yield?: number;
    ingredients: Array<Ingredient>;
	directions: Array<Direction>;
	level?: Level;
	categories?: Array<string>;
    image?: string;
}

export class Recipe implements Recipe {}

export class Ingredient implements Ingredient {
	constructor(name: string) {
		this.name = name;
	}
}

export class Direction implements Direction {
    constructor(step: number, info: string) {
        this.step = step;
        this.info = info;
	}
}
