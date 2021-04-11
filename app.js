const inpPara = document.querySelector(".inpPara");
const dispPara = document.querySelector(".dispPara");
const timer = document.querySelector(".timer");
const result = document.querySelector(".result");
const displayWpm = document.querySelector(".wpm");
const errors = document.querySelector(".errors");
const Reset = document.querySelector(".reset");
const tests = document.querySelector(".tests");
const dispAvg = document.querySelector(".avgWpm");
const logo=document.querySelector(".logo");
const container=document.querySelector(".container");
let paragraph, length, avgWpm, letterCheck;
let index = 0;
let errorCounter = 0;
let testCounter = 0;
let sum = 0;
let arr = [];
let seconds = 60;
let interval = null;

window.onload = function () {
    getQuote();
    land();
}

function land(){
    logo.style.transform="translateY(0)";
    container.style.transform="translateY(0)";
}

function getQuote() {
    fetch('https://api.quotable.io/random?minLength=200&maxLength=300')
        .then(response => response.json())
        .then(data => display(data));
}

function display(data) {
    paragraph = data.content;
    quoteLength = data.length;
    paragraph.split("").forEach(characters => {
        let spanTxt = document.createElement("span");
        spanTxt.innerText = characters;
        dispPara.appendChild(spanTxt);
    })
    console.log(dispPara);
    letterCheck = dispPara.querySelectorAll("span");
}

function runTimer() {
    if (seconds > 0) {
        seconds--;
        timer.innerHTML = "0:" + seconds;
    }
    if(seconds<=9 && seconds>0){
        seconds--;
        timer.innerHTML = "0:0" + seconds;
    }
    if (seconds == 0) {
        timer.innerHTML = "0:00";
    } 
}

inpPara.addEventListener("input", function (e) {
    let userValue = inpPara.value.split("");
    if (index === 0) {
        interval = setInterval(runTimer , 1000);
    }
    if (e.inputType === "deleteContentBackward") {
        index--;
        letterCheck[index].classList.remove("correct");
        letterCheck[index].classList.remove("wrong");
    } else if (userValue[index] === letterCheck[index].innerHTML) {
        letterCheck[index].classList.add("correct");
        index++;
    } else {
        letterCheck[index].classList.add("wrong");
        index++;
        errorCounter++;
    }
    if (index == quoteLength) {
        getQuote();
    }
    if (seconds == 0) {
        inpPara.disabled = true;
        document.querySelector(".container").style.justifyContent="space-between";
        result.style.display = "block";
        let wordsNumber = inpPara.value.split(" ").length;
        let wpm = wordsNumber;
        arr[testCounter] = wpm;
        sum += arr[testCounter];
        avgWpm = sum / (testCounter+1);
        displayWpm.innerHTML = "Words per Minute: " + Math.round(wpm)+"wpm";
        errors.innerHTML = "Errors: " + errorCounter+" characters";
        testCounter++;
        tests.innerHTML = "Attmepts: " + testCounter;
        dispAvg.innerHTML = "Average wpm: " + Math.round(avgWpm)+"wpm";
        clearInterval(interval);
        seconds = 60; //reset Timer
    }
});

Reset.addEventListener("click", function () {
    dispPara.innerHTML = "";
    timer.innerHTML = "1:00"
    inpPara.disabled = false;
    inpPara.value = "";
    getQuote();
    seconds = 60;
    index = 0;
    errorCounter = 0;
})