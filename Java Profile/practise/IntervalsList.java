package practise;

import java.util.ArrayList;
//pending


public class IntervalsList {

	public static void main(String[] args) {
		
		int[] set = {3,7};
		int[] merge = {1,99};
		
	    //for (int i = 0 ; i < set.length-1; i++) {
		
		if (set == null && merge == null) {System.out.println("[]");}
		if (set == null) {System.out.println("["+merge[0]+","+merge[merge.length-1]+"]");}
		if (merge == null) {System.out.println("["+set[0]+","+set[set.length-1]+"]");}	
		if (set[set.length-1] < merge[0]) {System.out.println("["+set[0]+","+set[set.length-1]+"] , "+"["+merge[0]+","+merge[merge.length-1]+"]");}
		if (set[0] > merge[merge.length-1]) {System.out.println("["+merge[0]+","+merge[merge.length-1]+"] , "+"["+set[0]+","+set[set.length-1]+"]");}
		if (set[set.length-1] >= merge[0] && set[set.length-1] < merge[merge.length-1]) {System.out.println("["+set[0]+","+merge[merge.length-1]+"]");}
		if (set[set.length-1] > merge[0] && set[set.length-1] < merge[merge.length-1]) {System.out.println("["+set[0]+","+set[set.length-1]+"] , "+"["+merge[0]+","+merge[merge.length-1]+"]");}

	    }

	//}

}
