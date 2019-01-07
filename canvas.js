var gameCanvas = document.getElementById('myGameCanvas');
var gameCtx = gameCanvas.getContext('2d');
gameCanvas.height = window.innerHeight;
gameCanvas.width = window.innerWidth ;

var continueGame = false;
var keysdown = {};

// var map = new Map();

var platforms = [];
var hazards = [];
var worldWidth = 3840;
var worldHeight = 4096;
var frameCount = 0;
// gameCtx.imageSmoothingEnabled = false;


var robot = new Robot()

var newMap = new Map();
var newCamera = new FullCamera(0, 0, gameCanvas.width, gameCanvas.height, worldWidth, worldHeight);
newCamera.follow(robot, gameCanvas.width / 2, gameCanvas.height / 2)

window.addEventListener('keydown', function (evt) {
    keysdown[evt.which] = true;

    if (keysdown["32"] === true && keysdown["37"] === true) {
        if (robot.jumping === false) {
            robot.jumping = true;
            robot.facing = 'Left'
            robot.inMotion = true;
            robot.force.y = robot.jumpPower
        }
        // console.log('space & left');
    } else if (keysdown["32"] === true && keysdown["39"] === true) {
        if (robot.jumping === false) {
            robot.jumping = true;
            robot.facing = 'Right'
            robot.inMotion = true;
            robot.force.y = robot.jumpPower
        }
        // console.log('space & right');
    } else if (keysdown["32"] === true) {
        if (robot.jumping === false) {
            robot.jumping = true;
            robot.inMotion = true;
            robot.force.y = robot.jumpPower
        }
        // console.log('space');
    } else if (keysdown["37"] === true) {
        robot.facing = 'Left'
        robot.inMotion = true
        robot.force.x = -4
        // console.log('left');
    } else if (keysdown["39"] === true) {
        robot.facing = 'Right'
        robot.inMotion = true
        robot.force.x = 4
        // console.log('right');
    } else if (keysdown["65"] === true) {
        robot.attacking = true
        // console.log('a');
    }
}, false);

window.addEventListener('keyup', function (evt) {
    keysdown[evt.which] = false;
    if (evt.which === 39) {
        robot.resetX()
    }
    if (evt.which === 37) {
        robot.resetX()
    }
    if (evt.which === 32) {
        // robot.force.y = 0 
    }
}, false);


robot.robot.onload = function(){
    startGame();
}


function startGame() {
    continueGame = true;
    
    platforms.push(new PlatformOne({ x: 0, y: gameCanvas.height - gameCanvas.height / 10 }, { x: 0, y: 0 }))
    platforms.push(new PlatformOne({ x: 0 + platforms[0].scaledWidth, y: gameCanvas.height - gameCanvas.height / 10 }, { x: 0, y: 0 }))
    createPlatforms();
    setInterval(createPlatforms, 1800);
    setInterval(createSaws, 2500);
    
    gameAnimate();
}

function stopGame() {
    continueGame = false;
    clearInterval(createPlatforms);
}

function createPlatforms() {
    var posx = worldWidth;
    var posy = randomRange(worldHeight - robot.scaledHeight, 0 + robot.scaledHeight * 1.5)
    var velocity = -4
    platforms.push(new PlatformOne({ x: posx, y: posy }, { x: velocity, y: 0 }))

}
function createSaws() {
    var posx = worldWidth;
    var posy = randomRange(worldHeight - robot.scaledHeight/2, 0 + robot.scaledHeight/2)
    var velocity = -6
    hazards.push(new Saw({ x: posx, y: posy }, { x: velocity, y: 0 }))

}

function gameAnimate() {
    if (continueGame === true) {
        // frameCount ++
        // if(frameCount < 2){
        //     requestAnimationFrame(gameAnimate);
        //     return 
        // }
        gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        frameCount = 0;
       
        newCamera.update()
        newMap.drawMap(newCamera.xView, newCamera.yView)
        platforms.forEach(function (platform) {
            platform.update(newCamera.xView, newCamera.yView);
        })
        robot.update(newCamera.xView, newCamera.yView);
        hazards.forEach(function (hazard) {
            hazard.update(newCamera.xView, newCamera.yView);
        })
        
        requestAnimationFrame(gameAnimate)
    }
}

