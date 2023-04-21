const canvas = document.querySelector('canvas'); 
const ctx = canvas.getContext("2d"); 

let canva = document.getElementById('canva');
let canvasWidth = window.getComputedStyle(canvas).getPropertyValue("width");
let canvasWidthNum = parseInt(canvasWidth.replace("px", ""));

canvas.width = canvasWidthNum; 
canvas.height = canvas.width; 
let radius=10;
let circles = []; // массив для хранения кругов
let action=0;
const add = document.getElementById('add');
const erase = document.getElementById('delete');
const deleteAll = document.getElementById('deleteAll');
const startK = document.getElementById('startK');
const startI = document.getElementById('startI');
const compare = document.getElementById('compare');
const image = document.getElementById('scheme');


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
    ctx.arc(x, y, r, 0, 2 * Math.PI); 
    ctx.fillStyle = 'black';
    ctx.fill(); 
    let point= new Point(x, y, r);
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

compare.addEventListener('mouseout', function() {
  image.style.display = 'none';
});
compare.addEventListener('mouseover', function() {
  image.style.display = 'block';
});

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

  canvas.addEventListener('click', function(event) { 
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

startK.addEventListener('click', function () {
  let k=document.getElementById("sizeK").value;
  if(circles.length==0){
    alert("You are cringe, добавь точки 🥺");
  }
  else if(circles.length<k){
    alert("Сringe, что ты хочешь?..");
  }
  else{
  let clusters = kMeans(circles,k); // сохраняем результат выполнения функции kMeans в переменную
  for (const cluster of clusters) { // проходим по всем кластерам
    ctx.fillStyle = cluster.color; // устанавливаем цвет заливки контекста рисования из свойства color каждого кластера
    for (const point of cluster.points) { // проходим по всем точкам в данном кластере
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI);
      ctx.fill();
    }
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
  return clusters;
}

function HierarchicalClustering(circles,k){
  let clusters = [];
  for (let i = 0; i < circles.length; i++) { // создаем начальные кластеры, состоящие из одного круга 
    const cluster = [circles[i]]; 
    clusters.push(cluster); 
  } 
  while (clusters.length > k) { // пока не достигнут нужный размер кластера 
    let minDistance = Infinity; // минимальное расстояние между кластерами 
    let indexA, indexB; // индексы кластеров, которые нужно объединить 
    for (let i = 0; i < clusters.length; i++) { 
      for (let j = i+1; j < clusters.length; j++) { 
        const distanceBetweenClusters = getDistanceBetweenClusters(clusters[i], clusters[j]); // вычисляем расстояние между кластерами 
        if (distanceBetweenClusters < minDistance) { // если расстояние меньше текущего минимального 
          minDistance = distanceBetweenClusters; // обновляем минимальное расстояние 
          indexA = i; // запоминаем индексы кластеров 
          indexB = j; 
        } 
      } 
    } 
    const newCluster = clusters[indexA].concat(clusters[indexB]); // создаем новый кластер, объединяя два ближайших 
    clusters.splice(indexB, 1); // удаляем старые кластеры 
    clusters.splice(indexA, 1); 
    clusters.push(newCluster); // добавляем новый кластер в массив 
  } 
  return clusters;
}

startI.addEventListener('click', function () {
  let k=document.getElementById("sizeK").value;
  if(circles.length==0){
    alert("You are cringe, добавь точки 🥺");
  }
  else if(circles.length<k){
    alert("Сringe, что ты хочешь?..");
  }
  else{
    let clusters = HierarchicalClustering(circles,k);
    
    for (let i = 0; i < clusters.length; i++) { // окрашиваем круги в цвета соответствующих кластеров 
      const color = getRandomColor(); 
      for (let j = 0; j < clusters[i].length; j++) { 
        const circle = clusters[i][j]; 
        ctx.beginPath();    
        ctx.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI);    
        ctx.fillStyle = color;   
        ctx.fill();    
      }  
    } 
  }; 
});

  function getDistanceBetweenClusters(clusterA, clusterB) { // функция для вычисления расстояния между кластерами 
    let minDistance = Infinity; 
    for (let i = 0; i < clusterA.length; i++) { 
      for (let j = 0; j < clusterB.length; j++) { 
        const distanceBetweenPoints = distance(clusterA[i], clusterB[j]); // вычисляем расстояние между точками 
        if (distanceBetweenPoints < minDistance) { // если расстояние меньше текущего минимального 
          minDistance = distanceBetweenPoints; // обновляем минимальное расстояние 
        } 
      } 
    } 
    return minDistance; 
  }

  compare.addEventListener('click', function () {
    let k=document.getElementById("sizeK").value;
    if(circles.length==0){
      alert("You are cringe, добавь точки 🥺");
    }
    else if(circles.length<k){
      alert("Сringe, что ты хочешь?..");
    }
    else{
      let clusters1 = HierarchicalClustering(circles,k);
      let clusters2 = kMeans(circles,k);
      for (const cluster of clusters2) { // проходим по всем кластерам
        ctx.fillStyle = cluster.color; // устанавливаем цвет заливки контекста рисования из свойства color каждого кластера
        for (const point of cluster.points) { // проходим по всем точкам в данном кластере
          ctx.beginPath();
          ctx.arc(point.x, point.y, radius,Math.PI/2, 3*Math.PI/2); 
          ctx.lineTo(point.x, point.y,); // добавляем линию к центру круга
          ctx.closePath(); // закрываем путь
          ctx.fill(); // закрашиваем левую половину круга
        }
      }

      for (let i = 0; i < clusters1.length; i++) { // окрашиваем круги в цвета соответствующих кластеров 
        const color = getRandomColor(); 
        for (let j = 0; j < clusters1[i].length; j++) { 
          const circle = clusters1[i][j]; 
          ctx.beginPath();    
          ctx.arc(circle.x, circle.y, circle.r, 3*Math.PI/2, Math.PI/2);    
          ctx.fillStyle = color;   
          ctx.fill();    
        }  
      } 

    }
  })