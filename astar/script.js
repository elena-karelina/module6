const paddingJS = 5;
const wall_color = "black";
const free_color = "white";
const background = "#1C1C1C";
const tractor_color = "red";
const animation = false;

const tractors_number = 30;
let colums = document.getElementById("sizeM").value;

const delay_timeout = 60;
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
let cell_size = (canvas.width - paddingJS * 2) / colums;
canvas.width = 550;
canvas.height = canvas.width;

let startClicked = false;
let finishClicked = false;
let freeClicked = false;
let wallClicked = false;

let tractors = [];
let matrix = createMatrix(colums, colums);

const mouse = createMouse(canvas);

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

let startCell = new Cell(null, null);
let finishCell = new Cell(null, null);

const start = document.getElementById('start');
const finish = document.getElementById('finish');
const free = document.getElementById('free');
const wall = document.getElementById('wall');

matrix[0][0] = true;


function doSomething() {
  console.log('enter was pressed');
  colums = document.getElementById("sizeM").value;
  matrix = createMatrix(colums, colums);
  startCell = new Cell(null, null);
  finishCell = new Cell(null, null);
  startClicked = false;
  finishClicked = false;
  freeClicked = false;
  wallClicked = false;
  cell_size = (canvas.width - paddingJS * 2) / colums;
  tractors = [];
  for (let i = 0; i < tractors_number; i++) {
    tractors.push({
      x: 0,
      y: 0,
    });
  }
  main();
}

document.addEventListener('DOMContentLoaded', function () {
  doSomething();
});

document.addEventListener('keydown', function (event) {
  if (event.code === 'Enter') {
    doSomething();
  }
});

async function main() {
  while (!isValidMaze()) {
    for (const tractor of tractors) {
      moveTractor(tractor);
    }
    if (animation) {
      drawMaze();
      for (const tractor of tractors) {
        drawCanvas(tractor);
      }
      await delay(delay_timeout);
    }
  }
  if (colums % 2 == 0) {
    even();
  }
  drawMaze();
  requestAnimationFrame(tick);

}

function even() {
  let directions = [];
  for (let i = 0; i < colums; i++) {
    if (matrix[colums - 2][i]) {
      directions.push(i);
    }
    else {
      matrix[colums - 1][getRandomItem(directions)] = true;
      directions = [];
    }
  }
  directions = []
  for (let i = 0; i < colums; i++) {
    if (matrix[i][colums - 2]) {
      directions.push(i);
    }
    if (!matrix[i][colums - 2] || i == colums - 1) {
      matrix[getRandomItem(directions)][colums - 1] = true;
      directions = [];
    }
  }

}

function delay(timeout) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}

function createMatrix(colums, rows) {
  const matrix = [];
  for (let y = 0; y < rows; y++) {
    const row = [];

    for (let x = 0; x < colums; x++) {
      row.push(false);
    }
    matrix.push(row);
  }
  return matrix;
}

function drawMaze() {

  context.beginPath();
  context.rect(0, 0, canvas.width, canvas.height);
  context.fillStyle = background;
  context.fill();
  for (let y = 0; y < colums; y++) {
    for (let x = 0; x < colums; x++) {
      const color = matrix[y][x] ? free_color : wall_color;
      drawCanvas(x, y, color);
    }
  }
  if (startCell.x != null) {
    drawCanvas(startCell.x, startCell.y, 'red');
  }
  if (finishCell.x != null) {
    drawCanvas(finishCell.x, finishCell.y, 'green');
  }

}

function drawCanvas(x, y, color) {
  context.beginPath();
  context.rect(
    paddingJS + x * cell_size,
    paddingJS + y * cell_size,
    cell_size,
    cell_size
  );
  context.fillStyle = color;
  context.fill();
}

function moveTractor(tractor) {
  const directions = [];
  if (tractor.x > 1) {
    directions.push([-2, 0]);
  }
  if (tractor.x < colums - 2) {
    directions.push([2, 0]);
  }
  if (tractor.y > 1) {
    directions.push([0, -2])
  }
  if (tractor.y < colums - 2) {
    directions.push([0, 2]);
  }

  const [dx, dy] = getRandomItem(directions);

  tractor.x += dx;
  tractor.y += dy;

  if (!matrix[tractor.y][tractor.x]) {
    matrix[tractor.y][tractor.x] = true;
    matrix[tractor.y - dy / 2][tractor.x - dx / 2] = true;
  }
}

