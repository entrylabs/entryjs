    /**
 * Playground is block construct area.
 * @fileoverview This manage playground.
 */
'use strict';

/**
 * Class for a playground.
 * This manage all view related with block.
 * @constructor
 */
Entry.Playground = function() {
    /**
     * apply menu blocks by object type
     * @type {dictionary}
     */
    this.menuBlocks_ = {};

    this.isTextBGMode_ = false;

    this.enableArduino = false;

    /**
     * playground's current view type
     * View types are 'default', 'code', 'picture', 'text', sound'
     * @type {string}
     */
    this.viewMode_ = 'default';
    Entry.addEventListener('textEdited', this.injectText);
    Entry.addEventListener('entryBlocklyChanged', this.editBlock);
    Entry.addEventListener('entryBlocklyMouseUp', this.mouseupBlock);
    Entry.addEventListener('hwChanged', this.updateHW);

};

/**
 * Control bar view generator.
 * @param {!Element} playgroundView playgroundView from Entry.
 * @param {?string} option for choose type of view.
 */
Entry.Playground.prototype.generateView = function(playgroundView, option) {
    /** @type {!Element} */
    this.view_ = playgroundView;
    this.view_.addClass('entryPlayground');
    if (!option || option == 'workspace') {
        this.view_.addClass('entryPlaygroundWorkspace');

        var tabView = Entry.createElement('div', 'entryCategoryTab');
        tabView.addClass('entryPlaygroundTabWorkspace');
        this.view_.appendChild(tabView);
        this.generateTabView(tabView);
        this.tabView_ = tabView;

        var curtainView = Entry.createElement('div', 'entryCurtain');
        curtainView.addClass('entryPlaygroundCurtainWorkspace');
        curtainView.addClass('entryRemove');
        var ment = Lang.Workspace.cannot_edit_click_to_stop.split('.');
        curtainView.innerHTML = ment[0] + '.<br/>' + ment[1];
        curtainView.addEventListener('click', function () {
            Entry.engine.toggleStop();
        });
        this.view_.appendChild(curtainView);
        this.curtainView_ = curtainView;

        if (Entry.pictureEditable) {
            var pictureView = Entry.createElement('div', 'entryPicture');
            pictureView.addClass('entryPlaygroundPictureWorkspace');
            pictureView.addClass('entryRemove');
            this.view_.appendChild(pictureView);
            this.generatePictureView(pictureView);
            this.pictureView_ = pictureView;
        }

        var textView = Entry.createElement('div', 'entryText');
        textView.addClass('entryPlaygroundTextWorkspace');
        textView.addClass('entryRemove');
        this.view_.appendChild(textView);
        this.generateTextView(textView);
        this.textView_ = textView;

        if (Entry.soundEditable) {
            var soundView = Entry.createElement('div', 'entrySound');
            soundView.addClass('entryPlaygroundSoundWorkspace');
            soundView.addClass('entryRemove');
            this.view_.appendChild(soundView);
            this.generateSoundView(soundView);
            this.soundView_ = soundView;
        }

        var defaultView = Entry.createElement('div', 'entryDefault');
        defaultView.addClass('entryPlaygroundDefaultWorkspace');
        this.view_.appendChild(defaultView);
        this.generateDefaultView(defaultView);
        this.defaultView_ = defaultView;

        //Code view must be append at last.
        var codeView = Entry.createElement('div', 'entryCode');
        codeView.addClass('entryPlaygroundCodeWorkspace');
        codeView.addClass('entryRemove');
        this.view_.appendChild(codeView);
        this.generateCodeView(codeView);
        this.codeView_ = codeView;

        var resizeHandle = Entry.createElement('div');
        resizeHandle.addClass('entryPlaygroundResizeWorkspace', 'entryRemove');
        this.resizeHandle_ = resizeHandle;
        this.view_.appendChild(resizeHandle);
        this.initializeResizeHandle(resizeHandle);

        /** @type {!Element} */
        this.codeView_ = codeView;

        Entry.addEventListener('run', function(e) {
            Entry.playground.curtainView_.removeClass('entryRemove');});
        Entry.addEventListener('stop', function(e) {
            Entry.playground.curtainView_.addClass('entryRemove');});
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
        curtainView.bindOnClick( function () {
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
            Entry.playground.curtainView_.removeClass('entryRemove');});
        Entry.addEventListener('stop', function(e) {
            Entry.playground.curtainView_.addClass('entryRemove');});
    }
};

/**
 * Generate default view.
 * default view is shown when object is not selected.
 * @param {!Element} defaultView
 * @return {Element}
 */
Entry.Playground.prototype.generateDefaultView = function(defaultView) {
    return defaultView;
};

/**
 * generate tab menus
 * @param {!Element} tabView
 * @return {Element}
 */
Entry.Playground.prototype.generateTabView = function(tabView) {
    var tabList = Entry.createElement('ul');
    tabList.addClass('entryTabListWorkspace');
    this.tabList_ = tabList;
    tabView.appendChild(tabList);

    this.tabViewElements = {};
    var codeTab = Entry.createElement('li', 'entryCodeTab');
    codeTab.innerHTML = Lang.Workspace.tab_code;
    codeTab.addClass('entryTabListItemWorkspace');
    codeTab.addClass('entryTabSelected');
    tabList.appendChild(codeTab);
    codeTab.bindOnClick(function(e) {
        Entry.playground.changeViewMode('code');
    });
    this.tabViewElements.code = codeTab;

    if (Entry.pictureEditable) {
        var pictureTab = Entry.createElement('li', 'entryPictureTab');
        pictureTab.innerHTML = Lang.Workspace.tab_picture;
        pictureTab.addClass('entryTabListItemWorkspace');
        tabList.appendChild(pictureTab);
        pictureTab.bindOnClick(function(e) {
            Entry.playground.changeViewMode('picture');
        });
        this.tabViewElements.picture = pictureTab;

        var textboxTab = Entry.createElement('li', 'entryTextboxTab');
        textboxTab.innerHTML = Lang.Workspace.tab_text;
        textboxTab.addClass('entryTabListItemWorkspace');
        tabList.appendChild(textboxTab);
        textboxTab.bindOnClick(function(e) {
            Entry.playground.changeViewMode('text');
        });
        this.tabViewElements.text = textboxTab;
        textboxTab.addClass('entryRemove');
    }

    if (Entry.soundEditable) {
        var soundTab = Entry.createElement('li', 'entrySoundTab');
        soundTab.innerHTML = Lang.Workspace.tab_sound;
        soundTab.addClass('entryTabListItemWorkspace');
        tabList.appendChild(soundTab);
        soundTab.bindOnClick(function(e) {
            Entry.playground.changeViewMode('sound');
        });
        this.tabViewElements.sound = soundTab;
    }

    if (Entry.hasVariableManager) {
        var variableTab = Entry.createElement('li', 'entryVariableTab');
        variableTab.innerHTML = Lang.Workspace.tab_attribute;
        variableTab.addClass('entryTabListItemWorkspace');
        variableTab.addClass('entryVariableTabWorkspace');
        tabList.appendChild(variableTab);
        variableTab.bindOnClick(function(e) {
            Entry.playground.toggleOnVariableView();
            Entry.playground.changeViewMode('variable');
        });
        this.tabViewElements.variable = variableTab;
    }

};
/**
 * Inject Blockly and generate code view
 * @param {!Element} codeView
 * @return {Element}
 */
