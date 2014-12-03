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

module TSOS {

    export class Cpu {

        constructor(public PC: number = 0,
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public instructionReg: number = 0,
                    public isExecuting: boolean = false,
                    public baseRegister: number = 0,
                    public limitRegister: number = 255) {

        }

        public init(): void {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.instructionReg = 0;
            this.isExecuting = false;
            this.baseRegister = 0;
            this.limitRegister = 255;
        }

        public incrementPC(){
            this.PC += 1;

            while(this.PC > this.limitRegister){
                this.PC -= 256;
            }

         /*   while(this.PC < this.baseRegister){
                this.PC += 256;
            }*/
        }

        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.

            this.getFromPCB(_CurrentPCB);
            this.getMethod();
        }

        public displayCPU(){
            var st = "PC: " + this.PC+ "\n";
            st += "AC: " + this.Acc + "\n";
            st += "X:  " + this.Xreg + "\n";
            st += "Y:  " + this.Yreg + "\n";
            st += "Z:  " + this.Zflag + "\n";
            st += "IR: " + this.instructionReg.toString(16);

            return st;


        }

        public getFromPCB(prCoBl){
            //debugger;
            this.PC = prCoBl.getPC();
            this.Acc = prCoBl.getAccum();
            this.Xreg = prCoBl.getXReg();
            this.Yreg = prCoBl.getYReg();
            this.Zflag = prCoBl.getZFlag();
            this.instructionReg = parseInt(_MemoryManager.getMemValue(prCoBl.getPC()), 16);
            this.baseRegister = prCoBl.getBaseReg();
            this.limitRegister = prCoBl.getLimitReg();
        }

        public updatePCB(){
            //_ResidentList[_LoadedProgram].setPC(this.PC);
            _CurrentPCB.setPC(this.PC);
            _CurrentPCB.setAccum(this.Acc);
            _CurrentPCB.setXReg(this.Xreg);
            _CurrentPCB.setYReg(this.Yreg);
            _CurrentPCB.setZFlag(this.Zflag);
        }

        //load accumulartor with constant
        public a9LDA(){
            this.incrementPC();
            this.Acc = parseInt(_MemoryManager.getMemValue(this.PC), 16);
            //increment to next command
            this.incrementPC();
            this.updatePCB();
        }

        //load accumulator from memory
        public adLDA(){
            var hexVal = "";
            this.incrementPC();
            hexVal += _MemoryManager.getMemValue(this.PC);
            this.incrementPC();
            hexVal = _MemoryManager.getMemValue(this.PC) + hexVal;

            var hexi = parseInt(hexVal, 16);

            /*while(hexi > this.limitRegister){
                hexi = hexi- 256;
            }

            while (hexi < this.baseRegister){
                hexi = hexi +256;
            }*/

            this.Acc = parseInt(_MemoryManager.getMemValue(hexi), 16);
            //increment to next command
            this.incrementPC();
            this.updatePCB();
        }

        public STA(){
            var location = "";
            this.incrementPC();
            location += _MemoryManager.getMemValue(this.PC);
            this.incrementPC();
            location = _MemoryManager.getMemValue(this.PC) + location;

            var loc = parseInt(location, 16);

            /*while(loc > this.limitRegister){
                loc = loc- 256;
            }

            while (loc < this.baseRegister){
                loc = loc +256;
            }*/

            _MemoryManager.addAt(loc, this.Acc.toString(16));
            //increment to next command
            this.incrementPC();
            this.updatePCB();
        }

        public ADC(){
            var location = "";
            this.incrementPC();
            location += _MemoryManager.getMemValue(this.PC);
            this.incrementPC();
            location = _MemoryManager.getMemValue(this.PC) + location;

            var loc = parseInt(location, 16);

            /*while(loc > this.limitRegister){
                loc = loc- 256;
            }

            while (loc < this.baseRegister){
                loc = loc +256;
            }*/

            this.Acc +=  parseInt(_MemoryManager.getMemValue(loc), 16);
            //increment to next command
            this.incrementPC();
            this.updatePCB();
        }

        public a2LDX(){
            this.incrementPC();
            this.Xreg = parseInt(_MemoryManager.getMemValue(this.PC), 16);
            //increment to next command
            this.incrementPC();
            this.updatePCB();
        }

        public aeLDX(){
            var location = "";
            this.incrementPC();
            location += _MemoryManager.getMemValue(this.PC);
            this.incrementPC();
            location = _MemoryManager.getMemValue(this.PC) + location;

            var loc = parseInt(location, 16);

            /*while(loc > this.limitRegister){
                loc = loc- 256;
            }

            while (loc < this.baseRegister){
                loc = loc +256;
            }*/

            this.Xreg = parseInt(_MemoryManager.getMemValue(loc), 16);
            //increment to next command
            this.incrementPC();
            this.updatePCB();
        }

