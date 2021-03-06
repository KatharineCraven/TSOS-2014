///<reference path="shellCommand.ts" />
///<reference path="userCommand.ts" />
///<reference path="../utils.ts" />
/* ------------
Shell.ts
The OS Shell - The "command line interface" (CLI) for the console.
------------ */
// TODO: Write a base class / prototype for system services and let Shell inherit from it.
//test comment
var TSOS;
(function (TSOS) {
    var Shell = (function () {
        function Shell() {
            // Properties
            this.promptStr = ">";
            this.commandList = [];
            this.curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
            this.apologies = "[sorry]";
            ;
        }
        Shell.prototype.init = function () {
            var sc = null;

            //
            // Load the command list.
            // ver
            sc = new TSOS.ShellCommand(this.shellVer, "ver", "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;

            // help
            sc = new TSOS.ShellCommand(this.shellHelp, "help", "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;

            // shutdown
            sc = new TSOS.ShellCommand(this.shellShutdown, "shutdown", "- Shuts down the virtual OS but leaves the underlying hardware simulation running.");
            this.commandList[this.commandList.length] = sc;

            // cls
            sc = new TSOS.ShellCommand(this.shellCls, "cls", "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;

            // man <topic>
            sc = new TSOS.ShellCommand(this.shellMan, "man", "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;

            // trace <on | off>
            sc = new TSOS.ShellCommand(this.shellTrace, "trace", "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;

            // rot13 <string>
            sc = new TSOS.ShellCommand(this.shellRot13, "rot13", "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;

            // prompt <string>
            sc = new TSOS.ShellCommand(this.shellPrompt, "prompt", "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;

            //date
            sc = new TSOS.ShellCommand(this.shellDate, "date", "- Displays the date.");
            this.commandList[this.commandList.length] = sc;

            //whereami
            sc = new TSOS.ShellCommand(this.shellWhereAmI, "whereami", "- Ask where you are.");
            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.shellImSad, "imsad", "- Type if you are feeling sad.");
            this.commandList[this.commandList.length] = sc;

            // status <string>
            sc = new TSOS.ShellCommand(this.shellStatus, "status", "<string> - Sets status message.");
            this.commandList[this.commandList.length] = sc;

            //load user program
            sc = new TSOS.ShellCommand(this.shellLoad, "load", "- Loads valid program input.");
            this.commandList[this.commandList.length] = sc;

            //blue screen of death
            sc = new TSOS.ShellCommand(this.shellBSOD, "bsod", "- Kernel Trap Test");
            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.shellRun, "run", "<pid> - Run program corresponding to <pid>");
            this.commandList[this.commandList.length] = sc;

            // processes - list the running processes and their IDs
            // kill <id> - kills the specified process id.
            sc = new TSOS.ShellCommand(this.shellClearMem, "clearmem", "- Clears all memory partitions");
            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.shellQuantum, "quantum", "<int> - Sets quantum for Round Robin clock schedule.");
            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.shellRunAll, "runall", "- Runs all programs loaded in memory according to scheduler.");
            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.shellKill, "kill", "<pid> - Kills the process with the pid.");
            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.shellPS, "ps", "- Displays PIDs of all active processes.");
            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.shellSetSchedule, "setschedule", "<schedule> - Sets schedule type (rr, fcfc, priority).");
            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.shellCreate, "create", "<filename> - Creates filename.");
            this.commandList[this.commandList.length] = sc;

            //
            sc = new TSOS.ShellCommand(this.shellWrite, "write", "<filename> \"data\" - Writes data to a file. Overwrites, does not append.");
            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.shellRead, "read", "<filename> - Reads data from a file.");
            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.shellDelete, "delete", "<filename> - Deletes file.");
            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.shellListFiles, "ls", " - Lists files on disk.");
            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.shellFormat, "format", " - Initialize all tracks sectors and blocks");
            this.commandList[this.commandList.length] = sc;

            // Display the initial prompt.
            this.putPrompt();
        };

        Shell.prototype.putPrompt = function () {
            _StdOut.putText(this.promptStr);
        };

        Shell.prototype.autoComplete = function () {
            var possibles = [];
            var l = _StdOut.buffer.length;

            if (l != 0) {
                for (var i = 0; i < this.commandList.length; i++) {
                    if (_StdOut.buffer === this.commandList[i].command.substring(0, l)) {
                        possibles.push(this.commandList[i].command);
                    }
                }

                if (possibles.length == 0) {
                    _StdOut.advanceLine();
                    _StdOut.putText("No suggestions.");
                    _StdOut.advanceLine();
                    _StdOut.buffer = "";
                    this.putPrompt();
                } else if (possibles.length == 1) {
                    _StdOut.buffer = TSOS.CanvasTextFunctions.cmdHistory(_StdOut.currentYPosition, _StdOut.buffer, possibles[0]);
                    _StdOut.currentXPosition = TSOS.CanvasTextFunctions.measure(_DefaultFontFamily, _DefaultFontSize, _StdOut.buffer) + 12.48;
                } else {
                    _StdOut.advanceLine();
                    _StdOut.putText("Did you mean...");
                    _StdOut.advanceLine();

                    for (i = 0; i < possibles.length; i++) {
                        _StdOut.putText(possibles[i]);
                        _StdOut.advanceLine();
                    }
                    _StdOut.buffer = "";
                    this.putPrompt();
                }
            } else {
                _StdOut.advanceLine();
                _StdOut.putText("Nothing to autoComplete.");
                _StdOut.advanceLine();
                this.putPrompt();
            }
        };

        Shell.prototype.handleInput = function (buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);

            //
            // Parse the input...
            //
            var userCommand = new TSOS.UserCommand();
            userCommand = this.parseInput(buffer);

            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;

            //
            // Determine the command and execute it.
            //
            // JavaScript may not support associative arrays in all browsers so we have to
            // iterate over the command list in attempt to find a match.  TODO: Is there a better way? Probably.
            var index = 0;
            var found = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                } else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);
            } else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + TSOS.Utils.rot13(cmd) + "]") >= 0) {
                    this.execute(this.shellCurse);
                } else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {
                    this.execute(this.shellApology);
                } else {
                    this.execute(this.shellInvalidCommand);
                }
            }
        };

        // args is an option parameter, ergo the ? which allows TypeScript to understand that
        Shell.prototype.execute = function (fn, args) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();

            // ... call the command function passing in the args...
            fn(args);

            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }

            // ... and finally write the prompt again.
            this.putPrompt();
        };

        Shell.prototype.parseInput = function (buffer) {
            var retVal = new TSOS.UserCommand();

            // 1. Remove leading and trailing spaces.
            buffer = TSOS.Utils.trim(buffer);

            // 2. Lower-case it.
            buffer = buffer.toLowerCase();

            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");

            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift();

            // 4.1 Remove any left-over spaces.
            cmd = TSOS.Utils.trim(cmd);

            // 4.2 Record it in the return value.
            retVal.command = cmd;

            for (var i in tempList) {
                var arg = TSOS.Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        };

        //
        // Shell Command Functions.  Again, not part of Shell() class per se', just called from there.
        //
        Shell.prototype.shellInvalidCommand = function () {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Duh. Go back to your Speak & Spell.");
            } else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        };

        Shell.prototype.shellCurse = function () {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        };

        Shell.prototype.shellApology = function () {
            if (_SarcasticMode) {
                _StdOut.putText("Okay. I forgive you. This time.");
                _SarcasticMode = false;
            } else {
                _StdOut.putText("For what?");
            }
        };

        Shell.prototype.shellVer = function (args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        };

        Shell.prototype.shellHelp = function (args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        };

        Shell.prototype.shellShutdown = function (args) {
            _StdOut.putText("Shutting down...");

            // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
        };

        Shell.prototype.shellCls = function (args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
            _Canvas.height = 500;
        };

        Shell.prototype.shellMan = function (args) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    case "help":
                        _StdOut.putText("Help displays a list of (hopefully) valid commands.");
                        break;
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            } else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        };

        Shell.prototype.shellTrace = function (args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, dumbass.");
                        } else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }

                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            } else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        };

        Shell.prototype.shellRot13 = function (args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + TSOS.Utils.rot13(args.join(' ')) + "'");
            } else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        };

        Shell.prototype.shellPrompt = function (args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            } else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        };

        Shell.prototype.shellDate = function () {
            _StdOut.putText(new Date().toLocaleString());
        };

        Shell.prototype.shellWhereAmI = function () {
            _StdOut.putText("Somewhere with an internet connection, probably.");
        };

        //Kitty for when you are sad
        Shell.prototype.shellImSad = function () {
            _StdOut.putText("Do not be sad. Here is a kitten:");
            _StdOut.advanceLine();
            _StdOut.advanceLine();
            _StdOut.putText("   /\\/\\");
            _StdOut.advanceLine();
            _StdOut.putText(" =( o.o )=");
            _StdOut.advanceLine();
            _StdOut.putText("   >   <");
            _StdOut.advanceLine();
            _StdOut.putText("===============");
        };

        Shell.prototype.shellStatus = function (args) {
            _StatusMessage = args;
        };

        //loads user input
        Shell.prototype.shellLoad = function (args) {
            var s = _UserCode.value;
            var v = true;
            var c = '';
            var cList = ['\n', ' ', 'A', 'a', 'B', 'b', 'C', 'c', 'D', 'd', 'E', 'e', 'F', 'f', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
            var notSpace = 0;

            for (var i = 0; i < s.length; i++) {
                c = s.charAt(i);

                if ((c != ' ') && (c != '\n')) {
                    notSpace++;
                }

                for (var j = 0; j < cList.length; j++) {
                    if (c == cList[j]) {
                        v = true;
                        break;
                    }

                    v = false;
                }

                if (v == false) {
                    break;
                }
            }

            if (notSpace % 2 != 0) {
                v = false;
            }

            if (notSpace == 0) {
                v = false;
            }

            if (v == false) {
                _StdOut.putText("Invalid Input");
            } else {
                //if(_LoadedProgram == -1){
                //_MemoryManager.clearAllMem();
                _CPUOutput.value = _CPU.displayCPU();
                var avail = _MemoryManager.findNextAvailPart();
                if (avail == 0) {
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CREATE_FILENAME_IRQ, "." + _pidCount));
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(WRITE_FILE_IRQ, ["." + _pidCount, s.replace(/\s/g, '').toUpperCase()]));

                    _ResidentList.push(new TSOS.PCB());
                    _ResidentList[_pidCount].setPid(_pidCount);
                    _ResidentList[_pidCount].setLocation("disk");

                    if ((isNaN(Number(args))) || (Number(args) < 0)) {
                        _ResidentList[_pidCount].setPriority(5);
                    } else {
                        _ResidentList[_pidCount].setPriority(Number(args));
                    }

                    _StdOut.putText("pid: " + _pidCount);
                    _pidCount++;
                    //_StdOut.putText("No room in memory");
                } else {
                    _MemoryManager.addToMem(s.replace(/\s/g, '').toUpperCase(), avail);
                    _MemoryManager.setPartitionAsUsed(avail);

                    //_StdOut.putText(avail.toString());
                    //debugger;
                    _ResidentList.push(new TSOS.PCB());
                    _ResidentList[_pidCount].setPid(_pidCount);
                    _ResidentList[_pidCount].setPartition(avail);

                    if ((isNaN(Number(args))) || (Number(args) < 0)) {
                        _ResidentList[_pidCount].setPriority(5);
                    } else {
                        _ResidentList[_pidCount].setPriority(Number(args));
                    }

                    // _ResidentList[_pidCount].setPC((256*_NumProgForMem)-256);
                    _StdOut.putText("pid: " + _pidCount);
                    _pidCount++;
                }
                //}else{
                //    _StdOut.putText("Please wait until program finishes running");
                //}
            }
        };

        Shell.prototype.shellBSOD = function () {
            _Kernel.krnTrapError("Testing Trap");
        };

        Shell.prototype.shellClearMem = function () {
            _MemoryManager.clearAllMem();
            _MemoryManager.setPartitionAsUnused(1);
            _MemoryManager.setPartitionAsUnused(2);
            _MemoryManager.setPartitionAsUnused(3);
            _ResidentList = new Array();
            _pidCount = 0;
            //needs to clear queues
        };

        Shell.prototype.shellQuantum = function (args) {
            _Quantum = args;
        };

        //run command
        Shell.prototype.shellRun = function (args) {
            _CPUOutput.value = _CPU.displayCPU();
            if (args >= _pidCount) {
                _StdOut.putText("Invalid pid");
                //}else if(_LoadedProgram != -1){
                //    _StdOut.putText("Please wait for program to finish");
            } else if (_ResidentList[args] == null) {
                _StdOut.putText("Program has been wiped from memory");
            } else {
                //_LoadedProgram = args;
                //_ResidentList[args].setState("READY");
                //above needs to be fixed
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(MAKEREADY_IRQ, args));
                //_ReadyQueue.enqueue(_ResidentList[args]);
            }
        };

        Shell.prototype.shellKill = function (args) {
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(KILL_IRQ, args));
        };

        Shell.prototype.shellPS = function () {
            if (_CurrentPCB != null) {
                _StdOut.putText(_CurrentPCB.getPid().toString());
                _StdOut.advanceLine();
            }

            var temp;
            for (var i = 0; i < _ReadyQueue.getSize(); i++) {
                temp = _ReadyQueue.dequeue();
                _StdOut.putText(temp.getPid().toString());
                _StdOut.advanceLine();
                _ReadyQueue.enqueue(temp);
            }
            //_OsShell.putPrompt();
        };

        Shell.prototype.shellSetSchedule = function (args) {
            //debugger;
            if (((args == "rr") || (args == "fcfs") || (args == "priority")) && (args != _TScheduler.getScheduleType())) {
                if (_CPU.isExecuting == true) {
                    _StdOut.putText("Please wait until CPU is finished");
                    _StdOut.advanceLine();
                } else {
                    _TScheduler.setScheduleType(args);
                    var tempQueue = [];

                    if (_ReadyQueue.isEmpty() == false) {
                        while (_ReadyQueue.isEmpty() != true) {
                            tempQueue.push(_ReadyQueue.dequeue());
                        }

                        switch (_TScheduler.getScheduleType()) {
                            case "rr":
                                while (tempQueue.length > 0) {
                                    var tX = tempQueue[0];
                                    var tI = 0;

                                    for (var i = 0; i < tempQueue.length; i++) {
                                        if (tempQueue[i].getPid() < tX.getPid()) {
                                            tX = tempQueue[i];
                                        }
                                    }

                                    _ReadyQueue.enqueue(tX);
                                    tempQueue.splice(tI, 1);
                                }
                                break;

                            case "fcfs":
                                while (tempQueue.length > 0) {
                                    var tX = tempQueue[0];
                                    var tI = 0;

                                    for (var i = 0; i < tempQueue.length; i++) {
                                        if (tempQueue[i].getPid() < tX.getPid()) {
                                            tX = tempQueue[i];
                                        }
                                    }

                                    _ReadyQueue.enqueue(tX);
                                    tempQueue.splice(tI, 1);
                                }
                                break;

                            case "priority":
                                while (tempQueue.length > 0) {
                                    var tX = tempQueue[0];
                                    var tI = 0;

                                    for (var i = 0; i < tempQueue.length; i++) {
                                        if (tempQueue[i].getPriority() < tX.getPriority()) {
                                            tX = tempQueue[i];
                                        }
                                    }

                                    _ReadyQueue.enqueue(tX);
                                    tempQueue.splice(tI, 1);
                                }
                                break;
                        }
                    }
                }
            } else {
                _StdOut.putText("Invalid Schedule");
                _StdOut.advanceLine();
            }
        };

        Shell.prototype.shellRunAll = function () {
            _CPUOutput.value = _CPU.displayCPU();
            var i;
            if ((_ResidentList.length < 1) || (_ResidentList == null)) {
                _StdOut.putText("No programs are loaded in memory.");
            } else {
                for (i = 0; i < _ResidentList.length; i++) {
                    if (_ResidentList[i] != null) {
                        _KernelInterruptQueue.enqueue(new TSOS.Interrupt(MAKEREADY_IRQ, i));
                    }
                }
            }
        };

        Shell.prototype.shellCreate = function (args) {
            if (args[0].substring(0, 1) === ".") {
                _StdOut.putText("Cannot create a file starting with '.'");
            } else {
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CREATE_FILENAME_IRQ, args[0]));
            }
        };

        Shell.prototype.shellWrite = function (args) {
            var fileName = args[0];
            var data = args.slice(1).join(" ");
            var x = 0;

            if (fileName.substring(0, 1) === ".") {
                _StdOut.putText("Cannot write to this kind of file.");
                _StdOut.advanceLine();
            } else if ((data.charAt(0) === "\"") && (data.charAt(data.length - 1) === "\"")) {
                data = data.substring(1, data.length - 1);

                //write file
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(WRITE_FILE_IRQ, [fileName, data]));
            } else {
                _StdOut.putText("Invalid Arguements");
                _StdOut.advanceLine();
            }
        };

        Shell.prototype.shellRead = function (args) {
            if (args[0].substring(0, 1) === ".") {
                _StdOut.putText("Cannot read this kind of file.");
                _StdOut.advanceLine();
            } else {
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(READ_FILE_IRQ, args[0]));
            }
        };

        Shell.prototype.shellDelete = function (args) {
            if (args[0].substring(0, 1) === ".") {
                _StdOut.putText("Cannot delete this kind of file.");
                _StdOut.advanceLine();
            } else {
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(DELETE_IRQ, args[0]));
            }
        };

        Shell.prototype.shellListFiles = function () {
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(FILENAMES_LIST_IRQ, ""));
        };

        Shell.prototype.shellFormat = function () {
            if (_ReadyQueue.getSize() > 0) {
                _StdOut.putText("Please wait until the CPU is finished executing");
                _StdOut.advanceLine();
            } else {
                _HardDrive.init();

                if (_HardDrive.testEmpty() == false) {
                    _StdOut.putText("Successfully formatted.");
                    _StdOut.advanceLine();
                } else {
                    _StdOut.putText("An error occurred.");
                    _StdOut.advanceLine();
                }
            }
        };
        return Shell;
    })();
    TSOS.Shell = Shell;
})(TSOS || (TSOS = {}));
