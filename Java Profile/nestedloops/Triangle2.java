package nestedloops;
import java.util.Scanner;
public class Triangle2 {
	public static void main(String[] args) {
		Scanner sc = new Scanner(System.in);
		int n = sc.nextInt();
 
		int s = 1;
		for (int a = 1; a <=n ; a++) {
		for(int i = 1; i <=n-a; i++) {System.out.print("   ");}
		for (int i = 1 ; i <=a; i++) {System.out.print(s++ +"    ");}
		System.out.println();}

	}
}
