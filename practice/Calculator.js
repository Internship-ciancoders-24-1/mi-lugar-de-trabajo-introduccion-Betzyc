

const nameIdKeys = ["message", "display", "AC", "C", "equal", "keyLeftParenth", "keyRightParenth", "add", "subt", "div", "mult", "keyDot", "zero", "one", "two",  "three", "four", "five", "six", "seven", "eight", "nine", "back-arrow"]

const keys = [];
nameIdKeys.forEach(key => keys.push(document.getElementById(key)))

const keysCanBeDisplayed = keys.slice(5, 22)
const keysCannotBeDisplayed = keys.slice(0, 5)


const message = keys[nameIdKeys.indexOf("message")]
let display = keys[nameIdKeys.indexOf("display")]
const keyAC = keys[nameIdKeys.indexOf("AC")]
const keyBack = keys[nameIdKeys.indexOf("C")]
const keyEqual = keys[nameIdKeys.indexOf("equal")]
const keyDot = keys[nameIdKeys.indexOf("keyDot")]
let backArrow = document.getElementById("back-arrow");


function multiplication(item){
    for(let i in item){
        if(item[i] === "*"){
            let index = item.indexOf("*");
            let val1 = parseFloat(item[index-1]);
            let val2 = parseFloat(item[index+1]);
            let result = val1 * val2;
            item.splice(index-1, 3, result);
        }
    }
}

function division(item){
  for(let i in item){
      if(item[i] === "/"){
          let index = item.indexOf("/");
          let val1 = parseFloat(item[index-1]);
          let val2 = parseFloat(item[index+1]);
          let result = val1 / val2;
          item.splice(index-1, 3, result);
      }
  }
}

function addition(item){
  for(let i in item){
      if(item[i] === "+"){
          let index = item.indexOf("+");
          let val1 = parseFloat(item[index-1]);
          let val2 = parseFloat(item[index+1]);
          let result = val1 + val2;
          item.splice(index-1, 3, result);
      }
  }
}

function subtraction(item){
  for(let i in item){
      if(item[i] === "-"){
          let index = item.indexOf("-");
          let val1 = parseFloat(item[index-1]);
          let val2 = parseFloat(item[index+1]);
          let result = val1 - val2;
          item.splice(index-1, 3, result);
      }
  }
}

let parenthesisOpen=[]

function getIndexparenthesis(item){
  for(let i in item){
      if(item[i] === "("){
          parenthesisOpen.push(i);
      }
  } 
}


function calculateExpression(item){
  for(let i in item){
      let indexAdd = item.indexOf("+")
      let indexSub = item.indexOf("-")
      let indexDiv = item.indexOf("/")
      let indexMult = item.indexOf("*")
      if(indexDiv < indexMult) {
        division(item)
        multiplication(item)
      } else if(indexDiv > indexMult) {
        multiplication(item)
        division(item)
      }
      if(indexAdd < indexSub) {
        addition(item)
        subtraction(item)
      } else if (indexAdd > indexSub) {
        subtraction(item)
        addition(item)
      }
  }
  return item
}

function calculateParenthesis(item){
  getIndexparenthesis(item)
  for(let i = parenthesisOpen.length-1; i >= 0; i--){
    let init = parseFloat(parenthesisOpen[i]);
    let expression = item.slice(init, item.length);
    let parenthesisEnd = expression.indexOf(")");
    let end = init + parenthesisEnd;
    let subExpression = item.slice(init+1, end);
    let result = (calculateExpression(subExpression).toString());
    item.splice(init, parenthesisEnd+1, result);

  }
  if (item.length > 1){
    calculateExpression(item)
  }
  parenthesisOpen = [];
  return parseFloat(item);

}

function validateExpression(finalResult){
  if(isNaN(finalResult)) {
    message.style.fontSize = "2rem";
    message.innerHTML = "Expresion invalida";
  } else {
    display.innerHTML = finalResult;
    message.innerHTML = "CALCULADORA"
  }
}

function mostrar(item){
  let result = calculateExpression(item)
  validateExpression(result)
}

function keyDisplay(event){
  if(event.target.innerHTML === "="){
    message.innerHTML = "CALCULADORA";
  } else {
    display.innerHTML += event.target.innerHTML;
  }

}

function reset() {
  keyAC.onclick = function() {
    display.innerHTML = "";
    message.innerHTML = "CALCULATOR";
    display.style.fontSize = "2.5rem";
  }
}

function undo() {
  keyBack.onclick = function() {
    let splitLast = display.innerHTML.slice(0, -1)
    display.innerHTML = splitLast
    display.innerHTML.length > 0 ? message.innerHTML = "CALCULADORA" : message.innerHTML = "CALCULATOR";
  }
}

function ifStartsBySign(onlyNumbersArray) {
  for(let i in onlyNumbersArray) {
    if(onlyNumbersArray[i] === "") {
      let index = onlyNumbersArray.indexOf(onlyNumbersArray[i])
      let result = onlyNumbersArray[index + 1].concat((onlyNumbersArray[index + 2]))
      onlyNumbersArray.splice(index, 3, result)
    }
  }
}

function getOperation(){

  let onlyNumbersArray = (
    display.innerHTML
      .split("+").join(" + ")
      .split("-").join(" - ")
      .split("*").join(" * ")
      .split("/").join(" / ")
      .split("=").join(" = ")
      .split("(").join("( ")
      .split(")").join(" )")
      ).split(" ")
  ifStartsBySign(onlyNumbersArray)
  return onlyNumbersArray
}


function execute(key, event){
  message.innerHTML = "CALCULADORA"
  keyDisplay(event);
  if(display.innerHTML.length>0){
    keyEqual.onclick = function(){
      if(display.innerHTML.length< "15") {
        display.style.fontSize = "2.5rem";
      }
      let item = getOperation();
      mostrar(item);
    }
  }
}

function addOnClickToKey(key) {
  reset()
  undo()
  key.onclick = function(event) {
    if(display.innerHTML.length < "15") {
      execute(key, event) 
    }
    else if(display.innerHTML.length < "25") { 
      display.style.fontSize = "1.5rem"; 
      execute(key, event) 
    }
  }
}

keys.slice(2, keys.length-1).forEach(addOnClickToKey)
