// Be mindful of theta!
// Math.cos() and Math.sin() uses radian, but P5 play uses degree!
// The order in which you input the force matter!
// Display the image, check for collision, add gravity, add buoyancy, then add water resistance!

// Game Setup

function preload() {
    fontSrc["chakraPetch"] = loadFont("Asset/Font/ChakraPetch-Medium.ttf");
    fontSrc["fellEnglish"] = loadFont("Asset/Font/Fell English.ttf");
}

function setup() {
    canvas = createCanvas(1200, 640);
    var offsetX = 0;  
    var offsetY = 0;
    if(windowWidth > width){
        offsetX = (windowWidth - width) / 2;
    }
    if(windowHeight > height){
        offsetY = (windowHeight - height) / 3;
    }  
    canvas.position(offsetX, offsetY);
    canvas.parent("canvasContainer");
    
    gravitySlider = createSlider(0, 3, 1, 0.1);
    gravitySlider.position(textOffset-120/2+offsetX, 100+offsetY);
    gravitySlider.input(function(){
        gravity = gravitySlider.value();
        percipitationFrame = 0
        if(Math.pow(gravity, 2) > 0){
            percipitationFrame = Math.ceil(width*height/100000/Math.pow(gravity+0.3, 2));
        }
    });
    gravitySlider.hide();
    
    dragConstantSlider = createSlider(0, 3, 1, 0.1);
    dragConstantSlider.position(textOffset-120/2+offsetX, 200+offsetY);
    dragConstantSlider.input(function(){
        dragConstant = dragConstantSlider.value();
    });
    dragConstantSlider.hide();
    
    waterDensitySlider = createSlider(0, 3, 1, 0.1);
    waterDensitySlider.position(textOffset-120/2+offsetX, 300+offsetY);
    waterDensitySlider.input(function(){
        waterDensity = waterDensitySlider.value();
    });
    waterDensitySlider.hide();
    
    waterVolumeSlider = createSlider(width*height/10, width*height*2/3, width*height/4, width*height/25);
    waterVolumeSlider.position(textOffset-120/2+offsetX, 400+offsetY);
    waterVolumeSlider.input(function(){
        waterVolume = waterVolumeSlider.value();
        waterLine = height - (waterVolume/width);
    });
    waterVolumeSlider.hide();
    
    showPhysicsButton = createButton("Toggle Display");
    showPhysicsButton.position(textOffset-150/2+offsetX, 480+offsetY);
    showPhysicsButton.mouseClicked(function(){
        showPhysics = !showPhysics;
    });
    showPhysicsButton.hide();
    
    gravity = gravitySlider.value();
    dragConstant = dragConstantSlider.value();
    waveDeltaX = width / 20;
    waterDensity = waterDensitySlider.value();
    waterVolume = waterVolumeSlider.value();
    waterLine = height - (waterVolume / width);
    percipitationFrame = 0
    if(Math.pow(gravity, 2) > 0){
        percipitationFrame = Math.ceil(width*height/100000/Math.pow(gravity+0.3, 2));
    }
    
    environment = new Night();
    duckGroup = new Group();
    pineappleGroup = new Group();
    statueGroup = new Group();
    explodappleGroup = new Group();
    explosionGroup = new Group();
    decoration = new Group();
    
    specialText = {
        science: {
            text: "Science:",
            textIdNeeded: 1,
            variable: 5,
            variableDesireValue: 35,
            variableChange: 0.2,
            update: function(){
                if(this.variable < this.variableDesireValue){
                    this.variable += this.variableChange;
                }
            },
            show: function(){
                textSize(this.variable);
                textAlign(CENTER, CENTER);
                text(this.text, width/5, height/2);
            },
        },
        gravity: {
            text: "Gravity",
            textIdNeeded: 2,
            variable: -100,
            variableDesireValue: height/2 + 70,
            variableChange: 1,
            variableChangeChange: 0.2,
            update: function(){
                if(this.variable < this.variableDesireValue){
                    if(this.variable > 0){
                        this.variableChange += this.variableChangeChange;
                    }
                    else if(introTextId > this.textIdNeeded){
                        this.variable = 0;
                    }
                    this.variable += this.variableChange;
                    if(this.variable > this.variableDesireValue){
                        this.varaible = this.variableDesireValue;
                    }
                }
            },
            show: function(){
                textSize(20);
                textAlign(LEFT, BOTTOM);
                text(this.text, width/5 - 50, this.variable);
            },
        },
        buoyancy: {
            text: "Buoynacy",
            textIdNeeded: 3,
            variable: height + 1200,
            variableDesireValue: height/2 + 120,
            variableChange: 10,
            update: function(){
                if(this.variable > this.variableDesireValue){
                    if(introTextId > this.textIdNeeded && this.variable > height){
                        this.variable = height;
                    }
                    this.variable -= this.variableChange;
                    if(this.variable < this.variableChange){
                        this.variable = this.variableChange;
                    }
                }
            },
            show: function(){
                textSize(20);
                textAlign(LEFT, BOTTOM);
                text(this.text, width/5 - 50, this.variable);
            },
        },
        resistance: {
            text: "Resistance",
            textIdNeeded: 4,
            variable: width,
            variableDesireValue: width/5 - 50,
            variableChange: 35,
            update: function(){
                if(this.variable > this.variableDesireValue){
                    if(introTextId > this.textIdNeeded){
                        this.variable = (this.variableDesireValue - this.variable)/this.variableChange*2 + this.variable;
                    }
                    else{
                        this.variable = (this.variableDesireValue - this.variable)/this.variableChange + this.variable;
                    }
                }
            },
            show: function(){
                textSize(20);
                textAlign(LEFT, BOTTOM);
                text(this.text, this.variable, height/2 + 160);
            },
        },
    };
    
    
    //drawWater();
    addDuck();
    addStatue();
    
    colorMode(HSL, 360);
}


