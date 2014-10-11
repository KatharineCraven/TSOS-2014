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
                    public isExecuting: boolean = false) {

        }

        public init(): void {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.instructionReg = 0;
            this.isExecuting = false;
        }


        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.

            this.getFromPCB(_LoadedProgram);
            this.getMethod(_LoadedProgram);
        }

        public getFromPCB(prCoBl){
            this.PC = prCoBl.getPC();
            this.Acc = prCoBl.getAccum();
            this.Xreg = prCoBl.getXReg();
            this.Yreg = prCoBl.getYReg();
            this.Zflag = prCoBl.getZFlag();
            this.instructionReg = parseInt(_MemoryManager.getMemValue(prCoBl.getPC()), 16);
        }

        public updatePCB(prCoBl){
            prCoBl.setPC(this.PC);
            prCoBl.setAccum(this.Acc);
            prCoBl.setXReg(this.Xreg);
            prCoBl.setYReg(this.Yreg);
            prCoBl.setZFlag(this.Zflag);
        }

        //load accumulartor with constant
        public a9LDA(){
            this.PC += 1;
            this.Acc = parseInt(_MemoryManager.getMemValue(this.PC), 16);
            //increment to next command
            this.PC += 1;
        }

        //load accumulator from memory
        public adLDA(){
            var hexVal = "";
            this.PC += 1;
            hexVal += _MemoryManager.getMemValue(this.PC);
            this.PC +=1;
            hexVal = _MemoryManager.getMemValue(this.PC) + hexVal;
            this.Acc = parseInt(_MemoryManager.getMemValue(parseInt(hexVal, 16)), 16);
            //increment to next command
            this.PC += 1;
        }

        public STA(){
            var location = "";
            this.PC += 1;
            location += _MemoryManager.getMemValue(this.PC);
            this.PC += 1;
            location = _MemoryManager.getMemValue(this.PC) + location;
            _MemoryManager.addAt(parseInt(location, 16), this.Acc);
            //increment to next command
            this.PC += 1;
        }

        public ADC(){
            var location = "";
            this.PC += 1;
            location += _MemoryManager.getMemValue(this.PC);
            this.PC += 1;
            location = _MemoryManager.getMemValue(this.PC) + location;
            this.Acc +=  parseInt(_MemoryManager.getMemValue(parseInt(location, 16)), 16);
            //increment to next command
            this.PC += 1;
        }

        public a2LDX(){
            this.PC += 1;
            this.Xreg = parseInt(_MemoryManager.getMemValue(this.PC), 16);
            //increment to next command
            this.PC += 1;
        }

        public aeLDX(){
            var location = "";
            this.PC += 1;
            location += _MemoryManager.getMemValue(this.PC);
            this.PC += 1;
            location = _MemoryManager.getMemValue(this.PC) + location;
            this.Xreg = parseInt(_MemoryManager.getMemValue(parseInt(location, 16)), 16);
            //increment to next command
            this.PC += 1;
        }

        public a0LDY(){
            this.PC += 1;
            this.Yreg = parseInt(_MemoryManager.getMemValue(this.PC), 16);
            //increment to next command
            this.PC += 1;
        }

        public acLDY(){
            var location = "";
            this.PC += 1;
            location += _MemoryManager.getMemValue(this.PC);
            this.PC += 1;
            location = _MemoryManager.getMemValue(this.PC) + location;
            this.Yreg = parseInt(_MemoryManager.getMemValue(parseInt(location, 16)), 16);
            //increment to next command
            this.PC += 1;
        }

        public BRK(aPCB){
            this.isExecuting = false;
            aPCB.setStatus("TERMIATED");
            this.PC = 0;
        }

        public ecCPX(){
            var location = "";
            this.PC += 1;
            location += _MemoryManager.getMemValue(this.PC);
            this.PC += 1;
            location = _MemoryManager.getMemValue(this.PC) + location;
            var cmpr = parseInt(_MemoryManager.getMemValue(parseInt(location, 16)), 16);
            if(cmpr == this.Xreg){
                this.Zflag = 1;
            }else{
                this.Zflag = 0;
            }

            //increment to next command
            this.PC += 1;
        }

        public d0BNE(){

            if(this.Zflag == 1){
                var location = this.PC;
                this.PC += 1;
                location += parseInt(_MemoryManager.getMemValue(this.PC));

                while (location > 255){
                    location -= 256;
                }

                this.PC = location;
            }
        }

        public eeINC(){
            var location = "";
            this.PC += 1;
            location += _MemoryManager.getMemValue(this.PC);
            this.PC += 1;
            location = _MemoryManager.getMemValue(this.PC) + location;

            var i = parseInt(_MemoryManager.getMemValue(parseInt(location, 16)), 16);
            i++;

            _MemoryManager.addAt(parseInt(location, 16), i);
        }

        public ffSYS(){
            if(this.Xreg == 1){
                _StdOut.put(this.Yreg);
            }else if(this.Xreg == 2){
                var s = this.Yreg.toString(16);

                var tempS;
                var n = "";
                var c1;
                var c2;
                for(var i = 0; i<s.length; i += 2){
                    c1 = s.charAt(i);
                    c2 = s.charAt(i+1);
                    tempS = ""+c1+c2;

                    if(tempS === "00"){
                        break;
                    }else{
                        n += String.fromCharCode(parseInt(tempS, 16));
                    }

                }

                _StdOut.put(n);
            }
        }

        //pc on current hex number - will need to check CPU is not over 255 after function
        public getMethod(tPCB){
            var iR = this.instructionReg.toString(16);

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
                    this.PC+1;
                    break;
                case "00":
                    //break
                    //no params
                    this.BRK(tPCB);
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
                    _StdOut.put("Input Error");
                    this.isExecuting = false;
                    this.PC = 0;
                    break;
            }
        }
    }
}
