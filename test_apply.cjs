const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

// Write a proper minimal PDF
fs.writeFileSync('real_test.pdf', '%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>\nendobj\nxref\n0 4\n0000000000 65535 f \n0000000015 00000 n \n0000000068 00000 n \n0000000125 00000 n \ntrailer\n<< /Size 4 /Root 1 0 R >>\nstartxref\n230\n%%EOF');

async function testApply() {
  const fd = new FormData();
  // Put CV FIRST before other fields
  const pdfBuffer = fs.readFileSync('real_test.pdf');
  fd.append('CV', pdfBuffer, {
    filename: 'cv.pdf',
    contentType: 'application/pdf',
    knownLength: pdfBuffer.length
  });
  fd.append('full_name', 'Sana Test');
  fd.append('email', 'sana@test.com');
  fd.append('phone', '0999999999');
  fd.append('skill_ids[]', '1');

  try {
    const res = await axios.post(
      'http://masarhr.alwaysdata.net/api/job-postings/7/apply',
      fd,
      {
        headers: {
          ...fd.getHeaders(),
          'Accept': 'application/json'
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }
    );
    console.log('SUCCESS:', res.data);
  } catch (err) {
    console.log('STATUS:', err.response?.status);
    console.log('RESPONSE:', JSON.stringify(err.response?.data));
    // Log what we sent
    console.log('Headers sent:', fd.getHeaders());
  }
}

testApply();
