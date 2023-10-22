export const getTimeAgo = (timestamp) => {
  const currentTimestamp = Date.now();
  const targetTimestamp = Date.parse(timestamp);
  const timeDiff = currentTimestamp - targetTimestamp;

  // Constants for time conversions
  const secondsInMs = 1000;
  const minutesInMs = secondsInMs * 60;
  const hoursInMs = minutesInMs * 60;
  const daysInMs = hoursInMs * 24;
  const weeksInMs = daysInMs * 7;
  const monthsInMs = daysInMs * 30.436875; // Average number of days in a month (365.25 / 12)
  const yearsInMs = daysInMs * 365.25; // Average number of days in a year

  if (timeDiff < secondsInMs) {
    const seconds = Math.floor(timeDiff / secondsInMs);
    return `${seconds} ${seconds === 1 ? "second" : "seconds"}`;
  } else if (timeDiff < minutesInMs) {
    const seconds = Math.floor(timeDiff / secondsInMs);
    return `${seconds} ${seconds === 1 ? "second" : "seconds"}`;
  } else if (timeDiff < hoursInMs) {
    const minutes = Math.floor(timeDiff / minutesInMs);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
  } else if (timeDiff < daysInMs) {
    const hours = Math.floor(timeDiff / hoursInMs);
    return `${hours} ${hours === 1 ? "hour" : "hours"}`;
  } else if (timeDiff < weeksInMs) {
    const days = Math.floor(timeDiff / daysInMs);
    return `${days} ${days === 1 ? "day" : "days"}`;
  } else if (timeDiff < monthsInMs) {
    const weeks = Math.floor(timeDiff / weeksInMs);
    return `${weeks} ${weeks === 1 ? "week" : "weeks"}`;
  } else if (timeDiff < yearsInMs) {
    const months = Math.floor(timeDiff / monthsInMs);
    return `${months} ${months === 1 ? "month" : "months"}`;
  } else {
    const years = Math.floor(timeDiff / yearsInMs);
    return `${years} ${years === 1 ? "year" : "years"}`;
  }
};

export const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const options = { day: "numeric", month: "long", year: "numeric" };
  const day = date.toLocaleString("en-US", { day: "numeric" });
  const suffix = getOrdinalSuffix(day);

  return date.toLocaleString("en-US", options).replace(day, day + suffix);
};

// ES7 function to extract time from datetime object and format it as '5:08 pm' or '11:23 am'
export const extractTime = (inputString) => {
  const datetimeObject = new Date(inputString);
  if (!(datetimeObject instanceof Date) || isNaN(datetimeObject)) {
    throw new Error("Invalid date object.");
  }

  const timeFormat = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return timeFormat.format(datetimeObject).toLowerCase();
};

export const formatDateInternational = (dateString) => {
  const dateObj = new Date(dateString);
  const options = { month: "long", day: "numeric", year: "numeric" };
  return new Intl.DateTimeFormat("en-US", options).format(dateObj);
};

export const formatDateInternationalMonthYear = (dateString) => {
  const options = { month: "long", year: "numeric" };
  const formattedDate = new Date(dateString).toLocaleDateString(
    "en-US",
    options
  );
  const [month, year] = formattedDate.split(" ");
  return `${month}, ${year}`;
};

export const getOrdinalSuffix = (day) => {
  if (day >= 11 && day <= 13) {
    return "th";
  }
  const lastDigit = day % 10;
  switch (lastDigit) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};
