/* Process Control Block
*/

module TSOS{

	export class PCB{

		constructor(private pid = 0, private processState= "NEW", private pc = 0, private xReg = 0, private yReg = 0, private accumulator = 0, private zFlag =0, private baseReg = 0, private limitReg = 255, private partitionNum = 1, private priority = 5, private location = "memory"){

		}
		
		public setState(status){
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

		public setPid(piid){
			this.pid = piid;
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

		public setBaseReg(br){
			this.baseReg = br;
		}

		public getBaseReg(){
			return this.baseReg;
		}

		public setLimitReg(lr){
			this.limitReg = lr;
		}

		public getLimitReg(){
			return this.limitReg;
		}

		public setPartition(part){
			this.partitionNum = part;
			this.setBaseReg((256*part) -256);
			this.setLimitReg((256*part) -1);
			this.setPC(this.getBaseReg());
		}

		public getPartition(){
			return this.partitionNum;
		}

		public getPriority(){
			return this.priority;
		}

		public setPriority(pri){
			this.priority = pri;
		}

		public setLocation(loc){
			this.location = loc;
		}

		public getLocation(){
			return this.location;
		}

	}
}