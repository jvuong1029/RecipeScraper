"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
// const makes it unnecessary to retype the assigned value multiple times, it shortens it
var request_1 = require("request");
var jsdom_1 = require("jsdom");
var Recipe_1 = require("./Recipe");
var JSDOM = jsdom_1["default"].JSDOM;
// let allows the variable to be changed after each page
// initially assigned is the first page of the list of all the recipes
// this is different than var since var is a global variable that won't be "garbage collected" after each run, don't use var unless frontend
var url = "https://www.foodnetwork.com/search/p/1";
// maxRecipes is set to 0 at first and let is used because we need to scrape for how many recipes there are
var maxRecipes = 0;
// Get max recipes
// use '.' infront of classes
getHtml(url).then(function (html) {
    var dom = new JSDOM(html.toString());
    // split splits the string where the space is (" ") and makes elements with the substrings that are separated by the space
    // without the spaces included
    // same is done with the split with the ","
    // join joins the separated substrings in the elements together
    maxRecipes = Number(dom.window.document.querySelectorAll(".o-SearchStatistics__a-MaxPage")[0].innerHTML.split(" ")[1].split(",").join(""));
})["catch"](function (e) { return console.log(e); });
// Set next page
// put multiple classes with '.' together
getHtml(url).then(function (html) {
    console.log("Current url: " + url);
    var dom = new JSDOM(html.toString());
    // href is a special tag
    url = dom.window.document.querySelectorAll(".o-Pagination__a-Button.o-Pagination__a-NextButton")[0].href;
    // console log prints the url obtained
    console.log(url);
})["catch"](function (e) { return console.log(e); });
// delays the program until the information is loaded and obtained
function getHtml(source) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    if (url === undefined)
                        reject("No next button");
                    request_1["default"](source, function (error, response, html) {
                        if (!error && response.statusCode == 200) { // 200 is special code like 401, etc
                            resolve(html);
                        }
                        else {
                            reject(response.statusCode); // print error message if url is unable to be resolved
                        }
                    });
                })];
        });
    });
}
var recipeUrl = "https://www.foodnetwork.com/recipes/oven-baked-salmon-recipe-1911951";
getRecipe("https://www.foodnetwork.com/recipes/oven-baked-salmon-recipe-1911951");
// Get info from recipe page link, return Recipe object
function getRecipe(source) {
    getHtml(source).then(function (html) {
        var dom = new JSDOM(html.toString());
        var rec = new Recipe_1.Recipe();
        var ingredients = new Array();
        var directions = new Array();
        // pic
        rec.image = dom.window.document.querySelectorAll(".m-MediaBlock__a-Image.a-Image")[3].src;
        console.log("Pic url: " + rec.image);
        // ingredients on recipe page
        //dom.window.document.querySelectorAll<HTMLParagraphElement>(".o-Ingredients__a-Ingredient").forEach(e => {
        Array.from(document.querySelectorAll(".o-Ingredients__a-Ingredient")).forEach(function (e) {
            var temp = new Recipe_1.Ingredient();
            temp.name = e.innerText;
            console.log(temp.name);
            ingredients.push(temp);
        });
        rec.ingredients = ingredients;
        rec.directions = directions;
        return rec;
    })["catch"](function (e) { return console.log(e); });
}
