package userInput;
import java.util.Scanner;
public class Scan {
public static void main(String[] args) {
Scanner sc = new Scanner(System.in);
double principal = sc.nextInt();
float rate = sc.nextInt();
int time = sc.nextInt();
double interest = (principal*rate*time)/100;
boolean right = true;
System.out.println("Your Answer for Simple rate of Interest is " + interest );
int amount = (int)interest + (int)principal; 
System.out.println("And finally you got " + amount);	}}