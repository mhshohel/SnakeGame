var Snake = function (isMultiplayer, hostNum) {
    var initalSize = 10, //initial snake length
        snake = [], xSize, ySize,
        init = function () {
            xSize = game.size;
            ySize = game.space;
            if (isMultiplayer) {
                initalSize = 3;
                if (hostNum == 2) {
                    ySize = game.space + game.size;
                }
            } else {
                // set the length of snake according to the level requirment
                initalSize = levels.list[singlePlayer.currentLevel].snakeLength;
            }
            for (var i = initalSize - 1; i >= 0; i--) {
                snake.push({ x: i * xSize, y: ySize });
            }
        },
        draw = function () {
            //create strock rect. over actual rect. of snake
            var lineWidth = 5;
            game.gameContext.lineJoin = "round";
            game.gameContext.lineWidth = lineWidth;
            for (var i = 0; i < snake.length; i++) {
                var color;
                if (!isMultiplayer) {
                    color = levels.list[singlePlayer.currentLevel].color;
                } else {
                    if (hostNum == 1) {
                        color = "#99CCFF";
                    } else {
                        color = "#f43a7e";
                    }
                }
                game.gameContext.fillStyle = color;
                //no need to draw head if its cross the wall
                if (snake[i].x != 0 && snake[i].x < game.boardWidth + game.space && snake[i].y != 0 && snake[i].y < game.boardHeight + game.space) {
                    game.gameContext.strokeRect(snake[i].x, snake[i].y, game.size - lineWidth, game.size - lineWidth);
                    game.gameContext.fillRect(snake[i].x, snake[i].y, game.size - lineWidth, game.size - lineWidth);
                }
            }
        },
    // update snake, pop will be undefined if snake eats food otherwise
    // for movement pop should be true
        updateSnake = function (sx, sy, pop) {
            (pop == undefined) ? false : (pop == true) ? snake.pop() : false;
            snake.unshift({ x: sx, y: sy });
        },
        updateSnakeForce = function (sx, sy, pop) {
            (pop == undefined) ? false : (pop == true) ? snake.pop() : false;
            snake.unshift({ x: sx, y: sy });
        };
    return {
        snake: snake,
        init: init,
        draw: draw,
        updateSnake: updateSnake,
        updateSnakeForce: updateSnakeForce
    }
}