// Water Resistance 
//https://www.khanacademy.org/computing/computer-programming/programming-natural-simulations/programming-forces/a/air-and-fluid-resistance

// Variables

var canvas = false;
var introScreen = true;
//var gameOverScreen = false;
//var restartScreen = false;
var gameActive = false;
var playerActive = false;

var startAnimation = false;
var startRadius = 0;
var startSpeed = 15;

var showPhysics = true;

var playerInput = {
    up: false,
    left: false,
    down: false,
    right: false,
    attack: false,
};

// Unused Idea
//var greenScreenHeight = 0;
//var greenScreenSpeed = 3;

var duckGroup = [];
var pineappleGroup = [];
var statueGroup = [];
var explodappleGroup = [];
var explosionGroup = [];
var decoration = [];

var environment = false;

var time = 0;
var gravity = 0.8;
var dragConstant = 1;
var waterDensity = 1;
var speedBarrier = 30;
var explodableForce = 300000000;
var leftBoundary = 500;

var duckSpeedMax = 7;
var duckSpeed = 2;
var duckJumpSpeed = 25;
var duckAttackForce = 100000;

var terminalSpeed = 15;
var maxObject = 10;

var percipitation = [];
var percipitationFrame = 10;
var percipitationConstant = 7;
var percipitationMinimumSpeed = 3;
var percipitationSpeedChange = 0.5;

var waterSurface = [];
var waveDeltaX = 50;
//var waterTemperature;
var waterVolume = 100;
var waveAmplitude = 50;
var surfaceLayer = 7;
var waterLine = 200;
var waterHue = 225;
var waterBrightness = 200;
var waveSpeed = 0.02;

var gravitySlider, dragConstantSlider, waterDensitySlider, forcebutton;
var textOffset = (leftBoundary-(368*0.7))/2;

var introTextData = [
    /*"Why does light objects float in the water?",
    "Why does heavy objects sink in the water?",    
    "Magic? No, it is merely science.",        
    "Due to gravity, objects fall down.",
    "In water, two forces resist the motion.",
    "Buoyancy, equal to the weight of the displaced water, opposes the force of gravity.",    
    "Like friction, water resistance opposes the motion of the object in a fluid.",    
    "To learn them, you must try.",    
    "Let there be light.",    */
    /*"And there was light.",*/ 
    {
        text: 'In the beginning, God created the heaven and the earth.',
        eraseBefore: true,
    },
    {
        text: 'And God said, "Let there be rules." So God made the laws. God called the laws, "science".',
        eraseBefore: true,
    },
    {
        text: 'God said, "Let objects fall." And it was so. God called the law, "gravity".',
        eraseBefore: true,
    },
    {
        text: 'God said, "Let objects float." And it was so. God called the law, "buoyancy".',
        eraseBefore: true,
        //eraseBefore: false,
    },
    {
        text: 'God said, "Let objects slow." And it was so. God called the law, "resistance".',
        eraseBefore: true,
        //eraseBefore: false,
    },
    {
        text: 'Then God said, "Let there be light," and there was light.',
        eraseBefore: true,
    },
    {
        text: 'God saw all that he had made, and it was good.',
        eraseBefore: true,
    },
];
var introText = "";
var introTextId = 0;
var introTextFrameSpeed = 2;
var introTextInputFlicker = {
    frameForIn: 50,
    frameForOut: 120,
    active: false,
    data: "\n\n[Press Space]",
}

var specialText = {
    
}
//var introTextNeedLength = introTextData[0].text.length;

var imageSrc = {};
var fontSrc = {};


// "Constructor" Function

function addDuck() {
    var duck = createSprite(width/2, -100);
    duck.scale = 0.3;
    duck.frameDelay = 8;
    duck.restitution = 1;
    duck.density = 0.5;
    duck.mass = duck.width * duck.height * duck.density;
    duck.limitSpeed(30);
    //duck.rotation = theta;
    //duck.debug = true;
    duck.setSpeed(0);
    duck.jump = false;
    duck.attack = false;
    
    duck.resistanceFactor = 100;
    duck.buoyantFactor = 1.1;
    
    duck.setCollider("rectangle", 0, 0, duck.width/duck.scale, duck.height/duck.scale);
    //console.log(duck)
    
    duck.addAnimation('idle', "Asset/Image/Rubber Duck/Idle/0.png", "Asset/Image/Rubber Duck/Idle/1.png");
    duck.addAnimation('motion', "Asset/Image/Rubber Duck/Motion/0.png", "Asset/Image/Rubber Duck/Motion/1.png");
    duck.addAnimation('jump', "Asset/Image/Rubber Duck/Jump/0.png", "Asset/Image/Rubber Duck/Jump/1.png");
    duck.addAnimation('attack', "Asset/Image/Rubber Duck/Attack/0.png", "Asset/Image/Rubber Duck/Attack/1.png", "Asset/Image/Rubber Duck/Attack/2.png", "Asset/Image/Rubber Duck/Attack/2.png");
    duckGroup.add(duck);
}

