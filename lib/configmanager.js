/**
 * Copyright reelyActive 2023
 * We believe in an open Internet of Things
 */


const fs = require('fs');


const CONFIG_DIRECTORY = './config';


/**
 * ConfigManager Class
 * Manages the configuration by reading and interpreting any config files.
 */
class ConfigManager {

  /**
   * ConfigManager constructor
   * @param {Object} options The options as a JSON object.
   * @constructor
   */
  constructor(options) {
    options = options || {};
    let self = this;

    // The config object will continue to update until all files are read
    readConfigFiles((config) => { self.config = config; });
  }

}


/**
 * Read the config files into memory.
 * @param {function} callback The function to call on completion.
 */
function readConfigFiles(callback) {
  let config = { carts: new Map() };

  fs.readdir(CONFIG_DIRECTORY, (err, files) => {
    if(err) {
      console.log('neopixel-serial-bindicators error reading config:', err);
    }
    else if(Array.isArray(files)) {
      files.forEach((filename) => {
        let path = CONFIG_DIRECTORY + '/' + filename;
        let isStrips = filename.startsWith('strips-') &&
                       filename.endsWith('.csv');

        if(isStrips) {
          let stripName = filename.substring(7, filename.length - 4);
          let stripId = Number.parseInt(stripName);
          readStripsFile(stripId, path, config);
        }
      });
    }

    return callback(config);
  });
}


/**
 * Read a single strips-x.csv file into memory.
 * @param {Number} stripId The id of the strip.
 * @param {String} path The path to the csv file.
 * @param {Object} config The configuration object to update.
 */
function readStripsFile(stripId, path, config) {
  fs.readFile(path, 'utf8', (err, data) => {
    let lines = data.split('\n');

    // Loop through each line
    lines.forEach((line, index) => {
      let isIgnoredLine = (index === 0);

      if(!isIgnoredLine) {
        let entries = line.split(',');
        let cartName, shelfId, shelfWidth, stripOffset, stripLength, isReverse;
        let binOffsets = [];

        // Loop through each entry
        entries.forEach((entry, index) => {
          let entryValue = parseEntryString(entry);

          switch(index) {
            case 0:
              cartName = entryValue;
              break;
            case 1:
              shelfId = entryValue;
              break;
            case 2:
              shelfWidth = entryValue;
              break;
            case 3:
              stripOffset = entryValue;
              break;
            case 4:
              stripLength = entryValue;
              break;
            case 5:
              isReverse = entryValue;
              break;
            default:
              binOffsets.push(entryValue);
          }
        });

        let isNewCart = !config.carts.has(cartName);
        if(isNewCart) {
          config.carts.set(cartName, { shelves: new Map() });
        }
        let cart = config.carts.get(cartName);
        let shelf = { shelfWidth: shelfWidth, stripId: stripId,
                      stripOffset: stripOffset, stripLength: stripLength,
                      isReverse: isReverse, binOffsets: binOffsets };
        cart.shelves.set(shelfId, shelf);
      }
    });
  });
}


/**
 * Parse a CSV entry into the appropriate type.
 * @param {String} entry The CSV entry as a String.
 */
function parseEntryString(entry) {
  if(entry.startsWith('"') && entry.endsWith('"')) {
    return entry.replaceAll('"', '');
  }
  else if(entry === 'true') {
    return true;
  }
  else if(entry === 'false') {
    return false;
  }
  else {
    return Number.parseInt(entry);
  }
}


module.exports = ConfigManager;