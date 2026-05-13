var playBtn = document.getElementById("play-btn");
var beats = document.querySelectorAll(".beat");
var intervalId = null;
var current = 0;

function highlightBeat() {
  for (var i = 0; i < beats.length; i++) {
    beats[i].classList.remove("active");
  }
  beats[current].classList.add("active");
  current = (current + 1) % beats.length;
}

playBtn.addEventListener("click", function () {
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
