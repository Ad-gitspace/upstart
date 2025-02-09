// #1 - Guess the number
// let num = 45;
// console.log("Enter your gussed number");
// i = prompt("Enter your gussed number");
// do{
//     if(i==num){
//         console.log("You gussed it right. The number is", num);
//     }
//     else if(i<num){
//         console.log("Enter a greater nmuber.");
//         i = prompt("Think bigger.");
//     }                                                                                                                                             
//     else if(i>num){
//         console.log("Enter a lesser nmuber.");
//         i = prompt("Enter something less.");
//     }
// }while( num != i );





// #2 - username generation
// let fullName = prompt("Enter fullname for username generation.");
// fullName = fullName.toLocaleLowerCase();
// fullName = fullName.trim();
// fullName = fullName.replaceAll(" ", "_");
// console.log("@"+fullName+fullName.length);





// #3 - Avg.marks of students
// let marklist = [85, 97, 44, 37, 76, 60];
// let mltotal = 0;
// for(i in  marklist){
//     console.log(`Marks of student ${parseInt(i)+1} is ${marklist[i]}`);
//     mltotal += marklist[i];
// }
// console.log("Average of the above is "+ mltotal/marklist.length);

// // #4 - Discount on products
// let price = [250, 645, 300, 900, 50];     console.log(price);
// for(i in price){
//     price[i] *= 0.9; 
// }
// price;                         // Just printing and is not a better , use console.log() to print









// #5 - Vowels in a string

// let strInput = prompt("Enter a string to count vowels");
// console.log("The number of vowels in the string is ", noOfVowels(strInput));

// function noOfVowelsByAI(str){
//     let vowels = ['a','e','i','o','u'];
//     let count = 0;
//     for(let i in str){
//         if(vowels.includes(str[i])){
//             count++;
//         }
//     }
//     return count;
// }
// // Method-2
// function noOfVowels(str){
//     str = str.toLowerCase();
//     let count = 0;
//     for(let i in str){
//         if(str[i] == 'a' || str[i] == 'e' || str[i] == 'i' || str[i] == 'o' || str[i] == 'u'){
//             count++;
//         }}
//     return count;
// }
// // Method-3
// let AnoOfVowels = (str) => {
//     str = str.toLowerCase();
//     let count = 0;
//     for(let i in str){
//         if(str[i] == 'a' || str[i] == 'e' || str[i] == 'i' || str[i] == 'o' || str[i] == 'u'){
//             count++;
//         }}
//     return count;
// }







// // #6 - Square of array's elements
// let arr2 = [0,1,2,3,4,5,6,7,8,9];
// let arr2Square = arr2;
// let squareF = (i, idx) => {
//     arr2Square[idx] = i*i;}
// arr2.forEach(squareF);
// console.log(arr2Square);





// #7 - Sum and product of array's elements
// let n = prompt("Enter the number of elements in the array");
// let arr7 = [];
// for(let i=0; i<n; i++){
//     arr7[i] = i+1;
// }
// let arr7Sum = arr7.reduce((sum, i) => {return sum+i;});         // sum is result of last iteration and i is current element
// let arr7Pro = arr7.reduce((sum, i) => {return sum*i;});
// console.log("The sum of the array is ", arr7Sum);
// console.log("The product of the array is ", arr7Pro);



// #8 - DOM
let body = document.querySelector('body');
let elem = document.createElement('div');
body.append(elem);
elem.setAttribute('class', 'newPage');
elem.innerHTML = "<button>Click me</button>";

let btn = document.querySelector('button');
btn.style.color = 'black';           // It applies the style even though class is new added. As the java>html sequence follows
btn.classList.add("cList");





// #9 - Dark/Light Event
let themeButton = document.querySelector("#themeB");
let themeB = document.getElementById("themeB");
let themeMode = "dark";


const themeModeF = () => {
    if(themeMode == "dark"){
        body.classList.remove("bodyDark");
        body.classList.add("bodyLight");
        themeB.classList.add("bodyDark");
        themeB.classList.remove("bodyLight");
        themeB.innerText = "Enter to light mode"
        document.querySelector("h1").style.color = "black";
        document.querySelector("h2").style.color = "black";
        themeMode = "light";
        console.log("Welcome to Light Theme.");
    }
    else{
        body.classList.remove("bodyLight")
        body.classList.add("bodyDark");
        themeB.classList.add("bodyLight");
        themeB.classList.remove("bodyDark");
        themeB.innerText = "Enter to dark mode"
        document.querySelector("h1").style.color = "white";
        document.querySelector("h2").style.color = "white";
        themeMode = "dark";
        console.log("Welcome to Dark Theme.");
}}
themeButton.addEventListener("click", themeModeF);





// #10 Classes

let data = "Web data"
const userS1 = {
    name: "Ad",
    email: "A@g.c",
    printName(){
        comsole.log(this.name);     //this. callls it's nearest profile.
    }};
const userS2 = {};
userS2.__proto__ = userS1;       //__proto__  is calling the functions of other obj.



class User {                                 // All property applies to it's caller.
    constructor(name, email){               //contains basic code like function, value etc. which constructs. It call first and invokes immeditely after 
        this.name = name;
        this.email = email;
    }
    viewData(){                         
        console.log("Website Data");
    }
}1
class Admin extends User{
    constructor(){
        super();
    }                                                   //It calls and applies the parents's constructor to it. As child not inherit constructor.
    edit(){
        data = "Updated web Data." 
    }

}

let student1 = new User("Ad", "A@g.c");
let student2 = new User();
let Admin1 = new User(Admin, "Admin@g.c");




