Entry.Playground.prototype.generateCodeView = function(codeView) {
    if (!Entry.type || Entry.type == 'workspace') {
        var categoryView = Entry.createElement('div', 'entryCategory');
        categoryView.addClass('entryCategoryWorkspace');
        codeView.appendChild(categoryView);
        this.categoryView_ = categoryView;

        var categoryListView = Entry.createElement('ul', 'entryCategoryList');
        categoryListView.addClass('entryCategoryListWorkspace');
        categoryView.appendChild(categoryListView);
        this.categoryListView_ = categoryListView;

        var blockMenuView = Entry.createElement('div', 'entryBlocklyWorkspace');
        blockMenuView.addClass('entryBlockMenuWorkspace');
        codeView.appendChild(blockMenuView);
        $(blockMenuView).mouseenter(function(e) {
            if (Entry.playground.resizing)
                return;
            Entry.playground.focusBlockMenu = true;
            var width = Blockly.mainWorkspace.blockMenu.blockMenuWidth + 84;
            if (width > Entry.interfaceState.menuWidth) {
                this.widthBackup = Entry.interfaceState.menuWidth;
                $('.entryBlockMenuWorkspace>svg').stop().animate({
                    width: width - 64
                }, 200);
                //Entry.resizeElement({menuWidth: width})
            }
        });
        $(blockMenuView).mouseleave(function(e) {
            if (Entry.playground.resizing)
                return;
            if (blockMenuView.widthBackup &&
                !Blockly.mainWorkspace.blockMenu.hasStalkerBlock)
                $('.entryBlockMenuWorkspace>svg').stop().animate({
                    width: this.widthBackup - 64
                }, 200);
            delete this.widthBackup;
            delete Entry.playground.focusBlockMenu;
        });
        Entry.addEventListener('entryBlocklyChanged', function(e) {
            var blockMenuView = Entry.playground.blockMenuView_;
            if (blockMenuView.widthBackup)
                Entry.resizeElement({menuWidth: blockMenuView.widthBackup});
            delete blockMenuView.widthBackup;
            delete Entry.playground.focusBlockMenu;
        });
        this.blockMenuView_ = blockMenuView;

        var variableView = this.createVariableView();
        codeView.appendChild(variableView);
        this.variableView_ = variableView;

        var blocklyView = Entry.createElement('div', 'entryBlockly');
        blocklyView.addClass('entryBlocklyWorkspace');
        this.blocklyView_ = blocklyView;
        Entry.bindAnimationCallback(this.blocklyView_,
            function(e) {Blockly.fireUiEvent(window, 'resize');
            Entry.playground.blocklyView_.removeClass('foldOut');
        });
        codeView.appendChild(blocklyView);

        var XML = Entry.parseTexttoXML('<xml></xml>');
        Blockly.inject(
            blocklyView,
            {
                path: Entry.blockInjectPath || '.././',
                toolbox: XML,
                trashcan: true,
                blockmenu: this.blockMenuView_,
                mediaFilePath: Entry.mediaFilePath
            });
        Blockly.mainWorkspace.flyout_.hide();
        Blockly.mainWorkspace.blockMenu.hide();
        document.addEventListener("blocklyWorkspaceChange", this.syncObjectWithEvent, false);

        /*
        var blockHelpBtn = Entry.createElement('button', 'entryBlockHelpBtn');
        blockHelpBtn.addClass('entryBlockHelpBtn', 'entryBtn');
        blockHelpBtn.bindOnClick(function() {
            Entry.helper.blockHelperOn();
        });
        blocklyView.appendChild(blockHelpBtn);
       */

        this.blockMenu = Blockly.mainWorkspace.blockMenu;
        Entry.hw.banHW();
        return codeView;
    } else if (Entry.type == 'phone') {
        var categoryView = Entry.createElement('div', 'entryCategory');
        categoryView.addClass('entryCategoryPhone');
        codeView.appendChild(categoryView);
        this.categoryView_ = categoryView;

        var categoryListView = Entry.createElement('ul', 'entryCategoryList');
        categoryListView.addClass('entryCategoryListPhone');
        categoryView.appendChild(categoryListView);
        this.categoryListView_ = categoryListView;


        var variableView = this.createVariableView();
        codeView.appendChild(variableView);
        this.variableView_ = variableView;


        var blocklyView = Entry.createElement('div', 'entryBlockly');
        blocklyView.addClass('entryBlocklyPhone');
        this.blocklyView_ = blocklyView;
        codeView.appendChild(blocklyView);

        var XML = Entry.parseTexttoXML('<xml></xml>');
        Blockly.inject(
            blocklyView,
            {
                path: Entry.blockInjectPath || '.././',
                toolbox: XML,
                trashcan: true,
                mediaFilePath: Entry.mediaFilePath
            });
        Blockly.mainWorkspace.flyout_.autoClose = true;
        Blockly.mainWorkspace.flyout_.hide();
        document.addEventListener("blocklyWorkspaceChange", this.syncObjectWithEvent, false);
        this.blockMenu = Blockly.mainWorkspace.flyout_;
        Entry.hw.banHW();
        return codeView;
    }
};

/**
 * Generate picture view.
 * @param {!Element} pictureView
 * @return {Element}
 */
