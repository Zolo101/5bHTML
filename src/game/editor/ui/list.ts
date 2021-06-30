export class List {
    width: number
    height: number
    maxHeight: number
    nthSpace: number // How far apart should the listItems be
    group: Phaser.GameObjects.Container
    items: ListItem[]

    constructor(width: number, height: number, scene: Phaser.Scene, maxHeight = height, nthSpace = 50) {
        this.width = width;
        this.height = height;
        this.maxHeight = maxHeight;
        this.nthSpace = nthSpace;
        this.group = scene.add.container();
        this.items = [];
    }

    add(item: ListItem): ListItem {
        this.group.add(item.obj);
        this.items.push(item)
        return item;
    }

    render(x: number, y: number, scene: Phaser.Scene): void {
        scene.add.container(x, y, this.group)
    }
}

export abstract class ListItem {
    obj: Phaser.GameObjects.GameObject

    constructor(obj: Phaser.GameObjects.GameObject) {
        this.obj = obj;
    }
}

export default List;