function getRandomItem(array) {
  const index = Math.floor(Math.random() * array.length);
  return array[index]
}

function isValidMaze() {
  for (let y = 0; y < colums; y += 2) {
    for (let x = 0; x < colums; x += 2) {
      if (!matrix[y][x]) {
        return false;
      }
    }
  }
  return true;
}
function createMouse(element) {
  const mouse = {
    x: 0,
    y: 0,
    left: false,
    pLeft: false,
    over: false,
    update() {
      this.pLeft = this.left;
    },
  };

  element.addEventListener("mouseenter", mouseenterHandler);
  element.addEventListener("mouseleave", mouseleaveHandler);
  element.addEventListener("mousemove", mousemoveHandler);
  element.addEventListener("mousedown", mousedownHandler);
  element.addEventListener("mouseup", mouseupHandler);

  function mouseenterHandler() {
    mouse.over = true;
  }
  function mouseleaveHandler() {
    mouse.over = false;
  }
  function mousemoveHandler(event) {
    const rect = element.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
  }

  function mousedownHandler(event) {
    mouse.left = true;
  }
  function mouseupHandler(event) {
    mouse.left = false;
  }

  return mouse;
}

function tick() {
  start.addEventListener('click', function () {
    startClicked = true;
    finishClicked = false;
    freeClicked = false;
    wallClicked = false;
    canvas.addEventListener('mousedown', function (e) {
      if (startClicked && !finishClicked && !freeClicked && !wallClicked) {
        let cordX, cordY;
        cordX = e.pageX - this.offsetLeft;
        cordY = e.pageY - this.offsetTop;
        let x = Math.trunc(cordX / cell_size);
        let y = Math.trunc(cordY / cell_size);
        if (matrix[y][x] && (finishCell.x != x || finishCell.y != y)) {
          startCell.x = x;
          startCell.y = y;
          drawMaze();
        }
      }
    });

  });

  finish.addEventListener('click', function () {
    startClicked = false;
    finishClicked = true;
    freeClicked = false;
    wallClicked = false;
    canvas.addEventListener('mousedown', function (e) {
      if (!startClicked && finishClicked && !freeClicked && !wallClicked) {
        let cordX, cordY;
        cordX = e.pageX - this.offsetLeft;
        cordY = e.pageY - this.offsetTop;
        let x = Math.trunc(cordX / cell_size);
        let y = Math.trunc(cordY / cell_size);
        if (matrix[y][x] && (startCell.x != x || startCell.y != y)) {
          finishCell.x = x;
          finishCell.y = y;
          drawMaze();
        }
      }

    });
  });

  wall.addEventListener('click', function () {
    startClicked = false;
    finishClicked = false;
    freeClicked = false;
    wallClicked = true;
    canvas.addEventListener('mousedown', function (e) {
      if (!startClicked && !finishClicked && !freeClicked && wallClicked) {
        let cordX, cordY;
        cordX = e.pageX - this.offsetLeft;
        cordY = e.pageY - this.offsetTop;
        let x = Math.trunc(cordX / cell_size);
        let y = Math.trunc(cordY / cell_size);
        if (matrix[y][x]) {
          matrix[y][x]=false;
          drawMaze();
        }
      }

    });
  });

  free.addEventListener('click', function () {
    startClicked = false;
    finishClicked = false;
    freeClicked = true;
    wallClicked = false;
    canvas.addEventListener('mousedown', function (e) {
      if (!startClicked && !finishClicked && freeClicked && !wallClicked) {
        let cordX, cordY;
        cordX = e.pageX - this.offsetLeft;
        cordY = e.pageY - this.offsetTop;
        let x = Math.trunc(cordX / cell_size);
        let y = Math.trunc(cordY / cell_size);
        if (!matrix[y][x]) {
          matrix[y][x]=true;
          drawMaze();
        }
      }

    });
  });

}




