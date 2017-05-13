function Map(l, c) {
  this.SIZE = 40;
  this.cells = [];
  this.enemies = [];
  this.tiros = [];

  for (var i = 0; i < l; i++) {
    this.cells[i] = [];
    for (var j = 0; j < c; j++) {
      this.cells[i][j] = 0;
    }
  }
}

Map.prototype.desenhar = function(ctx) {
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
        case 2:
          ctx.fillStyle = 'gold';
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
  this.desenharTiros(ctx);
};

Map.prototype.loadMap = function(map) {
  for (var i = 0; i < this.cells.length; i++) {
    for (var j = 0; j < this.cells[i].length; j++) {
      switch (map[i][j]) {
        case 0:
        case 1:
        case 2:
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
    tiro.x = x;
    tiro.y = y;
    tiro.SIZE=5;
    switch (dir) {
      case 1:
        tiro.vx = -200;
        tiro.vy = 0;
      break;
      case 2:
        tiro.vy = -200;
        tiro.vx = 0;
      break;
      case 3:
        tiro.vx = +200;
        tiro.vy = 0;
      break;
      case 4:
        tiro.vy = +200;
        tiro.vx = 0;
      break;
    }
    this.tiros.push(tiro);
}

Map.prototype.desenharTiros = function(ctx) {
  for (var i = 0; i < this.tiros.length; i++) {
    this.tiros[i].desenhar(ctx);
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
  for (var i = 0; i < this.enemies.length; i++) {
    for (var j = this.tiros.length-1; j>=0; j--) {
      if(this.tiros[j].colidiuCom(this.enemies[i])){
        this.tiros[j].destroyed = true;
        this.enemies[i].destroyed = true;
        this.delete();
      }
    }
  }
  for (var j = this.tiros.length-1; j>=0; j--) {
    if (map.cells[Math.floor(this.tiros[j].y/40)][Math.floor(this.tiros[j].x/40)] == 1){
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
