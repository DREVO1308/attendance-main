let scanner;
let cameras = [];
let currentCameraIndex = 0;

function startScan() {
  const name = document.getElementById('name').value;
  const matric = document.getElementById('matric').value;
  const session = document.getElementById('session').value;

  if (!name || !matric || !session) {
    alert('Please fill all fields before scanning.');
    return;
  }

  scanner = new Instascan.Scanner({ video: document.getElementById('preview') });

  scanner.addListener('scan', function (content) {
    sendDataToSheet(name, matric, session, content);
    alert('Attendance recorded!');
    scanner.stop();
  });

  Instascan.Camera.getCameras().then(function (availableCameras) {
    if (availableCameras.length > 0) {
      cameras = availableCameras;
      scanner.start(cameras[currentCameraIndex]);
    } else {
      console.error('No cameras found.');
      alert('No camera found on this device.');
    }
  }).catch(function (e) {
    console.error(e);
    alert('Error accessing camera: ' + e);
  });
}

function switchCamera() {
  if (cameras.length > 1) {
    currentCameraIndex = (currentCameraIndex + 1) % cameras.length;
    scanner.start(cameras[currentCameraIndex]);
  } else {
    alert('No alternate camera available');
  }
}

function sendDataToSheet(name, matric, session, qrContent) {
  const url = 'https://script.google.com/macros/s/AKfycbwHdk0M_xC3Q3zymC1s9rVJs-b6SKj5b7Ym71h25-v3qcHQJZrR72lB-yFOc44UnOY/exec';

  const data = {
    name: name,
    matric: matric,
    session: session,
    qrCode: qrContent,
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString()
  };

  fetch(
    url +
      '?name=' + encodeURIComponent(data.name) +
      '&matric=' + encodeURIComponent(data.matric) +
      '&session=' + encodeURIComponent(data.session) +
      '&qrCode=' + encodeURIComponent(data.qrCode) +
      '&date=' + encodeURIComponent(data.date) +
      '&time=' + encodeURIComponent(data.time),
    { method: 'GET' }
  )
  .then(response => response.json())
  .then(responseData => {
    console.log('Success:', responseData);
  })
  .catch(error => {
    console.error('Error:', error);
  });
}
