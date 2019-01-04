var gameCanvas = document.getElementById('myGameCanvas');
var gameCtx = gameCanvas.getContext('2d');
gameCanvas.height = window.innerHeight;
gameCanvas.width = window.innerWidth ;

var continueGame = false;
var keysdown = {};

// var map = new Map();

var platforms = [];
var hazards = [];

var frameCount = 0;
// gameCtx.imageSmoothingEnabled = false;

var map = {
    cols: 30,
    rows: 11  ,
    tsize: 128,
    layers: [[
        5,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,5,
        5,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,5,
        5,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,5,
        5,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,5,
        5,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,5,
        5,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,5,
        5,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,5,
        5,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,5,
        5,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,5,
        5,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,5,
        5,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,5,
        5,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,5,
        5,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,5,
        5,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,5,
        5,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,5,
        5,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,5,
        5,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,5,
        5,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,5,
        5,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,5,
        5,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,5,
        5,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,5,
        5,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,5,
        5,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,5,
        5,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,5,
        5,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,5,
        5,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,5,
        5,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,5,
        5,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,5,
        5,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,5,
        5,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,5,
        5,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,5,
        5,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,5
    ]],
    getTile: function(layer, col, row){
        return this.layers[layer][row * map.cols + col]
    }
}

var robot = new Robot()
var camera = new Camera(map, gameCanvas.width, gameCanvas.height)
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


// function gameInit(){




// }

function startGame() {
    continueGame = true;
    platforms.push(new PlatformOne({ x: 0, y: gameCanvas.height - gameCanvas.height / 10 }, { x: 0, y: 0 }))
    platforms.push(new PlatformOne({ x: 0 + platforms[0].scaledWidth, y: gameCanvas.height - gameCanvas.height / 10 }, { x: 0, y: 0 }))
    createPlatforms();
    setInterval(createPlatforms, 7800);
    setInterval(createSaws, 4500);
    gameAnimate();
}

function stopGame() {
    continueGame = false;
    clearInterval(createPlatforms);
}

function createPlatforms() {
    var posx = gameCanvas.width;
    var posy = randomRange(gameCanvas.height - robot.scaledHeight, 0 + robot.scaledHeight * 1.5)
    var velocity = -2
    platforms.push(new PlatformOne({ x: posx, y: posy }, { x: velocity, y: 0 }))

}
function createSaws() {
    var posx = gameCanvas.width;
    var posy = randomRange(gameCanvas.height - robot.scaledHeight/2, 0 + robot.scaledHeight/2)
    var velocity = -2
    hazards.push(new Saw({ x: posx, y: posy }, { x: velocity, y: 0 }))

}

