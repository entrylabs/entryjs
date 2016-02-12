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
            this.popup.remove();
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
        this.remove();
    }).bind(this));

    this.popupWrapper_ = Entry.createElement('div');
    this.popupWrapper_.appendChild(this.titleButton_);
    this.popupWrapper_.appendChild(this.title_);
    this.popupWrapper_.addClass('entryPopupHelperWrapper');

    this.window_.appendChild(this.popupWrapper_);
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

function testCm() {
    var aaa = {
        pageIndex: 0,
        setPopupLayout: function (popup) {
            this.exampleBadge_ = Entry.createElement('div');
            this.exampleBadge_.addClass('entryPopupHelperExampleBadge');     
            this.exampleBadge_.textContent = '예시';

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

            this.indicator_ = Entry.createElement('div');
            this.indicator_.addClass('entryPopupHelperIndicator');

            if(this.content.length > 1) {
                var hr = Entry.createElement('hr');
                hr.addClass('indicatorHr');
                this.indicator_.appendChild(hr);
                var indicator = Entry.createElement('span');
                indicator.addClass('indicator');
                for(var i = 0; i < this.content.length; i++) {
                    var dom = indicator.cloneNode(true);
                    this.indicator_.appendChild(dom);
                }
                var that = this;
                var $indicator_ = $(this.indicator_);
                $indicator_.off().on('click', 'span:not(.on)', function () {
                    var index = $indicator_.find('span').index(this);
                    that.setNthStep(index);
                });
                this.indicator_.addClass('show');
            }

            this.content_ = Entry.createElement('div');
            this.content_.addClass('entryPopupHelperContent');
            this.contentCommand_ = Entry.createElement('div');
            this.contentCommand_.addClass('entryPopupHelperContentCommand');
            this.contentDesc_ = Entry.createElement('div');
            this.contentDesc_.addClass('entryPopupHelperContentDesc');
            var wrapper = Entry.createElement('div');

            wrapper.appendChild(this.leftButton_);
            wrapper.appendChild(this.rightButton_);
            wrapper.appendChild(this.contentCommand_);
            wrapper.appendChild(this.contentDesc_);
            wrapper.appendChild(this.exampleBadge_);
            wrapper.appendChild(this.content_);
            wrapper.appendChild(this.indicator_);
            popup.popupWrapper_.appendChild(wrapper);

            popup.window_.addClass('commandPopupWindow');
            this.setContent(this);
        },
        setContent: function () {
            if(this.content.length > 1) {
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

                $(this.indicator_).find('span').removeClass('on');
                $(this.indicator_).find('span:eq('+ this.pageIndex +')').addClass('on');
            } else {
                this.rightButton_.removeClass('show');
                this.leftButton_.removeClass('show');
            }

            var nowContent = this.content[this.pageIndex];
            this.contentCommand_.innerHTML = '<span>' + nowContent.command + '</span>';
            this.contentDesc_.innerHTML = nowContent.description;
            this.content_.innerHTML = '';
            nowContent.images.forEach((function (item) {
                var elem = Entry.createElement('div');
                elem.addClass(item);
                this.content_.appendChild(elem);
            }).bind(this));
        },
        setNthStep: function (idx) {
            this.pageIndex = idx;
            this.setContent();
        },
        setNextStep: function () {
            this.pageIndex++;
            this.setContent();
        },
        setPrevStep: function () {
            this.pageIndex--;
            this.setContent();
        },
        title: Lang.Menus.maze_command_title,
        content : [{
            command: 'move();',
            description: Lang.Menus.maze_command_move_desc,
            images: ['move01','move02'],
            
        }, {
            command: 'jump();',
            description: Lang.Menus.maze_command_jump_desc,
            images: ['jump01','jump02'],
            
        }, {
            command: 'right();',
            description: Lang.Menus.maze_command_right_desc,
            images: ['right01','right02'],
            
        }, {
            command: 'left();',
            description: Lang.Menus.maze_command_left_desc,
            images: ['left01','left02'],
            
        }, {
            command: 'for (var i = 0; i < 1; i++){</br>}',
            description: Lang.Menus.maze_command_for_desc,
            images: ['for01','for02'],            
        }, {
            command: 'while (true) {</br>}',
            description: Lang.Menus.maze_command_while_desc,
            images: ['while01','while02'],            
        }, {
            command: 'if (front == \"wall\") {</br>}',
            description: Lang.Menus.maze_command_if1_desc,
            images: ['if01','if02'],            
        }, {
            command: 'if (front == \"Bee\") {</br>}',
            description: Lang.Menus.maze_command_if2_desc,
            images: ['if03','if04'],            
        }, {
            command: 'if (front == \"banana\") {</br>}',
            description: Lang.Menus.maze_command_if3_desc,
            images: ['if05','if06'],            
        }, {
            command: 'promise();',
            description: Lang.Menus.maze_command_promise_desc,
            images: ['promise01','promise02'],            
        }],
        // title: '명령어 도움말',
        // content : [{
        //     command: 'move();',
        //     description: '엔트리봇을 한 칸 앞으로 이동시킵니다.',
        //     images: ['move01','move02'],
            
        // }, {
        //     command: 'jump();',
        //     description: '장애물 앞에서 장애물을 뛰어 넘습니다.</br><div class=\"obstacleSet\"></div>',
        //     images: ['jump01','jump02'],
            
        // }, {
        //     command: 'right();',
        //     description: '제 자리에서 오른쪽으로 90도 회전합니다.',
        //     images: ['right01','right02'],
            
        // }, {
        //     command: 'left();',
        //     description: '제 자리에서 왼쪽으로 90도 회전합니다.',
        //     images: ['left01','left02'],
            
        // }, {
        //     command: 'for (var i = 0; i < 1; i++){</br>}',
        //     description: '괄호<span class=\"textShadow\">{}</span> 안에 있는 명령을 입력한 횟수 만큼 반복해서 실행합니다.',
        //     images: ['for01','for02'],            
        // }, {
        //     command: 'while (true) {</br>}',
        //     description: '미션이 끝날 때가지 괄호<span class=\"textShadow\">{}</span> 안에 있는 명령을 계속 반복해서 실행합니다.',
        //     images: ['while01','while02'],            
        // }, {
        //     command: 'if (front == \"wall\") {</br>}',
        //     description: '조건 <span class=\"textShadow\">`바로 앞에 벽이 있을때`</span>이 발생했을 때,</br>괄호<span class=\"textShadow\">{}</span> 안에 있는 명령을 실행합니다.',
        //     images: ['if01','if02'],            
        // }, {
        //     command: 'if (front == \"Bee\") {</br>}',
        //     description: '조건 <span class=\"textShadow\">`바로 앞에 벌집이 있을때`</span>이 발생했을 때,</br>괄호<span class=\"textShadow\">{}</span> 안에 있는 명령을 실행합니다.',
        //     images: ['if03','if04'],            
        // }, {
        //     command: 'if (front == \"banana\") {</br>}',
        //     description: '조건 <span class=\"textShadow\">`바로 앞에 바나나가 있을때`</span>이 발생했을 때,</br>괄호<span class=\"textShadow\">{}</span> 안에 있는 명령을 실행합니다.',
        //     images: ['if05','if06'],            
        // }, {
        //     command: 'promise();',
        //     description: 'promise 라는 <span class=\"textShadow\">함수</span>를 만들고 실행하면 괄호<span class=\"textShadow\">{}</span> 안에</br>있던 명령어가 실행합니다.',
        //     images: ['promise01','promise02'],            
        // }]
    }

    window.cm = new Entry.popupHelper();
    cm.setPopup(aaa);
    cm.show();
}

