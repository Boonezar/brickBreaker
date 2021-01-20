MyGame.screens['game-play'] = (function(game, graphics, input, persistence){
    'use strict';

    //variables
    var bricks = [];
    var paddle;
    var ball;
    var extraBall;
    var score;
    var extraPaddles = [];
    var brickCountForSpeed;
    var halfPaddle = false;
    var particleSystems = [];
    var lastTimeStamp;
    var cancelNextRequest = false;
    var myKeyboard = input.Keyboard();
    var count1, count2, count3;
    var countingDown = false;

    function initialize(){
        console.log('game initializing...');

        paddle = graphics.Paddle({
            image: 'images/paddle.png',
            center: { x: 490, y: 540 },
            width: 220, height: 20,
            rotation: 0,
            moveRate: 600,
            rotateRate: 0
        });

        ball = graphics.Ball({
            image: 'images/sam.png',
            center: { x: 490, y: 520},
            width: 30, height: 30,
            rotation: 0,
            speed: 0,
            direction: { x: 0, y: 0},
            rotationRate: 0
        });
        extraBall = 0;

        score = graphics.Score({
            center: {x: 870, y: 580},
            text: "Score: ",
            font: "20px Arial",
            color: "white",
            points: 0,
            fillText: true,
            rotation: 0,
            rotationRate: 0
        });

        extraPaddles = [];
        for(let i = 0; i < 3; i++){
            extraPaddles.push(graphics.Paddle({
                image: 'images/paddle.png',
                center: { x: 20, y: 565 + (i*13) },
                width: 30, height: 10,
                rotation: 0,
                moveRate: 0,
                rotateRate: 0
            }));
        }

        bricks = [];
        for(let i = 0; i < 8; i++){
            let centerY = 100 + (20*i);
            bricks.push({edge: {top: centerY-10, bot: centerY+10}, column: [],points: assignPoints(i)});
            let img = 'images/' + (Math.floor(i/2)).toString() + '.png';
            for(let j = 0; j < 14; j++){
                let centerX = 35 + (70*j);
                bricks[i].column.push(graphics.Texture({
                    image: img,
                    center: { x: centerX, y: centerY },
                    width: 70, height: 20,
                    rotation: 0,
                    moveRate: 0,
                    rotateRate: 0
                }));
            }
        }

        count3 = graphics.Texture({
            image: 'images/count3.png',
            center: { x: 490, y: 300 },
            width: 70, height: 70,
            rotation: 0,
            moveRate: 0,
            rotateRate: 0
        });
        count2 = graphics.Texture({
            image: 'images/count2.png',
            center: { x: 490, y: 300 },
            width: 70, height: 70,
            rotation: 0,
            moveRate: 0,
            rotateRate: 0
        });
        count1 = graphics.Texture({
            image: 'images/count1.png',
            center: { x: 490, y: 300 },
            width: 70, height: 70,
            rotation: 0,
            moveRate: 0,
            rotateRate: 0
        });
        brickCountForSpeed = 0;

        //keyboard / mouse inputs
        myKeyboard.registerCommand(KeyEvent.DOM_VK_A, paddle.moveLeft);
        myKeyboard.registerCommand(KeyEvent.DOM_VK_LEFT, paddle.moveLeft);
        myKeyboard.registerCommand(KeyEvent.DOM_VK_D, paddle.moveRight);
        myKeyboard.registerCommand(KeyEvent.DOM_VK_RIGHT, paddle.moveRight);
        myKeyboard.registerCommand(KeyEvent.DOM_VK_ESCAPE, function(){
            //Ends game
            cancelNextRequest = true;
            game.showScreen('main-menu');
        });
    }

    function assignPoints(i){
        if(i === 0 || i === 1)
            return 5;
        if(i === 2 || i === 3)
            return 3;
        if(i === 4 || i === 5)
            return 2;
        return 1;
    }

    function countdown(){
        if(countingDown > 2000)
            count3.draw();
        else if(countingDown > 1000)
            count2.draw();
        else
            count1.draw();
    }

    function createBrickExplosionSystem(brick){
        return MyGame.particleSystem({
            position: {x: brick.edge.left, y: brick.edge.top},
            speed: 200,
            lifetime: 400,
            size: 5,
            image: brick.imageSrc,
            rotation: 0
        }, graphics);
    }

    function createFinalScore(){
        return graphics.Score({
            center: {x: 400, y: 300},
            text: "Final Score: ",
            font: "35px Arial",
            color: "blue",
            points: score.getScore(),
            fillText: true,
            rotation: 0,
            rotationRate: 0
        });
    }

    function checkCollisions(thisBall){
        checkWallCollision(thisBall);
        checkBrickColumnCollision(thisBall);
        checkPaddleCollision(thisBall);
    }

    function checkPaddleCollision(thisBall){
        var ballPosition = thisBall.getPosition();
        var paddlePosition = paddle.getPosition();
        //ball hits top
        if(ballPosition.edge.bot > paddlePosition.edge.top
                && ballPosition.edge.bot < paddlePosition.edge.bot 
                && ballPosition.edge.right > paddlePosition.edge.left
                && ballPosition.edge.left < paddlePosition.edge.right){
            thisBall.changeDirection('paddleUp', (ballPosition.center.x - paddlePosition.center.x) / (paddlePosition.width / 2));
        }
    }

    function checkBrickColumnCollision(thisBall){
        var ballPosition = thisBall.getPosition();
        for(let i = 0; i < bricks.length; i++){
            if(ballPosition.edge.top < bricks[i].edge.bot && ballPosition.edge.bot > bricks[i].edge.top){
                for(let j = 0; j < bricks[i].column.length; j++){
                    if(checkSingleBrickCollision(thisBall, ballPosition, bricks[i].column[j])){
                        score.updateScore(bricks[i].points);
                        particleSystems.push(createBrickExplosionSystem(bricks[i].column[j]));
                        bricks[i].column.splice(j, 1);
                        brickCountForSpeed++;
                        if(i === 0 && !halfPaddle){
                            paddle.halfWidth();
                            halfPaddle = true;
                        }
                        return;
                    }
                }
            }
        }
    }

    function checkSingleBrickCollision(thisBall, ballPos, brick){
        if(ballPos.edge.top < brick.edge.bot 
                && ballPos.center.y > brick.edge.bot
                && ballPos.edge.left < brick.edge.right
                && ballPos.edge.right > brick.edge.left){
            thisBall.changeDirection('down');
            return true;
        }  else if(ballPos.edge.left < brick.edge.right
                && ballPos.center.x > brick.edge.right
                && ballPos.edge.top < brick.edge.bot
                && ballPos.edge.bot > brick.edge.top){
            thisBall.changeDirection('right');
            return true;
        } else if(ballPos.edge.bot > brick.edge.top
                && ballPos.center.y < brick.edge.top
                && ballPos.edge.left < brick.edge.right
                && ballPos.edge.right > brick.edge.left){
            thisBall.changeDirection('up');
            return true;
        } else if(ballPos.edge.right > brick.edge.left
                && ballPos.center.x < brick.edge.left
                && ballPos.edge.top < brick.edge.bot
                && ballPos.edge.bot > brick.edge.top){
            thisBall.changeDirection('left');
            return true;
        }
        return false;
    }

    function checkWallCollision(thisBall){
        var ballPosition = thisBall.getPosition();
        if(ballPosition.edge.left <= 0)
            thisBall.changeDirection('right');
        else if(ballPosition.edge.right >= 980)
            thisBall.changeDirection('left');
        if(ballPosition.edge.top <= 0)
            thisBall.changeDirection('down');
        else if(ballPosition.edge.bot > 630)
            thisBall.fellThru = true;
    }


    function updateBalls(elapsedTime){
        updateBallSpeed(ball);
        ball.move(elapsedTime);
        if(ball.fellThru && extraPaddles.length > 0 && !isNaN(extraBall)){
            paddle.reset();
            ball.reset();
            countingDown = 3000;
            extraPaddles.pop();
        } else {
            checkCollisions(ball);
        }
        if((score.getScore() >= 100 && extraBall === 0) || 
                (score.getScore() >= 200 && extraBall === 1) || 
                (score.getScore() >= 300 && extraBall === 2)){

            extraBall = graphics.Ball({
                image: 'images/sam.png',
                center: { x: 490, y: 520},
                width: 30, height: 30,
                rotation: 0,
                speed: 0,
                direction: { x: 0, y: 0},
                rotationRate: 0
            });
            extraBall.startMovement();
        }
        if(isNaN(extraBall)){
            updateBallSpeed(extraBall);
            extraBall.move(elapsedTime);
            if(extraBall.fellThru){
                extraBall = Math.floor(score.getScore() / 100);
            } else {
                checkCollisions(extraBall);
            }
        }
    }

    function updateBallSpeed(thisBall){
        if(brickCountForSpeed >= 62)
            thisBall.setSpeed(550);
        else if(brickCountForSpeed >= 36)
            thisBall.setSpeed(500);
        else if(brickCountForSpeed >= 12)
            thisBall.setSpeed(450);
        else if(brickCountForSpeed >= 4)
            thisBall.setSpeed(400);
    }

    function updateParticleSystems(elapsedTime){
        let keepMe = []
        for(let i = 0; i < particleSystems.length; i++){
            particleSystems[i].update(elapsedTime);
            if(particleSystems[i].isAlive())
                keepMe.push(particleSystems[i]);
        }
        particleSystems = keepMe;
    }

    function update(elapsedTime){
        //updates
        updateParticleSystems(elapsedTime);
        if(countingDown > 0)
            countingDown -= elapsedTime;
        else if(countingDown > -100){
            brickCountForSpeed = 0;
            ball.startMovement();
            countingDown = -1000;
        } else if(ball.isMoving){
            updateBalls(elapsedTime);
            myKeyboard.update(elapsedTime);
        }
    }

    function renderBricks(){
        for(let i = 0; i < bricks.length; i++)
            for(let j = 0; j < bricks[i].column.length; j++)
                bricks[i].column[j].draw();
    }

    function renderBallsAndPaddles(){
        paddle.draw();
        ball.draw();
        if(isNaN(extraBall))
            extraBall.draw();
        for(let i = 0; i < extraPaddles.length; i++)
            extraPaddles[i].draw();
    }

    function renderScore(){
        score.draw();
    }

    function renderParticleSystems(){
        for(let i = 0; i < particleSystems.length; i++)
            particleSystems[i].render();
    }

    function render(elapsedTime){
        graphics.clear();
        renderParticleSystems();
        renderBricks();
        if(extraPaddles.length === 0 && ball.fellThru){
            cancelNextRequest = true;
            persistence.add(Date.now(), score.getScore());
            var finalScore = createFinalScore();
            finalScore.draw();
            return;
        }
        renderBallsAndPaddles();
        renderScore();
        if(countingDown > 0)
            countdown();
    }
    function gameloop(time){
        update(time-lastTimeStamp);
        lastTimeStamp = time;
        render();
        if(!cancelNextRequest){
            requestAnimationFrame(gameloop);
        }
    }
    function run(){
        initialize();
        lastTimeStamp = performance.now();
        cancelNextRequest = false;
        countingDown = 3000;
        requestAnimationFrame(gameloop);
    }

    return {
        initialize : initialize,
        run : run
    };
}(MyGame.game, MyGame.graphics, MyGame.input, MyGame.persistence));