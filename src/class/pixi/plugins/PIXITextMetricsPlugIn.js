let TextMetrics = PIXI.TextMetrics;
export class PIXITextMetricsPlugIn {
    constructor() {
        PIXI.TextMetrics__orgWordWrap = PIXI.TextMetrics.wordWrap;
        PIXI.TextMetrics.__breakAllWordWrap = __breakAllWordWrap;

        PIXI.TextMetrics.wordWrap = function(text, style, canvas = TextMetrics._canvas) {
            return style.wordBreakAll ? PIXI.TextMetrics.__breakAllWordWrap(text, style, canvas) : PIXI.TextMetrics__orgWordWrap(text, style, canvas);
        };

        /**
         *
         * @param text
         * @param {PIXI.TextStyle | PIXITextStyle} style
         * @param canvas
         * @return {string}
         * @private
         */
        function __breakAllWordWrap(text, style, canvas){
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

            for (let i = 0; i < tokens.length; i++)
            {
                // get the word, space or newlineChar
                let token = tokens[i];

                // if word is a new line
                if (TextMetrics.isNewline(token))
                {
                    // keep the new line
                    if (!collapseNewlines)
                    {
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
                if (collapseSpaces)
                {
                    // check both this and the last tokens for spaces
                    const currIsBreakingSpace = TextMetrics.isBreakingSpace(token);
                    const lastIsBreakingSpace = TextMetrics.isBreakingSpace(line[line.length - 1]);

                    if (currIsBreakingSpace && lastIsBreakingSpace)
                    {
                        continue;
                    }
                }

                // get word width from cache if possible
                const tokenWidth = TextMetrics.getFromCache(token, letterSpacing, cache, context);

                // word is longer than desired bounds
                if (width + tokenWidth > wordWrapWidth)
                {
                    const characters = token.split('');
                    for (let j = 0; j < characters.length; j++) {
                        let char = characters[j];
                        const characterWidth = TextMetrics.getFromCache(char, letterSpacing, cache, context);
                        if( width + characterWidth  > wordWrapWidth ) {
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
                else
                {
                    // word won't fit because of existing words
                    // start a new line
                    if (tokenWidth + width > wordWrapWidth)
                    {
                        // if its a space we don't want it
                        canPrependSpaces = false;

                        // add a new line
                        lines += TextMetrics.addLine(line);

                        // start a new line
                        line = '';
                        width = 0;
                    }

                    // don't add spaces to the beginning of lines
                    if (line.length > 0 || !TextMetrics.isBreakingSpace(token) || canPrependSpaces)
                    {
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

    }
}