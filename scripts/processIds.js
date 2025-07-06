// In scripts/processIds.js
const fs = require('fs');
const readline = require('readline');
const { ConvexHttpClient } = require("convex/browser");

// Initialize Convex client with your PRODUCTION deployment URL
const client = new ConvexHttpClient("https://fleet-albatross-818.convex.cloud");

async function processIds() {
  const ids = [];
  
  // Read the JSONL file
  const fileStream = fs.createReadStream('../documents47k/botany/documents.jsonl');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  // Add error handling
  fileStream.on('error', (error) => {
    console.error('Error reading file:', error);
  });

  // Add progress logging
  let count = 0;
  rl.on('line', (line) => {
    count++;
    if (count % 1000 === 0) {
      console.log(`Processed ${count} lines...`);
    }
  });

  // Collect all IDs
  for await (const line of rl) {
    try {
      const doc = JSON.parse(line);
      if (doc._id) {
        ids.push(doc._id);
      }
    } catch (e) {
      console.error('Error parsing line:', e);
    }
  }

  console.log(`Found ${ids.length} IDs`);

  // Shuffle the IDs
  const shuffledIds = ids.sort(() => Math.random() - 0.5);
  
  // Calculate 75% to delete
  const toDelete = Math.floor(ids.length * 0.75);
  const idsToDelete = shuffledIds.slice(0, toDelete);

  console.log(`Will delete ${toDelete} IDs`);

  // Process in batches of 100
  const BATCH_SIZE = 100;
  for (let i = 0; i < idsToDelete.length; i += BATCH_SIZE) {
    const batch = idsToDelete.slice(i, i + BATCH_SIZE);
    console.log(`Processing batch ${i/BATCH_SIZE + 1} of ${Math.ceil(idsToDelete.length/BATCH_SIZE)}`);
    try {
      await client.mutation("botany:deletePlants", { ids: batch });
      console.log(`Successfully deleted batch ${i/BATCH_SIZE + 1}`);
    } catch (error) {
      console.error(`Error deleting batch ${i/BATCH_SIZE + 1}:`, error);
    }
  }
}

processIds().catch(console.error);