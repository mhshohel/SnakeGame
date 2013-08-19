Modernizr.load([
    {
        // load all resource files
        load: [
            "StyleSheets/fontfaces.css",
            "StyleSheets/reset.css",
            "StyleSheets/style.css",
            "Lib/jquery-2.0.3.min.js",
            "Scripts/player.js",
            "Scripts/food.js",
            "Scripts/snake.js",
            "Scripts/levels.js",
            "Scripts/loader.js",
            "Scripts/sounds.js",
            "Scripts/keys.js",
            "Scripts/game.js",
            "Scripts/rules.js",
            "Scripts/singleplayer.js",
            "http://localhost:8000/socket.io/socket.io.js",
            "Scripts/multiplayer.js"
        ],
        //after loading all resources below command will be execute
        complete: function () {
            if (Modernizr.canvas && Modernizr.localstorage) {
                //write messagebox title
                $('#messageTitle').html("Snake Game Error!");
                //draw a line below messagebox title
                $('<hr/>').appendTo('#messageTitle');
                //Set messagebox buttons name
                $('#messageboxok').val("OK").on('click', function () {
                    game.messageBoxOK();
                });
                $('#messageboxcancel').val("Cancel").on('click', function () {
                    game.messageBoxCancel();
                });
                //Gamelobby join and cancel event.
                $('#multiPlayerJoin').val("Join").on('click', function () {
                    multiPlayer.join();
                });
                $('#multiPlayerCancel').val("Cancel").on('click', function () {
                    multiPlayer.cancel();
                });
                //infor user about the controller
                $("#keys").html("Use (Up, Down, Left, Right) or (W, S, A, D), (P or PAUSE) pause");
                $('#gameCanvas').hide();
                $('#messageboxscreen').hide();
                $('#multiplayerlobbyscreen').hide();
                //Game Initialize
                game.init();
            } else {
                alert("You browser doesn't supported for this game. Please, update your browser. Thank you.");
            }
        }
    },
]);