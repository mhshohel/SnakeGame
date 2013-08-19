var Keys = function () {
    var direction = "R",//Default right direction
        isPasued = false,
        onKeyDown = function (e) {
            if (game.type != "multiplayer") {
                switch (e.keyCode) {
                    case 37: // Left
                    case 65://A
                        this.direction = (this.direction != "R") ? "L" : "R";
                        break;
                    case 38: // Up
                    case 87://W
                        this.direction = (this.direction != "D") ? "U" : "D";
                        break;
                    case 39: // Right
                    case 68://D
                        this.direction = (this.direction != "L") ? "R" : "L";
                        break;
                    case 40: // Down
                    case 83://S
                        this.direction = (this.direction != "U") ? "D" : "U";
                        break;
                    case 19: //PAUSE/BREAK
                    case 80: //P for PAUSE
                        if (!isPasued) {
                            isPasued = true;
                            game.pause();
                        } else {
                            isPasued = false;
                            game.play(game.fps);
                        }
                        break;
                }
            }
        },
        onKeyUp = function (e) {
            if (game.type == "multiplayer") {
                switch (e.keyCode) {
                    case 37: // Left
                    case 65://A
                        this.direction = (this.direction != "R") ? "L" : "R";
                        break;
                    case 38: // Up
                    case 87://W
                        this.direction = (this.direction != "D") ? "U" : "D";
                        break;
                    case 39: // Right
                    case 68://D
                        this.direction = (this.direction != "L") ? "R" : "L";
                        break;
                    case 40: // Down
                    case 83://S
                        this.direction = (this.direction != "U") ? "D" : "U";
                        break;
                }
                multiPlayer.sendSocketMessage({type: 'players_movement', roomId: multiPlayer.roomId, playerId: game.localPlayer.getClientId, keyDirection: this.direction});
            }
        },
    //must reset key otherwise it may keep record of previous direction
        resetKey = function () {
            this.direction = "R";
        };
    return {
        direction: direction,
        onKeyDown: onKeyDown,
        onKeyUp: onKeyUp,
        resetKey: resetKey
    };
};