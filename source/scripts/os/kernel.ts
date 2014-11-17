/* ------------
     Kernel.ts

     Requires globals.ts

     Routines for the Operating System, NOT the host.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

module TSOS {

    export class Kernel {
        //
        // OS Startup and Shutdown Routines
        //
        public krnBootstrap() {      // Page 8. {
            Control.hostLog("bootstrap", "host");  // Use hostLog because we ALWAYS want this, even if _Trace is off.
            // Initialize our global queues.
            _KernelInterruptQueue = new Queue();  // A (currently) non-priority queue for interrupt requests (IRQs).

            _ReadyQueue = new Queue();
            _ResidentList = new Array();

            _TScheduler = new Scheduler();

            _KernelBuffers = new Array();         // Buffers... for the kernel.
            _KernelInputQueue = new Queue();      // Where device input lands before being processed out somewhere.
            _Console = new Console();          // The command line interface / console I/O device.
            _MemoryManager = new MemoryManager(); //memory manager
            _MemoryManager.initMemory();
            _CpuExecutionCount = 1;
            _CurrentPCB = null;


            _CPUOutput.value = _CPU.displayCPU();
            //minor change

            // Initialize the console.
            _Console.init();


            // Initialize standard input and output to the _Console.
            _StdIn  = _Console;
            _StdOut = _Console;

            // Load the Keyboard Device Driver
            this.krnTrace("Loading the keyboard device driver.");
            _krnKeyboardDriver = new DeviceDriverKeyboard();     // Construct it.
            _krnKeyboardDriver.driverEntry();                    // Call the driverEntry() initialization routine.
            this.krnTrace(_krnKeyboardDriver.status);

            //
            // ... more?
            //


            // Enable the OS Interrupts.  (Not the CPU clock interrupt, as that is done in the hardware sim.)
            this.krnTrace("Enabling the interrupts.");
            this.krnEnableInterrupts();

            // Launch the shell.
            this.krnTrace("Creating and Launching the shell.");
            _OsShell = new Shell();
            _OsShell.init();

            // Finally, initiate testing.
            if (_GLaDOS) {
                _GLaDOS.afterStartup();
            }
        }

        public krnShutdown() {
            this.krnTrace("begin shutdown OS");

            // TODO: Check for running processes.  Alert if there are some, alert and stop.  Else...
            // ... Disable the Interrupts.
            this.krnTrace("Disabling the interrupts.");
            this.krnDisableInterrupts();
            //
            // Unload the Device Drivers?
            // More?
            //
            this.krnTrace("end shutdown OS");

        }


        public krnOnCPUClockPulse() {
            /* This gets called from the host hardware sim every time there is a hardware clock pulse.
               This is NOT the same as a TIMER, which causes an interrupt and is handled like other interrupts.
               This, on the other hand, is the clock pulse from the hardware (or host) that tells the kernel
               that it has to look for interrupts and process them if it finds any.                           */
               //memory output

               //status message
               _DrawingContextTwo.clearRect(0, 0, 500, 100);
               _DrawingContextTwo.fillText(new Date().toLocaleString()+ ",  Status: " + _StatusMessage, 8, 30);
               //_ReadyQueueOutput.value = this.displayReadyQueue();

            // Check for an interrupt, are any. Page 560
            if (_KernelInterruptQueue.getSize() > 0) {

                // Process the first interrupt on the interrupt queue.
                // TODO: Implement a priority queue based on the IRQ number/id to enforce interrupt priority.
                var interrupt = _KernelInterruptQueue.dequeue();
                this.krnInterruptHandler(interrupt.irq, interrupt.params);
                
            } else if ((_CPU.isExecuting)|| (_ReadyQueue.getSize() >= 1)){ // If there are no interrupts then run one CPU cycle if there is anything being processed. {
                
                _TScheduler.handleSchedulng();

                _CPUOutput.value = _CPU.displayCPU();

            }else {                      // If there are no interrupts and there is nothing being executed then just be idle. {
                this.krnTrace("Idle");
            }

            _MemoryOutput.value = _MemoryManager.displayMem();
            _ReadyQueueOutput.value = this.displayReadyQueue();

           /* if(_LoadedProgram != -1){
                _CPUOutput.value = _CPU.displayCPU();
                //whut
            }*/

        }

        public displayReadyQueue(){
            var s = _ReadyQueue.getSize();
            var outputReady = "";

            if(_CurrentPCB != null){
                outputReady = outputReady+ "PID: " + _CurrentPCB.getPid() +", State: " +_CurrentPCB.getState()+ ", PC: " +_CurrentPCB.getPC();
                outputReady= outputReady + " , xReg: "+_CurrentPCB.getXReg() + ", yReg: " + _CurrentPCB.getYReg();
                outputReady = outputReady + " , Acc: " + _CurrentPCB.getAccum() + ", zFlag: " + _CurrentPCB.getZFlag()+ ", Partition: " + _CurrentPCB.getPartition()+ "\n"+"\n";
            }

            for(var i = 0; i<s; i++){
                var temp = _ReadyQueue.dequeue();
                outputReady = outputReady+ "PID: " + temp.getPid() +", State: " +temp.getState()+ ", PC: " +temp.getPC() + " , xReg: ";
                outputReady = outputReady+ temp.getXReg() + ", yReg: " + temp.getYReg() + " , Acc: " + temp.getAccum();
                outputReady = outputReady + ", zFlag: " + temp.getZFlag() +", Partition: " + temp.getPartition()+ "\n"+ "\n";

                _ReadyQueue.enqueue(temp);

            }

            return outputReady;
        }

        //
        // Interrupt Handling
        //
        public krnEnableInterrupts() {
            // Keyboard
            Devices.hostEnableKeyboardInterrupt();
            // Put more here.
        }

        public krnDisableInterrupts() {
            // Keyboard
            Devices.hostDisableKeyboardInterrupt();
            // Put more here.
        }

        public krnInterruptHandler(irq, params) {
            // This is the Interrupt Handler Routine.  Pages 8 and 560. {
            // Trace our entrance here so we can compute Interrupt Latency by analyzing the log file later on.  Page 766.
            this.krnTrace("Handling IRQ~" + irq);

            // Invoke the requested Interrupt Service Routine via Switch/Case rather than an Interrupt Vector.
            // TODO: Consider using an Interrupt Vector in the future.
            // Note: There is no need to "dismiss" or acknowledge the interrupts in our design here.
            //       Maybe the hardware simulation will grow to support/require that in the future.
            switch (irq) {
                case TIMER_IRQ:
                    this.krnTimerISR();              // Kernel built-in routine for timers (not the clock).
                    break;
                case KEYBOARD_IRQ:
                    _krnKeyboardDriver.isr(params);   // Kernel mode device driver
                    _StdIn.handleInput();
                    break;
                case SYSOUT_IRQ:
                    this.krnOutputISR(params);
                    break;
                case SYSERR_IRQ:
                    this.krnSYSErr(params);
                    break;
                case TERMINATE_IRQ:
                    this.terminateProcess();
                    break;
                case MAKERUNNING_IRQ:
                    this.makeProccessRun();
                    break;
                case SWITCHRUNNING_IRQ:
                    this.switchProcesses();
                    break;
                case MAKEREADY_IRQ:
                    this.makeProcessReady(params);
                    break;
                case KILL_IRQ:
                    this.terminateViaPID(params);
                    break;
                default:
                    this.krnTrapError("Invalid Interrupt Request. irq=" + irq + " params=[" + params + "]");
            }
        }

        public makeProcessReady(params){
            _ResidentList[params].setState("READY");
            _ReadyQueue.enqueue(_ResidentList[params]);
        }

        public switchProcesses(){
            var tempPCB = _CurrentPCB;
            tempPCB.setState("WAITING");
            _ReadyQueue.enqueue(tempPCB);

            _CurrentPCB = _ReadyQueue.dequeue();
            _CurrentPCB.setState("RUNNING");

            _CpuExecutionCount = 1;
        }

        public makeProccessRun(){
            _CurrentPCB = _ReadyQueue.dequeue();
            _CurrentPCB.setState("RUNNING");
            _CpuExecutionCount = 1;
            _CPU.isExecuting = true;

        }
        public terminateViaPID(params){
            var pp = -1;

            if(_CurrentPCB.getPid() == params){
                _CurrentPCB.setState("TERMINATED");
                _CPU.isExecuting = false;
                pp = _CurrentPCB.getPartition();
            }else{
                var temp;
                for(var i = 0; i<_ReadyQueue.getSize(); i++){
                    temp = _ReadyQueue.dequeue();

                    if(temp.getPid() == params){
                        temp.setState("TERMINATED");
                        pp = temp.getPartition();
                        break;
                    }

                    _ReadyQueue.enqueue(temp);
                }
            }

            if(pp != -1){
                _MemoryManager.clearMemoryPartition(pp);
                _MemoryManager.setPartitionAsUnused(pp);
                _ResidentList[params] = null;
            }else{
                _StdOut.putText("Proccess with PID could not be found");
                _StdOut.advanceLine();
                _OsShell.putPrompt();
            }

        }

        public terminateProcess(){
            _CurrentPCB.setState("TERMINATED");
            _CPU.isExecuting = false;
            var v  = _CurrentPCB.getPid();
            var pp = _CurrentPCB.getPartition();
            _MemoryManager.clearMemoryPartition(pp);
            _MemoryManager.setPartitionAsUnused(pp);
            _ResidentList[v] = null;

            if(_ReadyQueue.getSize() < 1){
                _StdOut.advanceLine();
                _OsShell.putPrompt();
            }

            _CurrentPCB = null;
            //handle deleting
            //handle clearing memory
            //handle handle available partition
        }

        public krnOutputISR(params){
            //Control.hostLog("Handling Output", "OS");
            _StdOut.advanceLine();
            _StdOut.putText(params);
            //_StdOut.advanceLine();

        }

        public krnSYSErr(params){
            //Control.hostLog("Handling Error", "OS");
            _StdOut.putText("Input Error");
            _StdOut.advanceLine();
        }

        public krnTimerISR() {
            // The built-in TIMER (not clock) Interrupt Service Routine (as opposed to an ISR coming from a device driver). {
            // Check multiprogramming parameters and enforce quanta here. Call the scheduler / context switch here if necessary.
        }

        //
        // System Calls... that generate software interrupts via tha Application Programming Interface library routines.
        //
        // Some ideas:
        // - ReadConsole
        // - WriteConsole
        // - CreateProcess
        // - ExitProcess
        // - WaitForProcessToExit
        // - CreateFile
        // - OpenFile
        // - ReadFile
        // - WriteFile
        // - CloseFile


        //
        // OS Utility Routines
        //
        public krnTrace(msg: string) {
             // Check globals to see if trace is set ON.  If so, then (maybe) log the message.
             if (_Trace) {
                if (msg === "Idle") {
                    // We can't log every idle clock pulse because it would lag the browser very quickly.
                    if (_OSclock % 10 == 0) {
                        // Check the CPU_CLOCK_INTERVAL in globals.ts for an
                        // idea of the tick rate and adjust this line accordingly.
                        Control.hostLog(msg, "OS");
                    }
                } else {
                    Control.hostLog(msg, "OS");
                }
             }
        }

        public krnTrapError(msg) {
            Control.hostLog("OS ERROR - TRAP: " + msg);
            
            //blue screan of death image
            _BSODD.src = 'BSOD.jpg';
            // TODO: Display error on console, perhaps in some sort of colored screen. (Perhaps blue?)
            //_StdOut.clearScreen();
            _StdOut.resetXY();
            _Canvas.height = 500;

            //backup BSOD for image
            _DrawingContext.rect(0,0, 500, 500);
            _DrawingContext.fillStyle = 'blue';
            _DrawingContext.fill();
            _StdOut.putText("ERROR");

            //intended BSOD, only works when page is reset or program is halted and reset
            _DrawingContext.drawImage(_BSODD, 0, 0, 500, 500);

            this.krnShutdown();
        }
    }
}
