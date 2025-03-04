const GRID_SIZE = 15;
const TILE_SIZE = 32;

let tiles = [];
let grid = [];
let gridFlat;

function preload() {
  let p_h = loadImage("images/pipe_h.png");
  let p_v = loadImage("images/pipe_v.png");
  let p_se = loadImage("images/pipe_corner_se.png");
  let p_ne = loadImage("images/pipe_corner_ne.png");
  let p_nw = loadImage("images/pipe_corner_nw.png");
  let p_sw = loadImage("images/pipe_corner_sw.png");
  let p_blank = loadImage("images/pipe_blank.png");

  tiles.push(
    new Tile(p_h, {
      NORTH: [p_blank, p_h, p_ne, p_nw],
      EAST: [p_h, p_sw, p_nw],
      SOUTH: [p_blank, p_h, p_se, p_sw],
      WEST: [p_h, p_se, p_ne],
    }),
    new Tile(p_v, {
      NORTH: [p_v, p_sw, p_se],
      EAST: [p_blank, p_v, p_ne, p_se],
      SOUTH: [p_v, p_ne, p_nw],
      WEST: [p_blank, p_v, p_sw, p_nw],
    }),
    new Tile(p_se, {
      NORTH: [p_blank, p_h, p_nw, p_ne],
      EAST: [p_h, p_sw, p_nw],
      SOUTH: [p_v, p_nw, p_ne],
      WEST: [p_blank, p_v, p_sw, p_nw],
    }),
    new Tile(p_ne, {
      NORTH: [p_v, p_se, p_sw],
      EAST: [p_h, p_sw, p_nw],
      SOUTH: [p_blank, p_h, p_se, p_sw],
      WEST: [p_blank, p_v, p_sw, p_nw],
    }),
    new Tile(p_nw, {
      NORTH: [p_v, p_se, p_sw],
      EAST: [p_blank, p_v, p_ne, p_se],
      SOUTH: [p_blank, p_h, p_se, p_sw],
      WEST: [p_h, p_ne, p_se],
    }),
    new Tile(p_sw, {
      NORTH: [p_blank, p_h, p_nw, p_ne],
      EAST: [p_blank, p_v, p_ne, p_se],
      SOUTH: [p_v, p_nw, p_ne],
      WEST: [p_h, p_ne, p_se],
    }),
    new Tile(p_blank, {
      NORTH: [p_blank, p_h, p_ne, p_nw],
      EAST: [p_blank, p_v, p_ne, p_se],
      SOUTH: [p_blank, p_h, p_se, p_sw],
      WEST: [p_blank, p_v, p_nw, p_sw],
    })
  );
}

function setup() {
  createCanvas(GRID_SIZE * TILE_SIZE, GRID_SIZE * TILE_SIZE);
  reset();
}

function observeCell(row, col) {
  let cell = grid[row][col];
  cell.observe();

  // Find cell
  gridFlat.splice(gridFlat.indexOf(cell), 1);

  updateNeighbors(row, col);
}

function updateNeighbors(row, col) {
  let cell = grid[row][col];

  // Update neighboring cells
  let north = row - 1;
  let south = row + 1;
  let west = col - 1;
  let east = col + 1;

  // Check if neighbor cell is in bounds before updating it
  if (north >= 0 && north < GRID_SIZE) {
    let neighbor = grid[north][col];
    let oldTiles = [...neighbor.tiles];
    cell.update(neighbor, "NORTH");

    // If the neighbor has only one tile in its tile set,
    // observe it and update its neighbors
    if (neighbor.tiles.length == 1 && !neighbor.observed) {
      observeCell(north, col);

      // Check if the tile set changed,
      // update the neighbor cell's neighbors
    } else if (oldTiles.length != neighbor.tiles.length) {
      updateNeighbors(north, col);
    }
  }

  if (south >= 0 && south < GRID_SIZE) {
    let neighbor = grid[south][col];
    let oldTiles = [...neighbor.tiles];
    cell.update(neighbor, "SOUTH");

    if (neighbor.tiles.length == 1 && !neighbor.observed) {
      observeCell(south, col);
    } else if (oldTiles.length != neighbor.tiles.length) {
      updateNeighbors(south, col);
    }
  }

  if (west >= 0 && west < GRID_SIZE) {
    let neighbor = grid[row][west];
    let oldTiles = [...neighbor.tiles];
    cell.update(neighbor, "WEST");

    if (neighbor.tiles.length == 1 && !neighbor.observed) {
      observeCell(row, west);
    } else if (oldTiles.length != neighbor.tiles.length) {
      updateNeighbors(row, west);
    }
  }

  if (east >= 0 && east < GRID_SIZE) {
    let neighbor = grid[row][east];
    let oldTiles = [...neighbor.tiles];
    cell.update(neighbor, "EAST");

    if (neighbor.tiles.length == 1 && !neighbor.observed) {
      observeCell(row, east);
    } else if (oldTiles.length != neighbor.tiles.length) {
      updateNeighbors(row, east);
    }
  }
}

let done = false;

function reset() {
  done = false;
  for (let i = 0; i < GRID_SIZE; i++) {
    grid[i] = new Array(GRID_SIZE);
  }

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      grid[row][col] = new Cell([...tiles]);
    }
  }

  gridFlat = grid.flat();

  // Observe a random cell
  let randRow = Math.floor(Math.random() * GRID_SIZE);
  let randCol = Math.floor(Math.random() * GRID_SIZE);

  observeCell(randRow, randCol);
}

function draw() {
  clear();
  background(220);

  // If grid is not fully observed, keep observing
  if (!done) {
    // Get the cell with the smallest tile set
    gridFlat.sort((a, b) => {
      return a.tiles.length - b.tiles.length;
    });
    let cell = gridFlat[0];

    // Impossible configuration, so stop
    if (cell.tiles.length == 0) {
      done = true;
    }

    // Observe it
    for (let row = 0; row < GRID_SIZE; row++) {
      let col = grid[row].indexOf(cell);

      if (col != -1) {
        observeCell(row, col);
        break;
      }
    }

    // All cells have been observed, so stop
    if (gridFlat.length == 0) {
      done = true;
    }
  }
  
  if (done && gridFlat.length != 0) {
    reset();
  }

  // Draw grid
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      grid[row][col].draw(col * TILE_SIZE, row * TILE_SIZE);
    }
  }
}
