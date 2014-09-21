///<reference path="../globals.ts" />

/* ------------
     Console.ts

     Requires globals.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell.  The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */

module TSOS {

    export class Console {

        constructor(public currentFont = _DefaultFontFamily,
                    public currentFontSize = _DefaultFontSize,
                    public currentXPosition = 0,
                    public currentYPosition = _DefaultFontSize,
                    public commandHistory = [""],
                    public cmdCounter = 0,
                    public prevX = [],
                    public buffer = "") {

        }

        public init(): void {
            this.clearScreen();
            this.resetXY();
            this.commandHistory = [""];
        }

        public addCommandHistory(cmd): void{
            this.commandHistory.push(cmd);
            this.cmdCounter = this.commandHistory.length;
        }

        private clearScreen(): void {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        }

        private resetXY(): void {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
            this.prevX= [];
        }

        public handleInput(): void {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).

                if (chr === String.fromCharCode(13)) { //     Enter key
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);
                    this.buffer = Utils.trim(this.buffer);
                    this.buffer = this.buffer.toLowerCase();
                    this.addCommandHistory(this.buffer);
                    // ... and reset our buffer.
                    this.buffer = "";
                    this.cmdCounter = this.commandHistory.length;
                } else if(chr === String.fromCharCode(8)){ 
                    //backspace
                    if (this.buffer != ">"){;
                        this.currentXPosition = 
                            CanvasTextFunctions.backspace((this.buffer.charAt(this.buffer.length-1)), this.currentYPosition, this.buffer);

                        this.buffer = this.buffer.substring(0, this.buffer.length-1)
                    }

                }else if(chr == String.fromCharCode(40)){
                    this.cmdCounter++;
                    if(this.cmdCounter < this.commandHistory.length){
                        this.buffer = CanvasTextFunctions.cmdHistory(this.currentYPosition, this.buffer, this.commandHistory[this.cmdCounter]);

                    }else if(this.cmdCounter == this.commandHistory.length){
                        this.buffer = CanvasTextFunctions.cmdHistory(this.currentYPosition, this.buffer, "");

                    }else{
                        this.cmdCounter = this.commandHistory.length;
                    }

                }else if(chr == String.fromCharCode(38)){
                    this.cmdCounter--;
                    if(this.cmdCounter >= 0){
                        this.buffer = CanvasTextFunctions.cmdHistory(this.currentYPosition, this.buffer, this.commandHistory[this.cmdCounter]);

                    }else{
                        this.cmdCounter = 0;
                    }

                }else if(chr == String.fromCharCode(9)){
                    _OsShell.autoComplete();

                }else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
                // TODO: Write a case for Ctrl-C.
            }
        }

        public putText(text): void {
            // My first inclination here was to write two functions: putChar() and putString().
            // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
            // between the two.  So rather than be like PHP and write two (or more) functions that
            // do the same thing, thereby encouraging confusion and decreasing readability, I
            // decided to write one function and use the term "text" to connote string or char.
            // UPDATE: Even though we are now working in TypeScript, char and string remain undistinguished.
            if (text !== "") {
                // Draw the text at the current X and Y coordinates.
                var x = text.length/2;
                if(CanvasTextFunctions.measure(this.currentFont, this.currentFontSize, text) > (500 -this.currentXPosition)){
                    this.advanceLine();
                }

                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                // Move the current X position.
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                this.currentXPosition = this.currentXPosition + offset;
            }
         }

        public advanceLine(): void {
            this.prevX.push(this.currentXPosition);
            this.currentXPosition = 0;
            this.currentYPosition += _DefaultFontSize + _FontHeightMargin;
            // TODO: Handle scrolling. (Project 1)

            if(this.currentYPosition > 480){
                _TempCan.width = _Canvas.width;
                _TempCan.height = _Canvas.height+ 17;
                _TempContext.drawImage(_Canvas, 0 ,0);
                _Canvas.height = _Canvas.height+ 17;
                _DrawingContext.drawImage(_TempCan, 0, 0);
                _ConsoleDiv.scrollTop = _ConsoleDiv.scrollHeight;
            }

        }
    }
 }
