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

export function range(max) {
  const nums = [];
  for (let i = 0; i < max; i++) {
    nums.push(i);
  }
  return nums;
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

export function timeToRumbleSignupClose() {
  const targetDayVal = 4; // Sunday - Saturday: 0 - 6
  const targetHour = 20;
  const targetMins = 0;

  const now = new Date();
  const day = now.getDay();
  const daysToTarget = (7 + targetDayVal - day) % 7;

  const targetDay = new Date(+now);
  targetDay.setDate(targetDay.getDate() + daysToTarget);
  targetDay.setHours(targetHour, targetMins, 0, 0);

  return targetDay;
}

export function rumbleTeamPlayers(team) {
  console.log(team);
  return [
    team.rumble_top,
    team.rumble_jg,
    team.rumble_mid,
    team.rumble_adc,
    team.rumble_supp,
  ];
}
