/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Common = {
    DistCircle: function(p1, p2)
    {
	var diffX = Math.abs(p1.x - p2.x);
	var diffY = Math.abs(p1.y - p2.y);

	return Math.sqrt((diffX * diffX) + (diffY * diffY));
    },
    
    TimeToHHMMSS: function(time)
    {
	var sign = time < 0 ? "-" : "";
	var hour = Math.floor(Math.abs(time / 60 / 60) % 24);
	var min = Math.floor(Math.abs(time / 60) % 60);
	var sec = Math.floor(Math.abs(time) % 60);
	return sign + (hour < 10 ? "0" : "") + hour + 
		":" + (min < 10 ? "0" : "") + min + 
		":" + (sec < 10 ? "0" : "") + sec;
    },
    
    ExtractRGB(col)
    {
	var sc = col.slice(4, col.length - 1);
	
	var idx = sc.indexOf(",");
	var r = sc.slice(0, idx);
	var idx2 = sc.indexOf(",", idx+1);
	var g = sc.slice(idx + 1, idx2);
	var b = sc.slice(idx2 + 1);
	
	return {r:Number(r),g:Number(g),b:Number(b)};
    },
    
    LerpColor(val, fromCol, toCol)
    {
	if(val < 0)
	    val = 0;
	else if(val > 1)
	    val = 1;
	
	colf = Common.ExtractRGB(fromCol);
	colt = Common.ExtractRGB(toCol);
	
	var r = utils.lerp(val, colf.r, colt.r);
	var g = utils.lerp(val, colf.g, colt.g);
	var b = utils.lerp(val, colf.b, colt.b);
	
	return "rgb(" + Math.floor(r) + "," + Math.floor(g) + "," + Math.floor(b) + ")";
    }
};

class ColorLerp
{
    constructor(colf, colt)
    {
	this.colf = colf;
	this.colt = colt;
	this.stop = false;
    }
    
    set FromCol(col)
    {
	this.colf = col;
	this.stop = false;
    }
    set ToCol(col)
    {
	this.colt = col;
	this.stop = false;
    }
    get Finished()
    {
	return this.stop;
    }
    
    Reverse()
    {
	var c = this.colt;
	this.colt = this.colf;
	this.colf = c;
	this.stop = false;
    }
    
    Reset()
    {
	this.stop = false;
    }
    
    Lerp(val)
    {
	if(this.stop)
	    return colt;
	
	if(val >= 1.0)
	    this.stop = true;
	
	return Common.LerpColor(val, this.colf, this.colt);
    }
};

class CPoint
{
    constructor(x, y)
    {
	this.x = x;
	this.y = y;
    }
};

class LoopTime
{
    constructor()
    {
	this.Reset();
    }
    
    Reset()
    {
	this.date = new Date();
	this.loopStart = this.date.getTime();
	this.loopEnd = this.date.getTime();
	this.gt = 0.033;
	this.fpsCounter = 0;
	this.gtSum = 0;
	this.gtFull = 0;
	this.fps = 1.0 / this.gt;
    }
    
    Update()
    {
	this.date = new Date();
	this.loopEnd = this.date.getTime();
	
	this.gt = (this.loopEnd - this.loopStart) / 1000.0;
	this.fpsCounter++;
	this.gtSum += this.gt;
	this.gtFull += this.gt;
	
	this.loopStart = this.date.getTime();
	
	if(this.fpsCounter >= 100)
	{
	    this.fps = this.fpsCounter / this.gtSum;
	    this.fpsCounter = 0;
	    this.gtSum = 0;
	}
	
	return this.gt;
    }
}

class Timer
{
    constructor(time)
    {
	this.time = time;
	this.tstart = 0;
	this.bstart = false;
	this.bstop = false;
	this.tElapsed = 0;
    }
    
    Start()
    {
	this.bstart = true;
	this.bstop = false;
    }
    Stop()
    {
	this.bstop = true;
	this.bstart = false;
	this.tstart = 0;
	this.tElapsed = 0;
    }
    
