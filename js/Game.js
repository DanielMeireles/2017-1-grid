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
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 9, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 9, 0, 0, 0, 0, 0, 9, 0, 1],
    [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 9, 1, 9, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1]
  ]);
  imglib = new ImageLoader();
  imglib.load("pc", "img/pc.png");
  imglib.load("piso", "img/floor.png");
  imglib.load("explosao", "img/explosion.png");
  imglib.load("inimigo1", "img/enemies1.png")
  imglib.load("inimigo2", "img/enemies2.png")
  imglib.load("inimigo3", "img/enemies3.png")
  imglib.load("inimigo4", "img/enemies4.png")
  imglib.load("inimigo5", "img/enemies5.png")
  imglib.load("inimigo6", "img/enemies6.png")
  imglib.load("inimigo7", "img/enemies7.png")
  imglib.load("inimigo8", "img/enemies8.png")
  imglib.load("inimigo9", "img/enemies9.png")
  imglib.load("inimigo10", "img/enemies10.png")
  mapa = new Map(12, 15);
  mapa.imageLib = imglib;
  mapa.loadMap(casasMapa);
  pc = new Sprite();
  pc.imageLib = imglib;
  pc.x = 50;
  pc.y = 50;
  pc.dir = 1;
  explosao = new Sprite();
  explosao.tempo = 0;
  configuraControles();

  requestAnimationFrame(passo);
}

function passo(t) {
  dt = (t - antes) / 1000;
  ctx.clearRect(0, 0, tela.width, tela.height);
  requestAnimationFrame(passo);
  if (vidas == 0 || level > 10){
    telas();
    informacoes(ctx);
  }else{
  mapa.persegue(pc);
  mapa.testarColisao(pc);
  mapa.testarColisaoEspadas(mapa);
  pc.moverOnMap(mapa, dt);
  mapa.moverInimigosOnMap(mapa, dt);
  mapa.desenhar(ctx);
  pc.desenhar(ctx);
  mapa.alteraLevel(mapa, ctx);
  tempo = tempo - dt;
  tempoRestante = tempoRestante - dt;
  informacoes(ctx);
  antes = t;
}
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
        mapa.espada(pc.x, pc.y);
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
  ctx.fillRect (0, 384, 480, 90);
  ctx.fillStyle = "grey";
  ctx.fillRect (0, 388, 480, 19);
  ctx.fillStyle = "hsl("+energia/476*120+",100%,50%)";
  ctx.fillRect (2, 390, energia, 15);
  ctx.textAlign="center";
  ctx.fillStyle = "black";
  ctx.font = "1em Arial Black";
  ctx.fillText("ENERGIA", 241, 403);
  ctx.textAlign="left";
  ctx.fillStyle = "white";
  ctx.fillText("Level: "+ level, 2, 425);
  ctx.fillText("Vidas: "+ vidas, 2, 445);
  ctx.fillText("Inimigos Mortos: "+ inimigosMortos, 2, 465);
  ctx.textAlign="right";
  ctx.fillText("Score: "+ score, 476, 445);
  ctx.fillText("Score Total: "+ scoreTotal, 476, 465);
  ctx.fillStyle = "hsl("+tempoRestante/60*120+",100%,50%)";
  ctx.fillText("Tempo Restante: "+ tempoRestante.toFixed(), 476, 425);
}
function telas(){
  if (vidas == 0){
    ctx.fillStyle = "black";
    ctx.fillRect (0, 0, 480, 400);
    var texto1 = "GAME OVER";
    var texto2 = "VOCÊ PERDEU TODAS AS VIDAS"
    textoFormatado(texto1 ,texto2, "", "");
  } else if (level > 10){
    ctx.fillStyle = "black";
    ctx.fillRect (0, 0, 480, 400);
    var texto1 = "PARÁBENS";
    var texto2 = "VOCÊ PASSOU POR TODOS OS NÍVEIS"
    textoFormatado(texto1 ,texto2, "", "");
  }
}

function textoFormatado(texto1, texto2, texto3, texto4){
  ctx.textAlign="center";
  ctx.fillStyle = "red";
  ctx.font = "3em Arial Black";
  ctx.fillText(texto1, tela.width / 2, tela.height / 2);
  ctx.fillStyle = "white";
  ctx.font = "1em Arial Black";
  ctx.fillText(texto2, tela.width / 2, tela.height / 2 + 20);
  ctx.fillText(texto3, tela.width / 2, tela.height / 2 + 40);
  ctx.fillText(texto4, tela.width / 2, tela.height / 2 + 60);
}
