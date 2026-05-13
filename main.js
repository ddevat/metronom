var playBtn = document.getElementById("play-btn");
var beats = document.querySelectorAll(".beat");
var intervalId = null;
var current = 0;
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
  for (var i = 0; i < beats.length; i++) {
    beats[i].classList.remove("active");
  }
  playClick(current === 0);
  beats[current].classList.add("active");
  current = (current + 1) % beats.length;
}

playBtn.addEventListener("click", function () {
  initAudio();
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    current = 0;
    for (var i = 0; i < beats.length; i++) {
      beats[i].classList.remove("active");
    }
    playBtn.textContent = "Play";
  } else {
    highlightBeat();
    intervalId = setInterval(highlightBeat, 600);
    playBtn.textContent = "Stop";
  }
});
