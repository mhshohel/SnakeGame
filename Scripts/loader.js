var loader = {
    loaded: true,
    loadedCount: 0, // assets that have been loaded so far
    totalCount: 0, // total number of assets that need to be loaded
    soundFileExtn: ".ogg", //default .ogg file extension
    init: function () {
        // check for sound support
        var mp3Support, oggSupport;
        var audio = document.createElement('audio');
        if (audio.canPlayType) {
            // currently canPlayType() returns: "", "maybe" or "probably" 
            mp3Support = "" != audio.canPlayType('audio/mpeg');
            oggSupport = "" != audio.canPlayType('audio/ogg; codecs="vorbis"');
        } else {
            //audio tag is not supported
            mp3Support = false;
            oggSupport = false;
        }
        // check for ogg, then mp3, and finally set soundFileExtn to undefined
        loader.soundFileExtn = oggSupport ? ".ogg" : mp3Support ? ".mp3" : undefined;
        //load food images by spliting a single image
        game.foods = loader.foodsLoad('snakefoods');
    },
    //load image file as new Image() by taking image file url
    loadImage: function (url) {
        this.totalCount++;
        this.loaded = false;
        $('#loadingScreen').show();
        var image = new Image();
        image.src = url;
        image.onload = loader.itemLoaded;
        return image;
    },
    //load sound file as new Audio() by taking sound file url
    loadSound: function (url) {
        this.totalCount++;
        this.loaded = false;
        $('#loadingScreen').show();
        var audio = new Audio();
        audio.src = url + loader.soundFileExtn;
        audio.addEventListener("canplaythrough", loader.itemLoaded, false);
        return audio;
    },
    // food objects array to pre load, just for few splited image didn't create new file like sounds.js
    foodsLoad: function (imgName) {
        var foods = [],
            img = loader.loadImage("Images/" + imgName + ".png");
        //do not change anything below
        foods.push(new Food(0, 0, 52, 44, img));
        foods.push(new Food(50, 0, 50, 44, img));
        foods.push(new Food(95, 0, 50, 44, img));
        foods.push(new Food(150, 0, 46, 44, img));
        foods.push(new Food(196, 0, 50, 44, img));
        foods.push(new Food(248, 0, 50, 44, img));
        foods.push(new Food(296, 0, 50, 44, img));
        foods.push(new Food(342, 0, 58, 44, img));
        foods.push(new Food(402, 0, 50, 44, img));
        foods.push(new Food(454, 0, 50, 44, img));
        foods.push(new Food(496, 0, 48, 44, img));
        foods.push(new Food(542, 0, 50, 44, img));
        return foods;
    },
    // to get information in loading screen and to make sure assets are loaded
    itemLoaded: function () {
        loader.loadedCount++;
        var percent = Math.floor((loader.loadedCount / loader.totalCount) * 100);
        $('#loadingMessage').html('Loading... ' + percent + '%');
        if (loader.loadedCount === loader.totalCount) {
            loader.loaded = true;
            $('#loadingScreen').hide();
            $('#singlePlayer').html('Singleplayer');
            $('#multiPlayer').html('Multiplayer');
            if (loader.onload) {
                loader.onload();
                loader.onload = undefined;
            }
        }
    }
}