const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection(useCustomDns) {
    if (useCustomDns) {
        console.log("Setting custom DNS servers 8.8.8.8 and 1.1.1.1...");
        const dns = require('dns');
        dns.setServers(['8.8.8.8', '1.1.1.1']);
    } else {
        console.log("Using default system DNS...");
    }

    try {
        console.log("Connecting to:", process.env.MONGO_URI);
        const start = Date.now();
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log(`Success! Connected in ${Date.now() - start}ms`);
        await mongoose.disconnect();
        return true;
    } catch (err) {
        console.error("Connection failed:", err.message);
        return false;
    }
}

async function run() {
    console.log("=== TEST 1: Default DNS ===");
    const res1 = await testConnection(false);
    
    console.log("\n=== TEST 2: Custom DNS ===");
    const res2 = await testConnection(true);
    
    process.exit(0);
}

run();
