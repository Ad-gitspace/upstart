package daralListCollecton;
import java.util.*;
public class Sets {
	public static void main(String[] args) {
			
		Set<Integer> i = new HashSet();    // not print in order 
	//	Set<Integer> i = new LinkedHashSet();    print in order
//		Set<Integer> i = new TreeSet();    print in sorted form
	
Set<Integer> a = new HashSet();  a.add(4);a.add(40);a.add(6);a.add(4);
Set<Integer> b = new HashSet();	b.add(4);b.add(47);b.add(8);b.add(0);
a.retainAll(b);//////// remove that is not in b (union)
System.out.println(a);



	}
}
