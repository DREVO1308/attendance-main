let html5QrCode;
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

  html5QrCode = new Html5Qrcode("preview");

  Html5Qrcode.getCameras().then(devices => {
    cameras = devices;

    if (devices.length > 0) {

      const rearCamera =
        devices.find(device =>
          device.label.toLowerCase().includes('back') ||
          device.label.toLowerCase().includes('rear') ||
          device.label.toLowerCase().includes('environment')
        ) || devices[devices.length - 1];

      currentCameraIndex = devices.indexOf(rearCamera);

      html5QrCode.start(
        rearCamera.id,
        {
          fps: 10,
          qrbox: 250
        },
        onScanSuccess
      );

    } else {
      alert("No camera found.");
    }
  }).catch(err => {
    console.error(err);
    alert("Camera error: " + err);
  });
}

function onScanSuccess(decodedText) {
  const name = document.getElementById('name').value;
  const matric = document.getElementById('matric').value;
  const session = document.getElementById('session').value;

  sendDataToSheet(name, matric, session, decodedText);

  alert("Attendance recorded!");

  html5QrCode.stop().then(() => {
    html5QrCode.clear();
  }).catch(err => {
    console.error(err);
  });
}

function switchCamera() {
  if (cameras.length < 2) {
    alert("Only one camera available.");
    return;
  }

  html5QrCode.stop().then(() => {

    currentCameraIndex =
      (currentCameraIndex + 1) % cameras.length;

    html5QrCode.start(
      cameras[currentCameraIndex].id,
      {
        fps: 10,
        qrbox: 250
      },
      onScanSuccess
    );

  }).catch(err => {
    console.error(err);
  });
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
    {
      method: 'GET',
      mode: 'no-cors'
    }
  )
  .then(() => {
    console.log("Attendance sent successfully");
  })
  .catch(error => {
    console.error('Error:', error);
  });
}