function testOb() {
    var aaa = {
        setPopupLayout: function (popup) {
            this.content_ = Entry.createElement('div');
            this.content_.addClass('entryPopupHelperContent');
            popup.popupWrapper_.appendChild(this.content_);
            popup.window_.addClass('objectPopupWindow');
            this.setContent(this, popup);
        },
        setContent: function (parent, popup) {
            if(this.object.length === 1) {
                parent.content_.addClass('singleItem');
                popup.window_.style.height = '219px';
            } else {
                parent.content_.addClass('multiItem');
                popup.window_.style.height = (93 + (this.object.length * 107) + 9) + 'px';
            }

            this.object.forEach(function (obj, i) {
                var dom = Entry.createElement('div');
                if(i > 0) {
                    dom.style.marginTop = '25px';
                }
                var objDom = Entry.createElement('div');
                objDom.addClass(obj.class);

                var equalDom = Entry.createElement('div');
                equalDom.addClass('equal');
                var textDom = Entry.createElement('div');
                textDom.addClass('objectText');

                if(obj.type === 'small') {
                    objDom.style.width = '82px';
                    objDom.style.marginLeft = '35px';
                } else {
                    objDom.style.width = '162px';
                    popup.window_.style.width = '480px';
                    parent.content_.style.paddingLeft = '35px';
                }
                textDom.textContent = obj.text;
                dom.appendChild(objDom);
                dom.appendChild(equalDom);
                dom.appendChild(textDom);
                parent.content_.appendChild(dom);
            });
        },
        title: Lang.Menus.maze_object_title,
        popupType: 'big',
        object: [{
            type: 'small',
            text: Lang.Menus.maze_object_parts_box,
            class: 'partsBox',
        },{
            type: 'small',
            text: Lang.Menus.maze_object_obstacle1,
            class: 'obstacle1',
        },{
            type: 'small',
            text: Lang.Menus.maze_object_friend,
            class: 'friend',
        },{
            type: 'small',
            text: Lang.Menus.maze_object_obstacle2,
            class: 'obstacle2',
        },{
            type: 'big',
            text: Lang.Menus.maze_object_wall1,
            class: 'wall1',
        },{
            type: 'big',
            text: Lang.Menus.maze_object_wall2,
            class: 'wall2',
        },{
            type: 'small',
            text: Lang.Menus.maze_object_battery,
            class: 'battery',
        },{
            type: 'big',
            text: Lang.Menus.maze_object_wall3,
            class: 'wall3',
        },{
            type: 'small',
            text: Lang.Menus.maze_object_obstacle3,
            class: 'obstacle3',
        }],
    }

    window.ob = new Entry.popupHelper();
    ob.setPopup(aaa);
    ob.show();
}