    get Elapsed()
    {
	return this.tElapsed;
    }
    
    Update(gt)
    {
	if(this.bstop)
	    return false;
	
	if(this.bstart)
	{
	    this.bstart = false;
	    this.tstart = gt.gtFull;
	}
	
	this.tElapsed = gt.gtFull - this.tstart;
	
	if(gt.gtFull - this.tstart >= this.time)
	{
	    this.Stop();
	    return true;
	}
	
	return false;
    }
}

class Drawable
{
    constructor(pos, size, col)
    {
	this.pos = pos;
	this.size = size;
	this.color = col;
    }
    
    Render(ctx)
    {
	Drawable.RenderRectFill(ctx, this.pos, this.size, this.color)
    }
        
    static RenderRect(ctx, pos, size, lw, col)
    {
	if(!lw)
	    lw = 1;
	
	if(!col)
	    col = "#rgb(255,0,0)";
	
	ctx.beginPath();
	ctx.strokeStyle = col;
	ctx.lineWidth = lw;
	ctx.rect(pos.x, pos.y, size.x, size.y);
	ctx.stroke();
    }
    static RenderRectFill(ctx, pos, size, col)
    {
	if(!col)
	    col = "#rgb(255,0,0)";
	
	ctx.fillStyle = col;
	ctx.strokeStyle = "black";
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.rect(pos.x, pos.y, size.x, size.y);
	ctx.fill();
	ctx.stroke();
    }
    static RenderCircle(ctx, pos, r, col)
    {
	ctx.fillStyle = col;
	ctx.strokeStyle = "black";
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
	ctx.fill();
	ctx.stroke();
    }
}
    
class Entity extends Drawable
{
    constructor(pos, size, col)
    {
	super(pos, size, col);
	this.spd = 1.0;
    }
    
    set Speed(spd)
    {
	this.spd = spd;
    }
    
    Update(gt)
    {
	
    }
};

const AX_LEFT = "AX_LEFT";
const AX_MIDDLE = "AX_MIDDLE";
const AX_RIGHT = "AX_RIGHT";
const AY_TOP = "AY_TOP";
const AY_MIDDLE = "AY_MIDDLE";
const AY_BOTTOM = "AY_BOTTOM";

class HitBox
{
    constructor(x, y, w, h, ax, ay)
    {
	this.pos = new CPoint(x,y);
	this.size = new CPoint(w,h);
	this.alignX = ax ? ax : AX_LEFT;
	this.alignY = ay ? ay : AY_TOP;
	this.left = this.right = this.top = this.bottom = 0;
	this.calcBox();
    }
    
    calcBox()
    {
	switch(this.alignX)
	{
	    case "AX_LEFT":
		this.left = this.pos.x;
		this.right = this.pos.x + this.size.x;
		break;
	    
	    case "AX_MIDDLE":
		this.left = this.pos.x + this.size.x / 2;
		this.right = this.pos.x + this.size.x / 2;
		break;
	    
	    case "AX_RIGHT":
		this.left = this.pos.x - this.size.x;
		this.right = this.pos.x;
		break;
	}
	switch(this.alignY)
	{
	    case "AY_TOP":
		this.top = this.pos.y;
		this.bottom = this.pos.y + this.size.y;
		break;
	    
	    case "AY_MIDDLE":
		this.top = this.pos.y + this.size.y / 2;
		this.bottom = this.pos.y + this.size.y / 2;
		break;
	    
	    case "AY_BOTTOM":
		this.top = this.pos.y - this.size.y;
		this.bottom = this.pos.y ;
		break;
	}
    }
    
    set Pos(p)
    {
	this.pos = p;
	this.calcBox();
    }
    
    set Size(s)
    {
	this.size = s;
	this.calcBox();
    }
    
    Render(ctx)
    {
	var p = new CPoint(this.left, this. top);
	Drawable.RenderRect(ctx, p, this.size, 2, "rgb(255,0,0)");
    }
};