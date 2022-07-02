//BOARD
(function(){ //Se implementa el tablero
    self.Board = function(width, height){
        this.width = width;
        this.height = height;
        this.playing = false;
        this.game_over = false;
        this.bars = [];
        this.ball = null;
        this.scoreA = 0;
        this.scoreB = 0;
    }

    self.Board.prototype = { 
        get elements(){ //Agregar barras y pelota
            var elements = this.bars.map(function(bar){ return bar; }); //paso el arreglo como copia
            elements.push(this.ball);
            return elements;
        },
        resetBall(){
            this.ball.x = 440;
            this.ball.y = 290;
            this.ball.speed = 3;
            this.ball.speed_x = -this.ball.speed_x;
        },
        resetGame: function(){
            this.scoreA = 0;
            this.scoreB = 0;
            this.ball.x = 440;
            this.ball.y = 290;
        },
        stopGame: function(){
            this.playing = !this.playing;
            scoreA.innerHTML = 0;
            scoreB.innerHTML = 0;
            this.scoreA = 0;
            this.scoreB = 0;
        }
    }
})();

//BALL
(function(){ //Se implementa la pelota
    self.Ball = function(x,y,radius,board){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed_y = 0;
        this.speed_x = 3 ;
        this.board = board;
        this.direction = 1;
        this.bounce_angle = 0;
        this.max_bounce_angle = Math.PI / 12; 
        this.speed = 3;

        board.ball = this;
        this.kind = "circle";
    }

    self.Ball.prototype = {
        move: function(){
            this.x += (this.speed_x * this.direction);
            this.y += (this.speed_y);

            //implemento la colision con los bordes
            if(this.y + this.radius > this.board.height || this.y + this.radius <= 20) //si choca con las paredes
                this.speed_y = -this.speed_y;  
        },
        goal: function(){
            if(this.x + this.radius > this.board.width){ //si es punto de A
                setTimeout(() => {this.resetBall();
                }, 1000);
                this.board.scoreA++;
                scoreA.innerHTML = this.board.scoreA;
                if(this.board.scoreA == 5){
                    console.log("gano a");
                }
            }
            if(this.x + this.radius <= 20){ //si es punto de B
                setTimeout(() => {this.resetBall();
                }, 1000);
                this.board.scoreB++;
                scoreB.innerHTML = this.board.scoreB;  
                if(this.board.scoreB == 5){
                    console.log("gano b");
                }                 
            }
        },
        resetBall: function(){
            this.x = 440;
            this.y = 290;
            this.speed_x = -this.speed_x;
        },
        get width(){
            return this.radius * 2;
        },
        get height(){
            return this.radius * 2;
        },
        collision: function(bar){ //reaccion de la pelota a la colision
            var relative_intersect_y = (bar.y + (bar.height / 2)) - this.y;
            var normalized_intersect_y = relative_intersect_y / (bar.height / 2);

            this.bounce_angle = normalized_intersect_y * this.max_bounce_angle;

            this.speed_y = this.speed * -Math.sin(this.bounce_angle);
            this.speed_x = this.speed * Math.cos(this.bounce_angle);

            if(this.x > (this.board.width / 2))
                this.direction = -1;
            else
                this.direction = 1;
        }
    }
})();

//BAR
(function(){ //Se implemnenta la barra de juego
    self.Bar = function(x,y,width,height,board){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.board = board;
        this.board.bars.push(this);
        this.kind = "rectangle";
        this.speed = 20;
    }

    self.Bar.prototype = { //funciones de las barras
        down: function(){
            if(this.y  + this.height < this.board.height)
                this.y += this.speed;
        },
        up: function(){
           if(this.y > 0)
                this.y -= this.speed;
        },
        toString: function(){
            return "x: " + this.x + " y: " + this.y;
        }
    }
})();

