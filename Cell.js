class Cell {
  constructor(tiles) {
    this.observed = false;
    this.tiles = tiles;
    this.tile = undefined;
  }

  observe() {
    if (!this.observed) {
      this.observed = true;

      let randomIndex = Math.floor(Math.random() * this.tiles.length);
      this.tile = this.tiles[randomIndex];
    } else {
      throw new Error("Cannot observed already observed cell");
    }
  }

  update(tile, direction) {
    this.tiles = this.tiles.filter((t) => {
      return t.canBeAdjacent(tile, direction);
    });
  }

  draw(x, y) {
    if (!this.observed) {
      // Two display modes:
      
      // Colors unobserved cells with shades of gray
      // -------------------------------------------
      // fill(255/this.tiles.length);
      // rect(x, y, IMG_SIZE, IMG_SIZE);
      
      // Slows down program, but displays unobserved
      // cells as all their possibilities
      // -------------------------------------------
      this.tiles.forEach((tile) => {
        tint(255, 255/this.tiles.length);
        image(tile.img, x, y);
      })
    } else {
      tint(255);
      image(this.tile.img, x, y);
    }
  }
}
