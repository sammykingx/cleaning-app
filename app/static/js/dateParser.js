// returns a clean date and time object
// in the format dd/mm/yyyy, hh:mm in 24hr format

function getCleaningDate(dayStr, timeStr) {
    // js calender day based index
    const daysMap = {
        sunday: 0,
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6,
    };

    const dayKey = dayStr.toLowerCase();
    const targetDay = daysMap[dayKey] !== undefined ? daysMap[dayKey] : 1; // defaults to monday

    let normalizedTime = timeStr.toLowerCase().trim();

    if (/^\d+$/.test(normalizedTime)) {
      
        // If only a number, infer am/pm
        const h = parseInt(normalizedTime, 10);
        if ([8, 11].includes(h)) {
            normalizedTime = `${h}am`;
        } else if ([1, 3, 6].includes(h)) {
            normalizedTime = `${h}pm`;
        } else {
            normalizedTime = "12pm"; // default time of 12pm for unsupported time
        }
    }

    const timeMatch = normalizedTime.match(/^(\d{1,2})(am|pm)$/);

    let hour = parseInt(timeMatch[1], 10);
    const period = timeMatch[2];

    if (period === "pm" && hour !== 12) hour += 12;
    if (period === "am" && hour === 12) hour = 0;

    const now = new Date();
    const currentDay = now.getDay();

    let daysAhead = (targetDay - currentDay + 7) % 7;

    if (daysAhead === 0) {
        // Same day, check time
        if (
            now.getHours() > hour ||
            (now.getHours() === hour && now.getMinutes() >= 0)
        ) {
            daysAhead = 7;
        }
    }

    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() + daysAhead);
    targetDate.setHours(hour, 0, 0, 0);

    // Build dd/mm/yyyy
    const dd = String(targetDate.getDate()).padStart(2, "0");
    const mm = String(targetDate.getMonth() + 1).padStart(2, "0");
    const yyyy = targetDate.getFullYear();

    const dateStr = `${dd}/${mm}/${yyyy}`;

    // Build HH:mm
    const hh = String(targetDate.getHours()).padStart(2, "0");
    const min = "00";

    const time24 = `${hh}:${min}`;

    return { dateStr, time24 };
}

function formatFriendlyRange(dateStr, time24) {
  const [dd, mm, yyyy] = dateStr.split("/").map(Number);
  const [hh, min] = time24.split(":").map(Number);
  const start = new Date(yyyy, mm - 1, dd, hh, min);

  const dayName = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ][start.getDay()];
  const dateNum = start.getDate();
  const ordinal = getOrdinal(dateNum);

  const { hour12: startHour12, period: startPeriod } = to12Hour(
    start.getHours()
  );

  // Compute end hour based on your actual time slot rules
  const endHour = getEndHour(start.getHours());

  const { hour12: endHour12, period: endPeriod } = to12Hour(endHour);

  // return `${dayName} ${dateNum}${ordinal}, ${startHour12}${startPeriod} to ${endHour12}${endPeriod}`;
  return `${dayName} ${dateNum}${ordinal}, ${startHour12}${startPeriod}`;
}

function getEndHour(startHour) {
  // Define your actual time slot rules
  switch (startHour) {
    case 8:
      return 11;
    case 11:
      return 13;
    case 13:
      return 15;
    case 15:
      return 18;
    default:
      return (startHour + 3) % 24; // Fallback
  }
}

function to12Hour(hour24) {
  const period = hour24 >= 12 ? "pm" : "am";
  let hour12 = hour24 % 12;
  if (hour12 === 0) hour12 = 12;
  return { hour12, period };
}

function getOrdinal(n) {
  if (n >= 11 && n <= 13) return "th";
  switch (n % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}