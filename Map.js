function Map(l, c) {
  this.SIZE = 32;
  this.cells = [];
  this.enemies = [];
  this.tiros = [];
  this.imageLib = null;

  for (var i = 0; i < l; i++) {
    this.cells[i] = [];
    for (var j = 0; j < c; j++) {
      this.cells[i][j] = 0;
    }
  }
}
Map.prototype.desenhar = function(ctx){
  this.desenharLimites(ctx);
  this.desenharTiles(ctx);
  this.desenharTiros(ctx);
}

Map.prototype.desenharLimites = function(ctx) {
  for (var i = 0; i < this.cells.length; i++) {
    var linha = this.cells[i];
    for (var j = 0; j < linha.length; j++) {
      switch (this.cells[i][j]) {
        case 0:
          break;
        case 1:
          ctx.fillStyle = 'brown';
          ctx.strokeStyle = 'chocolate';
          ctx.fillRect(j * this.SIZE, i * this.SIZE, this.SIZE, this.SIZE);
          ctx.lineWidth = 3;
          ctx.strokeRect(j * this.SIZE, i * this.SIZE, this.SIZE, this.SIZE);
          break;
        default:
          ctx.fillStyle = 'red';
          ctx.fillRect(j * this.SIZE, i * this.SIZE, this.SIZE, this.SIZE);
      }
    }
  }
  this.desenharInimigos(ctx);
};

Map.prototype.desenharTiles = function(ctx) {
  for (var i = 0; i < this.cells.length; i++) {
    var linha = this.cells[i];
    for (var j = 0; j < linha.length; j++) {
      switch (this.cells[i][j]) {
        case 0:
          this.imageLib.drawImageTile(ctx, "floor", 3, 1, 32, j*this.SIZE, i*this.SIZE);
          break;
        case 1:
          this.imageLib.drawImageTile(ctx, "floor", 3, 1, 32, j*this.SIZE, i*this.SIZE);
          this.imageLib.drawImageTile(ctx, "mountain", 7, 10, 32, j*this.SIZE, i*this.SIZE);
          break;
        default:
      }
    }
  }
  this.desenharInimigos(ctx);
};

Map.prototype.loadMap = function(map) {
  for (var i = 0; i < this.cells.length; i++) {
    for (var j = 0; j < this.cells[i].length; j++) {
      switch (map[i][j]) {
        case 0:
        case 1:
          this.cells[i][j] = map[i][j];
          break;
        case 9:
          this.cells[i][j] = 0;
          this.criaInimigo(i,j);
        break;
        default:

      }
    }
  }
};

Map.prototype.getIndices = function (sprite) {
   var pos = {};
   pos.c = Math.floor(sprite.x/this.SIZE);
   pos.l = Math.floor(sprite.y/this.SIZE);
   return pos;
};


Map.prototype.criaInimigo = function (l,c) {
  var inimigo = new Sprite();
  inimigo.imageLib = this.imageLib;
  inimigo.x = (c+0.5)*this.SIZE;
  inimigo.y = (l+0.5)*this.SIZE;
  this.enemies.push(inimigo);
};


Map.prototype.desenharInimigos = function(ctx) {
  for (var i = 0; i < this.enemies.length; i++) {
    this.enemies[i].desenhar(ctx);
  }
}

Map.prototype.moverInimigos = function(dt) {
  for (var i = 0; i < this.enemies.length; i++) {
    this.enemies[i].mover(dt);
  }
}

Map.prototype.moverInimigosOnMap = function(map, dt) {
  for (var i = 0; i < this.enemies.length; i++) {
    this.enemies[i].moverOnMap(map,dt);
  }
}

Map.prototype.persegue = function(alvo) {
  for (var i = 0; i < this.enemies.length; i++) {
    this.enemies[i].persegue(alvo);
  }
}

Map.prototype.tiro = function (x, y, dir) {
    var tiro = new Sprite();
    if (pc.pose == 0){
      tiro.x = pc.x+15;
      tiro.y = pc.y;
    } else if (pc.pose == 2){
      tiro.x = pc.x-15;
      tiro.y = pc.y;
    } else if (pc.pose == 3){
      tiro.x = pc.x;
      tiro.y = pc.y-15;
    } else if (pc.pose == 1){
      tiro.x = pc.x;
      tiro.y = pc.y+15;
    }
    tiro.SIZE=5;
    this.tiros.push(tiro);
}

