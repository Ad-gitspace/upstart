package practise;
import java.util.Arrays;
public class TwoPointer {
public static void main(String[] args)  {
		
int[] array = {-1 , 4 , 1 , 2 , 0 , -2 ,-6 , -2 , 4 };   Arrays.sort(array);
	 	  
for (int i =0 ; i < array.length; i++) {
	 for (int j =i+1 ; j < array.length; j++) {
		 for (int k =j+1 ; k < array.length; k++) {

if(array[i] + array[j] + array[k] == 0) 
  {System.out.println(array[i]+" "+array[j]+" "+array[k]); break;} }}}}}