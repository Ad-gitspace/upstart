package daralListCollecton;
//import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
public class Linkedlist {
	public static void main(String[] args) {
		
		OwnLinkedList<Integer> self = new OwnLinkedList();
		
	//	List <Integer> set = new LinkedList();
//		self.add(7);        self.add(75);         self.add(74);      self.add(0000);
//	    self.print();
		
		
//		List <Integer> Aset = new ArrayList();
//		Aset.add(55);
//		
//		
//		timeDiff(set);
//		timeDiff(Aset);
	    MyQueue<Integer> obj = new MyQueue<Integer>();
		obj.addLast(36);
		obj.addLast(360);    
		obj.addLast(90);
		obj.addLast(78);
		obj.removeFirst(); obj.removeFirst(); obj.removeFirst();obj.removeFirst(); ; 
		obj.addLast(360);    
		obj.addLast(90);
		obj.addLast(8);
		obj.print();
		
		
	
	}

	public static void timeDiff(List<Integer> list) {
	long start = System.currentTimeMillis();
	for (int i = 0; i < 10000000 ; i++) {
		list.add(i, i*i*i);}
	
	long end = System.currentTimeMillis();
		System.out.println(list.getClass().getName()+"  ===   " + (end-start));
	
	
	String a = "Hello"; System.out.println(a.toCharArray());
	}
}


// array vs arraylist = array have fix value , it can not as a set and not print