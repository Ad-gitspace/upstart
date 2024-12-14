package ifElse;

public class Conditional {

	public static void main(String[] args) {

		int maxMasks = 500;
		int maskObtain = 220;
		int Percentage = (maskObtain*100/maxMasks);
		System.out.println(Percentage);
		
		int a = Percentage;
		int b = 33;
		
		Percentage = a >= b ? a : b;
//		Percentage = a <= c ? "fail" : b;
		System.out.println(Percentage);
   
	}

}