function addPineapple() {
    //var theta = (Math.random() * 140) + 110;
    var theta = 90;
    //var pineapple = createSprite(Math.random()*(width-150)+75, -100);
    var pineapple = createSprite(Math.random()*(width-150)+75+leftBoundary, -100);
    pineapple.scale = 0.5;
    pineapple.frameDelay = 8;
    //pineapple.setSpeed(terminalSpeed, theta);
    pineapple.setCollider("rectangle", 0, pineapple.height/8, pineapple.width, pineapple.height);
    
    pineapple.restitution = 1;
    pineapple.density = 0.15;
    pineapple.mass = pineapple.width * pineapple.height * pineapple.density;
    //pineapple.limitSpeed(1);
    //pineapple.rotation = theta;
    //pineapple.wallBounce = true;
    //pineapple.debug = true;
    
    pineapple.attacked = false;
    
    pineapple.resistanceFactor = 100;
    pineapple.buoyantFactor = 4.1;

    pineapple.addAnimation('normal', "Asset/Image/Pineapple/Normal/0.png");
    pineapple.addAnimation('attacked', "Asset/Image/Pineapple/Attacked/0.png", "Asset/Image/Pineapple/Attacked/1.png");
    pineappleGroup.add(pineapple);
    //console.log(pineapple)
}

function addStatue() {
    //var theta = (Math.random() * 140) + 110;
    var theta = 90;
    //var statue = createSprite(Math.random()*(width-150)+75, -100);
    var statue = createSprite(leftBoundary - (368*0.7/2), -100);
    statue.scale = 0.7;
    statue.frameDelay = 8;
    //statue.setSpeed(terminalSpeed, theta);
    statue.setCollider("rectangle", 0, 0, 368, 1072);
    
    statue.restitution = 1;
    statue.density = 0.9;
    statue.mass = 368 * 1072 * statue.density * 0.7 * 0.7;
    //statue.limitSpeed(1);
    //statue.rotation = theta;
    //statue.wallBounce = true;
    //statue.debug = true;
    statue.immovable = true;
    
    statue.attacked = false;
    
    statue.resistanceFactor = 100;
    statue.buoyantFactor = 1.1;
    
    statue.addAnimation('normal', "Asset/Image/Statue/Normal/0.png");
    statueGroup.add(statue);
}

function addExplodapple() {
    //var theta = (Math.random() * 140) + 110;
    var theta = 90;
    //var explodapple = createSprite(Math.random()*(width-150)+75, -100);
    var explodapple = createSprite(Math.random()*(width-150)+75+leftBoundary, -100);
    explodapple.scale = 0.5;
    explodapple.frameDelay = 8;
    //explodapple.setSpeed(terminalSpeed, theta);
    explodapple.setCollider("rectangle", 0,explodapple.height/8,explodapple.width,explodapple.height);

    explodapple.restitution = 1;
    explodapple.density = 0.3;
    explodapple.mass = explodapple.width *explodapple.height *explodapple.density;
    //explodapple.limitSpeed(1);
    //pineapple.rotation = theta;
    //pineapple.wallBounce = true;
    //explodapple.debug = true;

    explodapple.attacked = false;

    explodapple.resistanceFactor = 100;
    explodapple.buoyantFactor = 4.1;

    explodapple.addAnimation('normal', "Asset/Image/Explosive Pineapple/Normal/0.png");
    explodapple.addAnimation('attacked', "Asset/Image/Explosive Pineapple/Attacked/0.png", "Asset/Image/Explosive Pineapple/Attacked/2.png", "Asset/Image/Explosive Pineapple/Attacked/3.png", "Asset/Image/Explosive Pineapple/Attacked/1.png", "Asset/Image/Explosive Pineapple/Attacked/4.png", "Asset/Image/Explosive Pineapple/Attacked/5.png", "Asset/Image/Explosive Pineapple/Attacked/6.png");
    explodappleGroup.add(explodapple);
}

