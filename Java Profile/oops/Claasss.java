package oops;
import java.util.Scanner;

class Money            {
	String  MatterType ;
	int amount , NoOfNotes;
	boolean value;
	
    void  EnterC() {System.out.println("Are you telling ture "  );}
	public void  EnterNo() {System.out.println("Enter total " + MatterType );}
	public void   EnterAm() {System.out.println("Enter 1 " + MatterType + " amount  ");}
	 void Cwealth() {System.out.println("My Wealth by "+ MatterType + " is "+ amount*NoOfNotes + "$ This is "+ value);}

}

public class Claasss {

	public static void main(String[] args) {
		
		Scanner sc = new Scanner(System.in);
		Money Coin =new Money();
		Money Paper =new Money();
		
		Coin.MatterType = "Coin";
		Coin.EnterAm();	
	      Coin.amount = sc.nextInt();
	      Coin.EnterNo();
	      Coin.NoOfNotes = sc.nextInt();
	      Coin.EnterC();
	     
	      Coin.value = sc.nextBoolean();;
	      Coin.Cwealth();

	      
	      Paper.MatterType = "Paper";
	      Paper.EnterAm();
	      Paper.amount = sc.nextInt();
	      Paper.EnterNo();
	      Paper.NoOfNotes = sc.nextInt();
	      Paper.EnterC();
		      
	      Paper.value = sc.nextBoolean();;
	      Paper.Cwealth();
	      
	      
	      int TWealth = Paper.amount*Paper.NoOfNotes+Coin.amount*Coin.NoOfNotes; 
	      System.out.println("Hence total wealth is " + TWealth); 
	}}
