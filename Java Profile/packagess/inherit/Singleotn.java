package packagess.inherit;
public class Singleotn {
	
	private Singleotn() {}		
		
private	static	Singleotn space = new Singleotn();
		
		public static Singleotn get() { return space;}
		
		
	}

class AppConfig {
	
	
	public static void main(String[] args) {
		
		Singleotn fl1 = Singleotn.get();
		Singleotn fl3 =  Singleotn.get();
		Singleotn fl2 =  Singleotn.get();  //  1 space to multiple objects

	}}

