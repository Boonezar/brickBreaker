MyGame.particleSystem = (function(spec, graphics) {
	let that = {};
    let particles = [];
    for(let i = 0; i < 10; i++){
        var particleX = spec.position.x + (7*i);
        for(let j = 0; j < 5; j++){
            var particleY = spec.position.y + (2*i);
            particles.push({
                position: {x: particleX, y: particleY},
                direction: {x: 0, y: 1},
                speed: Math.floor(Math.random() * 500),
                rotation: spec.rotation,
                lifetime: Math.floor(Math.random() * spec.lifetime) + 100,
                alive: 0,
                size: Math.floor(Math.random() * 9) + 1,
            });
        }
    }

    var thisImage = new Image();
    thisImage.onload = function(){
        that.render = function(){
            for(let i = 0; i < particles.length; i++){
                graphics.drawParticle({
                    center: particles[i].position,
                    size: particles[i].size,
                    rotation: particles[i].rotation,
                    image: thisImage
                });
            }
        }
    }
    thisImage.src = spec.image;

    that.update = function(elapsedTime){
        let keepMe = [];

        for(let i = 0; i < particles.length; i++){
            particles[i].alive += elapsedTime;
            particles[i].position.x += (elapsedTime * particles[i].speed * particles[i].direction.x) / 1000;
            particles[i].position.y += (elapsedTime * particles[i].speed * particles[i].direction.y) / 1000;

            if(particles[i].alive <= particles[i].lifetime)
                keepMe.push(particles[i]);
        }

        particles = keepMe;
    }

    that.isAlive = function(){ return particles.length > 0; }

    that.render = function(){ /* Empty until ready */}

    return that;
});