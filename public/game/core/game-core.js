module.exports = (function() {

    var canvas = null,
        context = null,
        keyEventHelper = null,
        config = require('./config'),
        MazeCore = require('./maze'),
        MazePaint = require('./maze-paint'),
        movesHelper = require('./moves-helper'),
        maze = null;

    function init(p) {
        canvas = p.canvas;
        context = p.context;
        keyEventHelper = p.keyEventHelper;
        return this;
    }

    function start() {
        var mazeGenerator = new MazeCore({
            width: config.dimensions.x,
            height: config.dimensions.y
        });

        maze = new MazePaint({
            width: config.dimensions.x,
            height: config.dimensions.y,
            cells: mazeGenerator.cells
        });

        this.update();

        return {
            then: function(callBack) {
                if (callBack && typeof callBack === "function") {
                    callBack();
                }
            }
        }
    }

    function update() {
        this.draw();
        this.listenEvents();
        requestAnimationFrame(this.update.bind(this));
    }

    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        maze.draw(context);
    }

    function listenEvents() {
        var k = keyEventHelper.getKeys();
        var commands = keyEventHelper.getKeyCommands();
        if (k[commands.UP]) {
            console.log("UP");
        }
        if (k[commands.DOWN]) {
            console.log("DOWN");
        }
        if (k[commands.RIGHT]) {
            console.log("RIGHT");
        }
        if (k[commands.LEFT]) {
            console.log("LEFT");
        }
    }

    return {
        init: init,
        listenEvents: listenEvents,
        start: start,
        update: update,
        draw: draw
    };

}());