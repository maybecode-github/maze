class Passable {

    constructor(door, x, y, direction) {
        this.door = door;
        this.x = x;
        this.y = y;
        this.direction = direction;
    }

    getDoor() {
        return function () {
            return this.door;
        }
    }

}


export {Passable};