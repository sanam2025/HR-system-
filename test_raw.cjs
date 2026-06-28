const https = require('https');

const boundary = 'xBoundary123';

function makeField(name, value) {
  return `--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`;
}

function makePdfField(name, filename, content) {
  return `--${boundary}\r\nContent-Disposition: form-data; name="${name}"; filename="${filename}"\r\nContent-Type: application/pdf\r\n\r\n${content}\r\n`;
}

// Minimal valid PDF bytes
const pdfContent = '%PDF-1.4\n1 0 obj\n<</Type /Catalog>>\nendobj\nxref\n0 2\n0000000000 65535 f\n0000000015 00000 n\ntrailer\n<</Size 2/Root 1 0 R>>\nstartxref\n99\n%%EOF';

const body = [
  makeField('full_name', 'Test Sana'),
  makeField('email', 'sana@example.com'),
  makeField('phone', '0999999999'),
  makeField('skills[]', '1'),
  makeField('skills[]', '2'),
  makePdfField('cv', 'cv.pdf', pdfContent),
  `--${boundary}--\r\n`,
].join('');

const opts = {
  hostname: 'masarhr.alwaysdata.net',
  port: 443,
  path: '/api/job-postings/7/apply',
  method: 'POST',
  headers: {
    'Content-Type': `multipart/form-data; boundary=${boundary}`,
    'Accept': 'application/json',
    'Content-Length': Buffer.byteLength(body, 'binary'),
  }
};

const req = https.request(opts, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => console.log('STATUS:', res.statusCode, '\nDATA:', d));
});
req.on('error', e => console.error(e));
req.write(body, 'binary');
req.end();
