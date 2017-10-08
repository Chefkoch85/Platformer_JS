/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// global vars for init-UI
// -> constants
const SURFACE_SCALE = 0.5;
// -> size and mouse-pos
var gSize = new CPoint(0,0);
var gPointMouse = new CPoint(0,0);
// -> ui vars
var gbtnStart;
var gpInfo0, gpInfo1, gpInfo2, gpInfo3, gpInfo4, gpInfo5;
// -> canvas vars
var gcSurface;
var grCanvas;	// needed for mouse pos calculation
var gCtx;

InitGameUI();
function InitGameUI()
{
    gbtnStart = document.getElementById("btnStart");
    if(gbtnStart === null)
	alert("btnStart not found");
    else
	gbtnStart.addEventListener("click", StartGame);

    gcSurface = document.getElementById("drawSurface");
    if(gcSurface === null)
	alert("cSurface not found");
    
    gcSurface.style.backgroundColor = "rgb(0,0,0)";
    var w = gcSurface.clientWidth;
    var h = gcSurface.clientHeight;
    gSize.x = gcSurface.width = parseInt(w * SURFACE_SCALE);
    gSize.y = gcSurface.height = parseInt(h * SURFACE_SCALE);
    grCanvas = gcSurface.getBoundingClientRect();
    
    gCtx = gcSurface.getContext("2d");   
    
    gpInfo0 = document.getElementById("pInfo0");
    if(gpInfo0 === null)
	alert("pInfo0 not found");
    else
	DrawMouseCoords(gpInfo0, gPointMouse);
    
    gpInfo1 = document.getElementById("pInfo1");
    if(gpInfo1 === null)
	alert("pInfo1 not found");
    
    gpInfo2 = document.getElementById("pInfo2");
    if(gpInfo2 === null)
	alert("pInfo2 not found");
    
    gpInfo3 = document.getElementById("pInfo3");
    if(gpInfo3 === null)
	alert("pInfo3 not found");
    else
	DrawGameTime(gpInfo3, 0);
    
    gpInfo4 = document.getElementById("pInfo4");
    if(gpInfo4 === null)
	alert("pInfo4 not found");
    else
	gpInfo4.textContent = "Alive";
    
    gpInfo5 = document.getElementById("pInfo5");
    if(gpInfo5 === null)
	alert("pInfo5 not found");
    else
	gpInfo5.textContent = "W: " + gSize.x + " H: " + gSize.y;
    
    document.body.addEventListener("mousemove", onMouseMove);
    document.body.addEventListener("keydown", onKeyDown);
    document.body.addEventListener("keyup", onKeyUp);
}

function DrawMouseCoords(pInfo, mp)
{
    pInfo.textContent = "X: " + mp.x + 
	    " - Y: " + mp.y;
}
function DrawCanvasSize(pInfo, size)
{
    pInfo.textContent = "W: " + size.x + 
	    " - H: " + size.y;
}
function DrawGameSpeedInfo(pInfo, gs, gt, fps)
{
    pInfo.textContent = "GS: " + gs + 
	    " - GT: " + gt + 
	    " - FPS: " + fps;
}
function DrawGameTime(pInfo, gtfull)
{    
    pInfo.textContent = "GTF: " + Common.TimeToHHMMSS(gtfull);
}
function DrawPlayerInfo(pInfo, player)
{    
    pInfo.textContent = player.toString();
}

var keys = [];
function onMouseMove(event)
{
    gPointMouse.x = parseInt((event.clientX - grCanvas.left) / (gcSurface.clientWidth) * gSize.x);
    gPointMouse.y = parseInt((event.clientY - grCanvas.top) / (gcSurface.clientHeight) * gSize.y);
    
    gPointMouse.x = utils.clamp(gPointMouse.x, 0, gSize.x);
    gPointMouse.y = utils.clamp(gPointMouse.y, 0, gSize.y);
    
    DrawMouseCoords(gpInfo0, gPointMouse);
}
function onKeyDown(event)
{
    keys[event.keyCode] = true;
}
function onKeyUp(event)
{
    if(keys[13] && !renderStarted)
    {
	StartGame();
    }
    delete keys[event.keyCode];
}