//#################################################################################
/////---------------Robot----------------------------------------------------------------------//
//################################################################################

function Robot() {
    this.robot = new Image();
    this.robot.src = '../media/imgs/sprites/robot2.png';
    this.height = 417;
    this.width = 425.25;
    this.scale = 1;
    this.fps = 0;
    this.health = 100;
    this.jumpPower = -23;
    
    this.attacking = false;
    this.scaledWidth = Math.round(this.width * this.scale);
    this.scaledHeight = Math.round(this.height * this.scale);
    this.radius = Math.round(Math.sqrt(this.scaledWidth/3 * this.scaledWidth/3 + this.scaledHeight/3 * this.scaledHeight/3))
    
    this.leftBoundary = 0;
    this.rightBoundary = worldWidth - this.scaledWidth/2;
   
    this.bottomBoundary = worldHeight - this.scaledHeight/2 ;
    this.topBoundary = 0;
    this.frames = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    this.index = 0;
    this.facing = 'Right'
    this.previousDirection = "noneRight";
    this.direction = "noneRight";
    this.frameCount = {
        'noneRight': [10, 0],
        'Right': [8, 1],
        'Left': [8, 2],
        'jumpRight': [10, 3],
        'jumpLeft': [10, 4],
        'noneLeft': [10, 5],
        'attackRight': [8, 6],
        'attackLeft': [8, 7]
    }
    this.jumping = false;
    this.inMotion = false;
    this.position = {
        x: 0,
        y: 0
    }
    this.velocity = {
        x: 0,
        y: 0
    };
    this.maxVelocity = 10;
    this.minVelocity = -10;
    this.acceleration = {
        x: 0,
        y: 0
    }
    this.force = {
        x: 0,
        y: 0
    }
    this.gravity = .5;
    this.drag = .5;
    this.mass = .5;
    this.terminalVelocity = -this.jumpPower

    this.update = function (xView, yView) {
       
        if (this.direction !== this.previousDirection) {
            this.index = 0
            this.previousDirection = this.direction
        }

        if (this.moving()) {
            this.inMotion = true
        } else {
            this.inMotion = false;
        }
        this.setDirection();
        this.calculateMotion(xView, yView);
        var xPosition = (this.position.x - this.scaledWidth/2) - xView
        var yPosition = (this.position.y - this.scaledHeight/2) - yView
       
        // var xPosition = this.position.x 
        // var yPosition = this.position.y 
        
        this.drawFrame(this.frames[this.index], this.frameCount[this.direction][1], xPosition, yPosition)
        this.fps++
        if (this.fps >= 4) {
            this.index++
            this.fps = 0
        }
        this.handleFrames();

    }

    //////////////-------------------------------------------------------------
    this.drawFrame = function (frameX, frameY, canvasX, canvasY) {
        gameCtx.save();
        gameCtx.drawImage(this.robot,
            frameX * this.width, frameY * this.height, this.width, this.height, canvasX, canvasY, this.scaledWidth, this.scaledHeight)
        gameCtx.restore();
    }

    this.setDirection = function () {
        if(this.velocity.x * -1 < 0){
            this.facing = 'Right'
        } else if (this.velocity.x * -1 > 0){
            this.facing = 'Left'
        }
        if (this.inMotion && this.jumping) {
            this.direction = 'jump' + this.facing
        } else if (this.inMotion) {
            this.direction = this.facing
        } else if (this.attacking) {
            this.direction = 'attack' + this.facing
        } else {
            this.direction = 'none' + this.facing
        }
    }

    this.handleFrames = function () {
        if (this.index >= this.frameCount[this.direction][0]) {
            switch (this.direction) {
                case 'attackRight':
                    this.attacking = false;
                    this.direction = 'none' + this.facing;
                    this.index = 0;
                    break;
                case 'attackLeft':
                    this.attacking = false;
                    this.direction = 'none' + this.facing;
                    this.index = 0;
                    break;
                default:
                    this.index = 0;
                    break;
            }
        }
    }

    this.calculateMotion = function (xView, yView) {
        var hazard = this.collided()
        if (hazard) {
            resolveCollision(this, hazard)
        }
        this.acceleration.x = this.force.x / this.mass

        var aShiftY = this.force.y / this.mass + this.gravity / this.mass
        this.acceleration.y = aShiftY
        this.force.y = 0

        
        
        var vShiftX = this.velocity.x + this.acceleration.x
        if (this.inRange(vShiftX, this.minVelocity, this.maxVelocity)) {
            this.velocity.x = vShiftX
        } else if (vShiftX > this.maxVelocity) {
            this.velocity.x = this.maxVelocity
        } else {
            this.velocity.x = this.minVelocity
        }

        if(this.velocity.y < this.terminalVelocity){
            this.velocity.y += this.acceleration.y
        }
        
       

        var pShiftX = Math.round(this.position.x + this.velocity.x)
        var pShiftY = Math.round(this.position.y + this.velocity.y)

        // pShiftX = (pShiftX - this.scaledWidth / 2) - xView
        // pShiftY = (pShiftY - this.scaledHeight / 2) - yView
        var onPlatform = this.onPlatform(platforms, this)

        if (onPlatform) {
            pShiftX += onPlatform.velocity.x
            this.handlePlatformPosition(onPlatform, pShiftY);
        } else {
            this.handleYPosition(pShiftY);
        }
        this.handleXPosition(pShiftX);

    }

    this.resetX = function () {
        this.force.x = 0;
        this.acceleration.x = 0;
        this.velocity.x = 0;
    }

    this.moving = function () {
        var moving = false
        for (coord in this.velocity) {
            if (this.velocity[coord] !== 0) {
                moving = true
            }
        }
        return moving
    }


    this.inRange = function (value, min, max) {
        if (value >= min && value <= max) {
            return true
        } else {
            return false
        }
    }

    this.collided = function(){
        var hazard = undefined
        for (var i = 0; i < hazards.length; i++) {
            if (getDistance(this.position.x + this.scaledWidth / 2, this.position.y + this.scaledHeight / 2, hazards[i].position.x + hazards[i].scaledWidth / 2, hazards[i].position.y + hazards[i].scaledHeight / 2) <= (this.radius + hazards[i].radius)) {
                hazard = hazards[i]
            }
        }
        return hazard;
    }

    this.onPlatform = function (platformArray, robot) {
        var onPlatform = undefined
        platformArray.forEach(function (platform) {
            if (robot.position.y + robot.scaledHeight/2 <= platform.position.y && robot.inRange((robot.position.x + robot.scaledWidth / 2), platform.position.x, platform.position.x + platform.scaledWidth) && robot.velocity.y > 0) {
                onPlatform = platform
            }
        })
        return onPlatform;
    }

    this.handlePlatformPosition = function (platform, yShift) {
        if (yShift + this.scaledHeight/2  > platform.position.y) {
            this.position.y = platform.position.y - this.scaledHeight/2
        } else if (this.inRange(yShift, this.topBoundary, platform.position.y)) {
            this.position.y = yShift
        }

        if (this.position.y === platform.position.y - this.scaledHeight/2) {
            this.jumping = false;
            this.acceleration.y = 0
            this.velocity.y = 0
        } else {
            this.jumping = true
        }
    }

    this.handleYPosition = function (yShift) {
        if (this.inRange(yShift, this.topBoundary, this.bottomBoundary)) {
            this.position.y = yShift
        } else if (yShift > this.bottomBoundary ) {
            this.position.y = this.bottomBoundary
        } else {
            this.position.y = this.topBoundary
        }

        if (this.position.y === this.bottomBoundary) {
            this.jumping = false;
            this.acceleration.y = 0
            this.velocity.y = 0
        } else if (this.position.y <= this.topBoundary) {
            this.jumping = true
            this.acceleration.y = 0
            this.velocity.y = 0
        } else {
            this.jumping = true
        }
    }

    this.handleXPosition = function (xShift) {
        if (this.inRange(xShift, this.leftBoundary, this.rightBoundary)) {
            this.position.x = xShift
        } else if (xShift > this.rightBoundary) {
            this.position.x = this.rightBoundary

        } else {
            this.position.x = this.leftBoundary
        }

    }
}
//#################################################################################
/////---------------Platform----------------------------------------------------------------------//
//################################################################################

