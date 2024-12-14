package daralListCollecton;

import java.util.List;
import java.util.ArrayList;
import java.util.LinkedList;

public class Arraylist {

	public static void main(String[] args) {
		 
		
		ArrayList<String> a = new ArrayList();  a.add("Alpha");   // add anything
		ArrayList ba = new ArrayList();    ba.add("Alpha"); ba.add(23);
		
		List<String> car= new ArrayList(); // List=ArrayList=LinkedList
		car.add("BMW");   a.addAll(ba);
		//addll()  add all array's object

		
	a.get(1);  // get print index
	a.set(1 , "AA");  //  a.set(index, element)	
		
	
	String[]  obj = new String[9];
		a.toArray(obj);
		
		
		
		
		
		
		
		
		
//ArrayList<Integer> marks = new ArrayList();  // int float not work
	
//ClassExtract <Integer , String , String> p1= new ClassExtract(44 , "" , "true");   /// called
	
	for(String e: obj) {System.out.println(e);}
	}

}
