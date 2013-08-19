var rules = {
    //return points of food
    foodPoints: function () {
        return 10;// Each food's point is 10
    },
    //return calculated bonus points object
    bonusPoints: function (totalTime, remainingTime) {
        //lime = 100% - 56%, yellow = 55% - 36%, orange = 35% - 16%, red = 15% - 0% (no bonus on red)
        var percent = Math.floor((remainingTime / totalTime) * 100);
        var points = 0;
        if (percent > 55) {
            points = remainingTime * 5;
        } else if (percent > 35) {
            points = remainingTime * 4;
        } else if (percent > 15) {
            points = remainingTime * 3;
        } else {
            points = remainingTime * 2;
        }
        return {
            points: points,
            msg: "You have received " + points + " bonus points."
        };
    }
}