// Main Loop

function draw() {
    if(gameActive){
        if(environment){
            background(environment.color.h, environment.color.s, environment.color.b);
            if(environment.specialFeature != null){
                environment.specialFeature();
            }
        }
        else{
            background("black");
        }

        if(gameActive){
            fill("white");
            stroke("black");
            strokeWeight(3);
            textFont(fontSrc["chakraPetch"]);
            textSize(50);
            textAlign(CENTER, BOTTOM);
            text("Rubber Duck", width/2, height/7);
            strokeWeight(3);
            textSize(20);
            textAlign(CENTER, TOP);
            text((duckGroup.length+pineappleGroup.length+statueGroup.length+explodappleGroup.length) + " / " + maxObject, width/2, height/7 + 7);
        }
        
        if(showPhysics){
            drawGameInstruction();
        }
        else{
            noStroke();
            fill(45, 90, 250);
            ellipse(width*6/7, height*5/16, 200, 200);
            fill(0, 0, 300);
            ellipse(width*6/7, height*5/16, 180, 180);
            /*fill(45, 90, 250);
            ellipse(width*6/7-20, height*5/16-15, 180, 180);*/
            fill(environment.color.h, environment.color.s, environment.color.b);
            ellipse(width*6/7-20, height*5/16-15, 160, 160);
        }

        for(var d=0, decorationLength=decoration.length; d<decorationLength; d++){
            var current = decoration[d];
            current.update();
            current.show();
            var deletion = current.checkForDeletion();
            if(deletion){
                decoration.splice(d, 1);
                d -= 1;
                decorationLength -= 1;
            }
        }
        
        statueGroup.bounce(duckGroup, function(statue1, duck1){
            duck1.jump = false;
            if(duck1.getAnimationLabel() != "attack"){
                duck1.changeAnimation("idle");
            }
        });
        statueGroup.displace(duckGroup);
        statueGroup.bounce(statueGroup);
        statueGroup.displace(statueGroup);
        statueGroup.bounce(pineappleGroup);
        statueGroup.displace(pineappleGroup);
        statueGroup.bounce(explodappleGroup);
        statueGroup.displace(explodappleGroup);

        duckGroup.bounce(duckGroup, function(duck1, duck2){
            duck1.jump = false;
            duck2.jump = false;
            if(duck1.getAnimationLabel() != "attack"){
                duck1.changeAnimation("idle");
            }
            if(duck2.getAnimationLabel() != "attack"){
                duck2.changeAnimation("idle");
            }
        });
        duckGroup.displace(duckGroup);
        duckGroup.bounce(pineappleGroup, function(duck1, pineapple1){
            duck1.jump = false;
            if(duck1.getAnimationLabel() != "attack"){
                duck1.changeAnimation("idle");
            }
        });
        duckGroup.displace(pineappleGroup);
        duckGroup.bounce(explodappleGroup, function(duck1, explodapple1){
            duck1.jump = false;
            if(duck1.getAnimationLabel() != "attack"){
                duck1.changeAnimation("idle");
            }
        });
        duckGroup.displace(explodappleGroup);

        pineappleGroup.bounce(pineappleGroup);
        //pineappleGroup.displace(pineappleGroup);
        pineappleGroup.bounce(explodappleGroup);
        //pineappleGroup.displace(explodappleGroup);

        explodappleGroup.bounce(explodappleGroup);
        //explodappleGroup.displace(explodappleGroup);
        

        drawSprites(statueGroup);
        drawSprites(pineappleGroup);
        drawSprites(explodappleGroup);
        drawSprites(duckGroup);
        drawSprites(explosionGroup);

        if(showPhysics){
            /*for(var d=0, duckLength=duckGroup.length; d<duckLength; d++){
                var current = duckGroup[d];
                drawDensityLabel(current);
            }

            for(var p=0, pineappleLength=pineappleGroup.length; p<pineappleLength; p++){
                var current = pineappleGroup[p];
                drawDensityLabel(current);
            }

            for(var s=0, statueLength=statueGroup.length; s<statueLength; s++){
                var current = statueGroup[s];
                drawDensityLabel(current);
            }

            for(var ex=0, explodappleLength=explodappleGroup.length; ex<explodappleLength; ex++){
                var current = explodappleGroup[ex];
                drawDensityLabel(current);
            }*/
            if(pineappleGroup.length > 0){
                drawDensityLabel(pineappleGroup[0]);
            }
            if(explodappleGroup.length > 0){
                drawDensityLabel(explodappleGroup[0]);
            }
            if(statueGroup.length > 0){
                drawDensityLabel(statueGroup[0]);
            }
            if(duckGroup.length > 0){
                drawDensityLabel(duckGroup[0]);
            }
        }

        drawWater();
        drawInputLegend();

        time += waveSpeed;

        for(var p=0, percipitationLength=percipitation.length; p<percipitationLength; p++){
            var current = percipitation[p];
            current.update();
            current.show(); 
            var deletion = current.checkForDeletion();
            if(deletion){
                percipitation.splice(p, 1);
                p -= 1;
                percipitationLength -= 1;
            }
        }
        if (playerActive) {
            updatePlayerInput(duckGroup[0]);
            limitDuckMotion(duckGroup[0]);
        }
        for(var d=0, duckLength=duckGroup.length; d<duckLength; d++){
            var current = duckGroup[d];
            current.velocity.y += gravity;

            if(showPhysics && d == 0){
                drawForceLabel(current, gravity*current.mass, HALF_PI, "G", "black");
            }
            var buoyantForce = addBuoyantForce(current);
            if(showPhysics && d == 0){
                drawForceLabel(current, buoyantForce.magnitude, buoyantForce.theta, "B", "black");
            }
            if(!current.jump){
                var waterResistance = addWaterResistance(current);
                if(showPhysics && d == 0){
                    drawForceLabel(current, waterResistance.magnitude, waterResistance.theta, "R", "black");
                }
            }

            if(current.jump && current.position.y+current.collider.offset.y+current.collider.extents.y/2 > waterLine && current.jump && current.velocity.y > 0 && !playerInput.up){
                current.jump = false;
                current.changeAnimation("idle");
            }

            if(current.attack){
                if(current.animation.getFrame() == current.animation.getLastFrame()){
                    for(var p=0, pineappleLength=pineappleGroup.length; p<pineappleLength; p++){
                        var currentPineapple = pineappleGroup[p];
                        var currentPineappleX = currentPineapple.position.x+currentPineapple.collider.offset.x-currentPineapple.collider.extents.x/2;
                        var currentPineappleY = currentPineapple.position.y+currentPineapple.collider.offset.y-currentPineapple.collider.extents.y/2;
                        var currentX = current.position.x+current.collider.offset.x+(current.collider.extents.x/2+20)*current.mirrorX();
                        var currentY = current.position.y+current.collider.offset.y;
                        if(collideRectCircle(currentPineappleX, currentPineappleY, currentPineapple.collider.extents.x, currentPineapple.collider.extents.y, currentX, currentY, 30)){
                            current.displace(currentPineapple);
                            currentPineapple.position.x += posNeg(current.mirrorX())*2;
                            currentPineapple.addSpeed(duckAttackForce/currentPineapple.mass, -90 + 50*posNeg(current.velocity.x));

                            drawForceLabel(currentPineapple, duckAttackForce, radians(-90+50*posNeg(current.velocity.x)), "A", "black");

                            //currentPineapple.addSpeed(duckAttackVelocity, degrees(findRotation(currentPineappleX-currentX, currentPineappleY-currentY)));
                            currentPineapple.changeAnimation("attacked");
                            currentPineapple.attacked = true;
                        }
                    }
                    for(var ex=0, explodappleLength=explodappleGroup.length; ex<explodappleLength; ex++){
                        var currentExplodapple = explodappleGroup[ex];
                        var currentExplodappleX = currentExplodapple.position.x+currentExplodapple.collider.offset.x-currentExplodapple.collider.extents.x/2;
                        var currentExplodappleY = currentExplodapple.position.y+currentExplodapple.collider.offset.y-currentExplodapple.collider.extents.y/2;
                        var currentX = current.position.x+current.collider.offset.x+(current.collider.extents.x/2+20)*current.mirrorX();
                        var currentY = current.position.y+current.collider.offset.y;
                        if(collideRectCircle(currentExplodappleX, currentExplodappleY, currentExplodapple.collider.extents.x, currentExplodapple.collider.extents.y, currentX, currentY, 30)){
                            current.displace(currentExplodapple);
                            currentExplodapple.position.x += posNeg(current.velocity.x);
                            currentExplodapple.addSpeed(duckAttackForce/currentExplodapple.mass, -90 + 50*posNeg(current.velocity.x));

                            drawForceLabel(currentExplodapple, duckAttackForce, radians(-90+50*posNeg(current.velocity.x)), "A", "black");

                            //currentExplodapple.addSpeed(duckAttackVelocity, degrees(findRotation(currentExplodappleX-currentX, currentExplodappleY-currentY)));
                            currentExplodapple.changeAnimation("attacked");
                            currentExplodapple.attacked = true;
                            addExplosion(currentX, currentY, currentExplodapple);
                        }
                    }
                    current.attack = false;
                    current.changeAnimation("idle");
                }
            }
        }

        for(var p=0, pineappleLength=pineappleGroup.length; p<pineappleLength; p++){
            var current = pineappleGroup[p];
            current.velocity.y += gravity;

            if(showPhysics && p == 0){
                drawForceLabel(current, gravity*current.mass, HALF_PI, "G", "black");
            }
            var buoyantForce = addBuoyantForce(current);
            if(showPhysics && p == 0){
                drawForceLabel(current, buoyantForce.magnitude, buoyantForce.theta, "B", "black");
            }
            if(!current.attacked){
                var waterResistance = addWaterResistance(current);
                if(showPhysics && p == 0){
                    drawForceLabel(current, waterResistance.magnitude, waterResistance.theta, "R", "black");
                }
            }
            else{
                current.attacked = false;
            }
            if(current.position.x+current.collider.offset.x+current.collider.extents.x/2 < 0 || current.position.x+current.collider.offset.x-current.collider.extents.x/2 > width){
                current.remove();
                p -= 1;
                pineappleLength -= 1;
            }
        }

        for(var s=0, statueLength=statueGroup.length; s<statueLength; s++){
            var current = statueGroup[s];
            current.velocity.y += gravity;

            if(showPhysics && s == 0){
                drawForceLabel(current, gravity*current.mass, HALF_PI, "G", "black");
            }
            var buoyantForce = addBuoyantForce(current);
            if(showPhysics && s == 0){
                drawForceLabel(current, buoyantForce.magnitude, buoyantForce.theta, "B", "black");
            }
            if(!current.attacked){
                var waterResistance = addWaterResistance(current);
                if(showPhysics && s == 0){
                    drawForceLabel(current, waterResistance.magnitude, waterResistance.theta, "R", "black");
                }
            }
            else{
                current.attacked = false;
            }
            if(current.position.x+current.collider.offset.x+current.collider.extents.x/2 < 0 || current.position.x+current.collider.offset.x-current.collider.extents.x/2 > width/* || current.position.y-current.collider.extents.y/2 > height*/){
                current.remove();
                s -= 1;
                statueLength -= 1;
            }
        }

        for(var ex=0, explodappleLength=explodappleGroup.length; ex<explodappleLength; ex++){
            var current = explodappleGroup[ex];
            current.velocity.y += gravity;

            if(showPhysics && ex == 0){
                drawForceLabel(current, gravity*current.mass, HALF_PI, "G", "black");
            }
            var buoyantForce = addBuoyantForce(current);
            if(showPhysics && ex == 0){
                drawForceLabel(current, buoyantForce.magnitude, buoyantForce.theta, "B", "black");
            }
            var waterResistance = addWaterResistance(current);
            if(showPhysics && ex == 0){
                drawForceLabel(current, waterResistance.magnitude, waterResistance.theta, "R", "black");
            }

            if(current.position.x+current.collider.offset.x+current.collider.extents.x/2 < 0 || current.position.x+current.collider.offset.x-current.collider.extents.x/2 > width || (current.attacked && current.animation.getFrame() == current.animation.getLastFrame())){
                current.remove();
                ex -= 1;
                explodappleLength -= 1;
            }
        }

        for (var e=0, explosionLength=explosionGroup.length; e<explosionLength; e++) {
            var current = explosionGroup[e];
            if (current.animation.getFrame() == Math.ceil(current.animation.getLastFrame()/2)) {
                current.collide(pineappleGroup, function(current, currentPineapple){
                    var currentPineappleX = currentPineapple.position.x+currentPineapple.collider.offset.x;
                    var currentPineappleY = currentPineapple.position.y+currentPineapple.collider.offset.y;
                    var currentX = current.position.x+current.collider.offset.x;
                    var currentY = current.position.y+current.collider.offset.y;
                    var forceDirection = findRotation(currentPineappleX-currentX, currentPineappleY-currentY);
                    current.displace(currentPineapple);
                    currentPineapple.addSpeed(explodableForce/currentPineapple.mass, forceDirection);
                    currentPineapple.changeAnimation("attacked");
                    currentPineapple.attacked = true;
                });
                current.collide(explodappleGroup, function(current, currentExplodapple){
                    if(currentExplodapple != current.parent){
                        var currentExplodappleX = currentExplodapple.position.x+currentExplodapple.collider.offset.x;
                        var currentExplodappleY = currentExplodapple.position.y+currentExplodapple.collider.offset.y;
                        var currentX = current.position.x+current.collider.offset.x;
                        var currentY = current.position.y+current.collider.offset.y;
                        var forceDirection = findRotation(currentExplodappleX-currentX, currentExplodappleY-currentY);
                        current.displace(currentExplodapple);
                        currentExplodapple.addSpeed(explodableForce/currentExplodapple.mass, forceDirection);
                        currentExplodapple.changeAnimation("attacked");
                        currentExplodapple.attacked = true;
                        addExplosion(currentExplodappleX, currentExplodappleY, currentExplodapple);
                    }
                });

                current.remove();
                e -= 1;
                explosionLength -= 1;
            }
        }

        if(frameCount % percipitationFrame == 0){
            for(var i=0; i<3; i++){
                percipitation.push(new Rain());
            }
        }

        if(playerActive && frameCount % 20 == 0 && (duckGroup.length+pineappleGroup.length+statueGroup.length+explodappleGroup.length) < maxObject){
            for(var i=0; i< 1; i++){
                if(Math.random() > 0.3){
                    addPineapple();
                }
                else{
                    addExplodapple();
                }
            }
        }
    }
    
    if(introScreen){
        background("black");
        textAlign(CENTER, TOP);
        textFont(fontSrc["chakraPetch"]);
        textSize(27);
        fill("white");
        stroke("black");
        strokeWeight(3);
        
        if(introTextId < introTextData.length){
            if(frameCount % introTextFrameSpeed == 0 && introText.length < introTextData[introTextId].text.length){
                introText += introTextData[introTextId].text.slice(introText.length, introText.length+1);
                if(introText.length == introTextData[introTextId].text.length){
                    introTextInputFlicker.active = false;
                    frameCount = introTextInputFlicker.frameForIn - 20;
                }
            } 
            else if(introText.length >= introTextData[introTextId].text.length && introTextInputFlicker.active && frameCount % introTextInputFlicker.frameForOut == 0){
                introText = introText.replace(introTextInputFlicker.data, "");
                introTextInputFlicker.active = false;
                frameCount = 1;
            }
            else if(introText.length >= introTextData[introTextId].text.length && !introTextInputFlicker.active && frameCount % introTextInputFlicker.frameForIn == 0){
                introText += introTextInputFlicker.data;
                introTextInputFlicker.active = true;
                frameCount = 1;
            }
            text(introText, width*17/40, height/5, width/3, height*2/5);
            
            textSize(50);
            textAlign(LEFT, TOP);
            text("[Narrator]: ", width/5, height/5);
            
            for(var subject in specialText){
                var current = specialText[subject];
                if(introTextId >= current.textIdNeeded){
                    current.update();
                    current.show();
                }
            }
        }
    }
    else if(startAnimation){
        var maxRadius = findHypotenuse(width, height);
        if(startRadius < maxRadius){
            startRadius += startSpeed;
            if(startRadius >= maxRadius){
                startRadius = maxRadius;
            }
            noFill();
            stroke("black");
            strokeWeight(maxRadius - startRadius);
            ellipse(width/2, height/2, maxRadius, maxRadius);
            if(startRadius >= maxRadius){
                initiateGame();
            }
        }   
    }
}


