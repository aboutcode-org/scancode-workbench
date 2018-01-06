const shell = require("electron").shell;

class Utils {
    // Overrides original event and opens URL in default browser
    static _openInDefaultBrowser(evt) {
        evt.preventDefault();
        shell.openExternal(evt.target.href);
    }

    // Create anchor tag for URLs and opens in default browser
    static anchorTag(href) {
        if (href) {
            return `<a href="${href}" onclick="Utils._openInDefaultBrowser(event)">${href}</a>`;
        }
        return "";
    }
}

module.exports = Utils;