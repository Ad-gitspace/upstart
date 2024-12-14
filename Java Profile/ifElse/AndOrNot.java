package ifElse;

public class AndOrNot {
	public static void main(String[] args) {
	 	
		int a = 61, b = 16 , c = 71;
		
		int result = 0;
		
    //    if  (a>b & a < c-a*2 )        { result=a;}
         
    //   else                      {result=c;}
         
    // if(b>c)                   {result = b;}
         
		result = a>b ? a> c  ? a:c:   b>c    ?   b:c ;
		
         System.out.println("Max of both numbera is  " + result);
         
	
	}         
		}
	


