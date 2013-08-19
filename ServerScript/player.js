var Player = function (clientInfo, hostNum) {
    var timer = 999, score = 0;
    var client = clientInfo,
        host = hostNum,
        id = client.id,
        getClient = function () {
            return client;
        },
        getId = function () {
            return id;
        },
        addScore = function (scr) {
            score += scr;
        },
        getScore = function () {
            return score;
        };
    // Define which variables and methods can be accessed
    return {
        getClient: getClient,
        getId: getId,
        host: host,
        timer: timer,
        getScore: getScore,
        addScore: addScore
    }
};

// Export the Player class so you can use it in
// other files by using require("Player").Player
exports.Player = Player;