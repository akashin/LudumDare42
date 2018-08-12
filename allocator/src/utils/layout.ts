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

    addItem(item, itemSpacing: number = 0) {
      // Save applied spacing in the element itself to allow redraws.
      item.layoutSpacing = itemSpacing;

      let spacing = itemSpacing;
      // Don't apply base spacing to the first element.
      if (this.length > 0) {
        spacing += this.spacing;
      }

      if (this.direction === LayoutDirection.Horizontal) {
        item.x = this.getBounds().width + spacing;
      } else {
        item.y = this.getBounds().height + spacing;
      }
      this.add(item);

      if (this.center_elements) {
        this.applyCentering();
      }
    }

    removeItem(item) {
      this.remove(item);
      this.recomputeShifts();
    }

    applyCentering() {
      for (let child of this.list) {
        let drawableChild: any = child;

        if (this.direction === LayoutDirection.Horizontal) {
          drawableChild.y = (this.size - drawableChild.getBounds().height) / 2;
        } else {
          drawableChild.x = (this.size - drawableChild.getBounds().width) / 2;
        }
      }
    }

    recomputeShifts() {
      let currentShift = 0;
      for (let child of this.list) {
        let drawableChild: any = child;

        currentShift += drawableChild.layoutSpacing;
        if (this.direction === LayoutDirection.Horizontal) {
          drawableChild.x = currentShift;
          currentShift += drawableChild.getBounds().width;
        } else {
          drawableChild.y = currentShift;
          currentShift += drawableChild.getBounds().height;
        }
        currentShift += this.spacing;
      }
    }
};

