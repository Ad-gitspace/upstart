package practise;
import java.util.Scanner;
import java.util.Stack;
public class ttt{
public static void main(String[] args) {
Scanner sc = new Scanner(System.in);
int winner=0, input=0; String P1sign="",P2sign="";
Stack<Integer> past_data = new Stack(); 

System.out.println("Hey! Welcome to the Dimenssion of TicTakToy. Won by 3");System.out.println("Firstly, Enter Dimenssion of so called TicTakToy");
int d = sc.nextInt(); while(d<1){ System.out.println("Please, enter serious Data(from 3 to 10 generally)"); d = sc.nextInt();}

System.out.println("How many real Player you want to play.(1 to paly with robot and 2 to play with other player.)");
int no_of_Player = sc.nextInt(); while(no_of_Player<1){ System.out.println("Please, enter serious Data(1 or 2 generally)"); no_of_Player = sc.nextInt();}

System.out.println("As, to start it, Let me know who will start first? (Player->1 or 2) You are Player-1");
int startPlayer = sc.nextInt(); while(startPlayer<1){ System.out.println("Please, enter serious Data(from 3 to 10 generally)"); startPlayer = sc.nextInt();}

System.out.println("OK, What you choose as your sign Player-"+startPlayer);
if(startPlayer<=1){P1sign= sc.next(); P1sign.toUpperCase(); P1sign.trim(); System.out.println("Player-2 what you choose as your sign?");  P2sign= sc.next();P2sign.toUpperCase(); P2sign.trim();}
if(startPlayer>1) {P2sign= sc.next(); P2sign.toUpperCase(); P2sign.trim(); System.out.println("Player-1 what you choose as your sign?");  P1sign= sc.next();P1sign.toUpperCase(); P1sign.trim();}

String box[][] = new String[d][d];
     for(int i=0; i <box.length; i++){
         for(int j=0; j<box.length; j++){
             box[i][j] = "_" ;}}
    printBIN(box); 

if(startPlayer>1){
System.out.println("Player "+ startPlayer+" -> Enter '"+P2sign+"' Position");
if(no_of_Player<=1){input= robotic_play(d); past_data.add(input);System.out.println(input);}

if(no_of_Player>1){input = sc.nextInt();
    while(input>d*d || input<1 ){
         {System.out.println("Enter between 1 to "+d*d);} input=sc.nextInt();}
          past_data.add(input);}
    positionFind(box, P2sign, input);}

    if(pointx(box, P2sign) || pointy(box, P2sign) || pointz(box, P2sign)){
        System.out.println("Congrats, Player-2 is the Winner of this game."); winner=1;}

while(winner != 1){
     System.out.println("Player 1-> Enter '"+P1sign+"'' Position"); 
      input = sc.nextInt(); 
      while(input>d*d || input<1 || past_data.contains(input)){
          if(past_data.contains(input)){System.out.println("This is already used place. ReEnter:-");}
          else {System.out.println("Enter between 1 to "+d*d);} input=sc.nextInt();}
          past_data.add(input);
      positionFind(box, P1sign, input); 

      if(pointx(box, P1sign) || pointy(box, P1sign) || pointz(box, P1sign)){
          System.out.println("Congrats, Player-1 is the Winner of this game."); break;
      }
      



//Player 2 turn:_______________________
     System.out.println("Player 2-> Enter '"+P2sign+"' Position");
      if(no_of_Player<=1){ input = robotic_play(d);
      while(input>d*d || input<1 || past_data.contains(input)){input=robotic_play(d);}
      System.out.println(input);}

      if(no_of_Player>1){input=sc.nextInt();
      while(input>d*d || input<1 || past_data.contains(input)){
        if(past_data.contains(input)){System.out.println("This is already used place. ReEnter:-");}
        else {System.out.println("Enter between 1 to "+d*d);} input=sc.nextInt();}}
        past_data.add(input);
      positionFind(box, P2sign, input);

      if(pointx(box, P2sign) || pointy(box, P2sign) || pointz(box, P2sign)){
        System.out.println("Congrats, Player-2 is the Winner of this game."); break;
    }
    
}}
    

static boolean pointx(String[][] box, String input) {   
	int shoot = 0; 
	for(int i = 0; i<box.length; i++) {shoot=0;
		for(int j = 0; j<box.length; j++) {
			if(box[i][j]==input) {shoot++;}}
            if(shoot==box.length){return true;}}
	return false;}

static boolean pointy(String[][] box, String input) {   
	int shoot = 0; 
	for(int i = 0; i<box.length; i++) {shoot=0;
		for(int j = 0; j<box.length; j++) {
			if(box[j][i]==input) {shoot++;}}
            if(shoot==box.length){return true;}}
	return false;}

static boolean pointz(String[][] box, String input) {   
	int shoot = 0; 
	for(int i = 0; i<box.length; i++) {shoot=0;
		for(int j = 0; j<box.length; j++) {
			if(box[j][j]==input) {shoot++;}}
            if(shoot==box.length){return true;}}
	return false;}

static void printBIN(String[][] Array ) {   
	for(int i = 0; i<Array.length; i++) {
		for(int j = 0; j<Array[i].length; j++) {
		System.out.print(Array[i][j]+"     "); }	System.out.println();System.out.println();}}

static void positionFind(String box[][],String xo ,int input){
    int start=0;
    for(int i=0; i<box.length; i++){
        for(int j=0; j<box.length; j++){
            start = start+1;
            if(start==input){box[i][j] =xo; printBIN(box); break;}}
        }}

static int robotic_play(int d){int robot_turn = ((int)(Math.random()*d*d)+1);
          return robot_turn;}


}

    

