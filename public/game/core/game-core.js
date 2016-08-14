module.exports = (function() {

    var canvas = null,
        context = null,
        keyEventHelper = null,
        config = require('./config'),
        MazeCore = require('./maze'),
        MazePaint = require('./maze-paint'),
        movesHelper = require('./moves-helper')(),
        enemyIA = require("./enemy-ia"),
        enemyMovesHelper = require("./moves-helper")(),
        glitch = require('./libs/glitch-canvas.min'),
        maze = null,
        currentMove = null,
        enemy = null,
        exit = null,
        glitchMaze = null,
        originalMaze = null,
        lastSolution = null,
        currentSolutionPath = null,
        glitchActive = true,
        gameOver = false,
        gameIntervals = {
            updatePath: null,
            paintMove: null
        };

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

        var rdmPos = mazeGenerator.getRandomPosition();

        enemy = maze.cells[rdmPos.x][rdmPos.y];

        movesHelper.init({
            cells: mazeGenerator.cells,
            cell: currentMove
        });

        /*setInterval(function() {
            glitchActive = false;
            setTimeout(function() {
                glitchActive = true;
            }, 25000);
        }, 2000);*/

        //setInterval(createGlitch, 25000);

        pursue(mazeGenerator);

        this.update();

        originalMaze = context.getImageData(0, 0, canvas.width, canvas.height);

        //createGlitch();

        return {
            then: function(callBack) {
                if (callBack && typeof callBack === "function") {
                    callBack();
                }
            }
        }
    }

    function createGlitch() {
        glitch({
                seed: Math.random() * 99,
                quality: Math.random() * 99,
                amount: 35,
                iterations: 20
            })
            .fromImageData(originalMaze)
            .toDataURL()
            .then(function(dataURL) {
                glitchMaze = new Image();
                glitchMaze.src = dataURL;
            });
    }

    function update() {
        this.draw();
        this.listenEvents();
        requestAnimationFrame(this.update.bind(this));
    }

    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        if (glitchMaze && glitchActive === true && !gameOver) {
            context.drawImage(glitchMaze, 0, 0, canvas.width, canvas.height);
        } else {
            maze.draw(context);
        }
        if (currentMove) {
            maze.fillCell(context, currentMove, "blue");
        }

        if (enemy) {
            maze.fillCell(context, enemy, "red");
        }
    }

    function listenEvents() {
        if (gameOver) return;
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

    function pursue(mazeGenerator) {
        gameIntervals.updatePath = setInterval(function() {
            if (enemy && currentMove) {
                if (lastSolution === null) {
                    lastSolution = {
                        x: currentMove.x,
                        y: currentMove.y
                    };
                    currentSolutionPath = getSolutionPath(mazeGenerator);
                } else {
                    if (lastSolution.x !== currentMove.x || lastSolution.y !== currentMove.y) {
                        lastSolution = {
                            x: currentMove.x,
                            y: currentMove.y
                        };
                        currentSolutionPath = getSolutionPath(mazeGenerator);
                    }
                }
            }
        }, 1000);

        gameIntervals.paintMove = setInterval(function() {
            if (enemy.x === currentMove.x && enemy.y === currentMove.y) {
                onComplete();
                return;
            }
            if (currentSolutionPath && currentSolutionPath.length > 0) {
                var m = currentSolutionPath.shift();
                if (m) {
                    enemy.x = m.x;
                    enemy.y = m.y;
                }
            }
        }, 1000);

    }

    function getSolutionPath(mazeGenerator) {

        if (enemyMovesHelper.alreadyInit) {
            enemyMovesHelper.setEnd(currentMove);
        } else {
            enemyMovesHelper.init({
                cells: mazeGenerator.cells,
                end: currentMove,
                cell: {
                    x: enemy.x,
                    y: enemy.y,
                    width: enemy.width,
                    height: enemy.height,
                    walls: {
                        right: enemy.walls.right,
                        left: enemy.walls.left,
                        top: enemy.walls.top,
                        bottom: enemy.walls.bottom
                    }
                }
            });
        }

        enemyIA.bind(enemyMovesHelper)();

        return enemyMovesHelper.getMoves();
    }

    function onComplete() {
        currentSolutionPath = null;
        clearInterval(gameIntervals.updatePath);
        clearInterval(gameIntervals.paintMove);
        gameIntervals.updatePath = null;
        gameIntervals.paintMove = null;
        gameOver = true;
    }

    return {
        init: init,
        listenEvents: listenEvents,
        start: start,
        update: update,
        draw: draw
    };

}());