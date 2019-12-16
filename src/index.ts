import jsdom from "jsdom";
import request from "request";

import { Direction, Ingredient, Recipe } from "./Recipe";

const { JSDOM } = jsdom; // const makes it unnecessary to retype the assigned value multiple times, it shortens it

// let allows the variable to be changed after each page
// initially assigned is the first page of the list of all the recipes
// this is different than var since var is a global variable that won't be "garbage collected" after each run, don't use var unless frontend
// url must be changed since we have to go through all the pages
let url = "https://www.foodnetwork.com/recipes/recipes-a-z";
// maxRecipes is set to 0 at first and let is used because we need to scrape for how many recipes there are
let maxRecipes = 0;

// Get max recipes
// use '.' infront of classes
getHtml(url)
	.then(html => {
		const dom = new JSDOM(html.toString());
		// split splits the string where the space is (" ") and makes elements with the substrings that are separated by the space
		// without the spaces included
		// same is done with the split with the ","
		// join joins the separated substrings in the elements together
		maxRecipes = Number(
			dom.window.document
				.querySelectorAll<HTMLAnchorElement>(
					".o-SearchStatistics__a-MaxPage"
				)[0]
				.innerHTML.split(" ")[1]
				.split(",")
				.join("")
		);
	})
	.catch(e => console.log(e));

// Set next page
// put multiple classes with '.' together
getHtml(url)
	.then((html: {}) => {
		console.log(`Current url: ${url}`);
		const dom = new JSDOM(html.toString());
		// href is a special tag
		url = dom.window.document.querySelectorAll<HTMLAnchorElement>(
			".o-Pagination__a-Button.o-Pagination__a-NextButton"
		)[0].href;
		// console log prints the url obtained
		console.log(url);
	})
	.catch(e => console.log(e));

// Get recipe page
// use '.' infront of classes
getHtml(url)
	.then(html => {
		const dom = new JSDOM(html.toString());
		// split splits the string where the space is (" ") and makes elements with the substrings that are separated by the space
		// without the spaces included
		// same is done with the split with the ","
		// join joins the separated substrings in the elements together
		maxRecipes = Number(
			dom.window.document.querySelectorAll<HTMLAnchorElement>(
				".m-MediaBlock__a-Headline"
			)
		);
	})
	.catch(e => console.log(e));

// delays the program until the information is loaded and obtained
async function getHtml(source: string) {
	return new Promise((resolve, reject) => {
		if (url === undefined) reject("No next button");
		request(source, (error, response, html) => {
			if (!error && response.statusCode == 200) {
				// 200 is special code like 401, etc
				resolve(html);
			} else {
				reject(response.statusCode); // print error message if url is unable to be resolved
			}
		});
	});
}

let recipeUrl =
	"https://www.foodnetwork.com/recipes/oven-baked-salmon-recipe-1911951";
getRecipe(recipeUrl);

// Get info from recipe page link, return Recipe object
function getRecipe(source: string) {
	return new Promise<Recipe>((resolve, reject) => {
		getHtml(source)
			.then(html => {
				const dom = new JSDOM(html.toString());
				let rec = new Recipe();
				let ingredients = new Array<Ingredient>();
				let directions = new Array<Direction>();
				let categories = new Array<string>();

				// retrieve name
				// let name = dom.window.document.querySelectorAll<HTMLSpanElement>("o-AssetTitle__a-HeadlineText")[6].textContent;
				// console.log(name);
				// rec.name = name;

				// retrieve prep time
				// let prep = dom.window.document.querySelectorAll<HTMLSpanElement>("o-RecipeInfo__a-Description")[1].textContent;
				// console.log(prep);
				// rec.prep = prep;

				// retrieve ingredients on recipe page
				dom.window.document
					.querySelectorAll<HTMLParagraphElement>(
						".o-Ingredients__a-Ingredient"
					)
					.forEach(e => {
						let temp = new Ingredient(e.textContent);
						console.log(temp);
						ingredients.push(temp);
					});

				let listNum = 1;
				// retrieve directions on recipe page
				dom.window.document
					.querySelectorAll<HTMLLIElement>(".o-Method__m-Step")
					.forEach(e => {
						let temp = new Direction(listNum++, (e.textContent).trim());
						console.log(temp);
						directions.push(temp);
					});

				dom.window.document
					.querySelectorAll<HTMLAnchorElement>(
						"o-Capsule__a-Tag a-Tag"
					)
					.forEach(e => {
						let temp = e.textContent;
						console.log(e);
						categories.push(temp);
					});

				// retrieve link for pic
				rec.image = dom.window.document.querySelectorAll<
					HTMLImageElement
				>(".m-MediaBlock__a-Image.a-Image")[3].src;
				console.log(`Pic url: ${rec.image}`);

				rec.ingredients = ingredients;
				rec.directions = directions;
				resolve(rec);
			})
			.catch(e => reject(e));
	});
}
