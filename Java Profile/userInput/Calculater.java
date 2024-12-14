package userInput;
import java.util.Scanner;
public class Calculater {
	public static void main(String[] args) {
		Scanner sc = new Scanner(System.in);
		
		long a =sc.nextLong();
		sc.nextLine();
		char operation = sc.nextLine().charAt(0);
		long b =sc.nextLong();
		
		switch (operation){
		case '+':  System.out.println(a+b); break;
			
		case '-':  System.out.println(a-b); break;
		case '*':  System.out.println(a*b); break;
		case '/':  if (a%b == 0) {System.out.println(a/b); break;}
		           else {float c=(float)a; float d=(float)b;
			       System.out.println(c/d);}
		case '%':  System.out.println("Your remainder is "+a%b); break;}}}
