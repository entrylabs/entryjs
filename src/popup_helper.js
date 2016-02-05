/**
 * @fileoverview Popup object for generate popup.
 */
'use strict';

/**
 * Constructor of popup
 * @constructor
 */
Entry.popupHelper = function() {
    Entry.assert(!window.popupHelper, 'Popup exist');

    this.pageIndex = 1;
    
    this.body_ = Entry.createElement('div');
    this.body_.addClass('entryPopup hiddenPopup');
    this.body_.bindOnClick(function(e) {
        if (e.target==this) {
            this.popup.hide();
        }
    });
    window.popupHelper = this;
    this.body_.popup = this;
    this.window_ = Entry.createElement('div');
    this.window_.addClass('entryPopupHelperWindow');

    this.title_ = Entry.createElement('div');
    this.title_.addClass('entryPopupHelperTitle');    

    this.titleButton_ = Entry.createElement('div');
    this.titleButton_.addClass('entryPopupHelperCloseButton');    

    this.titleButton_.addEventListener('click', (function () {
        this.hide();
    }).bind(this));

    this.window_.appendChild(this.titleButton_);
    this.window_.appendChild(this.title_);
    this.body_.appendChild(this.window_);
    document.body.appendChild(this.body_);
};

Entry.popupHelper.prototype.setPopup = function(popupObject) {
    this.title_.textContent = popupObject.title;
    if(typeof popupObject.setPopupLayout === 'function') {
        popupObject.setPopupLayout(this, popupObject.content);
    }

    // content;
};

/**
 * Remove this popup
 */
Entry.popupHelper.prototype.remove = function() {
    Entry.removeElement(this.body_);
    window.popupHelper = null;
};

/**
 * Resize this view size when window size modified
 * @param {event} e
 */
Entry.popupHelper.prototype.resize = function(e) {
    
};


Entry.popupHelper.prototype.show = function() {
    this.body_.removeClass('hiddenPopup');
};


Entry.popupHelper.prototype.hide = function() {
    this.body_.addClass('hiddenPopup');
};

