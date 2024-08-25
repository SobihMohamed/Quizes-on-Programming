// ? var
let ArrSpanCtegories = document.querySelectorAll(".categories span");
let countDiv = document.querySelector(".count");
let getStartDiv = document.querySelector(".getStart");

let h4OfQuizInfo = document.querySelector(".quiz-info h4");
let categories = document.querySelector(".quiz-info .categories");
let chooseAnsText = document.querySelector(".choose_ans");

let Start_But = document.getElementById("start");
var ChossenCategorie = document.querySelector(".lang");
let spansDiv = document.querySelector(".bullets .spans");
let question_Area = document.querySelector(".question-Area");
let submit_but = document.querySelector(".but_sub");
let countDown = document.querySelector(".countdown");
let countDownInterval;

let score = 0;
let current_index = 0;
let Arr_suitable_cat = [];
let divOfInp = document.querySelector(".his_name");
let input_name = document.getElementById("N");
let Name = "User";
// ? function check categories clicked
ArrSpanCtegories.forEach((span) => {
  span.addEventListener("click", (e) => {
    if (e.target.classList.contains("html")) {
      ChossenCategorie.innerHTML = `HTML`;
    } else if (e.target.classList.contains("css")) {
      ChossenCategorie.innerHTML = `CSS`;
    } else if (e.target.classList.contains("js")) {
      ChossenCategorie.innerHTML = `JavaScript`;
    } else {
      ChossenCategorie.innerHTML = `C`;
    }
    Name = input_name.value;
    divOfInp.style.display = "none";
    countDiv.style.display = "block";
    getStartDiv.style.display = "block";
    h4OfQuizInfo.style.display = "none";
    categories.style.display = "none";
    chooseAnsText.style.display = "block";
  });
});

// ? on click on start
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("start")) {
    submit_but.style.display = "block";
    countDiv.style.display = "none";
    getStartDiv.style.display = "none";
    // ? call function that to make AJAX
    prepareAjax();
  }
});

// ? prepare ajax
function prepareAjax() {
  let myReq = new XMLHttpRequest();
  myReq.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      //? convert to object
      let Objects = JSON.parse(this.responseText);
      //? function create buulets
      create_bullets(10);
      //? call function get the array of html or css or js or c++ Qustion
      Put_suitable_catigories_in_array(Objects);
    }
  };
  myReq.open("GET", "htmlQuestion.json", true);
  myReq.send();
}
// ? reate bullets
function create_bullets(Q_nums) {
  if (spansDiv.innerHTML === "") {
    for (let i = 0; i < Q_nums; i++) {
      // ? create span
      let span = document.createElement("span");
      span.innerHTML = i + 1;
      if (i === 0) {
        span.classList.add("current-Q");
      }
      spansDiv.appendChild(span);
    }
  }
}

// ? main function
function Put_suitable_catigories_in_array(Objects) {
  Objects.forEach((Ob) => {
    if (Ob.catigories === ChossenCategorie.textContent) {
      Arr_suitable_cat.push(Ob);
    }
  });
  //? call function add the quiz to html current index start from zero
  add_Q_to_html(Arr_suitable_cat[current_index]);
  // ? call counter
  CountDown(120);
  // ? in click the button of submit
  submit_but.onclick = () => {
    // ! check if he choose ans
    if (check_choose_ans()) {
      // ? catch the right answer
      let rightAns = Arr_suitable_cat[current_index].right_Answ;
      // ? call function check the answer (rigth answer and number of question);
      Check_Ans(rightAns);
      // ? increase current index
      current_index++;
      // ? delete the current question
      question_Area.innerHTML = "";
      //? check if last question
      if (current_index != 10) {
        // ? call add the next question function
        add_Q_to_html(Arr_suitable_cat[current_index]);
        // ? handel the bullets
        HandelBulltes();
      } else {
        swal("Good job!", "You Finished The Quiz.", "success");
        // ? delete and sow
        submit_but.remove();
        countDown.remove();
        spansDiv.remove();
        ShowResult(score);
        setTimeout(() => {
          window.location.reload();
        }, 5000);
      }
    } else {
      swal("Sorry!", "You Must Choose One Answer!", "error");
    }
  };
}

