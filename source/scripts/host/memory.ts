/*---------------------------
Memory.ts

Memory Prototype

*/

module TSOS{

	export class Memory{

		constructor(public mem = new Array()){

		}

		public write(i, hex){
			this.mem[i] =hex;
		}

		public readAll(){
			return this.mem;
		}

		public read(i){
			return this.mem[i];
		}

		public filledTo(){
			return this.mem.length;
		}

		
	}
}