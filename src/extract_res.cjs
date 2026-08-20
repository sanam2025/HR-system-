const fs = require('fs');
const data = JSON.parse(fs.readFileSync('C:\\Ahmad\\sana\\HR-system-\\src\\Masar-HR.postman_collection.json', 'utf8'));

function findResignations(items) {
    if (!items) return;
    for (const item of items) {
        if (item.request && item.request.url && item.request.url.raw) {
            if (item.request.url.raw.includes('resignation')) {
                console.log(item.name);
                console.log(item.request.method + ' ' + item.request.url.raw);
                console.log('---');
            }
        }
        if (item.item) {
            findResignations(item.item);
        }
    }
}

findResignations(data.item);
