function updateClock() {
  const now = new Date();
  const second = now.getSeconds();
  const minute = now.getMinutes();
  const hour = now.getHours();

  // Smooth movements with CSS transitions
  document.getElementById("second").style.transform = `rotate(${
    second * 6
  }deg)`;
  document.getElementById("minute").style.transform = `rotate(${
    minute * 6
  }deg)`;
  document.getElementById("hour").style.transform = `rotate(${
    (hour % 12) * 30 + minute * 0.5
  }deg)`;

  // Update digital clock
  const digitalClock = document.getElementById("digitalClock");
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  digitalClock.textContent = `${displayHour}:${minute
    .toString()
    .padStart(2, "0")}:${second.toString().padStart(2, "0")} ${ampm}`;
}

setInterval(updateClock, 1000);
updateClock(); // initial call
