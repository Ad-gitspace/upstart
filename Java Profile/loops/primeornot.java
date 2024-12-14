package loops;
import java.util.Scanner;
public class primeornot {
	public static void main(String[] args) {
	 Scanner sc = new Scanner(System.in);
	 
	 System.out.println("Enter Number");
		int number = sc.nextInt();
		
		switch (number) {
		case 1 : System.out.println("This is Co-Prime"); break ;
		case 2 : System.out.println("Prime"); break ;
        
		default:
		for (int p = 2; p<number; p++) {
		if (number%p==0)
			{System.out.println("Composit"); break;}
		else {System.out.println("Prime"); break;}}}


			
			
			
		
}}
