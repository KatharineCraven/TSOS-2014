var TSOS;
(function (TSOS) {
    var Scheduler = (function () {
        function Scheduler(scheduleType) {
            if (typeof scheduleType === "undefined") { scheduleType = "ROUNDROBIN"; }
            this.scheduleType = scheduleType;
        }
        Scheduler.prototype.setScheduleType = function (sType) {
            this.scheduleType = sType;
        };

        Scheduler.prototype.getScheduleType = function () {
            return this.scheduleType;
        };

        Scheduler.prototype.handleSchedulng = function () {
            if (this.scheduleType == "ROUNDROBIN") {
                this.roundRobin();
            }
        };

        Scheduler.prototype.roundRobin = function () {
            if (_CPU.isExecuting) {
                //_CPU.cycle();
                //debugger;
                //_ReadyQueueOutput.value = _ReadyQueue.toString();
                //debugger;
                if (_Quantum < _CpuExecutionCount) {
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(SWITCHRUNNING_IRQ, ""));
                    TSOS.Control.hostLog("Interrupt planned for quantum switch.", "Scheduler - OS");
                    //_CpuExecutionCount = 1;
                } else {
                    _CPU.cycle();
                    _CpuExecutionCount++;
                    TSOS.Control.hostLog("CPU Executing", "Scheduler - OS");
                }
                //if Quantumn < Count then context switch, count = 1
                //else cycle, incremement Count
            } else if (_ReadyQueue.getSize() >= 1) {
                //else if ready queue ! empty
                //context switch
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(MAKERUNNING_IRQ, ""));
                TSOS.Control.hostLog("Interrupt planned for getting next process off ready queue.", "Scheduler - OS");
                //_CPU.isExecuting = true;
            }
        };
        return Scheduler;
    })();
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));