// Secondary Loop

function limitDuckMotion(duck1) {
    /*if (duck1.position.y - duck1.collider.extents.y / 2 > height*7/6) {
        duck1.position.y = height*7/6 + duck1.collider.extents.y / 2;
        duck1.velocity.y = 0;
    } 
    else if (duck1.position.y - duck1.collider.extents.y / 2 < 0) {
        duck1.position.y = duck1.collider.extents.y / 2;
        duck1.velocity.y = 0;
    }*/
    if (duck1.position.x + duck1.collider.extents.x / 2 > width) {
        duck1.position.x = width - duck1.collider.extents.x/2;
        duck1.velocity.x = 0;
    } 
    else if (duck1.position.x - duck1.collider.extents.x / 2 < 0) {
        duck1.position.x = duck1.collider.extents.x / 2;
        duck1.velocity.x = 0;
    }
}

function drawGameInstruction() {
    // Player 1
    drawKey("W", 87, 40, width*6/7, height/4);
    drawKey("A", 65, 40, width*6/7 - 50, height*5/16);
    drawKey("S", 83, 40, width*6/7, height*5/16);
    drawKey("D", 68, 40, width*6/7 + 50, height*5/16);
    drawKey("Space", 32, 250, width*6/7, height*13/32);
}

function drawKey(letter, code, width, x, y) {
    fill("black");
    strokeWeight(3);
    if (keyIsDown(code)) {
        fill("white");
    }

    stroke("black");
    rect(x - width/2, y - 13, width, 30, 7, 0);

    fill("white");
    if (keyIsDown(code)) {
        fill("black");
    }
    noStroke();
    textFont(fontSrc["chakraPetch"]);
    textSize(25);
    textAlign(CENTER, CENTER);
    text(letter, x, y);
}

