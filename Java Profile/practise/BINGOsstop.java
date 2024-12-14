package practise;
import java.util.Scanner;
import java.util.Stack;
public class BINGOsstop {                    
public static void main(String[] args) {
    int input;
	
Scanner sc = new Scanner(System.in);	
Stack<Integer> repeat = new Stack();

    //joke
System.out.println("Hello dude can we start BINGO");
sc.nextLine();
System.out.println("Well ok. I know myself that you wanna playing Bingo thats why you come here. So, lets start and enjoy");
System.out.println();
System.out.println("First of all, Let me know of what BINGO size you wanna paly ___?");
int d = sc.nextInt(); /* d= Dimenssion or size of BINGO*/
while(d<1){ System.out.println("Please, enter serious Data(from 3 to 10 generally)"); d = sc.nextInt();}
int[][] Player1 = BBox(d);   int Point1 = 0;
int[][] Player2 =  BBox(d);  int Point2 = 0;

System.out.println();System.out.println();
System.out.println("Let me explain you some baisc rule:-");
System.out.println("Rule-1: You have to enter number between 1-" + d*d);
System.out.println("Rule-2: Use "+((d*d+1)*10+1)+" to see you BINGObox and " +((d*d+1)*10+2)+ " to view Player-2 BINGObox and points according to player number.");
System.out.println("Rule-3: You will not be able see other's BINGO.");
System.out.println("Rule-4: Don't forget these 3 rules.");
System.out.println();System.out.println();

System.out.println("How many Player (1 to play with robot) & (2 to play with other)");
int no_of_player= sc.nextInt(); 
while(no_of_player != 1 && no_of_player != 2){ System.out.println("Please, enter serious Data(from 1 or 2 generally)"); no_of_player = sc.nextInt();}
System.err.println("Whom do you want to start first? (You are Player-1)");
int first_player = sc.nextInt();
while(first_player != 1 && first_player != 2){ System.out.println("Please, enter serious Data(from 1 or 2 generally)"); first_player = sc.nextInt();}
System.out.println("_______________________________________________________________________________________________________________________"); System.out.println("Game is starting........................25"); System.out.println();System.out.println();





if(first_player==2){
	System.out.println("Player 2 apki Turn Hai."); input =0 ;if(no_of_player>1){input = sc.nextInt();}
	                                                         if(no_of_player==1){input=robotic_play(d); if(!repeat.contains(input)){System.out.println(input);}}

        while(input==(d*d+1)*10+1 || input==(d*d+1)*10+2 || (input<=0 || input>d*d) || repeat.contains(input)) {
        	if(input==(d*d+1)*10+1) {System.out.println("You cannot see others BINGO"); System.out.println("Now, Enter to your turn.");}
            if(input==(d*d+1)*10+2) {printBIN(Player2);  System.out.println("Hey! This is your matrix Player 2"); System.out.println("Now, Enter to your turn.");}
            if((input<=0 || input>d*d) && input!= (d*d+1)*10+1 && input!= (d*d+1)*10+2 ) {System.out.println("Sorry, Please Enter between 1 to "+ d*d); }  
			input = sc.nextInt();}
			 repeat.push(input); 
		if(input<=d*d && input >=1) {  	
      	Player2[locx(Player2 , input)][locy(Player2 , input)]= 0;
      	Player1[locx(Player1 , input)][locy(Player1 , input)]= 0;}
		if(d==1){Point2 = 1; System.out.println("Its not a fair game because, it's come first get win-win situation game . But You Win");}}

//_______________________________________________________________________________________________
while(Point1 < d || Point2< d) { if(d==1 && first_player==2){break;} 
                                 System.out.println("Player 1 apki Turn Hai."); input = sc.nextInt();
	
     while(input==(d*d+1)*10+1 || input==(d*d+1)*10+2 || (input<=0 || input>d*d) || repeat.contains(input)) {
        if(input==(d*d+1)*10+1) {printBIN(Player1);  System.out.println("Hey! This is your matrix Player 1 and you got " + Point1 + " Point.");System.out.println("Now, Enter to your turn.");}
        if(input==(d*d+1)*10+2) {System.out.println("You cannot see others BINGO"); System.out.println("Now, Enter to your turn.");}
        if((input<=0 || input>d*d) && input!=(d*d+1)*10+1 && input!=(d*d+1)*10+2 ) {System.out.println("Sorry, Please Enter between 1 to "+ d*d);}
        if(repeat.contains(input)) {System.out.println("This is already played. ReEnter:- ");}
           input = sc.nextInt();}
repeat.push(input);
		 
		if(input<=d*d && input >=1) {
      	Player1[locx(Player1 , input)][locy(Player1 , input)]= 0;
      	Point1 = pointx(Player1, d)+pointy(Player1, d)+pointz(Player1, d);
		if(d==1){System.out.println("Its not a fair game because, it's come first get win-win situation game . But You Win So ,celebrate"); break;}
      	if(Point1>=d) {printBIN(Player1);System.out.println("Ohh ho kya baat hai. Player 1 win with " +Point1+" matlab jeet gaya hai and unfortunately Player 2 loose");
		 System.out.println(); System.out.println("That's Player-2 BINGO with " + Point2 + " points"); printBIN(Player2);break;}
	//telly; 
      	Player2[locx(Player2 , input)][locy(Player2 , input)]= 0;
      	Point2 = pointx(Player2,d)+pointy(Player2 ,d )+pointz(Player2, d);
		  if(Point2>=d) {
			System.out.println("Sorry but you loose and Player2 win. (You are also gonna be a Winner in future)");  
			System.out.println("But Celebrate for Player2 winner");
			printBIN(Player2);System.out.println("Ohh ho kya baat hai. Player 2 win " +Point2+" matlab jeet gaya hai and unfortunately Player 1 loose");
		  System.out.println(); System.out.println("That's Player-1 BINGO with "+Point1+" points"); printBIN(Player1);break;}      }
	
 // player 2 is playing
        System.out.println("Player 2 apki Turn Hai.");  if(no_of_player>1){input = sc.nextInt();}
		                                                if(no_of_player==1){input=robotic_play(d); if(!repeat.contains(input)){System.out.println(input);}}
       
        while(input==(d*d+1)*10+1 || input==(d*d+1)*10+2 || (input<=0 || input>d*d) || repeat.contains(input)) {
        	if(input==(d*d+1)*10+1) {System.out.println("You cannot see others BINGO"); System.out.println("Now, Enter to your turn.");}
            if(input==(d*d+1)*10+2) {printBIN(Player2);  System.out.println("Hey! This is your matrix Player 2 and you got " + Point2 + " Point."); System.out.println("Now, Enter to your turn.");}
            if((input<=0 || input>d*d) && input!=(d*d+1)*10+1 && input!=(d*d+1)*10+2 ) {System.out.println("Sorry, Please Enter between 1 to "+ d*d );}
            if(repeat.contains(input) && no_of_player>1) {System.out.println("This is already played. ReEnter:- ");}
			if(no_of_player>1){input = sc.nextInt();}   if(no_of_player==1){input = robotic_play(d); if(!repeat.contains(input)){System.out.println(input);}}}
	 repeat.push(input);
            
		if(input<=d*d && input >=1) {  	
      
      	Player2[locx(Player2 , input)][locy(Player2 , input)]= 0;
      	Point2 = pointx(Player2, d)+pointy(Player2, d)+pointz(Player2, d);
      	if(Point2>=d) {printBIN(Player2);System.out.println("Ohh ho kya baat hai. Player 2 win " +Point2+" matlab jeet gaya hai and unfortunately Player 1 loose");
		  System.out.println(); System.out.println("That's Player-1 BINGO with "+Point1+" points"); printBIN(Player1);break;}
	//telly
      	Player1[locx(Player1 , input)][locy(Player1 , input)]= 0;
      	Point1 = pointx(Player1, d)+pointy(Player1, d)+pointz(Player1 ,d);
		  if(Point1>=d) {
			System.out.println("Sorry but you loose and Player1 win. (You are also gonna be a Winner in future)");  
			System.out.println("But Celebrate for Player1 winner");  
			printBIN(Player1);System.out.println("Ohh ho kya baat hai. Player 1 win " +Point1+" matlab jeet gaya hai and unfortunately Player 2 loose");
		  System.out.println(); System.out.println("That's Player-2 BINGO with " + Point2 + " points"); printBIN(Player2);break;}
		}}}




static int locx(int[][] Array , int input) {
	int xaxis = 0;     
	for(int i = 0; i<Array.length; i++) {
		for(int j = 0; j<Array[i].length; j++) {
			if(Array[i][j]==input) { xaxis=i; break;}	}}
			return xaxis;}

static int locy(int[][] Array , int input) {
	int yaxis = 0;     
	for(int i = 0; i<Array.length; i++) {
		for(int j = 0; j<Array[i].length; j++) {
			if(Array[i][j]==input) { yaxis=j; break;}}}			
	return yaxis;}

static int pointx(int[][] Array ,int d) {   
	int shoot = 0;   int point =0;
	for(int i = 0; i<Array.length; i++) {shoot=0;
		for(int j = 0; j<Array[i].length; j++) {
			if(Array[i][j]==0) {shoot++;}}
		if(shoot == d){point++;}	}		
	return point;}

static int pointy(int[][] Array ,int d ) {   
	int shoot = 0;   int point = 0;
	for(int i = 0; i<Array.length; i++) {shoot=0;
		for(int j = 0; j<Array[i].length; j++) {
			if(Array[j][i]==0) {shoot++;}}
		if(shoot == d){point++;}	}		
	return point;}

