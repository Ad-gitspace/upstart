package recurison;
public class BackTracking {
public static void main(String[] args) {
	
int Maze[][] = {{1,1,0,1,0,1,1},
		        {1,1,2,1,0,0,1},
		        {1,1,1,1,0,1,1},
		        {1,1,0,1,1,1,0},
		        {1,1,0,1,0,1,1},
		        {1,1,0,1,1,1,0},
		        {1,1,1,1,1,1,1}};	

if( ShortestPath(Maze,0,0,0,0) >= 100000) {System.out.println("This is not possible");}
else System.out.println( ShortestPath(Maze,0,0,0,0));     }

static int ShortestPath(int maze[][], int si , int sj, int fi, int fj) {
	boolean[][] vis = new boolean[maze.length][maze[0].length];
	return Map(maze, si , sj, fi, fj , vis);}

static int Map(int maze[][], int i , int j, int fi, int fj, boolean vis[][]) {
	if(!isValid(maze, i , j , vis)) {return 100000;}  if(i==fi && j==fj) {return 0;}
	vis[i][j]=true;
	int left  = Map(maze, i , j-1 , fi,fj,vis )+1;
	int right = Map(maze, i , j+1 , fi,fj,vis )+1;
	int up    = Map(maze, i-1 , j , fi,fj,vis )+1;
	int down  = Map(maze, i+1 , j , fi,fj,vis )+1;
	vis[i][j]=false;     // this make back track as repeat itself and clear4 itself
	return Math.min(Math.min(left, right) , Math.min(up,down) );}

static Boolean isValid(int maze[][], int i , int j, boolean vis[][]) {
return i>=0 && j>=0 && i<maze.length && j<maze[0].length && maze[i][j]==1 && !vis[i][j];}   // also can use if else. This check all and return boolean
}