function drawInputLegend(){
    textAlign(LEFT, BOTTOM);
    textFont(fontSrc["chakraPetch"]);
    textSize(17);
    fill("white");
    stroke("black");
    strokeWeight(3);
    
    var gravityString = "Gravity: " + gravity.toLocaleString(undefined, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }) + " m/s";    
    var dragConstantString = "Drag Constant: " + dragConstant.toLocaleString(undefined, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
    var waterDensityString = "Water Density: " + waterDensity.toLocaleString(undefined, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }) + " kg/m";
    var waterVolumeString = "Water Volume: " + waterVolume.toLocaleString(undefined, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }) + " m";
    
    var gravityWidth = textWidth(gravityString);
    var dragConstantWidth = textWidth(dragConstantString);
    var waterDensityWidth = textWidth(waterDensityString);
    var waterVolumeWidth = textWidth(waterVolumeString);
    
    text(gravityString, textOffset-95, 70);
    text(dragConstantString, textOffset-95, 170);
    text(waterDensityString, textOffset-95, 270);
    text(waterVolumeString, textOffset-95, 370);
    
    textSize(10);
    text("2", textOffset-92+gravityWidth, 60)
    text("3", textOffset-92+waterDensityWidth, 260)
    text("3", textOffset-92+waterVolumeWidth, 360)
}

