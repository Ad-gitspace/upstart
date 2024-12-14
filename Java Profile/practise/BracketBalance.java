package practise;
import java.util.Scanner;
import java.util.Stack;  
class BracketBalance {
public static void main(String[] args) throws Exception {

	Scanner sc  = new Scanner(System.in);
		
	    int p  = sc.nextInt();
		sc.nextLine();
		
		while(p-- !=0) {String b = sc.nextLine();
		Stack<Character> t = new Stack<>();     
	    boolean isOK = true ; 
	   
	    for (int j = 0 ; j<b.length(); j++) {
			char bracket = b.charAt(j);
			if (bracket == '('|| bracket=='{' ||  bracket=='[') {t.push(bracket); continue;}
			
			if (t.isEmpty()) {isOK = false; break;}
			
			if (bracket == ')' ) {if (t.peek() == '(') {t.pop();} else {isOK = false; break;}}
			if (bracket == '}' ) {if (t.peek() == '{') {t.pop();} else {isOK = false; break;}}
			if (bracket == ']' ) {if (t.peek() == '[') {t.pop();} else {isOK = false; break;}}
			}
				
		       if(!t.isEmpty()) {isOK=false;}	
		
		if (isOK) {System.out.println("Balanced");}// never use 1 = 
		else   {System.out.println("Not balanced");}   
		}
	
	}

}
