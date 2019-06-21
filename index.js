const tilesize = 20; //should divide into height and width

var grid = []

var canvas = $('#game')[0];
var ctx = canvas.getContext("2d")
var h = canvas.height;
var w = canvas.width;


surrounded = function(tiles, x, y) {
  return (x == tiles.length - 1 ? true : tiles[x+1][y]) && 
         (y == tiles[0].length - 1 ? true : tiles[x][y+1]) && 
         (x == 0 ? true : tiles[x-1][y]) && 
         (y == 0 ? true : tiles[x][y-1])
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

function iterate(rule) {
  var newGrid = $.extend(true, [], grid);
  for (x = 0; x < w / tilesize; x += 1) {
    for (y = 0; y < h / tilesize; y += 1) {
      if(grid[x][y]) {
        if(rule(grid, x, y)) {
          newGrid[x][y] = 0;
        }
      } else {
        if(!rule(grid, x, y) && x != (w / tilesize) - 1) {
          newGrid[x+1][y] = 1;
        }
      }
    }
  }
  grid = $.extend(true, [], newGrid);
	ctx.clearRect(0, 0, w, h);
  drawGrid()
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

drawGrid();

$('#game').click(function(e) {

  var rect = canvas.getBoundingClientRect();
  
  var x2 = Math.floor((e.clientX - rect.left) / tilesize);
  var y2 = Math.floor((e.clientY - rect.top) / tilesize);
  
  if(grid[x2][y2]) return;
  grid[x2][y2] = 1;

  
  iterate(surrounded);

});

$('body').keyup(function(e){
   if(e.keyCode == 32){
       // user has pressed space
       iterate(surrounded);
   }
});