function drawWater(){
    var current = waterSurface.length;
    waterSurface[current] = [];
    for(var x=0, length=width/waveDeltaX+1; x<length; x++){
        waterSurface[current][x] = (noise(x+time)-0.5)*waveAmplitude + waterLine;
    }
    if(waterSurface.length > surfaceLayer){
        waterSurface.shift();
    }

    fill(waterHue, 200, 150, waterBrightness+10);
    noStroke();
    beginShape();
    vertex(0, height);
    curveVertex(0, height);
    curveVertex(0, waterLine - waveAmplitude/2);
    for(var i=0, waterLength=waterSurface[0].length; i<waterLength; i++){
        var y = waterSurface[0][i];
        for(var h=1, surfaceLength=waterSurface.length; h<surfaceLength; h++){
            if(waterSurface[h][i] < y){
                y = waterSurface[h][i];
            }
        }
        curveVertex(i*waveDeltaX, y);
    }
    curveVertex(waterSurface[0].length*waveDeltaX, waterLine - waveAmplitude/2);
    curveVertex(width, height);
    vertex(width, height);
    endShape();

    // Water Surface
    noFill();
    stroke(waterHue, 255, waterBrightness);
    strokeWeight(3);
    for(var i=0, length=waterSurface.length; i<length; i++){
        beginShape();
        curveVertex(0, waterLine - waveAmplitude/2);
        for(var h=0, waterLength=waterSurface[i].length; h<waterLength; h++){
            curveVertex(h*waveDeltaX, waterSurface[i][h]);
        }
        curveVertex(waterSurface[0].length*waveDeltaX, waterLine - waveAmplitude/2);
        endShape();
    } 
}


