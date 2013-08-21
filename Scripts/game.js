var game = {
    size: 20, //image or rec size
    space: 20, //gap between board and background (px.)
    gameLoopId: undefined,
    gameTimeId: undefined,
    localPlayer: undefined,
    remotePlayer: undefined,
    foodInBoard: undefined,
    hiScore: 0, // keep record of hi score
    scoreObject: undefined,//keep object that gets from server
    currentScore: 0, //current player score
    addBonus: 0, //only use in bonus level
    levelTime: 0, // init it from single player
    levelIntTime: 0, //initial time from level
    foodsToEat: 0, //init it from single player
    action: undefined,//W-> Wall, S-> Self, C-> Complete, T-> Timeout
    init: function () {
        loader.init();
        sounds.init();
        game.scoreObject = undefined;
        multiPlayer.socket = io.connect('http://localhost:8000/');
        game.getLiveScore(false);
        //get Canvas
        game.gameCanvas = document.getElementById("gameCanvas");
        game.gameContext = game.gameCanvas.getContext("2d");
        //initialize canvas width and height
        game.canvasWidth = 1022;
        game.canvasHeight = 760;
        game.gameCanvas.width = game.canvasWidth;
        game.gameCanvas.height = game.canvasHeight;
        game.boardWidth = game.boardHeight = 720;
        game.keys = new Keys();
        game.remoteKeys = new Keys(); //for remote player
        game.setEventHandlers();
        game.reset();
    },
    getLiveScore: function (changeable) {
        if (multiPlayer.socket == undefined) {
            multiPlayer.endGame("Sorry, cannot connect to the server, score will be saved in your computer.");
        } else {
            multiPlayer.sendSocketMessage({type: 'getScore'});
            //receive results
            multiPlayer.receiveSocketMessage('getScore');
        }
        setTimeout(function () {
            if (game.scoreObject != undefined) {
                if (game.hiScore < game.scoreObject.points) {
                    game.hiScore = game.scoreObject.points;
                    localStorage.name = game.scoreObject.name;
                    localStorage.hiscore = game.scoreObject.points;
                } else if (game.hiScore > game.scoreObject.points && changeable) { //update score if it is higher than before
                    localStorage.name = singlePlayer.name;
                    multiPlayer.sendSocketMessage({type: 'setScore', points: game.hiScore, name: singlePlayer.name});
                }
            } else {
                if (localStorage.hiscore != undefined) {
                    game.hiScore = localStorage.hiscore;
                } else {
                    game.hiScore = localStorage.hiscore = 1000;
                    localStorage.name = "Shohel";
                }
            }
            $('#localPlayerScore').html("High Score: " + localStorage.hiscore + "<br/>" + localStorage.name);
        }, 3000);//wait 3sec before init hi score
    },
    clearCanvas: function () { // clear canvas
        game.gameContext.clearRect(0, 0, game.canvasWidth, game.canvasHeight);
    },
    clearBoard: function () { // clear board
        game.gameContext.clearRect(0, 0, game.boardWidth, game.boardHeight);
        game.gameContext.fillStyle = "black";
        game.gameContext.fillRect(0, 0, game.canvasWidth, game.canvasHeight);
    },
    drawScene: function () {
        game.clearCanvas();
        game.clearBoard();
        game.gameContext.fillStyle = levels.list[singlePlayer.currentLevel].background();
        game.gameContext.fillRect(game.space, game.space, game.boardWidth, game.boardHeight);
        //check whether food is already in food or not
        if (game.type != "multiplayer") {
            if (game.foodInBoard == undefined) {
                //get the food object number
                game.foodInBoard = game.foods[Math.floor(Math.random() * game.foods.length)];
                game.foodInBoard.init();
            }
        } else {
            game.foodInBoard = game.foods[game.localPlayer.foodNum];
            game.foodInBoard.init(game.localPlayer.foodPosX, game.localPlayer.foodPosY);
        }
        game.foodInBoard.draw();
        //local players snake
        var sx = game.localPlayer.getSnake().snake[0].x; //snake's x axis
        var sy = game.localPlayer.getSnake().snake[0].y; //snake's y axis
        //Level Timer
        if (game.gameTimeId == undefined && game.levelTime != 0) {
            game.gameTimeId = setInterval(function () {
                game.levelTime--;
                if (game.type == "multiplayer") {
                    multiPlayer.sendSocketMessage({type: 'gameTimeSnyc', roomId: multiPlayer.roomId, playerId: game.localPlayer.getClientId, timer: game.levelTime});
                }
                if (game.levelTime == 0) {
                    game.action = (game.type == "multiplayer") ? "C" : "T";
                }
            }, 1000);
        } else if (sx == game.foodInBoard.getX() && sy == game.foodInBoard.getY()) {
            game.foodInBoard.clearAnimation();
            game.foodInBoard = undefined;
            sounds.play('eat');
            //Food collision
            if (game.type != "multiplayer") {
                game.localPlayer.getSnake().updateSnake(sx, sy);
                game.previousScore = game.currentScore;
                game.currentScore += rules.foodPoints();
                if (levels.list[singlePlayer.currentLevel].sName != "Bonus") {
                    game.foodsToEat--;
                    if (game.foodsToEat == 0) {
                        game.action = "C";
                    }
                } else {
                    game.foodsToEat++;
                    if (game.foodsToEat <= 5) {
                        game.extra = 50;
                    }
                    else if (game.foodsToEat <= 10) {
                        game.extra = 100;
                    }
                    else if (game.foodsToEat <= 15) {
                        game.extra = 150;
                    }
                    else if (game.foodsToEat <= 20) {
                        game.extra = 200;
                    } else {
                        game.extra = 250;
                    }
                    game.addBonus += game.extra;
                }
            } else {
                multiPlayer.sendSocketMessage({type: 'foodEaten', roomId: multiPlayer.roomId, playerId: game.localPlayer.getClientId, foodId: game.localPlayer.foodId, sX: sx, sY: sy});
            }
        } else if (sx < game.space || sx > game.boardWidth || sy < game.space || sy > game.boardHeight) {
            //Wall collision
            if (game.type != "multiplayer") {
                game.foodInBoard.clearAnimation();
                game.action = "W";
            }
        } else {
            //Self Bite
            if (game.type != "multiplayer") {
                var snake = game.localPlayer.getSnake().snake;
                for (var i = 1; i < snake.length; i++) {
                    if (sx == snake[i].x && sy == snake[i].y) {
                        game.foodInBoard.clearAnimation();
                        game.action = "S";
                        break;
                    }
                }
            }
        }
        game.gameStatus();
        //game.action: W,S,T,C, if it is not defined then snake can move
        if (game.action == undefined) {
            if (game.type == "multiplayer") {
                game.keys.direction = game.keyController(game.keys.direction, sx, sy);
                game.remoteKeys.direction = game.keyController(game.remoteKeys.direction, game.remotePlayer.getSnake().snake[0].x, game.remotePlayer.getSnake().snake[0].y);
                game.remotePlayer.update(game.remoteKeys);
            }
            game.localPlayer.update(game.keys);
        } else {
            game.gameOver();
        }
    },
    //set key direction for both remote and local player
    keyController: function (keyDir, sx, sy) {
        switch (keyDir) {
            case "R":
                if (sx + game.space > game.boardWidth) {
                    if (sy + game.space > game.boardHeight) {
                        keyDir = "U";
                    } else {
                        keyDir = "D";
                    }
                }
                break;
            case "D":
                if (sy + game.space > game.boardHeight) {
                    if (sx + game.space > game.boardWidth) {
                        keyDir = "L";
                    } else {
                        keyDir = "R";
                    }
                }
                break;
            case "L":
                if (sx - game.space < game.space) {
                    if (sy + game.space > game.boardHeight) {
                        keyDir = "U";
                    } else {
                        keyDir = "D";
                    }
                }
                break;
            case "U":
                if (sy - game.space < game.space) {
                    if (sx + game.space > game.boardWidth) {
                        keyDir = "L";
                    } else {
                        keyDir = "R";
                    }
                }
                break;
        }
        return keyDir;
    },
    //level finished screen
    gameOver: function () {
        game.running = false;
        //must need to clearIntervals, and undefined those objects
        var action = game.action;
        if (game.type == "multiplayer") {
            game.remotePlayer.getSnake().draw();
        }
        game.localPlayer.getSnake().draw();
        game.pause();
        if (levels.list[singlePlayer.currentLevel].sName == "Bonus") {
            action = "C";
        }
        switch (action) {
            case 'W'://Wall
            case 'S'://Self
            case 'T'://Timeout
                game.reducedPoints = 50;
                game.localPlayer.addScore(-game.reducedPoints);
                sounds.play("die");
                game.foodInBoard.clearAnimation();
                game.foodInBoard = undefined;
                //retryScreen
                singlePlayer.retryScreen();
                break;
            case 'C'://Mission complete
                sounds.play("eat");
                if (game.type != "multiplayer") {
                    var bonus = rules.bonusPoints(levels.list[singlePlayer.currentLevel].time, game.levelTime);
                    var msgOne = bonus.msg;
                    var msgTwo;
                    //if it is not bonus level
                    if (levels.list[singlePlayer.currentLevel].sName != "Bonus") {
                        game.localPlayer.addScore(game.currentScore + bonus.points);
                    } else {
                        msgOne = "You have received " + game.addBonus + " bonus points.";
                    }
                    //set hi-score if current player score is higher than before
                    if (game.localPlayer.getScore() > game.hiScore) {
                        localStorage.hiscore = game.hiScore = game.localPlayer.getScore();
                        msgTwo = "Congratulations! You have set the highest score."
                    }
                    //single player levelCompleteScreen
                    singlePlayer.levelCompleteScreen(msgOne, msgTwo);
                } else {
                    //multi player levelCompleteScreen
                    multiPlayer.levelCompleteScreen();
                }
                break;
        }
    },
    //single player status
    gameStatus: function () {
        // draw score
        //lime = 100% - 76%, yellow = 75%-51%, orange = 50% - 26%, red = 25% - 0% (no bonus on red)
        var percent = Math.floor((game.levelTime / game.levelIntTime) * 100);
        var color = 'lime';
        if (percent > 75) {
            color = 'lime';
        } else if (percent > 50) {
            color = 'yellow';
        } else if (percent > 25) {
            color = 'orange';
        } else {
            color = 'red';
        }

        //update total score in bonus level, also update if it is the hi-score
        if (levels.list[singlePlayer.currentLevel].sName == "Bonus") {
            if (game.currentScore != 0 && game.previousScore < game.currentScore) {
                game.localPlayer.addScore(rules.foodPoints() + game.extra);
                game.previousScore = game.currentScore;
            }
            if (game.localPlayer.getScore() > game.hiScore) {
                localStorage.hiscore = game.hiScore = game.localPlayer.getScore();
            }
        }
        game.gameContext.lineWidth = 1;
        game.gameContext.font = '52px Geo';
        game.gameContext.fillStyle = color;
        game.gameContext.fillText('Time', 830, 100);
        game.gameContext.font = '36px Verdana';
        game.gameContext.fillText(game.formatTime(), 847, 145);

        if (game.type != "multiplayer") {
            game.gameContext.font = '12px Verdana';
            game.gameContext.strokeStyle = 'white';
            game.gameContext.strokeText('HI = ' + game.hiScore, 845, 40);
            game.gameContext.fillStyle = 'white';
            game.gameContext.font = '14px Verdana';
            game.gameContext.strokeText('Foods: ' + game.foodsToEat, 850, 282);
            game.gameContext.strokeText('Current Score: ' + game.currentScore, 820, 320);
            game.gameContext.strokeText('Total Score: ' + game.localPlayer.getScore(), 830, 358);
            game.gameContext.font = '12px Verdana';
            game.gameContext.fillText('Objective: ' + levels.list[singlePlayer.currentLevel].message, 20, 755);
            game.gameContext.fillText('Developed by: Shohel Shamim', 820, 755);
            game.gameContext.font = 'bold 32px Verdana';
            game.gameContext.fillStyle = levels.list[singlePlayer.currentLevel].color;
            game.gameContext.fillText(levels.list[singlePlayer.currentLevel].name, 795, 200);
        } else {
            game.gameContext.font = 'bold 24px Verdana';
            game.gameContext.fillStyle = game.localPlayer.getColor();
            game.gameContext.fillText("  Your Score", 795, 250);
            game.gameContext.fillStyle = game.remotePlayer.getColor();
            game.gameContext.fillText("   Opponents", 795, 350);
            game.gameContext.strokeStyle = 'white';
            game.gameContext.fillStyle = 'white';
            game.gameContext.font = '16px Verdana';
            game.gameContext.strokeText('Score: ' + game.localPlayer.getScore(), 850, 282);
            game.gameContext.strokeText('Score: ' + game.remotePlayer.getScore(), 850, 382);
        }
    },
    //time format, always show 3 digits
    formatTime: function () {
        if (game.levelTime > 999 || (game.levelTime < 1000 && game.levelTime >= 100)) {
            return "" + game.levelTime;
        } else if (game.levelTime < 100 && game.levelTime >= 10) {
            return "0" + game.levelTime;
        } else {
            return "00" + game.levelTime;
        }
    },
    //event handler
    setEventHandlers: function () {
        // Keyboard
        window.addEventListener("keydown", this.onKeydown, false);
        window.addEventListener("keyup", this.onKeyup, false);
    },
    // Keyboard key down
    onKeydown: function (e) {
        game.keys.onKeyDown(e);
    },
    // Keyboard key up
    onKeyup: function (e) {
        game.keys.onKeyUp(e);
    },
    //reset required assets
    reset: function () {
        game.gameLoopId = undefined;
        game.gameTimeId = undefined;
        game.localPlayer = undefined;
        game.foodInBoard = undefined;
        game.currentScore = 0;
        game.addBonus = 0; //add bonus points
        game.levelTime = 0;
        game.foodsToEat = 0;
        game.action = undefined;
    },
    /*Messagebox code*/
    messageBoxOkCallback: undefined,
    messageBoxCancelCallback: undefined,
    showMessageBox: function (message, onOK, onCancel) {
        $('#messageboxtext').html(message);
        (!onOK) ? game.messageBoxOkCallback = undefined : game.messageBoxOkCallback = onOK;

        if (!onCancel) {
            game.messageBoxCancelCallback = undefined;
            $("#messageboxcancel").hide();
        } else {
            game.messageBoxCancelCallback = onCancel;
            $("#messageboxcancel").show();
        }

        $('#messageboxscreen').show();
    },
    messageBoxOK: function () {
        $('#messageboxscreen').hide();
        if (game.messageBoxOkCallback) {
            game.messageBoxOkCallback()
        }
    },
    messageBoxCancel: function () {
        $('#messageboxscreen').hide();
        if (game.messageBoxCancelCallback) {
            game.messageBoxCancelCallback();
        }
    },
    play: function (fps) {
        game.running = true;
        game.fps = fps;
        if (game.gameLoopId == undefined) {
            //background music
            sounds.play("background", true);
            game.gameLoopId = setInterval(function () {
                game.drawScene();
            }, fps)
        }
    },
    pause: function () {
        game.clearTriggers();
        sounds.stop("background");
    },
    stop: function () {
        game.running = false;
        game.clearTriggers();
        sounds.stop("background");
        if (game.foodInBoard != undefined) {
            game.foodInBoard.clearAnimation();
            game.foodInBoard = undefined;
        }
        game.reset();
        game.clearCanvas();
        game.clearBoard();
    },
    /*---------------*/
    clearTriggers: function () {
        if (game.gameLoopId != undefined) {
            clearInterval(game.gameLoopId);
            game.gameLoopId = undefined;
        }
        if (game.gameTimeId != undefined) {
            clearInterval(game.gameTimeId);
            game.gameTimeId = undefined
        }
        game.action = undefined;
    }
}
