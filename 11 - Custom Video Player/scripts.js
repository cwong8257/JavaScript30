const videoEl = document.querySelector('video')
const playButton = document.querySelector('.player__button.toggle')
const volumeSlider = document.querySelector('.player__slider[name=volume]')
const playbackRateSlider = document.querySelector('.player__slider[name=playbackRate]')
const progressBar = document.querySelector('.progress')
const playerChangeRateButtons = document.querySelectorAll('.player__button[data-skip]')
const root = document.documentElement
let animationId
let isSeeking = false

playButton.addEventListener('click', handlePlayPause)
volumeSlider.addEventListener('input', handleChangeVolume)
playbackRateSlider.addEventListener('input', handleChangePlaybackRate)
progressBar.addEventListener('mousedown', handleMouseDownProgressBar)
document.addEventListener('mouseup', handleMouseUp)
progressBar.addEventListener('mousemove', handleMouseMoveProgressBar)
videoEl.addEventListener('timeupdate', handleTimeUpdate)

for (const playerChangeRateButton of playerChangeRateButtons) {
  playerChangeRateButton.addEventListener('click', handleChangePlabackProgress)
}

// HELPERS

function handleTimeUpdate () {
  const progress = this.currentTime / this.duration
  const progressPercentage = `${progress * 100}%`
  root.style.setProperty('--progress-bar-width', progressPercentage)
}

function handleMouseMoveProgressBar (e) {
  if (!isSeeking) return

  const rect = this.getBoundingClientRect()
  const percentage = (e.clientX - rect.left) / (rect.right - rect.left)
  const newTime = videoEl.duration * percentage
  videoEl.currentTime = newTime
}

function handleMouseUp () {
  isSeeking = false
}

function handleMouseDownProgressBar (e) {
  const rect = this.getBoundingClientRect()
  const percentage = (e.clientX - rect.left) / (rect.right - rect.left)
  const newTime = videoEl.duration * percentage
  videoEl.currentTime = newTime

  isSeeking = true
}

function handleChangePlabackProgress () {
  videoEl.currentTime += parseFloat(this.dataset.skip)
}

function handlePlayPause () {
  if (videoEl.paused) {
    videoEl.play()
    this.textContent = '■'
  } else {
    videoEl.pause()
    this.textContent = '►'
  }
}

function handleChangeVolume () {
  videoEl.volume = this.value
}

function handleChangePlaybackRate () {
  videoEl.playbackRate = this.value
}
