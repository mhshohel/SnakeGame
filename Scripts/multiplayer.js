var multiPlayer = {
    socket: undefined,
    start: function () {
        game.type = "multiplayer";
        //multiPlayer.socket = io.connect('http://localhost:8000');
        if (multiPlayer.socket == undefined) {
            multiPlayer.endGame("Error connecting to the server.");
        } else {
            $('.GameLayer').hide();
            $('#multiPlayerLobbyScreen').show();
            //send request to get room list
            multiPlayer.sendSocketMessage({type: 'game_room'});
            //initialize game room list
            multiPlayer.receiveSocketMessage('game_room');
            //initialize game
            multiPlayer.receiveSocketMessage('init_game');
            //receive food
            multiPlayer.receiveSocketMessage('foodReq');
            //update snake
            multiPlayer.receiveSocketMessage('updateSnake');
            //receive remote player's key direction
            multiPlayer.receiveSocketMessage('players_movement');
        }
    },
    startGame: function () {
        game.running = true;
        //send update to server so that all user can get updated room
        multiPlayer.sendSocketMessage({type: 'update_room', roomId: multiPlayer.roomId});
        $('#multiPlayerLobbyScreen').hide();
        $('#gameCanvas').show();
        game.clearCanvas();
        game.clearBoard();
        //send message to receive timer
        multiPlayer.sendSocketMessage({type: 'timer', roomId: multiPlayer.roomId});
        //get timer to start game
        multiPlayer.receiveSocketMessage('timer');
    },
    statusScreen: function (title, subTitle, buttonText) {
        $('.Logo').html(title);
        $('#statusScreenText').html(subTitle);
        $('#continue').html(buttonText);
        $('#statusScreen').show();
    },
    play: function () {
        //reset key, otherwise it may keep previous key info.
        game.keys.resetKey();
        game.remoteKeys.resetKey();
        $('#statusScreen').fadeOut('slow');
        //create new player
        game.localPlayer = new Player(game.type, multiPlayer.host, multiPlayer.clientId, multiPlayer.gameRoomId);
        game.remotePlayer = new Player(game.type, ((multiPlayer.host == 2) ? 1 : 2));
        //initialize player to create new snake
        game.localPlayer.init();
        game.remotePlayer.init();
        //send request for food
        multiPlayer.sendSocketMessage({type: 'foodReq', roomId: multiPlayer.roomId});
        //Start animation
        var fps = 1000 / 20;
        game.play(fps);
    },
    join: function () {
        var selectedRoom = document.getElementById('multiPlayerGamesList').value;
        if (selectedRoom) {
            multiPlayer.sendSocketMessage({type: 'join_room', roomId: selectedRoom - 1, foodLength: game.foods.length, boardHeight: game.boardHeight, boardWidth: game.boardWidth, contentSize: game.size, space: game.space});
            $('#multiPlayerGamesList').prop('disabled', true);
            $('#multiPlayerJoin').prop('disabled', true);
        } else {
            game.showMessageBox("Please select a game room to join.");
        }
    },
    cancel: function () {
        var selectedRoom = document.getElementById('multiPlayerGamesList').value;
        if ($('#multiPlayerJoin').prop('disabled') == false) {
            $('#multiPlayerLobbyScreen').hide();
        } else if (selectedRoom) {
            multiPlayer.sendSocketMessage({type: 'cancel_room', roomId: selectedRoom - 1});
            $('#multiPlayerGamesList').prop('disabled', false);
            $('#multiPlayerJoin').prop('disabled', false);
        } else {
            game.showMessageBox("You cannot leave game, please reload page if you want to leave");
        }
    },
//Receive message from server according to message
    receiveSocketMessage: function (message) {
        multiPlayer.socket.on(message, function (data) {
            multiPlayer.handleSocketMessage(data);
        });
    },
//send message to server
    sendSocketMessage: function (data) {
        multiPlayer.socket.emit(data.type, JSON.stringify(data));
    },
//handle game request
    handleSocketMessage: function (message) {
        var messageObject = JSON.parse(message);
        switch (messageObject.type) {
            case "getScore":
                game.scoreObject = messageObject;
                break;
            case "room_list":
                multiPlayer.updateRoomStatus(messageObject);
                multiPlayer.joinedMaxPlayer = messageObject.joinedMaxPlayer;
                if (messageObject.reactivate) {
                    document.getElementById('multiPlayerGamesList').removeAttribute('disabled');
                    document.getElementById('multiPlayerJoin').removeAttribute('disabled');
                }
                break;
            case 'init_game':
                //actual room id means actual room array position
                multiPlayer.roomId = messageObject.roomId;
                multiPlayer.startGame();
                break;
            case 'timer':
                multiPlayer.statusScreen(messageObject.counter, "Eat as much as you can to beat your opponent.");
                if (messageObject.counter == 0) {
                    //user's pos
                    multiPlayer.host = messageObject.host;
                    multiPlayer.clientId = messageObject.cId;
                    multiPlayer.gameRoomId = messageObject.roomId;
                    game.levelIntTime = messageObject.levelTime;
                    game.levelTime = messageObject.levelTime;
                    multiPlayer.play();
                }
                break;
            case 'players_movement':
                game.remoteKeys.direction = messageObject.keyDirection;
                break;
            case 'foodReq':
                if (game.foodInBoard != undefined) {
                    game.foodInBoard.clearAnimation();
                    game.foodInBoard = undefined;
                }
                game.localPlayer.foodId = messageObject.foodId;
                game.localPlayer.foodNum = messageObject.foodNum;
                game.localPlayer.foodPosX = messageObject.posX;
                game.localPlayer.foodPosY = messageObject.posY;
                break;
            case 'updateSnake':
                if (messageObject.toClient == "local") {
                    game.localPlayer.getSnake().updateSnake(game.localPlayer.getSnake().snake[0].x, game.localPlayer.getSnake().snake[0].y);
                    game.localPlayer.setScore(messageObject.score);
                } else {
                    game.remotePlayer.getSnake().updateSnake(game.remotePlayer.getSnake().snake[0].x, game.remotePlayer.getSnake().snake[0].y);
                    game.remotePlayer.setScore(messageObject.score);
                }
                break;
            case 'gameover':
                //console.log(message);
                setTimeout(function () {
                    multiPlayer.gameOverScreen();
                }, 5000);//wait 5sec before display gameover screen
                multiPlayer.statusScreen("<br/>" + "Timeout" + "<br/><br/><br/>" + messageObject.message, "", "");
                break;
        }
    },
    statusMessages: {
        'starting': 'Game Starting',
        'running': 'Game in Progress',
        'waiting': 'Awaiting second player',
        'empty': 'Open'
    },
    updateRoomStatus: function (messageObject) {
        var status = messageObject.status;
        if (multiPlayer.roomId != undefined && messageObject.disconnectedRoomId != undefined) {
            if (multiPlayer.roomId == messageObject.disconnectedRoomId) {
                game.running = false;
                game.pause();
                multiPlayer.endGame(messageObject.errorMessage, function () {
                    $('#gameCanvas').hide();
                    $('#multiPlayerLobbyScreen').show();
                })
            }
        }
        var $list = $("#multiPlayerGamesList");
        $list.empty(); // remove old options
        for (var i = 0; i < status.length; i++) {
            var key = status[i].roomName + this.statusMessages[status[i].roomStatus];
            $list.append($("<option></option>").prop("disabled", status[i].roomStatus == "running" || status[i].roomStatus == "starting").prop("value", (i + 1)).text(key).addClass(status[i].roomStatus).prop("selected", false));
        }
    },
    endGame: function (cause, onOk, onClose) {
        game.showMessageBox(cause, onOk, onClose);
        game.stop();
    },
    levelCompleteScreen: function () {
        game.pause();
        //send server that game is over
        multiPlayer.sendSocketMessage({type: 'gameover', roomId: multiPlayer.roomId});
        //receive results
        multiPlayer.receiveSocketMessage('gameover');
    },
    //Game over screen
    gameOverScreen: function () {
        game.stop();
        multiPlayer.statusScreen("Game Over", "<br/><br/>Thank you for playing<br/><br/><br/>Game developed by: Shohel Shamim<br/>Linnaeus University, Sweden<br/>mhshohel@hotmail.com", "");
        //stop game from server
        multiPlayer.sendSocketMessage({type: 'cancel_room', roomId: multiPlayer.roomId, flag: 'gameover'});
        setTimeout(function () {
            game.clearCanvas();
            game.reset();// reset games reqired. elements
            $('#statusScreen').hide();
            $('#gameCanvas').hide();
            $('#gameStartScreen').show();
        }, 3000);
    }
}