package sortedOrder;

public class DirectSwoap {

	public static void main(String[] args) {
		
		short[] data = {2,-3,44,11,22,-1,5};
		
		for(short a = 0 ; a < data.length; a++) {
			for(short b = 0; b<data.length; b++ ) {
				if(data[b]>data[a]) {
					short temp = data[a];
					data[a] = data[b];
					data[b]=temp;	               }}}
				
		for(short data2:data) {System.out.print(data2+" ");}
	}}
