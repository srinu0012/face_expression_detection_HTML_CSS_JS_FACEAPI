let video = document.getElementById('video')


Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('face_expression_detection_HTML_CSS_JS_FACEAPI/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('face_expression_detection_HTML_CSS_JS_FACEAPI/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('face_expression_detection_HTML_CSS_JS_FACEAPI/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('face_expression_detection_HTML_CSS_JS_FACEAPI/models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  }, 100)
})


