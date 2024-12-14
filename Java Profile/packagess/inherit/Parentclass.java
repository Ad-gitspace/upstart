package packagess.inherit;

public class Parentclass {
	protected static String name , work;
	
	public void name() {System.out.println("My name is " + name);}
	public void teach() {System.out.println(name +" is " + work);}
	public void walk() {System.out.println(name + "is walking");}
	
	
	public void best(String name) {
		//this.name= name;
	//	System.out.println("Parent class const");
		
	}
	
public static void main (String[] args) {
		
		Namo Namo = new Namo(name);
		Namo.name = "Namo Kaul";
		Namo.work = "Visualising";
		Namo.name();
		Namo.teach();
		Namo.walk();
		System.out.println();
		
		
		Sameer Sameer = new Sameer();
		Sameer.name = "Sameer Chincholikar";
		Sameer.work = "calculaitng";
		Sameer.name();
		Sameer.teach();
		Sameer.walk();
		System.out.println();
		
		
		Ashwani Ashwani = new Ashwani();
		Ashwani.name = "Ashwani Tyagi";
		Ashwani.work = "reacting";
		Ashwani.name();
		Ashwani.teach();
		Ashwani.walk();
		System.out.println();
		
		
		
		
		Parentclass p = Namo;
		Namo t = (Namo)p;
		
	//	Namo.best(Namo);
	//	public void names();
		
	}
}
