let scanner;

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
    // Send data to Google Sheets immediately after scanning
    sendDataToSheet(name, matric, session, content);
    alert('Attendance recorded!');
    scanner.stop(); // Stop scanning after successful submission
  });

  // Choose correct camera (rear if available on phones)
  Instascan.Camera.getCameras().then(function (cameras) {
    if (cameras.length > 1) {
      // Prefer rear camera (usually at index 1)
      scanner.start(cameras[1]);
    } else if (cameras.length > 0) {
      scanner.start(cameras[0]);
    } else {
      alert('No cameras found.');
    }
  }).catch(function (e) {
    console.error(e);
    alert('Camera access failed.');
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
