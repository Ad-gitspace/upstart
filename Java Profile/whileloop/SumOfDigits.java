package whileloop;
import java.util.Scanner;
public class SumOfDigits {
	public static void main(String[] args) {
		Scanner sc = new Scanner(System.in);
		int n = sc.nextInt();
		int a =n;
		int sum = 0;
//		for (int i=n; i >0 ; i=n ) { // Just not using while loop!! //
//			
//			int lastDigit = n%10;
//			n = n/10;
//		sum += lastDigit;	
//		}
//		System.out.println(sum);
		
		
		
		while(n>0) {int LastDigit = n%10;  n /= 10;  sum += LastDigit;}
		System.out.println(sum);
		int Nd = (int)Math.log10(a)+1;     System.out.println(Nd);
		
	}
	

}
