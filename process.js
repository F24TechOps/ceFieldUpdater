const { createJSON } = require('./createJSON');
const { getToken, setReadlineInterface } = require('./getToken');
const { sendAllRequests } = require('./sendRequest');

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}

async function main() {
    try {
        console.log('Field Nuller - Clear fields from contacts\n');
        console.log('IMPORTANT: Ensure your contact IDs are in inputData.txt (one ID per line)\n');
        
        setReadlineInterface(rl);
        authToken = await getToken();
        console.log('Token retrieved successfully\n');
        
        const fieldsInput = await askQuestion('Enter field names to clear (comma-separated): ');
        
        if (!fieldsInput || fieldsInput.trim() === '') {
            console.error('Error: At least one field name must be provided');
            rl.close();
            process.exit(1);
        }
        
        const fieldsToClear = fieldsInput.split(',').map(field => field.trim()).filter(field => field.length > 0);
        
        if (fieldsToClear.some(field => !field || field.trim() === '')) {
            console.error('Error: Field names cannot be empty');
            rl.close();
            process.exit(1);
        }
        
        console.log(`\nFields to clear: ${fieldsToClear.join(', ')}`);
        
        const confirm = await askQuestion('\nContinue? (y/n): ');
        if (confirm.toLowerCase() !== 'y') {
            console.log('Operation cancelled');
            rl.close();
            process.exit(0);
        }
        
        const batches = await createJSON(fieldsToClear);
        console.log('JSON creation completed');
        
        const results = await sendAllRequests(authToken);
        console.log('All requests completed');
        
        rl.close();
        
    } catch (error) {
        console.error('Error:', error);
        rl.close();
        process.exit(1);
    }
}

main();