/* Memory Manager
*/
var TSOS;
(function (TSOS) {
    var MemoryManager = (function () {
        function MemoryManager(mry, xc, firstPart, secondPart, thirdPart) {
            if (typeof mry === "undefined") { mry = new TSOS.Memory(); }
            if (typeof xc === "undefined") { xc = 0; }
            if (typeof firstPart === "undefined") { firstPart = false; }
            if (typeof secondPart === "undefined") { secondPart = false; }
            if (typeof thirdPart === "undefined") { thirdPart = false; }
            this.mry = mry;
            this.xc = xc;
            this.firstPart = firstPart;
            this.secondPart = secondPart;
            this.thirdPart = thirdPart;
        }
        MemoryManager.prototype.initMemory = function () {
            var i;
            for (i = 0; i < (256 * _NumProgForMem); i++) {
                this.mry.write(i, "00");
            }
        };

        MemoryManager.prototype.setPartitionAsUsed = function (parti) {
            if (parti == 1) {
                this.firstPart = true;
            } else if (parti == 2) {
                this.secondPart = true;
            } else if (parti == 3) {
                this.thirdPart = true;
            }
        };

        MemoryManager.prototype.setPartitionAsUnused = function (parti) {
            if (parti == 1) {
                this.firstPart = false;
            } else if (parti == 2) {
                this.secondPart = false;
            } else if (parti == 3) {
                this.thirdPart = false;
            }
        };

        MemoryManager.prototype.findNextAvailPart = function () {
            if (this.firstPart == false) {
                return 1;
            } else if (this.secondPart == false) {
                return 2;
            } else if (this.thirdPart == false) {
                return 3;
            } else {
                return 0;
            }
        };

        MemoryManager.prototype.addToMem = function (input, partition) {
            if (input.length < 2) {
                input = "0" + input;
            }

            this.xc = (256 * partition) - 256;

            for (var l = 0; l < input.length; l = l + 2) {
                //whoopsie
                if ((l / 2) > 255) {
                    //ERROR
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(MEM_OUT_OF_BOUNDS, partition));
                    this.xc = 0;
                    break;
                } else {
                    this.putHex("" + input.charAt(l) + input.charAt(l + 1), partition);
                }
            }
        };

        //partition 1, 2, or 3
        MemoryManager.prototype.addAt = function (i, input, partition) {
            if (input.length < 2) {
                input = "0" + input;
            }

            if ((i > 255) || (i < 0)) {
                //ERROR
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(MEM_OUT_OF_BOUNDS, partition));
                this.xc = 0;
            } else {
                i = ((partition * 256) - 256) + i;
                this.mry.write(i, input);
            }
            /*while(i> ((256*partition)-1)){
            i -= 256*partition;
            }*/
            //this.mry.write(i, input);
        };

        MemoryManager.prototype.getMemValue = function (i, partition) {
            if ((i > 255) || (i < 0)) {
                //ERROR
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(MEM_OUT_OF_BOUNDS, partition));
                this.xc = 0;

                //RETURN SOMETHING?
                return "00";
            } else {
                i = ((partition * 256) - 256) + i;
                return this.mry.read(i);
            }
        };

        MemoryManager.prototype.putHex = function (hex, partition) {
            if ((this.xc > ((256 * partition) - 1)) || (this.xc < 256 * partition - 256)) {
                //this.xc = 256*partition -256; //wrap memory for now
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(MEM_OUT_OF_BOUNDS, partition));
                this.xc = 0;
            } else {
                this.mry.write(this.xc, hex);

                this.xc += 1;
            }
            //this.mry.write(this.xc, hex);
            //this.xc += 1;
        };

        MemoryManager.prototype.clearAllMem = function () {
            this.mry = new TSOS.Memory();
            this.xc = 0;
        };

        //clear memory partition
        MemoryManager.prototype.clearMemoryPartition = function (partition) {
            var i;

            for (i = ((256 * partition) - 256); i < ((256 * partition) - 1); i++) {
                this.mry.write(i, "00");
            }
        };

        MemoryManager.prototype.displayMem = function () {
            //var j = this.xc;
            var counter = 0;
            var s = "0x0: ";

            for (counter = 0; counter < (256 * _NumProgForMem); counter++) {
                if ((counter % 8 == 0) && (counter != 0)) {
                    s += "\n0x" + counter.toString(16) + ": ";
                }

                s += this.mry.read(counter) + " ";
            }

            return s;
        };
        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