// Physics

function addWaterResistance(object1){
    var waveId = Math.floor(object1.position.x/waveDeltaX);
    if(waveId < 0){
        waveId = 0
    }
    else if(waveId > waterSurface[waterSurface.length-1].length-1){
        waveId = waterSurface[waterSurface.length-1].length-1;
    }
    var displaceHeight = object1.position.y + object1.collider.offset.y + object1.collider.extents.y/2 - waterSurface[waterSurface.length-1][waveId];
    
    var velocityMagnitude = object1.getSpeed();
    if(displaceHeight > 0 && velocityMagnitude != 0){
        var waterResistanceHeight = object1.velocity.y;
        if(object1.velocity.y < 0 && Math.abs(object1.velocity.y) > displaceHeight){
            waterResistanceHeight = -displaceHeight;
            velocityMagnitude = findHypotenuse(object1.velocity.x, waterResistanceHeight);
        }
        
        //var velocityDirection = object1.getDirection();
        var velocityDirection = findRotation(object1.velocity.x, waterResistanceHeight);
        var waterResistance = Math.pow(velocityMagnitude, 2) * dragConstant * waterDensity * object1.resistanceFactor;
        var acceleration = waterResistance / object1.mass;
        var velocityX = -acceleration * Math.cos(velocityDirection);
        var velocityY = -acceleration * Math.sin(velocityDirection);
        if(Math.abs(velocityX) >= Math.abs(object1.velocity.x)){
            object1.velocity.x = 0;
        }
        else{
            object1.velocity.x += velocityX;
        }
        if(object1.velocity.y < 0){
            
        }
        else if(Math.abs(velocityY) >= Math.abs(object1.velocity.y)){
            object1.velocity.y = 0;
        }
        else{
            object1.velocity.y += velocityY;         
        }
    
        return {
            magnitude: waterResistance,
            theta: velocityDirection - PI,
        }
    }
    
    return {
        magnitude: 0,
        theta: 0,
    }
}

function addBuoyantForce(object1){
    var waveId = Math.floor((object1.position.x+object1.collider.offset.x)/waveDeltaX);
    //current.position.x + current.collider.offset.x, current.position.y + current.collider.offset.y, current.collider.radius
    
    if(waveId < 0){
        waveId = 0
    }
    else if(waveId > waterSurface[waterSurface.length-1].length-1){
        waveId = waterSurface[waterSurface.length-1].length-1;
    }
    var displaceHeight = (object1.position.y + object1.collider.offset.y + object1.collider.extents.y/2) - waterSurface[waterSurface.length-1][waveId]; 
    if(displaceHeight < 0){
        displaceheight = 0;
    }
    if(displaceHeight > object1.collider.extents.y){
        displaceHeight = object1.collider.extents.y;
    }
    
    var displaceArea = displaceHeight * object1.collider.extents.x * object1.buoyantFactor;
    var buoyantForce = waterDensity * displaceArea * gravity;
    var acceleration = buoyantForce / object1.mass;
    object1.velocity.y -= acceleration;
    
    return {
        magnitude: buoyantForce,
        theta: -HALF_PI,
    }
}