// ? function add in html
function add_Q_to_html(Ob) {
  // ? create h2 question title
  let h2 = document.createElement("h2");

  // ? create textnode
  let Q_text = document.createTextNode(Ob.title);

  //  ? append text
  h2.appendChild(Q_text);

  //  ? appent in question-Area
  question_Area.appendChild(h2);

  //   ? create div answ-Area
  let answ_Area = document.createElement("div");
  // ? class div answ area
  answ_Area.classList.add("answ-Area");

  // ? create for div ans
  for (let i = 0; i < 4; i++) {
    // ?div ans
    let divans = document.createElement("div");
    // ?class div ans
    divans.classList.add("ans");
    // ? create input
    let input = document.createElement("input");
    // ? class input
    input.setAttribute("id", `ans${i + 1}`);
    // ? attributs
    input.setAttribute("type", "radio");
    input.setAttribute("name", "questions");
    // ? create label
    let label = document.createElement("label");
    // ? attributs label
    label.setAttribute("for", `ans${i + 1}`);
    // ? text label
    let textLabel = document.createTextNode(Ob[`answ${i + 1}`]);
    // ? append to label
    label.appendChild(textLabel);
    // ? append label and input to ans
    divans.appendChild(input);
    divans.appendChild(label);
    // ? append ans
    answ_Area.appendChild(divans);
  }
  question_Area.appendChild(answ_Area);
}

// ? function check the ans
function Check_Ans(right_Ans) {
  // ? create array of answers
  let answers = document.getElementsByName("questions");
  let theChoosenAns;
  for (let i = 0; i < 4; i++) {
    if (answers[i].checked) {
      // ? get the choosen ans in theChoosenAns
      theChoosenAns = answers[i].nextElementSibling.textContent;
    }
  }
  // ? check if correct
  if (right_Ans == theChoosenAns) {
    score++;
  }
}

// ? function handel the bullets
function HandelBulltes() {
  let Array_Bullets_spans = Array.from(
    document.querySelectorAll(".bullets .spans span")
  );
  Array_Bullets_spans.forEach((span, index) => {
    if (index == current_index) {
      span.classList.add("current-Q");
    }
  });
}

// ? Function check if he choose
function check_choose_ans() {
  let answers = document.getElementsByName("questions");
  let check = false;
  for (let i = 0; i < 4; i++) {
    if (answers[i].checked) {
      check = true;
    }
  }
  return check;
}

// ?function Show Result
function ShowResult(score) {
  chooseAnsText.innerHTML = "<h1>The Result Is :</h1> ";
  let result_message = document.createElement("h1");
  let message1 = `Certificatly ${Name}, your Result is ${score} / 10`;
  let message2 = `Nice ${Name}, your Result is ${score} / 10`;
  let message3 = `Bad ${Name}, your Result is ${score} / 10`;

  let result_message_text;
  question_Area.appendChild(result_message);

  if (score == 10) {
    result_message_text = document.createTextNode(message1);
    result_message.style.color = "rgb(0, 255, 68)";
  } else if (score < 10 && score >= 5) {
    result_message_text = document.createTextNode(message2);
    result_message.style.color = "orange";
  } else if (score < 5) {
    result_message_text = document.createTextNode(message3);
    result_message.style.color = "red";
  }

  result_message.appendChild(result_message_text);
}
// ? count down function 
function CountDown(duration) {
  if (current_index < 10) {
    let min, sec;
    countDownInterval = setInterval(() => {
      min = parseInt(duration / 60);
      sec = parseInt(duration % 60);

      min = min < 10 ? `0${min}` : `${min}`;
      sec = sec < 10 ? `0${sec}` : `${sec}`;

      countDown.innerHTML = `${min}:${sec}`;

      if (--duration < 0) {
        clearInterval(countDownInterval);
        swal("Sorry!", "The Time has been End.", "error");

        chooseAnsText.innerHTML = "<h1>The Result Is :</h1> ";
        submit_but.remove();
        question_Area.innerHTML = "";
        spansDiv.remove();
        countDown.remove();
        ShowResult(score);
        setTimeout(() => {
          window.location.reload();
        }, 5000);
      }
    }, 1000);
  }
}
