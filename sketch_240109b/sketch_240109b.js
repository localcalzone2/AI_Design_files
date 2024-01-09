let cols, rows;
const cellSize = 10;
let grid, nextGrid, ageGrid;

function setup() {
  createCanvas(800, 800);
  cols = width / cellSize;
  rows = height / cellSize;
  
  // Initialize the arrays
  grid = new Array(cols).fill().map(() => new Array(rows).fill(0));
  nextGrid = new Array(cols).fill().map(() => new Array(rows).fill(0));
  ageGrid = new Array(cols).fill().map(() => new Array(rows).fill(0));

  // Randomly initialize the grid
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = floor(random(2));
      ageGrid[i][j] = 0;
    }
  }
}

function draw() {
  background(255);

  // Generate next grid
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let state = grid[i][j];
      let neighbors = countNeighbors(grid, i, j);

      if (state === 0 && neighbors === 3) {
        nextGrid[i][j] = 1;
        ageGrid[i][j] = 1; // New cell
      } else if (state === 1 && (neighbors < 2 || neighbors > 3)) {
        nextGrid[i][j] = 0;
        ageGrid[i][j] = 0; // Reset age when cell dies
      } else {
        nextGrid[i][j] = state;
        if (state === 1) {
          ageGrid[i][j]++; // Increase age if cell is alive
        }
      }
    }
  }

  // Draw current grid
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j] === 1) {
        let age = ageGrid[i][j];
        fill(255 - age, 0, 0); // Color based on age, deeper red with age
        stroke(255 - age, 0, 0);
        rect(i * cellSize, j * cellSize, cellSize, cellSize);
      } else {
        noStroke();
        fill(255);
        rect(i * cellSize, j * cellSize, cellSize, cellSize);
      }
    }
  }

  filter(BLUR, 5); // Apply a blur effect to the canvas

  // Prepare for next frame
  let temp = grid;
  grid = nextGrid;
  nextGrid = temp;
}

function countNeighbors(grid, x, y) {
  let sum = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      let col = (x + i + cols) % cols;
      let row = (y + j + rows) % rows;
      sum += grid[col][row];
    }
  }
  sum -= grid[x][y];
  return sum;
}
