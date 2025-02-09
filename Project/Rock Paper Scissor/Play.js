let choices = document.querySelectorAll(".choice");
let ng = document.querySelector(".ng");
let iwonBox = document.querySelector('.iwon');
let byBot = document.querySelector('.iwonPlayed');
let p1ScoreOn = document.querySelector('.sbs1s');
let p2ScoreOn = document.querySelector('.sbs2s');
let p1Score = 0;
let p2Score = 0;

// Robot Choice Generator
const comPlayFun = () => {
    let choiceArray = ["rock", "paper", "scissor"];
    return choiceArray[Math.floor(Math.random()*3)];
}

// Each choice function applied
choices.forEach((choice)=>{
    choice.addEventListener("click", ()=>{
        mainPlay = choice.getAttribute("id");
        comPlay = comPlayFun();
        byBot.innerText = "by your PC - "+comPlayFun();
        console.log(mainPlay, "was played by you");
        console.log(comPlay, "was played by bot");
        whoWon(mainPlay, comPlay);
    })
});

//Winner decide and tasks to do to the winner
const whoWon = (p1Choose, p2Choose) => {
    let winner;
    if(p1Choose==p2Choose){
        console.log("It's a tie");
        iwonBox.innerText = ("It,s a tie, Play Again!");
        iwonBox.classList.add("itie");
        }
    else if(p1Choose == "rock"){
        p2Choose=="paper" ? (winner="Paper", p2Score++, iwonBox.classList.add("ilost"), iwonBox.classList.remove("itie")) : (winner="Rock", p1Score++, iwonBox.classList.remove("ilost", "itie"));
        }
    else if(p1Choose == "paper"){
        p2Choose=="scissor" ? (winner="Scissor", p2Score++, iwonBox.classList.add("ilost"), iwonBox.classList.remove("itie")) : (winner="Paper", p1Score++, iwonBox.classList.remove("ilost", "itie"));
        }
    else if(p1Choose == "scissor"){
        p2Choose=="rock" ? (winner="Rock", p2Score++, iwonBox.classList.add("ilost"), iwonBox.classList.remove("itie")) : (winner="Scissor", p1Score++, iwonBox.classList.remove("ilost", "itie"));
        }
    if(p1Choose != p2Choose){
        console.log(winner)
        p1ScoreOn.innerText = p1Score;
        p2ScoreOn.innerText = p2Score;
        iwonBox.innerText = winner + " Win!!";

    }
}

//New Game button
ng.addEventListener("click", ()=>{
    p1ScoreOn.innerText = 0;
    p2ScoreOn.innerText = 0;
    p1Score = 0;
    p2Score = 0;
    iwonBox.innerText = "Start fresh,"
});

