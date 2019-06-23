const tilesize = 20; //should divide into height and width

var grid = []

var canvas = $('#game')[0];
var ctx = canvas.getContext("2d")
var h = canvas.height;
var w = canvas.width;
var cX = canvas.width / tilesize; 
var cY = canvas.height / tilesize;

//thanks js
Number.prototype.mod = function(n) {
  return ((this%n)+n)%n;
};


surrounded = function(tiles, x, y) {
  return (x == tiles.length - 1 ? true : tiles[x+1][y]) && 
         (y == tiles[0].length - 1 ? true : tiles[x][y+1]) && 
         (x == 0 ? true : tiles[x-1][y]) && 
         (y == 0 ? true : tiles[x][y-1])
} 

function validate(g, x, y) {
  var adj = 0;
  for(i = -1; i <= 1; i++) {
    for(j = -1; j <= 1; j++) {
      if(i==0 && j==0) continue;
      adj += g[(x+i).mod(cX)][(y+j).mod(cY)];
    }
  }
  if(!g[x][y]) return adj == 3
  return 2 <= adj && adj <= 3;

}

function drawGrid() {
  for(x = 0; x <= w; x += tilesize) {
    if(x < w) {
      grid.push(new Array(h/tilesize).fill(0));
    }
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
  }
  for(y = 0; y <= h; y += tilesize) {
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
  }
  ctx.strokeStyle = "black";
  ctx.stroke();
}

function drawLife() {
  for (x = 0; x < w / tilesize; x += 1) {
    for (y = 0; y < h / tilesize; y += 1) {
      if (grid[x][y]) {
        ctx.beginPath();
        ctx.rect(x * tilesize + 0.5, y * tilesize + 0.5, tilesize - 1, tilesize - 1);
        ctx.fillStyle = "#FF0000";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}


function iterate() {
  var newGrid = $.extend(true, [], grid);
  for (x = 0; x < w / tilesize; x += 1) {
    for (y = 0; y < h / tilesize; y += 1) {
      newGrid[x][y] = +validate(grid, x, y)
    }
  }
  grid = $.extend(true, [], newGrid);
  draw();
}

function draw() {
  ctx.clearRect(0, 0, w, h);
  drawGrid();
  drawLife();  
}

drawGrid();

$('#game').click(function(e) {

  var rect = canvas.getBoundingClientRect();
  
  var x2 = Math.floor((e.clientX - rect.left) / tilesize);
  var y2 = Math.floor((e.clientY - rect.top) / tilesize);
  
  if(grid[x2][y2]) return;
  grid[x2][y2] = 1;
  draw();
});

$('body').keyup(function(e){
   if(e.keyCode == 32){
       // user has pressed space
       iterate();
   }
});
