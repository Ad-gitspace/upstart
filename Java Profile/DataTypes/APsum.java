package DataTypes;
import java.util.Scanner;
public class APsum {
	public static void main(String[] args) {
		
		Scanner sc = new Scanner(System.in);

		System.out.println("Enter First Term");
		int a = sc.nextInt();
		
		System.out.println("Enter Last Term");
		int l = sc.nextInt();
		
		System.out.println("Enter Term's difference Term");
		int d = sc.nextInt();
		
		int sum = ((l-a+d)*(a+l))/2*a;
		
		if ((l-a)%d==0) { System.out.println("So your AP's sum is " + sum);}
		else {System.out.println("This cannot be exist in perfect AP");}
}}
