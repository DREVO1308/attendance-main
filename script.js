let html5QrCode;

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

      // try back camera first
      let cameraId = devices[0].id;

      html5QrCode.start(
        cameraId,
        {
          fps: 10,
          qrbox: 250
        },
        (decodedText) => {
          console.log("QR DETECTED:", decodedText)
          sendDataToSheet(name, matric, session, decodedText);
          alert("Attendance recorded!");

          html5QrCode.stop().then(() => {
            html5QrCode.clear();
          });
        }
      );
    }
  }).catch(err => {
    console.error("Camera error:", err);
    alert("Camera access failed: " + err);
  });
}

function switchCamera() {
  alert("Camera switching will be added next (optional upgrade).");
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

  console.log(data);

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
