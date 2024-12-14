package sortedOrder;
public class Assending {
	public static void main(String[] args) {
		
		short[] data = {45,-673,45,27,(short)16.9}; 
		
		for(short a = 0; a<data.length-1; a++) {
			for(short b = 0; b<data.length-1;b++) {
			if (data[b] > data[b+1]) {
				short temp = data[b+1];        // Revale its use further___
		    	data[b+1] = data[b];      // temp on top to not confuse computer   
				data[b] =temp;	 // if temp replace by data[b+1] but its data [b by previous line]
			}
		}
	}
		
		for(short data2 : data) {
		System.out.print(data2 +" ");}
}}