Entry.Playground.prototype.generatePictureView = function(PictureView) {
    if (Entry.type == 'workspace') {
        var pictureAdd = Entry.createElement('div', 'entryAddPicture');
        pictureAdd.addClass('entryPlaygroundAddPicture');
        pictureAdd.bindOnClick(function(e) {
            Entry.dispatchEvent('openPictureManager');
        });
        var innerPictureAdd = Entry.createElement('div', 'entryAddPictureInner');
        innerPictureAdd.addClass('entryPlaygroundAddPictureInner');
        innerPictureAdd.innerHTML = Lang.Workspace.picture_add;
        pictureAdd.appendChild(innerPictureAdd);
        PictureView.appendChild(pictureAdd);
        var pictureList = Entry.createElement('ul', 'entryPictureList');
        pictureList.addClass('entryPlaygroundPictureList');
        if ($)
            $(pictureList).sortable({
                start: function(event, ui) {
                    ui.item.data('start_pos', ui.item.index());
                },
                stop: function(event, ui){
                    var start = ui.item.data('start_pos');
                    var end = ui.item.index();
                    Entry.playground.movePicture(start, end);
                },
                axis: 'y'
            });
        PictureView.appendChild(pictureList);
        this.pictureListView_ = pictureList;

        var painterView = Entry.createElement('div', 'entryPainter');
        painterView.addClass('entryPlaygroundPainter');
        PictureView.appendChild(painterView);

        this.painter = new Entry.Painter();
        //this.painter.generateView(painterView);
        this.painter.initialize(painterView);

    } else if (Entry.type == 'phone') {
        var pictureAdd = Entry.createElement('div', 'entryAddPicture');
        pictureAdd.addClass('entryPlaygroundAddPicturePhone');
        pictureAdd.bindOnClick(function(e) {
            Entry.dispatchEvent('openPictureManager');
        });
        var innerPictureAdd = Entry.createElement('div', 'entryAddPictureInner');
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
                stop: function(event, ui){
                    var start = ui.item.data('start_pos');
                    var end = ui.item.index();
                    Entry.playground.movePicture(start, end);
                },
                axis: 'y'
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
Entry.Playground.prototype.generateTextView = function(textView) {
    var wrap = Entry.createElement("div");
    textView.appendChild(wrap);
    var textProperties = Entry.createElement("div");
    textProperties.addClass("textProperties");
    wrap.appendChild(textProperties);
    var fontWrapper = Entry.createElement('div');
    fontWrapper.addClass('entryTextFontSelect');
    textProperties.appendChild(fontWrapper);

    var fontName = Entry.createElement('select', 'entryPainterAttrFontName');
    fontName.addClass('entryPlaygroundPainterAttrFontName',
                      'entryTextFontSelecter');
    fontName.size = '1';
    fontName.onchange = function(evt) {
        var font = evt.target.value;
        Entry.playground.object.entity.setFontType(font);
    };
    for (var i=0; i<Entry.fonts.length; i++) {
        var font = Entry.fonts[i];
        var element = Entry.createElement('option');
        element.value = font.family;
        element.innerHTML = font.name;

        fontName.appendChild(element);
    }
    this.fontName_ = fontName;
    fontWrapper.appendChild(fontName);

    var textButtons = Entry.createElement("ul");
    textButtons.addClass("entryPlayground_text_buttons");
    textProperties.appendChild(textButtons);

    var alignLeftBtn = Entry.createElement("li");
    alignLeftBtn.addClass("entryPlaygroundTextAlignLeft");
    alignLeftBtn.bindOnClick(function(e) {
        Entry.playground.setFontAlign(Entry.TEXT_ALIGN_LEFT);
    });
    textButtons.appendChild(alignLeftBtn);
    this.alignLeftBtn = alignLeftBtn;

    var alignCenterBtn = Entry.createElement("li");
    alignCenterBtn.addClass("entryPlaygroundTextAlignCenter");
    alignCenterBtn.bindOnClick(function(e) {
        Entry.playground.setFontAlign(Entry.TEXT_ALIGN_CENTER);
    });
    textButtons.appendChild(alignCenterBtn);
    this.alignCenterBtn = alignCenterBtn;

    var alignRightBtn = Entry.createElement("li");
    alignRightBtn.addClass("entryPlaygroundTextAlignRight");
    alignRightBtn.bindOnClick(function(e) {
        Entry.playground.setFontAlign(Entry.TEXT_ALIGN_RIGHT);
    });
    textButtons.appendChild(alignRightBtn);
    this.alignRightBtn = alignRightBtn;

    var boldWrap = Entry.createElement("li");
    textButtons.appendChild(boldWrap);
    var boldButton = Entry.createElement("a");
    boldWrap.appendChild(boldButton);
    boldButton.bindOnClick(function() {
        var isBold = Entry.playground.object.entity.toggleFontBold() || false;
        if (isBold) {
            boldImage.src = Entry.mediaFilePath + 'text_button_bold_true.png';
        } else {
            boldImage.src = Entry.mediaFilePath + 'text_button_bold_false.png';
        }

    });
    var boldImage = Entry.createElement("img", "entryPlaygroundText_boldImage");
    boldButton.appendChild(boldImage);
    boldImage.src = Entry.mediaFilePath + 'text_button_bold_false.png';

    var underLineWrap = Entry.createElement("li");
    textButtons.appendChild(underLineWrap);
    var underLineButton = Entry.createElement("a");
    underLineWrap.appendChild(underLineButton);
    underLineButton.bindOnClick(function() {
        //toggle
        var underLineState = !Entry.playground.object.entity.getUnderLine() || false;
        underLineImage.src = Entry.mediaFilePath + 'text_button_underline_'+
            underLineState +'.png';
        Entry.playground.object.entity.setUnderLine(underLineState);

    });
    var underLineImage = Entry.createElement("img", "entryPlaygroundText_underlineImage");
    underLineButton.appendChild(underLineImage);
    underLineImage.src = Entry.mediaFilePath + 'text_button_underline_false.png';

    var italicWrap = Entry.createElement("li");
    textButtons.appendChild(italicWrap);
    var italicButton = Entry.createElement("a");
    italicWrap.appendChild(italicButton);
    italicButton.bindOnClick(function() {
        //toggle
        var isItalic = Entry.playground.object.entity.toggleFontItalic();
        if (isItalic) {
            italicImage.src = Entry.mediaFilePath + 'text_button_italic_true.png';
        } else {
            italicImage.src = Entry.mediaFilePath + '/text_button_italic_false.png';
        }

    });

    var italicImage = Entry.createElement("img", "entryPlaygroundText_italicImage");
    italicButton.appendChild(italicImage);
    italicImage.src = Entry.mediaFilePath + 'text_button_italic_false.png';

    var strikeWrap = Entry.createElement("li");
    textButtons.appendChild(strikeWrap);
    var strikeButton = Entry.createElement("a");
    strikeWrap.appendChild(strikeButton);
    strikeButton.bindOnClick(function() {
        //toggle
        var strikeState = !Entry.playground.object.entity.getStrike() || false;
        Entry.playground.object.entity.setStrike(strikeState);
        strikeImage.src = Entry.mediaFilePath + 'text_button_strike_'+
            strikeState +'.png';
    });
    var strikeImage = Entry.createElement("img", "entryPlaygroundText_strikeImage");
    strikeButton.appendChild(strikeImage);
    strikeImage.src = Entry.mediaFilePath + 'text_button_strike_false.png';

    var foregroundWrap = Entry.createElement("li");
    textButtons.appendChild(foregroundWrap);
    var foregroundButton = Entry.createElement("a");
    foregroundWrap.appendChild(foregroundButton);
    foregroundButton.bindOnClick(function() {
        Entry.playground.toggleColourChooser('foreground');
    });
    var foregroundImage = Entry.createElement("img");
    foregroundButton.appendChild(foregroundImage);
    foregroundImage.src = Entry.mediaFilePath + 'text_button_color_false.png';

    var backgroundWrap = Entry.createElement("li");
    textButtons.appendChild(backgroundWrap);
    var backgroundButton = Entry.createElement("a");
    backgroundWrap.appendChild(backgroundButton);
    backgroundButton.bindOnClick(function() {
        Entry.playground.toggleColourChooser('background');
    });
    var backgroundImage = Entry.createElement("img");
    backgroundButton.appendChild(backgroundImage);
    backgroundImage.src = Entry.mediaFilePath + 'text_button_background_false.png';

    var fgColorDiv = Entry.createElement("div");
    fgColorDiv.addClass("entryPlayground_fgColorDiv");
    var bgColorDiv = Entry.createElement("div");
    bgColorDiv.addClass("entryPlayground_bgColorDiv");

    textProperties.appendChild(fgColorDiv);
    textProperties.appendChild(bgColorDiv);

    var coloursWrapper = Entry.createElement("div");
    coloursWrapper.addClass("entryPlaygroundTextColoursWrapper");
    this.coloursWrapper = coloursWrapper;
    wrap.appendChild(coloursWrapper);
    var colours = Entry.getColourCodes();
    for (var i=0; i<colours.length; i++) {
        var cell = Entry.createElement("div");
        cell.addClass("modal_colour");
        cell.setAttribute("colour", colours[i]);
        cell.style.backgroundColor = colours[i];
        if (i===0)
            cell.addClass("modalColourTrans");
        cell.bindOnClick(function(e) {
            Entry.playground.setTextColour(e.target.getAttribute("colour"));
        });
        coloursWrapper.appendChild(cell);
    }
    coloursWrapper.style.display = 'none';

    var backgroundsWrapper = Entry.createElement("div");
    backgroundsWrapper.addClass("entryPlaygroundTextBackgroundsWrapper");
    this.backgroundsWrapper = backgroundsWrapper;
    wrap.appendChild(backgroundsWrapper);
    for (var i=0; i<colours.length; i++) {
        var cell = Entry.createElement("div");
        cell.addClass("modal_colour");
        cell.setAttribute("colour", colours[i]);
        cell.style.backgroundColor = colours[i];
        if (i===0)
            cell.addClass("modalColourTrans");
        cell.bindOnClick(function(e) {
            Entry.playground.setBackgroundColour(e.target.getAttribute("colour"));
        });
        backgroundsWrapper.appendChild(cell);
    }
    backgroundsWrapper.style.display = 'none';

    var textEditInput = Entry.createElement("input");
    textEditInput.addClass("entryPlayground_textBox");
    textEditInput.onkeyup = function() {
        Entry.playground.object.setText(this.value);
        Entry.playground.object.entity.setText(this.value);
    };
    textEditInput.onblur = function() {
        Entry.dispatchEvent('textEdited');
    };
    this.textEditInput = textEditInput;
    wrap.appendChild(textEditInput);

    var textEditArea = Entry.createElement("textarea");
    textEditArea.addClass("entryPlayground_textArea");
    textEditArea.style.display = 'none';
    textEditArea.onkeyup = function() {
        Entry.playground.object.setText(this.value);
        Entry.playground.object.entity.setText(this.value);
    };
    textEditArea.onblur = function() {
        Entry.dispatchEvent('textEdited');
    };
    this.textEditArea = textEditArea;
    wrap.appendChild(textEditArea);

    var fontSizeWrapper = Entry.createElement("div");
    fontSizeWrapper.addClass("entryPlaygroundFontSizeWrapper");
    wrap.appendChild(fontSizeWrapper);
    this.fontSizeWrapper = fontSizeWrapper;

    var fontSizeSlider = Entry.createElement("div");
    fontSizeSlider.addClass("entryPlaygroundFontSizeSlider");
    fontSizeWrapper.appendChild(fontSizeSlider);

    var fontSizeIndiciator = Entry.createElement("div");
    fontSizeIndiciator.addClass("entryPlaygroundFontSizeIndicator");
    fontSizeSlider.appendChild(fontSizeIndiciator);
    this.fontSizeIndiciator = fontSizeIndiciator;

    var fontSizeKnob = Entry.createElement("div");
    fontSizeKnob.addClass("entryPlaygroundFontSizeKnob");
    fontSizeSlider.appendChild(fontSizeKnob);
    this.fontSizeKnob = fontSizeKnob;

    var fontSizeLabel = Entry.createElement("div");
    fontSizeLabel.addClass("entryPlaygroundFontSizeLabel");
    fontSizeLabel.innerHTML = "글자 크기";
    fontSizeWrapper.appendChild(fontSizeLabel);

    var isFontSizing = false;
    var resizeOffset = 0;
    fontSizeKnob.onmousedown = function(e) {
        isFontSizing = true;
        resizeOffset = $(fontSizeSlider).offset().left;
        //resizeOffset = e.offsetX;
    };
    document.addEventListener('mousemove', function(e) {
        if (isFontSizing) {
            var left = e.pageX - resizeOffset;
            left = Math.max(left, 5);
            left = Math.min(left, 88);
            fontSizeKnob.style.left = left + "px";
            left /= 0.88;
            fontSizeIndiciator.style.width = left + '%';
            Entry.playground.object.entity.setFontSize(left);
        }
    });
    document.addEventListener('mouseup', function(e) {
        isFontSizing = false;
    });

    var linebreakWrapper = Entry.createElement("div");
    linebreakWrapper.addClass("entryPlaygroundLinebreakWrapper");
    wrap.appendChild(linebreakWrapper);

    var linebreakHorizontal = Entry.createElement("hr");
    linebreakHorizontal.addClass("entryPlaygroundLinebreakHorizontal");
    linebreakWrapper.appendChild(linebreakHorizontal);

    var linebreakButtons = Entry.createElement("div");
    linebreakButtons.addClass("entryPlaygroundLinebreakButtons");
    linebreakWrapper.appendChild(linebreakButtons);

    var linebreakOffImage = Entry.createElement("img");
    linebreakOffImage.bindOnClick(function() {
        Entry.playground.toggleLineBreak(false);
        linebreakDescTitle.innerHTML = Lang.Menus.linebreak_off_desc_1;
        linebreakDescList1.innerHTML = Lang.Menus.linebreak_off_desc_2;
        linebreakDescList2.innerHTML = Lang.Menus.linebreak_off_desc_3;
    });

    linebreakOffImage.src = Entry.mediaFilePath + 'text-linebreak-off-true.png';
    linebreakButtons.appendChild(linebreakOffImage);
    this.linebreakOffImage = linebreakOffImage;

    var linebreakOnImage = Entry.createElement("img");
    linebreakOnImage.bindOnClick(function() {
        Entry.playground.toggleLineBreak(true);
        linebreakDescTitle.innerHTML = Lang.Menus.linebreak_on_desc_1;
        linebreakDescList1.innerHTML = Lang.Menus.linebreak_on_desc_2;
        linebreakDescList2.innerHTML = Lang.Menus.linebreak_on_desc_3;
    });

    linebreakOnImage.src = Entry.mediaFilePath + 'text-linebreak-on-false.png';
    linebreakButtons.appendChild(linebreakOnImage);
    this.linebreakOnImage = linebreakOnImage;

    var linebreakDescription = Entry.createElement("div");
    linebreakDescription.addClass("entryPlaygroundLinebreakDescription");
    linebreakWrapper.appendChild(linebreakDescription);

    var linebreakDescTitle = Entry.createElement("p");
    linebreakDescTitle.innerHTML = Lang.Menus.linebreak_off_desc_1;
    linebreakDescription.appendChild(linebreakDescTitle);

    var linebreakDescUL = Entry.createElement("ul");
    linebreakDescription.appendChild(linebreakDescUL);
    var linebreakDescList1 = Entry.createElement("li");
    linebreakDescList1.innerHTML = Lang.Menus.linebreak_off_desc_2;
    linebreakDescUL.appendChild(linebreakDescList1);
    var linebreakDescList2 = Entry.createElement("li");
    linebreakDescList2.innerHTML = Lang.Menus.linebreak_off_desc_3;
    linebreakDescUL.appendChild(linebreakDescList2);


};

/**
 * Generate sound view.
 * default view is shown when object is not selected.
 * @param {!Element} codeView
 * @return {Element}
 */
Entry.Playground.prototype.generateSoundView = function(SoundView) {
    if (Entry.type == 'workspace') {
        var soundAdd = Entry.createElement('div', 'entryAddSound');
        soundAdd.addClass('entryPlaygroundAddSound');
        soundAdd.bindOnClick(function(e) {
            Entry.dispatchEvent('openSoundManager');
        });
        var innerSoundAdd = Entry.createElement('div', 'entryAddSoundInner');
        innerSoundAdd.addClass('entryPlaygroundAddSoundInner');
        innerSoundAdd.innerHTML = Lang.Workspace.sound_add;
        soundAdd.appendChild(innerSoundAdd);
        SoundView.appendChild(soundAdd);
        var soundList = Entry.createElement('ul', 'entrySoundList');
        soundList.addClass('entryPlaygroundSoundList');
        if ($)
            $(soundList).sortable({
                start: function(event, ui) {
                    ui.item.data('start_pos', ui.item.index());
                },
                stop: function(event, ui){
                    var start = ui.item.data('start_pos');
                    var end = ui.item.index();
                    Entry.playground.moveSound(start, end);
                },
                axis: 'y'
            });
        SoundView.appendChild(soundList);
        this.soundListView_ = soundList;
    } else if (Entry.type == 'phone'){
        var soundAdd = Entry.createElement('div', 'entryAddSound');
        soundAdd.addClass('entryPlaygroundAddSoundPhone');
        soundAdd.bindOnClick(function(e) {
            Entry.dispatchEvent('openSoundManager');
        });
        var innerSoundAdd = Entry.createElement('div', 'entryAddSoundInner');
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
                stop: function(event, ui){
                    var start = ui.item.data('start_pos');
                    var end = ui.item.index();
                    Entry.playground.moveSound(start, end);
                },
                axis: 'y'
            });
        SoundView.appendChild(soundList);
        this.soundListView_ = soundList;
    }
};

