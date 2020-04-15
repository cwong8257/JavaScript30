const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const rangeInputEls = Array.from(document.querySelectorAll('.rgb input[type=range]'))

const savedImages = []

getCameraStream()
  .then(streamCameraToVideo)
  .then(setupCanvas)
  .then(drawImageToCanvas)
  .catch((err) => {
    console.warn(err)
  })

function getCameraStream  () {
  return navigator.mediaDevices.getUserMedia({ audio: false, video: true })
}

function streamCameraToVideo (videoStream) {
  video.srcObject = videoStream
  return video.play()
}

function setupCanvas () {
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
}

function drawImageToCanvas () {
  setInterval(() => {
    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)
    // get canvas image
    const imageData = ctx.getImageData(0, 0, video.videoWidth, video.videoHeight)
    // apply filters
    applyGreenScreen(imageData.data)
    // set canvas image
    ctx.putImageData(imageData, 0, 0)
  }, 100)
}

function applyGreenScreen (channels) {
  const levels = {}

  rangeInputEls.forEach((rangeInputEl) => levels[rangeInputEl.name] = rangeInputEl.value)

  for (let i = 0; i < channels.length; i += 4) {
    const red = channels[i]
    const green = channels[i + 1]
    const blue = channels[i + 2]

    if (red >= levels.rmin
      && red <= levels.rmax
      && green >= levels.gmin
      && green <= levels.gmax
      && blue >= levels.bmin
      && blue <= levels.bmax) {
        channels[i + 3] = 0
      }
  }
}

async function takePhoto () {
  // play audio
  snap.currentTime = 0
  await snap.play()

  // save image
  const imageData = canvas.toDataURL()
  savedImages.push(imageData)

  // render image
  strip.innerHTML += `
    <a href="${imageData}" download="handsome">
      <img src="${imageData}" class="photo" >
    </a>
  `
}
