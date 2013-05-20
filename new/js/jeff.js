var WIDTH;
var HEIGHT;
var canvas;
var con;
var g;
var pxs = new Array();
var rint = 20;
var size = 12;
var count = 40;
var scale = 0.2;

$(document).ready(function(){
  WIDTH = window.innerWidth;
  HEIGHT = 2*window.innerHeight;
  canvas = document.getElementById('jeff');
  $(canvas).attr('width', WIDTH).attr('height',HEIGHT);
  con = canvas.getContext('2d');

  for(var i = 0; i < count; i++) {
    pxs[i] = new Circle();
    pxs[i].reset();
  }
  setInterval(draw,rint);

});

function draw() {
  con.clearRect(0,0,WIDTH,HEIGHT);
  for(var i = 0; i < pxs.length; i++) {
    //pxs[i].fade();
    pxs[i].move();
    pxs[i].draw();
  }
}

function Circle() {
  this.s = {ttl:8000, xmax:4, ymax:8, rmax:size, rt:1, xdef:960, ydef:540, xdrift:4, ydrift: 4, random:true, blink:true};

  this.reset = function() {
    this.x = (this.s.random ? WIDTH*Math.random() : this.s.xdef);
    this.y = (this.s.random ? HEIGHT*Math.random() : this.s.ydef);
    this.r = ((this.s.rmax-1)*Math.random()) + 1;
    this.dx = (Math.random()*this.s.xmax) * (Math.random() < .5 ? -1 : 1);
    this.dy = -(Math.random()*this.s.ymax);// * (Math.random() < .5 ? -1 : 1);
    this.hl = (this.s.ttl/rint)*(this.r/this.s.rmax);
    this.rt = Math.random()*this.hl;
    this.s.rt = Math.random()+1;
    this.stop = Math.random()*.2+.4;
    //this.s.xdrift *= Math.random() * (Math.random() < .5 ? -1 : 1);
    //this.s.ydrift *= Math.random() * (Math.random() < .5 ? -1 : 1);
  }

  this.fade = function() {
    this.rt += this.s.rt;
  }

  this.draw = function() {
    if(this.s.blink && (this.rt <= 0 || this.rt >= this.hl)) this.s.rt = this.s.rt*-1;
    else if(this.rt >= this.hl) this.reset();
    var newo = 1-(this.rt/this.hl);
    con.beginPath();
    con.arc(this.x,this.y,this.r,0,Math.PI*2,true);
    con.closePath();
    var cr = this.r*newo;
    //g = con.createRadialGradient(this.x,this.y,0,this.x,this.y,(cr <= 0 ? 1 : cr));
    //g.addColorStop(0.0, 'rgba(255,255,255,'+newo+')');
    //g.addColorStop(this.stop, 'rgba(117,197,86,'+(newo*.6)+')');
    //g.addColorStop(1.0, 'rgba(117,197,86,0)');
    //con.fillStyle = g;
    con.fillStyle = 'rgba(117,197,86,'+(newo*.8)+')';
    con.fill();
  }

  this.move = function() {
    //ill finish this off later
    //was trying to make them a bit genetic, changin direction kinda like
    //on blizzard site

    /*
    var velocity = Math.sqrt(this.dx*this.dx + this.dy*this.dy);
    var angle = Math.atan(this.dy / this.dx);
    var delta = (1 + (2 * Math.random() - 1) * scale);
    angle *= delta;
    
    var _angle = angle;
    if (_angle < 0) {
      angle += Math.PI;
    }

    this.dx = velocity * Math.cos(angle);
    this.dy = velocity * Math.sin(angle);

    //i shouldnt thave to do this...
    if(_angle > Math.PI) {
      this.dy *= -1;
    }

    if((_angle > Math.PI/2) && (_angle < 3*Math.PI/2)) {
      this.dx *= -1;
    }
    */

    this.x += (this.rt/this.hl)*this.dx;
    this.y += (this.rt/this.hl)*this.dy;
    if(this.x > WIDTH || this.x < 0) this.dx *= -1;
    if(this.y < 0) this.y = HEIGHT;
    if(this.y > HEIGHT) this.dy *= -1;

  }

  this.getX = function() { return this.x; }
  this.getY = function() { return this.y; }
}
