package methods;
public class StaticShort {
int vo;
	public static void main(String[] args) {

	int alpha = 28 ;
	int beeta = 200;
	int gamma = 300;

	
	int result = max(alpha,beeta); // it goes to its parameter max
	
	
	max2(beeta , gamma );
	System.out.println(beeta);
	
	
	StaticShort a = new StaticShort();
	 a.vo = 4;      max(a);      System.out.println(a.vo);

	
     System.out.println(result);
     say();
	}
     static int max(int a, int b) {   // max = method name 
    	  // above result call static of same  perameter
    	  if(a>b) {return a;}
    	  else {return b;}            }
     
     
  static void max(StaticShort val) {val.vo = 10 ;}  
	    
  
  static void say() {System.out.println("Bye " );}
  
  
  static void max2(int a, int b) {   // max = method name 
	  // above result call static of same  parameter
     int temp = a  ; 
	  a = b;
	  b = temp ; 
 }}
