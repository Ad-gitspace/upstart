package arrays;
import java.util.Scanner;
public class TwoDArray {
public static void main(String[] args) {		
		Scanner sc = new Scanner(System.in);
		
		 System.out.println("Enter Rows");
		byte rows = sc.nextByte();
		 System.out.println("Enter Columns");
		byte coloums = sc.nextByte();
		int[][] md1 = new int[rows][coloums];
		int[][] md2 = new int[rows][coloums];
		
		 System.out.println("Enter Matrix 1");
		for (int a = 0 ; a<rows; a++) {
			for (int b = 0; b< coloums; b++) {
				md1[a][b] = sc.nextInt();}}
		//System.out.println("Enter Matrix 2");
		for (int a = 0 ; a<rows; a++) {
			for (int b = 0; b< coloums; b++) {
				md2[a][b] = sc.nextInt();}}
		
		//System.out.println("Matrix sum is :");
		for (int a = 0 ; a<rows; a++) {
			for (int b = 0; b< coloums; b++) {
				int sum = md1[a][b]+md2[a][b];
			System.out.print(sum+"  ");}
			System.out.println();
		}}}
