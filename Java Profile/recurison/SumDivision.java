package recurison;
import java.util.ArrayList;
public class SumDivision {
public static void main(String[] args) {

  //int set[] = {3,4,7,2,8,7,9,3,4,7,2,8,7,9,5,3,8,7,3};  int sum=0;  for(int i = 0; i<set.length; i++){sum=sum+set[i];}
	int set[] = {2,1,2,3,4,8};  int sum=0;  for(int i = 0; i<set.length; i++){sum=sum+set[i];}
	System.out.println("We are finding Array with sum "+sum/2);
		
	for(int i = 0 ; i < set.length-1; i++) {
	ArrayList <Integer> DArray = new ArrayList(); 
	boolean haveSet = (sum&1)==0 && haveSum(set , sum/2 , i , DArray);       // or sum%2
	
	if(!haveSet) {System.out.println("Now more Set Seperation is not possible."); break;}
	if(haveSet) {for(int halfArray : DArray) {System.out.print(halfArray+" ");}   }
        System.out.println();}
     }


static boolean haveSum(int a[] , int sum , int i , ArrayList<Integer> temp ) {     // in bracket don't say its use it change
if(a.length<=i || sum<0) return false;
if(sum==0) return true;

temp.add(a[i]);
boolean nextPossible = haveSum(a, sum-a[i] , i+1 , temp);
if(nextPossible) return true;
// can use else but still work without else no need of else
// this make backtracking
temp.remove(temp.size()-1);      //  remove last element  -1 for as 0 is start so last is n-1
return haveSum(a , sum , i+1, temp);
}
}
