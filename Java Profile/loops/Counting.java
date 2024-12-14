package loops;

public class Counting {

	public static void main(String[] args) {

 for (int a = 0 ; a <= 16; a=a+4) {
	System.out.println(a);  }
		
		for( int a = 99 ; a <=990; a = a+99) {
		System.out.println(a);       }
		
		int l = 10;
		int sum = 0 ;
		for (int d = 2 ; d <= l ; d = d+3) {
			sum = sum + d;		}
		System.out.println(sum);
		
		int tableof = 4;
		for( int a = 1; a <=10; a++) { // [a++ means a=a+1]
			System.out.println(a*tableof);       }
		for(; ; ) {System.out.println("a");}
		
	}}
