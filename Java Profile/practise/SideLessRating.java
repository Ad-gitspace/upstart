package practise;

public class SideLessRating {

	public static void main(String[] args) {

int sum = 0;
		int[] n = {3,1,2,2 , 3, 8 ,32, 3, 0,9,8};
		int less[] = new int[n.length]; 
for (int i = 0 ; i < n.length; i++) {less[i] = 1;}
		
           for(int i = 0; i < n.length-1; i++) {
        	   if (n[i] < n[i+1]) {less[i+1] += 1;} } 
           
           for(int i = n.length-1; i > 0; i--) {
        	   if (n[i-1] > n[i]) {less[i-1] += 1;} } 
          
           for (int i= 0; i<n.length; i++) { sum = sum+ less[i];
           } System.out.println(sum);
           for (int i= 0; i<n.length; i++) {System.out.print(less[i] + " ");
           }
           
	}

}