function addExplosion(x, y, parent) {
    var explosion = createSprite(x, y);
    //explosion.scale = 0.5
    explosion.frameDelay = 15;
    
    //explosion.debug = true;
    explosion.setCollider("circle", 0, 0, explosion.width/explosion.scale);
    
    explosion.parent = parent;

    explosion.addAnimation('normal', "Asset/Image/Explosion/Normal/0.png", "Asset/Image/Explosion/Normal/1.png", "Asset/Image/Explosion/Normal/2.png", "Asset/Image/Explosion/Normal/3.png", "Asset/Image/Explosion/Normal/4.png", "Asset/Image/Explosion/Normal/5.png", "Asset/Image/Explosion/Normal/6.png", "Asset/Image/Explosion/Normal/7.png", "Asset/Image/Explosion/Normal/8.png");
    explosionGroup.add(explosion);
}


// Percipitation Constructor

function Rain(){
	this.location = createVector(Math.random()*width, -height/10);
	this.velocity = createVector((Math.random()-0.5), gravity*percipitationConstant);
	this.size = Math.floor(Math.random()*7)+15;
	this.color = {h: waterHue, s: 250, b: waterBrightness-20,};
}
Rain.prototype.update = function(){
    if(this.velocity.y > gravity*percipitationConstant){
        this.velocity.y -= percipitationSpeedChange;
    }
    if(this.velocity.y < gravity*percipitationConstant){
        this.velocity.y += percipitationSpeedChange;
    }
    if(this.velocity.y < percipitationMinimumSpeed){
        this.velocity.y = percipitationMinimumSpeed;
    }
        
    this.location.x += this.velocity.x;
    this.location.y += this.velocity.y;
}
Rain.prototype.show = function(){
    stroke(this.color.h, this.color.s, this.color.b);
    
    var theta = findRotation(this.velocity.x, this.velocity.y);
    line(this.location.x, this.location.y, this.location.x + this.size*Math.cos(theta), this.location.y + this.size*Math.sin(theta));
}
Rain.prototype.checkForDeletion = function(){
    if(this.location.y > waterSurface[waterSurface.length-1][Math.floor(this.location.x/waveDeltaX)]){
        return true;
    }
    else{
        return false;
    }
}


// Decoration Constructor

function Bubble(x, y, d, index){
    this.x = x;
    this.y = y;
    this.d = d;
    this.strokeColor = {
        h: 225,
        s: 180,
        b: 180,
    };
    this.index = index;
    this.speed = 1.5;
}
Bubble.prototype.update = function(){
    this.y -= this.speed;
}
Bubble.prototype.show = function(){
    noFill();
    stroke(this.strokeColor.h, this.strokeColor.s, this.strokeColor.b);
    strokeWeight(2);  
    ellipse(this.x, this.y, this.d);
}
Bubble.prototype.checkForDeletion = function(){
    if(waterSurface[waterSurface.length-1][Math.floor(this.x/waveDeltaX)] != undefined && this.y-this.d/2 < waterSurface[waterSurface.length-1][Math.floor(this.x/waveDeltaX)]){
        return true;
    }
    else{
        return false;
    }
}


// Environment Constructor

function Night(){
    this.type = "night";
    this.color = {
        h: 220,
        s: 250,
        b: 30,
    };
    
    /*this.color = {
        h: 130,
        s: 300,
        b: 50,
    };*/
    this.bubbleSpawnRate = 75;
    this.amountOfDecorationSpawn = 1;
}
Night.prototype.addDecoration = function(amount){
    for(var a=0; a<amount; a++){
        decoration.push(new Bubble(Math.random()*(width-10)+5, height+10, 13, decoration.length));
    }
}
Night.prototype.specialFeature = function(){
    if(frameCount % this.bubbleSpawnRate == 0){
        this.addDecoration(1);
    }
}


// Game Instruction

console.clear();

console.log("\nPlayer's Control: \n \n"
            + "Keyboard Input: \n"
            + "WASD Keydown: Move Duck \n"
            + "Space Keydown: Special \n"
            + "F Keypress: Toggle Fullscreen \n"
);
