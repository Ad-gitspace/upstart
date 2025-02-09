{// Lecture-1
console.log("I'm visible, ya")

iname = "This is JS console";
console.log(iname);

let age =22;  //can't redeclare but can be updated.   Also, work at block level-{}
const PI = 3.1415;   //can't update PI like =11;
age++;
console.log("age is " + age);
console.log(PI);

{let a = BigInt("0");
console.log(a);}   // Only limited to this block


const product ={
    productName: "Pen",
    price: 270,
    MRP: 285,
    discount: 5,
    writingColor: "BLack",
    deal: "Deal of the Day",
    isFlip: false,
};
console.log(product["deal"]);
console.log("(There is", product.discount + "% off)")   //or product["discount"]  can also be used
console.log(typeof product.isFlip);


















}{//Lecture-2
let a = 5;
let b = 7;
console.log("a =", a);
console.log("b =", b);
console.log("add =", a+b);
console.log("difference =", a-b);
console.log("product =", a*b);
console.log("divide =", a/b);
console.log("remainder =", b%a);
console.log("a^b =", a**b);
console.log("++a =", ++a);
console.log("a++ =", a++, "while now a is", a, "This is post-increment, so first print then change.");  

a+=4; //a=a+4
a*=2; //a=a*2
a%=3; //a=a%3
a**=5 //a=a^5 or a**5

/*Comparison Operator */  //Gives only true, false
a==b; a!=b; a<b; a>=b    // value compare
a===b; a!==b;  // value, type compare (It is strict version, like 5!==="5")

a=3
let cond1 = a<b; //true
let cond2 = a!=b; //true
let cond3 = b==6
console.log(cond1 && cond3); // It will print Boolean


//if-else Ternary syntax
let marks = 9;
let result = marks>=8.5 ? "Good" : "Not-bad"  //if(marks>=8.5){console.log("Good")} else {console.log("Not-bad")}
console.log(result);
console.log( result = marks>=8.5 ? "Good" : "Not-bad");  

//prompt to take temp input
// console.log(prompt("Write whatever you wanna print"));

















}{// Lecture-3

for(let i=1; i<=10; i++){
    console.log("That's Loop");
}

//while loop    , first check condition then run
let i=3;
w=0;
while(i<13){
    i++;1
    w=i**2;
}
console.log(w);

//do-while loop    , atleast first run then condition check
 i=3;
do{
    i++
    w=i**2
}while(i<5);         // semi-column require and while condition after {}
console.log(w);


//for-of loop  (i for key value)
//This loop is for the strings and arrays and it run continuously without any incremental requirements
let word = "Hola is Hello.";
let strCount = 0 ;
for(let i of word){             //start from start to string end changing i
    console.log(i);
    strCount+=1;
}
console.log(strCount);

//for-in loop (i for key)
//This loop is for the strings and arrays and it run continuously without any incremental requirements
let obj = {
    names: "James Stems",
    data:12,
    letter: 2,
    isOk: true
}
                                 // here i is key
for(let i in obj){              //start from start to object end changing i,   but here i is key not value
    console.log(i, obj[i]);    //here "" is not in [i] cause i is variable.
    strCount+=1;
}
console.log(strCount);


// Strring
let objs = {n:3, point:"ok", m:4 }
let specialS = `The cost is ${objs.m} `; // Special string as template literals. can use inside value in ${}
console.log(specialS)
console.log("The cost is" , objs.m);

console.log("Hi wanna move to next line, see\nsee this is next line and for tab\tthis is new tab."); // Remember \t is single length string in count

let str = "This is a simple txt."
str.toLowerCase();        // It doesn't change the original string as string never modified.
str = str.toUpperCase(); // Just to change completely.
let slicedStr = str.slice(2,3); // gives or it is from 3rd to 5th txt
console.log(slicedStr);
console.log(str.concat(str));  //join 2 string
console.log(str.replace("I", "O"));
console.log(str.replaceAll("I", "O"));
console.log(str.charAt(5));





















}{// Lecture-4

let arraylist = [45, "TimeRanges", "have", "been", "set", "to", "encounter", 8763,];
let arraylmod = arraylist.pop();                                 // using this modify the original array
console.log(arraylist.toString());

arraylist.push("add");                                        // Add at end modified
arraylist.concat(arraylmod);                                 //  join and make new array (no modification)
arraylist.unshift("add at start", "2nd add");
arraylist.shift();                                         // remove first element
console.log(arraylist.toString());
console.log(arraylist.slice(2,5))                                     // not modify but give sliced part. Also end not included.
console.log(arraylist.splice(3, 2, "4th remove"))                    // splice(remove from index, numbeer to remove, add from that index)
console.log(arraylist);

//replace
arraylist.splice(3,1,"Replaced")






















}{// Lecture-4
function myfun(x,y){
    let sum = x+y;
    console.log("Sum by myfun function is",sum);
    return sum;
}
let y= myfun(3,4);
y;   //only return value
console.log(myfun(45,55));

// Arrowed function
let arrowedf = (x,y) => {
    let sum = x+y;
    console.log("Sum by myfun function is",sum);
    return sum;
}
console.log(arrowedf);       //here arrowed funbction act as string and got as-it-is print
console.log(arrowedf(3,4))    // by using () it became funtion






















}{// Lecture-5
//forEach loop is espically for arrays for applying algo on each term, so it is a method of array as .toLowercase() is for string

let arr = [3,4,5,6,7,8,9,10];
arr.forEach(function printArr(x, idr){
    console.log(x, idr);})                        //forEach(function, index, array)

arr.forEach((i, idnx, arry)=>{
    console.log(i, idnx, arry);})               //Arrow function

let arrM = arr.map((i) => {return i**i;})
console.log(arrM);

let arrF = arr.filter(i => {return i%2==0;})          // filter the true statement in function assigne.
console.log(arrF);

let arrR = arr.reduce((ret, current) => {return ret+current;})        // reduce the array to single value. Its loop with current changes from index 1 to end and store to ret.
















}{// Lecture-6
let h2 = document.getElementsByTagName("h2");  // or use querySelectorAll("h2") for any type by tag as '#' for id or '.' for class
console.dir(h2);

let change = document.querySelector("h1");  // for 1st h2
change.innerText = change.innerText + "(this is by JS)";  // change the inner text of h1

let newPage = document.querySelectorAll(".newPage");
console.log(newPage[0].innerText);  // innerHTML is used to get the inner data of tag

for(i=1; i<4; i++){
    newPage[i-1].innerText = newPage[i-1].innerText + i;     // document.getElementsByClassName("newPage")[i-1].innerText = document.getElementsByClassName("newPage")[i-1].innerText + i;    (directly)
}
let idx = 1;
for(giveSequential of newPage){        // querySelectorAll(".newPage") take all as array and give each element to giveSequential
    giveSequential.innerText = giveSequential.innerText + idx;
    idx++;
}









}{// Lecture-7
let h1 = document.querySelector("h1");
h1.setAttribute("id", "setedh1");  // set the id of h1
console.log(h1.getAttribute("id"));  // get the class of h1

let btnCreated = document.createElement("i");
btnCreated.style.backgroundColor = "yellow";
btnCreated.style.color = "black";
btnCreated.innerText = "This is created by JS ";
h1.prepend(btnCreated);                                  // (like adding in h1, what, where? btn, prepand)
document.querySelector("h2").remove();











}{// Lecture-8
let clk = document.querySelector(".newPage");
clk.onclick = (e) => {                 //the e in () is auto assigned to the main event details
    // alert("why?");
    console.log(e.type);
}
clk.onmouseover = (evt) => {
    console.log(evt.clientX , evt.clientY);
}

clk.addEventListener("dblclick", ()=>{console.log("Double clickedd")});
const func = (d) => {console.log("Umm, const f", d)};
clk.addEventListener("dblclick", func);
clk.removeEventListener("dblclick", func);          //remove the event to save memory















}// Lecture-11
try{
    consoEe.log("This is try block");  //error in console.log
}
catch(err){  //catch the error and store in catch()
    console.log(err);
}






    

