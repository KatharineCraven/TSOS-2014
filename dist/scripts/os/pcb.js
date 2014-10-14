/* Process Control Block
*/
var TSOS;
(function (TSOS) {
    var PCB = (function () {
        function PCB(pid, processState, pc, xReg, yReg, accumulator, zFlag) {
            if (typeof pid === "undefined") { pid = _pidCount; }
            if (typeof processState === "undefined") { processState = "NEW"; }
            if (typeof pc === "undefined") { pc = 0; }
            if (typeof xReg === "undefined") { xReg = 0; }
            if (typeof yReg === "undefined") { yReg = 0; }
            if (typeof accumulator === "undefined") { accumulator = 0; }
            if (typeof zFlag === "undefined") { zFlag = 0; }
            this.pid = pid;
            this.processState = processState;
            this.pc = pc;
            this.xReg = xReg;
            this.yReg = yReg;
            this.accumulator = accumulator;
            this.zFlag = zFlag;
        }
        PCB.prototype.setState = function (status) {
            this.processState = status;
        };

        PCB.prototype.getState = function () {
            return this.processState;
        };

        PCB.prototype.setPC = function (thePC) {
            this.pc = thePC;
        };

        PCB.prototype.getPC = function () {
            return this.pc;
        };

        PCB.prototype.getPid = function () {
            return this.pid;
        };

        PCB.prototype.setXReg = function (x) {
            this.xReg = x;
        };

        PCB.prototype.getXReg = function () {
            return this.xReg;
        };

        PCB.prototype.setYReg = function (y) {
            this.yReg = y;
        };

        PCB.prototype.getYReg = function () {
            return this.yReg;
        };

        PCB.prototype.setAccum = function (acc) {
            this.accumulator = acc;
        };

        PCB.prototype.getAccum = function () {
            return this.accumulator;
        };

        PCB.prototype.setZFlag = function (z) {
            this.zFlag = z;
        };

        PCB.prototype.getZFlag = function () {
            return this.zFlag;
        };
        return PCB;
    })();
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
