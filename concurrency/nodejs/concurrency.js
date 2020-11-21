"use strict";

const {createLogger, format, transports} = require("winston");
const {combine, timestamp, json, simple} = format;
const logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(timestamp(), simple()),
  transports: [new transports.Console()]
});


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randomNumber(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function worker(i) {
  let nap = randomNumber(1000, 5000);
  logger.info(`Starting worker ${i} (cycle: ${nap} ms)`);
  for (let j = 0; j < 5; j++) {
    logger.info(`Work from worker ${i}`);
    await sleep(nap);
  }
  logger.info(`Finished worker ${i}`);
}

(async () => {
  logger.info("Starting test");
  let promises = Array.from({length: 10}, (_, i) => worker(i));
  logger.info("Promises created, waiting for them");
  await Promise.all(promises);
  logger.info("All promises have completed execution");
  logger.info("Ending test");
})();
