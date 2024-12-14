package daralListCollecton;

public class ClassExtract <X,Y,Z> { // before { datatype create , afte { datatype changes
X x; Y y ;   Z z;





public ClassExtract(X x, Y y , Z z ) {
this.x = x;   this.y = y;   this.z = z;   // this goes to class
}}




class compare {//implements  Comparable<compare>
	public String MAname;
	public int power;
	public compare(String MAname, int power) {
		super();
		this.MAname = MAname;
		this.power = power;
	}
	@Override
	public String toString() {
		return "compare [MAname=" + MAname + ", power=" + power + "]";
	}
	public String getMAname() {
		return MAname;
	}
	public void setMAname(String MAname) {       // all from source
		this.MAname = MAname;
	}
	public int getpower() {
		return power;
	}
	public void setpower(int power) {
		this.power = power;
	}
	                                           //@Override for using other class
	public int compareYo(compare MYdata) {        // TODO Auto-generated method stub
		if(this.power < MYdata.power ) {return 1;}
		if(this.power > MYdata.power) {return  -1;}
		else return this.MAname.compareTo(MYdata.MAname);           	// else return 0;
	}
	
	
	
}