function PlatformOne(position, velocity) {
    this.platform = new Image();
    this.platform.src = '../media/imgs/sprites/platform1.png';
    this.height = 60;
    this.width = 320.1;
    this.position = {
        x: position.x,
        y: position.y
    }
    this.velocity = {
        x: velocity.x,
        y: 0
    }
    this.scale = 1
    this.scaledWidth = this.width * this.scale;
    this.scaledHeight = this.height * this.scale;

    this.update = function (xView, yView) {
        this.position.x += this.velocity.x

        var xPosition = (this.position.x - this.scaledWidth / 2) - xView
        var yPosition = (this.position.y - this.scaledHeight / 2) - yView

        if (xPosition < 0 - this.scaledWidth) {
            var idx = platforms.indexOf(this)
            platforms.splice(idx, 1)
        } else {
            this.drawPlatform(xPosition, yPosition)
        }
    }


    this.drawPlatform = function (canvasX, canvasY) {

        gameCtx.drawImage(this.platform,
            0, 0, this.width, this.height, canvasX, canvasY, this.scaledWidth, this.scaledHeight)
    }

}
//#################################################################################
/////---------------Saw----------------------------------------------------------------------//
//################################################################################

function Saw(position, velocity) {
    this.saw = new Image();
    this.saw.src = '../media/imgs/sprites/saw.png';
    this.height = 361;
    this.width = 357;
    this.position = {
        x: position.x,
        y: position.y
    }
    this.velocity = {
        x: velocity.x,
        y: velocity.y
    }
    this.scale = .7
    this.scaledWidth = this.width * this.scale
    this.scaledHeight = this.height * this.scale
    this.radius = Math.round(Math.sqrt(this.scaledWidth/3 * this.scaledWidth/3 + this.scaledHeight/3 * this.scaledHeight/3))
    this.index = 0;
    this.frames = [0, 1, 2, 3];
    this.fps = 0;
    this.mass = 15;
    this.update = function (xView, yView) {
        // this.collided();
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        var xPosition = (this.position.x - this.scaledWidth / 2) - xView
        var yPosition = (this.position.y - this.scaledHeight / 2) - yView
        if (xPosition < 0 - this.scaledWidth || yPosition > worldHeight) {
            var idx = hazards.indexOf(this)
            hazards.splice(idx, 1)
        } else {
            this.drawFrame(this.frames[this.index], 0, xPosition, yPosition)
        }

        this.fps++
        if (this.fps >= 2) {
            this.index++
            this.fps = 0
        }
        // this.index ++ 

        if (this.index >= this.frames.length) {
            this.index = 0;
        }
    }

    this.drawFrame = function (frameX, frameY, canvasX, canvasY) {
        gameCtx.drawImage(this.saw,
            frameX * this.width, frameY * this.height, this.width, this.height, canvasX, canvasY, this.scaledWidth, this.scaledHeight)
    }

    this.collided = function () {
       
        if (getDistance(this.position.x + this.scaledWidth / 2, this.position.y + this.scaledHeight / 2, robot.position.x + robot.scaledWidth / 2, robot.position.y + robot.scaledHeight / 2) <= getDistance(this.scaledWidth / 2, this.scaledHeight / 2, robot.scaledWidth / 2, robot.scaledHeight / 2)) {
           resolveCollision(this, robot)
        }
       
    }
}




