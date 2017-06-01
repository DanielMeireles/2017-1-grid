function Sprite() {
  this.x = 0;
  this.y = 0;
  this.vx = 0;
  this.vy = 0;
  this.SIZE = 15;
  this.imageLib;
  this.pose = 4;
  this.frame = 0;
  this.poses = [
    //0 - Caminhada para a direita com espada na mão
    {
      key: "pc",
      row: 11,
      col: 0,
      colMax: 7,
      time: 8
    },
    //1 - Caminhada para baixo com espada na mão
    {
      key: "pc",
      row: 10,
      col: 0,
      colMax: 7,
      time: 8
    },
    //2 - Caminhada para a esquerda com espada na mão
    {
      key: "pc",
      row: 9,
      col: 0,
      colMax: 7,
      time: 8
    },
    //3 - Caminhada para cima com espada na mão
    {
      key: "pc",
      row: 8,
      col: 0,
      colMax: 7,
      time: 8
    },
    //4 - Parado para a direita com espada na mão
    {
      key: "pc",
      row: 11,
      col: 0,
      colMax: 0,
      time: 8
    },
    //5 - Parado para baixo com espada na mão
    {
      key: "pc",
      row: 10,
      col: 0,
      colMax: 0,
      time: 8
    },
    //6 - Parado para a esquerda com espada na mão
    {
      key: "pc",
      row: 9,
      col: 0,
      colMax: 0,
      time: 8
    },
    //7 - Parado para cima com espada na mão
    {
      key: "pc",
      row: 8,
      col: 0,
      colMax: 0,
      time: 8
    },
    //8 - Espadada para a direita
    {
      key: "pc",
      row: 15,
      col: 0,
      colMax: 5,
      time: 16
    },
    //9 - Espadada para a esquerda
    {
      key: "pc",
      row: 13,
      col: 0,
      colMax: 5,
      time: 16
    },
    //10 - Espadada para cima
    {
      key: "pc",
      row: 12,
      col: 0,
      colMax: 5,
      time: 16
    },
    //11 - Espadada para baixo
    {
      key: "pc",
      row: 14,
      col: 0,
      colMax: 5,
      time: 16
    },
  ]
}

Sprite.prototype.desenhar = function(ctx) {
  this.desenharPose(ctx);
  if(this.debug) this.desenharLimites(ctx);
}

Sprite.prototype.desenharPose = function(ctx) {
  if (pc.pose == 8 && tempo <= 0){
    pc.pose = 4;
  }else if (pc.pose == 9 && tempo <= 0){
    pc.pose = 6;
  }else if (pc.pose == 10 && tempo <= 0){
    pc.pose = 7;
  }else if (pc.pose == 11 && tempo <= 0){
    pc.pose = 5;
  }
  ctx.fillStyle = "black";
  ctx.globalAlpha = 0.4;
  ctx.beginPath();
  ctx.arc(this.x, this.y+3, this.SIZE/2, 0, 2*Math.PI);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;
  this.imageLib.drawImageTile(ctx,
    this.poses[this.pose].key,
    this.poses[this.pose].row,
    this.poses[this.pose].col + Math.floor(this.frame),
    64,
    this.x - 32, this.y - 53
  );
}

Sprite.prototype.desenharLimites = function(ctx) {
  ctx.fillStyle = "blue";
  ctx.fillRect(
    this.x - this.SIZE / 2,
    this.y - this.SIZE / 2,
    this.SIZE, this.SIZE
  );
  ctx.strokeStyle = "darkgrey";
  ctx.strokeRect(
    this.x - this.SIZE / 2,
    this.y - this.SIZE / 2,
    this.SIZE, this.SIZE
  );
};


Sprite.prototype.mover = function(dt) {
  this.x = this.x + this.vx * dt;
  this.y = this.y + this.vy * dt;
};

Sprite.prototype.moverOnMap = function(map, dt) {
  this.frame += this.poses[this.pose].time * dt;
  if (this.frame > this.poses[this.pose].colMax + 1) {
    this.frame = this.poses[this.pose].col;
  }
  var pos = map.getIndices(this);

  if (this.vx > 0 && map.cells[pos.l][pos.c + 1] == 1) {
    var dist = (pos.c + 1) * map.SIZE - (this.x + this.SIZE / 2);
    var mmax = Math.min(dist, this.vx * dt);
    this.x = this.x + mmax;
  } else if (this.vx < 0 && map.cells[pos.l][pos.c - 1] == 1) {
    var dist = (pos.c) * map.SIZE - (this.x - this.SIZE / 2);
    var mmax = Math.max(dist, this.vx * dt);
    this.x = this.x + mmax;
  } else {
    this.x = this.x + this.vx * dt;
  }

  if (this.vy > 0 && map.cells[pos.l + 1][pos.c] == 1) {
    var dist = (pos.l + 1) * map.SIZE - (this.y + this.SIZE / 2);
    var mmax = Math.min(dist, this.vy * dt);
    this.y = this.y + mmax;
  } else if (this.vy < 0 && map.cells[pos.l - 1][pos.c] == 1) {
    var dist = (pos.l) * map.SIZE - (this.y - this.SIZE / 2);
    var mmax = Math.max(dist, this.vy * dt);
    this.y = this.y + mmax;
  } else {
    this.y = this.y + this.vy * dt;
  }

};


Sprite.prototype.persegue = function(alvo) {
  var dist = Math.sqrt(Math.pow(alvo.x - this.x, 2) + Math.pow(alvo.y - this.y, 2));
  this.vx = 40 * (alvo.x - this.x) / dist;
  this.vy = 40 * (alvo.y - this.y) / dist;
  if (this.vy > 0){
    this.dir = 2;
  } else if (this.vy < 0){
    this.dir = 8;
  } else if (this.vx > 0){
    this.dir = 6;
  } else if (this.vx < 0){
    this.dir = 4;
  }

  if (Math.abs(this.vy) > Math.abs(this.vx)) {
    if (this.vy > 0) {
      this.pose = 1;
    } else {
      this.pose = 3;
    }
  } else {
    if (this.vx > 0) {
      this.pose = 0;
    } else {
      this.pose = 2;
    }
  }
};

Sprite.prototype.colidiuCom = function(alvo){
  if(this.y+(this.SIZE/2) < alvo.y-(alvo.SIZE/2)) return false;
  if(this.y-(this.SIZE/2) > alvo.y+(alvo.SIZE/2)) return false;
  if(this.x+(this.SIZE/2) < alvo.x-(alvo.SIZE/2)) return false;
  if(this.x-(this.SIZE/2) > alvo.x+(alvo.SIZE/2)) return false;
  return true;
}
