var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechRecognitionEvent =
  SpeechRecognitionEvent || webkitSpeechRecognitionEvent;


const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.lang = "en-US";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

const diagnostic = document.querySelector(".output");
const startBtn = document.querySelector("button");

const micoff = document.querySelector("#micoff");
const greenmic = document.querySelector("#greenmic");
const whitemic = document.querySelector("#whitemic");

// TODO: this probably kills your cell phone battery
// Turn off after 10s of silence?

var recognizing = false;

var blinkerIntervalID;

function set_mic_off() {
    micoff.style.display = "";
    clearInterval(blinkerIntervalID);
    greenmic.style.display = "none";
    whitemic.style.display = "none";
}

function blinkMic() {
    if (greenmic.style.display == "none") {
        greenmic.style.display = "";
        whitemic.style.display = "none";
    } else {
        greenmic.style.display = "none";
        whitemic.style.display = "";
    }
}

function set_mic_on() {
    micoff.style.display = "none";
    greenmic.style.display = "none";
    whitemic.style.display = "";
    blinkerIntervalID = setInterval(blinkMic, 500);
}


function toggleRecognition() {
    if (recognizing) {
        recognition.stop();
        set_mic_off();
        console.log("Stopped.");
        startBtn.innerHTML = "<b>Start recognition</b>";
        recognizing = false;
    } else {
        recognition.start();
        set_mic_on();
        console.log("Started.");
        startBtn.innerHTML = "<b>Stop listening</b>";
        recognizing = true;
    }
};

// Lots of ways to toggle recognition
startBtn.onclick = toggleRecognition;
micoff.onclick = toggleRecognition;
greenmic.onclick = toggleRecognition;
whitemic.onclick = toggleRecognition;
output.onclick = toggleRecognition;

recognition.onresult = function (event) {
    const i = event.results.length-1;
    const text = event.results[i][0].transcript;
    diagnostic.innerHTML = diagnostic.innerHTML + "\n<br/>" + text + "...";
    console.log("Confidence: " + event.results[i][0].confidence);
    console.log("results: " + event.results);
    console.log("results len: " + event.results.length);
    console.log("results[nr] len: " + event.results[i].length);    
};

recognition.onspeechend = function () {
    recognition.stop();
    recognition.start();
    console.log("onspeechend: restarted.");
};

recognition.onnomatch = function (event) {
    recognition.stop();
    recognition.start();
    console.log("onnomatch: restarted.");
};

recognition.onerror = function (event) {
    diagnostic.textContent = "Error occurred in recognition: " + event.error;
    recognition.stop();
    recognition.start();
    console.log("onerror: restarted.");
};
