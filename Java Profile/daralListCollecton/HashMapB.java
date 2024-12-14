package daralListCollecton;
// require two data with value and name
import java.util.*;
import java.util.Map.*;
public class HashMapB {

	public static void main(String[] args) {

Map<String,Integer> i = new HashMap();

i.put("Four", 4);i.put("Five", 5);   i.replace("Four", 4,6); // replace by checking old
// key will not be same but value can.
System.out.println(i); 

//Set<Entry<String, Integer>> aa =i.entrySet();  no need
//Entry  = map outfit<>

//i.entrySet() makes map set so as to function as a array and use array loop
for(Entry<String,Integer> aaa: i.entrySet()) { aaa.setValue(aaa.getValue() * 10);System.out.println(aaa +" "+ i);}

	System.out.println(i);
	

	System.out.println(getCode("I Don't Konw"));
	String A = "u1";  System.out.println(A.charAt(1)+A.charAt(0));
	
	
	}	public static int getCode(String text) {
	int coded = 0;
	
	for(int j = 0; j<text.length(); j++)  {
		coded += text.charAt(j);}// if char is added then converted into int as their need
	return coded;
	
	}
	
}
