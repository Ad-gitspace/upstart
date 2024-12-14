package loops;

import java.util.Scanner;

public class Factorial {

	public static void main(String[] args) {

Scanner sc = new Scanner(System.in);

long factorial = sc.nextInt();
long n = 1 ;

for(long i = factorial; i>0 ; i--) {
	n = n*i;}

	System.out.println("Factorial of " + factorial + " is " + n);
	

		
	}

}
