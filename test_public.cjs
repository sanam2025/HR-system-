const axios = require('axios');

async function test() {
  try {
    const res = await axios.get('http://masarhr.alwaysdata.net/api/job-postings', {
      headers: {
        'Accept': 'application/json'
      }
    });
    console.log('GET /job-postings SUCCESS:', res.status, typeof res.data === 'string' ? res.data.substring(0, 100) : res.data);
  } catch (err) {
    console.log('GET /job-postings STATUS:', err.response ? err.response.status : err.message);
  }

  try {
    const res = await axios.post('http://masarhr.alwaysdata.net/api/candidates', { full_name: "Test User", email: "test@test.com", phone: "099999999", cover_letter: "Hello", cv: "none" }, {
      headers: {
        'Accept': 'application/json'
      }
    });
    console.log('POST /apply SUCCESS:', res.status);
  } catch (err) {
    console.log('POST /apply STATUS:', err.response ? err.response.status : err.message);
    if (err.response) console.log('DATA:', err.response.data);
  }
}

test();
