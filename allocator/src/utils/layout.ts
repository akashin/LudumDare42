export enum LayoutDirection {
    Vertical, Horizontal
};

export class TiledLayout extends Phaser.GameObjects.Container {
    direction: LayoutDirection;
    spacing: number;
    center_elements: boolean;
    size: number;

    constructor(scene,
                direction: LayoutDirection,
                spacing: number,
                center_elements: boolean = false,
                size: number = 0) {
        super(scene);

        this.direction = direction;
        this.spacing = spacing;
        this.center_elements = center_elements;
        this.size = size;
    }

    apply_centering() {
      for (let child of this.list) {
        let drawableChild: any = child;

        if (this.direction === LayoutDirection.Horizontal) {
          drawableChild.y += (this.size - drawableChild.getBounds().height) / 2;
        } else {
          drawableChild.x += (this.size - drawableChild.getBounds().width) / 2;
        }
      }
    }

    addItem(item, spacing: number = 0) {
      console.log(this.getBounds());
      if (this.length > 0) {
        if (this.direction === LayoutDirection.Horizontal) {
          item.x += this.getBounds().width + this.spacing + spacing;
        } else {
          item.y += this.getBounds().height + this.spacing + spacing;
        }
      }
      this.add(item);
      // TODO: Finish implementing this.
      // if (this.center_elements) {
      //     this.apply_centering();
      // }
    }
};

