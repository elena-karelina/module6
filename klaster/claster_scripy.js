console.log(1); 
const canvas = document.querySelector('canvas'); 
const ctx = canvas.getContext("2d"); 
canvas.width = 550; 
canvas.height = 550; 
let radius=10;
let circles = []; // массив для хранения кругов
let action=0;
let k=2;
const add = document.getElementById('add');
const erase = document.getElementById('delete');
const deleteAll = document.getElementById('deleteAll');
const start = document.getElementById('start');

class Point {
    constructor(x, y, r) {
      this.x = x;
      this.y = y;
      this.r=r;
    }
  }

ctx.beginPath(); 
ctx.rect(0, 0, canvas.width, canvas.height); 
ctx.fillStyle = 'white'; 
ctx.fill();  

function draw(x, y, r){
    ctx.beginPath(); 
    ctx.arc(x, y, radius, 0, 2 * Math.PI); 
    ctx.fillStyle = 'black';
    ctx.fill(); 
    let point= new Point(x, y, radius);
    circles.push(point); // сохраняем координаты и радиус круга в массиве
  }
  function clear(x, y, r){ 
    for (let i = 0; i < circles.length; i++) { // проходим по всем кругам в массиве 
        const dist = Math.sqrt((x - circles[i].x) ** 2 + (y - circles[i].y) ** 2); // вычисляем расстояние до центра круга 
        if (dist <= circles[i].r) { // если клик попал внутрь круга 
            ctx.beginPath(); 
            ctx.rect(0, 0, canvas.width, canvas.height); 
            ctx.fillStyle = 'white'; 
            ctx.fill(); 
            circles.splice(i, 1); // удаляем круг из массива 
            for (let j = 0; j < circles.length; j++) { // перерисовываем оставшиеся круги 
                ctx.beginPath();   
                ctx.arc(circles[j].x, circles[j].y, circles[j].r, 0, 2 * Math.PI);   
                ctx.fillStyle = 'black';  
                ctx.fill();   
            } 
            break; // выходим из цикла, чтобы удалить только один круг 
        } 
    } 
}

add.addEventListener('click', function () {
    action=1;
  });

erase.addEventListener('click', function () {
    action=2;
  });
deleteAll.addEventListener('click', function () {
    action=0;
    circles = [];
    ctx.beginPath(); 
    ctx.rect(0, 0, canvas.width, canvas.height); 
    ctx.fillStyle = 'white'; 
    ctx.fill();
  });

  canvas.addEventListener('mousedown', function(event) {  
    if (action == 1) { 
        const x = event.clientX - canvas.offsetLeft;  
        const y = event.clientY - canvas.offsetTop;  
        draw(x,y,radius); 
    } 
    else if (action == 2) {
        const x = event.clientX - canvas.offsetLeft;
        const y = event.clientY - canvas.offsetTop;
        clear(x,y,radius); 
    }
});


function getRandomColor() { // функция для генерации случайного цвета
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

start.addEventListener('click', function () {
  let clusters = kMeans(circles,k); // сохраняем результат выполнения функции kMeans в переменную
  for (const cluster of clusters) { // проходим по всем кластерам
    ctx.fillStyle = cluster.color; // устанавливаем цвет заливки контекста рисования из свойства color каждого кластера
    for (const point of cluster.points) { // проходим по всем точкам в данном кластере
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
});

function distance(pointA, pointB) {
  const dx = pointA.x - pointB.x;
  const dy = pointA.y - pointB.y;
  return Math.sqrt(dx*dx + dy*dy);
}

function nearestCentroid(point, centroids) {
  let minDist = Infinity;
  let nearest = null;
  for (const centroid of centroids) {
    const dist = distance(point, centroid);
    if (dist < minDist) {
      minDist = dist;
      nearest = centroid;
    }
  }
  return nearest;
}

function getRandomCentroids(k) {
  const centroids = [];
  const canvas = document.querySelector('canvas');
  const width = canvas.width;
  const height = canvas.height;

  for (let i = 0; i < k; i++) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    centroids.push({x, y});
  }

  return centroids;
}

function updateCentroids(clusters) {
  const newCentroids = [];
  for (const cluster of clusters) {
    let sumX = 0;
    let sumY = 0;
    for (const point of cluster.points) {
      sumX += point.x;
      sumY += point.y;
    }
    const centroidX = sumX / cluster.points.length;
    const centroidY = sumY / cluster.points.length;
    newCentroids.push({x: centroidX, y: centroidY});
  }
  return newCentroids;
}

function kMeans(points, k) {
  let centroids = getRandomCentroids(k);
  let clusters = [];
  for (let i = 0; i < k; i++) {
    const color = getRandomColor();
    clusters.push({centroid: centroids[i], points: [], color: color});
  }
  while (true) {
    for (const cluster of clusters) {
      cluster.points = [];
    }
    for (const point of points) {
      const nearest = nearestCentroid(point, centroids);
      for (const cluster of clusters) {
        if (cluster.centroid === nearest) {
          cluster.points.push(point);
          break;
        }
      }
    }
    const newCentroids = updateCentroids(clusters);
    if (centroids.toString() === newCentroids.toString()) {
      break;
    }
    centroids = newCentroids;
  }
  console.log(clusters);
  return clusters;
}
