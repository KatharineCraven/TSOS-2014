/* Process Control Block
*/

module TSOS{

	export class PCB{

		constructor(private pid = _pidCount, private processState= "NEW", private pc = 0, private xReg = 0, private yReg = 0, private accumulator = 0, private zFlag =0){

		}
		
		public updateState(status){
			this.processState = status;
		}

		public getState(){
			return this.processState;
		}

		public setPC(thePC){
			this.pc = thePC;
		}

		public getPC(){
			return this.pc;
		}

		public getPid(){
			return this.pid;
		}

		public setXReg(x){
			this.xReg = x;
		}

		public getXReg(){
			return this.xReg;
		}

		public setYReg(y){
			this.yReg = y;
		}

		public getYReg(){
			return this.yReg;
		}

		public setAccum(acc){
			this.accumulator = acc;
		}

		public getAccum(){
			return this.accumulator;
		}

		public setZFlag(z){
			this.zFlag = z;
		}

		public getZFlag(){
			return this.zFlag;
		}

	}
}