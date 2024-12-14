package daralListCollecton;
import java.util.Collections;  import java.util.ArrayList;  import java.util.PriorityQueue;
public class SlidindWindow_Eg {public static void main(String[] args) {

int[] p = {6,5,4,3,2,13,5,70,8,600,500};   int k = 4;
PriorityQueue<Integer> ans = new PriorityQueue();

//	for(int i = 0; i <= p.length-k; i++) {
//		if(p[i]>p[i+1] && p[i]>p[i+2]) {System.out.print(p[i]+" ");}      //child method k is not applicable
//		if(p[i+1]>p[i] && p[i+1]>p[i+2]) {System.out.print(p[i+1]+" ");}
//		if(p[i+2]>p[i+1] && p[i+2]>p[i]) {System.out.print(p[i+2]+" ");}}
//System.out.println();
	
for(int i = 0; i <= p.length-k; i++) { ArrayList<Integer> temp = new ArrayList();
	for(int j =i; j<i+k;j++) {temp.add(p[j]);} Collections.sort(temp, Collections.reverseOrder());
			System.out.print(temp.remove(0)+" ");}}}
