function Sprite() {
  this.x = 0;
  this.y = 0;
  this.vx = 0;
  this.vy = 0;
  this.SIZE = 15;
}

Sprite.prototype.desenhar = function(ctx) {
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
  var pos = map.getIndices(this);
  if (map.cells[pos.l][pos.c] != 0) return;

  if (this.vx > 0 && map.cells[pos.l][pos.c + 1] != 0) {
    var dist = (pos.c + 1) * map.SIZE - (this.x + this.SIZE / 2);
    var mmax = Math.min(dist, this.vx * dt);
    this.x = this.x + mmax;
  } else if (this.vx < 0 && map.cells[pos.l][pos.c - 1] != 0) {
    var dist = (pos.c) * map.SIZE - (this.x - this.SIZE / 2);
    var mmax = Math.max(dist, this.vx * dt);
    this.x = this.x + mmax;
  } else {
    this.x = this.x + this.vx * dt;
  }

  if (this.vy > 0 && map.cells[pos.l + 1][pos.c] != 0) {
    var dist = (pos.l + 1) * map.SIZE - (this.y + this.SIZE / 2);
    var mmax = Math.min(dist, this.vy * dt);
    this.y = this.y + mmax;
  } else if (this.vy < 0 && map.cells[pos.l - 1][pos.c] != 0) {
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
};

Sprite.prototype.colidiuCom = function(alvo){
  if(this.y+(this.SIZE/2) < alvo.y) return false;
  if(this.y > alvo.y+(this.SIZE/2)) return false;
  if(this.x+(this.SIZE/2) < alvo.x) return false;
  if(this.x > alvo.x+(this.SIZE/2)) return false;
  return true;
}
