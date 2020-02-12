import { TextMetrics } from 'pixi.js';

export function PIXITextMetricsPlugIn() {
    const WordWrap = TextMetrics.wordWrap;
    TextMetrics.__breakAllWordWrap = __breakAllWordWrap;

    TextMetrics.wordWrap = function(text, style, canvas = TextMetrics._canvas) {
        return style.wordBreakAll ? TextMetrics.__breakAllWordWrap(text, style, canvas) : WordWrap(text, style, canvas);
    };

    /**
     *
     * @param text
     * @param {PIXI.TextStyle | PIXITextStyle} style
     * @param canvas
     * @return {string}
     * @private
     */
    function __breakAllWordWrap(text, style, canvas) {
        const context = canvas.getContext('2d');

        let width = 0;
        let line = '';
        let lines = '';

        const cache = {};
        const { letterSpacing, whiteSpace } = style;

        // How to handle whitespaces
        const collapseSpaces = TextMetrics.collapseSpaces(whiteSpace);
        const collapseNewlines = TextMetrics.collapseNewlines(whiteSpace);

        // whether or not spaces may be added to the beginning of lines
        let canPrependSpaces = !collapseSpaces;

        // There is letterSpacing after every char except the last one
        // t_h_i_s_' '_i_s_' '_a_n_' '_e_x_a_m_p_l_e_' '_!
        // so for convenience the above needs to be compared to width + 1 extra letterSpace
        // t_h_i_s_' '_i_s_' '_a_n_' '_e_x_a_m_p_l_e_' '_!_
        // ________________________________________________
        // And then the final space is simply no appended to each line
        const wordWrapWidth = style.wordWrapWidth + letterSpacing;

        // break text into words, spaces and newline chars
        const tokens = TextMetrics.tokenize(text);

        for (let i = 0; i < tokens.length; i++) {
            // get the word, space or newlineChar
            let token = tokens[i];

            // if word is a new line
            if (TextMetrics.isNewline(token)) {
                // keep the new line
                if (!collapseNewlines) {
                    lines += TextMetrics.addLine(line);
                    canPrependSpaces = !collapseSpaces;
                    line = '';
                    width = 0;
                    continue;
                }

                // if we should collapse new lines
                // we simply convert it into a space
                token = ' ';
            }

            // if we should collapse repeated whitespaces
            if (collapseSpaces) {
                // check both this and the last tokens for spaces
                const currIsBreakingSpace = TextMetrics.isBreakingSpace(token);
                const lastIsBreakingSpace = TextMetrics.isBreakingSpace(line[line.length - 1]);

                if (currIsBreakingSpace && lastIsBreakingSpace) {
                    continue;
                }
            }

            // get word width from cache if possible
            const tokenWidth = TextMetrics.getFromCache(token, letterSpacing, cache, context);

            // word is longer than desired bounds
            if (width + tokenWidth > wordWrapWidth) {
                const characters = token.split('');
                for (let j = 0; j < characters.length; j++) {
                    let char = characters[j];
                    const characterWidth = TextMetrics.getFromCache(char, letterSpacing, cache, context);
                    if (width + characterWidth > wordWrapWidth) {
                        //newLine
                        lines += TextMetrics.addLine(line);
                        canPrependSpaces = false;
                        line = '';
                        width = 0;
                    }
                    line += char;
                    width += characterWidth;
                }
            }

            // word could fit
            else {
                // word won't fit because of existing words
                // start a new line
                if (tokenWidth + width > wordWrapWidth) {
                    // if its a space we don't want it
                    canPrependSpaces = false;

                    // add a new line
                    lines += TextMetrics.addLine(line);

                    // start a new line
                    line = '';
                    width = 0;
                }

                // don't add spaces to the beginning of lines
                if (line.length > 0 || !TextMetrics.isBreakingSpace(token) || canPrependSpaces) {
                    // add the word to the current line
                    line += token;

                    // update width counter
                    width += tokenWidth;
                }
            }
        }

        lines += TextMetrics.addLine(line, false);

        return lines;
    }


    //createjs와 동일한 글씨 크기 측정을 위해
    /**
     *
     * @param {PIXI.TextStyle} style
     * @param text
     * @return {number}
     * @private
     */
    function _getMeasuredWidth(font, text) {
        const ctx = TextMetrics._context;
        ctx.save();
        ctx.font = font;
        var w = ctx.measureText(text).width;
        ctx.restore();
        return w;
    }

    //createjs와 동일한 글씨 크기 측정을 위해
    TextMetrics.measureText = function(text, style, wordWrap, canvas = TextMetrics._canvas) {
        wordWrap = (wordWrap === undefined || wordWrap === null) ? style.wordWrap : wordWrap;
        const font = style.toFontString();
        // const fontProperties = TextMetrics.measureFont(font); //skip for performance
        const fontProperties = null;
        const context = canvas.getContext('2d');

        context.font = font;

        const outputText = wordWrap ? TextMetrics.wordWrap(text, style, canvas) : text;
        const lines = outputText.split(/(?:\r\n|\r|\n)/);
        const lineWidths = new Array(lines.length);
        let maxLineWidth = 0;

        for (let i = 0; i < lines.length; i++) {
            const lineWidth = context.measureText(lines[i]).width + ((lines[i].length - 1) * style.letterSpacing);

            lineWidths[i] = lineWidth;
            maxLineWidth = Math.max(maxLineWidth, lineWidth);
        }
        const width = maxLineWidth + style.strokeThickness;
        const lineHeight = style.lineHeight || _getMeasuredWidth(font, 'M') * 1.2;
        const height = lineHeight * lines.length;

        return new TextMetrics(
            text,
            style,
            width,
            height,
            lines,
            lineWidths,
            lineHeight + style.leading,
            maxLineWidth,
            fontProperties,
        );
    };
}
