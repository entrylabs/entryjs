
var article;
// article = require("./pacuru.json");
// article = require("./brush.json");
article = require("./scene.json");


window.loadArticle = ()=>{
    Entry.loadProject(article);
};

