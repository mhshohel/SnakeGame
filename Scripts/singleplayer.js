var singlePlayer = {
    name: "",
    currentLevel: 0,//current level, must reset to 0 after completion of this game
    //Note: $('#continue') click event must be off after using it for multiple events
    //otherwise it will cause problems, see the defination of event bubbling 
    start: function () {
        singlePlayer.showMessageBox("What is your name?");
    },
    init: function () {
        game.type = "singleplayer";
        game.running = true;
        //create new player
        $('#gameStartScreen').hide();
        $('#gameCanvas').show();
        game.type = "singleplayer";
        game.localPlayer = new Player();
        game.clearCanvas();
        game.clearBoard();
        singlePlayer.startScreen();
    },
    showMessageBox: function (message) {
        $('#nameField').prop("placeholder", "Enter only letters");
        $('#playerNameTitle').css({'font-size': 1.7 + 'em'});
        $('#playerNameTitle').html(message);
        $('#playerNameButton').val("OK");
        $('#playerNameButton').on('click', function () {
            singlePlayer.name = $('#nameField').val();
            if (singlePlayer.name != "") {
                if (singlePlayer.name.match(/^[a-zA-Z]*$/)) {
                    $('#playerNameButton').off('click');
                    $('#playerNameBox').hide();
                    $('#nameField').val('');
                    singlePlayer.init();
                }
            }
        });
        $('#playerNameBox').show();
    },
    //show some important message
    statusScreen: function (title, subTitle, buttonText) {
        $('.Logo').html(title);
        $('#statusScreenText').html(subTitle);
        $('#continue').html(buttonText);
        $('#statusScreen').show('slow');
    },
    //start screen, forNewLevel=undefined if new level not found
    startScreen: function (forNewLevel) {
        game.stop();
        if (forNewLevel == undefined) {
            forNewLevel = false;
        }
        singlePlayer.levelRequirment = levels.list[singlePlayer.currentLevel];
        singlePlayer.statusScreen(singlePlayer.levelRequirment.name, singlePlayer.levelRequirment.message, 'Click to continue');
        if (!forNewLevel) {
            $('#continue').on('click', function () {
                $('#continue').off('click');
                singlePlayer.play();
            });
        }
    },
    //show screen for retry
    retryScreen: function () {
        singlePlayer.statusScreen(singlePlayer.levelRequirment.name + " Failed", "You have lost " + game.reducedPoints + " points, Try again...", 'Click to retry');
        $('#continue').on('click', function () {
            $('#continue').off('click');
            singlePlayer.play();
        });
    },
    // screen for level complete
    levelCompleteScreen: function (msgOne, msgTwo) {
        var msgThree = "Click to play next level";
        msgOne = "<br/><br/>" + msgOne;
        msgTwo = (msgTwo == undefined) ? "" : "<br/><br/>" + msgTwo;
        singlePlayer.currentLevel++;// increase level number
        //if further level is not avaiable then go to gameover screen, in 3sec.
        if (levels.list[singlePlayer.currentLevel] == undefined) {
            msgThree = "";
            $('#continue').off('click');
            game.getLiveScore(true);
            setTimeout(function () {
                singlePlayer.gameOverScreen();
            }, 5000);//wait 5sec before display gameover screen
        } else {
            game.getLiveScore(false);
            $('#continue').on('click', function () {
                if (levels.list[singlePlayer.currentLevel] != undefined) {
                    singlePlayer.levelRequirment = levels.list[singlePlayer.currentLevel];
                    $('#continue').off('click');
                    singlePlayer.startScreen();
                }
            });
        }
        singlePlayer.statusScreen(singlePlayer.levelRequirment.name + " Complete", "Level Score: " + game.currentScore + "<br/>Total Score: " + game.localPlayer.getScore() + msgOne + msgTwo, msgThree);
    },
    //Game over screen
    gameOverScreen: function () {
        game.stop();
        singlePlayer.statusScreen("Game Over", "You score is: " + game.localPlayer.getScore() + "<br/><br/><br/>Game developed by: Shohel Shamim<br/>Linnaeus University, Sweden<br/>mhshohel@hotmail.com", 'Thank you');
        $('#continue').on('click', function () {
            $('#continue').off('click');
            singlePlayer.currentLevel = 0;// reset level
            singlePlayer.name = "";
            game.clearCanvas();
            game.scoreObject = undefined;
            game.reset();// reset games reqired. elements
            $('#statusScreen').hide();
            $('#gameCanvas').hide();

            $('#gameStartScreen').show();
        });
    },
    play: function () {
        game.currentScore = 0;// reset current player score
        //reset key, otherwise it may keep previous key info.
        game.keys.resetKey();
        $('#statusScreen').fadeOut('slow');
        //initialize player to create new snake
        game.localPlayer.init();
        //level time
        game.levelTime = levels.list[singlePlayer.currentLevel].time;
        game.levelIntTime = levels.list[singlePlayer.currentLevel].time;
        //objectives
        game.foodsToEat = levels.list[singlePlayer.currentLevel].objective;
        var fps = 1000 / 20;//levels.list[singlePlayer.currentLevel].speed;
        game.play(fps);
    }
}