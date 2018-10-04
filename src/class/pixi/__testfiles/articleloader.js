
var article;
// article = require("./pacuru.json");
article = require("./brush.json");


window.loadArticle = ()=>{
    Entry.clearProject();
    Entry.loadProject(article);
};
if(article) {
    setTimeout(window.loadArticle, 2000);
}

