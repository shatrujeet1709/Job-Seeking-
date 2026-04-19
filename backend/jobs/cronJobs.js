const cron             = require('node-cron');
const { runScraper }   = require('../services/jobScraper.service');
const mongoose = require('mongoose');

// Run every 2 hours
cron.schedule('0 */2 * * *', () => {
  console.log('⏰ Cron: fetching fresh jobs...');
  // Only run if DB is connected
  if(mongoose.connection.readyState === 1) {
    runScraper();
  }
});

// We'll export a function to run it once on startup, but give DB time to connect
exports.startCronJobs = () => {
    setTimeout(() => {
        if(mongoose.connection.readyState === 1) {
            console.log('⏰ Running initial job scrape...');
            runScraper();
        }
    }, 5000); // Wait 5s for DB connection
};
