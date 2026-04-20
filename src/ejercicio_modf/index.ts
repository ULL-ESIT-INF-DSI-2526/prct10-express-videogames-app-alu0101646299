import { getCategories } from "./getCategories.js";
import { difficulties, findQuestions, types } from "./findQuestions.js";

getCategories().then(data => console.log(data.message));
findQuestions(9, difficulties.EASY, types.BOOLEAN).then(data => console.log(data));