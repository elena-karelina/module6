const padding=5;
const wall_color = "black";
const free_color="white";
const background = "#1C1C1C";
const tractor_color="white";
const animation=false;

const tractors_number=6;
const colums = 9;
const rows = colums;

const delay_timeout=250;
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
canvas.width=550;
canvas.height=canvas.width;

const cell_size=(canvas.width-padding*2)/colums;
const matrix = createMatrix(colums,rows);
const tractors=[];

const mouse = createMouse(canvas);
let cell1=null;
let cell2=null;
let potentials=null; 

for (let i=0; i<tractors_number; i++)
{
  tractors.push ({
  x: 0,
  y: 0,
});
}

matrix[0][0]=true;

main();
async function main(){
  while (!isValidMaze()){
    for(const tractor of tractors)
  {
    moveTractor(tractor);
  }
    if (animation)
  {
      drawMaze(); 
      for(const tractor of tractors)
  {
        drawTractor(tractor);
  }
      await delay(delay_timeout);
  }
  }
    if (colums%2==0){
      even();
  }
  drawMaze(); 
  requestAnimationFrame(tick);
}

function even()
{
  let directions=[];
    for (let i=0; i<colums; i++)
    {
      if (matrix[colums-2][i])
      {
        directions.push(i);
      }
      else{
        matrix[colums-1][ getRandomItem(directions)]=true;
        directions=[];
      }
    }
    directions=[]
    for (let i=0; i<colums; i++)
    {
      if (matrix[i][colums-2])
      {
        directions.push(i);
      }
      else{
        matrix[ getRandomItem(directions)][colums-1]=true;
        directions=[];
      }
    }

}

function delay(timeout){
  return new Promise((resolve)=>setTimeout(resolve, timeout));
}

function createMatrix(colums, rows){
  const matrix = [];
  for (let y=0; y<rows; y++){
    const row = [];

    for (let x=0; x<colums; x++){
      row.push(false);
    }
    matrix.push(row);
  }
  return matrix;
}

function drawMaze(){
  
  context.beginPath();
  context.rect(0,0,canvas.width, canvas.height);
  context.fillStyle=background;
  context.fill();
    for( let y=0; y<colums; y++)
    {
        for (let x=0; x<rows; x++)
        {
            const color=matrix[y][x]? free_color: wall_color;
            context.beginPath();
            context.rect(
                padding+x*cell_size,
                padding+y*cell_size,
                cell_size,
                cell_size
            );
            context.fillStyle=color;
            context.fill();
        }
    }

}

function drawTractor(tractor){
  context.beginPath();
  context.rect(
      padding+tractor.x*cell_size,
      padding+tractor.y*cell_size,
      cell_size,
      cell_size
  );
  context.fillStyle=tractor_color;
  context.fill();
}

function moveTractor(tractor){
    const directions=[];
    if (tractor.x>1){
        directions.push([-2, 0]);
    }
    if (tractor.x<colums-2 ){
        directions.push([2, 0]);
    }
    if (tractor.y>1){
        directions.push([0, -2])
    }
    if (tractor.y<rows-2 ){
        directions.push([0,2]);
    }
    
    const [dx, dy] = getRandomItem(directions);

    tractor.x+=dx;
    tractor.y+=dy;

    if(!matrix[tractor.y][tractor.x]){
      matrix[tractor.y][tractor.x]=true;
      matrix[tractor.y-dy/2][tractor.x-dx/2]=true;        
      }
}

function getRandomItem (array){
const index= Math.floor(Math.random()*array.length);
return array[index]
}

