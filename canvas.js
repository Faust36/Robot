var gameCanvas = document.getElementById('myGameCanvas');
var gameCtx = gameCanvas.getContext('2d');
gameCanvas.height = window.innerHeight;
gameCanvas.width = window.innerWidth;

var continueGame = false;
var keysdown = {};
var robot = new Robot()
var map = new Map();
var platforms = [];
var hazards = [];
// var platform = new PlatformOne({x: gameCanvas.width/2, y: gameCanvas.height - robot.scaledHeight }, {x: 2, y:0 });
var frameCount = 0;
// gameCtx.imageSmoothingEnabled = false;

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
    platforms.push(new PlatformOne({ x: 0, y: gameCanvas.height - gameCanvas.height / 6 }, { x: 0, y: 0 }))
    platforms.push(new PlatformOne({ x: 0 + platforms[0].scaledWidth, y: gameCanvas.height - gameCanvas.height / 6 }, { x: 0, y: 0 }))
    hazards.push(new Saw({ x: 500, y: 500 }, { x: 0, y: 0 }))
    createPlatforms();
    setInterval(createPlatforms, 7800);
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

function gameAnimate(char) {
    if (continueGame === true) {
        // frameCount ++
        // if(frameCount < 2){
        //     requestAnimationFrame(gameAnimate);
        //     return 
        // }
        gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        frameCount = 0;
        map.update();
        platforms.forEach(function (platform) {
            platform.update();
        })
        hazards.forEach(function (hazard) {
            hazard.update();
        })
        robot.update();
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
    this.jumpPower = -16;
    this.attacking = false;
    this.scaledWidth = Math.round(this.width * this.scale);
    this.scaledHeight = Math.round(this.height * this.scale);
    this.leftBoundary = 0;
    this.rightBoundary = gameCanvas.width - this.scaledWidth;
    this.bottomBoundary = gameCanvas.height - this.scaledHeight;
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

        this.velocity.y += this.acceleration.y


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
        } else if (yShift > this.bottomBoundary) {
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
    this.scale = .3
    this.scaledWidth = this.width * this.scale
    this.scaledHeight = this.height * this.scale
    this.index = 0;
    this.frames = [0, 1, 2, 3];
    this.fps = 0;

    this.update = function () {
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
}

//#################################################################################
/////---------------Map----------------------------------------------------------------------//
//################################################################################

function Map() {
    this.map = new Image();
    this.map.src = './media/imgs/sprites/factoryBG.png';
    this.height = 720;
    this.width = 3840;
    this.position = {
        x: 0,
        y: 0
    }
    this.offset = {
        x: 0,
        y: 0
    }

    this.update = function () {
        this.drawFrame(this.position.x, this.position.y)
    }

    this.drawFrame = function (canvasX, canvasY) {
        gameCtx.drawImage(this.map,
            0, 0, this.width, this.height, canvasX, canvasY, this.width, this.height)
    }
}

//#################################################################################
/////---------------Helpers----------------------------------------------------------------------//
//################################################################################

function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}