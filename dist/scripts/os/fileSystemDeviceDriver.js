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

            return hexVal.toUpperCase();
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
                        str = str + t + s + b + "| " + st.substring(0, 1) + " " + st.substring(1, 4) + " " + st.substring(4, 124) + "\n";
                        //output
                    }
                }
            }

            return str;
        };

        FileSystemDeviceDriver.prototype.swapFiles = function (pcbOnDisk) {
            //debugger;
            var diskTSB = this.findFileName("." + pcbOnDisk.getPid());
            var hexOnDisk = sessionStorage.getItem(diskTSB);

            if (_MemoryManager.findNextAvailPart() == 0) {
                var pcbForSwap;

                if (_ReadyQueue.getSize >= 0) {
                    for (var i = 0; i < _ReadyQueue.getSize(); i++) {
                        pcbForSwap = _ReadyQueue.dequeue();
                        _ReadyQueue.enqueue(pcbForSwap);
                    }
                } else {
                    for (var i = 0; i < _ResidentList.length; i++) {
                        if (_ResidentList[i] != null) {
                            pcbForSwap = _ResidentList[i];
                            break;
                        }
                    }
                }

                //memory partition
                var memPart = pcbForSwap.getPartition();

                //hex from memory
                var hexFromMem = "";

                for (var j = 0; j < 256; j++) {
                    hexFromMem = hexFromMem + _MemoryManager.getMemValue(j, memPart);
                }

                //clears memory partition
                _MemoryManager.clearMemoryPartition(memPart);
                _MemoryManager.setPartitionAsUnused(memPart);

                //gets base and limit registers and partition
                pcbOnDisk.setPartition(memPart);

                //adds data to memory
                _MemoryManager.addToMem(this.readFile("." + pcbOnDisk.getPid()).toUpperCase(), memPart);
                _MemoryManager.setPartitionAsUsed(memPart);

                //clears file
                this.clearData(diskTSB);

                //debugger;
                this.createFileName("." + pcbForSwap.getPid());
                this.writeFile("." + pcbForSwap.getPid(), hexFromMem);

                pcbForSwap.setLocation("disk");
            } else {
                var nap = _MemoryManager.findNextAvailPart();
                pcbOnDisk.setPartition(nap);
                _MemoryManager.setPartitionAsUsed(nap);
                _MemoryManager.addToMem(this.readFile("." + pcbOnDisk.getPid()).toUpperCase(), nap);
                this.clearData(diskTSB);
            }

            pcbOnDisk.setLocation("memory");

            return pcbOnDisk;
        };

        FileSystemDeviceDriver.prototype.getAllFilenames = function () {
            var filenames = "";
            var strn = "";

            for (var s = 0; s < 8; s++) {
                for (var b = 0; b < 8; b++) {
                    strn = sessionStorage.getItem("0" + s + b);

                    if ((strn.substring(0, 1) === "1") && (strn.substring(4, 5) != ".")) {
                        filenames = filenames + " " + this.hexToString(strn.substring(4, 124));
                    }
                }
            }

            if (filenames === "") {
                filenames = "No files on disk.";
            }
            return filenames;
        };

        FileSystemDeviceDriver.prototype.findNameSpace = function () {
            //find available spot for filename
            var trSeBl = "@@@";

            for (var i = 0; i < 8; i++) {
                for (var j = 0; j < 8; j++) {
                    if ((i + j) != 0) {
                        trSeBl = "0" + i + j;

                        if (sessionStorage.getItem(trSeBl).substring(0, 1) === "0") {
                            return trSeBl;
                        }
                    }
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
            var test = sessionStorage.getItem(tkSrBk).substring(4, 124);
            test = this.hexToString(test);

            if (test === nameInString) {
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(FILENAME_SUCCESS_IRQ, nameInString));
            } else {
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(FILENAME_FAILURE_IRQ, "Failure to create filename."));
            }
        };

        FileSystemDeviceDriver.prototype.createFileName = function (nameInString) {
            //debugger;
            var nameInHex = this.stringToHex(nameInString);
            var nameSpace = this.findNameSpace();

            if (nameSpace === "@@@") {
                //OUT OF VIRTUAL MEMORY ERROR
                //make interrupt
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(FILENAME_FAILURE_IRQ, "Out of disk space for file."));
            } else if (this.findFileName(nameInString) != "@@@") {
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(FILENAME_FAILURE_IRQ, "Filename already exists"));
            } else {
                if (nameInHex.length > 120) {
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(FILENAME_FAILURE_IRQ, "Filename too large."));
                } else if (nameInHex.length < 120) {
                    var ss = sessionStorage.getItem(nameSpace).substring((nameInHex.length + 4), 124);
                    var stsb = sessionStorage.getItem(nameSpace).substring(1, 4);
                    sessionStorage.setItem(nameSpace, "1" + stsb + nameInHex + ss);
                } else {
                    sessionStorage.setItem(nameSpace, 1 + stsb + nameInHex);
                }

                if (nameInString.substring(0, 1) != ".") {
                    this.testFilenameSuccess(nameInString, nameSpace);
                }
            }
        };

        FileSystemDeviceDriver.prototype.deleteFile = function (filename) {
            //debugger;
            if (this.findFileName(filename) === "@@@") {
                //error not found
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(DELETE_SUCCESS_FAIL_IRQ, "Cannot find file"));
            } else {
                this.clearData(this.findFileName(filename));

                if (this.findFileName(filename) === "@@@") {
                    //sucess
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(DELETE_SUCCESS_FAIL_IRQ, "Successfully deleted file"));
                } else {
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(DELETE_SUCCESS_FAIL_IRQ, "An error occured deleting file"));
                }
            }
        };

        FileSystemDeviceDriver.prototype.readFile = function (filename) {
            //debugger;
            var fileTSB = this.findFileName(filename);
            var fileNextUp = this.findNextLink(fileTSB);

            if (fileTSB === "@@@") {
                //error: filename does not exist
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(READ_ERROR_IRQ, "Filename does not exist."));
            } else if (fileNextUp === "000") {
                return "";
            } else {
                //return string of stuffs
                if (filename.substring(0, 1) != ".") {
                    return this.readTheData(fileNextUp);
                } else {
                    return this.readTheDataRegular(fileNextUp);
                }
            }
        };

        FileSystemDeviceDriver.prototype.readTheData = function (aTSB) {
            var theRawData = sessionStorage.getItem(aTSB).substring(4, 124);
            var nextTSB = sessionStorage.getItem(aTSB).substring(1, 4);
            var theData = this.hexToString(theRawData);

            if (nextTSB != "000") {
                var theTotalData = theData + this.readTheData(nextTSB);
                return theTotalData;
            }

            return theData;
        };

        FileSystemDeviceDriver.prototype.readTheDataRegular = function (aTSB) {
            var theRawData = sessionStorage.getItem(aTSB).substring(4, 124);
            var nextTSB = sessionStorage.getItem(aTSB).substring(1, 4);
            var theData = this.cutOffHex(theRawData);

            if (nextTSB != "000") {
                var theTotalData = theData + this.readTheDataRegular(nextTSB);
                return theTotalData;
            }

            return theData;
        };

        //assume its already stripped of quotations --- need to write success/failure
        FileSystemDeviceDriver.prototype.writeFile = function (filename, fileData) {
            var dataHex = "";

            if (filename.substring(0, 1) != ".") {
                dataHex = this.stringToHex(fileData);
            } else {
                dataHex = fileData;
            }
            var fileTSB = this.findFileName(filename);
            var fileNextUp = this.findNextLink(fileTSB);

            if (fileTSB === "@@@") {
                //Filename does not exist
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(WRITE_FAIL_SUCCEED_IRQ, "Write failure- File does not exist."));
            } else if (fileNextUp === "000") {
                //debugger;
                var datSpace = this.getDataSpace(dataHex);

                if (datSpace === "@@@") {
                    //not enough file room
                } else {
                    //datSpace will have a string of shit that I need to fill up, things will be stored in dataspace already
                    //now we have to hook up each spot
                    this.connectTSBs(fileTSB, datSpace.substring(0, 3));

                    if (datSpace.length > 3) {
                        this.linkDataTSBs(datSpace);
                    }
                }

                this.checkCorrectWrite(filename, fileData);
            } else {
                //overwrites data
                this.clearData(fileNextUp);

                var datSpace = this.getDataSpace(dataHex);

                if (datSpace === "@@@") {
                    //not enough file room
                } else {
                    //datSpace will have a string of shit that I need to fill up, things will be stored in dataspace already
                    //now we have to hook up each spot
                    this.connectTSBs(fileTSB, datSpace.substring(0, 3));

                    if (datSpace.length > 3) {
                        this.linkDataTSBs(datSpace);
                    }
                }

                this.checkCorrectWrite(filename, fileData);
            }
        };

        FileSystemDeviceDriver.prototype.checkCorrectWrite = function (fName, fData) {
            debugger;
            var testName = this.readFile(fName);

            if (fName.substring(0, 1) != ".") {
                if (testName === fData) {
                    //success
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(WRITE_FAIL_SUCCEED_IRQ, "Successfully written to " + fName));
                } else {
                    //failure
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(WRITE_FAIL_SUCCEED_IRQ, "Write failure."));
                }
            } else {
                if (testName != fData) {
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(WRITE_FAIL_SUCCEED_IRQ, "Error loading program"));
                }
            }
        };

        FileSystemDeviceDriver.prototype.findNextLink = function (aTSB) {
            if (aTSB === "@@@") {
                return "@@@";
            }
            return sessionStorage.getItem(aTSB).substring(1, 4);
        };

        FileSystemDeviceDriver.prototype.linkDataTSBs = function (tsbs) {
            for (var i = 0; i < (tsbs.length - 3); i = i + 3) {
                this.connectTSBs(tsbs.substring(i, i + 3), tsbs.substring(i + 3, i + 6));
            }
        };

        FileSystemDeviceDriver.prototype.connectTSBs = function (parent, child) {
            var original = sessionStorage.getItem(parent);

            sessionStorage.setItem(parent, "1" + child + original.substring(4, 124));
        };

        FileSystemDeviceDriver.prototype.findFileName = function (filename) {
            var searchTSB = "@@@";
            var inUse = "0";
            var aFile = "";

            for (var i = 0; i < 8; i++) {
                for (var j = 0; j < 8; j++) {
                    if ((i + j) != 0) {
                        searchTSB = "0" + i + j;

                        inUse = sessionStorage.getItem(searchTSB).substring(0, 1);

                        if (inUse === "1") {
                            aFile = sessionStorage.getItem(searchTSB).substring(4, 124);

                            if (this.hexToString(aFile) === filename) {
                                return searchTSB;
                            }
                        }
                    }
                }
            }

            return "@@@";
        };

        FileSystemDeviceDriver.prototype.storeData = function (aTSB, dHex) {
            var mrk = sessionStorage.getItem(aTSB);

            sessionStorage.setItem(aTSB, "1" + "000" + dHex + mrk.substring((4 + dHex.length), 124));
        };

        FileSystemDeviceDriver.prototype.markAsUnused = function (aTSB) {
            var mb = sessionStorage.getItem(aTSB).substring(1, 4);

            var initI = "";

            for (var i = 0; i < 60; i++) {
                //** will be displayed as 0, it is used as a character to inform that there is nothing stored here
                initI = initI + "@@";
            }

            //clears data within
            sessionStorage.setItem(aTSB, "0" + "000" + initI);

            //returns the connected sector that must also be deleted
            return mb;
        };

        FileSystemDeviceDriver.prototype.clearData = function (aTSB) {
            if (aTSB.length > 3) {
                var clr = aTSB.substring(0, 3);

                if (clr != "@@@") {
                    this.markAsUnused(clr);
                }

                this.clearData(aTSB.substring(3, aTSB.length));
            } else {
                var next = "000";

                if (aTSB != "@@@") {
                    next = this.markAsUnused(aTSB);
                }

                //clears the next connected bit of data
                if (next != "000") {
                    this.clearData(next);
                }
            }
        };

        //stores data and returns a string with all locations
        FileSystemDeviceDriver.prototype.getDataSpace = function (dHex) {
            var xs = "";
            var tsb = "";

            if (dHex.length > 120) {
                return this.getDataSpace(dHex.substring(0, 120)) + this.getDataSpace(dHex.substring(120, dHex.length));
            }

            var fds = this.findDataSpace();

            if (fds === "@@@") {
                return "@@@";
            }

            this.storeData(fds, dHex);

            xs = xs + fds;

            if (xs.indexOf("@@@") != -1) {
                this.clearData(xs);
                return "@@@";
            }

            return xs;
        };
        return FileSystemDeviceDriver;
    })(TSOS.DeviceDriver);
    TSOS.FileSystemDeviceDriver = FileSystemDeviceDriver;
})(TSOS || (TSOS = {}));