function testOp() {
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
            this.content_.addClass('entryPopupHelperContent');
            popup.window_.addClass('operationPopupWindow');
            popup.popupWrapper_.appendChild(this.stepBadge_);
            popup.popupWrapper_.appendChild(this.leftButton_);
            popup.popupWrapper_.appendChild(this.rightButton_);
            popup.popupWrapper_.appendChild(this.content_);
            popup.popupWrapper_.appendChild(this.view_);

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
                    if(elem.style.textAlign && elem.style.textAlign !== 'center') {
                        elem.style.width = '1px';
                    }
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
        title: Lang.Menus.maze_operation9_title,
        content : [{
            description: Lang.Menus.maze_operation9_1_desc,
            contentStyle: 'operation9_1',
            descStyle: 'descStyle1',
            textSet:[{
                text: Lang.Menus.maze_operation9_1_textset_1,
                x: 155,
                y: -90
            }]
        },{
            description: Lang.Menus.maze_operation9_2_desc,
            contentStyle: 'operation9_2',
            descStyle: 'descStyle1'
        },{
            description: Lang.Menus.maze_operation9_3_desc,
            contentStyle: 'operation9_3',
            descStyle: 'descStyle1',
            textSet:[{
                text: Lang.Menus.maze_operation9_3_textset_1,
                x: -345,
                y: -160
            }, {
                text: Lang.Menus.maze_operation9_3_textset_2,
                x: 365,
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

    window.op = new Entry.popupHelper();
    op.setPopup(aaa);
    op.show();
}

// window.p = new Entry.popupHelper();
// p.setPopup();

// p.show()