/**
 * Inject object
 * @param {?Entry.EntryObject} object
 */
Entry.Playground.prototype.injectObject = function(object) {
    /** @type {Entry.Entryobject} */
    if (!object) {
        this.changeViewMode('code');
        this.object = null;
        return;
    }
    if (object === this.object)
        return;
    if (this.object) {
        this.syncObject(this.object);
        this.object.toggleInformation(false);
    }
    this.object = object;
    this.setMenu(object.objectType);

    this.injectCode();
    if (object.objectType == 'sprite' && Entry.pictureEditable) {
        if (this.tabViewElements.text)
            this.tabViewElements.text.addClass("entryRemove");
        if (this.tabViewElements.picture)
            this.tabViewElements.picture.removeClass("entryRemove");
    } else if (object.objectType == 'textBox') {
        if (this.tabViewElements.picture)
            this.tabViewElements.picture.addClass("entryRemove");
        if (this.tabViewElements.text)
            this.tabViewElements.text.removeClass("entryRemove");
    }

    var viewMode = this.viewMode_;
    if (viewMode == 'default')
        this.changeViewMode('code');
    else if ((viewMode == 'picture' || viewMode == 'text' ) && object.objectType == 'textBox')
        this.changeViewMode('text');
    else if ((viewMode == 'text' || viewMode == 'picture') && object.objectType == 'sprite')
        this.changeViewMode('picture');
    else if (viewMode == 'sound')
        this.changeViewMode('sound');

    if (!this.menuInjected)
        this.selectMenu(0);
};

