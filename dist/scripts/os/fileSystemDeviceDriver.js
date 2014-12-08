var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    var FileSystemDeviceDriver = (function (_super) {
        __extends(FileSystemDeviceDriver, _super);
        //private masterBoot = "000";
        //private filenameStart = "001";
        //private filenameEnd = "077";
        //private dataStart = "100";
        //private dataEnd = "377";
        function FileSystemDeviceDriver() {
            // Override the base method pointers.
            //super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            _super.call(this, this.krnFsddDriverEntry(), this.init());
        }
        FileSystemDeviceDriver.prototype.krnFsddDriverEntry = function () {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        };

        FileSystemDeviceDriver.prototype.init = function () {
            var initI = "";

            for (var i = 0; i < 60; i++) {
                //** will be displayed as 0, it is used as a character to inform that there is nothing stored here
                initI = initI + "@@";
            }

            for (var t = 0; t < 4; t++) {
                for (var s = 0; s < 8; s++) {
                    for (var b = 0; b < 8; b++) {
                        sessionStorage.setItem("" + t + s + b, "0" + "000" + initI);
                    }
                }
            }
        };

        FileSystemDeviceDriver.prototype.stringToHex = function (strValue) {
            var hex = "";
            var hexVal = "";

            for (var i = 0; i < strValue.length; i++) {
                hex = strValue.charCodeAt(i).toString(16);

                //make sure its even
                if (hex.length != 2) {
                    hex = "0" + hex;
                }

                hexVal = hexVal + hex;
            }

            return hexVal;
        };

        FileSystemDeviceDriver.prototype.hexToString = function (hexValue) {
            //cuts off unnecessary parts
            var hV = this.cutOffHex(hexValue);
            var stringVal = "";

            //makes sure its even, even though it should be.
            if ((hV.length % 2) != 0) {
                hV = "0" + hV;
            }

            for (var i = 0; i < hV.length; i = i + 2) {
                stringVal = stringVal + String.fromCharCode(parseInt(hV.substring(i, i + 2), 16));
            }

            return stringVal;
        };

        //cut off unnecessary parts
        FileSystemDeviceDriver.prototype.cutOffHex = function (hexValue) {
            var cut = 120;

            for (var i = 0; i < hexValue.length; i++) {
                if (hexValue.substring(i, i + 1) === "@") {
                    cut = i;
                    break;
                }
            }

            return hexValue.substring(0, cut);
        };

        FileSystemDeviceDriver.prototype.displayDrive = function () {
            var st = "";
            var str = "";

            for (var t = 0; t < 4; t++) {
                for (var s = 0; s < 8; s++) {
                    for (var b = 0; b < 8; b++) {
                        st = sessionStorage.getItem("" + t + s + b);
                        st = st.replace(/@/g, "0");
                        str = str + t + s + b + "| " + st.substring(0, 1) + " " + st.substring(1, 4) + " " + st.substring(4, 120) + "\n";
                        //output
                    }
                }
            }

            return str;
        };

        FileSystemDeviceDriver.prototype.findNameSpace = function () {
            //find available spot for filename
            var trSeBl = "@@@";

            for (var i = 1; i < 78; i++) {
                if (i < 10) {
                    trSeBl = "00" + i;
                } else {
                    trSeBl = "0" + i;
                }

                if (sessionStorage.getItem(trSeBl).substring(0, 1) === "0") {
                    return trSeBl;
                }
            }

            return "@@@";
        };

        FileSystemDeviceDriver.prototype.findDataSpace = function () {
            var tsb = "";
            for (var t = 1; t < 4; t++) {
                for (var s = 0; s < 8; s++) {
                    for (var b = 0; b < 8; b++) {
                        tsb = "" + t + s + b;
                        if (sessionStorage.getItem(tsb).substring(0, 1) === "0") {
                            return tsb;
                        }
                    }
                }
            }

            return "@@@";
        };

        FileSystemDeviceDriver.prototype.testFilenameSuccess = function (nameInString, tkSrBk) {
            var test = sessionStorage.getItem(tkSrBk).substring(4, 120);
            test = this.hexToString(test);

            if (test === nameInString) {
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(FILENAME_SUCCESS_IRQ, nameInString));
            } else {
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(FILENAME_FAILURE_IRQ, "Failure to create filename."));
            }
        };

        FileSystemDeviceDriver.prototype.createFileName = function (nameInString) {
            var nameInHex = this.stringToHex(nameInString);
            var nameSpace = this.findNameSpace();

            if (nameSpace === "@@@") {
                //OUT OF VIRTUAL MEMORY ERROR
                //make interrupt
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(FILENAME_FAILURE_IRQ, "Out of memory for file."));
            } else {
                if (nameInHex.length > 120) {
                    //Error- filename too big
                } else if (nameInHex.length < 120) {
                    var ss = sessionStorage.getItem(nameSpace).substring(nameInHex.length, 120);
                    var stsb = sessionStorage.getItem(nameSpace).substring(1, 4);
                    sessionStorage.setItem(nameSpace, "1" + stsb + nameInHex + ss);
                } else {
                    sessionStorage.setItem(nameSpace, 1 + stsb + nameInHex);
                }

                this.testFilenameSuccess(nameInString, nameSpace);
            }
        };
        return FileSystemDeviceDriver;
    })(TSOS.DeviceDriver);
    TSOS.FileSystemDeviceDriver = FileSystemDeviceDriver;
})(TSOS || (TSOS = {}));
