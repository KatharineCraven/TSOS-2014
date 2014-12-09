///<reference path="../globals.ts" />
/* ------------
CPU.ts
Requires global.ts.
Routines for the host CPU simulation, NOT for the OS itself.
In this manner, it's A LITTLE BIT like a hypervisor,
in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
TypeScript/JavaScript in both the host and client environments.
This code references page numbers in the text book:
Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
------------ */
var TSOS;
(function (TSOS) {
    var Cpu = (function () {
        function Cpu(PC, Acc, Xreg, Yreg, Zflag, instructionReg, isExecuting, baseRegister, limitRegister, part) {
            if (typeof PC === "undefined") { PC = 0; }
            if (typeof Acc === "undefined") { Acc = 0; }
            if (typeof Xreg === "undefined") { Xreg = 0; }
            if (typeof Yreg === "undefined") { Yreg = 0; }
            if (typeof Zflag === "undefined") { Zflag = 0; }
            if (typeof instructionReg === "undefined") { instructionReg = 0; }
            if (typeof isExecuting === "undefined") { isExecuting = false; }
            if (typeof baseRegister === "undefined") { baseRegister = 0; }
            if (typeof limitRegister === "undefined") { limitRegister = 255; }
            if (typeof part === "undefined") { part = 1; }
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.instructionReg = instructionReg;
            this.isExecuting = isExecuting;
            this.baseRegister = baseRegister;
            this.limitRegister = limitRegister;
            this.part = part;
        }
        Cpu.prototype.init = function () {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.instructionReg = 0;
            this.isExecuting = false;
            this.baseRegister = 0;
            this.limitRegister = 255;
            this.part = 1;
        };

        Cpu.prototype.incrementPC = function () {
            this.PC += 1;

            while (this.PC > this.limitRegister) {
                this.PC -= 256;
            }
            /*   while(this.PC < this.baseRegister){
            this.PC += 256;
            }*/
        };

        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace('CPU cycle');

            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            this.getFromPCB(_CurrentPCB);
            this.getMethod();
        };

        Cpu.prototype.displayCPU = function () {
            var st = "PC: " + this.PC + "\n";
            st += "AC: " + this.Acc + "\n";
            st += "X:  " + this.Xreg + "\n";
            st += "Y:  " + this.Yreg + "\n";
            st += "Z:  " + this.Zflag + "\n";
            st += "IR: " + this.instructionReg.toString(16);

            return st;
        };

        Cpu.prototype.getFromPCB = function (prCoBl) {
            //debugger;
            this.part = prCoBl.getPartition();
            this.PC = prCoBl.getPC();
            this.Acc = prCoBl.getAccum();
            this.Xreg = prCoBl.getXReg();
            this.Yreg = prCoBl.getYReg();
            this.Zflag = prCoBl.getZFlag();
            this.instructionReg = parseInt(_MemoryManager.getMemValue((prCoBl.getPC() - (this.part - 1) * 256), this.part), 16);
            this.baseRegister = prCoBl.getBaseReg();
            this.limitRegister = prCoBl.getLimitReg();
        };

        Cpu.prototype.updatePCB = function () {
            //_ResidentList[_LoadedProgram].setPC(this.PC);
            _CurrentPCB.setPC(this.PC);
            _CurrentPCB.setAccum(this.Acc);
            _CurrentPCB.setXReg(this.Xreg);
            _CurrentPCB.setYReg(this.Yreg);
            _CurrentPCB.setZFlag(this.Zflag);
        };

        //load accumulartor with constant
        Cpu.prototype.a9LDA = function () {
            this.incrementPC();
            this.Acc = parseInt(_MemoryManager.getMemValue((this.PC - (this.part - 1) * 256), this.part), 16);

            //increment to next command
            this.incrementPC();
            this.updatePCB();
        };

        //load accumulator from memory
        Cpu.prototype.adLDA = function () {
            var hexVal = "";
            this.incrementPC();
            hexVal += _MemoryManager.getMemValue((this.PC - (this.part - 1) * 256), this.part);
            this.incrementPC();
            hexVal = _MemoryManager.getMemValue((this.PC - (this.part - 1) * 256), this.part) + hexVal;

            var hexi = parseInt(hexVal, 16);

            /*while(hexi > this.limitRegister){
            hexi = hexi- 256;
            }
            
            while (hexi < this.baseRegister){
            hexi = hexi +256;
            }*/
            this.Acc = parseInt(_MemoryManager.getMemValue(hexi, this.part), 16);

            //increment to next command
            this.incrementPC();
            this.updatePCB();
        };

        Cpu.prototype.STA = function () {
            var location = "";
            this.incrementPC();
            location += _MemoryManager.getMemValue((this.PC - (this.part - 1) * 256), this.part);
            this.incrementPC();
            location = _MemoryManager.getMemValue((this.PC - (this.part - 1) * 256), this.part) + location;

            var loc = parseInt(location, 16);

            /*while(loc > this.limitRegister){
            loc = loc- 256;
            }
            
            while (loc < this.baseRegister){
            loc = loc +256;
            }*/
            _MemoryManager.addAt(loc, this.Acc.toString(16), this.part);

            //increment to next command
            this.incrementPC();
            this.updatePCB();
        };

        Cpu.prototype.ADC = function () {
            var location = "";
            this.incrementPC();
            location += _MemoryManager.getMemValue((this.PC - (this.part - 1) * 256), this.part);
            this.incrementPC();
            location = _MemoryManager.getMemValue((this.PC - (this.part - 1) * 256), this.part) + location;

            var loc = parseInt(location, 16);

            /*while(loc > this.limitRegister){
            loc = loc- 256;
            }
            
            while (loc < this.baseRegister){
            loc = loc +256;
            }*/
            this.Acc += parseInt(_MemoryManager.getMemValue(loc, this.part), 16);

            //increment to next command
            this.incrementPC();
            this.updatePCB();
        };

        Cpu.prototype.a2LDX = function () {
            this.incrementPC();
            this.Xreg = parseInt(_MemoryManager.getMemValue((this.PC - (this.part - 1) * 256), this.part), 16);

            //increment to next command
            this.incrementPC();
            this.updatePCB();
        };

        Cpu.prototype.aeLDX = function () {
            var location = "";
            this.incrementPC();
            location += _MemoryManager.getMemValue((this.PC - (this.part - 1) * 256), this.part);
            this.incrementPC();
            location = _MemoryManager.getMemValue((this.PC - (this.part - 1) * 256), this.part) + location;

            var loc = parseInt(location, 16);

            /*while(loc > this.limitRegister){
            loc = loc- 256;
            }
            
            while (loc < this.baseRegister){
            loc = loc +256;
            }*/
            this.Xreg = parseInt(_MemoryManager.getMemValue(loc, this.part), 16);

            //increment to next command
            this.incrementPC();
            this.updatePCB();
        };

        Cpu.prototype.a0LDY = function () {
            this.incrementPC();
            this.Yreg = parseInt(_MemoryManager.getMemValue((this.PC - (this.part - 1) * 256), this.part), 16);

            //increment to next command
            this.incrementPC();
            this.updatePCB();
        };

        Cpu.prototype.acLDY = function () {
            //debugger;
            var location = "";
            this.incrementPC();
            location += _MemoryManager.getMemValue((this.PC - (this.part - 1) * 256), this.part);
            this.incrementPC();
            location = _MemoryManager.getMemValue((this.PC - (this.part - 1) * 256), this.part) + location;

            var loc = parseInt(location, 16);

            /*while(loc > this.limitRegister){
            loc = loc- 256;
            }
            
            while (loc < this.baseRegister){
            loc = loc +256;
            }*/
            this.Yreg = parseInt(_MemoryManager.getMemValue(loc, this.part), 16);

            //increment to next command
            this.incrementPC();
            this.updatePCB();
        };

        Cpu.prototype.BRK = function () {
            this.init();
            this.updatePCB();

            //_CurrentPCB.setState("TERMINATED");
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(TERMINATE_IRQ, ""));
            //_LoadedProgram = -1;
            //_StdOut.advanceLine();
            //_KernelInterruptQueue.enqueue(new Interrupt(SYSOUT_IRQ, ""));
            //_KernelInterruptQueue.enqueue(new Interrupt(SYSOUT_IRQ, ">"));
            //_OsShell.putPrompt();
        };

        Cpu.prototype.ecCPX = function () {
            var location = "";
            this.incrementPC();
            location += _MemoryManager.getMemValue((this.PC - (this.part - 1) * 256), this.part);
            this.incrementPC();
            location = _MemoryManager.getMemValue((this.PC - (this.part - 1) * 256), this.part) + location;
            var loc = parseInt(location, 16);

            /*while(loc > this.limitRegister){
            loc = loc- 256;
            }
            
            while (loc < this.baseRegister){
            loc = loc +256;
            }*/
            var cmpr = parseInt(_MemoryManager.getMemValue(loc, this.part), 16);
            if (cmpr == this.Xreg) {
                this.Zflag = 1;
            } else {
                this.Zflag = 0;
            }

            //increment to next command
            this.incrementPC();
            this.updatePCB();
        };

        Cpu.prototype.d0BNE = function () {
            if (this.Zflag == 0) {
                this.incrementPC();
                var location = this.PC;
                location += parseInt(_MemoryManager.getMemValue((this.PC - (this.part - 1) * 256), this.part), 16);

                //location += 1;
                /*while (location > this.limitRegister){
                location -= 256;
                }
                
                while (location < this.baseRegister){
                location += 256;
                }*/
                this.PC = location;
                this.incrementPC();
            } else {
                //this.PC += 2;
                this.incrementPC();
                this.incrementPC();
            }

            this.updatePCB();
        };

        Cpu.prototype.eeINC = function () {
            var location = "";
            this.incrementPC();
            location += _MemoryManager.getMemValue((this.PC - (this.part - 1) * 256), this.part);
            this.incrementPC();
            location = _MemoryManager.getMemValue((this.PC - (this.part - 1) * 256), this.part) + location;

            var loc = parseInt(location, 16);

            /*while(loc > this.limitRegister){
            loc = loc- 256;
            }
            
            while (loc < this.baseRegister){
            loc = loc +256;
            }*/
            var i = parseInt(_MemoryManager.getMemValue(loc, this.part), 16);
            i++;

            this.incrementPC();
            _MemoryManager.addAt(loc, i, this.part);
            this.updatePCB();
        };

        Cpu.prototype.ffSYS = function () {
            //_StdOut.advanceLine();
            if (this.Xreg == 1) {
                //_StdOut.putText(this.Yreg.toString());
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(SYSOUT_IRQ, this.Yreg.toString()));
            } else if (this.Xreg == 2) {
                //debugger;
                var i = this.Yreg;

                /*while (i< this.baseRegister){
                i += 256;
                }
                
                while (i> this.limitRegister){
                i -= 256;
                }*/
                var n = "";
                var temp = "";

                temp = String.fromCharCode(parseInt(_MemoryManager.getMemValue(i, this.part), 16));
                while (_MemoryManager.getMemValue(i, this.part) != "00") {
                    n = n + temp;
                    i++;
                    temp = String.fromCharCode(parseInt(_MemoryManager.getMemValue(i, this.part), 16));
                }
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(SYSOUT_IRQ, n));
                //_StdOut.putText(n);
            }

            this.incrementPC();
            this.updatePCB();
        };

        //pc on current hex number - will need to check CPU is not over 255 after function
        Cpu.prototype.getMethod = function () {
            var iR = this.instructionReg.toString(16).toUpperCase();
            debugger;
            switch (iR) {
                case "A9":
                    //load acc. with constant
                    this.a9LDA();
                    break;
                case "AD":
                    //load acc. from memory
                    this.adLDA();
                    break;
                case "8D":
                    //Store accumulator in memory
                    this.STA();
                    break;
                case "6D":
                    //add with carry
                    this.ADC();
                    break;
                case "A2":
                    //load x register with constant
                    this.a2LDX();
                    break;
                case "AE":
                    //load x register from memory
                    this.aeLDX();
                    break;
                case "A0":
                    //load the y regist with constant
                    this.a0LDY();
                    break;
                case "AC":
                    //load the y register from memory
                    this.acLDY();
                    break;
                case "EA":
                    //no operation
                    //no params
                    // this.PC+1;
                    this.incrementPC();
                    break;
                case "0":
                    //break
                    //no params
                    //debugger;
                    this.BRK();
                    break;
                case "00":
                    this.BRK();
                    break;
                case "EC":
                    //compare byte in memory to x reg, sets z flag if equal
                    this.ecCPX();
                    break;
                case "D0":
                    //branch x bytes if zFlag = 0
                    this.d0BNE();
                    break;
                case "EE":
                    //Increment the value of a byte
                    //takes in 2 params
                    this.eeINC();
                    break;
                case "FF":
                    //System call
                    //no params
                    this.ffSYS();
                    break;
                default:
                    //ERROR
                    //_StdOut.putText("Input Error D");
                    //_StdOut.advanceLine();
                    this.init();
                    this.updatePCB();

                    //_CurrentPCB.setState("TERMINATED");
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(TERMINATE_IRQ, ""));

                    break;
            }
        };
        return Cpu;
    })();
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
