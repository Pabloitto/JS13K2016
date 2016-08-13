module.exports = (function() {

    var canvas = null,
        context = null,
        keyEventHelper = null,
        config = require('./config'),
        MazeCore = require('./maze'),
        MazePaint = require('./maze-paint'),
        movesHelper = require('./moves-helper'),
        maze = null,
        currentMove = null;

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

        currentMove = mazeGenerator.cells[0][0];

        movesHelper.init({
            cells: mazeGenerator.cells,
            cell: currentMove
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
        if (currentMove) {
            maze.fillCell(context, currentMove, "blue");
        }
    }

    function listenEvents() {
        var k = keyEventHelper.getKeys();
        var commands = keyEventHelper.getKeyCommands();
        if (k[commands.UP] && movesHelper.canMoveTo("top")) {
            currentMove = movesHelper.moveTo("top");
            k[commands.UP] = 0;
        } else if (k[commands.DOWN] && movesHelper.canMoveTo("bottom")) {
            currentMove = movesHelper.moveTo("bottom");
            k[commands.DOWN] = 0;
        } else if (k[commands.RIGHT] && movesHelper.canMoveTo("right")) {
            currentMove = movesHelper.moveTo("right");
            k[commands.RIGHT] = 0
        } else if (k[commands.LEFT] && movesHelper.canMoveTo("left")) {
            currentMove = movesHelper.moveTo("left");
            k[commands.LEFT] = 0;
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