//BOARD VIEW
(function(){ //Se implementa la vista del tablero
    self.BoardView = function(canvas, board){
        this.canvas = canvas;
        this.canvas.width = board.width;
        this.canvas.height = board.height;
        this.board = board;
        this.ctx = canvas.getContext("2d");
    }

    self.BoardView.prototype = { //funciones de tablero
        clean: function(){ //Limpiar tablero
            this.ctx.clearRect(0,0,this.board.width,this.board.width);
        },
        draw: function(){ //Dibuja el tablero
            for(var i = this.board.elements.length - 1; i >= 0; i--){
                var el = this.board.elements[i];
                draw(this.ctx, el);
            };
        },
        check_collisions: function(){
            if(this.board.ball.x + this.board.ball.radius > this.board.width){ //si es punto de A
                this.board.scoreA++;
                scoreA.innerHTML = this.board.scoreA;
                swal({
                    title: "PUNTO DEL JUGADOR 1",
                    timer: 1000,
                    button: false,
                  });
                this.board.ball.resetBall(); 
                if(this.board.scoreA == 5){
                    this.board.stopGame();
                    swal({
                        title: "FELICITACIONES JUGADOR 1 GANASTE!",
                        timer: 2000,
                        button: false,
                      });
                }
            }
            if(this.board.ball.x + this.board.ball.radius <= 20){ //si es punto de B
                this.board.scoreB++;
                scoreB.innerHTML = this.board.scoreB;
                swal({
                    title: "PUNTO DEL JUGADOR 2",
                    timer: 1000,
                    button: false,
                  });
                  this.board.ball.resetBall();
                if(this.board.scoreB == 5){
                    this.board.stopGame();
                    swal({
                        title: "FELICITACIONES JUGADOR 2 GANASTE!",
                        timer: 2000,
                        button: false,
                      });
                }                 
            }

            for(var i = this.board.bars.length - 1; i >= 0; i--){
                var bar = this.board.bars[i];
                if(hit(bar, this.board.ball))
                    this.board.ball.collision(bar);
            }
            
        },
        play: function(){
            if(this.board.playing){
                this.clean();
                this.draw();
                this.check_collisions();
                this.board.ball.move();
            }
        }
    }

    function hit(a, b){//revisa si a colisiona con b
        var hit = false;

        if(b.x + b.width >= a.x && b.x < a.x + a.width){ //colision horizontal
            if(b.y + b.height >= a.y && b.y < a.y + a.height) //colision vertical
                hit = true;
        }

        if(b.x <= a.x && b.x + b.width >= a.x + a.width){ //colision de a con b
            if(b.y <= a.y && b.y + b.height >= a.y + a.height)
                hit = true;
        }

        if(a.x <= b.x && a.x + a.width >= b.x + b.width){ //colision de b con a
            if(a.y <= b.y && a.y + a.height >= b.y + b.height)
                hit = true;
        }
        return hit;
    }

    function draw(ctx, element){ //Dibuja elemento segun el caso
        switch(element.kind){
            case "rectangle":
                ctx.fillStyle = "#FFF"
                ctx.fillRect(element.x, element.y, element.width, element.height);
                break;
            case "circle":
                ctx.fillStyle = "#FF5F00"
                ctx.beginPath();
                ctx.arc(element.x,element.y,element.radius,0,7);
                ctx.fill();
                ctx.closePath();
                break;
            }
    }
})();

var board = new Board(900,600);
var bar = new Bar(20,225,30,150,board);
var bar2 = new Bar(850,225,30,150,board);
var canvas = document.getElementById("canvas");
var scoreA = document.getElementById("scoreA");
var scoreB = document.getElementById("scoreB");
var board_view = new BoardView(canvas, board);
var ball = new Ball(440, 290, 13, board);

document.addEventListener("keydown", function(ev) {
    if(ev.keyCode == 38){//flecha arriba
        ev.preventDefault();
        bar.up();
    }
    else if(ev.keyCode == 40){//flecha abajo
        ev.preventDefault();
        bar.down();
    }
    else if(ev.keyCode == 87){//w
        ev.preventDefault();
        bar2.up();
    }
    else if (ev.keyCode == 83){//s
        ev.preventDefault();
        bar2.down();
    }
    else if(ev.keyCode == 32){//espacio
        ev.preventDefault();
        board.playing = !board.playing;
    }
});

board_view.draw();

window.requestAnimationFrame(controller);

function controller(){ //Se inicia un juego    
    board_view.play();
    window.requestAnimationFrame(controller);
}