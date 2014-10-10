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
				for(var i = 0; i< this.mem.length; i++){
					s += this.mem[i] +" ";
				}

				for(var k = j; i< 2; k++){
					s+= "00 "
				}
			}

			for(var i = 1; i< 256; i++){
				s += "00 ";
			}

			return s;
		}
	}
}