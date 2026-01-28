const { createJSON } = require('./createJSON');
const { getToken } = require('./getToken');
const { sendAllRequests } = require('./sendRequest');

const fieldsToClear = ["zxt2mvb6y7"];
let authToken;

async function main() {
    try {
        authToken = await getToken();
        console.log('Token retrieved successfully');
        
        const batches = await createJSON(fieldsToClear);
        console.log('JSON creation completed');
        
        const results = await sendAllRequests(authToken);
        console.log('All requests completed');
        
    } catch (error) {
        console.error('Error:', error);
    }
}

main();