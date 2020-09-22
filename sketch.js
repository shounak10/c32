//Module aliases
const {Engine, World, Bodies, Body, Constraint} = Matter;

//Variables
var stand1, stand2, sqrs = [], toConnect = false, rocks = [],currentRock = 0, gameScore = 0, backgroundclr;
function preload(){
  setBackground();
}
function setup() {
  createCanvas(800,400); //Creating the canvas

  //Creating the engine and the world
  engine = Engine.create();
  world = engine.world;

  //Creating the two stands for the ground
  stand1 = new Ground(300,350,200,10);
  stand2 = new Ground(600,200,200,10);

  //Calling function to create the towers
  drawTowers();

  //Creating a rock for breaking the tower
  rocks.push(new Rock(150,100,random(3,6),50));
  //Creating the slingshot to launch the tower
  sling = new SlingShot(rocks[currentRock].body,{x: 150, y: 90});
}
function draw() {
  if(backgroundclr)
    background(backgroundclr);  //Displaying the background
  else{
    setBackground();
    background("white");
    text("score the hightest ",50,50);
  }
  //Displaying both the stands at all times
  stand1.display();
  stand2.display();

  //Displaying the towers
  for(i = 0; i < sqrs.length; i++)
    sqrs[i].display();
  //Displaying the rocks
  let j = 0;
  while(j < rocks.length){
    rocks[j].display();
    j++;
  }

  //Displaying the sling only when the body is connected to it
  if(sling.sling.bodyA)
    sling.display();
  //Setting the position of the rock if it is connected to the slingshot
  if(toConnect)
    Body.setPosition(rocks[currentRock].body,{x: mouseX, y: mouseY});

  //Displaying text
  push();
  textSize(20);
  textAlign(CENTER);
  fill(0,0,255,100);
  text("Drag the square to hit the towers",width/2,50);
  fill(255,0,0,100);
  text("Press to r reset the towers",width/2,75);
  fill(200,200,0);
  text("Score: "+gameScore, 750, 50);
  pop();

  Engine.update(engine); //Updating the engine
}
//Functions to handle mouse inputs
function mouseDragged(){
   toConnect = true;
}
function mouseReleased(){
  sling.fly();
  toConnect = false;
  let t = setTimeout(function(){
    rocks.push(new Rock(150,100,random(3,6),50));
    currentRock++;
    sling.sling.bodyA = rocks[currentRock].body;
    clearTimeout(t);
  },100);
}

//Function to handle keyboard inputs
function keyPressed(){
  if(key === "r"){
    //Restarting the setup
    //Destroying all the rocks
    for(i = rocks.length-1; i>=0; i--){
      World.remove(world,rocks[i].body);
      rocks.splice(i,1);
      currentRock--;
    }
    rocks.push(new Rock(150,100,random(3,6),50)); //Creating a new rock
    currentRock++;
    sling.sling.bodyA = rocks[currentRock].body; //Attaching it to the sling
    //Destroying the towers
    for(i = sqrs.length-1; i>=0; i--){
      World.remove(world,sqrs[i].body);
      sqrs.splice(i,1);
    }
    drawTowers(); //Drawing them again
    gameScore = 0;
  }
}
//Function to draw the towers
function drawTowers(){
  let pos1 = stand1.body.vertices[0];
  for(i = pos1.x+25; i <= stand1.body.vertices[1].x-25; i+=25)
    sqrs.push(new Box(i,pos1.y-17.5,25,25));
  for(i = pos1.x+50; i <= stand1.body.vertices[1].x-50; i+=25)
    sqrs.push(new Box(i,pos1.y-42.5,25,25));
  for(i = pos1.x+75; i <= stand1.body.vertices[1].x-75; i+=25)
    sqrs.push(new Box(i,pos1.y-67.5,25,25));
  for(i = pos1.x+100; i <= stand1.body.vertices[1].x-100; i+=25)
    sqrs.push(new Box(i,pos1.y-92.5,25,25));

  pos1 = stand2.body.vertices[0];
  for(i = pos1.x+25; i <= stand2.body.vertices[1].x-25; i+=25)
    sqrs.push(new Box(i,pos1.y-17.5,25,25));
  for(i = pos1.x+50; i <= stand2.body.vertices[1].x-50; i+=25)
    sqrs.push(new Box(i,pos1.y-42.5,25,25));
  for(i = pos1.x+75; i <= stand2.body.vertices[1].x-75; i+=25)
    sqrs.push(new Box(i,pos1.y-67.5,25,25));
  for(i = pos1.x+100; i <= stand2.body.vertices[1].x-100; i+=25)
    sqrs.push(new Box(i,pos1.y-92.5,25,25));
}
async function setBackground(){
  let response = await fetch("http://worldtimeapi.org/api/timezone/Asia/Calcutta");
  let responseJSON = response.json();
  let hour = responseJSON.datetime.slice(11,13);
  let col;
  if(hour > 6 && hour < 18)
    col = color(100,100,255);
  else
    col = color(0,0,0);
  backgroundclr = col;
}