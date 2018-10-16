
var article;
// article = require("./pacuru.json");
// article = require("./brush.json");
article = require("./scene.json");
// article = require("./clash_royal.json");


window.loadArticle = ()=>{
    Entry.loadProject(article);
};

