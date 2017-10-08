/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class GameState
{
    constructor(gs, upd, ren)
    {
	this.Set(gs, upd, ren);
    }
    
    Set(gs, upd, ren)
    {
	this.gs = gs;
	this.update = upd;
	this.render = ren;
    }
};

const K_JUMP = 38;
const K_LEFT = 37;
const K_RIGHT = 39;

const VEL_MAX_X = 4;
const VEL_MAX_JUMP = -9;
const VEL_MAX_FALL = 6;
const MIN_ACC_X = 0.2;
const ACC_UP_X = 0.1;
const ACC_DO_X = MIN_ACC_X;
const ACC_JUMP = -0.6;
const ACC_FALL = 0.3;

class Player extends Entity
{
    constructor(pos, size, col)
    {
	super(pos, size, col);
	this.vel = new CPoint(0,0);
	this.onGround = false;
	this.onJump = false;
	this.onJumpFin = false;
	this.hitBox = new HitBox(pos.x, pos.y, size.x, size.y, AX_LEFT, AY_BOTTOM);
    }
    
    Init(pos)
    {
	this.pos = pos;
	this.hitBox.Pos = pos;
	this.onGround = false;
	this.onJump = false;
	this.onJumpFin = false;
	this.vel = new CPoint(0,0);
    }
    
    Update(gt)
    {	
	if(!this.onGround)
	{
	    if(this.vel.y >= 0)
		this.vel.y += ACC_FALL;
	    
	    if(this.vel.y > VEL_MAX_FALL)
		this.vel.y = VEL_MAX_FALL;
	}
	else if(!keys[K_JUMP])
	{
	    this.onJump = false;
	    this.onJumpFin = false;
	}
	
	if(keys[K_JUMP] && !this.onJumpFin)
	{
	    this.onGround = false;
	    this.onJump = true;
	    
	    this.vel.y += ACC_JUMP;
	    if(this.vel.y < VEL_MAX_JUMP)
	    {
		this.vel.y = VEL_MAX_JUMP;
		this.onJumpFin = true;
	    }
	}
	else
	    this.onJump = false;
	
	if(this.onGround)
	{
	    if(this.vel.y > 0)
		this.vel.y = 0;
	    
	    if(keys[K_LEFT])
		this.vel.x += -ACC_UP_X;
	    else if(keys[K_RIGHT])
		this.vel.x += ACC_UP_X;
	    else
	    {
		this.vel.x += (this.vel.x < 0 ? ACC_DO_X : -ACC_DO_X);
		if(Math.abs(this.vel.x) <= MIN_ACC_X)
		    this.vel.x = 0;
	    }
	}
	if(!this.onJump && this.vel.y < 0)
	    this.vel.y += (this.vel.y < 0 ? 0.5 : -0.5);
	
	// limit x-velocity
	if(Math.abs(this.vel.x) > VEL_MAX_X)
	    this.vel.x = this.vel.x < 0 ? -VEL_MAX_X : VEL_MAX_X;
	
	this.pos.x += this.vel.x;
	this.pos.y += this.vel.y;
	
	this.hitBox.Pos = this.pos;
    }
    
    toString()
    {
	return "POS: " + this.pos.x.toFixed(2) + ":" + this.pos.y.toFixed(2) + 
	       " - VEL: " + this.vel.x.toFixed(2) + ":" + this.vel.y.toFixed(2);
    }
    
    set Pos(p)
    {
	this.pos = p;
	this.hitBox.Pos = p;
    }
    
    Render(ctx, gt)
    {
	ctx.fillStyle = this.color;
	var p = new CPoint(this.pos.x + this.size.x / 2, this.pos.y - this.size.y / 3 - this.size.x / 2);
	Drawable.RenderCircle(ctx, p, this.size.x / 2, this.color);
	p = new CPoint(this.pos.x, this.pos.y - this.size.y / 3);
	Drawable.RenderRectFill(ctx, p, new CPoint(this.size.x, this.size.y / 3), this.color);
	this.hitBox.Render(ctx);
    }
}

class Platform extends Entity
{
    constructor(pos, size, col)
    {
	super(pos, size, col);
	
    }
    
    HasHit(hitbox)
    {	
	console.log(hitbox.bottom);
	if(hitbox.bottom < this.pos.y)
	    return false;
	
	if(hitbox.top > this.pos.y + this.size.y)
	    return false;
	
	if(hitbox.right < this.pos.x)
	    return false;
	
	if(hitbox.left > this.pos.x + this.size.x)
	    return false;
	
	return true;
    }
    
    Update(gt)
    {
	
    }
}