/**
 * Inject code
 */
Entry.Playground.prototype.injectCode = function() {
    var object = this.object;
    Blockly.mainWorkspace.clear();
    Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, object.script);

    var blockXML = object.script;
    var veryLeftX = 0;
    var veryTopY = 0;
    var veryLeftBlock = null;

    $(blockXML).children("block").each(function(index) {
        var x = Number($(this).attr('x'));
        var y = Number($(this).attr('y'));

        if(index == 0) {
            veryLeftX = x;
            veryTopY = y;
            veryLeftBlock = this;
        }

        if(x < veryLeftX) {
            veryLeftX = x; //most left-located X coordinate
            veryLeftBlock = this; //most left-located block for this point
        }

        if(y < veryTopY) {
            varyTopY = y; //most top-located Y coordinate for this point
        }
    });

    //adjusing scroll bar by most left-located block
    if(veryLeftBlock != null) {
        var targetX = Number($(veryLeftBlock).attr('x'));
        var targetY = Number($(veryLeftBlock).attr('y'));

        var metrics = Blockly.mainWorkspace.getMetrics();

        var adjustingX = (metrics.viewWidth * 0.1).toFixed(1); 
        var adjustingY = (metrics.viewHeight * 0.4).toFixed(1); 

        if(targetY == veryTopY) 
            adjustingY = (metrics.viewHeight * 0.1).toFixed(1);

        var scrollX = targetX - metrics.contentLeft - adjustingX;  
        var scrollY = targetY - metrics.contentTop - adjustingY;

        Blockly.mainWorkspace.scrollbar.set(scrollX, scrollY);
        
        //this.adjustScroll(0, 0); 
    }
};

Entry.Playground.prototype.adjustScroll = function(xc, yc) {
  var hScroll = Blockly.mainWorkspace.scrollbar.hScroll;
  var vScroll = Blockly.mainWorkspace.scrollbar.vScroll;
  hScroll.svgGroup_.setAttribute('opacity', '1');
  vScroll.svgGroup_.setAttribute('opacity', '1');
  
  if(Blockly.mainWorkspace.getMetrics()) {
    Blockly.removeAllRanges();
    var metrics = Blockly.mainWorkspace.getMetrics();
    var x = xc;
    var y = yc;
    x = Math.min(x, -metrics.contentLeft);
    y = Math.min(y, -metrics.contentTop);
    x = Math.max(x, metrics.viewWidth - metrics.contentLeft -
                 metrics.contentWidth);
    y = Math.max(y, metrics.viewHeight - metrics.contentTop -
                 metrics.contentHeight);

    Blockly.mainWorkspace.scrollbar.set(-x - metrics.contentLeft,
                                        -y - metrics.contentTop);
  
    }    
};
/**
 * Inject picture
 */
Entry.Playground.prototype.injectPicture = function() {
    var view = this.pictureListView_;
    if (!view)
        return;
    while (view.hasChildNodes()) {
        view.removeChild(view.lastChild);
    }
    if (this.object) {
        var pictures = this.object.pictures;
        for (var i=0, len=pictures.length; i<len; i++) {
            var element = pictures[i].view;
            if (!element)
                console.log(element);
            element.orderHolder.innerHTML = i+1;
            view.appendChild(element);
        }
        this.selectPicture(this.object.selectedPicture);
    } else {
        Entry.dispatchEvent('pictureClear');
    }
};

/**
 * Add picture
 * @param {picture model} picture
 */
Entry.Playground.prototype.addPicture = function(picture, NotForView) {
    var tempPicture = Entry.cloneSimpleObject(picture);
    delete tempPicture.id;
    delete tempPicture.view;

    picture = JSON.parse(JSON.stringify(tempPicture));
    picture.id = Entry.generateHash();
    picture.name = Entry.getOrderedName(picture.name, this.object.pictures);

    this.generatePictureElement(picture);
    this.object.addPicture(picture);
    this.injectPicture();
    this.selectPicture(picture);
};

/**
 * set picture
 * @param {picture}
 */
Entry.Playground.prototype.setPicture = function(picture) {
    var element = Entry.container.getPictureElement(picture.id);
    var $element = $(element);
    if(element) {
        picture.view = element;
        element.picture = picture;

        var thumbnailView = $element.find('#t_'+picture.id)[0];
        if (picture.fileurl) {
            thumbnailView.style.backgroundImage = 'url("' + picture.fileurl + '")';
        } else {
            // deprecated
            var fileName = picture.filename;
            thumbnailView.style.backgroundImage =
                'url("' + Entry.defaultPath + '/uploads/' + fileName.substring(0, 2) + '/' +
                fileName.substring(2, 4) + '/thumb/' + fileName + '.png")';
        }
        var sizeView = $element.find('#s_'+picture.id)[0];
        sizeView.innerHTML = picture.dimension.width + ' X ' +
            picture.dimension.height;
    }

    Entry.container.setPicture(picture);
    // Entry.playground.object.setPicture(picture);
};

/**
 * Clone picture
 * @param {!String} pictureId
 */
Entry.Playground.prototype.clonePicture = function(pictureId) {
    var sourcePicture = Entry.playground.object.getPicture(pictureId);
    this.addPicture(sourcePicture, true);
};

/**
 * Select picture
 * @param {picture}
 */
Entry.Playground.prototype.selectPicture = function(picture) {
    var pictures = this.object.pictures;
    for (var i = 0, len=pictures.length; i<len; i++) {
        var target = pictures[i];
        if (target.id === picture.id)
            target.view.addClass('entryPictureSelected');
        else
            target.view.removeClass('entryPictureSelected');
    }

    var objectId_;
    if(picture && picture.id) {
        objectId_ = Entry.container.selectPicture(picture.id);
    }

    if( this.object.id === objectId_) {
        Entry.dispatchEvent('pictureSelected', picture);
    }
};

/**
 * Move picture in this.object.pictures
 * this method is for sortable
 * @param {!number} start
 * @param {!number} end
 */
Entry.Playground.prototype.movePicture = function(start, end) {
    this.object.pictures.splice(
        end, 0, this.object.pictures.splice(start, 1)[0]);
    this.injectPicture();
    Entry.stage.sortZorder();
};

/**
 * Inject text
 */
Entry.Playground.prototype.injectText = function() {
    //if statement for handle event call
    if (Entry.playground.object) {
        Entry.playground.textEditInput.value =
            Entry.playground.object.entity.getText();
        Entry.playground.textEditArea.value =
            Entry.playground.object.entity.getText();
        Entry.playground.fontName_.value =
            Entry.playground.object.entity.getFontName();

        if (Entry.playground.object.entity.font) {
            var isBold = Entry.playground.object.entity.font.indexOf("bold") > -1 || false;
            $("#entryPlaygroundText_boldImage").attr('src', Entry.mediaFilePath + 'text_button_bold_'+isBold+'.png');

            var isItalic = Entry.playground.object.entity.font.indexOf("italic") > -1 || false;
            $("#entryPlaygroundText_italicImage").attr('src', Entry.mediaFilePath + 'text_button_italic_'+isItalic+'.png');
        }

        var isUnderLine = Entry.playground.object.entity.getUnderLine() || false;
        $("#entryPlaygroundText_underlineImage").attr('src', Entry.mediaFilePath + 'text_button_underline_'+isUnderLine+'.png');

        var isStrike = Entry.playground.object.entity.getStrike() || false;
        $("#entryPlaygroundText_strikeImage").attr('src', Entry.mediaFilePath + 'text_button_strike_'+isStrike+'.png');

        $('.entryPlayground_fgColorDiv').css('backgroundColor', Entry.playground.object.entity.colour);
        $('.entryPlayground_bgColorDiv').css('backgroundColor', Entry.playground.object.entity.bgColour);

        Entry.playground.toggleLineBreak(
            Entry.playground.object.entity.getLineBreak());

        Entry.playground.setFontAlign(
            Entry.playground.object.entity.getTextAlign());

        var fontSize = Entry.playground.object.entity.getFontSize();
        Entry.playground.fontSizeIndiciator.style.width = fontSize + '%';
        Entry.playground.fontSizeKnob.style.left = (fontSize * 0.88) + 'px';
    }
};

