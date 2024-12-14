package practise;
import java.util.ArrayList;
import java.util.Collections;
import java.util.PriorityQueue;
import java.util.Scanner;
public class Priority {
	public static void main(String[] args) {
Scanner sc = new Scanner(System.in);

System.out.println("How much sentence will to give to me?");
int n = sc.nextInt();


while(n-- !=0) { PriorityQueue<Integer> od = new PriorityQueue();

System.out.println("What is length of sentence and how much you need priority??");
int l = sc.nextInt();           int nop = sc.nextInt();
System.out.println("Now Enter Data:- ");



for(int i = 1 ; i<=l ; i++) {if(nop>l) {System.out.println("Not Possible to withdraw more Priority than the data"); break;}
	int data = sc.nextInt();
	od.add(data);
}
for(int i = 1; i<=l-nop; i++) {od.poll();}
ArrayList<Integer> sort = new ArrayList(od);
Collections.sort(sort, Collections.reverseOrder());
if(nop<l) {System.out.println(sort);}}







	}

}