// global common vars
// -> enums
const GS_INIT = "GS_INIT";
const GS_START = "GS_START";
const GS_RUN = "GS_RUN";
const GS_END = "GS_END";
// -> common
var gGameSpeed = 1.0;
var gLoopTime = new LoopTime();
var gGameState = null;
// -> game vars
var player = new Player(new CPoint(100,50), new CPoint(20,50), "rgb(200,0,50)");
var platforms = [new Platform(new CPoint(50,200), new CPoint(200, 30), "rgb(230, 115, 0)"),
		 new Platform(new CPoint(260,100), new CPoint(200, 30), "rgb(230, 115, 0)"),
		 new Platform(new CPoint(450,220), new CPoint(80, 30), "rgb(230, 115, 0)")];
var gColLerp = new ColorLerp("rgb(0,0,0)", "rgb(0,204, 255)");
var gTimer = new Timer(1);

function InitGameVars()
{
    gcSurface.style.backgroundColor = "rgb(0,0,0)";
    gLoopTime.Reset();
    gColLerp.Reset();
    player.Init(new CPoint(100,50));
}

var renderStarted = false;
function StartGame()
{
    InitGameVars();
    
    gGameState = new GameState(GS_START, UpdateIntro, RenderIntro);
    gTimer.Start();
    
    if(!renderStarted)
	Loop();
    
    renderStarted = true;    
}

function Loop()
{
    gLoopTime.Update();
        
    gGameState.update(gLoopTime);
    
    gCtx.clearRect(0, 0, gSize.x, gSize.y);
    gGameState.render(gCtx, gLoopTime);
    
    DrawPlayerInfo(gpInfo2, player);
    DrawGameTime(gpInfo3, gLoopTime.gtFull);
    DrawGameSpeedInfo(gpInfo4, gGameSpeed, gLoopTime.gt.toFixed(3), gLoopTime.fps.toFixed(2));
    DrawCanvasSize(gpInfo5, gSize);
    
    requestAnimationFrame(Loop);
}

function UpdateIntro(gt)
{
    if(gTimer.Update(gt))
    {
	gTimer.Start();
	gGameState.Set(GS_RUN, Update, Render);
    }
}
function RenderIntro(ctx, gt)
{
    gcSurface.style.backgroundColor = gColLerp.Lerp(gTimer.Elapsed / gTimer.time);
    ctx.font = "bold 200px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline="middle"; 
    ctx.fillText("C K T",gSize.x / 2,gSize.y / 2);
}


function Update(gt)
{
    if(false && gTimer.Update(gt))
    {
	gColLerp.Reverse();
	gTimer.Start();
	gGameState.Set(GS_END, UpdateOutro, RenderOutro);
    }
    player.Update(gt);
    
    player.onGround = false;
    for(var i = 0; i < platforms.length; ++i)
    {
	var plt = platforms[i];
	
	plt.Update(gt);
	
	if(plt.HasHit(player.hitBox))
	{
	    console.log("hit");
	    player.onGround = true;
	}
    }
}
function Render(ctx, gt)
{
    gcSurface.style.backgroundColor =  "rgb(0,204, 255)";
    player.Render(ctx, gt);
    for(var i = 0; i < platforms.length; ++i)
	platforms[i].Render(ctx, gt);
}


function UpdateOutro(gt)
{
    if(gTimer.Update(gt))
    {
	gTimer.Start();
	gColLerp.Reverse();
	gGameState.Set(GS_START, UpdateIntro, RenderIntro);
    }
}
function RenderOutro(ctx, gt)
{
    gcSurface.style.backgroundColor = gColLerp.Lerp(gTimer.Elapsed / gTimer.time);
    ctx.font = "bold 200px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline="middle"; 
    ctx.fillText("C K T",gSize.x / 2,gSize.y / 2);
}
