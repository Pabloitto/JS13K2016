module.exports = (function() {

    var Wall = require("./wall"),
        config = require("./config");

    function Cell(rawCell) {
        this.walls = {
            left: null,
            right: null,
            top: null,
            bottom: null
        };
        this.init(rawCell);
    }

    Cell.prototype = {
        names: ["left", "right", "top", "bottom"],
        x: 0,
        y: 0,
        width: config.cellSize,
        height: config.cellSize,
        visited: false,
        walls: {
            left: null,
            right: null,
            top: null,
            bottom: null
        },
        init: function(props) {
            this.x = props.x;
            this.y = props.y;
            this.width = props.width;
            this.height = props.height;
            this.createWalls(props.walls);
        },
        createWalls: function(props) {
            var self = this;
            for (var p in props) {
                var obj = props[p];
                if (!obj) {
                    this.walls[p] = null;
                } else {
                    this.walls[p] = new Wall({
                        name: p,
                        x: obj.x,
                        y: obj.y,
                        height: obj.height,
                        width: obj.width
                    });
                }
            }
        },
        draw: function(context) {
            this.names.forEach(function(name) {
                var wall = this.walls[name];
                if (wall) {
                    wall.draw(context);
                }
            }, this);
        }
    };

    return Cell;

}());