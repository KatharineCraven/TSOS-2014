///<reference path="../globals.ts" />
/* ------------
Console.ts
Requires globals.ts
The OS Console - stdIn and stdOut by default.
Note: This is not the Shell.  The Shell is the "command line interface" (CLI) or interpreter for this console.
------------ */
var TSOS;
(function (TSOS) {
    var Console = (function () {
        function Console(currentFont, currentFontSize, currentXPosition, currentYPosition, commandHistory, cmdCounter, prevX, buffer) {
            if (typeof currentFont === "undefined") { currentFont = _DefaultFontFamily; }
            if (typeof currentFontSize === "undefined") { currentFontSize = _DefaultFontSize; }
            if (typeof currentXPosition === "undefined") { currentXPosition = 0; }
            if (typeof currentYPosition === "undefined") { currentYPosition = _DefaultFontSize; }
            if (typeof commandHistory === "undefined") { commandHistory = [""]; }
            if (typeof cmdCounter === "undefined") { cmdCounter = 0; }
            if (typeof prevX === "undefined") { prevX = []; }
            if (typeof buffer === "undefined") { buffer = ""; }
            this.currentFont = currentFont;
            this.currentFontSize = currentFontSize;
            this.currentXPosition = currentXPosition;
            this.currentYPosition = currentYPosition;
            this.commandHistory = commandHistory;
            this.cmdCounter = cmdCounter;
            this.prevX = prevX;
            this.buffer = buffer;
        }
        Console.prototype.init = function () {
            this.clearScreen();
            this.resetXY();
            this.commandHistory = [""];
        };

        Console.prototype.addCommandHistory = function (cmd) {
            this.commandHistory.push(cmd);
            this.cmdCounter = this.commandHistory.length;
        };

        Console.prototype.clearScreen = function () {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        };

        Console.prototype.resetXY = function () {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
            this.prevX = [];
        };

        Console.prototype.handleInput = function () {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();

                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) {
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);
                    this.buffer = TSOS.Utils.trim(this.buffer);
                    this.buffer = this.buffer.toLowerCase();
                    this.addCommandHistory(this.buffer);

                    // ... and reset our buffer.
                    this.buffer = "";
                    this.cmdCounter = this.commandHistory.length;
                } else if (chr === String.fromCharCode(8)) {
                    //backspace
                    if (this.buffer != ">") {
                        ;
                        this.currentXPosition = TSOS.CanvasTextFunctions.backspace((this.buffer.charAt(this.buffer.length - 1)), this.currentYPosition, this.buffer);

                        this.buffer = this.buffer.substring(0, this.buffer.length - 1);
                    }
                } else if (chr == String.fromCharCode(40)) {
                    this.cmdCounter++;
                    if (this.cmdCounter < this.commandHistory.length) {
                        this.buffer = TSOS.CanvasTextFunctions.cmdHistory(this.currentYPosition, this.buffer, this.commandHistory[this.cmdCounter]);
                    } else if (this.cmdCounter == this.commandHistory.length) {
                        this.buffer = TSOS.CanvasTextFunctions.cmdHistory(this.currentYPosition, this.buffer, "");
                    } else {
                        this.cmdCounter = this.commandHistory.length;
                    }
                } else if (chr == String.fromCharCode(38)) {
                    this.cmdCounter--;
                    if (this.cmdCounter >= 0) {
                        this.buffer = TSOS.CanvasTextFunctions.cmdHistory(this.currentYPosition, this.buffer, this.commandHistory[this.cmdCounter]);
                    } else {
                        this.cmdCounter = 0;
                    }
                } else if (chr == String.fromCharCode(9)) {
                    _OsShell.autoComplete();
                } else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);

                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
                // TODO: Write a case for Ctrl-C.
            }
        };

        Console.prototype.putText = function (text) {
            // My first inclination here was to write two functions: putChar() and putString().
            // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
            // between the two.  So rather than be like PHP and write two (or more) functions that
            // do the same thing, thereby encouraging confusion and decreasing readability, I
            // decided to write one function and use the term "text" to connote string or char.
            // UPDATE: Even though we are now working in TypeScript, char and string remain undistinguished.
            if (text !== "") {
                // Draw the text at the current X and Y coordinates.
                //in progress attempt to linewrap
                if (TSOS.CanvasTextFunctions.measure(this.currentFont, this.currentFontSize, text) > (500 - this.currentXPosition)) {
                    this.advanceLine();
                }

                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);

                // Move the current X position.
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                this.currentXPosition = this.currentXPosition + offset;
            }
        };

        Console.prototype.advanceLine = function () {
            this.prevX.push(this.currentXPosition);
            this.currentXPosition = 0;
            this.currentYPosition += _DefaultFontSize + _FontHeightMargin;

            // TODO: Handle scrolling. (Project 1)
            if (this.currentYPosition > 480) {
                _TempCan.width = _Canvas.width;
                _TempCan.height = _Canvas.height + 17;
                _TempContext.drawImage(_Canvas, 0, 0);
                _Canvas.height = _Canvas.height + 17;
                _DrawingContext.drawImage(_TempCan, 0, 0);
                _ConsoleDiv.scrollTop = _ConsoleDiv.scrollHeight;
            }
        };
        return Console;
    })();
    TSOS.Console = Console;
})(TSOS || (TSOS = {}));
