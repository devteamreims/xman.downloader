import d from 'debug';
const debug = d('xman.downloader');
import dotenv from 'dotenv';
import rp from 'request-promise';
import fs from 'fs';


// Import stuff from .env
dotenv.config();

const refreshTime = 1000*5*60 || process.env.XMAN_CAPTURE_INTERVAL; // Download file every 5 minutes

const DEST_DIR = 'seq';

let customRequest = rp;

// Accept self signed certs
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

if(process.env.USE_PROXY) {
  debug('Using proxy');
  customRequest = rp.defaults({proxy: process.env.HTTP_PROXY});
}

const display = (data) => {
  debug(data);
  return data;
};

let fileNumber = 0;
const saveToFile = (data) => {
  const fileName = `${DEST_DIR}/xman_${fileNumber}.xml`;
  debug('Writing data to file ' + fileName);
  fileNumber++;
  return fs.writeFileSync(fileName, data);
}


const fetch = () => {
  return rp(process.env.XMAN_URL)
  .then(display)
  .then(saveToFile);
};

fetch().then(setInterval(fetch, refreshTime));

