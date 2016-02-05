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
                    elem.innerHTML = item.text;
                    elem.addClass('defaultChildText');
                    elem.style.bottom = [item.y, 'px'].join('');
                    elem.style.left = [item.x, 'px'].join('');
                    elem.style.textAlign = item.align || elem.style.textAlign;
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
        title: Lang.Menus.maze_operation10_title,
        content : [{
            description: Lang.Menus.maze_operation10_1_desc,
            contentStyle: 'operation10_1',
            descStyle: 'descStyle1',
            textSet:[{
                text: Lang.Menus.maze_operation10_1_textset_1,
                x: 435,
                y: 250
            }, {
                text: Lang.Menus.maze_operation10_1_textset_2,
                x: 435,
                y: 190
            }, {
                text: Lang.Menus.maze_operation10_1_textset_3,
                x: 435,
                y: -110
            }, {
                text: Lang.Menus.maze_operation10_1_textset_4,
                x: 435,
                y: -170
            }]
        },{
            description: Lang.Menus.maze_operation10_2_desc,
            contentStyle: 'operation10_2',
            descStyle: 'descStyle1',
            textSet:[{
                text: Lang.Menus.maze_operation10_2_textset_1,
                x: -25,
                y: 185
            }, {
                text: Lang.Menus.maze_operation10_2_textset_2,
                x: 95,
                y: -195
            }]
        },{
            description: Lang.Menus.maze_operation10_3_desc,
            contentStyle: 'operation10_3',
            descStyle: 'descStyle2',
            textSet:[{
                text: Lang.Menus.maze_operation10_3_textset_1,
                x: -28,
                y: 185
            }, {
                text: Lang.Menus.maze_operation10_3_textset_2,
                x: 95,
                y: -195
            }]
        },{
            description: Lang.Menus.maze_operation10_4_desc,
            contentStyle: 'operation10_4',
            descStyle: 'descStyle1',
            textSet:[{                
                align: 'left',
                text: Lang.Menus.maze_operation10_4_textset_1,
                x: 50,
                y: -160
            }, {
                align: 'left',
                text: Lang.Menus.maze_operation10_4_textset_2,
                x: 265,
                y: -160
            }, {                
                align: 'left',
                text: Lang.Menus.maze_operation10_4_textset_3,
                x: 475,
                y: -160
            }]
        }],
        // title: '10단계 - 조건 명령 알아보기',
        // content : [{
        //     description: '앞에서는 미션이 끝날 때까지 계속 반복하는 반복 명령어에 대해 배웠어.</br>이번에는 특정한 조건에서만 행동을 하는 <span class=\"textShadow\">조건 명령어</span>를 살펴보자.</br><span class=\"textBadge number2\"></span>에서 보는것처럼 조건 명령어를 사용하면 <b>명령을 보다 효율적으로 잘 내릴 수 있어.</b>',
        //     contentStyle: 'operation10_1',
        //     descStyle: 'descStyle1',
        //     textSet:[{
        //         text: '<b>[일반명령]</b>',
        //         x: 435,
        //         y: 250
        //     }, {
        //         text: '<span class=\"textMultiline\">앞으로 2칸 가고</br>오른쪽으로 회전하고,</br>앞으로 3칸가고,</br>오른쪽으로 회전하고, 앞으로...</span>',
        //         x: 435,
        //         y: 190
        //     }, {
        //         text: '<b>[조건명령]</b>',
        //         x: 435,
        //         y: -110
        //     }, {
        //         text: '<span class=\"textMultiline\">앞으로 계속 가다가</br><span class=\"textEmphasis\">`만약에 벽을 만나면`</span></br>오른쪽으로 회전해~!</span>',
        //         x: 435,
        //         y: -170
        //     }]
        // },{
        //     description: '조건 명령어는 크게 <span class=\"textShadow\">`조건`</span> 과 <span class=\"textShadow\">`조건이 발생했을때 실행되는 명령`</span>으로 나눌수 있어.</br>먼저 <span class=\"textUnderline\">조건</span> 부분을 살펴보자. If 다음에 나오는 <span class=\"textUnderline\">( ) 부분</span>이 조건을 입력하는 부분이야.</br><span class=\"textBadge number1\"></span>과 같은 명령어를 예로 살펴보자. <span class=\"textUnderline\">(front == \"wall\")</span> 는 만약 내 앞에(front) \"wall(벽)\"이 있다면을 뜻해',
        //     contentStyle: 'operation10_2',
        //     descStyle: 'descStyle1',
        //     textSet:[{
        //         text: '조건',
        //         x: -25,
        //         y: 185
        //     }, {
        //         text: '조건이 발생했을 때 실행되는 명령',
        //         x: 95,
        //         y: -195
        //     }]
        // },{
        //     description: '이제 <span class=\"textUnderline\">`조건이 발생했을 때 실행되는 명령`</span>을 살펴보자.</br>이 부분은 <span class=\"textShadow\">괄호{}</span>로 묶여 있고, 조건이 발생했을때 괄호안의 명령을 실행하게 돼!</br>조건이 발생하지 않으면 이 부분은 무시하고 그냥 넘어가게 되지.</br><span class=\"textBadge number1\"></span>의 명령어를 예로 살펴보자. 조건은 만약에 `내 앞에 벽이 있을 때` 이고,</br><b>이 조건이 발생했을 때 나는 괄호안의 명령어 right(); 처럼 오른쪽으로 회전하게 돼!</b>',
        //     contentStyle: 'operation10_3',
        //     descStyle: 'descStyle2',
        //     textSet:[{
        //         text: '조건',
        //         x: -28,
        //         y: 185
        //     }, {
        //         text: '조건이 발생했을 때 실행되는 명령',
        //         x: 95,
        //         y: -195
        //     }]
        // },{
        //     description: '<span class=\"textShadow\">조건 명령어</span>는 <span class=\"textShadow\">반복하기 명령어</span>와 함께 쓰이는 경우가 많아.</br>앞으로 쭉 가다가, 벽을 만났을때만 회전하게 하려면</br><span class=\"textUnderline pdb5\"><span class=\"textBadge number1\"></span><span class=\"textBadge number2\"></span><span class=\"textBadge number3\"></span>순서</span>와 같이 명령을 내릴 수 있지!',
        //     contentStyle: 'operation10_4',
        //     descStyle: 'descStyle1',
        //     textSet:[{                
        //         align: 'left',
        //         text: '<span class=\"textMultiline\">미션이 끝날때 까지</br>계속 앞으로 간다.</span>',
        //         x: 50,
        //         y: -160
        //     }, {
        //         align: 'left',
        //         text: '<span class=\"textMultiline\">계속 앞으로 가다가,</br>만약에 벽을 만나면</span>',
        //         x: 265,
        //         y: -160
        //     }, {                
        //         align: 'left',
        //         text: '<span class=\"textMultiline\">계속 앞으로 가다가,</br>만약에 벽을 만나면</br>오른쪽으로 회전한다.</span>',
        //         x: 475,
        //         y: -160
        //     }]
        // }],
    }

    window.p = new Entry.popupHelper();
    p.setPopup(aaa);
    p.show();
}

// window.p = new Entry.popupHelper();
// p.setPopup();

// p.show()