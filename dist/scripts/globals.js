/* ------------
Globals.ts
Global CONSTANTS and _Variables.
(Global over both the OS and Hardware Simulation / Host.)
This code references page numbers in the text book:
Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
------------ */
//test comment
//
// Global "CONSTANTS" (There is currently no const or final or readonly type annotation in TypeScript.)
// TODO: Make a global object and use that instead of the "_" naming convention in the global namespace.
//
var APP_NAME = "Katie's Rad OS";
var APP_VERSION = "6";

var CPU_CLOCK_INTERVAL = 100;

var TIMER_IRQ = 0;

// NOTE: The timer is different from hardware/host clock pulses. Don't confuse these.
var KEYBOARD_IRQ = 1;

//Handles output
var SYSOUT_IRQ = 2;

//Error for hex input
var SYSERR_IRQ = 3;

//makes one process active and one process put into waiting
var SWITCHRUNNING_IRQ = 4;

//makes a single process active
var MAKERUNNING_IRQ = 5;

//makes a single process waiting
var MAKEWAITING_IRQ = 6;

//makes a single process ready
var MAKEREADY_IRQ = 7;

//terminate a process
var TERMINATE_IRQ = 8;

var KILL_IRQ = 9;

var MEM_OUT_OF_BOUNDS = 10;

var FILENAME_FAILURE_IRQ = 11;

var FILENAME_SUCCESS_IRQ = 12;

var TRACK1_MEM_FULL = 13;

var CREATE_FILENAME_IRQ = 14;

var _CpuExecutionCount;

var _TEST = "";

//
// Global Variables
//
var _CPU;

var _OSclock = 0;

var _Mode = 0;

var _Canvas = null;
var _DrawingContext = null;
var _DefaultFontFamily = "sans";
var _DefaultFontSize = 13;
var _FontHeightMargin = 4;

var _CanvasTwo = null;
var _DrawingContextTwo = null;
var _StatusMessage = "";
var _BSODD = new Image();

var _TempCan = null;
var _TempContext = null;
var _ConsoleDiv = null;

var _Trace = true;

// The OS Kernel and its queues.
var _Kernel;
var _KernelInterruptQueue = null;
var _KernelBuffers = null;
var _KernelInputQueue = null;

//Memory program partitions of 256 size each
var _NumProgForMem = 3;

//var _LoadedProgram = -1;
var _ResidentQueue;
var _ReadyQueue;

var _MemoryManager = null;

//quantum
var _Quantum = 6;

//current process running
var _CurrentPCB;

//Scheduler
var _TScheduler;

//Memory
var _MemoryOutput;

var _CPUOutput;

var _HardDrive;
var _HardDriveOutput;

var _ReadyQueueOutput = null;

var _pidCount;
var _ResidentList;

// Standard input and output
var _StdIn = null;
var _StdOut = null;

//UserCode
var _UserCode;

// UI
var _Console;
var _OsShell;

// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode = false;

// Global Device Driver Objects - page 12
var _krnKeyboardDriver = null;

var _hardwareClockID = null;

// For testing...
var _GLaDOS = null;
var Glados = null;

var onDocumentLoad = function () {
    TSOS.Control.hostInit();
};