/**
 * Inject sound
 */
Entry.Playground.prototype.injectSound = function() {
    var view = this.soundListView_;
    if (!view)
        return;
    while (view.hasChildNodes()) {
        view.removeChild(view.lastChild);
    }
    if (this.object) {
        var sounds = this.object.sounds;
        for (var i=0, len=sounds.length; i<len; i++) {
            var element = sounds[i].view;
            element.orderHolder.innerHTML = i+1;
            view.appendChild(element);
        }
    }
};

/**
 * Move sound in this.object.sounds
 * this method is for sortable
 * @param {!number} start
 * @param {!number} end
 */
Entry.Playground.prototype.moveSound = function(start, end) {
    this.object.sounds.splice(
        end, 0, this.object.sounds.splice(start, 1)[0]);
    this.updateListViewOrder('sound');
    Entry.stage.sortZorder();
};

/**
 * Add sound
 * @param {sound model} sound
 * @param {boolean} NotForView if this is true, add element into object also.
 */
Entry.Playground.prototype.addSound = function(sound, NotForView) {
    var tempSound = Entry.cloneSimpleObject(sound);
    delete tempSound.view;
    delete tempSound.id;

    sound = JSON.parse(JSON.stringify(tempSound));
    sound.id = Entry.generateHash();
    sound.name = Entry.getOrderedName(sound.name, this.object.sounds);

    this.generateSoundElement(sound);
    this.object.addSound(sound);
    this.injectSound();
};

/**
 * select view mode
 * @param {string} viewType
 */
Entry.Playground.prototype.changeViewMode = function(viewType) {
    for (var i in this.tabViewElements) {
        var tab = this.tabViewElements[i];
        tab.removeClass('entryTabSelected');
    }
    if (viewType != 'default')
        this.tabViewElements[viewType].addClass('entryTabSelected');
    if (viewType == 'variable')
        return;
    var views = this.view_.children;
    this.viewMode_ = viewType;
    for (var i = 0; i<views.length; i++) {
        var view = views[i];
        if (view.id.toUpperCase().indexOf(viewType.toUpperCase()) > -1)
            view.removeClass('entryRemove');
        else
            view.addClass('entryRemove');
    }

    if (viewType == 'picture' && (!this.pictureView_.object ||
        this.pictureView_.object != this.object)) {
        this.pictureView_.object = this.object;
        this.injectPicture();
    } else if (viewType == 'sound' && (!this.soundView_.object ||
        this.soundView_.object != this.object)) {
        this.soundView_.object = this.object;
        this.injectSound();
    } else if (viewType == 'text' && this.object.objectType == 'textBox' ||
        (this.textView_.object != this.object)) {
        this.textView_.object = this.object;
        this.injectText();
    }

    if (viewType == 'code' && this.resizeHandle_)
        this.resizeHandle_.removeClass('entryRemove');
    if (Entry.engine.isState('run'))
        this.curtainView_.removeClass('entryRemove');
    this.viewMode_ = viewType;
    this.toggleOffVariableView();
};

/**
 * render variable view
 * @return {!Element}
 */
Entry.Playground.prototype.createVariableView = function() {
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
Entry.Playground.prototype.toggleOnVariableView = function() {
    Entry.playground.changeViewMode('code');
    this.categoryView_.addClass('entryRemove');
    if (this.blockMenuView_)
        this.blockMenuView_.addClass('entryHidden');
    Entry.variableContainer.updateList();
    this.variableView_.removeClass('entryRemove');
    this.resizeHandle_.removeClass('entryRemove');
};

Entry.Playground.prototype.toggleOffVariableView = function() {
    this.categoryView_.removeClass('entryRemove');
    if (this.blockMenuView_)
        this.blockMenuView_.removeClass('entryHidden');
    this.variableView_.addClass('entryRemove');
};

/**
 * Save current playground data to selected object
 * @param {?Entry.EntryObject} object
 */
Entry.Playground.prototype.syncObject = function(object) {
    if (this.object && !object)
        object = this.object;
    if (object) {
        object.setScript(Blockly.Xml.workspaceToDom(Blockly.mainWorkspace));
    }
};

/**
 */
Entry.Playground.prototype.editBlock = function() {
    var playground = Entry.playground;
    if (!Entry.stateManager) return;
    Entry.stateManager.addCommand("edit block",
                                  playground,
                                  playground.restoreBlock,
                                  playground.object,
                                  playground.object.getScriptText()
                                 );
};

Entry.Playground.prototype.mouseupBlock = function() {
    if (!Entry.reporter) return;
    var playground = Entry.playground;
    var object = playground.object;
    Entry.reporter.report(
        new Entry.State(
            "edit block mouseup",
            playground,
            playground.restoreBlock,
            object,
            object.getScriptText()
        )
    );
};

/**
 * @param {!Entry.EntryObject} targetObject
 * @param {!string} blockString
 */
Entry.Playground.prototype.restoreBlock = function(targetObject, blockString) {
    var playground = Entry.playground;
    Entry.container.selectObject(targetObject.id);
    if (Entry.stateManager) {
        Entry.stateManager.addCommand(
            "restore block",
            this,
            this.restoreBlock,
            this.object,
            this.object.getScriptText()
        );
    }
    var script = Blockly.Xml.textToDom(blockString);
    Blockly.mainWorkspace.clear();
    Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, script);
    this.syncObject();
};

/**
 * Save current playground data to selected object with event
 * @param {event} e
 */
Entry.Playground.prototype.syncObjectWithEvent = function(e) {
    Entry.playground.syncObject();
};

/**
 * Generate category menu with object type.
 * @param {!string} objectType
 */
Entry.Playground.prototype.setMenu = function(objectType) {
    if (this.currentObjectType == objectType)
        return;
    this.categoryListView_.innerHTML = '';
    this.blockMenu.unbanClass(this.currentObjectType);
    this.blockMenu.banClass(objectType);
    for (var i in this.blockJSON) {
        var categoryName = this.blockJSON[i].category;
        var element = Entry.createElement('li', 'entryCategory' + categoryName);
        if ((categoryName == "brush" && objectType == "textBox") ||
            (categoryName == "text" && objectType == "sprite") ||
            ((categoryName != "func") && (!this.blockJSON[i].blocks || !this.blockJSON[i].blocks.length)))
            element.addClass("entryRemove");
        element.innerHTML = Lang.Blocks[categoryName.toUpperCase()];
        element.bindOnClick(function () {
            Entry.playground.selectMenu(this.id.substring(13));
        });
        if (!Entry.type || Entry.type == 'workspace') {
            element.addClass('entryCategoryElementWorkspace');
        } else if (Entry.type == 'phone') {
            element.addClass('entryCategoryElementPhone');
        }
        this.categoryListView_.appendChild(element);
    }
    this.selectMenu(0);
    this.currentObjectType = objectType;
};

/**blockMenu
 * Show blocks on blockly when user click
 * @param {string|number} selector
 * @param {?boolean} disableTab
 */
