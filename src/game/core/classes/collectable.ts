export class Collectable {
    constructor(
        public name = "Unknown Collectable",
        public tile = 7 // Win token tile number
    ) {
        this.name = name;
        this.tile = tile;
    }
}

export default Collectable;