var cells = [];
var moves = [];
var cell = null;
var context = null;
module.exports = {
    x : 0,
    y : 0,
    init: function(p) {
        cells = p.cells;
        cell = p.cell;
        moves = [];
        this.x = 0;
        this.y = 0;
    },
    moveTo: function(direction) {
        var nextMove = this.getNextMove(direction);
        moves.push(nextMove);
        return nextMove;
    },
    canMoveTo: function(direction) {
        var lastMove = moves[moves.length - 1] || this.getSingleMove();
        return lastMove.walls[direction] === null;
    },
    getNextMove: function(direction) {

        switch (direction) {
            case 'left':
                cell.x -= 1;
                break;
            case 'right':
                cell.x += 1;
                break;
            case 'bottom':
                cell.y += 1;
                break;
            case 'top':
                cell.y -= 1;
                break;
        }

        var result = this.getSingleMove();

        this.x = result.x;
        this.y = result.y;

        return result;

    },
    getSingleMove: function() {
        var initialNode = cells[cell.x][cell.y];

        return {
            x: initialNode.x,
            y: initialNode.y,
            width: initialNode.width,
            height: initialNode.height,
            walls: {
                right: initialNode.walls.right,
                left: initialNode.walls.left,
                top: initialNode.walls.top,
                bottom: initialNode.walls.bottom
            }
        };
    }
};