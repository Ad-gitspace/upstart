package practise;
import java.util.*;
public class AnagramBox {

	public static void main(String[] args) {
		long start = System.currentTimeMillis();
		Scanner sc = new Scanner(System.in); 
;		
		Map<String,List<String>> ana = new HashMap();
		Map<String,List<String>> anag = new HashMap();
		
		String word[] = new String[sc.nextInt()];     sc.nextLine();
		for (int i = 0;i<word.length; i++) {word[i] = sc.nextLine();
		char[] a = word[i].toCharArray(); Arrays.sort(a);
		String sorted = new String(a);
		
		if (!ana.containsKey(sorted)) {ana.put(sorted,new LinkedList<String>());}
		if (ana.containsKey(sorted))  {ana.get(sorted).add(word[i]);}
		}
			System.out.println(ana);
			
			
		




long end = System.currentTimeMillis(); System.out.println("Your RunTimeis "+(end-start)+" miliseconds");
	}

}
