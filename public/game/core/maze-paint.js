module.exports = (function() {

    var Cell = require("./cell");

    function Maze(props) {
        this.init(props);
    }

    Maze.prototype = {
        width: 0,
        height: 0,
        cells: [],
        init: function(props) {
            this.width = props.width;
            this.height = props.height;
            this.createCells(props.cells);
        },
        createCells: function(rawCells) {
            for (var i = 0; i < rawCells.length; i++) {
                this.cells[i] = [];
                for (var j = 0; j < rawCells[i].length; j++) {
                    this.cells[i][j] = new Cell(rawCells[i][j]);
                }
            }
        },
        draw: function(context) {
            this.cells.forEach(function(rows) {
                rows.forEach(function(cell) {
                    cell.draw(context);
                });
            });
        },
        fillCell: function(context, cell, color) {
            context.fillStyle = color;
            var x = (cell.x * cell.width) + 5;
            var y = (cell.y * cell.height) + 5;
            context.fillRect(x, y, cell.width / 2, cell.height / 2);
        },
        getRandomPosition: function() {
            return {
                x: Math.floor(Math.random() * this.width),
                y: Math.floor(Math.random() * this.height)
            }
        }
    };

    return Maze;

}());