//#################################################################################
/////---------------Helpers----------------------------------------------------------------------//
//################################################################################

function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function getDistance(x1, y1, x2, y2) {
    var xDistance = x2 - x1;
    var yDistance = y2 - y1;

    return Math.sqrt(xDistance * xDistance + yDistance * yDistance);
}


function rotate(velocity, angle) {
    var rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;
}

function resolveCollision(particle, otherParticle) {
    var xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    var yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    var xDist = otherParticle.position.x - particle.position.x;
    var yDist = otherParticle.position.y - particle.position.y;

    // prevent overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        // grab angle between colliding particles
        var angle = -Math.atan2(otherParticle.position.y - particle.position.y, otherParticle.position.x - particle.position.x);

        var m1 = particle.mass;
        var m2 = otherParticle.mass;

        // initial velocity
        var u1 = rotate(particle.velocity, angle)
        var u2 = rotate(otherParticle.velocity, angle)

        // velocity for 1d collision
        var v1 = {
            x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2),
            y: u1.y
        }

        var v2 = {
            x: u2.x * (m2 - m1) / (m1 + m2) + u1.x * 2 * m1 / (m1 + m2),
            y: u2.y
        }

        // final velocity after rotating back to original position
        var vFinal1 = rotate(v1, -angle);
        var vFinal2 = rotate(v2, -angle);

        // swap velocity for elastic collision
       
        particle.acceleration.x = 0 
        particle.acceleration.y = 0
        particle.velocity.x = vFinal1.x;
        particle.velocity.y = vFinal1.y;
       
        // otherParticle.velocity.x = vFinal2.x;
        // otherParticle.velocity.y = vFinal2.y;


    }
}

