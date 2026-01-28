require("dotenv").config();
const fs = require('fs').promises;
const path = require('path');

const baseUrl = process.env.baseUrl;

async function sendBatchRequest(batch, authToken) {
    try {
        const response = await fetch(`${baseUrl}/contacts/update`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${authToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(batch)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error Response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
        }

        const result = await response.json();
        return result;
        
    } catch (error) {
        console.error('Error sending batch request:', error);
        throw error;
    }
}

async function sendAllRequests(authToken) {
    try {
        // Ensure results folder exists
        await fs.mkdir('results', { recursive: true });
        
        const jsonContent = await fs.readFile('jsonToPost.json', 'utf8');
        const batches = JSON.parse(jsonContent);
        
        console.log(`Processing ${batches.length} batches...`);
        
        const results = [];
        
        for (let i = 0; i < batches.length; i++) {
            const batch = batches[i];
            console.log(`Sending batch ${i + 1}/${batches.length} with ${batch.items.length} items`);
            
            try {
                const result = await sendBatchRequest(batch, authToken);
                
                // Save response to file
                const responseFile = path.join('results', `batch_${i + 1}_response.json`);
                await fs.writeFile(responseFile, JSON.stringify(result, null, 2));
                
                results.push({ batch: i + 1, status: 'success', result });
                console.log(`Batch ${i + 1} completed successfully - response saved to ${responseFile}`);
                
                if (i < batches.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                
            } catch (error) {
                // Save error to file
                const errorFile = path.join('results', `batch_${i + 1}_error.json`);
                await fs.writeFile(errorFile, JSON.stringify({
                    error: error.message,
                    batch: batch,
                    timestamp: new Date().toISOString()
                }, null, 2));
                
                results.push({ batch: i + 1, status: 'error', error: error.message });
                console.error(`Batch ${i + 1} failed: ${error.message} - error saved to ${errorFile}`);
            }
        }

        const successful = results.filter(r => r.status === 'success').length;
        const failed = results.filter(r => r.status === 'error').length;
        
        console.log(`\nSummary: ${successful} successful, ${failed} failed batches`);
        
        return results;
        
    } catch (error) {
        console.error('Error in sendAllRequests:', error);
        throw error;
    }
}

module.exports = { sendAllRequests };