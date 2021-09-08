
(function () {

    self.Board = function (width, height) {

        //Ancho
        this.width = width;
        //Alto
        this.height = height;
        //Si esta jugando
        this.playing = false;
        //Finalizo el juego
        this.game_over = false;
        //Las barras
        this.bars = [];
        //La pelota
        this.ball = null;
    }

    //Se modifica el prototipo de Board
    self.Board.prototype = {
        //Geter(Seran las barras)
        get elements() {
            var elements = this.bars;
            //Se agrega una pelota
            elements.push(this.ball);
            return elements;
        }
    }
})();

//Se generara Dibuja las barras
(function () {
       self.Bar = function (x, y, width, height, board) {
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
        down: function () {
            this.y += this.speed;

        },
        up: function () {
                this.y -= this.speed;
        },
        toString: function() {
            return "x:" + this.x + "y:" + this.y;

        }
    }
})();

//Esta es la vista en el modelo
(function () {
    self.BoardView = function (canvas, board) {
        this.canvas = canvas;
        this.canvas.width = board.width;
        this.canvas.height = board.height;
        this.board = board;
     this.ctx = canvas.getContext("2d");
    }

    self.BoardView.prototype = {
        draw: function () {
            for (var i = this.board.elements.length - 1; i >= 0; i--) {
                var el = this.board.elements[i];

                draw(this.ctx, el);
            };
        }
    }


  
    function draw(ctx, element) {        
        if (element !== null && element.hasOwnProperty('kind')) {
            switch (element.kind) {
                case "rectangle":
                    ctx.fillRect(element.x, element.y, element.width, element.height);
                    break;
            }
        }
    }
})();


var board = new Board(800, 500);
var bar = new Bar(20, 100, 40, 100, board);
var bar = new Bar(735, 100, 40, 100, board);
var canvas = document.getElementById('canvas');
var board_view = new BoardView(canvas, board);

document.addEventListener("keydown", function(ev) {
    console.log(ev.keyCode);    
    if (ev.keyCode == 38) {
        bar.up();
    } else if (ev.keyCode == 40) {
        bar.down();
    }
});

//Aca esta pendiente de que cargue la pagina cuando carga llama el metodo main
self.addEventListener("load", main);

function main() {

    board_view.draw();
    console.log(board);

}