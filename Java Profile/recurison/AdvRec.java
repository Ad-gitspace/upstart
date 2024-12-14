package recurison;
import java.util.*;
public class AdvRec {
static  Set<String> s = new HashSet(); 
public static void main(String[] args) {

	int[][] chart = {{4,0,3,1,8},
		             {4,4,5,9,10},
		             {0,4,4,4,0},
		             {1,4,4 ,4,0},
		             {1,0,0, 0,0}};   edgechange(chart , 0 ,0 ,4 , 90 );  //printBIN(chart);
		       
//perways("ABCC" ,0,2 );	

int[] p = {1,5,7};
System.out.println(maxchoose(p ,0,p.length-1));
	
	}


static void edgechange(int a[][] , int r , int c, int prevn ,int newn ) {
	int rows = a.length;   int colm = a[0].length;
	if(r<0||c<0 || r > rows || c > colm) {return;}
	if(a[r][c]!=prevn) {return;}
	
	a[r][c] = newn;
	
	edgechange(a , r-1 , c , prevn , newn);
	edgechange(a , r , c-1 , prevn , newn);
	edgechange(a , r+1 , c , prevn , newn);
	edgechange(a , r , c+1 , prevn , newn);
	
}


static void printBIN(int[][] matrix ) {   
	for(int i = 0; i<matrix.length; i++) {
		for(int j = 0; j<matrix[i].length; j++) {
			System.out.print(matrix[i][j]+"     ");}
			System.out.println();}
		
}

static void perways(String type, int first  , int last ) {
if (first == last) 
	{if (s.contains(type)) {return;} s.add(type);
	System.out.println(type);}
for (int i = first ; i <= last ; i++) {
	type = interchangeChar(type , first , i);
	perways(type, first+1 , last);
	type = interchangeChar(type , first , i);
	}}

static String interchangeChar(String order , int a , int b ) {
	char[] orderarray = order.toCharArray();
	char temp = orderarray[a];
	orderarray[a] = orderarray[b];
	orderarray[b] = temp;
	return String.valueOf(orderarray);    // return string changed by char collect to string 
	
	}


static int maxchoose(int[] a , int firstend, int lastend) {
	if(firstend+1==lastend) {System.out.println(Math.max(a[lastend], a[firstend]));return Math.max(a[lastend], a[firstend]);}
	return Math.max(a[firstend] + Math.min(maxchoose(a,firstend+2,lastend), maxchoose(a,firstend+1,lastend-1)),
			         a[lastend] + Math.min(maxchoose(a,firstend+1,lastend-1), maxchoose(a,firstend,lastend-2)));
}
}

