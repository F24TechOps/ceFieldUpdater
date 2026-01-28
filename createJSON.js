const fs = require('fs').promises;
const path = require('path');

async function createJSON(fieldsToClear) {
    try {
        // Read IDs from inputData.txt
        const inputData = await fs.readFile('inputData.txt', 'utf8');
        const ids = inputData
            .split(/\r?\n/)
            .map(id => id.trim())
            .filter(id => id.length > 0);

        if (ids.length === 0) {
            throw new Error('No IDs found in inputData.txt');
        }

        // Create batches of up to 100 items each
        const batches = [];
        for (let i = 0; i < ids.length; i += 100) {
            const batchIds = ids.slice(i, i + 100);
            
            const items = batchIds.map(id => {
                const fields = {};
                fieldsToClear.forEach(field => {
                    fields[field] = null;
                });

                return {
                    id: id,
                    fields: fields
                };
            });

            batches.push({ items: items });
        }

        // Write batches to jsonToPost.json
        await fs.writeFile('jsonToPost.json', JSON.stringify(batches, null, 2));
        
        console.log(`Created ${batches.length} batches with ${ids.length} total IDs`);
        return batches;
        
    } catch (error) {
        console.error('Error creating JSON:', error);
        throw error;
    }
}

module.exports = { createJSON };