/**
 * Copyright reelyActive 2023
 * We believe in an open Internet of Things
 */


const HTTP_STATUS_OK = 200;
const HTTP_STATUS_BAD_REQUEST = 400;
const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;
const TERMINATOR_CHARACTER = '0a';
const CLEAR_COMMAND_BYTE = 'ff';
const SHOW_COMMAND_BYTE = 'aa';


/**
 * BindicatorsManager Class
 * Manages the LED strips.
 */
class BindicatorsManager {

  /**
   * BindicatorsManager constructor
   * @param {Object} options The options as a JSON object.
   * @param {ConfigManager} config The config manager.
   * @param {SerialManager} serial The serial manager.
   * @constructor
   */
  constructor(options, config, serial) {
    let self = this;
    options = options || {};
    self.config = config;
    self.serial = serial;
  }

  /**
   * Update the bindicator settings.
   * @param {Object} settings The bindicator settings
   * @param {callback} callback Function to call on completion
   */
  update(settings, callback) {
    let self = this;

    // TODO

    return callback(HTTP_STATUS_OK, {});
  }

}


/**
 * Create the command to show a single strip.
 * @param {String} strip The strip id as a hexadecimal string
 */
function createShowCommand(strip) {
  return (SHOW_COMMAND_BYTE + strip).padEnd(12, '0') + TERMINATOR_CHARACTER;
}


/**
 * Create the command to clear a single strip.
 * @param {String} strip The strip id as a hexadecimal string
 */
function createClearCommand(strip) {
  return (CLEAR_COMMAND_BYTE + strip).padEnd(12, '0') + TERMINATOR_CHARACTER;
}


module.exports = BindicatorsManager;
