var playBtn = document.getElementById("play-btn");
var beatsContainer = document.getElementById("beats");
var tempoSlider = document.getElementById("tempo-slider");
var tempoValue = document.getElementById("tempo-value");
var timeSignature = document.getElementById("time-signature");
var intervalId = null;
var current = 0;
var bpm = 100;
var beatCount = 4;

function buildBeats(count) {
  beatsContainer.innerHTML = "";
  for (var i = 0; i < count; i++) {
    var div = document.createElement("div");
    div.className = "beat";
    div.textContent = i + 1;
    beatsContainer.appendChild(div);
  }
}

function getBeats() {
  return beatsContainer.querySelectorAll(".beat");
}
var audioCtx = null;
var clickBuffer = null;
var accentBuffer = null;

function renderClick(ctx, frequency, bandFreq, volume, oscVolume) {
  var sampleRate = ctx.sampleRate;
  var duration = 0.03;
  var length = Math.floor(sampleRate * duration);
  var buffer = ctx.createBuffer(1, length, sampleRate);
  var data = buffer.getChannelData(0);
  for (var i = 0; i < length; i++) {
    var t = i / sampleRate;
    var envelope = Math.exp(-t * 200);
    var noise = (Math.random() * 2 - 1) * volume;
    var tone = Math.sin(2 * Math.PI * frequency * t) * oscVolume;
    data[i] = (noise + tone) * envelope;
  }
  return buffer;
}

function initAudio() {
  if (audioCtx) return;
  var AudioCtx = window.AudioContext || window.webkitAudioContext;
  audioCtx = new AudioCtx();
  accentBuffer = renderClick(audioCtx, 1800, 3500, 0.6, 0.15);
  clickBuffer = renderClick(audioCtx, 1200, 2500, 0.3, 0.08);
}

function playClick(accent) {
  var source = audioCtx.createBufferSource();
  source.buffer = accent ? accentBuffer : clickBuffer;
  source.connect(audioCtx.destination);
  source.start(0);
}

function highlightBeat() {
  var beats = getBeats();
  for (var i = 0; i < beats.length; i++) {
    beats[i].classList.remove("active");
  }
  playClick(current === 0);
  beats[current].classList.add("active");
  current = (current + 1) % beats.length;
}

function stopMetronome() {
  clearInterval(intervalId);
  intervalId = null;
  current = 0;
  var beats = getBeats();
  for (var i = 0; i < beats.length; i++) {
    beats[i].classList.remove("active");
  }
  playBtn.textContent = "Play";
}

playBtn.addEventListener("click", function () {
  initAudio();
  if (intervalId) {
    stopMetronome();
  } else {
    highlightBeat();
    intervalId = setInterval(highlightBeat, 60000 / bpm);
    playBtn.textContent = "Stop";
  }
});

tempoSlider.addEventListener("input", function () {
  bpm = Number(tempoSlider.value);
  tempoValue.textContent = bpm + " bpm";
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = setInterval(highlightBeat, 60000 / bpm);
  }
});

timeSignature.addEventListener("change", function () {
  beatCount = Number(timeSignature.value.split("/")[0]);
  buildBeats(beatCount);
  current = 0;
  if (intervalId) {
    clearInterval(intervalId);
    highlightBeat();
    intervalId = setInterval(highlightBeat, 60000 / bpm);
  }
});

buildBeats(beatCount);
