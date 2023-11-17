function getCircleVertices(cX, cY, r) {
    let vertices = [];
    let oldX = cX + r;
    let oldY = cY;
    let n = 50
    for (let i=0; i < n + 1; i++) {
        let x = cX + r * Math.cos(i * 2 * Math.PI / n);
        let y = cY + r * Math.sin(i * 2 * Math.PI / n);
        vertices.push(cX, cY, oldX, oldY, x, y);
        oldX = x;
        oldY = y;
    }
    return vertices;
}

function getRectVertices(cX, cY, horSide, verSide) {
    return [
        /* Bottom left triangle */
        cX - horSide / 2, cY + verSide / 2,
        cX - horSide / 2, cY - verSide / 2,
        cX + horSide / 2, cY - verSide / 2,
        /* Top right triangle */
        cX + horSide / 2, cY - verSide / 2,
        cX + horSide / 2, cY + verSide / 2,
        cX - horSide / 2, cY + verSide / 2
    ]
}

function getRectTexcoord() {
    return [
        /* Bottom left triangle */
        0, 1,
        0, 0,
        1, 0,
        /* Top right triangle */
        1, 0,
        1, 1,
        0, 1
    ]
}