const shell = require('electron').shell;

class Utils {
  /** Overrides original event and opens URL in default browser */
  static _openInDefaultBrowser(evt) {
    evt.preventDefault();
    shell.openExternal(evt.target.href);
  }

  /** Create anchor tag for URLs and opens in default browser */
  static anchorTag(href) {
    if (href) {
      return `<a href="${href}" onclick="Utils._openInDefaultBrowser(event)">${href}</a>`;
    }
    return '';
  }

  /**
   * Map each row to the given attribute value, and sanitize invalid values.
   *
   * This method is needed for two reasons:
   * 1) It converts null data (this includes empty arrays) to 'No Value Detected'
   * 2) It grabs the particular attribute from the value which represents a row
   *    in the database
   */
  static getAttributeValues(values, attribute) {
    const validatedValues = [];
    let attributeValue = null;

    for (let i = 0; i < values.length; i++) {
      attributeValue = values[i][attribute];

      if (!Array.isArray(attributeValue) || attributeValue.length === 0) {
        attributeValue = [attributeValue];
      }

      for (let j = 0; j < attributeValue.length; j++) {
        validatedValues.push(
          Utils.isValid(attributeValue[j]) ?
            attributeValue[j] : 'No Value Detected');
      }
    }
    return validatedValues;
  }

  static isValid(value) {
    if (Array.isArray(value)) {
      return value.length > 0 &&
                value.every((element) => Utils.isValid(element));
    } else {
      return value !== null;
    }
  }

  /**
   * Opens a dialog to choose a file to open.
   *
   * @returns Promise with the name of the file to open.
   */
  static showOpenDialog(dialog, config) {
    return new Promise((resolve) => {
      dialog.showOpenDialog(config, fileNames => {
        resolve(fileNames || fileNames[0]);
      });
    });
  }

  /**
   * Opens a dialog to choose a file to save to.
   *
   * @returns Promise with the name of the file to save to.
   */
  static showSaveDialog(dialog, config) {
    return new Promise(resolve => {
      dialog.showSaveDialog(config, newFileName => {
        resolve(newFileName);
      });
    });
  }
}

module.exports = Utils;