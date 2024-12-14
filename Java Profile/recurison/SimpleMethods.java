package recurison;
public class SimpleMethods { static int count = 1;
	public static void main(String[] args) {

			
		System.out.println(sum(10,20));
		System.out.println(aRAISEb(7,276));
		System.out.println(count);
		System.out.println(endway(2,4));
		
		String a = "hpiua"; 
		System.out.println(interchange(a,0,4));
	}

	static int sum(int start , int end ) {
		if (start == end) return start;
		return end + sum(start , end-1);   } //else is auto as it return function 1 . if if() return then lower not return

	static int aRAISEb(int base, int power) {
		count++;
		if( power==0) return 1;     if(power%2==0) return aRAISEb(base*base , power/2);
		return base*aRAISEb(base,power-1);}
	
	static int endway(int rows,int coloums) {
	if(rows==1 || coloums==1) return 1;
	return endway(rows-1,coloums)+endway(rows,coloums-1);} 
	


	static String interchange(String order , int a , int b ) {
		char[] orderarray = order.toCharArray();
		char temp = orderarray[a];
		orderarray[a] = orderarray[b];
		orderarray[b] = temp;
		return String.valueOf(orderarray);
		
		}}