Entry.Playground.prototype.selectMenu = function(selector, disableTab) {
    if (!this.object) {
        Entry.toast.alert(Lang.Workspace.add_object_alert,
                          Lang.Workspace.add_object_alert_msg);
        return;
    }
    this.lastSelector = selector;

    var elements = this.categoryListView_.children;
    if (!Entry.type || Entry.type == 'workspace') {
        for (var i in this.blockJSON) {
            var categoryName = this.blockJSON[i].category;
            if (typeof selector == 'string' && categoryName == selector ||
                typeof selector == 'number' && selector == i) {
                if (elements[i].hasClass('entrySelectedCategory') && !disableTab) {
                    //Blockly.mainWorkspace.blockMenu.hide();
                    this.blocklyView_.addClass('folding');
                    this.blocklyView_.removeClass('foldOut');
                    this.hideTabs();
                    elements[i].removeClass('entrySelectedCategory');
                    delete this.selectedMenu;
                } else {
                    if (categoryName == "func") {
                        this.blockMenu.show(
                            Entry.Func.getMenuXml());
                    } else {
                        if (categoryName == "variable")
                            this.checkVariables();
                        this.blockMenu.showCategory(this.blockJSON[i]);
                    }
                    this.menuInjected = true;
                    if (this.blocklyView_.hasClass('folding')) {
                        this.blocklyView_.addClass('foldOut');
                        this.blocklyView_.removeClass('folding');
                    }
                    this.showTabs();
                    elements[i].addClass('entrySelectedCategory');
                    this.selectedMenu = categoryName;
                }
            } else {
                elements[i].removeClass('entrySelectedCategory');
            }
        }
    } else if (Entry.type == 'phone') {
        var categories = [];
        for (var i = 0; i<categories.length; i++) {
            var category = categories[i];
            var categoryName = category.attributes[0].value;
            if (typeof selector == 'string' && categoryName == selector ||
                typeof selector == 'number' && selector == i) {
                if (elements[i].hasClass('entrySelectedCategory')) {
                    this.blockMenu.hide();
                    elements[i].removeClass('entrySelectedCategory');
                    this.menuInjected = true;
                    this.selectedMenu = categoryName;
                } else {
                    elements[i].addClass('entrySelectedCategory');
                    this.blockMenu.show(categories[i].childNodes);
                    this.menuInjected = true;
                    delete this.selctedMenu;
                }
            } else {
                elements[i].removeClass('entrySelectedCategory');
            }
        }
    }
};

Entry.Playground.prototype.hideTabs = function() {
    var items = ['picture', 'text', 'sound', 'variable'];
    for (var i in items) {
        this.hideTab([items[i]]);
    }
};

Entry.Playground.prototype.hideTab = function(item) {
    if (this.tabViewElements[item]) {
        this.tabViewElements[item].addClass('hideTab');
        this.tabViewElements[item].removeClass('showTab');
    }
};

Entry.Playground.prototype.showTabs = function() {
    var items = ['picture', 'text', 'sound', 'variable'];
    for (var i in items) {
        this.showTab(items[i]);
    }
};

Entry.Playground.prototype.showTab = function(item) {
    if (this.tabViewElements[item]) {
        this.tabViewElements[item].addClass('showTab');
        this.tabViewElements[item].removeClass('hideTab');
    }
};

/**
 * Set menu blocks by xml
 * @param {object} blockJSON
 */
Entry.Playground.prototype.setBlockMenu = function(blockJSON) {
    if (!blockJSON)
        blockJSON = EntryStatic.getAllBlocks();
    if (Entry.functionEnable)
        if (blockJSON.length > 1 &&
            blockJSON[blockJSON.length-1].category == "arduino")
            blockJSON.splice(blockJSON.length-1, 0, {category: "func"});
    if (!Entry.messageEnable)
        this.blockMenu.banClass("message");
    if (!Entry.variableEnable)
        this.blockMenu.banClass("variable");
    if (!Entry.listEnable)
        this.blockMenu.banClass("list");
    this.updateHW();
    if (!Entry.sceneEditable)
        for (var i in blockJSON)
            if (blockJSON[i].category == "scene")
                blockJSON.splice(i, 1);
    this.blockJSON = blockJSON;
};

/**
 * Handle is resizing playground handle.
 * This add mouse move and mouse up event to document.
 * @param {!Element} handle
 */
Entry.Playground.prototype.initializeResizeHandle = function(handle) {
    handle.onmousedown = function(e) {
        Entry.playground.resizing = true;
    };
    document.addEventListener('mousemove', function(e) {
        if (Entry.playground.resizing) {
            Entry.resizeElement({
                menuWidth: e.x - Entry.interfaceState.canvasWidth
            });
        }
    });
    document.addEventListener('mouseup', function(e) {
        Entry.playground.resizing = false;
    });
};

/**
 * Reload playground
 */
Entry.Playground.prototype.reloadPlayground = function () {
    var selectedCategory, selector;

    if (document.getElementsByClassName('entrySelectedCategory')[0]) {
        selectedCategory = document.getElementsByClassName('entrySelectedCategory')[0];
        selector = selectedCategory.getAttribute('id').substring(13);
        selectedCategory.removeClass('entrySelectedCategory');
        Entry.playground.selectMenu(selector);
    }

    if (Entry.stage.selectedObject) {
        Blockly.mainWorkspace.clear();
        Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, Entry.stage.selectedObject.script);
    }
};

/**
 * flush playground when object is not exist
 */
Entry.Playground.prototype.flushPlayground = function () {
    this.object = null;
    if (Entry.playground && Entry.playground.view_) {
        Blockly.mainWorkspace.clear();
        this.injectPicture();
        this.injectSound();
    }
};

Entry.Playground.prototype.refreshPlayground = function () {
    if (Entry.playground && Entry.playground.view_) {
        this.injectPicture();
        this.injectSound();
    }
};

Entry.Playground.prototype.updateListViewOrder = function (type) {
    var list;
    if (type == 'picture')
        list = this.pictureListView_.childNodes;
    else
        list = this.soundListView_.childNodes;
    for (var i=0, len=list.length; i<len; i++)
        list[i].orderHolder.innerHTML = i+1;
};

Entry.Playground.prototype.generatePictureElement = function(picture) {
    var element = Entry.createElement('li', picture.id);
    picture.view = element;
    element.addClass('entryPlaygroundPictureElement');
    element.picture = picture;
    element.bindOnClick(function(e) {
        Entry.playground.selectPicture(this.picture);
    });

    Entry.Utils.disableContextmenu(picture.view);
    $(picture.view).on('contextmenu', function(){
        var options = [
            {
                text: Lang.Workspace.context_rename,
                callback: function(){
                    nameView.focus();
                }
            },
            {
                text: Lang.Workspace.context_duplicate,
                callback: function(){
                    Entry.playground.clonePicture(picture.id);
                }
            },
            {
                text: Lang.Workspace.context_remove,
                callback: function(){
                    if (Entry.playground.object.removePicture(picture.id)) {
                        Entry.removeElement(element);
                        Entry.toast.success(Lang.Workspace.shape_remove_ok,
                            picture.name +' '+Lang.Workspace.shape_remove_ok_msg);
                    } else {
                        Entry.toast.alert(Lang.Workspace.shape_remove_fail,
                            Lang.Workspace.shape_remove_fail_msg);
                    }
                }
            },
            {
                divider: true
            },
            {
                text: Lang.Workspace.context_download,
                callback: function(){
                    if (picture.fileurl) {
                        window.open(picture.fileurl);
                    } else {
                        // deprecated
                        window.open('/api/sprite/download/image/'+
                                encodeURIComponent(picture.filename)+'/'+encodeURIComponent(picture.name) + '.png');
                    }
                }
            }
        ];
        Entry.ContextMenu.show(options, 'workspace-contextmenu');
    });

    var orderHolder = Entry.createElement('div');
    orderHolder.addClass('entryPlaygroundPictureOrder');
    element.orderHolder = orderHolder;
    element.appendChild(orderHolder);
    var thumbnailView = Entry.createElement('div', 't_'+picture.id);
    thumbnailView.addClass('entryPlaygroundPictureThumbnail');
    if (picture.fileurl) {
        thumbnailView.style.backgroundImage = 'url("' + picture.fileurl + '")';
    } else {
        // deptecated
        var fileName = picture.filename;
        thumbnailView.style.backgroundImage =
            'url("' + Entry.defaultPath + '/uploads/' + fileName.substring(0, 2) + '/' +
            fileName.substring(2, 4) + '/thumb/' + fileName + '.png")';
    }
    element.appendChild(thumbnailView);
    var nameView = Entry.createElement('input');
    nameView.addClass('entryPlaygroundPictureName');
    nameView.addClass('entryEllipsis');
    nameView.picture = picture;
    nameView.value = picture.name;
    Entry.attachEventListener(nameView, 'blur', nameViewBlur);

    function nameViewBlur() {
        if (this.value.trim() === '') {
            Entry.deAttachEventListener(this, 'blur', nameViewBlur);
            alert('이름을 입력하여 주세요.');
            this.focus();
            Entry.attachEventListener(this, 'blur', nameViewBlur);
            return;
        }

        var nameViewArray = $(".entryPlaygroundPictureName");
        for (var i=0; i<nameViewArray.length; i++) {
            if(nameViewArray.eq(i).val()==nameView.value &&
               nameViewArray[i] != this) {
                Entry.deAttachEventListener(this, 'blur', nameViewBlur);
                alert('이름이 중복 되었습니다.');
                this.focus();
                Entry.attachEventListener(this, 'blur', nameViewBlur);
                return;
            }
        }
        this.picture.name = this.value;
        Entry.playground.reloadPlayground();
        Entry.dispatchEvent('pictureNameChanged', this.picture);
    }
    nameView.onkeypress = function(e) {
        if (e.keyCode == 13)
            this.blur();
    };
    element.appendChild(nameView);
    var sizeView = Entry.createElement('div', 's_'+picture.id);
    sizeView.addClass('entryPlaygroundPictureSize');
    sizeView.innerHTML = picture.dimension.width + ' X ' +
        picture.dimension.height;
    element.appendChild(sizeView);
};

