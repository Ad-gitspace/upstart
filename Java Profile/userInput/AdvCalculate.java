package userInput;
import java.util.Scanner;
public class AdvCalculate {
	public static void main(String[] args) {       
Scanner sc = new Scanner(System.in);

long[] n = new long[50];

long result = sc.nextInt();

for (  int i = 1 ; i < n.length-1; i++) {
	
	sc.nextLine();
	char operation = sc.nextLine().charAt(0);
	
	if (operation == '=')  	break;
	
	n[i] =  sc.nextInt();
	
	
	if (operation == '+' )  {result += n[i]; }
	
	else if (operation == '-' )  {result = result-n[i]; }
	
	else if (operation == '*') {result *= n[i];   }
	
	
	else if (operation == '/') {if (result%n[(int) i] == 0) {result /= n[i];}
	           else {float a = (float)result;  float b = (float)n[i];
	           System.out.println(a/b);
	           result = (int) (a/b);} }         
	
	  
}
	
System.out.println(result);
}}
