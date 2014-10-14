/*---------------------------
Memory.ts
Memory Prototype
*/
var TSOS;
(function (TSOS) {
    var Memory = (function () {
        function Memory(mem) {
            if (typeof mem === "undefined") { mem = new Array(); }
            this.mem = mem;
        }
        Memory.prototype.write = function (i, hex) {
            this.mem[i] = hex;
        };

        Memory.prototype.readAll = function () {
            return this.mem;
        };

        Memory.prototype.read = function (i) {
            return this.mem[i];
        };

        Memory.prototype.filledTo = function () {
            return this.mem.length;
        };
        return Memory;
    })();
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
