class Particle {
    constructor(x, y) {
        this.pos = new Vector(x, y);
        this.vel = new Vector(0, 0);
    }

    applyForce(force) {
        this.vel.add(force)
    }

    update() {
        this.pos.add(this.vel);
    }
}




function SmoothingKernel(radius, distance) {
    let norm = PI * pow(radius, 8) / 4;
    let value = Math.max(0, radius * radius - distance * distance); 
    return value * value * value / norm;
  }

function CalculateDensity(samplePoint) {
    let density = 0;
    for (const p of particle) {
        let distance = dist(samplePoint.x, samplePoint.y, p.position.x, p.position.y);
        let influence = NormalizedSmoothingKernel(smoothingRadius, distance);
        density += particleMass * influence;
    }
    return density;
}