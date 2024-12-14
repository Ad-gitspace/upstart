package ifElse;
import java.util.Scanner;
public class SwitchCase {
	public static void main(String[] args) {
		Scanner sc = new Scanner(System.in);
		
		System.out.println("Enter 1st Number" );
		int a = sc.nextInt();
		
		System.out.println("Enter the operation");
		sc.nextLine();
		char operation = sc.nextLine().charAt(0);
		
		System.out.println("Enter your 2nd Number");
        int b = sc.nextInt();
      
      switch (operation)        {
      
      case '+':
    	  System.out.println(a+b); break;
      case '-':
    	  System.out.println(a-b); break;
      case '*':
    	  System.out.println(a*b); break;
      case '/':
    	  System.out.println(a/b); break;
    	  default: 
    		  System.out.println("I am not able");
      
      
      }
	}

}