Entry.Playground.prototype.generateSoundElement = function(sound) {
    var element = Entry.createElement('sound', sound.id);
    sound.view = element;
    element.addClass('entryPlaygroundSoundElement');
    element.sound = sound;

    Entry.Utils.disableContextmenu(sound.view);
    $(sound.view).on('contextmenu', function(){
        var options = [
            {
                text: Lang.Workspace.context_rename,
                callback: function(){
                    nameView.focus();
                }
            },
            {
                text: Lang.Workspace.context_duplicate,
                callback: function(){
                    Entry.playground.addSound(sound, true);
                }
            },
            {
                text: Lang.Workspace.context_remove,
                callback: function(){
                    if (Entry.playground.object.removeSound(sound.id)) {
                        Entry.removeElement(element);
                        Entry.toast.success(Lang.Workspace.sound_remove_ok,
                            sound.name +' '+Lang.Workspace.sound_remove_ok_msg);
                    } else {
                        Entry.toast.alert(Lang.Workspace.sound_remove_fail,'');
                    }
                    Entry.removeElement(element);
                }
            }
        ];
        Entry.ContextMenu.show(options, 'workspace-contextmenu');
    });

    var orderHolder = Entry.createElement('div');
    orderHolder.addClass('entryPlaygroundSoundOrder');
    element.orderHolder = orderHolder;
    element.appendChild(orderHolder);

    var thumbnailView = Entry.createElement('div');
    thumbnailView.addClass('entryPlaygroundSoundThumbnail');
    thumbnailView.addClass('entryPlaygroundSoundPlay');
    var isPlaying = false;
    var soundInstance;
    thumbnailView.addEventListener('click', function () {
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

        soundInstance.addEventListener("complete", function(e) {
            thumbnailView.removeClass('entryPlaygroundSoundStop');
            thumbnailView.addClass('entryPlaygroundSoundPlay');
            isPlaying = false;
        });
        soundInstance.addEventListener("loop", function(e) {
        });
        soundInstance.addEventListener("failed", function(e) {
        });
    });

    element.appendChild(thumbnailView);
    var nameView = Entry.createElement('input');
    nameView.addClass('entryPlaygroundSoundName');
    nameView.sound = sound;
    nameView.value = sound.name;
    var nameViewArray = document.getElementsByClassName('entryPlaygroundSoundName');
    nameView.onblur = function() {
        if (this.value === '') {
            alert('이름을 입력하여 주세요.');
            this.focus();
            return;
        }
        var count=0;
        for (var i=0; i<nameViewArray.length; i++) {
            if(nameViewArray[i].value==nameView.value) {
                count = count+1;
                if (count > 1) {
                    alert('이름이 중복 되었습니다.');
                    this.focus();
                    return;
                }
            }
        }

        this.sound.name = this.value;
    };
    nameView.onkeypress = function(e) {
        if (e.keyCode == 13)
            this.blur();
    };
    element.appendChild(nameView);
    var lengthView = Entry.createElement('div');
    lengthView.addClass('entryPlaygroundSoundLength');
    lengthView.innerHTML = sound.duration + ' 초';
    element.appendChild(lengthView);
};

Entry.Playground.prototype.toggleColourChooser = function(name) {
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

Entry.Playground.prototype.setTextColour = function(colour) {
    Entry.playground.object.entity.setColour(colour);
    Entry.playground.toggleColourChooser('foreground');
    $('.entryPlayground_fgColorDiv').css('backgroundColor', colour);
};

Entry.Playground.prototype.setBackgroundColour = function(colour) {
    Entry.playground.object.entity.setBGColour(colour);
    Entry.playground.toggleColourChooser('background');
    $('.entryPlayground_bgColorDiv').css('backgroundColor', colour);
};

Entry.Playground.prototype.isTextBGMode = function () {
    return this.isTextBGMode_;
};

Entry.Playground.prototype.checkVariables = function () {
    if (Entry.forEBS)
        return;
    if (Entry.variableContainer.lists_.length)
        this.blockMenu.unbanClass("listNotExist");
    else
        this.blockMenu.banClass("listNotExist");
    if (Entry.variableContainer.variables_.length)
        this.blockMenu.unbanClass("variableNotExist");
    else
        this.blockMenu.banClass("variableNotExist");
};


Entry.Playground.prototype.getViewMode = function() {
    return this.viewMode_;
};

Entry.Playground.prototype.updateHW = function() {
    var self = Entry.playground;
    if (!self.blockMenu)
        return;
    var hw = Entry.hw;
    if (hw && hw.connected) {
        self.blockMenu.unbanClass("arduinoConnected");
        self.blockMenu.banClass("arduinoDisconnected");

        hw.banHW();
        if (hw.hwModule)
            self.blockMenu.unbanClass(hw.hwModule.name);
    } else {
        self.blockMenu.banClass("arduinoConnected");
        self.blockMenu.unbanClass("arduinoDisconnected");
        Entry.hw.banHW();
    }
    if (self.object)
        self.selectMenu(self.lastSelector, true);
};

Entry.Playground.prototype.toggleLineBreak = function(isLineBreak) {
    if (!this.object || this.object.objectType != "textBox")
        return;
    if (isLineBreak) {
        Entry.playground.object.entity.setLineBreak(true);
        $('.entryPlayground_textArea').css('display', 'block');
        $('.entryPlayground_textBox').css('display', 'none');
        this.linebreakOffImage.src = Entry.mediaFilePath + 'text-linebreak-off-false.png';
        this.linebreakOnImage.src = Entry.mediaFilePath + 'text-linebreak-on-true.png';
        this.fontSizeWrapper.removeClass("entryHide");
    } else {
        Entry.playground.object.entity.setLineBreak(false);
        $('.entryPlayground_textArea').css('display', 'none');
        $('.entryPlayground_textBox').css('display', 'block');
        this.linebreakOffImage.src = Entry.mediaFilePath + 'text-linebreak-off-true.png';
        this.linebreakOnImage.src = Entry.mediaFilePath + 'text-linebreak-on-false.png';
        this.fontSizeWrapper.addClass("entryHide");
    }
};

Entry.Playground.prototype.setFontAlign = function(fontAlign) {
    if (this.object.objectType != "textBox")
        return;
    this.alignLeftBtn.removeClass("toggle");
    this.alignCenterBtn.removeClass("toggle");
    this.alignRightBtn.removeClass("toggle");
    switch (fontAlign) {
        case Entry.TEXT_ALIGN_LEFT:
            this.alignLeftBtn.addClass("toggle");
            break;
        case Entry.TEXT_ALIGN_CENTER:
            this.alignCenterBtn.addClass("toggle");
            break;
        case Entry.TEXT_ALIGN_RIGHT:
            this.alignRightBtn.addClass("toggle");
            break;
    }
    this.object.entity.setTextAlign(fontAlign);
};

