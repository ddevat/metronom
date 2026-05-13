var playBtn = document.getElementById("play-btn");
var beatsContainer = document.getElementById("beats");
var timeSignature = document.getElementById("time-signature");
var wheel = document.getElementById("wheel");
var intervalId = null;
var current = 0;
var bpm = 100;
var beatCount = 4;
var beatModes = [];
var MODES = ["normal", "accent", "muted"];
var ITEM_HEIGHT = 36;
var MIN_BPM = 1;
var MAX_BPM = 200;
var wheelItems = [];
var scrollTimeout = null;

function buildBeats(count) {
  beatsContainer.innerHTML = "";
  beatModes = [];
  for (var i = 0; i < count; i++) {
    beatModes.push(i === 0 ? "accent" : "normal");
    var div = document.createElement("div");
    div.className = "beat" + (i === 0 ? " accent" : "");
    div.textContent = i + 1;
    div.setAttribute("data-index", i);
    div.addEventListener("click", onBeatClick);
    beatsContainer.appendChild(div);
  }
}

function onBeatClick(e) {
  var idx = Number(e.currentTarget.getAttribute("data-index"));
  var currentMode = beatModes[idx];
  var nextIndex = (MODES.indexOf(currentMode) + 1) % MODES.length;
  var nextMode = MODES[nextIndex];
  beatModes[idx] = nextMode;
  var el = e.currentTarget;
  el.classList.remove("normal", "accent", "muted");
  if (nextMode !== "normal") {
    el.classList.add(nextMode);
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
  var mode = beatModes[current];
  if (mode === "accent") {
    playClick(true);
  } else if (mode === "normal") {
    playClick(false);
  }
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
  playBtn.textContent = "▶";
}

playBtn.addEventListener("click", function () {
  initAudio();
  if (intervalId) {
    stopMetronome();
  } else {
    highlightBeat();
    intervalId = setInterval(highlightBeat, 60000 / bpm);
    playBtn.textContent = "■";
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

// --- Wheel picker ---

function buildWheel() {
  var pad = (140 - ITEM_HEIGHT) / 2;
  var inner = document.createElement("div");
  inner.style.paddingTop = pad + "px";
  inner.style.paddingBottom = pad + "px";
  for (var i = MIN_BPM; i <= MAX_BPM; i++) {
    var item = document.createElement("div");
    item.className = "wheel-item";
    item.textContent = i;
    item.setAttribute("data-bpm", i);
    inner.appendChild(item);
    wheelItems.push(item);
  }
  wheel.appendChild(inner);
}

function getSelectedBpmFromScroll() {
  var scrollTop = wheel.scrollTop;
  var index = Math.round(scrollTop / ITEM_HEIGHT);
  if (index < 0) index = 0;
  if (index > MAX_BPM - MIN_BPM) index = MAX_BPM - MIN_BPM;
  return index + MIN_BPM;
}

function updateWheelHighlight() {
  var selectedBpm = getSelectedBpmFromScroll();
  for (var i = 0; i < wheelItems.length; i++) {
    if (Number(wheelItems[i].getAttribute("data-bpm")) === selectedBpm) {
      wheelItems[i].classList.add("selected");
    } else {
      wheelItems[i].classList.remove("selected");
    }
  }
}

function scrollToBpm(value) {
  var index = value - MIN_BPM;
  wheel.scrollTop = index * ITEM_HEIGHT;
}

function onWheelScroll() {
  updateWheelHighlight();
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(function () {
    var newBpm = getSelectedBpmFromScroll();
    if (newBpm !== bpm) {
      bpm = newBpm;
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = setInterval(highlightBeat, 60000 / bpm);
      }
    }
    scrollToBpm(bpm);
  }, 80);
}

wheel.addEventListener("scroll", onWheelScroll);

buildWheel();
scrollToBpm(bpm);
updateWheelHighlight();

buildBeats(beatCount);
