package daralListCollecton;
public class HashCode {

	public static void main(String[] args) {

		pan a = new pan(567,"Gel","Blue");
		pan b = new pan(5,"Gel","Blue");
		
		System.out.println(a.equals(b));// Boolean foe hash  or for string
		System.out.println(a.EqualHai(b));// Boolean foe hash  or for string
	}
}

class pan{
int price ;
String type,colour;
	
public pan(int Price, String Type, String Colour) {
	price=Price;       //this. is not as not same name
	type=Type;     colour = Colour;
}

@Override
public int hashCode() {
	final int prime = 31;
	int result = 1;
	result = prime * result + ((colour == null) ? 0 : colour.hashCode());
	result = prime * result + price;
	result = prime * result + ((type == null) ? 0 : type.hashCode());
	return result;
}

@Override
public boolean equals(Object obj) {
	if (this == obj)
		return true;
	if (obj == null)
		return false;
	if (getClass() != obj.getClass())
		return false;
	pan other = (pan) obj;
	if (colour == null) {
		if (other.colour != null)
			return false;
	} else if (!colour.equals(other.colour))
		return false;
	if (price != other.price)
		return false;
	if (type == null) {
		if (other.type != null)
			return false;
	} else if (!type.equals(other.type))
		return false;
	return true;
}


//@Override
public boolean EqualHai(Object two) {
	pan dusra = (pan) two;      // pan is casted to two
	Boolean solve = this.price==dusra.price && this.type==dusra.type && this.colour==dusra.colour;
	return solve;}


}
