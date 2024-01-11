let cols, rows;
const cellSize = 10;
let grid, nextGrid, ageGrid;
let currentPattern = 'single';

function setup() {
  createCanvas(1200, 600);
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
  select('#pattern1').mousePressed(() => currentPattern = 'single');
  select('#pattern2').mousePressed(() => currentPattern = '2x2');
  select('#pattern3').mousePressed(() => currentPattern = '6x6');
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

  filter(BLUR, 0); // Apply a blur effect to the canvas
  [grid, nextGrid] = [nextGrid, grid]; // Swap grids for the next iteration
}

function activateCellAt(gridX, gridY) {
  if (gridX >= 0 && gridX < cols && gridY >= 0 && gridY < rows) {
    grid[gridX][gridY] = 1; // Set the cell to alive
    ageGrid[gridX][gridY] = 0; // Reset the age of the cell
  }
}

function activatePatternAt(gridX, gridY) {
  if (currentPattern === 'single') {
    activateCellAt(gridX, gridY);
  } else if (currentPattern === '2x2') {
    for (let dx = 0; dx < 2; dx++) {
      for (let dy = 0; dy < 2; dy++) {
        activateCellAt(gridX + dx, gridY + dy);
      }
    }
  } else if (currentPattern === '6x6') {
    for (let dx = 0; dx < 6; dx++) {
      for (let dy = 0; dy < 6; dy++) {
        activateCellAt(gridX + dx, gridY + dy);
      }
    }
  }
}

// Use activatePatternAt in mousePressed and mouseDragged
function mousePressed() {
  console.log("Mouse pressed");
  let gridX = floor(mouseX / cellSize);
  let gridY = floor(mouseY / cellSize);
  activatePatternAt(gridX, gridY);
}

function mouseDragged() {
  console.log("Mouse dragged");
  let gridX = floor(mouseX / cellSize);
  let gridY = floor(mouseY / cellSize);
  activatePatternAt(gridX, gridY);
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
