function Map(l, c) {
  this.SIZE = 32;
  this.cells = [];
  this.enemies = [];
  this.espadas = [];
  this.imageLib = null;
  for (var i = 0; i < l; i++) {
    this.cells[i] = [];
    for (var j = 0; j < c; j++) {
      this.cells[i][j] = 0;
    }
  }
}
Map.prototype.desenhar = function(ctx){
  if (tempoRestante > 0){
    this.desenharLimites(ctx);
    this.desenharTiles(ctx);
    this.desenharEspadas(ctx);
  }else{
    vidas = vidas - 1;
    mudaLevel = true;
    auxiliar = 5;
  }
  if (pc.energia <= 0){
    mudaLevel = true;
    vidas = vidas - 1;
    auxiliar = 4;
  }
}

Map.prototype.desenharLimites = function(ctx) {
  for (var i = 0; i < this.cells.length; i++) {
    var linha = this.cells[i];
    for (var j = 0; j < linha.length; j++) {
      switch (this.cells[i][j]) {
        case 0:
          break;
        case 1:
        case 2:
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
        case 3:
          this.imageLib.drawImageTile(ctx, "piso", 0, level-1, 32, j*this.SIZE, i*this.SIZE);
          break;
        case 1:
        case 2:
          this.imageLib.drawImageTile(ctx, "piso", 0, level-1, 32, j*this.SIZE, i*this.SIZE);
          this.imageLib.drawImageTile(ctx, "piso", 1, level-1, 32, j*this.SIZE, i*this.SIZE);
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
  inimigo.poses = [
    //0 - Caminhada para a direita
    {
      key: "inimigo"+level,
      row: 11,
      col: 0,
      colMax: 7,
      time: 8
    },
    //1 - Caminhada para baixo
    {
      key: "inimigo"+level,
      row: 10,
      col: 0,
      colMax: 7,
      time: 8
    },
    //2 - Caminhada para a esquerda
    {
      key: "inimigo"+level,
      row: 9,
      col: 0,
      colMax: 7,
      time: 8
    },
    //3 - Caminhada para cima
    {
      key: "inimigo"+level,
      row: 8,
      col: 0,
      colMax: 7,
      time: 8
    },
    //4 - Parado para a direita
    {
      key: "inimigo"+level,
      row: 11,
      col: 0,
      colMax: 0,
      time: 8
    },
    //5 - Parado para baixo
    {
      key: "inimigo"+level,
      row: 10,
      col: 0,
      colMax: 0,
      time: 8
    },
    //6 - Parado para a esquerda
    {
      key: "inimigo"+level,
      row: 9,
      col: 0,
      colMax: 0,
      time: 8
    },
    //7 - Parado para cima
    {
      key: "inimigo"+level,
      row: 8,
      col: 0,
      colMax: 0,
      time: 8
    },
    //8 - Soco para cima
    {
      key: "inimigo"+level,
      row: 16,
      col: 0,
      colMax: 12,
      time: 12
    },
    //9 - Soco para a esquerda
    {
      key: "inimigo"+level,
      row: 17,
      col: 0,
      colMax: 12,
      time: 12
    },
    //10 - Soco para baixo
    {
      key: "inimigo"+level,
      row: 18,
      col: 0,
      colMax: 12,
      time: 12
    },
    //11 - Soco para a direita
    {
      key: "inimigo"+level,
      row: 19,
      col: 0,
      colMax: 12,
      time: 12
    },
  ];
  inimigo.imageLib = this.imageLib;
  inimigo.x = (c+0.5)*this.SIZE;
  inimigo.y = (l+0.5)*this.SIZE;
  inimigo.energia = Math.floor(level/2.5);//Quantidade de golpes para matar cada inimigo
  inimigo.dir;
  inimigo.tempoPunch = 0;
  inimigo.ax = 0;
  inimigo.ay = 0;
  this.enemies.push(inimigo);
};


Map.prototype.desenharInimigos = function(ctx) {
  for (var i = 0; i < this.enemies.length; i++) {
    if (this.enemies[i].y < pc.y){
      this.enemies[i].desenhar(ctx);
    }
  }
  pc.desenhar(ctx);
  for (var i = 0; i < this.enemies.length; i++) {
    if (this.enemies[i].y > pc.y){
      this.enemies[i].desenhar(ctx);
    }
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

Map.prototype.espada = function () {
  pc.vx = 0;
  pc.vy = 0;
  if (pc.pose == 0 || pc.pose == 4){
    pc.pose = 8;
  } else if (pc.pose == 2 || pc.pose == 6){
    pc.pose = 9;
  } else if (pc.pose == 1 || pc.pose == 5){
    pc.pose = 11;
  } else if (pc.pose == 3 || pc.pose == 7){
    pc.pose = 10;
  }
  pc.tempo = 0.35;
  if (inimigosMortos == 8){
    soundLib.play("punch-off");
  }
  var espada = new Sprite();
  if (pc.pose == 8){
    espada.x = pc.x+20;
    espada.y = pc.y;
  } else if (pc.pose == 9){
    espada.x = pc.x-20;
    espada.y = pc.y;
  } else if (pc.pose == 10){
    espada.x = pc.x;
    espada.y = pc.y-20;
  } else if (pc.pose == 11){
    espada.x = pc.x;
    espada.y = pc.y+20;
  }
  espada.SIZE=20;
  this.espadas.push(espada);
}

Map.prototype.desenharEspadas = function(ctx) {
  for (var i = 0; i < this.espadas.length; i++) {
    //this.espadas[i].desenharLimites(ctx);
    this.espadas[i].destroyed = false;
    if (pc.tempo < 0){
      this.espadas[i].destroyed = true
    }
  }
}

Map.prototype.testarColisao = function(alvo){
  for (var i = 0; i < this.enemies.length; i++) {
    this.enemies[i].tempoPunch = this.enemies[i].tempoPunch - dt;
    if(alvo.colidiuCom(this.enemies[i])){
      if (this.enemies[i].tempoPunch <= 0){
        pc.energia = pc.energia - dt*200 * Math.ceil(level/2);//Controla o tanto de energia que se perde com cada soco tomado
        soundLib.play("punch-on");
        this.enemies[i].tempoPunch = 1;
      }
      //Gera os inimigos dando socos
      this.enemies[i].vx = 0;
      this.enemies[i].vy = 0;
      this.repelir(this.enemies[i], pc, 10);
      switch (this.enemies[i].pose) {
        case 3:
          this.enemies[i].pose = 8;
          break;
        case 2:
          this.enemies[i].pose = 9;
          break;
        case 1:
          this.enemies[i].pose = 10;
          break;
        case 0:
          this.enemies[i].pose = 11;
          break;
        default:
      }
    }
  }
}

Map.prototype.testarColisaoEspadas = function(map){
  for (var i = this.enemies.length-1; i>=0; i--) {
    for (var j = this.espadas.length-1; j>=0; j--) {
      if(this.espadas[j].colidiuCom(this.enemies[i])){
        this.espadas[j].destroyed = true;
        this.delete();
        this.enemies[i].energia = this.enemies[i].energia - 1;
        soundLib.play("punch-on");
        if (this.enemies[i].energia <= 0){
          this.enemies[i].destroyed = true;
          inimigosMortos = inimigosMortos + 1;
          score = score + 10;
          soundLib.play("dying");
        }
        break;
      } else{
        if (pc.tempo == 0.35){
          soundLib.play("punch-off");
        }
      }
    }
  }
  for (var j = this.espadas.length-1; j>=0; j--) {
    if (map.cells[Math.floor(this.espadas[j].y/32)][Math.floor(this.espadas[j].x/32)] == 1){
      this.espadas[j].destroyed = true;
    }
  }
  this.delete();
}

Map.prototype.delete = function(){
  for (var i = 0; i < this.enemies.length; i++) {
    for (var j = i+1; j < this.enemies.length; j++) {
      this.repelir(this.enemies[i], this.enemies[j], 20);
    }
}
  for (var j = this.espadas.length-1; j>=0; j--) {
    if (this.espadas[j].destroyed == true){
      this.espadas.splice(j,1);
    }
  }
  for (var i = this.enemies.length-1; i>=0; i--) {
    if (this.enemies[i].destroyed == true){
      this.enemies.splice(i,1);
    }
  }
}

Map.prototype.alteraLevel = function(map, ctx){
  for (var i = 0; i < this.cells.length; i++) {
    for (var j = 0; j < this.cells[i].length; j++) {
      if (inimigosMortos > 7 && this.cells[i][j] == 2){
        this.cells[i][j] = 3;
      }
    }
  }

  if (map.cells[Math.floor(pc.y/32)][Math.floor(pc.x/32)] == 3){
    level = level + 1;
    scoreTotal = scoreTotal + Math.floor(tempoRestante);
    auxiliar = 2;
    explosao.tempo = 0;
  }

  if (map.cells[Math.floor(pc.y/32)][Math.floor(pc.x/32)] == 3 || mudaLevel == true){
    if (level % 4 == 1){
      casasMapa=([
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1, 0, 0, 9, 1, 0, 0, 0, 0, 9, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 9, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 9, 0, 0, 0, 0, 0, 9, 0, 1],
        [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1],
        [1, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 9, 1, 9, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1]
      ])
    } else if (level % 4 == 2){
      casasMapa=([
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 1, 0, 1, 0, 0, 9, 1, 0, 0, 0, 0, 9, 1],
        [1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 9, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 9, 1],
        [1, 0, 0, 0, 0, 0, 9, 0, 1, 0, 0, 1, 1, 1, 1],
        [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1],
        [1, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 9, 1, 9, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1]
      ])
    } else if (level % 4 == 3){
      casasMapa=([
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1, 0, 0, 9, 1, 0, 0, 0, 0, 9, 1],
        [1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 9, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1],
        [1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 1, 9, 0, 0, 0, 0, 0, 1, 9, 1],
        [1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1],
        [1, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 9, 1, 9, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1]
      ])
    }else if (level % 4 == 0){
      casasMapa=([
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1, 0, 0, 9, 1, 0, 0, 0, 0, 9, 1],
        [1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 9, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1],
        [1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 1, 9, 0, 1, 0, 0, 0, 1, 9, 1],
        [1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1],
        [1, 0, 9, 0, 0, 0, 0, 0, 1, 0, 0, 9, 1, 9, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1]
      ])
    }
    for (var k = 0; k < this.enemies.length; k++) {
      this.enemies[k].destroyed = true;
    }
    this.delete();
    pc.x = 50;
    pc.y = 50;
    mapa.loadMap(casasMapa);
    inimigosMortos = 0;
    tempoRestante = 60;
    scoreTotal = scoreTotal + score;
    score = 0;
    mudaLevel = false;
    pc.energia = tela.width - 4;
  }
}

Map.prototype.explosao = function(map, ctx){
  if (this.cells[11][13] == 3 && explosao.tempo < 16){
  this.imageLib.drawImageTile(ctx,
    "explosao",
    0,
    Math.floor(explosao.tempo),
    32,
    416, 354
  );
  if (explosao.tempo == 0){
    soundLib.play("explosion");
  }
  explosao.tempo = explosao.tempo + (dt*20);
  }
}

Map.prototype.repelir = function(primeiro, segundo, distRaio){
  var dx = primeiro.x-segundo.x;
  var dy = primeiro.y-segundo.y;
  if (dx ==0 && dy == 0){
    dx=1;
    dy=1;
  }
  var raio = Math.sqrt(
    Math.pow(dx,2)+
    Math.pow(dy,2)
  );
  if(raio>10) return;
  primeiro.ax += 50*dx/(raio*raio);
  primeiro.ay += 50*dy/(raio*raio);
}
