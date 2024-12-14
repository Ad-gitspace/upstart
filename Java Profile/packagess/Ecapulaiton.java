package packagess;

//Variables do not override [mean not share to another class]
// only function override to the other class.

//public everywhere (in static form)    private in same class
//Default same package accessible
import java.util.*;        // * end folder an import everything from its sub folder

import arrays.Basic;
       // import its class and feature only

public class Ecapulaiton {
	String name;
	public static void main(String[] args) {
		
		PublicRoot one = new PublicRoot();
		one.name = "Hello";
		one.age(4);
	}
}
// paparmeter with datatpye(x) is called by its same in objects