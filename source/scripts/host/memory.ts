/*---------------------------
Memory.ts

Memory Prototype

*/

module TSOS{

	export class Memory{
		constructor(public mem = [], public xc = 0){
			for(var i = 0; i< 256; i++){
				this.mem.push("Hi");
			}
		}

		public setLength(){
			this.mem.length = 256;
		}

		public addToMem(hex){
			this.xc += 1;
			if(this.xc > 255){
				this.xc = 0; //wrap memory for now
			}

			this.mem.push(hex);
		}

		public displayMem(){
			var s = this.mem[0];
			for(var i = 1; i< this.mem.length; i++){
				s += this.mem[i];
			}

			return s;
		}
	}
}