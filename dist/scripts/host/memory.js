/*---------------------------
Memory.ts
Memory Prototype
*/
var TSOS;
(function (TSOS) {
    var Memory = (function () {
        function Memory(mem, xc) {
            if (typeof mem === "undefined") { mem = []; }
            if (typeof xc === "undefined") { xc = 0; }
            this.mem = mem;
            this.xc = xc;
            for (var i = 0; i < 256; i++) {
                this.mem.push("Hi");
            }
        }
        Memory.prototype.setLength = function () {
            this.mem.length = 256;
        };

        Memory.prototype.addToMem = function (hex) {
            this.xc += 1;
            if (this.xc > 255) {
                this.xc = 0; //wrap memory for now
            }

            this.mem.push(hex);
        };

        Memory.prototype.displayMem = function () {
            var s = this.mem[0];
            for (var i = 1; i < this.mem.length; i++) {
                s += this.mem[i];
            }

            return s;
        };
        return Memory;
    })();
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
