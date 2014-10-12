/* Memory Manager 
*/

module TSOS{

	export class MemoryManager{

		constructor(public mry = new Memory(), public xc = 0){

		}

		public addToMem(input){
			for(var l = 0; l< input.length; l = l+2){
				this.putHex(""+input.charAt(l)+input.charAt(l+1));
			}
		}

		public addAt(i, input){
			while(i> 255){
				i -= 256;
			}

			this.mry.write(i, input);
		}

		public getMemValue(i){
			while(i> 255){
				i -= 256;
			}
			return this.mry.read(i);
		}

		public putHex(hex){
			if(this.xc > 255){
				this.xc = 0; //wrap memory for now
			}

			this.mry.write(this.xc, hex);

			this.xc += 1;
		}

		public clearAllMem(){
			this.mry = new Memory();
			this.xc = 0;
		}

		public displayMem(){
			var j = this.xc;
			var counter = 0;
			var s = "0x0: ";

			//if empty
			if(j == 0){
				for(var i = 0; i< 256; i++){
					if ((i%8 ==0) && (i != 0)){
						s+="\n0x"+ i.toString(16)+": ";
					}

					s += "00 ";
			}

			//otherwise
			}else{
				
				if(j > 255){
					//we are out of memory!!! Not sure what to do, so I'll wrap memory for now
					this.xc = 0;
				}

				//output whats there
				for(var i = 0; i< j; i++){

					if ((i%8 ==0) && (i != 0)){
						s+="\n0x"+ i.toString(16)+": ";
					}

					s += this.mry.read(i) +" ";
				}

				//if theres still spots to fill (due to wrapping or cleared memory)
				if(this.mry.filledTo() > j){
					for(var k = j; k< 256; k++){
						
						if ((k%8 ==0) && (k != 0)){
							s+="\n0x"+ k.toString(16)+": ";
						}

						s+= "00 "
					}

				//otherwise continue filling
				}else{
					for(var k = j; k< this.mry.filledTo(); k++){
						
						if ((k%8 ==0) && (k != 0)){
							s+="\n0x"+ k.toString(16)+": ";
						}

						s += this.mry.read(k) +" ";
					}

					for(var m = this.mry.filledTo(); m< 256; m++){
						
						if ((m%8 ==0) && (m != 0)){
							s+="\n0x"+ m.toString(16)+": ";
						}

						s += "00 ";
					}
				}
			}

			return s;
		}
	}
}