module.exports = function(o) {
    var KC = {
        UP: 38,
        DOWN: 40,
        LEFT: 37,
        RIGHT: 39,
        R: 114,
        r: 82,
        ENTER: 13
    };
    var keys = [];

    function init() {
        bindEvents();
    }

    function getKeyCommands() {
        return KC;
    }

    function bindEvents() {
        o.element.addEventListener('keyup', ku, false);
        o.element.addEventListener('keydown', kd, false);
    }

    function kd(e) {
        keys[e.keyCode] = 1;
        if (e.keyCode == KC.ENTER) o.start();

    }

    function ku(e) {
        keys[e.keyCode] = 0;
    }

    function getKeys() {
        return keys;
    }

    init();

    return {
        getKeyCommands: getKeyCommands,
        getKeys: getKeys
    };
};