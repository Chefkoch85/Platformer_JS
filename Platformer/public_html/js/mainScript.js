/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//<-------------------------
// LoadJS-lib
// load *.js file on the fly
var initStep = 0;
var scripts = ["js/utils.js", "js/Common.js", "js/GameData.js", "js/Game.js"];
function LoadJS(file)
{   
    // load a scriptfile on the fly
    var gameScript = document.createElement("script");
    gameScript.type = "text/javascript";
    gameScript.src = file;
    gameScript.onload = InitNext;
    // in den <head> Bereich einfügen
    document.getElementsByTagName('head')[0].appendChild(gameScript);
}
function InitNext()
{
    if(initStep === scripts.length)
	return;
    
    LoadJS(scripts[initStep]);
    initStep++;
}
// LoadJS-lib
//------------------------->

function InitPage()
{
    InitNext();
}
window.onload = InitPage;
