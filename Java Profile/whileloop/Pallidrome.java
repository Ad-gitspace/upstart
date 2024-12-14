package whileloop;
import java.util.Scanner;
public class Pallidrome {
	public static void main(String[] args) {
Scanner sc = new Scanner(System.in);

for(int n = sc.nextInt();  ; ) {

int a = n ;
int r = 0;

while(n>0) {
	int ld = n%10;     n /= 10;
	r =  r*10+ld;
	} System.out.println( "Reverse is "+r);

if (r==a) {System.out.println("Yes it's Pallidrome");}
else {System.out.println("No it's not palidrome");}

n = sc.nextInt();   // Made it use again & Again.

}
	}

}
