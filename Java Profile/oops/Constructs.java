package oops;  // oops.package.class    . denotes folder location

class Phone {
	int ram , rom;
	String colour , shape;  // this refers to class data type
	Phone(int ram , int rom)   { this.ram = ram;  this.rom = rom; } // all info here
	Phone (String colour , String shape)      {this.colour = colour; this.shape = "AL";}
	// Can creat more constructors but with phone
	}



public class Constructs {
	public static void main(String[] args) {
		
		Phone normal = new Phone(4,64);
		Phone colour = new Phone("5" , "Curve");
		Phone Gaming = new Phone(12,128);
		
		System.out.println(colour.shape);
		System.out.println(Gaming.rom);



	}

}
