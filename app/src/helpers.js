export function getImage(name) {
  return `/static/app/${name}`;
}

export function isEmptyObject(obj) {
  return obj && Object.keys(obj).length === 0 && Object.getPrototypeOf(obj) === Object.prototype;
}

function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.position = 'fixed';

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    const msg = successful ? 'successful' : 'unsuccessful';
    console.log(`Fallback: Copying text command was ${msg}`);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}

export function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(() => {
    console.log('Async: Copying to clipboard was successful!');
  }, (err) => {
    console.error('Async: Could not copy text: ', err);
  });
}

export function intToHexColorCode(num) {
  if (!num) {
    return null;
  }
  return `#${num.toString(16)}`;
}

export function hexColorCodeToInt(hex) {
  return parseInt(hex.substring(1), 16);
}

export function nearestWednesday() {
  const targetDayVal = 3; // Sunday - Saturday: 0 - 6
  const targetHour = 17;
  const targetMins = 30;

  const now = new Date();
  const day = now.getDay();
  const daysToTarget = targetDayVal - (day <= targetDayVal ? day : day - 7);

  const targetDay = new Date(+now);
  targetDay.setDate(targetDay.getDate() + daysToTarget);
  targetDay.setHours(targetHour, targetMins, 0, 0);

  // const totalMillisecondsToTarget = targetDay - now;
  // const hoursToTarget = Math.floor((totalMillisecondsToTarget / (1000 * 60 * 60)) % 24);
  // const minutesToTarget = Math.floor((totalMillisecondsToTarget / (1000 * 60)) % 60);
  // const secondsToTarget = Math.floor((totalMillisecondsToTarget / 1000) % 60);
  // const millisecondsToTarget = Math.floor(totalMillisecondsToTarget % 1000);

  // const data = {
  //   daysToTarget,
  //   hoursToTarget,
  //   minutesToTarget,
  //   secondsToTarget,
  //   millisecondsToTarget,
  // };

  return targetDay;
}
