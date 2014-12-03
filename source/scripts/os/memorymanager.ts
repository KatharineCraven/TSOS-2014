/* Memory Manager 
*/

module TSOS{

	export class MemoryManager{

		constructor(public mry = new Memory(), public xc = 0, public firstPart = false, public secondPart = false, public thirdPart =false ){
		}

		public initMemory(){
			var i;
			for(i =0; i<(256*_NumProgForMem); i++ ){
				this.mry.write(i, "00");
			}
		}

		public setPartitionAsUsed(parti){
			if(parti == 1){
				this.firstPart = true;
			}else if(parti == 2){
				this.secondPart = true;
			}else if(parti == 3){
				this.thirdPart = true;
			}
		}

		public setPartitionAsUnused(parti){
			if(parti == 1){
				this.firstPart = false;
			}else if(parti == 2){
				this.secondPart = false;
			}else if(parti == 3){
				this.thirdPart = false;
			}
		}

		public findNextAvailPart(){
			if(this.firstPart == false){
				return 1;
			}else if(this.secondPart == false){
				return 2;
			}else if(this.thirdPart == false){
				return 3;
			}else{
				return 0;
			}
		}

		public addToMem(input, partition){
			if(input.length< 2){
				input = "0"+input;
			}

			this.xc = (256*partition) - 256;

			for(var l = 0; l< input.length; l = l+2){

				if(l > 255){
					//ERROR
					_KernelInterruptQueue.enqueue(new Interrupt(MEM_OUT_OF_BOUNDS, partition));
					this.xc = 0;
					break;

				}else{
					this.putHex(""+input.charAt(l)+input.charAt(l+1), partition);
				}

			}
		}

		//partition 1, 2, or 3
		public addAt(i, input, partition){
			if(input.length< 2){
				input = "0"+input;
			}

			if((i > 255) || (i < 0)){
				//ERROR
					_KernelInterruptQueue.enqueue(new Interrupt(MEM_OUT_OF_BOUNDS, partition));
					this.xc = 0;

			}else{
				i = ((partition*256)-256)+i;
				this.mry.write(i, input);
			}

			/*while(i> ((256*partition)-1)){
				i -= 256*partition;
			}*/

			//this.mry.write(i, input);
		}

		public getMemValue(i, partition){

			if((i > 255) || (i < 0)){
				//ERROR
				_KernelInterruptQueue.enqueue(new Interrupt(MEM_OUT_OF_BOUNDS, partition));
				this.xc = 0;
				//RETURN SOMETHING?

			}else{
				i = ((partition*256)-256)+i;
				return this.mry.read(i);
			}

		}

		public putHex(hex, partition){
			if((this.xc > ((256*partition)-1))|| (this.xc <256*partition -256)){
				//this.xc = 256*partition -256; //wrap memory for now

				_KernelInterruptQueue.enqueue(new Interrupt(MEM_OUT_OF_BOUNDS, partition));
				this.xc = 0;
			}else{
				this.mry.write(this.xc, hex);

				this.xc += 1;
			}

			//this.mry.write(this.xc, hex);

			//this.xc += 1;
		}

		public clearAllMem(){
			this.mry = new Memory();
			this.xc = 0;
		}

		//clear memory partition

		public clearMemoryPartition(partition){
			var i; 

			for(i =((256*partition)-256); i<((256*partition)-1); i++){
				this.mry.write(i, "00")
			}
		}

		public displayMem(){
			//var j = this.xc;
			var counter = 0;
			var s = "0x0: ";

			//Initialize Memory as Zeros
			for(counter =0; counter < (256*_NumProgForMem); counter++){
				if ((counter%8 ==0) && (counter != 0)){
						s+="\n0x"+ counter.toString(16)+": ";
					}

					s += this.mry.read(counter) +" ";
			}

			return s;
		}
	}
}