function gameAnimate(char) {
    if (continueGame === true) {
        // frameCount ++
        // if(frameCount < 2){
        //     requestAnimationFrame(gameAnimate);
        //     return 
        // }
        gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        frameCount = 0;
        camera.move();
        camera.drawMap(0);
        platforms.forEach(function (platform) {
            platform.update();
        })
        robot.update();
        hazards.forEach(function (hazard) {
            hazard.update();
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
    this.scale = .5;
    this.fps = 0;
    this.health = 100;
    this.jumpPower = -20;
    
    this.attacking = false;
    this.scaledWidth = Math.round(this.width * this.scale);
    this.scaledHeight = Math.round(this.height * this.scale);
    this.radius = Math.round(Math.sqrt(this.scaledWidth/3 * this.scaledWidth/3 + this.scaledHeight/3 * this.scaledHeight/3))
    this.maxX = map.cols * map.tsize - map.tsize;
    this.maxY = (map.rows) * map.tsize - gameCanvas.height;   
    this.leftBoundary = 0;
    this.rightBoundary = gameCanvas.width - this.scaledWidth;
    // this.bottomBoundary = this.maxY ;
    this.bottomBoundary = gameCanvas.height - this.scaledHeight ;
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

    this.update = function () {
       
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
        this.calculateMotion();
       
        
        this.drawFrame(this.frames[this.index], this.frameCount[this.direction][1], this.position.x, this.position.y)
        this.fps++
        if (this.fps >= 4) {
            this.index++
            this.fps = 0
        }
        this.handleFrames();

    }

    //////////////-------------------------------------------------------------
    this.drawFrame = function (frameX, frameY, canvasX, canvasY) {
        gameCtx.drawImage(this.robot,
            frameX * this.width, frameY * this.height, this.width, this.height, canvasX, canvasY, this.scaledWidth, this.scaledHeight)
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

    this.calculateMotion = function () {
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
            if (robot.position.y + robot.scaledHeight <= platform.position.y && robot.inRange((robot.position.x + robot.scaledWidth / 2), platform.position.x, platform.position.x + platform.scaledWidth) && robot.velocity.y > 0) {
                onPlatform = platform
            }
        })
        return onPlatform;
    }

    this.handlePlatformPosition = function (platform, yShift) {
        if (yShift + this.scaledHeight > platform.position.y) {
            this.position.y = platform.position.y - this.scaledHeight
        } else if (this.inRange(yShift, this.topBoundary, platform.position.y)) {
            this.position.y = yShift
        }

        if (this.position.y === platform.position.y - this.scaledHeight) {
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

    this.update = function () {
        this.position.x += this.velocity.x
        if (this.position.x < 0 - this.scaledWidth) {
            var idx = platforms.indexOf(this)
            platforms.splice(idx, 1)
        } else {
            this.drawPlatform(this.position.x, this.position.y)
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
    this.scale = .5
    this.scaledWidth = this.width * this.scale
    this.scaledHeight = this.height * this.scale
    this.radius = Math.round(Math.sqrt(this.scaledWidth/3 * this.scaledWidth/3 + this.scaledHeight/3 * this.scaledHeight/3))
    this.index = 0;
    this.frames = [0, 1, 2, 3];
    this.fps = 0;
    this.mass = 15;
    this.update = function () {
        // this.collided();
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if (this.position.x < 0 - this.scaledWidth || this.position.y > gameCanvas.height) {
            var idx = hazards.indexOf(this)
            hazards.splice(idx, 1)
        } else {
            this.drawFrame(this.frames[this.index], 0, this.position.x, this.position.y)
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
/////---------------Camera----------------------------------------------------------------------//
//################################################################################

function Camera(map, width, height){
    this.x = robot.position.x;
    this.width = width;
    this.height = height;
    this.y = robot.position.y;
    this.maxX = map.cols * map.tsize - this.width;
    this.maxY = map.rows * map.tsize - this.height; 
    this.speed = 256 
    this.tileMap = new Image()
    this.tileMap.src = './media/imgs/sprites/tilemap.png'

    this.move = function(delta, dirx, diry){
        // var deltaX = dirx * this.speed * delta
        // var deltaY = diry * this.speed * delta
       this.x = robot.position.x + robot.velocity.x
        this.y = robot.position.y + robot.velocity.y
        this.x = Math.max(0, Math.min(this.x, this.maxX))
        this.y = Math.max(0, Math.min(this.y,  this.maxY))
    }
   
    this.drawMap = function(layer){
       
    
        var startCol = Math.floor(this.x / map.tsize)
        var endCol = startCol + (this.width / map.tsize)
        var startRow =  Math.floor(this.y /map.tsize)
        var endRow = startRow + (this.height / map.tsize)
        var offsetX = -this.x + startCol * map.tsize
        var offsetY = -this.y + startRow * map.tsize

        for (var c = startCol; c <= endCol; c++) {
            for (var r = startRow; r <= endRow; r++) {
                var tile = map.getTile(layer, c, r);
                var x = (c - startCol) * map.tsize + offsetX;
                var y = (r - startRow) * map.tsize + offsetY;
                if (tile !== 0) { // 0 => empty tile
                    gameCtx.drawImage(
                        this.tileMap, // image
                        (tile - 1) * map.tsize, // source x
                        0, // source y
                        map.tsize, // source width
                        map.tsize, // source height
                        Math.round(x),  // target x
                        Math.round(y), // target y
                        map.tsize, // target width
                        map.tsize // target height
                    );
                }
            }
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
    console.log(true)
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
    this.height = 4096;
    this.width = 3840;
    this.tileSize = 128;
    this.position = {
        x: 0,
        y: 0
    }
    this.offset = {
        x: 0,
        y: 0
    }
    this.cols = 30;
    this.rows = 32;
    this.frameX = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
    this.frameY = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32]

    this.update = function () {
        var startCol = Math.floor(camera.x / this.tileSize);
        var endCol = startCol + (camera.width / this.tileSize);
        var startRow = Math.floor(camera.y / this.tileSize);
        var endRow = startRow + (camera.height / this.tileSize);
        var offsetX = -camera.x + startCol * this.tileSize;
        var offsetY = -camera.y + startRow * this.tileSize;

        for (var c = startCol; c <= endCol; c++) {
            for (var r = startRow; r <= endRow; r++) {
                var x = (c - startCol) * this.tileSize + offsetX;
                var y = (r - startRow) * this.tileSize + offsetY;

                gameCtx.drawImage(
                    this.map, // image
                    Math.round(x), // source x
                    Math.round(y), // source y
                    this.tileSize, // source width
                    this.tileSize, // source height
                    Math.round(x),  // target x
                    Math.round(y), // target y
                    this.tileSize, // target width
                    this.tileSize // target height
                );

            }
        }
        // this.drawFrame(this.position.x, this.position.y)
    }

    this.drawFrame = function (canvasX, canvasY) {
        gameCtx.drawImage(this.map,
            0, 0, this.width, this.height, canvasX, canvasY, this.width, this.height)
    }
}