function test() {
    var aaa = {
        pageIndex: 0,
        setPopupLayout: function (popup) {
            this.stepBadge_ = Entry.createElement('div');
            this.stepBadge_.addClass('entryPopupHelperStep');      
            this.leftButton_ = Entry.createElement('div');
            this.leftButton_.addClass('entryPopupHelperLeft');
            this.leftButton_.addEventListener('click', (function () {
                this.setPrevStep();
            }).bind(this));

            this.rightButton_ = Entry.createElement('div');
            this.rightButton_.addClass('entryPopupHelperRight');
            this.rightButton_.addEventListener('click', (function () {
                this.setNextStep();
            }).bind(this));

            this.view_ = Entry.createElement('div');
            this.view_.addClass('entryPopupHelperView');

            window.testView = this.view_;
            this.content_ = Entry.createElement('div');
            this.content_.addClass('entryPopupHelperContents');
            popup.window_.addClass('operationPopupWindow');
            popup.window_.appendChild(this.stepBadge_);
            popup.window_.appendChild(this.leftButton_);
            popup.window_.appendChild(this.rightButton_);
            popup.window_.appendChild(this.content_);
            popup.window_.appendChild(this.view_);

            this.setSetpBadge();
            this.setContent();
        },
        setSetpBadge: function () {
            this.stepBadge_.textContent = ['STEP ', this.pageIndex + 1, '/', this.content.length].join('');  
        },
        setContent: function () {
            if(this.content.length > 0) {
                if(this.pageIndex === 0) {
                    this.rightButton_.addClass('show');
                    this.leftButton_.removeClass('show');
                } else if(this.pageIndex === this.content.length - 1) {
                    this.leftButton_.addClass('show');
                    this.rightButton_.removeClass('show');
                } else {
                    this.rightButton_.addClass('show');
                    this.leftButton_.addClass('show');
                }
            } else {
                this.rightButton_.removeClass('show');
                this.leftButton_.removeClass('show');
            }

            this.setSetpBadge();
            var nowContent = this.content[this.pageIndex];
            this.view_.innerHTML = nowContent.description;
            this.view_.className = ['entryPopupHelperView', nowContent.descStyle].join(' ');
            this.content_.innerHTML = '';
            this.content_.className = ['entryPopupHelperContent', nowContent.contentStyle].join(' ');
            if(nowContent.textSet && nowContent.textSet.length > 0) {
                for(var idx in nowContent.textSet) {
                    var item = nowContent.textSet[idx];
                    var elem = Entry.createElement('div');
                    elem.textContent = item.text;
                    elem.addClass('defaultChildText');
                    elem.style.bottom = [item.y, 'px'].join('');
                    elem.style.left = [item.x, 'px'].join('');
                    this.content_.appendChild(elem);
                }
            }
        },
        setNextStep: function () {
            this.pageIndex++;
            this.setContent();
        },
        setPrevStep: function () {
            this.pageIndex--;
            this.setContent();
        },
        // title: Lang.Menus.maze_operation1_title,
        // content : [{
        //     description: Lang.Menus.maze_operation1_1_desc,
        //     contentStyle: 'operation1_1',
        //     descStyle: 'descStyle1',
        // },{
        //     description: Lang.Menus.maze_operation1_2_desc,
        //     contentStyle: 'operation1_2',
        //     descStyle: 'descStyle1',
        // },{
        //     description: Lang.Menus.maze_operation1_3_desc,
        //     contentStyle: 'operation1_3',
        //     descStyle: 'descStyle1'
        // },{
        //     description: Lang.Menus.maze_operation1_4_desc,
        //     contentStyle: 'operation1_4',            
        //     descStyle: 'descStyle1',
        // }],
        title: '7단계 - 반복 명령 알아보기(횟수반복)',
        content : [{
            description: '<b>똑같은 일</b>을 반복해서 명령하는건 매우 귀찮은 일이야.</br>이럴땐 <span class=\"text_shadow\">반복</span>과 관련된 명령어를 사용하면 훨씬 쉽게 명령을 내릴 수 있어.',
            contentStyle: 'operation7_1',
            descStyle: 'descStyle1',
            textSet:[{
                text: '똑같은 명령어를 반복해서 사용하는 경우',
                x: -310,
                y: 240
            }, {
                text: '반복 명령어를 사용하는 경우',
                x: 335,
                y: 240
            }]
        },{
            description: '그렇다면 반복되는 명령을 쉽게 내리는 방법을 알아보자.</br>먼저 반복하기 명령어를 클릭한 다음, <span class=\"text_shadow\">i<1</span> 의 숫자를 바꿔서 <span class=\"text_shadow\">반복횟수</span>를 정하고</br><span class=\"text_shadow\">괄호({ })</span> 사이에 반복할 명령어를 넣어주면 돼!',
            contentStyle: 'operation7_2',
            descStyle: 'descStyle1',
            textSet:[{
                text: '반복 횟수',
                x: 387,
                y: 215
            }, {
                text: '반복할 명령',
                x: 455,
                y: -160
            }]
        },{
            description: '예를 들어 이 명령어<span class=\"text_badge number_1\"></span>은 10번 반복해서 move(); 를 실행해.</br><span class=\"text_badge number_2\"></span>명령어와 동일한 명령어지.',
            contentStyle: 'operation7_3',
            descStyle: 'descStyle1'
        },{
            description: '이 명령어를 사용할 때는 <span class=\"text_shadow\">{ } 안에 반복할 명령어</span>를 잘 입력했는지,</br><span class=\"text_shadow\">`;`</span>는 빠지지 않았는지 잘 살펴봐!</br>이 명령어에 대한 자세한 설명은 [더 알아보기]에서 볼 수 있어.',
            contentStyle: 'operation7_4',            
            descStyle: 'descStyle1',
            textSet:[{
                text: '괄호({})가 빠진 경우',
                x: -360,
                y: -200
            }, {
                text: '세미콜론(;)이 빠진 경우',
                x: 345,
                y: -200
            }]
        }],
    }

    window.p = new Entry.popupHelper();
    p.setPopup(aaa);
    p.show();
}

// window.p = new Entry.popupHelper();
// p.setPopup();

// p.show()