function drawDensityLabel(object1){
    textAlign(CENTER, BOTTOM);
    textFont(fontSrc["chakraPetch"]);
    textSize(17);
    fill("white");
    stroke("black");
    strokeWeight(3);
    if(object1.density > waterDensity){
        fill(0, 360, 250);
    }
    var densityText = "Density: " + object1.density + "kg/m";
    var densityWidth = textWidth(densityText);
    text(densityText, object1.position.x+object1.collider.offset.x, object1.position.y-object1.collider.offset.y-object1.collider.extents.y/2-20);

    textSize(10);
    text("3", object1.position.x+object1.collider.offset.x+densityWidth/2+5, object1.position.y-object1.collider.offset.y-object1.collider.extents.y/2-30);
}

function drawForceLabel(object1, magnitude, theta, type, color){
    var weight = map(Math.sqrt(magnitude), 0, 500, 0, 5);
    if(weight > 70){
        weight = 70;
    }
    var length = map(Math.sqrt(magnitude), 0, 500, 0, 200);
    
    stroke(color);
    strokeWeight(weight);
    
    var initialPointX = object1.position.x;
    var initialPointY = object1.position.y;
    var finalPointX = initialPointX + Math.cos(theta)*length;
    var finalPointY = initialPointY + Math.sin(theta)*length;
    var extra1X = finalPointX - Math.cos(theta+PI*9/5)*length*0.4;
    var extra1Y = finalPointY - Math.sin(theta+PI*9/5)*length*0.4;
    var extra2X = finalPointX - Math.cos(theta-PI*9/5)*length*0.4;
    var extra2Y = finalPointY - Math.sin(theta-PI*9/5)*length*0.4;
    line(initialPointX, initialPointY, finalPointX, finalPointY);
    line(finalPointX, finalPointY, extra1X, extra1Y);
    line(finalPointX, finalPointY, extra2X, extra2Y);
    
    fill("black");
    noStroke();
    rect(initialPointX-weight*2, initialPointY-weight*2, weight*4, weight*4);
    
    textAlign(CENTER, CENTER);
    textFont(fontSrc["chakraPetch"]);
    textSize(map(Math.sqrt(magnitude), 0, 500, 5, 35));
    fill("white");
    stroke("black");
    strokeWeight(1);
    text(type, finalPointX + Math.cos(theta+HALF_PI)*length/4, finalPointY + Math.sin(theta+HALF_PI)*length/4);
}


// Player's Interaction

function updatePlayerInput(duck1) {
    var currentAnimation = duck1.getAnimationLabel();
    if (playerActive) {
        //Key W || Up Arrow
        if (playerInput.up) {
            if(!duck1.jump && duck1.position.y+duck1.collider.offset.y < waterLine){
                duck1.velocity.y = -duckJumpSpeed;
                duck1.jump = true;
                playerInput.up = false;
                if (currentAnimation != "attack") {
                    duck1.changeAnimation("jump");
                    currentAnimation = "jump";
                }
            }
            else if(duck1.position.y > waterLine && duck1.velocity.y > -duckSpeedMax){
                duck1.velocity.y -= duckSpeed;
            }
            if(duck1.velocity.x < 0){
                duck1.mirrorX(-1);
            }
            else if(duck1.velocity.x > 0){
                duck1.mirrorX(1);
            }
            //duck1.velocity.x = 0;
        }
        //Key S || Down Arrow
        else if (playerInput.down) {
            if(duck1.velocity.y < duckSpeedMax){
                duck1.velocity.y += duckSpeed;
            }
            //duck1.velocity.x = 0;
            if (currentAnimation != "attack" && currentAnimation != "jump") {
                duck1.changeAnimation("motion");
                currentAnimation = "motion";
            }
        }
        //Key A || Left Arrow
        if (playerInput.left) {
            if(duck1.velocity.x > -duckSpeedMax){
                duck1.velocity.x -= duckSpeed;
            }
            //duck1.velocity.y = 0;
            if (currentAnimation != "attack" && currentAnimation != "jump") {
                duck1.changeAnimation("motion");
                currentAnimation = "motion";
                duck1.mirrorX(-1);
            }
        }
        //Key D || Right Arrow
        else if (playerInput.right) {
            if(duck1.velocity.x < duckSpeedMax){
                duck1.velocity.x += duckSpeed;
            }
            //duck1.velocity.y = 0;
            if (currentAnimation != "attack" && currentAnimation != "jump") {
                duck1.changeAnimation("motion");
                currentAnimation = "motion";
                duck1.mirrorX(1);
            }
        } 
        //Space Key
        if (playerInput.attack) {
            if(duck1.currentAnimation != "attack"){
                duck1.changeAnimation("attack");
                currentAnimation = "attack";
                duck1.animation.changeFrame(0);
            }
            duck1.attack = true;
            playerInput.attack = false;
        } 
        
        if(!keyIsPressed){
            if (currentAnimation != "attack" && currentAnimation != "jump") {
                duck1.changeAnimation("idle");
            }
        }
    }
}

