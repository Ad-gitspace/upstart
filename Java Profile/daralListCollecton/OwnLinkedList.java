package daralListCollecton;
public class OwnLinkedList<E> {

Node<E> head;	                                                //error
	// Ctrl+F = find 
	public void add(E data)   {Node<E> toAdd = new Node<E>(data);
	
	if (isEmpty()) {head = toAdd; return;}     Node<E> temp = head;
	
	while(temp.next != null) {temp = temp.next;}
	temp.next = toAdd; }
		
	
	public void print() {
		Node<E> temp = head;
		while(temp != null) {
			System.out.print(temp.data+" ");
			temp = temp.next;
}}public boolean isEmpty() {return head==null;}
	
		
public static class Node<E>{
	E data;
	Node<E> next;
	
	public  Node(E data) {
		this.data = data;
		next = null;
	}
	
}	}
	


