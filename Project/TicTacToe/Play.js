let body = document.querySelector('body');
let resetBTN = document.getElementById('resetB');
let cells = document.querySelectorAll('.cell');  //All selected all as array bundle & each cen be used in forEach loop
let turnSelector = document.getElementById('turnSelector');
let xBTN = document.querySelector('#turnX');
let oBTN = document.querySelector('#turnO');
let undo = document.getElementById('undo');
let winner = document.getElementById('winner');
let turnX = true;

resetBTN.addEventListener("click", ()=>{
    document.querySelector('a').innerHTML= '<a href=""></a>';
})



xBTN.onclick = () => {
    turnX = true;
    console.log("Game will start with X");
    turnSelector.remove();
    xBTN.remove();
    document.querySelector('header').classList.remove('dimmed');
    document.querySelector('main').classList.remove('dimmed-main');
}
oBTN.onclick = () => {
    turnX = false;
    console.log("Game will start with O");
    turnSelector.remove();
    xBTN.remove();
    document.querySelector('header').classList.remove('dimmed');
    document.querySelector('main').classList.remove('dimmed-main');
}


cells.forEach((cell) => {
cell.onclick = () => {
    if(turnX){
        turnSelector.remove();
        xBTN.remove();  
        document.querySelector('main').classList.remove('dimmed-main');
        document.querySelector('header').classList.remove('dimmed');
        console.log("X was played");
        cell.innerText = "X";
        turnX = false;
        cell.disabled = true;
        checkWinner();

    }
    else{
        cell.innerText = "O";
        console.log("O was played");
        turnX = true;
        cell.disabled = true;
        checkWinner();
    }
   
    
}})


let winPtrn = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

const checkWinner = () => {
    for(ptrn of winPtrn){
        let frtE = cells[ptrn[0]].innerText;
        let sndE = cells[ptrn[1]].innerText;
        let trdE = cells[ptrn[2]].innerText;
    
    if(frtE == sndE && sndE== trdE && frtE !="" && sndE !="" && trdE !=""){
        console.log("win", frtE,sndE,trdE);
        winner.innerText = "The winner is " + frtE;
        winner.style.borderRadius = "2px";
        break;
    }}
}

