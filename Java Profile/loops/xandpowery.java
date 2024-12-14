package loops;
import java.util.Scanner;
public class xandpowery {
	public static void main(String[] args) {
Scanner sc = new Scanner(System.in);

System.out.println("Enter the Variabel");
int x = sc.nextInt();
System.out.println("Enter the Power");
int y = sc.nextInt();
int result = 1;

for (int i = 1; i < y; i++ ) { result *= x;}

System.out.println(x+"'s Power of "+y + " is equal to " + result);


	}

}
