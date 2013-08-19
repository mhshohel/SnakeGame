var Food = function (sourceX, sourceY, sourceWidth, sourceHeight, img) {
    var sx = sourceX, sy = sourceY, sw = sourceWidth, sh = sourceHeight, image = img, x = game.space, y = game.space, loop = undefined,

    //initialize food object
        init = function (mX, mY) { //mX and mY used to set x,y for multiplayer
            if (game.type == "multiplayer") {
                x = mX;
                y = mY;
            } else {
                x = (Math.round(Math.random() * (game.boardWidth - game.size) / game.size)) * game.size + game.space;
                y = (Math.round(Math.random() * (game.boardHeight - game.size) / game.size)) * game.size + game.space;
                //cross ckeck for wall collision
                x = (x > game.boardWidth) ? game.boardWidth : (x < game.space) ? game.space : x;
                y = (y > game.boardHeight) ? game.boardHeight : (y < game.space) ? game.space : y;
            }
        },
        draw = function () {
            //foods must be placed inside inner rec. so, display foods after 10px of x,y position
            game.gameContext.drawImage(image, sx, sy, sw, sh, x, y, game.size, game.size);
            //to create an animated rect. over food image
            if (loop == undefined) {
                loop = setInterval(function () {
                    game.gameContext.lineWidth = 1;
                    game.gameContext.strokeStyle = "#ef5b91";
                    game.gameContext.strokeRect(x, y, game.size, game.size);
                }, 33);
            }
        },
    //clear animated rect. if food is no available on board
        clearAnimation = function () {
            if (loop != undefined) {
                clearInterval(loop);
                loop = undefined;
            }
        },
    //return x axis of food
        getX = function () {
            return x;
        },
    //return y axis of food
        getY = function () {
            return y;
        }
    return {
        init: init,
        draw: draw,
        sx: sx,
        sy: sy,
        sw: sw,
        sh: sh,
        getX: getX,
        getY: getY,
        clearAnimation: clearAnimation
    }
};

// image, original image position x, y, clipped image (crop original image to fit in new size) size x, y, position in canvas x, y, scale size x, y
//ctx.drawImage(img, 0, 0, 52, 44, 10, 10, 30, 30);//1
//ctx.drawImage(img, 50, 0, 50, 44, 10, 40, 30, 30);//2
//ctx.drawImage(img, 95, 0, 50, 44, 10, 70, 30, 30);//3
//ctx.drawImage(img, 150, 0, 46, 44, 10, 100, 30, 30);//4
//ctx.drawImage(img, 196, 0, 50, 44, 10, 130, 30, 30);//5
//ctx.drawImage(img, 248, 0, 50, 44, 10, 170, 30, 30);//6
//ctx.drawImage(img, 296, 0, 50, 44, 10, 200, 30, 30);//7
//ctx.drawImage(img, 342, 0, 58, 44, 10, 230, 30, 30);//8
//ctx.drawImage(img, 402, 0, 50, 44, 10, 260, 30, 30);//9
//ctx.drawImage(img, 454, 0, 50, 44, 10, 290, 30, 30);//10
//ctx.drawImage(img, 496, 0, 48, 44, 10, 300, 30, 30);//11
//ctx.drawImage(img, 542, 0, 50, 44, 10, 330, 30, 30);//12