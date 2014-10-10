/*---------------------------
Memory.ts

Memory Prototype

*/

module TSOS{

	export class Memory{

		constructor(public mem = new Array(), public xc = 0){

		}

		public setLength(){
			this.mem.length = 256;
		}

		public write(input){
			for(var l = 0; l< input.length; l = l+2){
				this.addToMem(""+input.charAt(l)+input.charAt(l+1));
			}
		}

		public addToMem(hex){
			if(this.xc > 255){
				this.xc = 0; //wrap memory for now
			}

			this.mem[this.xc] =hex;

			this.xc += 1;
		}

		public displayMem(){
			var j = this.xc;
			var s = "";
			if(j == 0){
				for(var i = 0; i< 256; i++){
					s += "00 ";
				}

			}else if(j < 256){
				//debugger;
				for(var i = 0; i< j; i++){
					s += this.mem[i] +" ";
				}

				if(this.mem.length < 256){
					for(var k = j; k< 256; k++){
						s+= "00 "
					}
				}else{
					for(var k = j; k< this.mem.length; k++){
						s += this.mem[i] +" ";
					}

					for(var m = this.mem.length; m< 256; m++){
						s += "00 ";
					}
				}
			}

			return s;
		}
	}
}