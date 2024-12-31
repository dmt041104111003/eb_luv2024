var Fireworks = function() {
    var self = this;
    var rand = function(rMi, rMa) { return ~~((Math.random() * (rMa - rMi + 1)) + rMi); }
    window.requestAnimFrame = function() {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function(a) { window.setTimeout(a, 1E3 / 60) }
    }();

    self.init = function() {
        self.dt = 0;
        self.oldTime = Date.now();
        self.canvas = document.createElement('canvas');
        self.canvasContainer = $('#canvas-container');

        // Set canvas to window size
        self.canvas.width = self.cw = window.innerWidth;
        self.canvas.height = self.ch = window.innerHeight;

        // Set canvas container to full window size
        self.canvasContainer.css({
            width: '100%',
            height: '100%'
        });

        // Enhanced settings for more vibrant display
        self.particles = [];
        self.fireworks = [];
        self.currentHue = 170;
        self.partCount = 50;
        self.partSpeed = 5;
        self.partSpeedVariance = 10;
        self.partWind = 50;
        self.partFriction = 5;
        self.partGravity = 1;
        self.hueMin = 0;
        self.hueMax = 360;
        self.fworkSpeed = 2;
        self.fworkAccel = 4;
        self.hueVariance = 60;
        self.flickerDensity = 30;
        self.showShockwave = false;
        self.showTarget = false;
        self.clearAlpha = 25;
        self.lineWidth = 1;

        self.canvasContainer.append(self.canvas);
        self.ctx = self.canvas.getContext('2d');
        self.ctx.lineCap = 'round';
        self.ctx.lineJoin = 'round';
        self.lineWidth = 1;
        self.bindEvents();
        self.canvasLoop();

        self.autoLaunch();
    };

    self.autoLaunch = function() {
        // Launch pattern 1: Random across screen
        setInterval(function() {
            var startX = rand(self.cw / 4, (self.cw / 4) * 3);
            var startY = self.ch;
            var targetX = rand(50, self.cw - 50);
            var targetY = rand(50, self.ch / 2);

            self.currentHue = rand(self.hueMin, self.hueMax);
            self.fireworks.push(new Firework(startX, startY, targetX, targetY));
        }, 400);

        // Launch pattern 2: From edges
        setInterval(function() {
            var startX = rand(0, 1) ? 0 : self.cw;
            var startY = self.ch;
            var targetX = rand(50, self.cw - 50);
            var targetY = rand(50, self.ch / 2);

            self.currentHue = rand(self.hueMin, self.hueMax);
            self.fireworks.push(new Firework(startX, startY, targetX, targetY));
        }, 600);

        // Launch pattern 3: Center bursts
        setInterval(function() {
            var startX = self.cw / 2;
            var startY = self.ch;
            var targetX = rand(50, self.cw - 50);
            var targetY = rand(50, self.ch / 2);

            self.currentHue = rand(self.hueMin, self.hueMax);
            self.fireworks.push(new Firework(startX, startY, targetX, targetY));
        }, 500);
    };

    var Particle = function(x, y, hue) {
        this.x = x;
        this.y = y;
        this.coordLast = [
            { x: x, y: y },
            { x: x, y: y },
            { x: x, y: y }
        ];
        this.angle = rand(0, 360);
        this.speed = rand(((self.partSpeed - self.partSpeedVariance) <= 0) ? 1 : self.partSpeed - self.partSpeedVariance, (self.partSpeed + self.partSpeedVariance));
        this.friction = 1 - self.partFriction / 100;
        this.gravity = self.partGravity / 2;
        this.hue = rand(hue - self.hueVariance, hue + self.hueVariance);
        this.brightness = rand(50, 80);
        this.alpha = rand(40, 100) / 100;
        this.decay = rand(10, 50) / 1000;
        this.wind = (rand(0, self.partWind) - (self.partWind / 2)) / 25;
        this.lineWidth = self.lineWidth;
    };

    Particle.prototype.update = function(index) {
        var radians = this.angle * Math.PI / 180;
        var vx = Math.cos(radians) * this.speed;
        var vy = Math.sin(radians) * this.speed + this.gravity;
        this.speed *= this.friction;

        this.coordLast[2].x = this.coordLast[1].x;
        this.coordLast[2].y = this.coordLast[1].y;
        this.coordLast[1].x = this.coordLast[0].x;
        this.coordLast[1].y = this.coordLast[0].y;
        this.coordLast[0].x = this.x;
        this.coordLast[0].y = this.y;

        this.x += vx * self.dt;
        this.y += vy * self.dt;

        this.angle += this.wind;
        this.alpha -= this.decay;

        if (this.alpha < .05) {
            self.particles.splice(index, 1);
        }
    };

    Particle.prototype.draw = function() {
        var coordRand = (rand(1, 3) - 1);
        self.ctx.beginPath();
        self.ctx.moveTo(Math.round(this.coordLast[coordRand].x), Math.round(this.coordLast[coordRand].y));
        self.ctx.lineTo(Math.round(this.x), Math.round(this.y));
        self.ctx.closePath();
        self.ctx.strokeStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + this.alpha + ')';
        self.ctx.stroke();

        if (self.flickerDensity > 0) {
            var inverseDensity = 50 - self.flickerDensity;
            if (rand(0, inverseDensity) === inverseDensity) {
                self.ctx.beginPath();
                self.ctx.arc(Math.round(this.x), Math.round(this.y), rand(this.lineWidth, this.lineWidth + 3) / 2, 0, Math.PI * 2, false)
                self.ctx.closePath();
                var randAlpha = rand(50, 100) / 100;
                self.ctx.fillStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + randAlpha + ')';
                self.ctx.fill();
            }
        }
    };

    var Firework = function(startX, startY, targetX, targetY) {
        this.x = startX;
        this.y = startY;
        this.startX = startX;
        this.startY = startY;
        this.hitX = false;
        this.hitY = false;
        this.coordLast = [
            { x: startX, y: startY },
            { x: startX, y: startY },
            { x: startX, y: startY }
        ];
        this.targetX = targetX;
        this.targetY = targetY;
        this.speed = self.fworkSpeed;
        this.angle = Math.atan2(targetY - startY, targetX - startX);
        this.acceleration = self.fworkAccel / 100;
        this.hue = self.currentHue;
        this.brightness = rand(50, 80);
        this.alpha = rand(50, 100) / 100;
        this.lineWidth = self.lineWidth;
    };

    Firework.prototype.update = function(index) {
        self.ctx.lineWidth = this.lineWidth;

        var vx = Math.cos(this.angle) * this.speed;
        var vy = Math.sin(this.angle) * this.speed;
        this.speed *= 1 + this.acceleration;
        this.coordLast[2].x = this.coordLast[1].x;
        this.coordLast[2].y = this.coordLast[1].y;
        this.coordLast[1].x = this.coordLast[0].x;
        this.coordLast[1].y = this.coordLast[0].y;
        this.coordLast[0].x = this.x;
        this.coordLast[0].y = this.y;

        if (this.startX >= this.targetX) {
            if (this.x + vx <= this.targetX) {
                this.x = this.targetX;
                this.hitX = true;
            } else {
                this.x += vx * self.dt;
            }
        } else {
            if (this.x + vx >= this.targetX) {
                this.x = this.targetX;
                this.hitX = true;
            } else {
                this.x += vx * self.dt;
            }
        }

        if (this.startY >= this.targetY) {
            if (this.y + vy <= this.targetY) {
                this.y = this.targetY;
                this.hitY = true;
            } else {
                this.y += vy * self.dt;
            }
        } else {
            if (this.y + vy >= this.targetY) {
                this.y = this.targetY;
                this.hitY = true;
            } else {
                this.y += vy * self.dt;
            }
        }

        if (this.hitX && this.hitY) {
            self.createParticles(this.targetX, this.targetY, this.hue);
            self.fireworks.splice(index, 1);
        }
    };

    Firework.prototype.draw = function() {
        self.ctx.lineWidth = this.lineWidth;
        var coordRand = (rand(1, 3) - 1);
        self.ctx.beginPath();
        self.ctx.moveTo(Math.round(this.coordLast[coordRand].x), Math.round(this.coordLast[coordRand].y));
        self.ctx.lineTo(Math.round(this.x), Math.round(this.y));
        self.ctx.closePath();
        self.ctx.strokeStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + this.alpha + ')';
        self.ctx.stroke();
    };

    self.createParticles = function(x, y, hue) {
        var countdown = self.partCount;
        while (countdown--) {
            self.particles.push(new Particle(x, y, hue));
        }
    };

    self.bindEvents = function() {
        $(window).on('resize', function() {
            clearTimeout(self.timeout);
            self.timeout = setTimeout(function() {
                self.canvas.width = self.cw = window.innerWidth;
                self.canvas.height = self.ch = window.innerHeight;
                self.ctx.lineCap = 'round';
                self.ctx.lineJoin = 'round';
            }, 100);
        });

        $(self.canvas).on('click', function(e) {
            var mx = e.pageX - self.canvasContainer.offset().left;
            var my = e.pageY - self.canvasContainer.offset().top;
            self.currentHue = rand(self.hueMin, self.hueMax);
            self.fireworks.push(new Firework(self.cw / 2, self.ch, mx, my));
        });
    };

    self.updateFireworks = function() {
        var i = self.fireworks.length;
        while (i--) {
            var f = self.fireworks[i];
            f.update(i);
        }
    };

    self.updateParticles = function() {
        var i = self.particles.length;
        while (i--) {
            var p = self.particles[i];
            p.update(i);
        }
    };

    self.drawFireworks = function() {
        var i = self.fireworks.length;
        while (i--) {
            var f = self.fireworks[i];
            f.draw();
        }
    };

    self.drawParticles = function() {
        var i = self.particles.length;
        while (i--) {
            var p = self.particles[i];
            p.draw();
        }
    };

    self.clear = function() {
        self.particles = [];
        self.fireworks = [];
        self.ctx.clearRect(0, 0, self.cw, self.ch);
    };

    self.updateDelta = function() {
        var newTime = Date.now();
        self.dt = (newTime - self.oldTime) / 16;
        self.dt = (self.dt > 5) ? 5 : self.dt;
        self.oldTime = newTime;
    }

    self.canvasLoop = function() {
        requestAnimFrame(self.canvasLoop, self.canvas);
        self.updateDelta();
        self.ctx.globalCompositeOperation = 'destination-out';
        self.ctx.fillStyle = 'rgba(0,0,0,' + self.clearAlpha / 100 + ')';
        self.ctx.fillRect(0, 0, self.cw, self.ch);
        self.ctx.globalCompositeOperation = 'lighter';
        self.updateFireworks();
        self.updateParticles();
        self.drawFireworks();
        self.drawParticles();
    };

    self.init();
}

// Start the fireworks when document is ready
$(document).ready(function() {
    var fworks = new Fireworks();
});