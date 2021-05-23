var para = {h:500,w:500,sky:50,bright:100,count:200,angle:10,walkcycle:0,clouds:16,car:0}; //all the parameters that can change it's appearance, including width and height of canvas, however most parameters are best left how they are optimised
var rain = [];       //where the rain particle class objects are stored in this array
var clouds = [];        //the clouds and the building classes are both stored in this array.

function setup() {       //runs at start to setup the parameters and modes
  noStroke(); //no edginess here
  rectMode(CENTER);     //so rectangles are drawn from the centre instead of top left corner.
  var canvas = createCanvas(para.w, para.h); 						//size of canvas currently best not changed
	canvas.parent('sketch-holder');    //used for CSS and html positioning, not in real code
	for(let i = 0; i < para.count; i++) {     //for loop creates all the rain particulates using a class, count is the amount of particles.
    rain.push(new drop());  //add new class of raindrop to array
    rain[i].construct();     //then run the construct for each raindrop.
	}
  for(let i = 0; i < para.clouds; i++) {     //for loop creates all the clouds/buildings using a class
    clouds.push(new clouder());    //new building/cloud added
    clouds[i].construct();       //runs the construct for it
  }
}

function draw() {      //runs everything in this every frame
  background(para.bright);     //colour of the background, though it is drawn over completely.
	for(let i = 0; i < para.sky; i++) {      //loop for doing the gradient in the sky
    fill(i*para.bright/para.sky);  //decides the fill for the part of the sky, the bright value is a standard of 100 but increases when lightning strikes
		rect(width/2,(i*height/para.sky)+(height/para.sky/2), width, height/para.sky+1) //does the pieces of the sky starting from the top
	}
  fill(0);    //sets to black for the floor
  rect(width/2,height,width,10)       //thin floor at bottom
	lightning();       //function for if lightning will strike
  for(let i = 0; i < para.count; i++) {     //for loop creates all the particulates using a class
        rain[i].make();    //draws all the rain particles using the i value of the iteration
	}
	person();    //draws the person
}

function person() {   //function for the walking person
  push();      //sets a push so any changes can be undone
translate(width/2, height);   //sets the origin to bottom middle
	fill(10);    //dark grey
  push();     //another push
  translate(0,para.walkcycle*2)  //translates the top part of body to give effect of bobbing, value is tied in with the every step
	rect(0,-55,12,12); //hair
	rect(-10,-55,5,41); //umbrella stick
	rect(-10,-67,45,5); //umbrella top part big
	rect(-10,-70,25,5); //smaller top part
	fill(200); //off white fill
	rect(0,-33,7,32);   //legs+body
	rect(0,-35,10,20); //arms
	rect(-10,-40,5,7); //hand
	rect(-7,-36,5,7); //forearm
  rect(-4,-52,3,7); //face
  fill(200,200,250);
  rect(1,-53,4,4); //headphone ear part
  rect(1,-57,2,7); //headphone head part
  pop(); //undo the changes
  
  push(); //setup another push pop for the rotates that control leg movements
  fill(200,200,250);    //off white-blue for jeans
  translate(0,-20);  //raise off ground for origin to pivot around to hip level
  rotate(-para.walkcycle); //move first leg
  rect(0,10,5,20);  //draw first leg
  rotate(2*para.walkcycle); //move other leg
  rect(0,10,5,20);    //draw other leg
  pop();     //undo the rotations
  para.walkcycle = para.walkcycle + PI/64;     //update the walkcycle for next frame
  if (para.walkcycle > PI/4) {  //if its done the cycle then begin back at start
  	para.walkcycle = -PI/4;      //sends it back to start
  }
  pop();   //undo changes
  splashy();   //function for splashing on ground and other foreground objects
}

function splashy() {     //function for splashing on ground and foreground
  for (var i = 0; i < 10; i++) {      //loop for each splash, there are 10 in random places every frame
    fill(200,200,250,35);      //the fill with a alpha value to make it translucent
		ellipse(random(0,width),height-3,15,random(10,30));   //small ovals embedded into the ground
    fill(0,i*15)   //does the gloominess over the clouds at the top
    rect(width/2,(10-i)*10,width,10)   //draw the gloomy sky layer at the top
	}
  para.car += 1;   //sets into motion the position of foreground layer
  fill(10);     //dark grey
  triangle(para.car-10,height, para.car+10,height, para.car, height-140); //trunk
  triangle(para.car+5,height-50, para.car-20,height-130, para.car-40, height-140); //small branch
  ellipse(para.car,height-140,60,60); //bush for tree
  ellipse(para.car-20,height-120,60,60);  //bush for tree
  ellipse(para.car+20,height-110,60,60); //bush for tree
  rect(para.car-550,height-22,50,5); //chair back1
  rect(para.car-550,height-30,50,5);  //chair back2
  rect(para.car-550,height-15,50,5); //chair seat
  rect(para.car-530,height-20,6,30); //chair leg1
  rect(para.car-570,height-20,6,30); //chair leg2
  if (para.car>width*2.2) {     //if the foreground does just over 2 times the width then it sends it back to the start to the left offscreen
    para.car=-width; //resets position
  }
  rect(width/2, height,width,5);  //the fore ground of the ground, saying it like that made more sense in my head
}


