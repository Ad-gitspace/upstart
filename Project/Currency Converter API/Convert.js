const rateURL = "https://cdn.moneyconvert.net/api/latest.json";
let cSelect = document.querySelectorAll("#cSelect"); // for country list addition
let amountInput = document.querySelector("#fromAmt");
let amountOutput = document.querySelector("#toAmt");
let reverse = document.querySelector("#conLogo");
let visitG = document.querySelector("#googleSearch a");

let fromCountry = "USD";
let toCountry = "INR";

// Adding all country codes in option
let selectedInTo = false;
for(let fromTo of cSelect){   // for targeting both side and use All querySelector
    for(currency in countryList){
        let option = document.createElement("option");
        option.innerText = currency;
        option.value = currency;
        fromTo.append(option);
        if(currency==="USD" && !selectedInTo++){
            option.selected="selected";
        }
        if(currency==="INR" && selectedInTo){
            option.selected = "selected";
        }
    }
   
    // Flag/Country acccording to option
    fromTo.addEventListener("change",(event)=>{         // event is a value passed by change which is used by event.target="HTML Tag"
        let selOption = event.target;
        let countryCode = countryList[selOption.value];
        let countryFlag = `https://flagsapi.com/${countryCode}/shiny/64.png`;
        selOption.parentElement.querySelector("img").src = countryFlag;
        if(selOption.parentElement.querySelector("#fromAmt")){
            fromCountry = (selOption.value);

        }
        if(selOption.parentElement.querySelector("#toAmt")){
            toCountry = (selOption.value);
        }
        getRates();
    })


}



//Fetch-data
async function getRates() {
    try{
        let response = await fetch(rateURL);
        let data = await response.json()
        let fromRate = data.rates[fromCountry];
        let toRate = data.rates[toCountry];
        amountOutput.value = (amountInput.value)*toRate/fromRate;
        visitG.href = `https://www.google.com/search?q=${amountInput.value}+${fromCountry}+to+${toCountry}`;
    }
    catch(error){
        amountOutput.value = error;
        amountOutput.style.color = "red";        
    }
}

amountInput.addEventListener("input", getRates);
amountInput.addEventListener("paste", getRates);
window.addEventListener("load",getRates)



//Reverse Country
    reverse.addEventListener("click", ()=>{
        let temp = fromCountry;
        fromCountry = toCountry;
        toCountry = temp;
        getRates();

        document.querySelector("#From select").value = fromCountry;
        document.querySelector("#To select").value = toCountry;

        document.querySelector("#From img").src = `https://flagsapi.com/${countryList[fromCountry]}/shiny/64.png`;
        document.querySelector("#To img").src = `https://flagsapi.com/${countryList[toCountry]}/shiny/64.png`;

    })