function mousePressed() {
    
}

function keyPressed(){
    if(introScreen && keyCode == 32){
        if(introTextId < introTextData.length && introText.length < introTextData[introTextId].text.length){
            introText = introTextData[introTextId].text;
            introTextInputFlicker.active = true;
            introText += introTextInputFlicker.data;
            frameCount = 1;
        }
        else if(introTextId < introTextData.length && introText.length >= introTextData[introTextId].text.length){
            if(introTextData[introTextId].eraseBefore){
                introText = "";
                introTextData[introTextId].text.length = 0;
            }
            else{
                if(introTextInputFlicker.active){
                    introText = introText.replace(introTextInputFlicker.data, "");
                }
                introText += "\n\n";
            }
            introTextId += 1;
            introTextInputFlicker.active = false;
            
            frameCount = 1;
            
            gameActive = true;
            if(introTextId >= introTextData.length){
                setTimeout(initiateStartAnimation, 1000);
            }
        }
    }
    else if(playerActive){
        //Key W || Up Arrow
        if (keyCode == 87 || keyCode == 38) {
            playerInput.up = true;
        }

        //Key S || Down Arrow
        else if (keyCode == 83 || keyCode == 40) {
            playerInput.down = true;
        }

        //Key A || Left Arrow
        else if (keyCode == 65 || keyCode == 37) {
            playerInput.left = true;
        }
        //Key D || Right Arrow
        else if (keyCode == 68 || keyCode == 39) {
            playerInput.right = true;
        } 

        //Space Key
        else if (keyCode == 32) {
            playerInput.attack = true;
        }    
    }
    
    // F Key
    if(keyCode == 70){
        var currentStatus = fullscreen();
        fullscreen(!currentStatus);
    }
    
    // R Key
    /*else if(keyCode == 82 && !titleScreen){
        restartAnimation();
    }  */
    
    // T Key
    /*else if(keyCode == 84 && !titleScreen){
        resetGame(true);
    }    */
}

function keyReleased(){
    if(playerActive){
        //Key W || Up Arrow
        if (keyCode == 87 || keyCode == 38) {
            playerInput.up = false;
        }

        //Key S || Down Arrow
        else if (keyCode == 83 || keyCode == 40) {
            playerInput.down = false;
        }

        //Key A || Left Arrow
        else if (keyCode == 65 || keyCode == 37) {
            playerInput.left = false;
        }
        //Key D || Right Arrow
        else if (keyCode == 68 || keyCode == 39) {
            playerInput.right = false;
        } 

        //Space Key
        else if (keyCode == 32) {
            playerInput.attack = false;
        }    
    }
}

function windowResized(){
    var offsetX = 0;
    var offsetY = 0;
    if(windowWidth > width){
        offsetX = (windowWidth - width) / 2;
    }
    if(windowHeight > height){
        offsetY = (windowHeight - height) / 2;
    }
    canvas.position(offsetX, offsetY);
    
    gravitySlider.position(textOffset-120/2+offsetX, 100+offsetY);
    dragConstantSlider.position(textOffset-120/2+offsetX, 200+offsetY);
    waterDensitySlider.position(textOffset-120/2+offsetX, 300+offsetY);
    waterVolumeSlider.position(textOffset-120/2+offsetX, 400+offsetY);
    showPhysicsButton.position(textOffset-150/2+offsetX, 480+offsetY);
}


// Start Animation

function initiateStartAnimation(){
    gameActive = true;
    introScreen = false;
    startAnimation = true;
    playerActive = false;
}

function initiateGame(){
    gameActive = true;
    introScreen = false;
    startAnimation = false;
    playerActive = true;
    
    setTimeout(function(){
        gravitySlider.show();
    }, 700);
    setTimeout(function(){
        dragConstantSlider.show();
    }, 1500);
    setTimeout(function(){
        waterDensitySlider.show();
    }, 2400);
    setTimeout(function(){
        waterVolumeSlider.show();
    }, 3400);
    setTimeout(function(){
        showPhysicsButton.show();
    }, 5000);
}


// Support Function

function findHypotenuse(dx, dy){
  return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
}

function findProportionalFactor(dx, dy, dh){
  var k = 0;
  if(dx != 0 || dy != 0){
    k = Math.sqrt(Math.pow(dh, 2) / (Math.pow(dx, 2)+Math.pow(dy, 2)));
  }
  return k;
}

function findRotation(dx, dy){
  var dh = Math.sqrt(Math.pow(dy, 2) + Math.pow(dx, 2));  
  var rotationRadian = 0;
  if(dh != 0){
    rotationRadian = Math.acos(dx / dh);
  }
  if(dy < 0){
    rotationRadian *= -1;
  } 
  return rotationRadian;
}

function posNeg(number){
  if(number != 0){
    return number / Math.abs(number);
  }
  else {
    return 0;
  }
} 