	static int pointz(int[][] Array , int d) {   
		int shoot = 0;   int point =0;
		for(int i = 0; i<Array.length; i++) {
			if(Array[i][i]==0) {shoot++;}
			  if(shoot == d){point++;}	}
			shoot=0;
		for(int i = 0; i<Array.length; i++) {
			if(Array[i][d-1-i]==0) {shoot++;}
		      if(shoot == d){point++;}	}
		return point;}

static void printBIN(int[][] Array ) {   
	for(int i = 0; i<Array.length; i++) {
		for(int j = 0; j<Array[i].length; j++) {
			if(Array[i][j]<10) {System.out.print(Array[i][j]+"   ");}
		else System.out.print(Array[i][j]+"  "); }	System.out.println();}}
	
static int[][] BBox(int d){
	Stack<Integer> B = new Stack();
	while(B.size()!=d*d) {int randomd = ((int)(Math.random()*d*d)+1);
	if(!B.contains(randomd)) {B.add(randomd);}  else continue;}
	int player[][] = new int[d][d];
	for(int i = 0; i<player.length; i++) {
		for(int j = 0; j<player[i].length; j++) {
			player[i][j] = B.pop();}}
	return player;}

static int robotic_play(int d){int robot_turn = ((int)(Math.random()*d*d)+1);
                              return robot_turn;}
}