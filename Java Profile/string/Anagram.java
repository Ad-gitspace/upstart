package string;
public class Anagram {
	public static void main(String[] args) {

		String a = "Lise";             
		String b = "Lie";
		
		//boolean isAna = false;
		//boolean visit[] = new boolean[b.length()];
		
//		if(a.length()==b.length()) {
//			
//		for(short i=0 ;  i<a.length();  i++) {
//			char Word = a.charAt(i);
//			for (short j=0; j<b.length(); j++) { 
//				char check = b.charAt(j);
//				
//				isAna = false;       
//				if( check == Word && visit[j]==false) // visit jth term should false
//				{ isAna= true;
//				visit[j] = true;       // fiiling jth term vale as false 
//					break; }; }
//			if(!isAna ) {System.out.println("Not Anagram");break;}}	
//		if(isAna) { System.out.println("Its Anagram");}}
//		else {System.out.println("Length is not equal so it cannot be anagram");}
//		
	
		
		
		// error
//		int[] al = new int[256];
//		int[] bl = new int[256];
//		
//		for(int c : a.toCharArray()) {
//			int index =  (int)c;
//			al[index]++;}
//		
//		for(int c : b.toCharArray()) {
//			int index =  (int)c;
//			bl[index]++;}
//		
//		for(int i = 0 ; i<256; i++) {
//			if(al[i]!=bl[i]) {
//			System.out.println("not");
//			break;
//			}
//			else {System.out.println("yes"); }break;}

		
		
	//		error	
		int[] al = new int[256];
		
		for(char c : a.toCharArray()) {
			int index =  (int)c;
			al[index]++;}
		
		for( char c : b.toCharArray()) {
			int index =  (int)c;
			al[index]--;}
		
		for(int i = 0 ; i<256; i++) {System.out.println("yes" +al[i]);}
//			if(al[i]!=0) {
//			System.out.println("not" +al[i]);
//			break;
//			}
//			else {System.out.println("yes" +al[i]); }break;}
		
		
		
			
		
		
		
	}}
