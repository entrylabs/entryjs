/**
 * Playground is block construct area.
 * @fileoverview This manage playground.
 */
'use strict';

var Entry = require('../entry');

/**
 * Class for a playground.
 * This manage all view related with block.
 * @constructor
 */
Entry.Playground = function() {
    this.isTextBGMode_ = false;
    this.enableArduino = false;

    /**
     * playground's current view type
     * View types are 'default', 'code', 'picture', 'text', sound'
     * @type {string}
     */
    this.viewMode_ = 'default';
    Entry.addEventListener('textEdited', () => {
        this.injectText()
    });
    Entry.addEventListener('hwChanged', () => {
        this.updateHW()
    });
};

(function(p) {
    p.setMode = function(mode) {
        this.mainWorkspace.setMode(mode);
    };

    /**
     * Control bar view generator.
     * @param {!Element} playgroundView playgroundView from Entry.
     * @param {?string} option for choose type of view.
     */
    p.generateView = function(playgroundView, option = 'workspace') {
        /** @type {!Element} */
        this.view_ = playgroundView;
        this.view_.addClass('entryPlayground');
        if (option == 'workspace') {
            this.view_.addClass('entryPlaygroundWorkspace');

            var tabView = Entry.createElement('div', 'entryCategoryTab')
                .addClass('entryPlaygroundTabWorkspace')
                .appendTo(this.view_);
            this.generateTabView(tabView);
            this.tabView_ = tabView;

            var curtainView = Entry.createElement('div', 'entryCurtain')
                .addClass('entryPlaygroundCurtainWorkspace entryRemove')
                .appendTo(this.view_);
            var [
                mentHead,
                mentTail,
            ] = Lang.Workspace.cannot_edit_click_to_stop.split('.');
            curtainView.innerHTML = mentHead + '.<br/>' + mentTail;
            curtainView.addEventListener('click', function() {
                Entry.engine.toggleStop();
            });
            this.curtainView_ = curtainView;

            var pictureView = Entry.createElement('div', 'entryPicture')
                .addClass('entryPlaygroundPictureWorkspace entryRemove')
                .appendTo(this.view_);
            this.generatePictureView(pictureView);
            this.pictureView_ = pictureView;

            var textView = Entry.createElement('div', 'entryText')
                .addClass('entryPlaygroundTextWorkspace entryRemove')
                .appendTo(this.view_);
            this.generateTextView(textView);
            this.textView_ = textView;

            var soundView = Entry.createElement('div', 'entrySound')
                .addClass('entryPlaygroundSoundWorkspace entryRemove')
                .appendTo(this.view_);
            this.generateSoundView(soundView);
            this.soundView_ = soundView;

            var defaultView = Entry.createElement('div', 'entryDefault')
                .addClass('entryPlaygroundDefaultWorkspace')
                .appendTo(this.view_);
            this.generateDefaultView(defaultView);
            this.defaultView_ = defaultView;

            //Code view must be append at last.
            var codeView = Entry.createElement('div', 'entryCode')
                .addClass('entryPlaygroundCodeWorkspace entryRemove')
                .appendTo(this.view_);
            this.generateCodeView(codeView);
            this.codeView_ = codeView;

            var resizeHandle = Entry.createElement('div')
                .addClass('entryPlaygroundResizeWorkspace', 'entryRemove')
                .appendTo(this.view_);
            this.resizeHandle_ = resizeHandle;
            this.initializeResizeHandle(resizeHandle);

            /** @type {!Element} */
            this.codeView_ = codeView;

            Entry.addEventListener('run', () => {
                Entry.playground.curtainView_.removeClass('entryRemove');
            });
            Entry.addEventListener('stop', () => {
                Entry.playground.curtainView_.addClass('entryRemove');
            });
        } else if (option == 'phone') {
            this.view_.addClass('entryPlaygroundPhone');

            var tabView = Entry.createElement('div', 'entryCategoryTab');
            tabView.addClass('entryPlaygroundTabPhone');
            Entry.view_.insertBefore(tabView, this.view_);
            this.generateTabView(tabView);
            this.tabView_ = tabView;

            var curtainView = Entry.createElement('div', 'entryCurtain');
            curtainView.addClass('entryPlaygroundCurtainPhone');
            curtainView.addClass('entryRemove');
            curtainView.innerHTML = Lang.Workspace.cannot_edit_click_to_stop;
            curtainView.bindOnClick(function() {
                Entry.engine.toggleStop();
            });
            this.view_.appendChild(curtainView);
            this.curtainView_ = curtainView;

            if (Entry.pictureEditable) {
                var pictureView = Entry.createElement('div', 'entryPicture');
                pictureView.addClass('entryPlaygroundPicturePhone');
                pictureView.addClass('entryRemove');
                this.view_.appendChild(pictureView);
                this.generatePictureView(pictureView);
                this.pictureView_ = pictureView;
            }

            var textView = Entry.createElement('div', 'entryText');
            //textView.addClass('entryPlaygroundTextWorkspace');
            textView.addClass('entryRemove');
            this.view_.appendChild(textView);
            this.generateTextView(textView);
            this.textView_ = textView;

            if (Entry.soundEditable) {
                var soundView = Entry.createElement('div', 'entrySound');
                soundView.addClass('entryPlaygroundSoundWorkspacePhone');
                soundView.addClass('entryRemove');
                this.view_.appendChild(soundView);
                this.generateSoundView(soundView);
                this.soundView_ = soundView;
            }

            var defaultView = Entry.createElement('div', 'entryDefault');
            //defaultView.addClass('entryPlaygroundDefaultWorkspace');
            this.view_.appendChild(defaultView);
            this.generateDefaultView(defaultView);
            this.defaultView_ = defaultView;

            //Code view must be append at last.
            var codeView = Entry.createElement('div', 'entryCode');
            codeView.addClass('entryPlaygroundCodePhone');
            this.view_.appendChild(codeView);
            this.generateCodeView(codeView);
            this.codeView_ = codeView;

            /** @type {!Element} */
            this.codeView_ = codeView;
            Entry.addEventListener('run', function(e) {
                Entry.playground.curtainView_.removeClass('entryRemove');
            });
            Entry.addEventListener('stop', function(e) {
                Entry.playground.curtainView_.addClass('entryRemove');
            });
        }

        this.applyTabOption();
    };

    /**
     * Generate default view.
     * default view is shown when object is not selected.
     * @param {!Element} defaultView
     * @return {Element}
     */
    p.generateDefaultView = function(defaultView) {
        return defaultView;
    };

    /**
     * generate tab menus
     * @param {!Element} tabView
     * @return {Element}
     */
    p.generateTabView = function(tabView) {
        var that = this;
        var tabList = Entry.createElement('ul').addClass(
            'entryTabListWorkspace'
        );
        this.tabList_ = tabList;
        tabView.appendChild(tabList);

        this.tabViewElements = {};
        var codeTab = Entry.createElement('li', 'entryCodeTab')
            .addClass('entryTabListItemWorkspace entryTabSelected')
            .bindOnClick(() => {
                Entry.do(
                    'playgroundChangeViewMode',
                    'code',
                    that.selectedViewMode
                );
            })
            .appendTo(tabList);
        codeTab.innerHTML = Lang.Workspace.tab_code;
        this.tabViewElements.code = codeTab;
        this._codeTab = codeTab;

        var pictureTab = Entry.createElement('li', 'entryPictureTab')
            .addClass('entryTabListItemWorkspace')
            .bindOnClick(() => {
                Entry.do(
                    'playgroundChangeViewMode',
                    'picture',
                    that.selectedViewMode
                );
            })
            .appendTo(tabList);
        pictureTab.innerHTML = Lang.Workspace.tab_picture;
        this.tabViewElements.picture = pictureTab;
        this.pictureTab = pictureTab;

        var textboxTab = Entry.createElement('li', 'entryTextboxTab')
            .addClass('entryTabListItemWorkspace entryRemove')
            .appendTo(tabList)
            .bindOnClick(() => {
                Entry.do(
                    'playgroundChangeViewMode',
                    'text',
                    that.selectedViewMode
                );
            });
        textboxTab.innerHTML = Lang.Workspace.tab_text;
        this.tabViewElements.text = textboxTab;
        this.textboxTab = textboxTab;

        var soundTab = Entry.createElement('li', 'entrySoundTab')
            .addClass('entryTabListItemWorkspace')
            .appendTo(tabList)
            .bindOnClick(() => {
                Entry.do(
                    'playgroundChangeViewMode',
                    'sound',
                    that.selectedViewMode
                );
            });
        soundTab.innerHTML = Lang.Workspace.tab_sound;
        this.tabViewElements.sound = soundTab;
        this.soundTab = soundTab;

        var variableTab = Entry.createElement('li', 'entryVariableTab')
            .addClass('entryTabListItemWorkspace entryVariableTabWorkspace')
            .appendTo(tabList)
            .bindOnClick(() => {
                Entry.do(
                    'playgroundChangeViewMode',
                    'variable',
                    that.selectedViewMode
                );
            });
        variableTab.innerHTML = Lang.Workspace.tab_attribute;
        this.tabViewElements.variable = variableTab;
        this.variableTab = variableTab;
    };

    /**
     * Inject and generate code view
     * @param {!Element} codeView
     * @return {Element}
     */
    p.generateCodeView = function(codeView) {
        var variableView = this.createVariableView();
        codeView.appendChild(variableView);
        this.variableView_ = variableView;

        codeView = Entry.Dom(codeView);
        var boardView = Entry.Dom('div', {
            parent: codeView,
            id: 'entryWorkspaceBoard',
            class: 'entryWorkspaceBoard',
        });

        var blockMenuView = Entry.Dom('div', {
            parent: codeView,
            id: 'entryWorkspaceBlockMenu',
            class: 'entryWorkspaceBlockMenu',
        });

        var initOpts = {
            blockMenu: {
                dom: blockMenuView,
                align: 'LEFT',
                categoryData: EntryStatic.getAllBlocks(),
                scroll: true,
            },
            board: {
                dom: boardView,
            },
            readOnly: Entry.readOnly,
        };
        if (Entry.textCodingEnable) initOpts.vimBoard = { dom: boardView };

        this.mainWorkspace = new Entry.Workspace(initOpts);
        this.blockMenu = this.mainWorkspace.blockMenu;
        this.board = this.mainWorkspace.board;
        this.blockMenu.banClass('checker');
        this.banExpansionBlock();
        this.vimBoard = this.mainWorkspace.vimBoard;

        if (Entry.hw) this.updateHW();
    };

    /**
     * Generate picture view.
     * @param {!Element} pictureView
     * @return {Element}
     */
    p.generatePictureView = function(PictureView) {
        if (Entry.type == 'workspace') {
            var pictureAdd = Entry.createElement('div', 'entryAddPicture')
                .addClass('entryPlaygroundAddPicture')
                .bindOnClick(() => {
                    if (
                        !Entry.container ||
                        Entry.container.isSceneObjectsExist()
                    )
                        Entry.do('playgroundClickAddPicture');
                    else {
                        Entry.toast.alert(
                            Lang.Workspace.add_object_alert,
                            Lang.Workspace.add_object_alert_msg
                        );
                    }
                })
                .appendTo(PictureView);

            var innerPictureAdd = Entry.createElement(
                'div',
                'entryAddPictureInner'
            )
                .addClass('entryPlaygroundAddPictureInner')
                .appendTo(pictureAdd);
            innerPictureAdd.innerHTML = Lang.Workspace.picture_add;
            this._pictureAddButton = innerPictureAdd;
            var pictureList = Entry.createElement('ul', 'entryPictureList')
                .addClass('entryPlaygroundPictureList')
                .appendTo(PictureView);

            $(pictureList).sortable({
                start: (event, ui) => {
                    ui.item.data('start_pos', ui.item.index());
                },
                stop: (event, ui) => {
                    Entry.playground.movePicture(
                        ui.item.data('start_pos'),
                        ui.item.index()
                    );
                },
                axis: 'y',
            });
            this.pictureListView_ = pictureList;

            this.painter = new Entry.Painter(
                Entry.createElement('div', 'entryPainter')
                    .addClass('entryPlaygroundPainter')
                    .appendTo(PictureView)
            );
        } else if (Entry.type == 'phone') {
            var pictureAdd = Entry.createElement('div', 'entryAddPicture');
            pictureAdd.addClass('entryPlaygroundAddPicturePhone');
            pictureAdd.bindOnClick(function(e) {
                Entry.dispatchEvent('openPictureManager');
            });
            var innerPictureAdd = Entry.createElement(
                'div',
                'entryAddPictureInner'
            );
            innerPictureAdd.addClass('entryPlaygroundAddPictureInnerPhone');
            innerPictureAdd.innerHTML = Lang.Workspace.picture_add;
            pictureAdd.appendChild(innerPictureAdd);
            PictureView.appendChild(pictureAdd);
            var pictureList = Entry.createElement('ul', 'entryPictureList');
            pictureList.addClass('entryPlaygroundPictureListPhone');
            if ($)
                $(pictureList).sortable({
                    start: function(event, ui) {
                        ui.item.data('start_pos', ui.item.index());
                    },
                    stop: function(event, ui) {
                        var start = ui.item.data('start_pos');
                        var end = ui.item.index();
                        Entry.playground.movePicture(start, end);
                    },
                    axis: 'y',
                });
            PictureView.appendChild(pictureList);
            this.pictureListView_ = pictureList;
        }
    };

    /**
     * Generate text view.
     * @param {!Element} textView
     * @return {Element}
     */
    p.generateTextView = function(textView) {
        var that = this;
        var wrap = Entry.createElement('div').appendTo(textView);
        var textProperties = Entry.createElement('div').addClass(
            'textProperties'
        );
        wrap.appendChild(textProperties);
        var fontWrapper = Entry.createElement('div').addClass(
            'entryTextFontSelect'
        );
        textProperties.appendChild(fontWrapper);

        var fontName = Entry.createElement(
            'select',
            'entryPainterAttrFontName'
        ).addClass(
            'entryPlaygroundPainterAttrFontName',
            'entryTextFontSelecter'
        );
        fontName.size = '1';
        fontName.onchange = function({ target }) {
            var font = target.value;
            if (font == 'Nanum Pen Script' || font == 'Jeju Hallasan') {
                var textValue = textEditInput.value;
                if (that.object.entity.getLineBreak())
                    textValue = textEditArea.value;

                if (/[\u4E00-\u9FFF]/.exec(textValue) != null) {
                    font = 'KoPub Batang';
                    fontName.value = font;
                    entrylms.alert(Lang.Menus.not_supported_text);
                }
            }
            that.object.entity.setFontType(font);
        };

        Entry.fonts.forEach((font) => {
            var element = Entry.createElement('option');
            element.value = font.family;
            element.innerHTML = font.name;

            fontName.appendChild(element);
        });

        this.fontName_ = fontName;
        fontWrapper.appendChild(fontName);

        var textButtons = Entry.createElement('ul').addClass(
            'entryPlayground_text_buttons'
        );
        textProperties.appendChild(textButtons);

        var alignLeftBtn = Entry.createElement('li')
            .addClass('entryPlaygroundTextAlignLeft')
            .bindOnClick(() => {
                Entry.playground.setFontAlign(Entry.TEXT_ALIGN_LEFT);
            });
        textButtons.appendChild(alignLeftBtn);
        this.alignLeftBtn = alignLeftBtn;

        var alignCenterBtn = Entry.createElement('li')
            .addClass('entryPlaygroundTextAlignCenter')
            .bindOnClick(function(e) {
                Entry.playground.setFontAlign(Entry.TEXT_ALIGN_CENTER);
            });
        textButtons.appendChild(alignCenterBtn);
        this.alignCenterBtn = alignCenterBtn;

        var alignRightBtn = Entry.createElement('li')
            .addClass('entryPlaygroundTextAlignRight')
            .bindOnClick(function(e) {
                Entry.playground.setFontAlign(Entry.TEXT_ALIGN_RIGHT);
            });
        textButtons.appendChild(alignRightBtn);
        this.alignRightBtn = alignRightBtn;

        var boldWrap = Entry.createElement('li');
        textButtons.appendChild(boldWrap);
        var boldButton = Entry.createElement('a').bindOnClick(function() {
            var isBold =
                Entry.playground.object.entity.toggleFontBold() || false;
            if (isBold) {
                boldImage.src =
                    Entry.mediaFilePath + 'text_button_bold_true.png';
            } else {
                boldImage.src =
                    Entry.mediaFilePath + 'text_button_bold_false.png';
            }
        });
        boldWrap.appendChild(boldButton);
        var boldImage = Entry.createElement(
            'img',
            'entryPlaygroundText_boldImage'
        );
        boldButton.appendChild(boldImage);
        boldImage.src = Entry.mediaFilePath + 'text_button_bold_false.png';

        var underLineWrap = Entry.createElement('li');
        textButtons.appendChild(underLineWrap);
        var underLineButton = Entry.createElement('a');
        underLineWrap.appendChild(underLineButton);
        underLineButton.bindOnClick(function() {
            //toggle
            var underLineState =
                !Entry.playground.object.entity.getUnderLine() || false;
            underLineImage.src =
                Entry.mediaFilePath +
                'text_button_underline_' +
                underLineState +
                '.png';
            Entry.playground.object.entity.setUnderLine(underLineState);
        });
        var underLineImage = Entry.createElement(
            'img',
            'entryPlaygroundText_underlineImage'
        );
        underLineButton.appendChild(underLineImage);
        underLineImage.src =
            Entry.mediaFilePath + 'text_button_underline_false.png';

        var italicWrap = Entry.createElement('li');
        textButtons.appendChild(italicWrap);
        var italicButton = Entry.createElement('a').bindOnClick(function() {
            //toggle
            var isItalic = Entry.playground.object.entity.toggleFontItalic();
            italicImage.src = `${
                Entry.mediaFilePath
            }text_button_italic_${isItalic.toString()}.png`;
        });
        italicWrap.appendChild(italicButton);

        var italicImage = Entry.createElement(
            'img',
            'entryPlaygroundText_italicImage'
        );
        italicButton.appendChild(italicImage);
        italicImage.src = Entry.mediaFilePath + 'text_button_italic_false.png';

        var strikeWrap = Entry.createElement('li');
        textButtons.appendChild(strikeWrap);
        var strikeButton = Entry.createElement('a').bindOnClick(function() {
            //toggle
            var strikeState =
                !Entry.playground.object.entity.getStrike() || false;
            Entry.playground.object.entity.setStrike(strikeState);
            strikeImage.src = `${
                Entry.mediaFilePath
            }text_button_strike_${strikeState.toString()}.png`;
        });
        strikeWrap.appendChild(strikeButton);
        var strikeImage = Entry.createElement(
            'img',
            'entryPlaygroundText_strikeImage'
        );
        strikeButton.appendChild(strikeImage);
        strikeImage.src = Entry.mediaFilePath + 'text_button_strike_false.png';

        var foregroundWrap = Entry.createElement('li');
        textButtons.appendChild(foregroundWrap);
        var foregroundButton = Entry.createElement('a').bindOnClick(function({
            target,
        }) {
            if ($(target).hasClass('fontColorCell')) {
                Entry.playground.setTextColour(target.getAttribute('colour'));
            } else {
                Entry.playground.toggleColourChooser('foreground');
            }
        });
        foregroundWrap.appendChild(foregroundButton);
        var foregroundImage = Entry.createElement(
            'img',
            'playgroundTextColorButtonImg'
        );
        foregroundButton.appendChild(foregroundImage);
        foregroundImage.src = `${
            Entry.mediaFilePath
        }text_button_color_false.png`;

        var backgroundWrap = Entry.createElement('li');
        textButtons.appendChild(backgroundWrap);
        var backgroundButton = Entry.createElement('a').bindOnClick(function({
            target,
        }) {
            if ($(target).hasClass('fontColorCell')) {
                that.setBackgroundColour(target.getAttribute('colour'));
            } else {
                that.toggleColourChooser('background');
            }
        });
        backgroundWrap.appendChild(backgroundButton);
        var backgroundImage = Entry.createElement(
            'img',
            'playgroundTextBgButtonImg'
        );
        backgroundButton.appendChild(backgroundImage);
        backgroundImage.src =
            Entry.mediaFilePath + 'text_button_background_false.png';

        var fgColorDiv = Entry.createElement('div').addClass(
            'entryPlayground_fgColorDiv'
        );
        var bgColorDiv = Entry.createElement('div').addClass(
            'entryPlayground_bgColorDiv'
        );

        foregroundButton.appendChild(fgColorDiv);
        backgroundButton.appendChild(bgColorDiv);

        var coloursWrapper = Entry.createElement('div').addClass(
            'entryPlaygroundTextColoursWrapper'
        );
        this.coloursWrapper = coloursWrapper;
        foregroundButton.appendChild(coloursWrapper);
        var colours = Entry.getColourCodes();

        var foregroundFragment = document.createDocumentFragment();
        colours.forEach((color, idx) => {
            var cell = Entry.createElement('div').addClass(
                'modal_colour fontColorCell'
            );
            cell.setAttribute('colour', color);
            cell.style.backgroundColor = color;
            if (idx === 0) cell.addClass('modalColourTrans');
            foregroundFragment.appendChild(cell);
        });
        var backgroundFragment = foregroundFragment.cloneNode(true);
        coloursWrapper.appendChild(foregroundFragment);
        coloursWrapper.style.display = 'none';

        var backgroundsWrapper = Entry.createElement('div').addClass(
            'entryPlaygroundTextBackgroundsWrapper'
        );
        this.backgroundsWrapper = backgroundsWrapper;
        backgroundButton.appendChild(backgroundsWrapper);

        backgroundsWrapper.appendChild(backgroundFragment);
        backgroundsWrapper.style.display = 'none';

        var textEditInput = Entry.createElement('input').addClass(
            'entryPlayground_textBox'
        );
        var textChangeApply = function() {
            var object = Entry.playground.object;
            var entity = object.entity;
            var fontName = _.first($('.entryPlaygroundPainterAttrFontName'));

            if (
                fontName.value == 'Nanum Pen Script' ||
                fontName.value == 'Jeju Hallasan'
            ) {
                if (/[\u4E00-\u9FFF]/.exec(this.value) != null) {
                    var font = 'KoPub Batang';
                    fontName.value = font;
                    entity.setFontType(font);
                    entrylms.alert(Lang.Menus.not_supported_text);
                }
            }
            object.setText(this.value);
            entity.setText(this.value);
        };
        textEditInput.onkeyup = textChangeApply;
        textEditInput.onchange = textChangeApply;

        textEditInput.addEventListener('focusin', function() {
            textEditInput.prevText = textEditInput.value;
        });
        textEditInput.onblur = function() {
            if (textEditInput.value !== textEditInput.prevText) {
                Entry.do(
                    'editText',
                    textEditInput.value,
                    textEditInput.prevText
                );
            }
            // Entry.dispatchEvent('textEdited');
        };
        this.textEditInput = textEditInput;
        wrap.appendChild(textEditInput);

        var textEditArea = Entry.createElement('textarea');
        textEditArea.addClass('entryPlayground_textArea');
        textEditArea.style.display = 'none';
        textEditArea.onkeyup = textChangeApply;
        textEditArea.onchange = textChangeApply;

        textEditArea.addEventListener('focusin', function() {
            textEditArea.prevText = textEditArea.value;
        });
        textEditArea.onblur = function() {
            if (textEditArea.value !== textEditArea.prevText) {
                Entry.do('editText', textEditArea.value, textEditArea.prevText);
            }
        };
        this.textEditArea = textEditArea;
        wrap.appendChild(textEditArea);

        var fontSizeWrapper = Entry.createElement('div').addClass(
            'entryPlaygroundFontSizeWrapper'
        );
        wrap.appendChild(fontSizeWrapper);
        this.fontSizeWrapper = fontSizeWrapper;

        var fontSizeSlider = Entry.createElement('div').addClass(
            'entryPlaygroundFontSizeSlider'
        );
        fontSizeWrapper.appendChild(fontSizeSlider);

        var fontSizeIndiciator = Entry.createElement('div').addClass(
            'entryPlaygroundFontSizeIndicator'
        );
        fontSizeSlider.appendChild(fontSizeIndiciator);
        this.fontSizeIndiciator = fontSizeIndiciator;

        var fontSizeKnob = Entry.createElement('div').addClass(
            'entryPlaygroundFontSizeKnob'
        );
        fontSizeSlider.appendChild(fontSizeKnob);
        this.fontSizeKnob = fontSizeKnob;

        var fontSizeLabel = Entry.createElement('div').addClass(
            'entryPlaygroundFontSizeLabel'
        );
        fontSizeLabel.innerHTML = Lang.General.font_size;
        fontSizeWrapper.appendChild(fontSizeLabel);

        $(fontSizeKnob).bind(
            'mousedown.fontKnob touchstart.fontKnob',
            function() {
                var resizeOffset = $(fontSizeSlider).offset().left;

                var doc = $(document);
                doc.bind('mousemove.fontKnob touchmove.fontKnob', onMouseMove);
                doc.bind('mouseup.fontKnob touchend.fontKnob', onMouseUp);

                function onMouseMove(e) {
                    var left = e.pageX - resizeOffset;
                    left = Math.max(left, 5);
                    left = Math.min(left, 88);
                    fontSizeKnob.style.left = left + 'px';
                    left /= 0.88;
                    fontSizeIndiciator.style.width = left + '%';
                    Entry.playground.object.entity.setFontSize(left);
                }

                function onMouseUp(e) {
                    $(document).unbind('.fontKnob');
                }
            }
        );

        var linebreakWrapper = Entry.createElement('div').addClass(
            'entryPlaygroundLinebreakWrapper'
        );
        wrap.appendChild(linebreakWrapper);

        var linebreakHorizontal = Entry.createElement('hr').addClass(
            'entryPlaygroundLinebreakHorizontal'
        );
        linebreakWrapper.appendChild(linebreakHorizontal);

        var linebreakButtons = Entry.createElement('div').addClass(
            'entryPlaygroundLinebreakButtons'
        );
        linebreakWrapper.appendChild(linebreakButtons);

        var linebreakOffImage = Entry.createElement('img').bindOnClick(
            function() {
                Entry.playground.toggleLineBreak(false);
                linebreakDescTitle.innerHTML = Lang.Menus.linebreak_off_desc_1;
                linebreakDescList1.innerHTML = Lang.Menus.linebreak_off_desc_2;
                linebreakDescList2.innerHTML = Lang.Menus.linebreak_off_desc_3;
            }
        );

        linebreakOffImage.src =
            Entry.mediaFilePath + 'text-linebreak-off-true.png';
        linebreakButtons.appendChild(linebreakOffImage);
        this.linebreakOffImage = linebreakOffImage;

        var linebreakOnImage = Entry.createElement('img').bindOnClick(
            function() {
                Entry.playground.toggleLineBreak(true);
                linebreakDescTitle.innerHTML = Lang.Menus.linebreak_on_desc_1;
                linebreakDescList1.innerHTML = Lang.Menus.linebreak_on_desc_2;
                linebreakDescList2.innerHTML = Lang.Menus.linebreak_on_desc_3;
            }
        );

        linebreakOnImage.src =
            Entry.mediaFilePath + 'text-linebreak-on-false.png';
        linebreakButtons.appendChild(linebreakOnImage);
        this.linebreakOnImage = linebreakOnImage;

        var linebreakDescription = Entry.createElement('div').addClass(
            'entryPlaygroundLinebreakDescription'
        );
        linebreakWrapper.appendChild(linebreakDescription);

        var linebreakDescTitle = Entry.createElement('p');
        linebreakDescTitle.innerHTML = Lang.Menus.linebreak_off_desc_1;
        linebreakDescription.appendChild(linebreakDescTitle);

        var linebreakDescUL = Entry.createElement('ul');
        linebreakDescription.appendChild(linebreakDescUL);
        var linebreakDescList1 = Entry.createElement('li');
        linebreakDescList1.innerHTML = Lang.Menus.linebreak_off_desc_2;
        linebreakDescUL.appendChild(linebreakDescList1);
        var linebreakDescList2 = Entry.createElement('li');
        linebreakDescList2.innerHTML = Lang.Menus.linebreak_off_desc_3;
        linebreakDescUL.appendChild(linebreakDescList2);
    };

    /**
     * Generate sound view.
     * default view is shown when object is not selected.
     * @param {!Element} codeView
     * @return {Element}
     */
    p.generateSoundView = function(SoundView) {
        if (Entry.type == 'workspace') {
            var soundAdd = Entry.createElement('div', 'entryAddSound');
            soundAdd.addClass('entryPlaygroundAddSound');
            soundAdd.bindOnClick(function(e) {
                if (!Entry.container || Entry.container.isSceneObjectsExist())
                    Entry.do('playgroundClickAddSound');
                else {
                    Entry.toast.alert(
                        Lang.Workspace.add_object_alert,
                        Lang.Workspace.add_object_alert_msg
                    );
                }
            });
            var innerSoundAdd = Entry.createElement(
                'div',
                'entryAddSoundInner'
            ).addClass('entryPlaygroundAddSoundInner');
            innerSoundAdd.innerHTML = Lang.Workspace.sound_add;
            soundAdd.appendChild(innerSoundAdd);
            SoundView.appendChild(soundAdd);
            var soundList = Entry.createElement(
                'ul',
                'entrySoundList'
            ).addClass('entryPlaygroundSoundList');
            $(soundList).sortable({
                start: function(event, ui) {
                    ui.item.data('start_pos', ui.item.index());
                },
                stop: function(event, ui) {
                    Entry.playground.moveSound(
                        ui.item.data('start_pos'),
                        ui.item.index()
                    );
                },
                axis: 'y',
            });
            SoundView.appendChild(soundList);
            this.soundListView_ = soundList;
            this._soundAddButton = innerSoundAdd;
        } else if (Entry.type == 'phone') {
            var soundAdd = Entry.createElement('div', 'entryAddSound');
            soundAdd.addClass('entryPlaygroundAddSoundPhone');
            soundAdd.bindOnClick(function(e) {
                Entry.dispatchEvent('openSoundManager');
            });
            var innerSoundAdd = Entry.createElement(
                'div',
                'entryAddSoundInner'
            );
            innerSoundAdd.addClass('entryPlaygroundAddSoundInnerPhone');
            innerSoundAdd.innerHTML = Lang.Workspace.sound_add;
            soundAdd.appendChild(innerSoundAdd);
            SoundView.appendChild(soundAdd);
            var soundList = Entry.createElement('ul', 'entrySoundList');
            soundList.addClass('entryPlaygroundSoundListPhone');
            if ($)
                $(soundList).sortable({
                    start: function(event, ui) {
                        ui.item.data('start_pos', ui.item.index());
                    },
                    stop: function(event, ui) {
                        var start = ui.item.data('start_pos');
                        var end = ui.item.index();
                        Entry.playground.moveSound(start, end);
                    },
                    axis: 'y',
                });
            SoundView.appendChild(soundList);
            this.soundListView_ = soundList;
        }
    };

    /**
     * Inject object
     * @param {?Entry.EntryObject} object
     */
    p.injectObject = function(object) {
        /** @type {Entry.Entryobject} */
        if (!object) {
            this.changeViewMode('code');
            this.object = null;
            return;
        }
        if (object === this.object) return;

        this.object = object;

        var objectType = object.objectType;
        this.setMenu(objectType);

        this.injectCode();

        var { text: textTab, picture: pictureTab } = this.tabViewElements;
        if (objectType == 'sprite' && Entry.pictureEditable) {
            if (textTab) textTab.addClass('entryRemove');
            if (pictureTab) pictureTab.removeClass('entryRemove');
        } else if (objectType == 'textBox') {
            if (pictureTab) pictureTab.addClass('entryRemove');
            if (textTab) textTab.removeClass('entryRemove');
        }

        var viewMode = this.viewMode_;
        if (viewMode == 'default') {
            this.changeViewMode('code');
        } else if (viewMode == 'variable') {
            this.changeViewMode('variable');
        } else if (
            (viewMode == 'picture' || viewMode == 'text') &&
            objectType == 'textBox'
        ) {
            this.changeViewMode('text');
        } else if (
            (viewMode == 'text' || viewMode == 'picture') &&
            objectType == 'sprite'
        ) {
            this.changeViewMode('picture');
        } else if (viewMode == 'sound') {
            this.changeViewMode('sound');
        }

        _.result(this.blockMenu, 'clearRendered');
        this.reloadPlayground();
    };

    /**
     * Inject code
     */
    p.injectCode = function() {
        var workspace = Entry.getMainWS();
        if (!workspace) return;

        var object = this.object;
        var vimBoard = workspace.vimBoard;

        if (vimBoard && Entry.textCodingEnable && !vimBoard._parser._onError) {
            vimBoard._changedObject = object;
            vimBoard._currentScene = object.scene;
        }

        var board = workspace.getBoard();
        var engine = Entry.engine;
        workspace.changeBoardCode(
            object.script,
            engine && engine.isState('run')
                ? undefined
                : board.adjustThreadsPosition.bind(board)
        );
    };

    /**
     * Inject picture
     */
    p.injectPicture = function() {
        var view = this.pictureListView_;
        if (!view) return;

        while (view.hasChildNodes()) {
            view.removeChild(view.lastChild);
        }

        if (!this.object) {
            return Entry.dispatchEvent('pictureClear');
        }

        var fragment = document.createDocumentFragment();

        (this.object.pictures || []).forEach((picture, i) => {
            !picture.view && Entry.playground.generatePictureElement(picture);
            var element = picture.view;
            element.orderHolder.innerHTML = i + 1;
            fragment.appendChild(element);
        });

        view.appendChild(fragment);
        this.selectPicture(this.object.selectedPicture);
    };

    /**
     * Add picture
     * @param {picture model} picture
     */
    p.addPicture = function(picture, isNew) {
        var tempPicture = _.clone(picture);

        if (isNew === true) delete tempPicture.id;
        delete tempPicture.view;

        picture = Entry.Utils.copy(tempPicture);
        if (!picture.id) picture.id = Entry.generateHash();

        picture.name = Entry.getOrderedName(picture.name, this.object.pictures);

        this.generatePictureElement(picture);

        Entry.do(
            'objectAddPicture',
            picture.objectId || this.object.id,
            picture
        );
        this.injectPicture();
        this.selectPicture(picture);
    };

    /**
     * set picture
     * @param {picture}
     */
    p.setPicture = function(picture) {
        var element = Entry.container.getPictureElement(
            picture.id,
            picture.objectId
        );
        var $element = $(element);
        if (element) {
            picture.view = element;
            element.picture = picture;

            var thumbnailView = $element.find('#t_' + picture.id)[0];
            if (picture.fileurl) {
                thumbnailView.style.backgroundImage =
                    'url("' + picture.fileurl + '")';
            } else {
                // deprecated
                var fileName = picture.filename;
                thumbnailView.style.backgroundImage =
                    'url("' +
                    Entry.defaultPath +
                    '/uploads/' +
                    fileName.substring(0, 2) +
                    '/' +
                    fileName.substring(2, 4) +
                    '/thumb/' +
                    fileName +
                    '.png")';
            }
            var sizeView = $element.find('#s_' + picture.id)[0];
            sizeView.innerHTML =
                picture.dimension.width + ' X ' + picture.dimension.height;
        }

        Entry.container.setPicture(picture);
        // Entry.playground.object.setPicture(picture);
    };

    /**
     * Download a picture
     * @param {!String} pictureId
     */
    p.downloadPicture = function(pictureId) {
        var picture = Entry.playground.object.getPicture(pictureId);
        if (picture.fileurl) {
            window.open(
                '/api/sprite/download/entryjs/' +
                    btoa(picture.fileurl) +
                    '/' +
                    encodeURIComponent(picture.name) +
                    '.png'
            );
        } else {
            window.open(
                '/api/sprite/download/image/' +
                    btoa(picture.filename) +
                    '/' +
                    encodeURIComponent(picture.name) +
                    '.png'
            );
        }
    };

    /**
     * Clone picture
     * @param {!String} pictureId
     */
    p.clonePicture = function(pictureId) {
        var sourcePicture = Entry.playground.object.getPicture(pictureId);
        this.addPicture(sourcePicture, true);
    };

    /**
     * Select picture
     * @param {picture}
     */
    p.selectPicture = function(picture) {
        var pictures = this.object.pictures;
        for (var i = 0, len = pictures.length; i < len; i++) {
            var target = pictures[i];
            var view = target.view;
            if (target.id === picture.id) view.addClass('entryPictureSelected');
            else view.removeClass('entryPictureSelected');
        }

        var objectId_;
        if (picture && picture.id)
            objectId_ = Entry.container.selectPicture(
                picture.id,
                picture.objectId
            );

        if (this.object.id === objectId_) {
            if (!picture.objectId) picture.objectId = this.object.id;
            Entry.dispatchEvent('pictureSelected', picture);
        }
    };

    /**
     * Move picture in this.object.pictures
     * this method is for sortable
     * @param {!number} start
     * @param {!number} end
     */
    p.movePicture = function(start, end) {
        this.object.pictures.splice(
            end,
            0,
            this.object.pictures.splice(start, 1)[0]
        );
        this.injectPicture();
    };

    /**
     * Inject text
     */
    p.injectText = function() {
        var object = this.object;

        if (!object) return;

        var entity = object.entity;

        var text = entity.getText();
        this.textEditInput.value = text;
        this.textEditArea.value = text;

        $('#entryPainterAttrFontName').val(entity.getFontName());

        var isBold = entity.fontBold || false;
        $('#entryPlaygroundText_boldImage').attr(
            'src',
            Entry.mediaFilePath + 'text_button_bold_' + isBold + '.png'
        );

        var isItalic = entity.fontItalic || false;
        $('#entryPlaygroundText_italicImage').attr(
            'src',
            Entry.mediaFilePath + 'text_button_italic_' + isItalic + '.png'
        );

        var isUnderLine = entity.getUnderLine() || false;
        $('#entryPlaygroundText_underlineImage').attr(
            'src',
            Entry.mediaFilePath +
                'text_button_underline_' +
                isUnderLine +
                '.png'
        );

        var isStrike = entity.getStrike() || false;
        $('#entryPlaygroundText_strikeImage').attr(
            'src',
            Entry.mediaFilePath + 'text_button_strike_' + isStrike + '.png'
        );

        if (entity.colour) this.setTextColour(entity.colour, true);
        if (entity.bgColor) this.setBackgroundColour(entity.bgColor, true);

        this.toggleLineBreak(entity.getLineBreak());

        if (entity.getLineBreak()) {
            var LANG = Lang.Menus;
            $('.entryPlaygroundLinebreakDescription > p').html(
                LANG.linebreak_on_desc_1
            );
            var pDoms = $('.entryPlaygroundLinebreakDescription > ul > li');
            pDoms.eq(0).text(LANG.linebreak_on_desc_2);
            pDoms.eq(1).text(LANG.linebreak_on_desc_3);
            this._setFontFontUI();
        }

        this.setFontAlign(entity.getTextAlign());
    };

    p._setFontFontUI = function() {
        var fontSize = this.object.entity.getFontSize();
        this.fontSizeIndiciator.style.width = fontSize + '%';
        this.fontSizeKnob.style.left = fontSize * 0.88 + 'px';
    };

    /**
     * Inject sound
     */
    p.injectSound = function() {
        var view = this.soundListView_;
        if (!view) return;

        while (view.hasChildNodes()) view.removeChild(view.lastChild);

        if (!this.object) return;

        var fragment = document.createDocumentFragment();

        var sounds = this.object.sounds || [];
        sounds.forEach((sound, i) => {
            !sound.view && Entry.playground.generateSoundElement(sound);
            var element = sound.view;
            element.orderHolder.innerHTML = i + 1;
            fragment.appendChild(element);
        });
        view.appendChild(fragment);
    };

    /**
     * Move sound in this.object.sounds
     * this method is for sortable
     * @param {!number} start
     * @param {!number} end
     */
    p.moveSound = function(start, end) {
        this.object.sounds.splice(
            end,
            0,
            this.object.sounds.splice(start, 1)[0]
        );
        this.updateListViewOrder('sound');
    };

    p.addExpansionBlock = function(block, isNew) {
        var tempBlock = _.clone(block);
        delete tempBlock.view;
        if (isNew === true) delete tempBlock.id;

        block = Entry.Utils.copy(tempBlock);

        if (!block.id) block.id = Entry.generateHash();

        Entry.do('objectAddExpansionBlock', block);
    };
    /**
     * Add sound
     * @param {sound model} sound
     * @param {boolean} NotForView if this is true, add element into object also.
     */
    p.addSound = function(sound, NotForView, isNew) {
        var tempSound = _.clone(sound);
        delete tempSound.view;
        if (isNew === true) delete tempSound.id;

        sound = Entry.Utils.copy(tempSound);
        if (!sound.id) sound.id = Entry.generateHash();
        sound.name = Entry.getOrderedName(sound.name, this.object.sounds);

        this.generateSoundElement(sound);
        Entry.do('objectAddSound', this.object.id, sound);
        this.injectSound();
    };

    p.downloadSound = function(soundId) {
        var sound = Entry.playground.object.getSound(soundId);
        if (sound.fileurl) {
            if (sound.fileurl.indexOf('bark.mp3') > -1) {
                window.open(
                    '/api/sprite/download/entryjs/' +
                        btoa(sound.fileurl) +
                        '/' +
                        encodeURIComponent(sound.name + '.mp3')
                );
            } else {
                window.open(sound.fileurl);
            }
        } else {
            window.open(
                '/api/sprite/download/sound/' +
                    encodeURIComponent(sound.filename) +
                    '/' +
                    encodeURIComponent(sound.name)
            );
        }
    };

    /**
     * select view mode
     * @param {string} viewType
     */
    p.changeViewMode = function(viewType) {
        for (var i in this.tabViewElements) {
            this.tabViewElements[i].removeClass('entryTabSelected');
        }
        if (viewType != 'default')
            this.tabViewElements[viewType].addClass('entryTabSelected');
        if (viewType == 'variable') {
            Entry.playground.toggleOnVariableView();
            this.tabViewElements.code.removeClass('entryTabSelected');
            this.tabViewElements[viewType].addClass('entryTabSelected');
            return;
        }
        var views = this.view_.children;
        for (var i = 0; i < views.length; i++) {
            var view = views[i];
            if (view.id.toUpperCase().indexOf(viewType.toUpperCase()) > -1)
                view.removeClass('entryRemove');
            else view.addClass('entryRemove');
        }

        if (Entry.pictureEditable) {
            if (viewType == 'picture') {
                this.painter.show();
                if (
                    !this.pictureView_.object ||
                    this.pictureView_.object != this.object
                ) {
                    this.pictureView_.object = this.object;
                    this.injectPicture();
                } else if (
                    this.object &&
                    this.pictureListView_ &&
                    !this.pictureListView_.hasChildNodes()
                ) {
                    var pictures = this.object.pictures;
                    if (pictures && pictures.length) {
                        this.injectPicture();
                    }
                }
            } else this.painter.hide();
        }

        if (viewType == 'sound') {
            if (
                !this.soundView_.object ||
                this.soundView_.object != this.object
            ) {
                this.soundView_.object = this.object;
                this.injectSound();
            } else if (
                this.object &&
                this.soundListView_ &&
                !this.soundListView_.hasChildNodes()
            ) {
                var sounds = this.object.sounds;
                if (sounds && sounds.length) {
                    this.injectSound();
                }
            }
        }

        if (
            (viewType == 'text' && this.object.objectType == 'textBox') ||
            this.textView_.object != this.object
        ) {
            this.textView_.object = this.object;
            this.injectText();
        }

        if (viewType == 'code') {
            this.resizeHandle_ && this.resizeHandle_.removeClass('entryRemove');
            this.blockMenu.reDraw();
        }
        if (Entry.engine.isState('run'))
            this.curtainView_.removeClass('entryRemove');
        this.viewMode_ = viewType;
        this.selectedViewMode = viewType;
        this.toggleOffVariableView();
    };

    /**
     * render variable view
     * @return {!Element}
     */
    p.createVariableView = function() {
        var view = Entry.createElement('div');
        if (!Entry.type || Entry.type == 'workspace') {
            view.addClass('entryVariablePanelWorkspace');
        } else if (Entry.type == 'phone') {
            view.addClass('entryVariablePanelPhone');
        }
        this.variableViewWrapper_ = view;
        Entry.variableContainer.createDom(view);
        return view;
    };

    /**
     * toggle on variable view
     */
    p.toggleOnVariableView = function() {
        Entry.playground.changeViewMode('code');
        this.hideBlockMenu();
        Entry.variableContainer.updateList();
        this.variableView_.removeClass('entryRemove');
        this.resizeHandle_.removeClass('entryRemove');
        this.viewMode_ = 'variable';
        this.selectedViewMode = 'variable';
    };

    p.toggleOffVariableView = function() {
        this.showBlockMenu();
        this.variableView_.addClass('entryRemove');
    };

    /**
     * Generate category menu with object type.
     * @param {!string} objectType
     */
    p.setMenu = function(objectType) {
        if (this.currentObjectType == objectType) return;

        var blockMenu = this.blockMenu;
        blockMenu.unbanClass(this.currentObjectType, true);
        blockMenu.banClass(objectType, true);
        blockMenu.setMenu(true);
        this.currentObjectType = objectType;
    };

    p.hideTabs = function() {
        ['picture', 'text', 'sound', 'variable'].forEach(
            this.hideTab.bind(this)
        );
    };

    p.hideTab = function(item) {
        if (this.tabViewElements[item]) {
            this.tabViewElements[item].addClass('hideTab');
            this.tabViewElements[item].removeClass('showTab');
        }
    };

    p.showTabs = function() {
        ['picture', 'text', 'sound', 'variable'].forEach(
            this.showTab.bind(this)
        );
    };

    p.showTab = function(item) {
        if (this.tabViewElements[item]) {
            this.tabViewElements[item].addClass('showTab');
            this.tabViewElements[item].removeClass('hideTab');
        }
    };

    /**
     * Handle is resizing playground handle.
     * This add mouse move and mouse up event to document.
     * @param {!Element} handle
     */
    p.initializeResizeHandle = function(handle) {
        var listener;
        var that = this;
        $(handle).bind('mousedown touchstart', function(e) {
            that.resizing = true;
            if (Entry.documentMousemove) {
                listener = Entry.documentMousemove.attach(this, function({
                    clientX,
                }) {
                    if (that.resizing) {
                        Entry.resizeElement({
                            menuWidth:
                                clientX - Entry.interfaceState.canvasWidth,
                        });
                    }
                });
            }
            $(document).bind(
                'mouseup.resizeHandle touchend.resizeHandle',
                function(e) {
                    $(document).unbind('.resizeHandle');
                    if (listener) {
                        that.resizing = false;
                        listener.destroy();
                        listener = undefined;
                    }
                }
            );
        });
    };

    /**
     * Reload playground
     */
    p.reloadPlayground = function() {
        var engine = Entry.engine;

        if (engine && engine.isState('run')) return;
        _.result(this.mainWorkspace, 'dReDraw');
    };

    /**
     * flush playground when object is not exist
     */
    p.flushPlayground = function() {
        this.object = null;
        if (Entry.playground && Entry.playground.view_) {
            this.injectPicture();
            this.injectSound();
            var board = Entry.playground.mainWorkspace.getBoard();
            board.clear();
            board.changeCode(null);
        }
    };

    p.refreshPlayground = function() {
        if (Entry.playground && Entry.playground.view_) {
            if (this.getViewMode() === 'picture') this.injectPicture();
            if (this.getViewMode() === 'sound') this.injectSound();
        }
    };

    p.updateListViewOrder = function(type) {
        var list;
        if (type == 'picture') {
            list = this.pictureListView_.childNodes;
        } else {
            list = this.soundListView_.childNodes;
        }

        list.forEach(({ orderHolder }, index) => {
            orderHolder.innerHTML = index + 1;
        });
    };

    p.generatePictureElement = function(picture) {
        var element = Entry.createElement('li', picture.id)
            .addClass('entryPlaygroundPictureElement')
            .bindOnClick(function(e) {
                Entry.playground.selectPicture(this.picture);
            });
        picture.view = element;
        element.picture = picture;

        Entry.Utils.disableContextmenu(picture.view);
        Entry.ContextMenu.onContextmenu($(picture.view), function() {
            var options = [
                {
                    text: Lang.Workspace.context_rename,
                    callback: function() {
                        nameView.focus();
                    },
                },
                {
                    text: Lang.Workspace.context_duplicate,
                    callback: function() {
                        Entry.playground.clonePicture(picture.id);
                    },
                },
                {
                    text: Lang.Workspace.context_remove,
                    callback: function() {
                        if (Entry.playground.object.removePicture(picture.id)) {
                            Entry.removeElement(element);
                            Entry.dispatchEvent('removePicture', picture);
                            Entry.toast.success(
                                Lang.Workspace.shape_remove_ok,
                                picture.name +
                                    ' ' +
                                    Lang.Workspace.shape_remove_ok_msg
                            );
                        } else {
                            Entry.toast.alert(
                                Lang.Workspace.shape_remove_fail,
                                Lang.Workspace.shape_remove_fail_msg
                            );
                        }
                    },
                },
                { divider: true },
                {
                    text: Lang.Workspace.context_download,
                    callback: function() {
                        Entry.playground.downloadPicture(picture.id);
                    },
                },
            ];
            Entry.ContextMenu.show(options, 'workspace-contextmenu');
        });

        element.orderHolder = Entry.createElement('div')
            .addClass('entryPlaygroundPictureOrder')
            .appendTo(element);

        var thumbnailView = Entry.createElement(
            'div',
            `t_${picture.id}`
        ).addClass('entryPlaygroundPictureThumbnail');
        if (picture.fileurl) {
            thumbnailView.style.backgroundImage =
                'url("' + picture.fileurl + '")';
        } else {
            // deptecated
            var fileName = picture.filename;
            thumbnailView.style.backgroundImage =
                'url("' +
                Entry.defaultPath +
                '/uploads/' +
                fileName.substring(0, 2) +
                '/' +
                fileName.substring(2, 4) +
                '/thumb/' +
                fileName +
                '.png")';
        }
        element.appendChild(thumbnailView);
        var nameView = Entry.createElement('input')
            .addClass('entryPlaygroundPictureName')
            .addClass('entryEllipsis');
        nameView.picture = picture;
        nameView.value = picture.name;
        Entry.attachEventListener(nameView, 'blur', nameViewBlur);

        function nameViewBlur() {
            if (this.value.trim() === '') {
                Entry.deAttachEventListener(this, 'blur', nameViewBlur);
                entrylms.alert(Lang.Workspace.enter_the_name);
                this.focus();
                Entry.attachEventListener(this, 'blur', nameViewBlur);
                return;
            }

            var nameViewArray = $('.entryPlaygroundPictureName');
            for (var i = 0; i < nameViewArray.length; i++) {
                if (
                    nameViewArray.eq(i).val() == nameView.value &&
                    nameViewArray[i] != this
                ) {
                    Entry.deAttachEventListener(this, 'blur', nameViewBlur);
                    entrylms.alert(Lang.Workspace.name_already_exists);
                    this.focus();
                    Entry.attachEventListener(this, 'blur', nameViewBlur);
                    return;
                }
            }
            var newValue = this.value;
            this.picture.name = newValue;
            var playground = Entry.playground;
            if (playground) {
                if (playground.object) {
                    var pic = playground.object.getPicture(this.picture.id);
                    if (pic) pic.name = newValue;
                }
                var painter = playground.painter;
                if (painter && painter.file) painter.file.name = newValue;

                playground.reloadPlayground();
            }
            Entry.dispatchEvent('pictureNameChanged', this.picture);
        }

        nameView.onkeypress = Entry.Utils.blurWhenEnter;
        element.appendChild(nameView);
        Entry.createElement('div', 's_' + picture.id)
            .addClass('entryPlaygroundPictureSize')
            .appendTo(element).innerHTML =
            picture.dimension.width + ' X ' + picture.dimension.height;
    };

    p.generateSoundElement = function(sound) {
        var element = Entry.createElement('sound', sound.id).addClass(
            'entryPlaygroundSoundElement'
        );
        sound.view = element;
        element.sound = sound;

        Entry.Utils.disableContextmenu(sound.view);
        Entry.ContextMenu.onContextmenu($(sound.view), function() {
            var options = [
                {
                    text: Lang.Workspace.context_rename,
                    callback: function() {
                        nameView.focus();
                    },
                },
                {
                    text: Lang.Workspace.context_duplicate,
                    callback: function() {
                        Entry.playground.addSound(sound, true, true);
                    },
                },
                {
                    text: Lang.Workspace.context_remove,
                    callback: function() {
                        var result = Entry.do(
                            'objectRemoveSound',
                            Entry.playground.object.id,
                            sound
                        );
                        if (result) {
                            Entry.removeElement(element);
                            Entry.dispatchEvent('removeSound', sound);
                            Entry.toast.success(
                                Lang.Workspace.sound_remove_ok,
                                sound.name +
                                    ' ' +
                                    Lang.Workspace.sound_remove_ok_msg
                            );
                        } else {
                            Entry.toast.alert(
                                Lang.Workspace.sound_remove_fail,
                                ''
                            );
                        }
                        Entry.removeElement(element);
                    },
                },
                { divider: true },
                {
                    text: Lang.Workspace.context_download,
                    callback: function() {
                        Entry.playground.downloadSound(sound.id);
                    },
                },
            ];
            Entry.ContextMenu.show(options, 'workspace-contextmenu');
        });

        element.orderHolder = Entry.createElement('div')
            .addClass('entryPlaygroundSoundOrder')
            .appendTo(element);

        var thumbnailView = Entry.createElement('div')
            .addClass('entryPlaygroundSoundThumbnail entryPlaygroundSoundPlay')
            .appendTo(element);
        var isPlaying = false;
        var soundInstance;
        thumbnailView.addEventListener('click', () => {
            if (isPlaying) {
                isPlaying = false;
                thumbnailView.removeClass('entryPlaygroundSoundStop');
                thumbnailView.addClass('entryPlaygroundSoundPlay');
                soundInstance.stop();
                return;
            } else {
                isPlaying = true;
                thumbnailView.removeClass('entryPlaygroundSoundPlay');
                thumbnailView.addClass('entryPlaygroundSoundStop');
                soundInstance = createjs.Sound.play(sound.id);
            }

            soundInstance.addEventListener('complete', function(e) {
                thumbnailView.removeClass('entryPlaygroundSoundStop');
                thumbnailView.addClass('entryPlaygroundSoundPlay');
                isPlaying = false;
            });
        });

        var nameView = Entry.createElement('input')
            .addClass('entryPlaygroundSoundName')
            .appendTo(element);
        nameView.sound = sound;
        nameView.value = sound.name;
        Entry.attachEventListener(nameView, 'blur', nameViewBlur);

        function nameViewBlur() {
            if (this.value.trim() === '') {
                Entry.deAttachEventListener(this, 'blur', nameViewBlur);
                entrylms.alert(Lang.Workspace.enter_the_name);
                this.focus();
                Entry.attachEventListener(this, 'blur', nameViewBlur);
                return;
            }

            var nameViewArray = $('.entryPlaygroundSoundName');
            for (var i = 0; i < nameViewArray.length; i++) {
                if (
                    nameViewArray.eq(i).val() == nameView.value &&
                    nameViewArray[i] != this
                ) {
                    Entry.deAttachEventListener(this, 'blur', nameViewBlur);
                    entrylms.alert(Lang.Workspace.name_already_exists);
                    this.focus();
                    Entry.attachEventListener(this, 'blur', nameViewBlur);
                    return;
                }
            }
            var newValue = this.value;
            this.sound.name = newValue;
            Entry.playground.reloadPlayground();
        }

        nameView.onkeypress = Entry.Utils.blurWhenEnter;
        Entry.createElement('div')
            .addClass('entryPlaygroundSoundLength')
            .appendTo(element).innerHTML =
            sound.duration + ' ' + Lang.General.second;
    };

    p.toggleColourChooser = function(name) {
        if (name === 'foreground') {
            if (this.coloursWrapper.style.display === 'none') {
                this.coloursWrapper.style.display = 'block';
                this.backgroundsWrapper.style.display = 'none';
            } else {
                this.coloursWrapper.style.display = 'none';
            }
        } else if (name === 'background') {
            if (this.backgroundsWrapper.style.display === 'none') {
                this.backgroundsWrapper.style.display = 'block';
                this.coloursWrapper.style.display = 'none';
            } else {
                this.backgroundsWrapper.style.display = 'none';
            }
        }
    };

    p.setTextColour = function(colour, doNotToggle) {
        this.object.entity.setColour(colour);
        if (doNotToggle !== true) this.toggleColourChooser('foreground');
        $('.entryPlayground_fgColorDiv').css('backgroundColor', colour);
        $('#playgroundTextColorButtonImg').attr(
            'src',
            Entry.mediaFilePath + 'text_button_color_true.png'
        );
    };

    p.setBackgroundColour = function(colour, doNotToggle) {
        this.object.entity.setBGColour(colour);
        if (doNotToggle !== true) this.toggleColourChooser('background');
        $('.entryPlayground_bgColorDiv').css('backgroundColor', colour);
        $('#playgroundTextBgButtonImg').attr(
            'src',
            Entry.mediaFilePath + 'text_button_background_true.png'
        );
    };

    p.isTextBGMode = function() {
        return this.isTextBGMode_;
    };

    p.checkVariables = function() {
        if (Entry.forEBS) return;
        var blockMenu = this.blockMenu;
        var { lists_, variables_ } = Entry.variableContainer;

        if (lists_.length) blockMenu.unbanClass('listNotExist');
        else blockMenu.banClass('listNotExist');

        if (variables_.length) blockMenu.unbanClass('variableNotExist');
        else blockMenu.banClass('variableNotExist');
    };

    p.getViewMode = function() {
        return this.viewMode_;
    };

    p.banExpansionBlock = function() {
        var blockMenu = _.result(this.mainWorkspace, 'blockMenu');
        if (!blockMenu) return;

        Object.values(Entry.EXPANSION_BLOCK_LIST).forEach(block => {blockMenu.banClass(block.name, true);});
    }

    p.updateHW = function() {
        var blockMenu = _.result(this.mainWorkspace, 'blockMenu');
        if (!blockMenu) return;

        var hw = Entry.hw;
        if (hw && hw.connected) {
            blockMenu.banClass('arduinoDisconnected', true);

            hw.banHW();

            if (hw.hwModule) {
                blockMenu.banClass('arduinoConnect', true);
                blockMenu.unbanClass('arduinoConnected', true);
                blockMenu.unbanClass(hw.hwModule.name);
            } else {
                blockMenu.banClass('arduinoConnected', true);
                blockMenu.unbanClass('arduinoConnect', true);
            }
        } else {
            blockMenu.banClass('arduinoConnected', true);
            blockMenu.banClass('arduinoConnect', true);
            blockMenu.unbanClass('arduinoDisconnected', true);

            Entry.hw.banHW();
        }

        blockMenu.hwCodeOutdated = true;
        blockMenu._generateHwCode(true);
        blockMenu.reDraw();
    };

    p.toggleLineBreak = function(isLineBreak) {
        var { objectType, entity } = this.object || {};
        if (objectType != 'textBox') return;

        if (isLineBreak) {
            entity.setLineBreak(true);
            $('.entryPlayground_textArea').css('display', 'block');
            $('.entryPlayground_textBox').css('display', 'none');
            this.linebreakOffImage.src =
                Entry.mediaFilePath + 'text-linebreak-off-false.png';
            this.linebreakOnImage.src =
                Entry.mediaFilePath + 'text-linebreak-on-true.png';
            this.fontSizeWrapper.removeClass('entryHide');
            this._setFontFontUI();
        } else {
            entity.setLineBreak(false);
            $('.entryPlayground_textArea').css('display', 'none');
            $('.entryPlayground_textBox').css('display', 'block');
            this.linebreakOffImage.src =
                Entry.mediaFilePath + 'text-linebreak-off-true.png';
            this.linebreakOnImage.src =
                Entry.mediaFilePath + 'text-linebreak-on-false.png';
            this.fontSizeWrapper.addClass('entryHide');
        }
    };

    p.setFontAlign = function(fontAlign) {
        if (this.object.objectType != 'textBox') return;
        this.alignLeftBtn.removeClass('toggle');
        this.alignCenterBtn.removeClass('toggle');
        this.alignRightBtn.removeClass('toggle');
        switch (fontAlign) {
            case Entry.TEXT_ALIGN_LEFT:
                this.alignLeftBtn.addClass('toggle');
                break;
            case Entry.TEXT_ALIGN_CENTER:
                this.alignCenterBtn.addClass('toggle');
                break;
            case Entry.TEXT_ALIGN_RIGHT:
                this.alignRightBtn.addClass('toggle');
                break;
        }
        this.object.entity.setTextAlign(fontAlign);
    };

    p.hideBlockMenu = function() {
        this.mainWorkspace.getBlockMenu().hide();
    };

    p.showBlockMenu = function() {
        this.mainWorkspace.getBlockMenu().show();
    };

    p.getDom = function(query) {
        if (query.length) {
            switch (query.shift()) {
                case 'tabViewElements':
                    return this.tabViewElements[query.shift()];
                case 'blockMenu':
                    return this.blockMenu.getDom(query);
                case 'board':
                case 'overlayBoard':
                    return this.mainWorkspace.getCurrentBoard().getDom(query);
                case 'pictureAddButton':
                    return this._pictureAddButton;
                case 'soundAddButton':
                    return this._soundAddButton;
            }
        } else {
        }
    };

    p.applyTabOption = function() {
        this.textboxTab.addClass('entryRemove');
        this.pictureTab.addClass('entryRemove');
        this.soundTab.addClass('entryRemove');
        this.variableTab.addClass('entryRemove');
        if (Entry.pictureEditable) {
            this.pictureTab.removeClass('entryRemove');
            this.textboxTab.removeClass('entryRemove');
        }
        if (Entry.soundEditable) this.soundTab.removeClass('entryRemove');
        if (Entry.hasVariableManager)
            this.variableTab.removeClass('entryRemove');
    };
})(Entry.Playground.prototype);
