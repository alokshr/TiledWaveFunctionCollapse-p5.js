class Cell {
  constructor(tiles) {
    this.tiles = tiles;

    this.tile = undefined;
    this.observed = false;
  }

  // Observes and collapses this cell
  observe() {
    this.observed = true;

    let randomIndex = Math.floor(Math.random() * this.tiles.length);
    this.tile = this.tiles[randomIndex];
    this.tiles = [this.tile];
  }

  // Updates the given cell's tile set based this cell's tile set
  // in the direction from this cell to the given cell
  update(cell, direction) {
    cell.tiles = cell.tiles.filter((otherTile) => {
      let keep = false;
      
      // If a tile can be adjacent to at least one tile in
      // this cell's tile set, it can stay in the other cell's tile set
      this.tiles.forEach((thisTile) => {
        keep = keep || otherTile.canBeAdjacent(thisTile, direction);
      })
      
      return keep;
    });
  }
  
  draw(x, y) {
    if (!this.observed) {
      // Two display modes:
      
      // Colors unobserved cells with shades of gray
      // -------------------------------------------
      // fill(255/this.tiles.length);
      // rect(x, y, TILE_SIZE, TILE_SIZE);
      
      // Slows down program, but displays unobserved
      // cells as all their possibilities overlapped
      // -------------------------------------------
      this.tiles.forEach((tile) => {
        tint(255, 255/this.tiles.length);
        image(tile.img, x, y);
      });
    } else {
      tint(255);
      image(this.tile.img, x, y);
    }
  }
}
