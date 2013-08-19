var sounds = {
    //list of sound files name
    soundList: ["background", "die", "eat"],
    loaded: {},
    // load sounds
    init: function () {
        for (var i = 0; i < this.soundList.length; i++) {
            this.loaded[this.soundList[i]] = loader.loadSound('Sounds/' + this.soundList[i]);
        }
    },
    //play sound, loop is true if sound need to play continously
    play: function (soundName, loop) {
        var sound = sounds.loaded[soundName];
        sound.loop = (loop == undefined) ? false : loop;
        sound.pause();
        sound.currentTime = 0;
        sound.play();
    },
    //stop sound
    stop: function (soundName) {
        var sound = sounds.loaded[soundName];
        sound.loop = false;
        sound.pause();
        sound.currentTime = 0;
    },
    //pause sound, never used
    pause: function (soundName) {
        var sound = sounds.loaded[soundName];
        sound.pause();
    }
}