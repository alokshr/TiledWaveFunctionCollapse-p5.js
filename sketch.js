let GRID_SIZE = 10;
let IMG_SIZE = 32;
let grid;
let gridFlat;
let tiles;

function preload() {
  let p_h = loadImage("images/pipe_h.png");
  let p_v = loadImage("images/pipe_v.png");
  let p_se = loadImage("images/pipe_corner_se.png");
  let p_en = loadImage("images/pipe_corner_en.png");
  let p_nw = loadImage("images/pipe_corner_nw.png");
  let p_ws = loadImage("images/pipe_corner_ws.png");
  let p_blank = loadImage("images/pipe_blank.png");

  tiles = [];

  tiles.push(
    new Tile(p_h, {
      NORTH: [p_blank, p_h, p_en, p_nw],
      EAST: [p_h, p_ws, p_nw],
      SOUTH: [p_blank, p_h, p_se, p_ws],
      WEST: [p_h, p_se, p_en],
    }),
    new Tile(p_v, {
      NORTH: [p_v, p_ws, p_se],
      EAST: [p_blank, p_v, p_en, p_se],
      SOUTH: [p_v, p_en, p_nw],
      WEST: [p_blank, p_v, p_ws, p_nw],
    }),
    new Tile(p_se, {
      NORTH: [p_blank, p_h, p_nw, p_en],
      EAST: [p_h, p_ws, p_nw],
      SOUTH: [p_v, p_nw, p_en],
      WEST: [p_blank, p_v, p_ws, p_nw],
    }),
    new Tile(p_en, {
      NORTH: [p_v, p_se, p_ws],
      EAST: [p_h, p_ws, p_nw],
      SOUTH: [p_blank, p_h, p_se, p_ws],
      WEST: [p_blank, p_v, p_ws, p_nw],
    }),
    new Tile(p_nw, {
      NORTH: [p_v, p_se, p_ws],
      EAST: [p_blank, p_v, p_en, p_se],
      SOUTH: [p_blank, p_h, p_se, p_ws],
      WEST: [p_h, p_en, p_se],
    }),
    new Tile(p_ws, {
      NORTH: [p_blank, p_h, p_nw, p_en],
      EAST: [p_blank, p_v, p_en, p_se],
      SOUTH: [p_v, p_nw, p_en],
      WEST: [p_h, p_en, p_se],
    }),
    new Tile(p_blank, {
      NORTH: [p_blank, p_h, p_en, p_nw],
      EAST: [p_blank, p_v, p_en, p_se],
      SOUTH: [p_blank, p_h, p_se, p_ws],
      WEST: [p_blank, p_v, p_nw, p_ws],
    })
  );
}

function setup() {
  createCanvas(GRID_SIZE*IMG_SIZE, GRID_SIZE*IMG_SIZE);

  // Initialize 2d grid
  grid = new Array(GRID_SIZE);
  for (let i = 0; i < GRID_SIZE; i++) {
    grid[i] = new Array(GRID_SIZE);
  }

  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      grid[i][j] = new Cell([...tiles]);
    }
  }

  gridFlat = grid.flat();

  // Collapse a random cell
  let randRow = Math.floor(Math.random() * GRID_SIZE);
  let randCol = Math.floor(Math.random() * GRID_SIZE);

  gridFlat.splice(randRow * GRID_SIZE + randCol, 1);

  observeAndPropagateCell(randRow, randCol);
}

function observeAndPropagateCell(row, col) {
  let cell = grid[row][col];
  cell.observe();

  let up = row - 1;
  let right = col + 1;
  let down = row + 1;
  let left = col - 1;

  if (up >= 0 && up < GRID_SIZE) {
    grid[up][col].update(cell.tile, "NORTH");
  }

  if (right >= 0 && right < GRID_SIZE) {
    grid[row][right].update(cell.tile, "EAST");
  }

  if (down >= 0 && down < GRID_SIZE) {
    grid[down][col].update(cell.tile, "SOUTH");
  }

  if (left >= 0 && left < GRID_SIZE) {
    grid[row][left].update(cell.tile, "WEST");
  }
}

function drawGrid() {
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      grid[i][j].draw(j * IMG_SIZE, i * IMG_SIZE);
    }
  }
}

let done = false;

function draw() {
  clear();
  background(220);

  if (!done) {
    // Check if all cells are observed
    if (gridFlat.length == 0) {
      done = true;
      
    } else {
      // Collapse the cell with the least options for tile choice
      gridFlat.sort((a, b) => {
        return b.tiles.length - a.tiles.length;
      });

      let cell = gridFlat.pop();

      if (cell.tiles.length == 0) {
        done = true;
      } else {
        for (let row = 0; row < GRID_SIZE; row++) {
          let col = grid[row].indexOf(cell);

          if (col != -1) {
            observeAndPropagateCell(row, col);

            break;
          }
        }
      }
    }
  }

  // Draw grid image
  drawGrid();
}
