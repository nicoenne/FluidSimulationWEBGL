/* 2D Vectors */

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(...others) {
        others.forEach((vec) => {
            this.x += vec.x;
            this.y += vec.y;
        });
    }

    sub(...others) {
        others.forEach((vec) => {
            this.x -= vec.x;
            this.y -= vec.y;
        });
    }

    div(...scalars) {
        scalars.forEach((scalar) => {
            this.x /= scalar;
            this.y /= scalar;
        });
    }

    mul(...scalars) {
        scalars.forEach((scalar) => {
            this.x *= scalar;
            this.y *= scalar;
        });
    }

    static add(...vectors) {
        let outX = 0;
        let outY = 0;
        vectors.forEach((vec) => {
            outX += vec.x;
            outY += vec.y;
        });
        return new Vector(outX, outY);
    }

    static sub(...vectors) {
        let first = vectors.shift();
        let outX = first.x;
        let outY = first.y;
        vectors.forEach((vec) => {
            outX -= vec.x;
            outY -= vec.y;
        });
        return new Vector(outX, outY);
    }

    static div(vector, ...scalars) {
        let outX = vector.x;
        let outY = vector.y;
        scalars.forEach((scalar) => {
            outX /= scalar;
            outY /= scalar;
        });
        return new Vector(outX, outY);
    }

    static mul(vector, ...scalars) {
        let outX = vector.x;
        let outY = vector.y;
        scalars.forEach((scalar) => {
            outX *= scalar;
            outY *= scalar;
        });
        return new Vector(outX, outY);
    }


    static dot(first, second) {
        return first.x * second.x + first.y * second.y;
    }

    static dist(first, second) {
        let delta = Vector.sub(first, second);
        return Math.sqrt(
            Vector.dot(delta, delta)
        );
    }
}
