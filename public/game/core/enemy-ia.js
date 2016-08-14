(function() {

    var visited = [{ x: 0, y: 0 }],
        steps = 0,
        safePoints = [],
        x = 0,
        y = 0;

    module.exports = function(callBack) {

        this.update = function() {
            this.solve(this.getAvailableMoves());
        }

        this.solve = function(moves) {
            var nextMove = this.rdmMove(moves);

            if (this.isComplete()) {
                if (callBack) {
                    callBack();
                }
                this.complete = true;
                return;
            }

            if (nextMove) {
                safePoints.push(nextMove);
                this.tryMoveTo(nextMove);
                this.solve(this.getAvailableMoves());
            } else {
                var lastSafePoint = safePoints.pop();
                if (lastSafePoint) {
                    this.tryMoveTo(this.switch(lastSafePoint));
                    this.solve(this.getAvailableMoves());
                }
            }
        }

        this.tryMoveTo = function(dir) {

            switch (dir) {
                case 'bottom':
                    y += 1;
                    break;
                case 'right':
                    x += 1;
                    break;
                case 'left':
                    x -= 1;
                    break;
                case 'top':
                    y -= 1;
                    break;
            }

            if (this.canMoveTo(dir)) {
                visited.push({ x: x, y: y });
                steps++;
                return this.moveTo(dir);
            }
        }

        this.switch = function(dir) {
            switch (dir) {
                case 'bottom':
                    return 'top';
                case 'right':
                    return 'left';
                case 'left':
                    return 'right';
                case 'top':
                    return 'bottom';
            }
        }

        this.rdmMove = function(moves) {
            moves = moves.filter(function(m) {
                return this.isAvailableMove(m, x, y);
            }.bind(this));

            if (moves.length === 0) {
                return;
            }

            var index = Math.floor(Math.random() * moves.length);

            return moves[index];
        }

        this.getAvailableMoves = function() {
            return [
                this.canMoveTo('bottom') ? 'bottom' : undefined,
                this.canMoveTo('right') ? 'right' : undefined,
                this.canMoveTo('left') ? 'left' : undefined,
                this.canMoveTo('top') ? 'top' : undefined
            ].filter(function(m) {
                return m !== undefined
            });
        }

        this.isAvailableMove = function(dir, posX, posY) {
            switch (dir) {
                case 'bottom':
                    posY += 1;
                    break;
                case 'right':
                    posX += 1;
                    break;
                case 'left':
                    posX -= 1;
                    break;
                case 'top':
                    posY -= 1;
                    break;
            }

            return !this.wasVisited({
                x: posX,
                y: posY
            });
        }

        this.wasVisited = function(pNode) {
            return visited.filter(function(node) {
                return pNode.x === node.x && pNode.y === node.y;
            }).length > 0;
        }

        this.update();

    };
}());