function isValidMaze()
{
  for ( let y=0; y<colums; y+=2){
    for (let x=0; x<rows; x+=2){
      if (!matrix[y][x]){
        return false;
      }
    }
  }
  return true;
}
function createMouse (element) {  
  const mouse={  
    x:0,  
    y:0,  
    left: false,
    pLeft: false,
    over: false, 
    update(){
      this.pLeft=this.left;
    } ,
  };  
  
  element.addEventListener("mouseenter", mouseenterHandler);  
  element.addEventListener("mouseleave", mouseleaveHandler);  
  element.addEventListener("mousemove", mousemoveHandler); 
  element.addEventListener("mousedown", mousedownHandler); 
  element.addEventListener("mouseup",mouseupHandler);  
  
  function mouseenterHandler(){  
    mouse.over=true;  
  }  
  function mouseleaveHandler(){  
    mouse.over=false;  
  }  
  function mousemoveHandler(event){  
    const rect = element.getBoundingClientRect();  
    mouse.x=event.clientX-rect.left;
    mouse.y=event.clientY-rect.top;
  } 

  function mousedownHandler(event){  
    mouse.left=true;
  }  
  function mouseupHandler(event){  
    mouse.left=false;
  }  
  
  return mouse;  
}

function tick(){
  requestAnimationFrame(tick);
  if(mouse.x<padding||
    mouse.y<padding||
    mouse.x>canvas.width-padding||
    mouse.y>canvas.height-padding)
    {
      return;
    }
  const x= Math.floor((mouse.x - padding)/cell_size);
  const y= Math.floor((mouse.y - padding)/cell_size);
  if(mouse.left && !mouse.pLeft&&matrix[y][x]){ //по нажатию задавать новые селл
    if (!cell1 || cell1[0]!==x || cell1[1]!==y)
    {
    cell2=cell1;
    cell1=[x, y];
    }
    if (cell1&&cell2){
      potentials=getPotentialMatrix(matrix, cell1, cell2);
    }
  }
  if (potentials){
    for (let y=0; y<colums; y++){
      for (let x=0; x<rows; x++){
      if (potentials[y][x]===null || potentials[y][x]===false)
      {
        continue;
      }
      context.fillStyle='red';
      context.font="30px serif";
      context.textAlign='center';
      context.textBaseline='middle';
      context.fillText(potentials[y][x], 
        padding+(x+0.5)*cell_size, 
        padding+(y+0.5)*cell_size)
    }
  }

  }
    mouse.update()
}

function getPotentialMatrix(matrix, [x1, y1], [x2, y2]) {
	const potentials = [];

	for (let y = 0; y < matrix.length; y++) {
		const row = [];

		for (let x = 0; x < matrix[y].length; x++) {
			row.push(null);
		}

		potentials.push(row);
	}

	for (let y = 0; y < matrix.length; y++) {
		for (let x = 0; x < matrix[y].length; x++) {
			if (matrix[y][x] === false) {
				potentials[y][x] = false;
			}
		}
	}

	potentials[y2][x2] = 0;

	while (potentials[y1][x1] === null) {
		for (let y = 0; y < matrix.length; y++) {
			for (let x = 0; x < matrix[y].length; x++) {
				if (potentials[y][x] === false || potentials[y][x] === null) {
					continue;
				}

				const number = potentials[y][x] + 1;

				if (y > 0 && potentials[y - 1][x] !== false) {
					if (potentials[y - 1][x] === null) {
						potentials[y - 1][x] = number;
					} else {
						potentials[y - 1][x] = Math.min(potentials[y - 1][x], number);
					}
				}

				if (y < matrix.length - 1 && potentials[y + 1][x] !== false) {
					if (potentials[y + 1][x] === null) {
						potentials[y + 1][x] = number;
					} else {
						potentials[y + 1][x] = Math.min(potentials[y + 1][x], number);
					}
				}

				if (x > 0 && potentials[y][x - 1] !== false) {
					if (potentials[y][x - 1] === null) {
						potentials[y][x - 1] = number;
					} else {
						potentials[y][x - 1] = Math.min(potentials[y][x - 1], number);
					}
				}

				if (x < matrix[0].length - 1 && potentials[y][x + 1] !== false) {
					if (potentials[y][x + 1] === null) {
						potentials[y][x + 1] = number;
					} else {
						potentials[y][x + 1] = Math.min(potentials[y][x + 1], number);
					}
				}
			}
		}
	}

	return potentials;
}