//#################################################################################
/////---------------Map----------------------------------------------------------------------//
//################################################################################

function Map() {
    this.map = new Image();
    this.map.src = '../media/imgs/sprites/threeXthreeMap.png';
    
    this.drawMap = function (xView, yView){
        var sx, sy, dx, dy;
        var sWidth, sHeight, dWidth, dHeight;

        // offset point to crop the image
        sx = xView;
        sy = yView;

        // dimensions of cropped image          
        sWidth = gameCanvas.width;
        sHeight = gameCanvas.height;

        // if cropped image is smaller than canvas we need to change the source dimensions
        if (this.map.width - sx < sWidth) {
            sWidth = this.map.width - sx;
        }
        if (this.map.height - sy < sHeight) {
            sHeight = this.map.height - sy;
        }

        // location on canvas to draw the croped image
        dx = 0;
        dy = 0;
        // match destination with source to not scale the image
        dWidth = sWidth;
        dHeight = sHeight;

        gameCtx.drawImage(this.map, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);            
    }
}


function Rectangle(left, top, width, height) {
    this.left = left || 0;
    this.top = top || 0;
    this.width = width || 0;
    this.height = height || 0;
    this.right = this.left + this.width;
    this.bottom = this.top + this.height;

    this.set = function (left, top, /*optional*/width, /*optional*/height) {
        this.left = left;
        this.top = top;
        this.width = width || this.width;
        this.height = height || this.height
        this.right = (this.left + this.width);
        this.bottom = (this.top + this.height);
    }

    this.within = function (r) {
        return (r.left <= this.left &&
            r.right >= this.right &&
            r.top <= this.top &&
            r.bottom >= this.bottom);
    }

    this.overlaps = function (r) {
        return (this.left < r.right &&
            r.left < this.right &&
            this.top < r.bottom &&
            r.top < this.bottom);
    }
}

// Rectangle.prototype.set = function (left, top, /*optional*/width, /*optional*/height) {
//     this.left = left;
//     this.top = top;
//     this.width = width || this.width;
//     this.height = height || this.height
//     this.right = (this.left + this.width);
//     this.bottom = (this.top + this.height);
// }

// Rectangle.prototype.within = function (r) {
//     return (r.left <= this.left &&
//         r.right >= this.right &&
//         r.top <= this.top &&
//         r.bottom >= this.bottom);
// }

// Rectangle.prototype.overlaps = function (r) {
//     return (this.left < r.right &&
//         r.left < this.right &&
//         this.top < r.bottom &&
//         r.top < this.bottom);
// }

