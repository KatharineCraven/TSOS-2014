/*---------------------------
Memory.ts
Memory Prototype
*/
var TSOS;
(function (TSOS) {
    var Memory = (function () {
        function Memory(mem, xc) {
            if (typeof mem === "undefined") { mem = new Array(); }
            if (typeof xc === "undefined") { xc = 0; }
            this.mem = mem;
            this.xc = xc;
        }
        Memory.prototype.setLength = function () {
            this.mem.length = 256;
        };

        Memory.prototype.addToMem = function (hex) {
            if (this.xc > 255) {
                this.xc = 0; //wrap memory for now
            }

            this.mem[this.xc] = hex;

            this.xc += 1;
        };

        Memory.prototype.displayMem = function () {
            var j = this.xc;
            var s = "";
            if (j == 0) {
                for (var i = 0; i < 256; i++) {
                    s += "00 ";
                }
            } else if (j < 256) {
                for (var i = 0; i < this.mem.length; i++) {
                    s += this.mem[i] + " ";
                }

                for (var k = j; i < 2; k++) {
                    s += "00 ";
                }
            }

            for (var i = 1; i < 256; i++) {
                s += "00 ";
            }

            return s;
        };
        return Memory;
    })();
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
