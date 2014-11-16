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
                this.putHex("" + input.charAt(l) + input.charAt(l + 1), partition);
            }
        };

        //partition 1, 2, or 3
        MemoryManager.prototype.addAt = function (i, input, partition) {
            if (input.length < 2) {
                input = "0" + input;
            }

            while (i > ((256 * partition) - 1)) {
                i -= 256 * partition;
            }

            this.mry.write(i, input);
        };

        MemoryManager.prototype.getMemValue = function (i, partition) {
            while (i > ((256 * partition) - 1)) {
                i -= 256 * partition;
            }
            return this.mry.read(i);
        };

        MemoryManager.prototype.putHex = function (hex, partition) {
            if (this.xc > ((256 * partition) - 1)) {
                this.xc = 256 * partition - 256; //wrap memory for now
            }

            this.mry.write(this.xc, hex);

            this.xc += 1;
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

            //if empty
            /*if(j == 0){
            for(var i = 0; i< (256*_NumProgForMem); i++){
            if ((i%8 ==0) && (i != 0)){
            s+="\n0x"+ i.toString(16)+": ";
            }
            
            s += "00 ";
            
            //initialize Array I suppose? :0
            
            }
            
            //otherwise
            }else{
            
            if(j > ((256*_NumProgForMem) -1)){
            //we are out of memory!!! Not sure what to do, so I'll wrap memory for now
            this.xc = 0;
            }
            
            //output whats there
            for(var i = 0; i< j; i++){
            
            if ((i%8 ==0) && (i != 0)){
            s+="\n0x"+ i.toString(16)+": ";
            }
            
            s += this.mry.read(i) +" ";
            }
            
            //if theres still spots to fill (due to wrapping or cleared memory)
            if(this.mry.filledTo() > j){
            for(var k = j; k< (256*_NumProgForMem); k++){
            
            if ((k%8 ==0) && (k != 0)){
            s+="\n0x"+ k.toString(16)+": ";
            }
            
            s+= "00 "
            }
            
            //otherwise continue filling
            }else{
            for(var k = j; k< this.mry.filledTo(); k++){
            
            if ((k%8 ==0) && (k != 0)){
            s+="\n0x"+ k.toString(16)+": ";
            }
            
            s += this.mry.read(k) +" ";
            }
            
            for(var m = this.mry.filledTo(); m< (256*_NumProgForMem); m++){
            
            if ((m%8 ==0) && (m != 0)){
            s+="\n0x"+ m.toString(16)+": ";
            }
            
            s += "00 ";
            }
            }
            }*/
            return s;
        };
        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
