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
        }

        //load accumulartor with constant
        public a9LDA(){
            this.PC += 1;
            this.Acc = parseInt(_MemoryManager.getMemValue(this.PC), 16);
        }

        //load accumulator from memory
        public adLDA(){
            var hexVal = "";
            this.PC += 1;
            hexVal += _MemoryManager.getMemValue(this.PC);
            this.PC +=1;
            hexVal = _MemoryManager.getMemValue(this.PC) + hexVal;
            this.Acc = parseInt(_MemoryManager.getMemValue(parseInt(hexVal, 16)), 16);
        }

        public STA(){
            var location = "";
            this.PC += 1;
            location += _MemoryManager.getMemValue(this.PC);
            this.PC += 1;
            location = _MemoryManager.getMemValue(this.PC) + location;
            _MemoryManager.addAt(parseInt(location, 16), this.Acc);
        }

        public ADC(){
            var location = "";
            this.PC += 1;
            location += _MemoryManager.getMemValue(this.PC);
            this.PC += 1;
            location = _MemoryManager.getMemValue(this.PC) + location;
            this.Acc +=  parseInt(_MemoryManager.getMemValue(parseInt(location, 16)), 16);
        }

        public a2LDX(){
            this.PC += 1;
            this.Xreg = parseInt(_MemoryManager.getMemValue(this.PC), 16);
        }

        public aeLDX(){
            var location = "";
            this.PC += 1;
            location += _MemoryManager.getMemValue(this.PC);
            this.PC += 1;
            location = _MemoryManager.getMemValue(this.PC) + location;
            this.Xreg = parseInt(_MemoryManager.getMemValue(parseInt(location, 16)), 16);
        }

        public a0LDY(){
            this.PC += 1;
            this.Yreg = parseInt(_MemoryManager.getMemValue(this.PC), 16)
        }

        public acLDY(){
            var location = "";
            this.PC += 1;
            location += _MemoryManager.getMemValue(this.PC);
            this.PC += 1;
            location = _MemoryManager.getMemValue(this.PC) + location;
            this.Yreg = parseInt(_MemoryManager.getMemValue(parseInt(location, 16)), 16);
        }


        //pc on current hex number
        public getMethod(instructionReg){
            switch(instructionReg){
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
                    break;
                case "00":
                    //break
                    //no params
                    //TODO: Stop executing?
                    break;
                case "EC":
                    //compare byte in memory to x reg, sets z flag if equal
                    //takes in 2 params
                    break;
                case "D0":
                    //branch x bytes if zFlag = 0
                    //takes in 1 param
                    break;
                case "EE":
                    //Increment the value of a byte
                    //takes in 2 params
                    break;
                case "FF":
                    //System call
                    //no params
                    break;
                default:
                    //ERROR
                    break;
            }
        }
    }
}
