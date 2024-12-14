package daralListCollecton;

import daralListCollecton.OwnLinkedList.Node;

public class MyQueue<E> {
Node<E> first , last;

public void addLast(E data) {
	Node<E> toAdd = new Node(data);
	
	if (first == null) {first = last = toAdd;}
	last.next = toAdd;
	
	last = toAdd;
	
	
	
}
public void removeFirst() {
	//Node<E> toRemove = new Node();
	//if (first==null) {System.out.print(" null ");}
	first = first.next;
	first.prev = null;
}
	

public void print() {
	Node<E> temp = first;
	while(temp != null) {
		System.out.print(temp.data+" ");
		temp = temp.next;
}}
	
	
	
	
	public static class Node<E>{
		E data;
		Node<E> next , prev;      // Node<E> is arraylist or linkedlist or stack or queue
		public Node(E data) {
			this.data = data;
			this.next = this.prev = null;  // only 1 element so next an previous is null 
}}}

