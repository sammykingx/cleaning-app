function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

const now = new Date();
const currentMinutes = now.getHours() * 60 + now.getMinutes();

if (currentMinutes > timeToMinutes("13:00")) {
  console.log("Later than 8:00");
} else {
  console.log("Earlier than or equal to 8:00");
}
