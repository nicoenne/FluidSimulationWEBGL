var smoothingRadius = 50;
var collisionDamping = 1;

class Particle {
    constructor(x, y) {
        this.size = 10;
        this.mass = 1;
        this.pos = new Vector(x, y);
        this.vel = new Vector(0, 0);
        this.acc = new Vector(0, 0);
    }

    applyForce(force) {
        let acc = Vector.div(force, this.mass);
        this.acc.add(acc);
    }

    update() {
        this.vel.add(Vector.mul(this.acc));
        this.pos.add(Vector.mul(this.vel));
        this.acc.mul(0);
    }
};

function resolveCollision(particles, boxWidth, boxHeight) {

    particles.forEach(particle => {
        let halfBoundSizeX = boxWidth / 2 - particle.size / 2;
        if (Math.abs(particle.pos.x) > halfBoundSizeX) {
            particle.pos.x = halfBoundSizeX * Math.sign(particle.pos.x);
            particle.vel.x *= -1 * collisionDamping;
        }

        let halfBoundSizeY = boxHeight / 2 - particle.size / 2;
        if (Math.abs(particle.pos.y) > halfBoundSizeY) {
            particle.pos.y = halfBoundSizeY * Math.sign(particle.pos.y);
            particle.vel.y *= -1 * collisionDamping;
        } 
    });
}

function SmoothingKernel(radius, dst) {
    let volume = Math.PI * Math.pow(radius, 8) / 4;
    value = Math.max(0, radius * radius - dst * dst);
    return value * value * value / volume;
}

function CalculateDensity(particles, samplePoint) {
    let density = 0;
    particles.forEach(particle => {
        let dst = Vector.dist(particle.pos, samplePoint);
        let influence = SmoothingKernel(smoothingRadius, dst);
        density += particle.mass * influence;
    });
    return density;
}