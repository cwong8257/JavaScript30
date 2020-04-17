const timerControlsEl = document.querySelector('.timer__controls')
const timeLeftEl = document.querySelector('.display__time-left')
const endTimeEl = document.querySelector('.display__end-time')
const customTimeFormEl = document.querySelector('#custom')
const minutesInputEl = customTimeFormEl.querySelector('[name=minutes]')

timerControlsEl.addEventListener('click', handleClickTimerControls)
customTimeFormEl.addEventListener('submit', handleSubmitCustomTime)

let endTime

function handleSubmitCustomTime (e) {
  e.preventDefault()


  startCountdown(minutesInputEl.value * 60)
}

function handleClickTimerControls (e) {
  if (!e.target.matches('.timer__button')) return

  startCountdown(e.target.dataset.time)
}

function startCountdown (timeInSeconds) {
  const currentTime = Date.now()
  endTime = currentTime + (timeInSeconds * 1000)
  endTimeEl.textContent = `Be back at ${getEndTimeString(endTime)}`

  renderTimer(currentTime)
}

function renderTimer (currentTime = Date.now()) {
  const timeLeftInMilliseconds = endTime - currentTime

  if (timeLeftInMilliseconds <= 0) {
    timeLeftEl.textContent = '0:00'
    return cancelAnimationFrame(renderTimer)
  }

  timeLeftEl.textContent = getTimeLeftString(timeLeftInMilliseconds)

  requestAnimationFrame(() => renderTimer())
}

function getTimeLeftString (timeLeftInMilliseconds) {
  let timeLeftInSeconds = timeLeftInMilliseconds / 1000
  const hours = Math.floor(timeLeftInSeconds / 3600) % 12
  timeLeftInSeconds = timeLeftInSeconds % 3600
  const minutes = Math.floor(timeLeftInSeconds / 60)
  timeLeftInSeconds = Math.ceil(timeLeftInSeconds) % 60
  const time = []
  
  if (hours > 0) {
    time.push(hours)
    time.push(leftPad(minutes))
  } else {
    time.push(minutes)
  }

  time.push(leftPad(timeLeftInSeconds))

  return time.join(':')
}

function getEndTimeString (endTime) {
  const endDate = new Date(endTime)
  const hours = endDate.getHours() % 12
  const minutes = endDate.getMinutes()

  return `${hours}:${leftPad(minutes)}`
}

function leftPad (num) {
  let numString = num.toString()

  while (numString.length < 2) {
    numString = '0' + numString
  }

  return numString
}