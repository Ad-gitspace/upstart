package exception;

public class TryCatch {

	public static void main(String[] args) {
fun();
// if error in try{} catch run
try {System.out.println(1/0);}

catch(ArithmeticException e) {System.out.println(e.getMessage()+" UnKoown Sorry");}
// catch (x)   x = many type of exception as ap boolena data

try {
	Thread.sleep(4000);
} catch (InterruptedException e) {
	// TODO Auto-generated catch block
	e.printStackTrace();
}

System.out.println("Toooo");
}
	
	static void fun() throws ArithmeticException{boolean is = true;
	if (is) { throw new ArithmeticException("New");}}}


//throws will after void as called exception
