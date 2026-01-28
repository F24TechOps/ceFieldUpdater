const { createJSON } = require('./createJSON');
const { getToken } = require('./getToken');
const { sendAllRequests } = require('./sendRequest');

// Parse command line arguments for field names
const args = process.argv.slice(2);
let fieldsToClear;

if (args.length === 0) {
    console.log('Usage: node process.js <field1,field2,field3,...>');
    console.log('Example: node process.js "zxt2mvb6y7,anotherField,thirdField"');
    console.log('Or provide fields as separate arguments: node process.js zxt2mvb6y7 anotherField thirdField');
    process.exit(1);
}

// Handle both comma-separated and separate arguments
if (args.length === 1 && args[0].includes(',')) {
    fieldsToClear = args[0].split(',').map(field => field.trim());
} else {
    fieldsToClear = args;
}

// Validate field names
if (fieldsToClear.some(field => !field || field.trim() === '')) {
    console.error('Error: Field names cannot be empty');
    process.exit(1);
}

console.log(`Fields to clear: ${fieldsToClear.join(', ')}`);

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
        process.exit(1);
    }
}

main();