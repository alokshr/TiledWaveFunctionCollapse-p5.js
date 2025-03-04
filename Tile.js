class Tile {
  constructor(img, adjacencies) {
    this.img = img;
    this.adjacencies = adjacencies;
  }
  
  // Checks if this tile is in a given tile's adjacency list
  // in the given direction
  canBeAdjacent(tile, direction) {
    switch (direction) {
      case "NORTH":
        return tile.adjacencies.NORTH.includes(this.img);
      case "EAST":
        return tile.adjacencies.EAST.includes(this.img);
      case "SOUTH":
        return tile.adjacencies.SOUTH.includes(this.img);
      case "WEST":
        return tile.adjacencies.WEST.includes(this.img);
      default:
        return false;
    }
  }
}


