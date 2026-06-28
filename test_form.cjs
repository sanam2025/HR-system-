const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function test() {
  const form = new FormData();
  form.append('full_name', 'Sana');
  form.append('email', 'sana@example.com');
  form.append('phone', '099999999');
  
  // Create a dummy file
  fs.copyFileSync('C:\\Windows\\System32\\drivers\\etc\\hosts', 'dummy.pdf');
  form.append('cv', fs.createReadStream('dummy.pdf'));
  
  // Test different skill array formats
  form.append('skills[0]', '1');

  try {
    const res = await axios.post('http://masarhr.alwaysdata.net/api/job-postings/7/apply', form, {
      headers: Object.assign(form.getHeaders(), { 'Accept': 'application/json' })
    });
    console.log('SUCCESS:', res.data);
  } catch (err) {
    console.log('STATUS:', err.response ? err.response.status : err.message);
    if (err.response) console.dir(err.response.data, {depth: null});
  }
}

test();
