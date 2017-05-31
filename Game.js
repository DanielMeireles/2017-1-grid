var tela;
var ctx;
var antes = 0;
var dt = 0;
var mapa;
var pc;
var imglib;
var tempo = 0;
var tempoRestante = 60;
var level = 1;
var vidas = 3;
var energia = 478;
var inimigosMortos = 0;
var score = 0;
var scoreTotal = 0;
var mudaLevel = false;

function init() {
  tela = document.getElementsByTagName('canvas')[0];
  tela.width = 500;
  tela.height = 480;
  ctx = tela.getContext('2d');
  casasMapa = ([
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 9, 1, 0, 0, 0, 0, 9, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 9, 1, 0, 0, 0, 0, 0, 9, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 9, 0, 0, 0, 0, 0, 9, 0, 1],
    [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 9, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1]
  ]);
  imglib = new ImageLoader();
  imglib.load("pc", "pc.png");
  imglib.load("piso", "piso.png");
  imglib.load("inimigo1", "enemies/enemies1.png")
  imglib.load("inimigo2", "enemies/enemies2.png")
  imglib.load("inimigo3", "enemies/enemies3.png")
  imglib.load("inimigo4", "enemies/enemies4.png")
  imglib.load("inimigo5", "enemies/enemies5.png")
  imglib.load("inimigo6", "enemies/enemies6.png")
  imglib.load("inimigo7", "enemies/enemies7.png")
  imglib.load("inimigo8", "enemies/enemies8.png")
  imglib.load("inimigo9", "enemies/enemies9.png")
  imglib.load("inimigo10", "enemies/enemies10.png")
  mapa = new Map(12, 15);
  mapa.imageLib = imglib;
  mapa.loadMap(casasMapa);
  pc = new Sprite();
  pc.imageLib = imglib;
  pc.x = 50;
  pc.y = 50;
  pc.dir = 1;
  configuraControles();

  requestAnimationFrame(passo);
}

function passo(t) {
  dt = (t - antes) / 1000;
  ctx.clearRect(0, 0, tela.width, tela.height);
  requestAnimationFrame(passo);
  mapa.persegue(pc);
  mapa.testarColisao(pc);
  mapa.testarColisaoTiros(mapa);
  pc.moverOnMap(mapa, dt);
  mapa.moverInimigosOnMap(mapa, dt);
  mapa.desenhar(ctx);
  pc.desenhar(ctx);
  mapa.alteraLevel(mapa);
  tempo = tempo - dt;
  tempoRestante = tempoRestante - dt;
  informacoes(ctx);
  antes = t;
}


function configuraControles() {
  addEventListener("keydown", function(e) {
    if (tempo <= 0){
    switch (e.keyCode) {
      case 37:
        pc.vx = -100;
        pc.pose = 2;
        pc.dir = 1;
        e.preventDefault();
        break;
      case 38:
        pc.vy = -100;
        if (pc.vx == 0){
          pc.pose = 3;
        }else if (pc.vx > 0){
          pc.pose = 0;
        }else if (pc.vx < 0){
          pc.pose = 2;
        }
        pc.dir = 2;
        e.preventDefault();
        break;
      case 39:
        pc.vx = +100;
        pc.pose = 0;
        pc.dir = 3;
        e.preventDefault();
        break;
      case 40:
        pc.vy = +100;
        if (pc.vx == 0){
          pc.pose = 1;
        }else if (pc.vx > 0){
          pc.pose = 0;
        } else if (pc.vx < 0){
          pc.pose = 2;
        }
        pc.dir = 4;
        e.preventDefault();
        break;
      case 32:
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
        mapa.tiro(pc.x, pc.y);
        tempo = 0.35;
        break;
      default:
    }
}
  });
  addEventListener("keyup", function(e) {
    if (tempo <= 0){
    switch (e.keyCode) {
      case 37:
        pc.vx = 0;
        if (pc.vy == 0){
          pc.pose = 6;
        }else if (pc.vy > 0){
          pc.pose = 1;
        }else if (pc.vy < 0){
          pc.pose = 3;
        }
        e.preventDefault();
        break;
      case 39:
        pc.vx = 0;
        if (pc.vy == 0){
          pc.pose = 4;
        }else if (pc.vy > 0){
          pc.pose = 1;
        }else if (pc.vy < 0){
          pc.pose = 3;
        }
        e.preventDefault();
        break;
      case 38:
        pc.vy = 0;
        if (pc.vx == 0){
          pc.pose = 7;
        }
        e.preventDefault();
        break;
      case 40:
        pc.vy = 0;
        if (pc.vx == 0){
          pc.pose = 5;
        }
        e.preventDefault();
        break;
      default:
    }
  }
  });
}

function informacoes(ctx){
  ctx.fillStyle = "black";
  ctx.fillRect (0, 388, 482, 90);
  ctx.fillStyle = "grey";
  ctx.fillRect (0, 388, 482, 19);
  ctx.fillStyle = "hsl("+energia/480*120+",100%,50%)";
  ctx.fillRect (2, 390, energia, 15);
  ctx.textAlign="center";
  ctx.fillStyle = "black";
  ctx.font = "1em Arial Black";
  ctx.fillText("ENERGIA", 241, 403);
  ctx.textAlign="left";
  ctx.fillStyle = "white";
  ctx.fillText("Level: "+ level, 0, 425);
  ctx.fillText("Vidas: "+ vidas, 0, 445);
  ctx.fillText("Inimigos Mortos: "+ inimigosMortos, 0, 465);
  ctx.textAlign="right";
  ctx.fillText("Score: "+ score, 482, 445);
  ctx.fillText("Score Total: "+ scoreTotal, 482, 465);
  ctx.fillStyle = "hsl("+tempoRestante/60*120+",100%,50%)";
  ctx.fillText("Tempo Restante: "+ tempoRestante.toFixed(), 482, 425);
}
