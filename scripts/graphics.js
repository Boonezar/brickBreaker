MyGame.graphics = (function(){
    'use strict';
    
    var canvas = document.getElementById('canvas-main');
    var context = canvas.getContext('2d');
    CanvasRenderingContext2D.prototype.clear = function(){
        this.save();
        this.setTransform(1,0,0,1,0,0);
        this.clearRect(0,0, canvas.width, canvas.height);
        this.restore();
    };
    function clear(){
        context.clear();
    }

    function Texture(spec){
        var that = {};
        var image = new Image();
        
        image.onload = function(){
            that.draw = function(){
                context.save();
                context.translate(spec.center.x, spec.center.y);
                context.rotate(spec.rotation);
                context.translate(-spec.center.x, -spec.center.y);
                context.drawImage(
                    image,
                    spec.center.x - spec.width/2,
                    spec.center.y - spec.height/2,
                    spec.width,
                    spec.height);
                context.restore();
            }
        };
        image.src = spec.image;

        that.imageSrc = spec.image;

        that.edge = {
            left: spec.center.x - spec.width/2, 
            right: spec.center.x + spec.width/2,
            top: spec.center.y - spec.height/2,
            bot: spec.center.y + spec.height/2
        }

        that.draw = function() {/* Empty until ready */};

        return that;
    }

    function Paddle(spec){
        var that = {};
        var image = new Image();
        
        image.onload = function(){
            that.draw = function(){
                context.save();
                context.translate(spec.center.x, spec.center.y);
                context.rotate(spec.rotation);
                context.translate(-spec.center.x, -spec.center.y);
                context.drawImage(
                    image,
                    spec.center.x - spec.width/2,
                    spec.center.y - spec.height/2,
                    spec.width,
                    spec.height);
                context.restore();
            }
        };
        image.src = spec.image;

        that.getPosition = function(){
            var position = {
                center: { x: spec.center.x, y: spec.center.y},
                edge: { 
                    left: spec.center.x - spec.width/2,
                    right: spec.center.x + spec.width/2,
                    top: spec.center.y - spec.height/2,
                    bot: spec.center.y + spec.height/2
                },
                width: spec.width
            }
            return position;
        }
        that.halfWidth = function() { spec.width /= 2; }
        that.reset = function(elaspedTime){ spec.center.x = 490; }
        that.moveLeft = function(elapsedTime){
            if(spec.center.x - spec.moveRate * (elapsedTime / 1000) < spec.width / 2)
                spec.center.x = spec.width / 2;
            else
                spec.center.x -= spec.moveRate * (elapsedTime / 1000);
        };
        that.moveRight = function(elapsedTime){
            if(spec.center.x + spec.moveRate * (elapsedTime / 1000) > 980 - (spec.width/2))
                spec.center.x = 980 - (spec.width/2);
            else
                spec.center.x += spec.moveRate * (elapsedTime / 1000);
        };
        that.draw = function() {/* Empty until ready */};

        return that;
    }

    function Ball(spec){
        var that = {};
        var image = new Image();
        
        image.onload = function(){
            that.draw = function(){
                context.save();
                context.translate(spec.center.x, spec.center.y);
                context.rotate(spec.rotation);
                context.translate(-spec.center.x, -spec.center.y);
                context.drawImage(
                    image,
                    spec.center.x - spec.width/2,
                    spec.center.y - spec.height/2,
                    spec.width,
                    spec.height);
                context.restore();
            }
        };
        image.src = spec.image;
        that.isMoving = false;
        that.fellThru = false;

        that.getPosition = function(){
            var position = {
                center: { x: spec.center.x, y: spec.center.y},
                edge: { 
                    left: spec.center.x - spec.width/2,
                    right: spec.center.x + spec.width/2,
                    top: spec.center.y - spec.height/2,
                    bot: spec.center.y + spec.height/2
                }
            }
            return position;
        }
        that.startMovement = function(){
            that.isMoving = true;
            that.fellThru = false;
            spec.direction.x = -0.4;
            spec.direction.y = -1;
            spec.speed = 350;
        }
        that.reset = function(newCenter){
            that.isMoving = false;
            spec.center.x = 490;
            spec.center.y = 520;
            spec.speed = 0;
        }
        that.updateRotation = function(angle){
            spec.rotation += angle;
        };
        that.move = function(elapsedTime){
            spec.center.x += (spec.direction.x * spec.speed * elapsedTime) / 1000;
            spec.center.y += (spec.direction.y * spec.speed * elapsedTime) / 1000;
        };
        that.changeDirection = function(dir, paddlePos){
            switch(dir){
                case 'down':
                    spec.center.y += 5;
                    spec.direction.y *= -1;
                    break;
                case 'left':
                    spec.center.x -= 5;
                    spec.direction.x *= -1;
                    break;
                case 'right':
                    spec.center.x += 5;
                    spec.direction.x *= -1;
                    break;
                case 'paddleUp':
                    spec.direction.x = paddlePos;
                case 'up':
                    spec.center.y -= 5;
                    spec.direction.y *= -1;
                    break;
            }
        }
        that.setSpeed = function(newSpeed){ spec.speed = newSpeed; }
        that.draw = function() {/* Empty until ready */};
        
        return that;
    }

    function Score(spec){
        var that = {};

        that.draw = function(){
            context.save();
            context.translate(spec.center.x, spec.center.y);
            context.rotate(spec.rotation);
            context.translate(-spec.center.x, -spec.center.y);
            context.font = spec.font;
            context.fillStyle = spec.color;
            if(spec.fillText)
                context.fillText(spec.text + spec.points.toString(), spec.center.x, spec.center.y);
            else
                context.strokeText(spec.text + spec.points.toString(), spec.center.x, spec.center.y);
            context.restore();
        }

        that.updateScore = function(newPoints){ spec.points += newPoints; }

        that.getScore = function(){ return spec.points; }

        return that;
    }

    function drawParticle(spec){
        context.save();
        context.translate(spec.center.x, spec.center.y);
        context.rotate(spec.rotation);
        context.translate(-spec.center.x, -spec.center.y);

        context.drawImage(
            spec.image,
            spec.center.x - spec.size/2,
            spec.center.y - spec.size / 2,
            spec.size,
            spec.size
        );
        context.restore();
    }

    return {
        clear : clear,
        Texture : Texture,
        Paddle : Paddle,
        Ball : Ball,
        Score : Score,
        drawParticle : drawParticle
    };
}());