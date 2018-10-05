import { ProjectParser } from '../atlas/ProjectParser';

var article;
// article = require("./pacuru.json");
// article = require("./brush.json");
article = require("./scene.json");

ProjectParser.parse(article.objects);
/*
window.loadArticle = ()=>{
    Entry.clearProject();
    Entry.loadProject(article);
};
if(article) {
    setTimeout(window.loadArticle, 2000);
}
*/

