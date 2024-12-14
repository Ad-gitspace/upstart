package loops;
import java.util.Scanner;
public class Dfsumplusminus {
	public static void main(String[] args) {
Scanner sc = new Scanner(System.in);
	
float a = sc.nextFloat();
float sum = 1f;

for (float b= 3f; b<=a; b+=2) {sum += 1/b;}

float minus = 0.5f;
for (float b= 4f; b<=a; b+=2) {minus = minus + 1/b;}

System.out.println(sum-minus);

// Easy Method
int n = sc.nextInt();
float result =0;
for (float i= 1; i<=n; i++) {
	
	if(i%2==0) {result -= 1/i;}
	else {result +=1/i;}}
System.out.println(result);
	

}}