        public a0LDY(){
            this.incrementPC();
            this.Yreg = parseInt(_MemoryManager.getMemValue(this.PC), 16);
            //increment to next command
            this.incrementPC();
            this.updatePCB();
        }

        public acLDY(){
            //debugger;
            var location = "";
            this.incrementPC();
            location += _MemoryManager.getMemValue(this.PC);
            this.incrementPC();
            location = _MemoryManager.getMemValue(this.PC) + location;

            var loc = parseInt(location, 16);

            /*while(loc > this.limitRegister){
                loc = loc- 256;
            }

            while (loc < this.baseRegister){
                loc = loc +256;
            }*/

            this.Yreg = parseInt(_MemoryManager.getMemValue(loc), 16);
            //increment to next command
            this.incrementPC();
            this.updatePCB();
        }

        public BRK(){
            this.init();
            this.updatePCB();
            //_CurrentPCB.setState("TERMINATED");
            _KernelInterruptQueue.enqueue(new Interrupt(TERMINATE_IRQ, ""))
            //_LoadedProgram = -1;
            //_StdOut.advanceLine();
            //_KernelInterruptQueue.enqueue(new Interrupt(SYSOUT_IRQ, ""));
            //_KernelInterruptQueue.enqueue(new Interrupt(SYSOUT_IRQ, ">"));
            //_OsShell.putPrompt();
        }

        public ecCPX(){
            var location = "";
            this.incrementPC();
            location += _MemoryManager.getMemValue(this.PC);
            this.incrementPC();
            location = _MemoryManager.getMemValue(this.PC) + location;
            var loc = parseInt(location, 16);

            /*while(loc > this.limitRegister){
                loc = loc- 256;
            }

            while (loc < this.baseRegister){
                loc = loc +256;
            }*/

            var cmpr = parseInt(_MemoryManager.getMemValue(loc), 16);
            if(cmpr == this.Xreg){
                this.Zflag = 1;
            }else{
                this.Zflag = 0;
            }

            //increment to next command
            this.incrementPC();
            this.updatePCB();
        }

        public d0BNE(){

            if(this.Zflag == 0){
                this.incrementPC();
                var location = this.PC;
                location += parseInt(_MemoryManager.getMemValue(this.PC), 16);
                //location += 1;

                /*while (location > this.limitRegister){
                    location -= 256;
                }

                while (location < this.baseRegister){
                    location += 256;
                }*/


                this.PC = location;
                this.incrementPC();
            }else{
                //this.PC += 2;   
                this.incrementPC();
                this.incrementPC();
            }

            this.updatePCB();
        }

        public eeINC(){
            var location = "";
            this.incrementPC();
            location += _MemoryManager.getMemValue(this.PC);
            this.incrementPC();
            location = _MemoryManager.getMemValue(this.PC) + location;

            var loc = parseInt(location, 16);

            /*while(loc > this.limitRegister){
                loc = loc- 256;
            }

            while (loc < this.baseRegister){
                loc = loc +256;
            }*/

            var i = parseInt(_MemoryManager.getMemValue(loc), 16);
            i++;

            this.incrementPC();
            _MemoryManager.addAt(loc, i);
            this.updatePCB();
        }

        public ffSYS(){
            //_StdOut.advanceLine();
            if(this.Xreg == 1){
                //_StdOut.putText(this.Yreg.toString());
                _KernelInterruptQueue.enqueue(new Interrupt(SYSOUT_IRQ, this.Yreg.toString()));
            }else if(this.Xreg == 2){
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

                temp = String.fromCharCode(parseInt(_MemoryManager.getMemValue(i), 16));
                while(_MemoryManager.getMemValue(i) != "00"){
                    n = n+temp;
                    i++;
                    temp = String.fromCharCode(parseInt(_MemoryManager.getMemValue(i), 16));

                }
                _KernelInterruptQueue.enqueue(new Interrupt(SYSOUT_IRQ, n));
                //_StdOut.putText(n);
            }

            this.incrementPC();
            this.updatePCB();
        }

        //pc on current hex number - will need to check CPU is not over 255 after function
        public getMethod(){
            var iR = this.instructionReg.toString(16).toUpperCase();
            //debugger;
            switch(iR){
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
                    _KernelInterruptQueue.enqueue(new Interrupt(TERMINATE_IRQ, ""));
                    //_LoadedProgram = -1;
                    break;
            }
        }
    }
}
