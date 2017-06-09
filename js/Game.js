var tela;
var ctx;
var antes = 0;
var dt = 0;
var mapa;
var pc;
var imglib;
var tempoRestante = 60;
var tempoTime = 0;
var level = 1;
var vidas = 3;
var inimigosMortos = 0;
var score = 0;
var scoreTotal = 0;
var mudaLevel = false;
var auxiliar = 0; //Se 0 está no inicio do jogo, se 1 está pausado, se 2 passou de nível, se 3 está em jogo, se 4 perdeu uma vida, se 5 perdeu uma vida por tempo, se 6 game over, se 7 venceu
var casasMapa = ([
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
function init() {
  tela = document.getElementsByTagName('canvas')[0];
  tela.width = 480;
  tela.height = 480;
  ctx = tela.getContext('2d');
  soundLib = new SoundLoader();
  soundLib.load("aplause", "mp3/aplause.mp3");
  soundLib.load("dying", "mp3/dying.mp3");
  soundLib.load("explosion", "mp3/explosion.mp3");
  soundLib.load("game-over", "mp3/game-over.mp3");
  soundLib.load("punch-off", "mp3/punch-off.mp3");
  soundLib.load("punch-on", "mp3/punch-on.mp3");
  soundLib.load("time", "mp3/time.mp3");
  soundLib.load("Ta-Da", "mp3/Ta-Da.mp3");
  soundLib.load("pc-dying", "mp3/pc-dying.mp3");
  soundLib.load("alarm", "mp3/alarm.mp3");
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
  mapa.cronometro = 0;
  pc = new Sprite();
  pc.imageLib = imglib;
  pc.x = 50;
  pc.y = 50;
  pc.dir = 1;
  pc.energia = tela.width - 4;
  pc.tempo = 0;
  explosao = new Sprite();
  explosao.tempo = 0;
  configuraControles();
  var id = requestAnimationFrame(passo);
}
function passo(t) {
  id = requestAnimationFrame(passo);
  agora = new Date();
  dt = (agora - antes) / 1000;
  ctx.clearRect(0, 0, tela.width, tela.height);
  mapa.persegue(pc);
  mapa.testarColisao(pc);
  mapa.testarColisaoEspadas(mapa);
  pc.moverOnMap(mapa, dt);
  mapa.moverInimigosOnMap(mapa, dt);
  mapa.desenhar(ctx);
  mapa.alteraLevel(mapa, ctx);
  mapa.explosao(mapa, ctx);
  aux();
  telas();
  informacoes(ctx);
  antes = agora;
}
function configuraControles() {
  addEventListener("keydown", function(e) {
    if (pc.tempo <= 0){
    switch (e.keyCode) {
      case 37:
        pc.vx = -100;
        pc.pose = 2;
        pc.dir = 1;
        e.preventDefault();
        break;
      case 38:
        pc.vy = -100;
        //Correção para o PC não ficar deslizando nos movimentos
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
        //Correção para o PC não ficar deslizando nos movimentos
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
        if (auxiliar == 3){
          mapa.espada();
        }
        break;
      case 13:
        if (auxiliar == 0){
          mapa.loadMap(casasMapa);
        }
        if (auxiliar == 0 || auxiliar == 2 || auxiliar == 4 || auxiliar == 5){
          antes = new Date();
          requestAnimationFrame(passo);
          auxiliar = 3;
        }
        if (auxiliar == 6 || auxiliar == 7){
          level = 1;
          vidas = 3;
          score = 0;
          scoreTotal = 0;
          mudaLevel = true;
          auxiliar = 0;
          requestAnimationFrame(passo);
        }
        break;
      case 80:
        if (auxiliar == 3){
          auxiliar = 1;
        } else if (auxiliar == 1){
          antes = new Date();
          requestAnimationFrame(passo);
          auxiliar = 3;
        }
        break;
      default:
    }
}
  });
  addEventListener("keyup", function(e) {
    if (pc.tempo <= 0){
    switch (e.keyCode) {
      case 37:
        pc.vx = 0;
        //Correção para o PC não ficar deslizando nos movimentos
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
        //Correção para o PC não ficar deslizando nos movimentos
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
  ctx.fillStyle = "hsl("+pc.energia/476*120+",100%,50%)";
  ctx.fillRect (2, 390, pc.energia, 15);
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
  if (auxiliar == 0){
    ctx.fillStyle = "black";
    ctx.fillRect (0, 0, 480, 400);
    var texto1 = "BEM VINDO";
    var texto5 = "# As teclas direcionais movimentam o personagem";
    var texto6 = "# A tecla de espaço faz o personagem atacar";
    var texto7 = "# A tecla P pausa o jogo";
    var texto8 = "# Ao matar todos inimigos uma passagem se abrirá ao próximo nível";
    var texto9 = "# A cada inimigo morto são somados 10 pontos no score"
    var texto10 = "# Quando muda de level o tempo restante é somado ao score"
    var texto2 = "Tecle enter para iniciar";
    var texto4 = "Instruções:"
    textoFormatado(texto1, texto2, "", texto4, texto5, texto6, texto7, texto8, texto9, texto10);
  }
  if (auxiliar == 1){
    ctx.fillStyle = "black";
    ctx.fillRect (0, 0, 480, 400);
    var texto1 = "PAUSA";
    var texto2 = "Aperte a tecla P para voltar ao jogo";
    textoFormatado(texto1 ,texto2, "", "", "", "", "", "", "", "");
  }
  if (auxiliar == 2 && level < 11){
    ctx.fillStyle = "black";
    ctx.fillRect (0, 0, 480, 400);
    var texto1 = "PARABÉNS";
    var texto2 = "Você passou de nível";
    var texto3 = "Tecle enter para iniciar o level";
    textoFormatado(texto1 ,texto2, texto3, "", "", "", "", "", "", "");
    soundLib.play("Ta-Da");
  }
  if (auxiliar == 4){
    ctx.fillStyle = "black";
    ctx.fillRect (0, 0, 480, 400);
    var texto1 = "PERDEU";
    var texto2 = "Você apanhou tanto que perdeu uma vida";
    var texto3 = "Tecle enter para voltar ao jogo";
    textoFormatado(texto1 ,texto2, texto3, "", "", "", "", "", "", "");
    soundLib.play("pc-dying");
  }
  if (auxiliar == 5){
    ctx.fillStyle = "black";
    ctx.fillRect (0, 0, 480, 400);
    var texto1 = "PERDEU";
    var texto2 = "Seu tempo acabou";
    var texto3 = "Tecle enter para voltar ao jogo";
    textoFormatado(texto1 ,texto2, texto3, "", "", "", "", "", "", "");
    soundLib.play("alarm");
  }
  if (auxiliar == 6){
    ctx.fillStyle = "black";
    ctx.fillRect (0, 0, 480, 400);
    var texto1 = "GAME OVER";
    var texto2 = "Você perdeu todas as vidas"
    var texto3 = "Tecle enter para reiniciar o jogo"
    textoFormatado(texto1 ,texto2, texto3, "", "", "", "", "", "", "");
    soundLib.play("pc-dying");
    soundLib.play("game-over");
  }
  if (auxiliar == 7){
    ctx.fillStyle = "black";
    ctx.fillRect (0, 0, 480, 400);
    var texto1 = "PARABÉNS";
    var texto2 = "Você passou por todos os níveis"
    var texto3 = "Tecle enter para reiniciar o jogo"
    textoFormatado(texto1 ,texto2, texto3, "", "", "", "", "", "", "");
    soundLib.play("aplause");
  }
}
function textoFormatado(texto1, texto2, texto3, texto4, texto5, texto6, texto7, texto8, texto9, texto10){
  ctx.textAlign="center";
  ctx.fillStyle = "red";
  ctx.font = "3em Arial Black";
  ctx.fillText(texto1, tela.width / 2, tela.height / 2-20);
  ctx.fillStyle = "white";
  ctx.font = "1em Arial Black";
  ctx.fillText(texto2, tela.width / 2, tela.height / 2);
  ctx.fillText(texto3, tela.width / 2, tela.height / 2 + 20);
  ctx.fillText(texto4, tela.width / 2, tela.height / 2 + 40);
  ctx.fillStyle = "white";
  ctx.font = "0.75em Arial Black";
  ctx.fillText(texto5, tela.width / 2, tela.height / 2 + 55);
  ctx.fillText(texto6, tela.width / 2, tela.height / 2 + 70);
  ctx.fillText(texto7, tela.width / 2, tela.height / 2 + 85);
  ctx.fillText(texto8, tela.width / 2, tela.height / 2 + 100);
  ctx.fillText(texto9, tela.width / 2, tela.height / 2 + 115);
  ctx.fillText(texto10, tela.width / 2, tela.height / 2 + 130);
}
function aux(){
  pc.tempo = pc.tempo - dt;
  if (auxiliar == 3){
    tempoRestante = tempoRestante - dt;
  }
  if (Math.floor(tempoRestante) < 10){
    mapa.cronometro = mapa.cronometro - dt;
    if (mapa.cronometro <= 0){
      soundLib.play("time");
      mapa.cronometro = 1.0;
    }
  }
  if (vidas == 0){
    auxiliar = 6;
  }
  if (level == 11){
    auxiliar = 7;
  }
  if (auxiliar == 0 || auxiliar == 1 || auxiliar == 2 || auxiliar == 4 || auxiliar == 5 || auxiliar == 6 || auxiliar == 7){
    cancelAnimationFrame(id);
  }
}
