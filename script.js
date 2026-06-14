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

 
  html5QrCode = new Html5Qrcode("preview");

  Html5Qrcode.getCameras().then(devices => {
    if (devices && devices.length) {
      const cameraId = devices[0].id;

      html5QrCode.start(
        cameraId,
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          sendDataToSheet(name, matric, session, decodedText);
          alert("Attendance recorded!");
          html5QrCode.stop();
        }
      );
    }
  });
}

function switchCamera() {
  alert("Auto camera switching handled automatically in this version.");
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
