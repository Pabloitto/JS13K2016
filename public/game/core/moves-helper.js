module.exports = function() {
    return {
        alreadyInit: false,
        moves: [],
        cell: null,
        end: null,
        cells: [],
        x: 0,
        y: 0,
        init: function(p) {
            this.cells = p.cells;
            this.cell = p.cell;
            this.end = p.end;
            this.moves = [];
            this.x = 0;
            this.y = 0;
            this.alreadyInit = true;
        },
        setEnd: function(pEnd) {
            this.end = pEnd;
        },
        getMoves: function() {
            return this.moves;
        },
        moveTo: function(direction) {
            var nextMove = this.getNextMove(direction);
            this.moves.push(nextMove);
            return nextMove;
        },
        canMoveTo: function(direction) {
            var lastMove = this.moves[this.moves.length - 1] || this.getSingleMove();
            return lastMove.walls[direction] === null;
        },
        getNextMove: function(direction) {

            switch (direction) {
                case 'left':
                    this.cell.x -= 1;
                    break;
                case 'right':
                    this.cell.x += 1;
                    break;
                case 'bottom':
                    this.cell.y += 1;
                    break;
                case 'top':
                    this.cell.y -= 1;
                    break;
            }

            var result = this.getSingleMove();

            this.x = result.x;
            this.y = result.y;

            return result;

        },
        isComplete: function() {
            return this.cell.x === this.end.x && this.cell.y === this.end.y;
        },
        getSingleMove: function() {
            var initialNode = this.cells[this.cell.x][this.cell.y];

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
    }
};