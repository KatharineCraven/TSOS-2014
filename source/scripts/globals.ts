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
var APP_NAME: string    = "Katie's Rad OS";   
var APP_VERSION: string = "6";   

var CPU_CLOCK_INTERVAL: number = 100;   // This is in ms, or milliseconds, so 1000 = 1 second.

var TIMER_IRQ: number = 0;  // Pages 23 (timer), 9 (interrupts), and 561 (interrupt priority).
                            // NOTE: The timer is different from hardware/host clock pulses. Don't confuse these.
var KEYBOARD_IRQ: number = 1;

//Handles output
var SYSOUT_IRQ: number = 2;

//Error for hex input
var SYSERR_IRQ: number = 3;

//makes one process active and one process put into waiting
var SWITCHRUNNING_IRQ: number = 4;

//makes a single process active
var MAKERUNNING_IRQ: number = 5;

//makes a single process waiting
var MAKEWAITING_IRQ: number = 6;

//makes a single process ready
var MAKEREADY_IRQ: number= 7;

//terminate a process
var TERMINATE_IRQ: number= 8;

var KILL_IRQ: number = 9;

var MEM_OUT_OF_BOUNDS: number = 10;

var FILENAME_FAILURE_IRQ: number = 11;

var FILENAME_SUCCESS_IRQ: number = 12;

var TRACK1_MEM_FULL: number = 13;

var CREATE_FILENAME_IRQ: number = 14;

var WRITE_FILE_IRQ: number =15;

var WRITE_FAIL_SUCCEED_IRQ: number = 16;

var READ_FILE_IRQ: number = 17;

var READ_ERROR_IRQ: number = 18;

var DELETE_IRQ: number = 19;

var DELETE_SUCCESS_FAIL_IRQ: number = 20;

var FILENAMES_LIST_IRQ: number = 21;

var _CpuExecutionCount;

var _TEST = "";
//
// Global Variables
//
var _CPU: TSOS.Cpu;  // Utilize TypeScript's type annotation system to ensure that _CPU is an instance of the Cpu class.

var _OSclock: number = 0;  // Page 23.

var _Mode: number = 0;     // (currently unused)  0 = Kernel Mode, 1 = User Mode.  See page 21.

var _Canvas: HTMLCanvasElement = null;  // Initialized in hostInit().
var _DrawingContext = null;             // Initialized in hostInit().
var _DefaultFontFamily = "sans";        // Ignored, I think. The was just a place-holder in 2008, but the HTML canvas may have use for it.
var _DefaultFontSize = 13;
var _FontHeightMargin = 4;              // Additional space added to font size when advancing a line.

var _CanvasTwo: HTMLCanvasElement = null; //canvas for graphic bar
var _DrawingContextTwo = null; //canvas drawing context for graphic bar
var _StatusMessage = ""; //status message
var _BSODD = new Image(); //blue screen of death

var _TempCan: HTMLCanvasElement = null; //used for canvas editing
var _TempContext = null; //used for canvas editing
var _ConsoleDiv = null; //DIV element.


var _Trace: boolean = true;  // Default the OS trace to be on.

// The OS Kernel and its queues.
var _Kernel: TSOS.Kernel;
var _KernelInterruptQueue = null;
var _KernelBuffers: any[] = null;
var _KernelInputQueue = null;

//Memory program partitions of 256 size each
var _NumProgForMem = 3;
//var _LoadedProgram = -1;
var _ResidentQueue;
var _ReadyQueue;

var _MemoryManager = null; //memory manager

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

var _ReadyQueueOutput = null; //ready queue di

var _pidCount;
var _ResidentList;
// Standard input and output
var _StdIn  = null;
var _StdOut = null;

//UserCode
var _UserCode;

// UI
var _Console: TSOS.Console;
var _OsShell: TSOS.Shell;

// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode: boolean = false;

// Global Device Driver Objects - page 12
var _krnKeyboardDriver = null;

var _hardwareClockID: number = null;

// For testing...
var _GLaDOS: any = null;
var Glados: any = null;

var onDocumentLoad = function() {
	TSOS.Control.hostInit();
};
