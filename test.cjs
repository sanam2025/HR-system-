const axios = require('axios');

async function test() {
  try {
    const res = await axios.post('http://masarhr.alwaysdata.net/api/job-requisitions', {
      job_title: 'Test',
      description: 'Test desc',
      experience: 2,
      skills: [1]
    }, {
      headers: {
        'Authorization': 'Bearer 6|kd5AHpNWWFqykkNeKGovVMtB3Qe660vNxaani3sG364f143a',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    console.log('SUCCESS:', res.data);
  } catch (err) {
    console.log('STATUS:', err.response ? err.response.status : err.message);
    console.log('DATA:', err.response ? err.response.data : '');
  }
}

test();
