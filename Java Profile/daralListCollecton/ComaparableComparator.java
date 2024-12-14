package daralListCollecton;

import java.util.*;

public class ComaparableComparator {

	public static void main(String[] args) {
		
		
		List<compare> Avenge = new ArrayList();
		
		Avenge.add(new compare("Iron"    , 99));
		Avenge.add(new compare("Ant"     , 06));
		Avenge.add(new compare("Spider"  , 85));
		Avenge.add(new compare("Ranger"  , 46));
		Avenge.add(new compare("Thor"    , 06));
		Avenge.add(new compare("Captian" , 85));    
		Avenge.add(new compare("Thor"   , 58));
		
		
		Collections.sort(Avenge , (o1 , o2)->
		{if(o1.power==o2.power) return o1.MAname.compareTo(o2.MAname);
		else return  o1.power-o2.power;}         );
		 Avenge.forEach(System.out::println);
			System.out.println();
		                                      // -> make it understand itself
		//* Computer method :
		Collections.sort(Avenge , (o1 , o2)->
		o1.MAname.compareTo(o2.MAname));
		 Avenge.forEach(System.out::println);
		System.out.println();
		
		//* Computer method :
			Collections.sort(Avenge , Comparator.comparing(compare::getpower).thenComparing(compare::getMAname).reversed());
			Avenge.forEach(System.out::println);
			System.out.println();
		
		
//		Collections.sort(Avenge , new Comparator<compare>()         
//				
//	{public int compare(daralListCollecton.compare o1, daralListCollecton.compare o2) {
//		
//			if(o1.power==o2.power) return o1.MAname.compareTo(o2.MAname);
//			else return  o1.power-o2.power;}}
//				
//				);       // collections require CompareTo
		
       // Avenge.forEach(System.out::println);
	

	}}



//class sorting implements Comparator<compare>{     // this method require 2 object
//
//@Override
//public int compare(daralListCollecton.compare o1, daralListCollecton.compare o2) {
//	// TODO Auto-generated method stub
//	if(o1.power==o2.power) return o1.MAname.compareTo(o2.MAname);
//	else return  o1.power-o2.power;
///////}}           //if not want to make different class then make class in sort ny new
