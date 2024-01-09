let cols, rows;
const cellSize = 10;
let grid, nextGrid, ageGrid;

function setup() {
  createCanvas(800, 800);
  cols = width / cellSize;
  rows = height / cellSize;

  grid = make2DArray(cols, rows);
  nextGrid = make2DArray(cols, rows);
  ageGrid = make2DArray(cols, rows);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = floor(random(2));
    }
  }
}

function draw() {
  background(255);
  // ... logic to update nextGrid and ageGrid ...

 
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
  
  let collectives = findCellCollectives();

  // Draw current grid
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j] === 1) {
        let age = ageGrid[i][j];
        let collective = collectives.find(c => c.x === i && c.y === j);
        let yellowIntensity = collective ? collective.size * 20 : 0;
        fill(255 - age, 255 - age + yellowIntensity, 0); // More yellow with larger collective
        stroke(255 - age, 255 - age + yellowIntensity, 0);
        rect(i * cellSize, j * cellSize, cellSize, cellSize);
      } else {
        noStroke();
        fill(255);
        rect(i * cellSize, j * cellSize, cellSize, cellSize);
      }
    }
  }

  filter(BLUR, 1); // Apply a blur effect to the canvas
  [grid, nextGrid] = [nextGrid, grid]; // Swap grids for the next iteration
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

function findCellCollectives() {
  let visited = make2DArray(cols, rows);
  let collectives = [];

  function dfs(x, y) {
    if (x < 0 || x >= cols || y < 0 || y >= rows || visited[x][y] || grid[x][y] === 0) {
      return 0;
    }
    visited[x][y] = true;
    let size = 1;
    size += dfs(x + 1, y);
    size += dfs(x - 1, y);
    size += dfs(x, y + 1);
    size += dfs(x, y - 1);
    return size;
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (!visited[i][j] && grid[i][j] === 1) {
        let collectiveSize = dfs(i, j);
        collectives.push({ x: i, y: j, size: collectiveSize });
      }
    }
  }
  return collectives;
}


function make2DArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows).fill(0);
  }
  return arr;
}