Map.prototype.desenharTiros = function(ctx) {
  for (var i = 0; i < this.tiros.length; i++) {
    this.tiros[i].desenharLimites(ctx);
    this.tiros[i].destroyed = false;
  }
}

Map.prototype.moverTirosOnMap = function(map, dt) {
  for (var i = 0; i < this.tiros.length; i++) {
    this.tiros[i].moverOnMap(map,dt);
  }
}

Map.prototype.moverTiros = function(map, dt) {
  for (var i = 0; i < this.tiros.length; i++) {
    this.tiros[i].mover(dt);
  }
}

Map.prototype.testarColisao = function(alvo){
  for (var i = 0; i < this.enemies.length; i++) {
    if(alvo.colidiuCom(this.enemies[i])){
      this.enemies[i].destroyed = true;
      this.delete();
    }
  }
}

Map.prototype.testarColisaoTiros = function(map){
  for (var i = this.enemies.length-1; i>=0; i--) {
    for (var j = this.tiros.length-1; j>=0; j--) {
      if(this.tiros[j].colidiuCom(this.enemies[i])){
        this.tiros[j].destroyed = true;
        this.enemies[i].destroyed = true;
        break;
      }
    }
  }
  this.delete();
  for (var j = this.tiros.length-1; j>=0; j--) {
    if (map.cells[Math.floor(this.tiros[j].y/32)][Math.floor(this.tiros[j].x/32)] == 1){
      this.tiros[j].destroyed = true;
      this.delete();
    }
  }
}

Map.prototype.delete = function(){
  for (var j = this.tiros.length-1; j>=0; j--) {
    if (this.tiros[j].destroyed == true){
      this.tiros.splice(j,1);
    }
  }
  for (var i = this.enemies.length-1; i>=0; i--) {
    if (this.enemies[i].destroyed == true){
      this.enemies.splice(i,1);
    }
  }
}

Map.prototype.alteraLevel = function(map){
  if (map.cells[Math.floor(pc.y/40)][Math.floor(pc.x/40)] == 2){
    level = level + 1;
    if (level == 1){
      casasMapa=([
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,1,0,0,9,1,0,0,0,0,9,1],
        [1,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
        [1,0,0,9,1,0,0,0,0,0,9,0,0,0,1],
        [1,0,0,0,0,0,0,0,1,0,1,0,0,0,1],
        [1,0,0,0,0,0,1,1,1,0,1,1,0,0,1],
        [1,0,0,0,0,1,1,1,1,1,1,1,1,0,1],
        [1,0,0,0,0,0,9,0,0,0,0,0,9,0,1],
        [1,1,1,1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,1,1,1,1,0,0,0,1,0,1],
        [1,0,9,0,0,0,0,0,0,0,0,9,1,2,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
      ])
    } else if (level == 2){
      casasMapa=([
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,1,0,0,9,1,0,0,0,0,9,1],
        [1,0,0,0,1,0,1,0,1,0,0,0,0,0,1],
        [1,0,0,9,1,0,1,0,0,0,9,0,0,0,1],
        [1,0,0,0,1,0,1,0,1,0,1,0,0,0,1],
        [1,0,0,0,0,0,1,1,1,0,1,1,0,0,1],
        [1,1,0,1,1,1,1,1,1,1,1,1,1,0,1],
        [1,0,0,0,0,0,9,0,0,0,1,0,9,0,1],
        [1,1,1,1,0,0,0,0,0,0,1,0,0,0,1],
        [1,0,0,0,0,1,1,1,1,0,1,0,1,0,1],
        [1,0,9,0,0,0,0,0,0,0,0,9,1,2,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
      ])
    } else if (level == 3){
      casasMapa=([
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,1,0,0,9,1,0,0,0,0,9,1],
        [1,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
        [1,0,0,9,1,0,0,0,0,0,9,0,0,0,1],
        [1,0,0,0,0,0,0,0,1,0,1,0,0,0,1],
        [1,0,0,0,0,0,0,1,1,0,1,1,0,0,1],
        [1,0,0,0,0,1,1,1,1,1,1,1,1,0,1],
        [1,0,0,0,0,0,9,0,0,0,0,0,9,0,1],
        [1,1,1,1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,1,1,1,1,0,0,0,1,1,1],
        [1,0,9,0,0,0,0,0,0,0,0,9,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
      ])
    }
    for (var i = 0; i < this.enemies.length; i++) {
      this.enemies[i].destroyed = true;
      this.delete();
    }
    pc.x = 50;
    pc.y = 50;
    mapa.loadMap(casasMapa);
  }
}