function lightning() { //function for lightning
	if (random(0,500) < 1) {       //random number every frame and if it happens to be below 1 then it triggers it. roughly 0.2% chance every frame
    para.bright = 250;  //change brightness of sky to much brighter
    fill(255); //white colour for the strike
  	rect(random(50,450),height/3,10,height);   //the very tall strike lasts a single frame a strikes at a random position
  }
  if (para.bright > 100) {    //the short if statement returns the brightness gradually to normal value
    para.bright -= 2;   //slow decrease in brightness and stops at normal value.
  }
  for(let i = 0; i < para.clouds; i++) {     //for loop creates all the particulates using a class
        clouds[i].make();
	}
}

class drop{      //particle class for rain
  construct() { //finds a random starting postion
 	this.y = random(height,0);   //finds ypostion in relation to canvas size
  this.x = random(0,width);     //finds xposition in relation to canvas size
  }
	make() {       //function for drawing the droplets
		fill(200,200,250,20);     //slightly transparent blurryness for drops
		for (var i = 0; i < para.angle; i++) {     //iterative loop for trail of blur
			rect(this.x,this.y,2,2);    //draws the droplets blur
			this.y++;  //moves position for next blur block
			this.x = this.x + 1/para.angle;        //moves position for next blur
		}
		fill(200,200,250);    //the solid part of the drop
		rect(this.x,this.y,2,2);   //draws ot
		this.y = this.y - random(0,6);      //reduces the position by an amount to make slightly quiver as though being hit by the wind
		this.x++;   //move the drops at an angle
		if (this.y > height) {     //if it hits the ground restart at top
			this.y = 0;   //sets postion to the sky
		}
		if (this.x > width) {      //if hits the right side it restarts horizontal postion
			this.x = 0;      //sets position to the left
		}
	}  
}

class clouder{     //class for clouds and buildings
  construct() {    //runs to define the random positions at start
 	this.y = random(30,160);  //a random value that defines how high the center of the building is
  this.x = random(-190,width+190);      //defines random value also dependent on size of canvas
  this.ysize = random(80,200);    //the tallness of the buildings
  this.xsize = (this.y - 20);      //the thickness of the buildings is related to the yposition
  }
	make() {     //runs this to draw them
		fill(10,this.xsize+5);     //dark grey, the transparency is dependent on how tall they are, figure the taller and more in background ones would be more shrouded by fog, so harder to see
		ellipse(this.x+50,this.y+10,this.ysize,170-this.y);  //draws a cloud for every building but slightly to the right so you dont see the obvious connection, moves relative to the speed of the building below
    ellipse(this.x-30,this.y,this.ysize*1.5,170-this.y);     //draws a second poof too the cloud in a slightly off position, the height of clouds is dependent on how low they are in the sky to create a perspective of the horizon
    rect(this.x,height,this.xsize,this.ysize*2.5); //does the building, originally got the x and y sizes round the wrong way, but ended up liking how it looked with skyscrapers like this after adding a multiplier to the height, it gave a stronger sense of perspective
		this.x = this.x + this.xsize/160;    //update the position, the speed it moves 
		if (this.x > width+190) {    //if it is well off the edge of the canvas put it back just to the left
			this.x = -190;       //chose -190 as the widest a cloud can be is 200.
		}
    if (this.xsize > 135) {     //if the width of building is nearly max thickness draw a street lamp with it
      fill(0);   //black
      rect(this.x,height,5,200);       //the lamp post
      rect(this.x+10,height-100,20,7);     //the hood part
      fill(250);     //near white
      rect(this.x+10,height-97,10,2);      //the bulb
      fill(250,60);      //the light rays of the lamp need to be slightly transparent
      quad(this.x+20,height-99, this.x,height-99,this.x-40,height, this.x+60,height)      //the light rays, done with a quad. the points are updated according to the x position
     }
	}  
}