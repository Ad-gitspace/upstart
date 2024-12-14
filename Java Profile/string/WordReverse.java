package string;
public class WordReverse {
	public static void main(String[] args) {

      String Sentence = "       name your know i that know don't you think         i But name. your is what know I      ";
      Sentence = Sentence.trim();

      String[] Word = Sentence.split(" ");
      

        for (int i = Word.length-1 ; i >=0; i--) {
     
    	    System.out.print(Word[i].concat(" "));}
 }}