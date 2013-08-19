var Player = function (gameType, hostNum, clientId, gameRoomNumber) {
    var x = undefined, y = undefined, snake = undefined, moveAmount = game.size,
        foodId = 0, foodNum = 0, foodPosX = 0, foodPosY = 0, playerScore = 0,
    //initialize player and create new snake for player
        init = function () {
            snake = new Snake(((gameType == "multiplayer") ? true : false), hostNum);
            snake.init();
        },
        getColor = function () {
            if (hostNum == 1) {
                return "#99CCFF";
            } else {
                return "#f43a7e";
            }
        },
    //return snake object
        getSnake = function () {
            return snake;
        },
    //return player score
        getScore = function () {
            return playerScore;
        },
    //set player score
        setScore = function (score) {
            playerScore = score;
        },
    //add player score
        addScore = function (score) {
            playerScore += score;
        },
    //update snake movement depending on key
        update = function (keys) {
            x = snake.snake[0].x;
            y = snake.snake[0].y;
            switch (keys.direction) {
                case "U":
                    y -= moveAmount;
                    break;
                case "D":
                    y += moveAmount;
                    break;
                case "L":
                    x -= moveAmount;
                    break;
                case "R":
                    x += moveAmount;
                    break;
                default:
                    x += moveAmount;
                    break;
            }
            //update snake, to move snake head need to be pop from list, pop = true
            snake.updateSnake(x, y, true);
            snake.draw();
        };
    return {
        init: init,
        getClientId: clientId,
        getGameRoomId: gameRoomNumber,
        getHostNum: hostNum,
        getColor: getColor,
        getSnake: getSnake,
        getScore: getScore,
        addScore: addScore,
        setScore: setScore,
        update: update,
        foodNum: foodNum,
        foodId: foodId,
        foodPosX: foodPosX,
        foodPosY: foodPosY
    }
};