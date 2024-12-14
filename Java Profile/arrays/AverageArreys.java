package arrays;
import java.util.Scanner;
public class AverageArreys {
	public static void main(String[] args) {
	Scanner sc = new Scanner(System.in);	
		
	System.out.println("Enter the number of Students :");
		byte n = sc.nextByte();
		int[] student = new int[n];
		
		System.out.println("Enter their Marks");
		
		int marks = 0;
		
		for(int i = 0 ; i <student.length  ; i++) {  //student.length = n
			student[i] = sc.nextInt();
		
		 marks += student[i];
		}
System.out.println("Average Marks is "+ marks/n);



      

	}

}
