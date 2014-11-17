module TSOS{

	export class Scheduler{

		constructor(public scheduleType = "ROUNDROBIN"){

		}
		
		public setScheduleType(sType){
			this.scheduleType = sType;
		}

		public getScheduleType(){
			return this.scheduleType;
		}

		public handleSchedulng(){
			if(this.scheduleType == "ROUNDROBIN"){
				this.roundRobin();
			}
		}

		public roundRobin(){
			if (_CPU.isExecuting) { // If there are no interrupts then run one CPU cycle if there is anything being processed. {
                //_CPU.cycle();
                //debugger;
                //_ReadyQueueOutput.value = _ReadyQueue.toString();

                //debugger;
                if(_Quantum < _CpuExecutionCount){

                    _KernelInterruptQueue.enqueue(new Interrupt(SWITCHRUNNING_IRQ, ""));
                    Control.hostLog("Interrupt planned for quantum switch.", "Scheduler - OS");
                    //_CpuExecutionCount = 1;
                }else{
                    _CPU.cycle();
                    _CpuExecutionCount++;
                    Control.hostLog("CPU Executing", "Scheduler - OS");
                }
                //if Quantumn < Count then context switch, count = 1
                //else cycle, incremement Count
            } else if(_ReadyQueue.getSize() >= 1){ //if there is a program waiting to run - this will be changed later for multiple programs
                //else if ready queue ! empty
                //context switch 

                _KernelInterruptQueue.enqueue(new Interrupt(MAKERUNNING_IRQ, ""));
                Control.hostLog("Interrupt planned for getting next process off ready queue.", "Scheduler - OS");

                //_CPU.isExecuting = true;

			}
		}		

	}
}