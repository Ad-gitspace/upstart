package nestedloops;
import java.util.Scanner;
public class Triangleempty {
	public static void main(String[] args) {
		Scanner sc = new Scanner(System.in);
		int n = sc.nextInt();
		System.out.println("^");
		
		for (int i = 2; i<n; i++)   {System.out.print("|");
		for (int a = 1; a<=i-2; a++) {System.out.print(" ");}
		for (int j = 1; j<2; j++) {System.out.print("'");}
		
		System.out.println();}
	
		
	for (int i = 1 ; i <=n; i++) {System.out.print("_");}
	
	}
}
