(function() {
    var canvas = null;
    var context = null;
    var gameCore = require('./core/game-core');
    var config = require('./core/config');
    var keyevents = require('./core/keyevents');

    function startGame() {
        var keyEventHelper = new keyevents({
            element: document,
            start: function() {}
        });
        canvas = document.getElementById('canvas-game');
        context = canvas.getContext("2d");
        canvas.width = config.dimensions.x * config.cellSize;
        canvas.height = config.dimensions.y * config.cellSize;
        gameCore.init({
            keyEventHelper: keyEventHelper,
            canvas: canvas,
            context: context
        }).start();
    }


    window.onload = startGame;
}());