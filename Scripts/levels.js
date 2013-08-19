var levels = {
    //Set level stories
    list: {
        "0": {
            name: "Level One",
            sName: "One",
            color: "#99CCFF",
            snakeLength: 10,
            time: 120, //seconds
            objective: 7, //foods
            speed: 10, //snake speed
            message: "Eat 7 foods on time to complete this level.",
            background: function () {
                var gradient = game.gameContext.createLinearGradient(100, 200, 300, 400);
                gradient.addColorStop(0, "#f6edf7");
                gradient.addColorStop(0.35, "#f1f2da");
                gradient.addColorStop(0.7, "#f7e8e3");
                gradient.addColorStop(1, "#e3f4f3");
                return gradient;
            }
        },
        "1": {
            name: "Level Two",
            sName: "Two",
            color: "#339933",
            snakeLength: 12,
            time: 120, //seconds
            objective: 10, //foods
            speed: 12, //snake speed
            message: "Eat 10 foods on time to complete this level.",
            background: function () {
                var gradient = game.gameContext.createLinearGradient(300, 150, 350, 420);
                gradient.addColorStop(0, "#f4ebe8");
                gradient.addColorStop(0.35, "#e8f4ec");
                gradient.addColorStop(0.7, "#f7e6eb");
                gradient.addColorStop(1, "#e6ebf7");
                return gradient;
            }
        },
        "2": {
            name: "Level Three",
            sName: "Three",
            color: "#ed4ee5",
            snakeLength: 15,
            time: 120, //seconds
            objective: 15, //foods
            speed: 14, //snake speed
            message: "Eat 15 foods on time to complete this level.",
            background: function () {
                var gradient = game.gameContext.createLinearGradient(100, 200, 300, 400);
                gradient.addColorStop(0, "#f7e8e3");
                gradient.addColorStop(0.35, "#e8f4ec");
                gradient.addColorStop(0.7, "#effffd");
                gradient.addColorStop(1, "#feefff");
                return gradient;
            }
        },
        "3": {
            name: "Level Four",
            sName: "Four",
            color: "#FF9933",
            snakeLength: 15,
            time: 90, //seconds
            objective: 10, //foods
            speed: 16, //snake speed
            message: "Eat 10 foods on time to complete this level.",
            background: function () {
                var gradient = game.gameContext.createLinearGradient(250, 80, 300, 400);
                gradient.addColorStop(0, "#f9eaf8");
                gradient.addColorStop(0.35, "#dddddd");
                gradient.addColorStop(0.7, "#eaf9f7");
                gradient.addColorStop(1, "#f9f6ea");
                return gradient;
            }
        },
        "4": {
            name: "Level Five",
            sName: "Five",
            color: "#9900CC",
            snakeLength: 17,
            time: 90, //seconds
            objective: 12, //foods
            speed: 18, //snake speed
            message: "Eat 12 foods on time to complete this level.",
            background: function () {
                var gradient = game.gameContext.createLinearGradient(400, 300, 250, 100);
                gradient.addColorStop(0, "#ffeff0");
                gradient.addColorStop(0.3, "#feefff");
                gradient.addColorStop(0.7, "#eff4ff");
                gradient.addColorStop(1, "#e3f4f3");
                return gradient;
            }
        },
        "5": {
            name: "Final Level",
            sName: "Bonus",
            color: "#f43a7e",
            snakeLength: 5,
            time: 0, //seconds
            objective: 0, //points
            speed: 20, //snake speed
            message: "Get as much points as you can to get high score till death.",
            background: function () {
                var gradient = game.gameContext.createLinearGradient(100, 200, 300, 400);
                gradient.addColorStop(0, "#fceff9");
                gradient.addColorStop(0.35, "#f7effc");
                gradient.addColorStop(0.7, "#effcfb");
                gradient.addColorStop(1, "#f9fcef");
                return gradient;
            }
        }
    }
}