function FullCamera(xView, yView, canvasWidth, canvasHeight, worldWidth, worldHeight){
    // position of camera (left-top coordinate)
    this.xView = xView || 0;
    this.yView = yView || 0;

    // distance from followed object to border before camera starts move
    this.xDeadZone = 0; // min distance to horizontal borders
    this.yDeadZone = 0; // min distance to vertical borders

    // viewport dimensions
    this.wView = canvasWidth;
    this.hView = canvasHeight;

   

    // object that should be followed
    this.followed = null;

    // rectangle that represents the viewport
    this.viewportRect = new Rectangle(this.xView, this.yView, this.wView, this.hView);

    // rectangle that represents the world's boundary (room's boundary)
    this.worldRect = new Rectangle(0, 0, worldWidth, worldHeight);

    this.follow = function (gameObject, xDeadZone, yDeadZone) {
        this.followed = gameObject;
        this.xDeadZone = xDeadZone;
        this.yDeadZone = yDeadZone;
    }

    this.update = function () {
        // keep following the player (or other desired object)
        if (this.followed != null) {

            // moves camera on horizontal axis based on followed object position
            if (this.followed.position.x - this.xView + this.xDeadZone > this.wView) {
                this.xView = this.followed.position.x - (this.wView - this.xDeadZone);
            } else if (this.followed.position.x - this.xDeadZone < this.xView) {
                this.xView = this.followed.position.x - this.xDeadZone;
            }



            // moves camera on vertical axis based on followed object position
            if (this.followed.position.y - this.yView + this.yDeadZone > this.hView) {
                this.yView = this.followed.position.y - (this.hView - this.yDeadZone);
            } else if (this.followed.position.y - this.yDeadZone < this.yView) {
                this.yView = this.followed.position.y - this.yDeadZone;
            }


        }

        // update viewportRect
        this.viewportRect.set(this.xView, this.yView);

        // don't let camera leaves the world's boundary
        if (!this.viewportRect.within(this.worldRect)) {
            if (this.viewportRect.left < this.worldRect.left)
                this.xView = this.worldRect.left;
            if (this.viewportRect.top < this.worldRect.top)
                this.yView = this.worldRect.top;
            if (this.viewportRect.right > this.worldRect.right)
                this.xView = this.worldRect.right - this.wView;
            if (this.viewportRect.bottom > this.worldRect.bottom)
                this.yView = this.worldRect.bottom - this.hView;
        }

    }   
}

// FullCamera.prototype.follow = function (gameObject, xDeadZone, yDeadZone) {
//     this.followed = gameObject;
//     this.xDeadZone = xDeadZone;
//     this.yDeadZone = yDeadZone;
// }

// FullCamera.prototype.update = function () {
//     // keep following the player (or other desired object)
//     if (this.followed != null) {
       
//         // moves camera on horizontal axis based on followed object position
//         if (this.followed.x - this.xView + this.xDeadZone > this.wView){
//             this.xView = this.followed.x - (this.wView - this.xDeadZone);
//         }else if (this.followed.x - this.xDeadZone < this.xView){
//             this.xView = this.followed.x - this.xDeadZone;
//         }

    
    
//         // moves camera on vertical axis based on followed object position
//         if (this.followed.y - this.yView + this.yDeadZone > this.hView){
//             this.yView = this.followed.y - (this.hView - this.yDeadZone);
//         }else if (this.followed.y - this.yDeadZone < this.yView){
//             this.yView = this.followed.y - this.yDeadZone;
//         }
       

//     }

//     // update viewportRect
//     this.viewportRect.set(this.xView, this.yView);

//     // don't let camera leaves the world's boundary
//     if (!this.viewportRect.within(this.worldRect)) {
//         if (this.viewportRect.left < this.worldRect.left)
//             this.xView = this.worldRect.left;
//         if (this.viewportRect.top < this.worldRect.top)
//             this.yView = this.worldRect.top;
//         if (this.viewportRect.right > this.worldRect.right)
//             this.xView = this.worldRect.right - this.wView;
//         if (this.viewportRect.bottom > this.worldRect.bottom)
//             this.yView = this.worldRect.bottom - this.hView;
//     }

// }   