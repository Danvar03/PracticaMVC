//practica javaScript juego ping pon
(function () {
    self.Board = function (width, height, backgroundColor) {
        this.backgroundColor = backgroundColor;
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
    };

    //Se modifica el prototipo de Board
    self.Board.prototype = {
        //Geter(Seran las barras)
        get elements() {
            var elements = this.bars.map(function (bar) {
                 //Se agrega una pelota
                return bar;
            });
            elements.push(this.ball);
            return elements;
        },
    };
})();

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
    };
     //Haremos que la pelota se mueva
    self.Bar.prototype = {
        dow: function () {
            this.y += this.speed;
        },
        up: function () {
            this.y -= this.speed;
        },
        toString: function () {
            return "x: " + this.x + " y: " + this.y;
        },
    };
})();

//Se generara Dibuja las barras
(function () {
    self.Ball = function (x, y, radius, board) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed_y = 0;
        this.speed_x = 3;
        this.board = board;
        this.direction = 1;
        this.bounce_angle = 0;
        this.max_bounce_angle = Math.PI / 12;
        this.speed = 3;

        board.ball = this;
        this.kind = "circle";
    };

    self.Ball.prototype = {
        move: function () {
            this.x += this.speed_x * this.direction;
            this.y += this.speed_y;
        },

        get width() {
            return this.radius * 2;
        },

        get height() {
            return this.radius * 2;
        },
        collision: function (bar) {
            var relative_intersect_y = bar.y + bar.height / 2 - this.y;
            var normalized_intersect_y = relative_intersect_y / (bar.height / 2);
            this.bounce_angle = normalized_intersect_y * this.max_bounce_angle;
            this.speed_y = this.speed * -Math.sin(this.bounce_angle);
            this.speed_x = this.speed * Math.cos(this.bounce_angle);
            if (this.x > this.board.width / 2) this.direction = -1;
            else this.direction = 1;
        },
    };
})();

(function () {
    self.BoardView = function (canvas, board) {
        this.canvas = canvas;
        this.canvas.width = board.width;
        this.canvas.height = board.height;
        this.board = board;
        this.ctx = canvas.getContext("2d");
    };

//Esta es la vista en el modelo
    self.BoardView.prototype = {
        clean: function () {
            this.ctx.clearRect(0, 0, this.board.width, this.board.height);
        },
        draw: function () {
            for (var i = this.board.elements.length - 1; i >= 0; i--) {
                var el = this.board.elements[i];

                draw(this.ctx, el);
            }
        },
        play: function () {
            if (this.board.playing) {
                this.clean();
                this.draw();
                this.board.ball.move();
            }
        },
        check_collisions: function () {
            for (var i = this.board.bars.length - 1; i >= 0; i--) {
                var bar = this.board.bars[i];
                if (hit(bar, this.board.ball)) {
                    this.board.ball.collision(bar);
                }
            }
        },

        play: function () {
            if (this.board.playing) {
                this.clean();
                this.draw();
                this.board.ball.move();
                this.check_collisions();
            }
        },
    };
    function hit(a, b) {
        if (this.ball.x < 0 || this.ball.x > 800) {
            board.playing = false;
            let mensaje = document.getElementById("gameover");
            mensaje.innerHTML = "<h3 style='color:while;'>Juego terminado!</h3>";
            setTimeout(function () {
                location.reload();
            }, 3000);
        }

        var hit = false;

        if (b.x + b.width >= a.x && b.x < a.x + a.width) {

            if (b.y + b.height >= a.y && b.y < a.y + a.height) hit = true;
        }

        if (b.x <= a.x && b.x + b.width >= a.x + a.width) {
            if (b.y <= a.y && b.y + b.height >= a.y + a.height) hit = true;
        }

        if (a.x <= b.x && a.x + a.width >= b.x + b.width) {
            if (a.y <= b.y && a.y + a.height >= b.y + b.height) hit = true;
        }
        return hit;
    }

    function draw(ctx, element) {
        switch (element.kind) {
            case "rectangle":
                ctx.fillRect(element.x, element.y, element.width, element.height);
                break;

            case "circle":
                ctx.beginPath();
                ctx.arc(element.x, element.y, element.radius, 0, 7);
                ctx.fill();
                ctx.closePath();
                break;
        }
    }
})();

var board = new Board(800, 400);
var bar = new Bar(20, 100, 10, 100, board);
var bar2 = new Bar(773, 100, 10, 100, board);

var bar_up = new Bar(0, 0, 800, 3, board);
var bar_down = new Bar(0, 397, 800, 6, board);

var canvas = document.getElementById("canvas");
var board_view = new BoardView(canvas, board);
var ball = new Ball(350, 100, 10, board);

document.addEventListener("keydown", function (ev) {
    if (ev.keyCode == 38) {
        ev.preventDefault(); //Ventana del navegador estáticoF
        bar.up();
    } else if (ev.keyCode == 40) {
        ev.preventDefault(); //Ventana del navegador estático
        bar.dow();
    } else if (ev.keyCode === 87) {
        //Key W
        ev.preventDefault(); //Ventana del navegador estático
        bar2.up();
    } else if (ev.keyCode === 83) {
        //Key S
        ev.preventDefault(); //Ventana del navegador estático
        bar2.dow();
    }
    else if (ev.keyCode === 32) {
        ev.preventDefault(); //Static browser window
        board.playing = !board.playing;
    }
});

board_view.draw();
window.requestAnimationFrame(controller);
ball.direction = -1;

function controller() {
    board_view.play();
    window.requestAnimationFrame(controller);
}