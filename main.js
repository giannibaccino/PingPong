(function(){ //Se implementa el tablero
    self.Board = function(width, height){
        this.width = width;
        this.height = height;
        this.playing = false;
        this.game_over = false;
        this.bars = [];
        this.ball = null;
    }

    self.Board.prototype = {
        get elements(){
            var elements = this.bars;
            elements.push(this.ball);
            return elements;
        }
    }
})();

(function(){ //Se implemnenta la barra de juego
    self.Bar = function(x,y,width,height,board){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.board = board;
        this.board.bars.push(this);
        this.kind = "rectangle";
        this.speed = 10;
    }

    self.Bar.prototype = {
        down: function(){
            this.y += this.speed;
        },
        up: function(){
            this.y -= this.speed;
        },
        toString: function(){
            return "x: " + this.x + " y: " + this.y;
        }
    }
})();

(function(){ //Se implementa la vista del tablero
    self.BoardView = function(canvas, board){
        this.canvas = canvas;
        this.canvas.width = board.width;
        this.canvas.height = board.height;
        this.board = board;
        this.ctx = canvas.getContext("2d");
    }

    self.BoardView.prototype = {
        draw: function(){ //Dibuja el tablero
            for(var i = this.board.elements.length - 1; i >= 0; i--){
                var el = this.board.elements[i];
                draw(this.ctx, el);
            };
        }
    }

    function draw(ctx, element){
        if(element !== null && element.hasOwnProperty("kind")){
            switch(element.kind){
                case "rectangle":
                    ctx.fillRect(element.x, element.y, element.width, element.height);
                    break
            }
        }
    }
})();

var board = new Board(800,400);
var bar = new Bar(20,140,40,100,board);
var bar2 = new Bar(740,140,40,100,board);
var canvas = document.getElementById("canvas");
var board_view = new BoardView(canvas, board);

document.addEventListener("keydown", function(ev) {
    if(ev.keyCode == 38)
        bar.up();
    else if(ev.keyCode == 40)
        bar.down();
    else if(ev.keyCode == 87)
        bar2.up();
    else if (ev.keyCode == 83)
        bar2.down();

    console.log(bar.toString());
    console.log(bar2.toString());
});

self.addEventListener("load",main);

function main(){ //Se inicia un juego    
    console.log(board);
    board_view.draw();
}