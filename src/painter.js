'use strict';

Entry.Painter = function() {

    this.toolbox = {
        selected: 'cursor' // pen, line, rect, circle...
    };
    this.stroke = {
        enabled: false,
        fillColor: '#000000',
        lineColor: '#000000',
        thickness: 1,
        fill: true,
        transparent: false,
        style: 'line',
        locked: false
    };
    this.file = {
        id: Entry.generateHash(),
        name: '새그림',
        modified: false,
        mode: 'new' // new or edit
    };
    this.font = {
        name: 'KoPub Batang',
        size: 20,
        style: 'normal'
    };

    this.selectArea = {};
};


Entry.Painter.prototype.initialize = function(painterView) {
    this.generateView(painterView);

    this.canvas = document.getElementById('entryPainterCanvas');
    this.canvas_ = document.getElementById('entryPainterCanvas_');
    this.stage = new createjs.Stage(this.canvas);

    this.stage.autoClear = true;
    this.stage.enableDOMEvents(true);

    // enabled mouse over / out events
    this.stage.enableMouseOver(10);
    this.stage.mouseMoveOutside = true; // keep tracking the mouse even when it leaves the canvas

    createjs.Touch.enable(this.stage);

    this.objectContainer = new createjs.Container();
    this.objectContainer.name = "container";
    this.stage.addChild(this.objectContainer);

    this.ctx = this.stage.canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.webkitImageSmoothingEnabled = false;
    this.ctx.mozImageSmoothingEnabled = false;
    this.ctx.msImageSmoothingEnabled = false;
    this.ctx.oImageSmoothingEnabled = false;

    this.ctx_ = this.canvas_.getContext("2d");

    this.initDashedLine();
    this.initPicture();
    this.initCoordinator();
    this.initHandle();
    this.initDraw();

    var painter = this;
    Entry.addEventListener('textUpdate', function() {
        var string = painter.inputField.value();
        if(string === ""){
            painter.inputField.hide();
            delete painter.inputField;
            return;
        }else{
            painter.inputField.hide();
            painter.drawText(string);
            painter.selectToolbox('cursor');
        }

    });
    this.selectToolbox('cursor');

};

Entry.Painter.prototype.initHandle = function() {

    this._handle = new createjs.Container();
    this._handle.rect = new createjs.Shape();
    this._handle.addChild(this._handle.rect);

    var handle = new createjs.Container();
    handle.name = "move";
    handle.width = 90;
    handle.height = 90;
    handle.x = 90;
    handle.y = 90;
    handle.rect = new createjs.Shape();
    var painter = this;
    handle.rect.on("mousedown", function(evt) {
        if (painter.toolbox.selected === 'cursor') {
            painter.initCommand();
            this.offset = {x:this.parent.x-this.x-evt.stageX,
                y:this.parent.y-this.y-evt.stageY};
            this.parent.handleMode = "move";
            handle.isSelectCenter = false;
        }
    });

    handle.rect.on("pressmove", function(evt) {
        if (painter.toolbox.selected === 'cursor' && !handle.isSelectCenter) {
            painter.doCommand();
            this.parent.x = evt.stageX + this.offset.x;
            this.parent.y = evt.stageY + this.offset.y;
            painter.updateImageHandle();
        }
    });
    handle.on("mouseup", function(evt) {
        painter.checkCommand();
    });

    handle.rect.cursor = "move";
    handle.addChild(handle.rect);
    handle.notch = new createjs.Shape();
    handle.addChild(handle.notch);
    handle.NEHandle = this.generateCornerHandle();
    handle.addChild(handle.NEHandle);
    handle.NWHandle = this.generateCornerHandle();
    handle.addChild(handle.NWHandle);
    handle.SWHandle = this.generateCornerHandle();
    handle.addChild(handle.SWHandle);
    handle.SEHandle = this.generateCornerHandle();
    handle.addChild(handle.SEHandle);

    handle.EHandle = this.generateXHandle();
    handle.addChild(handle.EHandle);
    handle.WHandle = this.generateXHandle();
    handle.addChild(handle.WHandle);
    handle.NHandle = this.generateYHandle();
    handle.addChild(handle.NHandle);
    handle.SHandle = this.generateYHandle();
    handle.addChild(handle.SHandle);
    handle.RHandle = new createjs.Shape();
    handle.RHandle.graphics.ss(2, 2, 0).beginFill('#888').s("#c1c7cd").f("#c1c7cd").dr(-2,-2,8,8);
    handle.RHandle.on("mousedown", function(evt) {
        painter.initCommand();

    });
    handle.RHandle.on("pressmove", function(evt) {
        painter.doCommand();
        var x = evt.stageX - this.parent.x;
        var y = evt.stageY - this.parent.y;
        if (x>=0)
            this.parent.rotation = Math.atan(y/x)/Math.PI*180+90;
        else
            this.parent.rotation = Math.atan(y/x)/Math.PI*180+270;
        painter.updateImageHandle();
    });
    handle.RHandle.cursor = "crosshair";
    handle.addChild(handle.RHandle);
    handle.on("mouseup", function(evt) {
        painter.checkCommand();
    });
    handle.visible = false;

    this.handle = handle;
    this.stage.addChild(handle);

    this.updateImageHandleCursor();

};

Entry.Painter.prototype.generateCornerHandle = function () {
    var painter = this;
    var handle = new createjs.Shape();
    handle.graphics.beginFill("#c1c7cd").ss(2, 2, 0).s("#c1c7cd").dr(-4,-4,8,8);
    handle.on("mousedown", function(evt) {
        painter.initCommand();
        this.offset = {x:evt.stageX - this.parent.x + this.parent.regX,
                       y:evt.stageY - this.parent.y + this.parent.regY};
    });
    handle.on("pressmove", function(evt) {
        painter.doCommand();
        var stageX = evt.stageX - this.parent.x + this.parent.regX;
        var stageY = evt.stageY - this.parent.y + this.parent.regY;
        var delta = Math.sqrt(Math.abs(stageX/this.offset.x*stageY/this.offset.y));
        if (this.parent.width * delta > 10 && this.parent.height * delta > 10) {
            this.parent.width = delta * this.parent.width;
            this.parent.height = delta * this.parent.height;
            this.offset = {x:evt.stageX - this.parent.x + this.parent.regX,
                           y:evt.stageY - this.parent.y + this.parent.regY};
        }
        painter.updateImageHandle();
    });
    handle.on("mouseup", function(evt) {
        painter.checkCommand();
    });
    return handle;
};

Entry.Painter.prototype.generateXHandle = function () {
    var painter = this;
    var handle = new createjs.Shape();
    handle.graphics.beginFill("#c1c7cd").ss(2, 2, 0).s("#c1c7cd").dr(-4,-4,8,8);
    handle.on("mousedown", function(evt) {
        painter.initCommand();
        this.offset = {x:evt.stageX - this.parent.x + this.parent.regX};
    });
    handle.on("pressmove", function(evt) {
        painter.doCommand();
        var stageX = evt.stageX - this.parent.x + this.parent.regX;
        var delta = Math.abs(stageX/this.offset.x);
        if (this.parent.width * delta > 10) {
            this.parent.width = delta * this.parent.width;
            this.offset = {x:evt.stageX - this.parent.x + this.parent.regX};
        }
        painter.updateImageHandle();
    });
    handle.on("mouseup", function(evt) {
        painter.checkCommand();
    });
    return handle;
};

Entry.Painter.prototype.generateYHandle = function () {
    var painter = this;
    var handle = new createjs.Shape();
    handle.graphics.beginFill("#c1c7cd").ss(2, 2, 0).s("#c1c7cd").dr(-4,-4,8,8);
    handle.on("mousedown", function(evt) {
        painter.initCommand();
        this.offset = {y:evt.stageY - this.parent.y + this.parent.regY};
    });
    handle.on("pressmove", function(evt) {
        painter.doCommand();
        var stageY = evt.stageY - this.parent.y + this.parent.regY;
        var delta = Math.abs(stageY/this.offset.y);
        if (this.parent.height * delta > 10) {
            this.parent.height = delta * this.parent.height;
            this.offset = {y:evt.stageY - this.parent.y + this.parent.regY};
        }
        painter.updateImageHandle();
    });
    handle.on("mouseup", function(evt) {
        painter.checkCommand();
    });
    return handle;
};

Entry.Painter.prototype.updateImageHandle = function() {
    if (!this.handle.visible)
        return;

    var handle = this.handle;
    var direction = handle.direction;
    var mode = handle.handleMode;
    var x = handle.x;
    var y = handle.y;
    var width = handle.width;
    var height = handle.height;
    var regX = handle.regX;
    var regY = handle.regY;
    handle.rect.graphics.clear().f("rgba(0,0,1,0.01)").ss(2, 2, 0).s("#c1c7cd")
        .lt(-width/2,-height/2)
        .lt(0,-height/2)
        .lt(0,-height/2)
        .lt(+width/2,-height/2)
        .lt(+width/2,+height/2)
        .lt(-width/2,+height/2).cp();
    handle.notch.graphics.clear().f("rgba(0,0,1,0.01)").ss(2, 2, 0).s("#c1c7cd")
        .lt(0,-height/2)
        .lt(0,-height/2-20).cp();
    handle.NEHandle.x = + handle.width/2;
    handle.NEHandle.y = - handle.height/2;
    handle.NWHandle.x = - handle.width/2;
    handle.NWHandle.y = - handle.height/2;
    handle.SWHandle.x = - handle.width/2;
    handle.SWHandle.y = + handle.height/2;
    handle.SEHandle.x = + handle.width/2;
    handle.SEHandle.y = + handle.height/2;
    handle.EHandle.x = + handle.width/2;
    handle.EHandle.y = 0;
    handle.WHandle.x = - handle.width/2;
    handle.WHandle.y = 0;
    handle.NHandle.x = 0;
    handle.NHandle.y = - handle.height/2;
    handle.SHandle.x = 0;
    handle.SHandle.y = + handle.height/2;
    handle.RHandle.x = 0-2;
    handle.RHandle.y = - handle.height/2 -20-2;

    if (this.handle.visible) {
        var entity = this.selectedObject;
        if (this.selectedObject.text) {
            entity.width = this.selectedObject.width;
            entity.height = this.selectedObject.height;
        } else {
            entity.width = entity.image.width;
            entity.height = entity.image.height;
        }
        entity.scaleX = handle.width/entity.width;
        entity.scaleY = handle.height/entity.height;
        entity.x = handle.x;
        entity.y = handle.y;
        entity.regX = (entity.width/2 + regX / entity.scaleX);
        entity.regY = (entity.height/2 + regY / entity.scaleY);

        entity.rotation = handle.rotation;
        entity.direction = direction;

        this.selectArea.x1 = handle.x - handle.width / 2;
        this.selectArea.y1 = handle.y - handle.height / 2;
        this.selectArea.x2 = handle.width;
        this.selectArea.y2 = handle.height;

        this.objectWidthInput.value = Math.abs(entity.width * entity.scaleX).toFixed(0);
        this.objectHeightInput.value = Math.abs(entity.height * entity.scaleY).toFixed(0);
        this.objectRotateInput.value = (entity.rotation * 1).toFixed(0);
    }

    this.updateImageHandleCursor();
    this.stage.update();
};

Entry.Painter.prototype.updateImageHandleCursor = function () {
    var handle = this.handle;
    handle.rect.cursor = "move";
    handle.RHandle.cursor = "crosshair";
    var rotation = handle.rotation;
    var cursorList = ['nwse-resize', 'ns-resize','nesw-resize', 'ew-resize'];
    var iter = Math.floor((rotation+22.5)%180/45);
    for (var i=0; i<iter; i++) {
        cursorList.push(cursorList.shift());
    }
    handle.NHandle.cursor = cursorList[1];
    handle.NEHandle.cursor = cursorList[2];
    handle.EHandle.cursor = cursorList[3];
    handle.SEHandle.cursor = cursorList[0];
    handle.SHandle.cursor = cursorList[1];
    handle.SWHandle.cursor = cursorList[2];
    handle.WHandle.cursor = cursorList[3];
    handle.NWHandle.cursor = cursorList[0];
};

Entry.Painter.prototype.clearCanvas = function() {
    this.clearHandle();
    this.initCommand();

    this.objectContainer.removeAllChildren();
    this.stage.update();

    this.colorLayerData = this.ctx.getImageData(0, 0,
                                                this.canvas.width,
                                                this.canvas.height);
    for (var i=0,len=this.colorLayerData.data.length; i<len; i++) {
        this.colorLayerData.data[i] = 255;
        this.colorLayerData.data[i+1] = 255;
        this.colorLayerData.data[i+2] = 255;
        this.colorLayerData.data[i+3] = 255;
    }
    this.reloadContext();

};

Entry.Painter.prototype.newPicture = function() {

    var newPicture = {
        dimension: {
            height: 1,
            width: 1
        },
        //filename: "_1x1",
        fileurl: Entry.mediaFilePath + '_1x1.png',
        name: Lang.Workspace.new_picture
    };

    newPicture.id = Entry.generateHash();
    Entry.playground.addPicture(newPicture, true);

};

Entry.Painter.prototype.initPicture = function() {
    var painter = this;
    Entry.addEventListener('pictureSelected', function(picture) {
        painter.selectToolbox('cursor');
        if (painter.file.id === picture.id)
            return;

        if (painter.file.modified) {
            var save = confirm('수정된 내용을 저장하시겠습니까?');
            if (save) {
                painter.file_ = JSON.parse(JSON.stringify(painter.file));
                painter.file_save(true);
                painter.file.modified = false;
            }
        }
        painter.clearCanvas();

        var image = new Image();
        if (picture.id)
            image.id = picture.id;
        else
            image.id = Entry.generateHash();

        painter.file.id = image.id;
        painter.file.name = picture.name;
        painter.file.mode = 'edit';

        if (picture.fileurl) {
            image.src = picture.fileurl;
        } else {
            // deprecated
            image.src = '/uploads/' + picture.filename.substring(0,2)+'/' + picture.filename.substring(2,4)+'/image/'+picture.filename+'.png';
        }

        image.onload = function(event) {
            painter.addImage(event.target);
        };
    });

    Entry.addEventListener('pictureImport', function(picture) {
        painter.addPicture(picture);
    });

    Entry.addEventListener('pictureNameChanged', function(picture) {
        painter.file.name = picture.name;
    });
};

Entry.Painter.prototype.initDraw = function() {
    var painter = this;

    this.stage.on("stagemousedown", function(event) {
        painter.stagemousedown(event);
    });

    this.stage.on("stagemouseup", function(event) {
        painter.stagemouseup(event);
    });

    this.stage.on("stagemousemove", function(event) {
        painter.stagemousemove(event);
    });

};

Entry.Painter.prototype.selectObject = function(bitmap, isCrop) {
    this.selectedObject = bitmap;
    this.handle.visible = bitmap.visible;

    if (isCrop) {
        this.handle.width = this.copy.width;
        this.handle.height = this.copy.height;

        this.handle.x = this.selectArea.x1 + this.copy.width / 2;
        this.handle.y = this.selectArea.y1 + this.copy.height / 2;
    } else {
        this.handle.width = bitmap.scaleX * bitmap.image.width;
        this.handle.height = bitmap.scaleY * bitmap.image.height;

        this.handle.x = bitmap.x;
        this.handle.y = bitmap.y;
        this.handle.regX = + (bitmap.regX - bitmap.image.width/2) * bitmap.scaleX;
        this.handle.regY = + (bitmap.regY - bitmap.image.height/2) * bitmap.scaleY;
    }
    this.handle.rotation = bitmap.rotation;
    this.handle.direction = 0;

    this.updateImageHandle();
};

Entry.Painter.prototype.selectTextObject = function(text) {
    this.selectedObject = text;

    var bounds = text.getTransformedBounds();
    this.handle.visible = text.visible;

    if (!text.width) this.selectedObject.width = bounds.width;
    if (!text.height) this.selectedObject.height = bounds.height;

    this.handle.width = text.scaleX * this.selectedObject.width;
    this.handle.height = text.scaleY * this.selectedObject.height;

    this.handle.x = text.x;
    this.handle.y = text.y;

    if (!text.regX) text.regX = text.width / 2;
    if (!text.regY) text.regY = text.height / 2;
    this.handle.regX = (text.regX - this.selectedObject.width/2) * text.scaleX;
    this.handle.regY = (text.regY - this.selectedObject.height/2) * text.scaleY;

    this.handle.rotation = text.rotation;
    this.handle.direction = 0;

    this.updateImageHandle();
};

Entry.Painter.prototype.updateHandle = function() {
    if (this.stage.getChildIndex(this._handle) > -1)
        this.stage.removeChild(this._handle);

    if (this.stage.getChildIndex(this.handle) === -1)
        this.stage.addChild(this.handle);

    var hit = new createjs.Shape();
    hit.graphics.clear().beginFill("#000").rect(this.selectArea.x1,
                                this.selectArea.y1,
                                this.selectArea.x2,
                                this.selectArea.y2);
    this.handle.rect.hitArea = hit;

    this.handle.rect.graphics.clear()
        .setStrokeStyle(1, 'round')
        .beginStroke("#000000")
        .drawDashedRect(this.selectArea.x1,
                    this.selectArea.y1,
                    this.selectArea.x2,
                    this.selectArea.y2,
                    4);

    this.stage.update();

};

Entry.Painter.prototype.updateHandle_ = function() {
    if (this.stage.getChildIndex(this._handle > -1))
        this.stage.addChild(this._handle);

    this._handle.rect.graphics.clear()
        .setStrokeStyle(1, 'round')
        .beginStroke("#cccccc")
        .drawDashedRect(this.selectArea.x1,
                    this.selectArea.y1,
                    this.selectArea.x2,
                    this.selectArea.y2,
                    2);

    this.stage.update();
};

Entry.Painter.prototype.matchTolerance = function(pos, startR, startG, startB, tolerance) {
    var rMax = startR + (startR * (tolerance / 100));
    var gMax = startG + (startG * (tolerance / 100));
    var bMax = startB + (startB * (tolerance / 100));

    var rMin = startR - (startR * (tolerance / 100));
    var gMin = startG - (startG * (tolerance / 100));
    var bMin = startB - (startB * (tolerance / 100));

    var r = this.colorLayerData.data[pos];
    var g = this.colorLayerData.data[pos+1];
    var b = this.colorLayerData.data[pos+2];

    return (
        (r >= rMin && r <= rMax) && (g >= gMin && g <= gMax) && (b >= bMin && b <= bMax)
        );
};

Entry.Painter.prototype.matchColorOnly = function(pos, r, g, b) {
    // If the current pixel matches the clicked color
    if (r === this.colorLayerData.data[pos] &&
        g === this.colorLayerData.data[pos + 1] &&
        b === this.colorLayerData.data[pos + 2]) {
        return true;
    }

    return false;
};

Entry.Painter.prototype.matchColor = function(pos, r, g, b, a) {
    // If the current pixel matches the clicked color
    if (r === this.colorLayerData.data[pos] &&
        g === this.colorLayerData.data[pos + 1] &&
        b === this.colorLayerData.data[pos + 2] &&
        a === this.colorLayerData.data[pos + 3]) {
        return true;
    }

    return false;
};

Entry.Painter.prototype.colorPixel = function(pos, r, g, b, a) {

    if (!a) a = 255;
    if (this.stroke.transparent) {
        r = 0;
        g = 0;
        b = 0;
        a = 0;
    }

    this.colorLayerData.data[pos] = r;
    this.colorLayerData.data[pos + 1] = g;
    this.colorLayerData.data[pos + 2] = b;
    this.colorLayerData.data[pos + 3] = a;
};

Entry.Painter.prototype.pickStrokeColor = function(event) {
    var x = Math.round(event.stageX);
    var y = Math.round(event.stageY);

    var pos = (y * this.canvas.width + x) * 4,
        r = this.colorLayerData.data[pos],
        g = this.colorLayerData.data[pos+1],
        b = this.colorLayerData.data[pos+2],
        a = this.colorLayerData.data[pos+3];

    this.stroke.lineColor = Entry.rgb2hex(r,g,b);
    document.getElementById('entryPainterAttrCircle').style.backgroundColor = this.stroke.lineColor;
    document.getElementById('entryPainterAttrCircleInput').value = this.stroke.lineColor;

};

Entry.Painter.prototype.drawText = function(string) {
    var fontStyle = document.getElementById('entryPainterAttrFontStyle').value;
    var fontName = document.getElementById('entryPainterAttrFontName').value;
    var fontSize = document.getElementById('entryPainterAttrFontSize').value;
    var textStyle = fontStyle + ' ' + fontSize + 'px ' + '"' + fontName + '"';
    var textObject = new createjs.Text(string, textStyle, this.stroke.lineColor);
    textObject.textBaseline = 'top';
    textObject.x = this.oldPt.x;
    textObject.y = this.oldPt.y;

    this.objectContainer.addChild(textObject);
    this.selectTextObject(textObject);

    this.file.modified = true;
};

Entry.Painter.prototype.addImage  = function(image) {
    var bitmap = new createjs.Bitmap(image);
    this.objectContainer.addChild(bitmap);

    bitmap.x = this.stage.canvas.width / 2;
    bitmap.y = this.stage.canvas.height / 2;
    bitmap.regX = bitmap.image.width / 2 | 0;
    bitmap.regY = bitmap.image.height / 2 | 0;
    if (bitmap.image.height > 540) {
        var scale = 540 / bitmap.image.height;
        bitmap.scaleX = scale;
        bitmap.scaleY = scale;
    }
    bitmap.name = image.id;
    bitmap.id = image.id;

    this.selectObject(bitmap);
    this.stage.update();

};

Entry.Painter.prototype.createBrush = function() {
    this.initCommand();

    this.brush = new createjs.Shape();

    this.objectContainer.addChild(this.brush);
    this.stage.update();
};

Entry.Painter.prototype.createEraser = function() {
    this.initCommand();

    this.eraser = new createjs.Shape();

    this.objectContainer.addChild(this.eraser);
    this.stage.update();
};

Entry.Painter.prototype.clearHandle = function() {
    if (this.handle.visible)
        this.handle.visible = false;

    if (this.coordinator.visible)
        this.coordinator.visible = false;

    this.stage.update();
};

Entry.Painter.prototype.initCommand = function() {
    var restoreHandle = false;
    if (this.handle.visible) {
        restoreHandle = true;
        this.handle.visible = false;
    }
    var restoreCoordinator = false;
    if (this.coordinator.visible) {
        restoreCoordinator = true;
        this.coordinator.visible = false;
    }

    if (restoreHandle || restoreCoordinator)
        this.stage.update();

    this.isCommandValid = false;
    this.colorLayerModel = this.ctx.getImageData(0, 0,
                                                this.canvas.width,
                                                this.canvas.height);
    Entry.stateManager.addCommand("edit sprite",
                                 this,
                                 this.restorePainter,
                                 this.colorLayerModel);

    if (restoreHandle)
        this.handle.visible = true;

    if (restoreCoordinator)
        this.coordinator.visible = true;

    if (restoreHandle || restoreCoordinator)
        this.stage.update();

};

Entry.Painter.prototype.doCommand = function() {
    this.isCommandValid = true;
};

Entry.Painter.prototype.checkCommand = function() {
    if (!this.isCommandValid)
        Entry.dispatchEvent('cancelLastCommand');
};

Entry.Painter.prototype.restorePainter = function(colorLayerModel) {
    this.clearHandle();

    var currentColorModel = this.ctx.getImageData(0, 0,
                                                this.canvas.width,
                                                this.canvas.height);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.putImageData(colorLayerModel, 0, 0);

    var image = new Image();
    image.src = this.canvas.toDataURL();

    var painter = this;
    image.onload = function(event) {
        var bitmap = new createjs.Bitmap(event.target);
        painter.objectContainer.removeAllChildren();
        painter.objectContainer.addChild(bitmap);
    };

    Entry.stateManager.addCommand("restore sprite",
                                 this,
                                 this.restorePainter,
                                 currentColorModel);
};

Entry.Painter.prototype.platten = function() {
    this.colorLayerData = this.ctx.getImageData(0, 0,
                                                this.canvas.width,
                                                this.canvas.height);
    this.reloadContext();
};

Entry.Painter.prototype.fill = function() {
    if (this.stroke.locked) {
        return;
    }
    this.stroke.locked = true;

    this.initCommand();
    this.doCommand();

    this.clearHandle();

    var width = this.canvas.width;
    var height = this.canvas.height;

    this.colorLayerData = this.ctx.getImageData(0, 0, width, height);

    var point = new createjs.Point(this.stage.mouseX, this.stage.mouseY);
    point.x = Math.round(point.x);
    point.y = Math.round(point.y);

    var pos = (point.y * width + point.x) * 4,
        r = this.colorLayerData.data[pos],
        g = this.colorLayerData.data[pos+1],
        b = this.colorLayerData.data[pos+2],
        a = this.colorLayerData.data[pos+3];

    var reachLeft, reachRight;
    var pixelStack = [[point.x, point.y]];

    var rgb = Entry.hex2rgb(this.stroke.lineColor);

    var t = 10;

    while(pixelStack.length) {
        var newPos = pixelStack.pop();
        var x = newPos[0];
        var y = newPos[1];

        pos = (y * width + x) * 4;

        while(y >= 0 && this.matchColor(pos, r, g, b, a)) {
            y -= 1;
            pos -= width * 4;
        }

        pos += width * 4;
        y += 1;
        reachLeft = false;
        reachRight = false;

        while(y < height-1 && this.matchColor(pos, r, g, b, a)) {
            y += 1;

            this.colorPixel(pos, rgb.r, rgb.g, rgb.b);

            if (x > 0) {
                if (this.matchColor(pos - 4, r, g, b, a)) {
                    if (!reachLeft) {
                        pixelStack.push([x-1, y]);
                        reachLeft = true;
                    }
                } else if (reachLeft) {
                    reachLeft = false;
                }
            }

            if (x < width-1) {
                if (this.matchColor(pos + 4, r, g, b, a)) {
                    if (!reachRight) {
                        pixelStack.push([x+1, y]);
                        reachRight = true;
                    }
                } else if (reachRight) {
                    reachRight = false;
                }
            }

            pos += width * 4;

        }
        if (pixelStack.length > 1080)
            break;
    }

    this.file.modified = true;
    this.reloadContext();
};

Entry.Painter.prototype.reloadContext = function() {

    delete this.selectedObject;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.putImageData(this.colorLayerData, 0, 0);

    var image = new Image();
    image.src = this.canvas.toDataURL();

    var painter = this;
    image.onload = function(event) {
        var bitmap = new createjs.Bitmap(event.target);
        painter.objectContainer.removeAllChildren();
        painter.objectContainer.addChild(bitmap);
        painter.stroke.locked = false;
    };

};

Entry.Painter.prototype.move_pen = function() {
    var midPt = new createjs.Point(this.oldPt.x + this.stage.mouseX >> 1,
                                   this.oldPt.y + this.stage.mouseY >> 1);
    this.brush.graphics
        .setStrokeStyle(this.stroke.thickness, 'round')
        .beginStroke(this.stroke.lineColor)
        .moveTo(midPt.x, midPt.y)
        .curveTo(this.oldPt.x, this.oldPt.y,
            this.oldMidPt.x, this.oldMidPt.y);

    this.oldPt.x = this.stage.mouseX;
    this.oldPt.y = this.stage.mouseY;

    this.oldMidPt.x = midPt.x;
    this.oldMidPt.y = midPt.y;

    this.file.modified = true;

    this.stage.update();
};

Entry.Painter.prototype.move_line = function() {
    this.brush.graphics.clear()
        .beginStroke(this.stroke.lineColor)
        .setStrokeStyle(this.stroke.thickness, 'round')
        .moveTo(this.oldPt.x, this.oldPt.y)
        .lineTo(this.stage.mouseX, this.stage.mouseY);

    this.file.modified = true;
    this.stage.update();
};

Entry.Painter.prototype.move_rect = function() {
    var width = this.stage.mouseX - this.oldPt.x;
    var height = this.stage.mouseY - this.oldPt.y;
    if(event.shiftKey){
        height= width;
    }
    if (this.stroke.fill) {
        if( this.stroke.thickness === 0){
            this.brush.graphics.clear()
            .setStrokeStyle(this.stroke.thickness, 'round')
            .beginFill(this.stroke.fillColor)
            .drawRect(this.oldPt.x,
                this.oldPt.y,

                width,
                height);
        }else{
            this.brush.graphics.clear()
            .beginStroke(this.stroke.lineColor)
            .setStrokeStyle(this.stroke.thickness, 'round')
            .beginFill(this.stroke.fillColor)
            .drawRect(this.oldPt.x,
                this.oldPt.y,
                width,
                height);
        }
    } else {
        if( this.stroke.thickness === 0) {
            this.brush.graphics.clear()
            .setStrokeStyle(this.stroke.thickness, 'round')
            .drawRect(this.oldPt.x,
                this.oldPt.y,
                width,
                height);
        } else {
            this.brush.graphics.clear()
                .beginStroke(this.stroke.lineColor)
                .setStrokeStyle(this.stroke.thickness, 'round')
                .drawRect(this.oldPt.x,
                    this.oldPt.y,
                    width,
                    height);
        }
    }
    this.file.modified = true;
    this.stage.update();
};

Entry.Painter.prototype.move_circle = function() {
    var width = this.stage.mouseX - this.oldPt.x;
    var height = this.stage.mouseY - this.oldPt.y;
    if(event.shiftKey){
        height= width;
    }
    if(this.stroke.fill){
        if(this.stroke.thickness === 0){
            this.brush.graphics.clear()
            .beginStroke(this.stroke.fillColor)
            .setStrokeStyle(this.stroke.thickness, 'round')
            .beginFill(this.stroke.fillColor)
            .drawEllipse(this.oldPt.x,this.oldPt.y,width,height);
        }else{
            this.brush.graphics.clear()
            .beginStroke(this.stroke.lineColor)
            .setStrokeStyle(this.stroke.thickness, 'round')
            .beginFill(this.stroke.fillColor)
            .drawEllipse(this.oldPt.x,
                this.oldPt.y,width,height);
        }
    }else if(!this.stroke.fill){
        if(this.stroke.thickness === 0){
            this.brush.graphics.clear()
            .drawEllipse(this.oldPt.x,this.oldPt.y,width,height);
        }else{
            this.brush.graphics.clear()
            .beginStroke(this.stroke.lineColor)
            .setStrokeStyle(this.stroke.thickness, 'round')
            .drawEllipse(this.oldPt.x,this.oldPt.y,width,height);
        }
    }
    this.file.modified = true;
    this.stage.update();
};

Entry.Painter.prototype.edit_copy = function() {
    if (!this.selectArea) {
        alert('복사할 영역을 선택하세요.');
        return;
    }
    this.clearHandle();

    if (this.selectedObject)
        delete this.selectedObject;

    this.copyLayerData = this.ctx.getImageData(this.selectArea.x1,
                                            this.selectArea.y1,
                                            this.selectArea.x2,
                                            this.selectArea.y2);
    this.copy = {};
    this.copy.width = this.selectArea.x2;
    this.copy.height = this.selectArea.y2;
    this.canvas_.width = this.copy.width;
    this.canvas_.height = this.copy.height;

    this.ctx_.clearRect(0, 0, this.canvas_.width, this.canvas_.height);
    this.ctx_.putImageData(this.copyLayerData, 0, 0);
};

Entry.Painter.prototype.edit_cut = function() {
    if (!this.selectArea) {
        alert('자를 영역을 선택하세요.');
        return;
    }
    this.clearHandle();

    if (this.selectedObject)
        delete this.selectedObject;

    this.copyLayerData = this.ctx.getImageData(this.selectArea.x1,
                                    this.selectArea.y1,
                                    this.selectArea.x2,
                                    this.selectArea.y2);
    this.copy = {};
    this.copy.width = this.selectArea.x2;
    this.copy.height = this.selectArea.y2;
    this.canvas_.width = this.copy.width;
    this.canvas_.height = this.copy.height;

    this.ctx_.clearRect(0, 0, this.canvas_.width, this.canvas_.height);
    this.ctx_.putImageData(this.copyLayerData, 0, 0);

    this.ctx.clearRect(this.selectArea.x1,
                  this.selectArea.y1,
                  this.selectArea.x2,
                  this.selectArea.y2);

    this.colorLayerData = this.ctx.getImageData(0, 0,
                                         this.canvas.width,
                                         this.canvas.height);

    this.reloadContext();

    this.file.modified = true;
};

Entry.Painter.prototype.edit_paste = function() {
    var image = new Image();
    image.src = this.canvas_.toDataURL();

    var painter = this;
    image.onload = function(event) {
        var bitmap = new createjs.Bitmap(event.target);
        bitmap.x = painter.canvas.width / 2;
        bitmap.y = painter.canvas.height / 2;
        bitmap.regX = painter.copy.width / 2 | 0;
        bitmap.regY = painter.copy.height / 2 | 0;

        bitmap.id = Entry.generateHash();
        painter.objectContainer.addChild(bitmap);

        painter.selectObject(bitmap, true);
    };

    this.file.modified = true;
};

Entry.Painter.prototype.edit_select = function() {
    this.clearHandle();

    if (this.selectedObject)
        delete this.selectedObject;

    this.copyLayerData = this.ctx.getImageData(this.selectArea.x1,
                                    this.selectArea.y1,
                                    this.selectArea.x2,
                                    this.selectArea.y2);
    this.copy = {};
    this.copy.width = this.selectArea.x2;
    this.copy.height = this.selectArea.y2;
    this.canvas_.width = this.copy.width;
    this.canvas_.height = this.copy.height;

    this.ctx_.clearRect(0, 0, this.canvas_.width, this.canvas_.height);
    this.ctx_.putImageData(this.copyLayerData, 0, 0);

    this.ctx.clearRect(this.selectArea.x1,
                  this.selectArea.y1,
                  this.selectArea.x2,
                  this.selectArea.y2);

    this.colorLayerData = this.ctx.getImageData(0, 0,
                                         this.canvas.width,
                                         this.canvas.height);

     this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.putImageData(this.colorLayerData, 0, 0);

    var image = new Image();
    image.src = this.canvas.toDataURL();

    var painter = this;
    image.onload = function(event) {
        var bitmap = new createjs.Bitmap(event.target);
        painter.objectContainer.removeAllChildren();
        painter.objectContainer.addChild(bitmap);

        var selectImage = new Image();
        selectImage.src = painter.canvas_.toDataURL();
        selectImage.onload = function(evt) {
            var selectBitmap = new createjs.Bitmap(evt.target);
            selectBitmap.x = painter.selectArea.x1 + painter.copy.width / 2;
            selectBitmap.y = painter.selectArea.y1 + painter.copy.height / 2;
            selectBitmap.regX = painter.copy.width / 2 | 0;
            selectBitmap.regY = painter.copy.height / 2 | 0;

            selectBitmap.id = Entry.generateHash();
            selectBitmap.name = selectBitmap.id;
            painter.objectContainer.addChild(selectBitmap);

            painter.selectObject(selectBitmap, true);
        };

    };


};

Entry.Painter.prototype.move_erase = function(event) {
    var midPt = new createjs.Point(this.oldPt.x + this.stage.mouseX >> 1,
                                   this.oldPt.y + this.stage.mouseY >> 1);
    this.eraser.graphics
        .setStrokeStyle(this.stroke.thickness, 'round')
        .beginStroke('#ffffff')
        .moveTo(midPt.x, midPt.y)
        .curveTo(this.oldPt.x, this.oldPt.y,
            this.oldMidPt.x, this.oldMidPt.y);

    this.oldPt.x = this.stage.mouseX;
    this.oldPt.y = this.stage.mouseY;

    this.oldMidPt.x = midPt.x;
    this.oldMidPt.y = midPt.y;

    this.file.modified = true;
    this.stage.update();
};

Entry.Painter.prototype.settingShapeBlur = function () {
    this.objectWidthInput.blur();
    this.objectHeightInput.blur();
    this.objectRotateInput.blur();
};

Entry.Painter.prototype.stagemousedown = function (event) {
    if (Entry.playground.getViewMode() != 'picture')
        return;
    this.settingShapeBlur();

    this.oldPt = new createjs.Point(event.stageX, event.stageY);
    this.oldMidPt = this.oldPt.clone();

    if (this.toolbox.selected === 'select') {
        this.stage.addChild(this._handle);

    } else if (this.toolbox.selected === 'spoid') {
        this.pickStrokeColor(event);

    } else if (this.toolbox.selected === 'text') {
        this.showInputField(event);
        this.stage.update();


    } else if (this.toolbox.selected === 'erase') {
        this.createEraser();
        this.stroke.enabled = true;

    } else if (this.toolbox.selected === 'fill') {

        this.fill();

    } else if (this.toolbox.selected === 'cursor') {

    } else { // brush
        this.createBrush();
        this.stroke.enabled = true;
    }

};

Entry.Painter.prototype.stagemousemove = function(event) {
    if (Entry.playground.getViewMode() != 'picture')
        return;

    if (this.toolbox.selected === 'select' &&
            this.stage.getChildIndex(this._handle) > -1) {

        this.selectArea.x1 = this.oldPt.x;
        this.selectArea.y1 = this.oldPt.y;
        this.selectArea.x2 = event.stageX - this.oldPt.x;
        this.selectArea.y2 = event.stageY - this.oldPt.y;

        this.updateHandle_();
    } else { // etc
        if (this.stroke.enabled) {
            this.doCommand();
            if (this.toolbox.selected === 'pen')
                this.move_pen(event);
            else if (this.toolbox.selected === 'line')
              this.move_line(event);
            else if (this.toolbox.selected === 'rect')
              this.move_rect(event);
            else if (this.toolbox.selected === 'circle')
              this.move_circle(event);
            else if (this.toolbox.selected === 'erase')
              this.move_erase(event);
        }
    }

    this.painterTopStageXY.innerHTML = 'x:'+ event.stageX.toFixed(1) +
        ', y:'+event.stageY.toFixed(1);
};

Entry.Painter.prototype.stagemouseup = function (event) {
    if (Entry.playground.getViewMode() != 'picture')
        return;
    if (this.toolbox.selected === 'select') {

        this.selectArea.x1 = this.oldPt.x;
        this.selectArea.y1 = this.oldPt.y;
        this.selectArea.x2 = event.stageX - this.oldPt.x;
        this.selectArea.y2 = event.stageY - this.oldPt.y;


        this.stage.removeChild(this._handle);
        this.stage.update();

        if (this.selectArea.x2 > 0 && this.selectArea.y2 > 0)
            this.edit_select();

        this.selectToolbox('cursor');

    } else if (this.toolbox.selected === 'cursor') {

    } else { // etc

        if (this.stroke.enabled) {

            if (this.objectContainer.getChildIndex(this.eraser) > -1)
                this.eraser.graphics.endStroke();

            if (this.objectContainer.getChildIndex(this.brush) > -1) {
                this.brush.graphics.endStroke();
            }

            this.clearHandle();
            this.platten();

            //this.stage.addChild(this.cursor);

            this.stroke.enabled = false;

            this.checkCommand();
        }
    }
};

Entry.Painter.prototype.file_save = function(saveChanges) {

    this.clearHandle();
    this.transparent();
    this.trim();

    var canvasImage = this.canvas_.toDataURL();
    Entry.dispatchEvent('saveCanvasImage', {
                        file: (saveChanges ? this.file_ : this.file),
                        image: canvasImage
    });

    this.file.modified = false;

};

Entry.Painter.prototype.transparent = function() {
    var width = this.canvas.width;
    var height = this.canvas.height;
    this.colorLayerData = this.ctx.getImageData(0, 0, width, height);

    var leftTop = 0;
    var leftBottom = width * (height - 1) * 4;
    var rightTop = (width-1) * 4;
    var rightBottom = (width * height - 1) * 4;


    if (this.matchColorOnly(leftTop, 255, 255, 255)) {
        this.fillTransparent(1,1);
    } else if (this.matchColorOnly(leftBottom, 255, 255, 255)) {
        this.fillTransparent(1, height);
    } else if (this.matchColorOnly(rightTop, 255, 255, 255)) {
        this.fillTransparent(width, 1);
    } else if (this.matchColorOnly(rightBottom, 255, 255, 255)) {
        this.fillTransparent(width, height);
    }

};

Entry.Painter.prototype.fillTransparent = function(x, y) {
    this.stage.mouseX = x;
    this.stage.mouseY = y;
    this.stroke.transparent = true;
    this.fill();
};


Entry.Painter.prototype.trim = function() {
    var width = this.canvas.width;
    var height = this.canvas.height;

    var pixels = this.ctx.getImageData(0, 0, width, height);
    var length = pixels.data.length;
    var i;

    var bound = {
        top: null,
        left: null,
        right: null,
        bottom: null
    };
    var x, y;

    for (i=0; i<length; i += 4) {
        if (pixels.data[i+3] !== 0) {
            x = (i/4) % width;
            y = ~~((i/4) / width);

            if (bound.top === null)
                bound.top = y;

            if (bound.left === null) {
                bound.left = x;
            } else if (x < bound.left) {
                bound.left = x;
            }

            if (bound.right === null) {
                bound.right = x;
            } else {
                bound.right = x;
            }

            if (bound.bottom === null) {
                bound.bottom = y;
            } else if (bound.bottom < y) {
                bound.bottom = y;
            }
        }
    }

    var trimHeight = bound.bottom - bound.top;
    var trimWidth = bound.right - bound.left;
    var trimmed = null;
    if (trimHeight === 0 || trimWidth === 0) {
        trimmed = this.ctx.getImageData(0,0,1,1);
        trimmed.data[0] = 255;
        trimmed.data[1] = 255;
        trimmed.data[2] = 255;
        trimmed.data[3] = 255;
        this.canvas_.width = 1;
        this.canvas_.height = 1;
    } else {
        trimmed = this.ctx.getImageData(bound.left,
                                       bound.top,
                                       trimWidth,
                                       trimHeight);
        this.canvas_.width = trimWidth;
        this.canvas_.height = trimHeight;
    }
    this.ctx_.putImageData(trimmed, 0, 0);

};

Entry.Painter.prototype.showInputField = function(event) {
    if (!this.inputField) {
        this.initCommand();
        this.doCommand();

        this.inputField = new CanvasInput({
            canvas: document.getElementById('entryPainterCanvas'),
            fontSize: 20,
            fontFamily: this.font.name,
            fontColor: '#000',
            width: 650,
            padding: 8,
            borderWidth: 1,
            borderColor: '#000',
            borderRadius: 3,
            boxShadow: '1px 1px 0px #fff',
            innerShadow: '0px 0px 5px rgba(0, 0, 0, 0.5)',
            x: event.stageX,
            y: event.stageY,
            onsubmit: function() {
                Entry.dispatchEvent('textUpdate');
            }

        });
        this.inputField.show();
    } else {

        Entry.dispatchEvent('textUpdate');
        delete this.inputField;

    }
};

Entry.Painter.prototype.addPicture = function(picture) {
    this.initCommand();

    var image = new Image();
    image.id = Entry.generateHash();
    if (picture.fileurl) {
        image.src = picture.fileurl;
    } else {
        image.src = '/uploads/' + picture.filename.substring(0,2)+'/'+picture.filename.substring(2,4)+'/image/'+picture.filename+'.png';
    }

    var painter = this;
    image.onload = function(event) {
        painter.addImage(event.target);
        painter.selectToolbox('cursor');
    };
};

/**
 * Initialize coordinate on canvas. It is toggle by Engine.
 */
Entry.Painter.prototype.initCoordinator = function() {
    var coordinator = new createjs.Container();
    var img = new createjs.Bitmap(Entry.mediaFilePath + "/workspace_coordinate.png");
    coordinator.addChild(img);
    this.stage.addChild(coordinator);

    coordinator.visible = false;

    /** @type {createjs.Container} */
    this.coordinator = coordinator;
};

/**
 * Toggle coordinator
 */
Entry.Painter.prototype.toggleCoordinator = function() {
    this.coordinator.visible = !this.coordinator.visible;
    this.stage.update();
};

Entry.Painter.prototype.initDashedLine = function() {
    createjs.Graphics.prototype.dashedLineTo = function( x1 , y1 , x2 , y2 , dashLen ){
        this.moveTo( x1 , y1 );

        var dX = x2 - x1;
        var dY = y2 - y1;
        var dashes = Math.floor(Math.sqrt( dX * dX + dY * dY ) / dashLen );
        var dashX = dX / dashes;
        var dashY = dY / dashes;

        var q = 0;
        while( q++ < dashes ){
            x1 += dashX;
            y1 += dashY;
            this[q % 2 === 0 ? 'moveTo' : 'lineTo'](x1, y1);
        }
        this[q % 2 === 0 ? 'moveTo' : 'lineTo'](x2, y2);
        return this;
    };

    createjs.Graphics.prototype.drawDashedRect = function( x1 , y1 , w , h , dashLen ){
        this.moveTo(x1, y1);
        var x2 = x1 + w;
        var y2 = y1 + h;
        this.dashedLineTo( x1 , y1 , x2 , y1 , dashLen );
        this.dashedLineTo( x2 , y1 , x2 , y2 , dashLen );
        this.dashedLineTo( x2 , y2 , x1 , y2 , dashLen );
        this.dashedLineTo( x1 , y2 , x1 , y1 , dashLen );
        return this;
    };

    createjs.Graphics.prototype.drawResizableDashedRect = function( x1 , y1 , w , h , dashLen , offset ){
        this.moveTo(x1, y1);
        var x2 = x1 + w;
        var y2 = y1 + h;
        this.dashedLineTo(x1 + offset, y1, x2 - offset, y1, dashLen);
        this.dashedLineTo(x2, y1 + offset, x2, y2 - offset, dashLen);
        this.dashedLineTo(x2 - offset, y2, x1 + offset, y2, dashLen);
        this.dashedLineTo(x1, y2 - offset, x1, y1 + offset, dashLen);
        return this;
    };
};

Entry.Painter.prototype.generateView = function(painterView) {
    var painter = this;
    this.view_ = painterView;

    if (!Entry.type || Entry.type == 'workspace') {
        this.view_.addClass('entryPainterWorkspace');
        //- 레이아웃 시작
        var painterTop = Entry.createElement('div', 'entryPainterTop');
        painterTop.addClass('entryPlaygroundPainterTop');
        this.view_.appendChild(painterTop);
        var painterToolbox = Entry.createElement('div', 'entryPainterToolbox');
        painterToolbox.addClass('entryPlaygroundPainterToolbox');
        this.view_.appendChild(painterToolbox);
        var painterToolboxTop = Entry.createElement('div','entryPainterToolboxTop');
        painterToolboxTop.addClass('entryPainterToolboxTop');
        painterToolbox.appendChild(painterToolboxTop);
        var painterContainer = Entry.createElement('div', 'entryPainterContainer');
        painterContainer.addClass('entryPlaygroundPainterContainer');
        this.view_.appendChild(painterContainer);
        var painterCanvas = Entry.createElement('canvas', 'entryPainterCanvas');
        painterCanvas.width = 960;
        painterCanvas.height = 540;
        painterCanvas.addClass('entryPlaygroundPainterCanvas');
        painterContainer.appendChild(painterCanvas);
        var painterCanvas_ = Entry.createElement('canvas', 'entryPainterCanvas_');
        painterCanvas_.addClass('entryRemove');
        painterCanvas_.width = 960;
        painterCanvas_.height = 540;
        painterContainer.appendChild(painterCanvas_);
        var painterAttr = Entry.createElement('div', 'entryPainterAttr');
        painterAttr.addClass('entryPlaygroundPainterAttr');
        this.view_.appendChild(painterAttr);

        this.flipObject = Entry.createElement('div','entryPictureFlip');
        this.flipObject.addClass('entryPlaygroundPainterFlip');
        painterAttr.appendChild(this.flipObject);

        var flipx = Entry.createElement('div','entryPictureFlipX');
        flipx.title = "좌우뒤집기";
        flipx.bindOnClick(function() {
            if (painter.selectedObject) {
                painter.selectedObject.scaleX *= -1;
                if (painter.selectedObject.text) {
                    painter.selectTextObject(painter.selectedObject);
                } else {
                    painter.selectObject(painter.selectedObject);
                }
                painter.updateImageHandle();
                painter.stage.update();
            }
        });
        flipx.addClass('entryPlaygroundPainterFlipX');
        this.flipObject.appendChild(flipx);

        var flipy = Entry.createElement('div','entryPictureFlipY');
        flipy.title = "상하뒤집기";
        flipy.bindOnClick(function() {
            if (painter.selectedObject) {
                painter.selectedObject.scaleY *= -1;
                if (painter.selectedObject.text) {
                    painter.selectTextObject(painter.selectedObject);
                } else {
                    painter.selectObject(painter.selectedObject);
                }
                painter.updateImageHandle();
                painter.stage.update();
            }
        });
        flipy.addClass('entryPlaygroundPainterFlipY');
        this.flipObject.appendChild(flipy);


        // 윈도우 리사이즈
        Entry.addEventListener('windowResized', function(e) {

            var ow = 960;
            var oh = 540;

            var iw = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

            var ih = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

            var ecw = parseInt(document.getElementById('entryCanvas').style.width);

            var w = iw - (ecw+240);
            var h = ih - (45+40+44+28+192);
            painterView.style.width = w + 'px';
            painterContainer.style.width = (w - 54) + 'px';
            painterContainer.style.height = h + 'px';
            painterAttr.style.top = (h+30) + 'px';
            painterAttr.style.height = (ih-h) + 'px';

        });
        //- 레이아웃 끝

        //- 메뉴 시작
        var painterTopMenu = Entry.createElement('nav', 'entryPainterTopMenu');
        painterTopMenu.addClass('entryPlaygroundPainterTopMenu');
        painterTop.appendChild(painterTopMenu);

        var painterTopMenuContainer = Entry.createElement('ul');
        painterTopMenu.appendChild(painterTopMenuContainer);

        var painterTopMenuFileNew = Entry.createElement('li');
        painterTopMenu.appendChild(painterTopMenuFileNew);

        var painterTopMenuFileNewLink = Entry.createElement('a',
                                                    'entryPainterTopMenuFileNew');
        painterTopMenuFileNewLink.bindOnClick(function() {
            painter.newPicture();
        });
        painterTopMenuFileNewLink.addClass('entryPlaygroundPainterTopMenuFileNew');
        painterTopMenuFileNewLink.innerHTML = Lang.Workspace.new_picture;
        painterTopMenuFileNew.appendChild(painterTopMenuFileNewLink);

        var painterTopMenuFile = Entry.createElement('li', 'entryPainterTopMenuFile');
        painterTopMenuFile.addClass('entryPlaygroundPainterTopMenuFile');
        painterTopMenuFile.innerHTML = Lang.Workspace.painter_file;
        painterTopMenuContainer.appendChild(painterTopMenuFile);

        var painterTopMenuFileContainer = Entry.createElement('ul');
        painterTopMenuFile.appendChild(painterTopMenuFileContainer);

        var painterTopMenuFileSave = Entry.createElement('li');
        painterTopMenuFileContainer.appendChild(painterTopMenuFileSave);
        var painterTopMenuFileSaveLink = Entry.createElement('a',
                                                    'entryPainterTopMenuFileSave');
        painterTopMenuFileSaveLink.bindOnClick(function() {
            painter.file_save(false);
        });
        painterTopMenuFileSaveLink.addClass('entryPainterTopMenuFileSave');
        painterTopMenuFileSaveLink.innerHTML = Lang.Workspace.painter_file_save;
        painterTopMenuFileSave.appendChild(painterTopMenuFileSaveLink);

        var painterTopMenuFileSaveAs = Entry.createElement('li');
        painterTopMenuFileContainer.appendChild(painterTopMenuFileSaveAs);

        var painterTopMenuFileSaveAsLink = Entry.createElement('a',
                                                    'entryPainterTopMenuFileSaveAs');
        painterTopMenuFileSaveAsLink.bindOnClick(function() {
            painter.file.mode = "new";
            painter.file_save(false);
        });
        painterTopMenuFileSaveAsLink.addClass('entryPlaygroundPainterTopMenuFileSaveAs');
        painterTopMenuFileSaveAsLink.innerHTML = Lang.Workspace.painter_file_saveas;
        painterTopMenuFileSaveAs.appendChild(painterTopMenuFileSaveAsLink);


        var painterTopMenuEdit = Entry.createElement('li', 'entryPainterTopMenuEdit');
        painterTopMenuEdit.addClass('entryPlaygroundPainterTopMenuEdit');
        painterTopMenuEdit.innerHTML = Lang.Workspace.painter_edit;
        painterTopMenuContainer.appendChild(painterTopMenuEdit);

        var painterTopMenuEditContainer = Entry.createElement('ul');
        painterTopMenuEdit.appendChild(painterTopMenuEditContainer);

        var painterTopMenuEditImport = Entry.createElement('li');
        painterTopMenuEditContainer.appendChild(painterTopMenuEditImport);
        var painterTopMenuEditImportLink = Entry.createElement('a',
                                                    'entryPainterTopMenuEditImportLink');
        painterTopMenuEditImportLink.bindOnClick(function() {
            Entry.dispatchEvent('openPictureImport');
        });
        painterTopMenuEditImportLink.addClass('entryPainterTopMenuEditImport');
        painterTopMenuEditImportLink.innerHTML = Lang.Workspace.get_file;
        painterTopMenuEditImport.appendChild(painterTopMenuEditImportLink);

        var painterTopMenuEditCopy = Entry.createElement('li');
        painterTopMenuEditContainer.appendChild(painterTopMenuEditCopy);

        var painterTopMenuEditCopyLink = Entry.createElement('a',
                                                    'entryPainterTopMenuEditCopy');
        painterTopMenuEditCopyLink.bindOnClick(function() {
            painter.edit_copy();
        });
        painterTopMenuEditCopyLink.addClass('entryPlaygroundPainterTopMenuEditCopy');
        painterTopMenuEditCopyLink.innerHTML = Lang.Workspace.copy_file;
        painterTopMenuEditCopy.appendChild(painterTopMenuEditCopyLink);

        var painterTopMenuEditCut = Entry.createElement('li');
        painterTopMenuEditContainer.appendChild(painterTopMenuEditCut);

        var painterTopMenuEditCutLink = Entry.createElement('a',
                                                    'entryPainterTopMenuEditCut');
        painterTopMenuEditCutLink.bindOnClick(function() {
            painter.edit_cut();
        });
        painterTopMenuEditCutLink.addClass('entryPlaygroundPainterTopMenuEditCut');
        painterTopMenuEditCutLink.innerHTML = Lang.Workspace.cut_picture;
        painterTopMenuEditCut.appendChild(painterTopMenuEditCutLink);

        var painterTopMenuEditPaste = Entry.createElement('li');
        painterTopMenuEditContainer.appendChild(painterTopMenuEditPaste);

        var painterTopMenuEditPasteLink = Entry.createElement('a',
                                                    'entryPainterTopMenuEditPaste');
        painterTopMenuEditPasteLink.bindOnClick(function() {
            painter.edit_paste();
        });
        painterTopMenuEditPasteLink.addClass('entryPlaygroundPainterTopMenuEditPaste');
        painterTopMenuEditPasteLink.innerHTML = Lang.Workspace.paste_picture;
        painterTopMenuEditPaste.appendChild(painterTopMenuEditPasteLink);

        var painterTopMenuEditEraseAll = Entry.createElement('li');
        painterTopMenuEditContainer.appendChild(painterTopMenuEditEraseAll);

        var painterTopMenuEditEraseAllLink = Entry.createElement('a',
                                                    'entryPainterTopMenuEditEraseAll');
        painterTopMenuEditEraseAllLink.addClass('entryPlaygroundPainterTopMenuEditEraseAll');
        painterTopMenuEditEraseAllLink.innerHTML = Lang.Workspace.remove_all;
        painterTopMenuEditEraseAllLink.bindOnClick(function() {
            painter.clearCanvas();
        });

        painterTopMenuEditEraseAll.appendChild(painterTopMenuEditEraseAllLink);
        //- 메뉴 끝

        //- 좌표표시 시작
        var painterTopStageXY = Entry.createElement('div', 'entryPainterTopStageXY');
        this.painterTopStageXY = painterTopStageXY;
        painterTopStageXY.addClass('entryPlaygroundPainterTopStageXY');
        painterTop.appendChild(painterTopStageXY);
        //- 좌표표시 끝

        //- 탑버튼 시작
        var painterTopToolbar = Entry.createElement('ul', 'entryPainterTopToolbar');
        painterTopToolbar.addClass('entryPlaygroundPainterTopToolbar');
        painterTop.appendChild(painterTopToolbar);

        var painterTopToolbarUndo = Entry.createElement('li', 'entryPainterTopToolbarUndo');
        painterTopToolbarUndo.bindOnClick(function() {
        });

        painterTopToolbarUndo.addClass('entryPlaygroundPainterTopToolbar');
        painterTopToolbar.appendChild(painterTopToolbarUndo);

        var painterTopToolbarRedo = Entry.createElement('li', 'entryPainterTopToolbarRedo');
        painterTopToolbarRedo.bindOnClick(function() {
        });
        painterTopToolbarRedo.addClass('entryPlaygroundPainterTopToolbar');
        painterTopToolbar.appendChild(painterTopToolbarRedo);
        //- 탑버튼 끝

        //- 툴박스 시작
        var painterToolboxContainer = Entry.createElement('ul');
        painterToolboxContainer.addClass('entryPlaygroundPainterToolboxContainer');
        painterToolbox.appendChild(painterToolboxContainer);

        this.toolboxCursor = Entry.createElement('li', 'entryPainterToolboxCursor');
        this.toolboxCursor.title = "이동";
        this.toolboxCursor.bindOnClick(function() {
            painter.selectToolbox('cursor');
        });
        this.toolboxCursor.addClass('entryPlaygroundPainterToolboxCursor');
        painterToolboxContainer.appendChild(this.toolboxCursor);

        this.toolboxSelect = Entry.createElement('li', 'entryPainterToolboxSelect');
        this.toolboxSelect.title = "자르기";
        this.toolboxSelect.bindOnClick(function() {
            painter.selectToolbox('select');
        });
        this.toolboxSelect.addClass('entryPlaygroundPainterToolboxSelect');
        painterToolboxContainer.appendChild(this.toolboxSelect);

        this.toolboxPen = Entry.createElement('li', 'entryPainterToolboxPen');
        this.toolboxPen.title = "펜";
        this.toolboxPen.bindOnClick(function() {
            painter.selectToolbox('pen');
        });
        this.toolboxPen.addClass('entryPlaygroundPainterToolboxPen');
        painterToolboxContainer.appendChild(this.toolboxPen);

        this.toolboxLine = Entry.createElement('li', 'entryPainterToolboxLine');
        this.toolboxLine.title = "직선";
        this.toolboxLine.bindOnClick(function() {
            painter.selectToolbox('line');
        });
        this.toolboxLine.addClass('entryPlaygroundPainterToolboxLine');
        painterToolboxContainer.appendChild(this.toolboxLine);

        this.toolboxRect = Entry.createElement('li', 'entryPainterToolboxRect');
        this.toolboxRect.title = "사각형";
        this.toolboxRect.bindOnClick(function() {
            painter.selectToolbox('rect');
        });
        this.toolboxRect.addClass('entryPlaygroundPainterToolboxRect');
        painterToolboxContainer.appendChild(this.toolboxRect);

        this.toolboxCircle = Entry.createElement('li', 'entryPainterToolboxCircle');
        this.toolboxCircle.title = "원";
        this.toolboxCircle.bindOnClick(function() {
            painter.selectToolbox('circle');
        });
        this.toolboxCircle.addClass('entryPlaygroundPainterToolboxCircle');
        painterToolboxContainer.appendChild(this.toolboxCircle);

        this.toolboxText = Entry.createElement('li', 'entryPainterToolboxText');
        this.toolboxText.title = "글상자";
        this.toolboxText.bindOnClick(function() {
            painter.selectToolbox('text');
        });
        this.toolboxText.addClass('entryPlaygroundPainterToolboxText');
        painterToolboxContainer.appendChild(this.toolboxText);

        this.toolboxFill = Entry.createElement('li', 'entryPainterToolboxFill');
        this.toolboxFill.bindOnClick(function() {
            painter.selectToolbox('fill');
        });

        this.toolboxFill.addClass('entryPlaygroundPainterToolboxFill');
        painterToolboxContainer.appendChild(this.toolboxFill);

        this.toolboxErase = Entry.createElement('li', 'entryPainterToolboxErase');
        this.toolboxErase.title = "지우기";
        this.toolboxErase.bindOnClick(function() {
            painter.selectToolbox('erase');
        });
        this.toolboxErase.addClass('entryPlaygroundPainterToolboxErase');
        painterToolboxContainer.appendChild(this.toolboxErase);

        var painterToolboxCoordinate = Entry.createElement('li', 'entryPainterToolboxCoordinate');
        painterToolboxCoordinate.title = "좌표";
        painterToolboxCoordinate.bindOnClick(function() {
            painter.toggleCoordinator();
        });
        painterToolboxCoordinate.addClass('entryPlaygroundPainterToolboxCoordinate');
        painterToolboxContainer.appendChild(painterToolboxCoordinate);


        //- 툴박스 끝

        //- 속성창 시작
        this.attrResizeArea = Entry.createElement('fieldset', 'painterAttrResize');
        this.attrResizeArea.addClass('entryPlaygroundPainterAttrResize');
        painterAttr.appendChild(this.attrResizeArea);

        var painterAttrResizeTitle = Entry.createElement('legend');
        painterAttrResizeTitle.innerHTML = Lang.Workspace.picture_size;
        this.attrResizeArea.appendChild(painterAttrResizeTitle);
//속성x
        var entryPlaygroundPainterAttrResizeX = Entry.createElement('div');
        entryPlaygroundPainterAttrResizeX.addClass('entryPlaygroundPainterAttrResizeX');
        this.attrResizeArea.appendChild(entryPlaygroundPainterAttrResizeX);


        var entryPlaygroundPainterAttrResizeXTop = Entry.createElement('div');
        entryPlaygroundPainterAttrResizeXTop.addClass('entryPlaygroundPainterAttrResizeXTop');
        entryPlaygroundPainterAttrResizeXTop.innerHTML = "X";
        entryPlaygroundPainterAttrResizeX.appendChild(entryPlaygroundPainterAttrResizeXTop);


        this.objectWidthInput = Entry.createElement('input', 'entryPainterAttrWidth');
        this.objectWidthInput.onblur = function() {
            if (isNaN(this.value)) {
                alert('숫자만 입력 가능합니다.');
                return false;
            }

            painter.handle.width = this.value;
            painter.updateImageHandle();
        };
        this.objectWidthInput.addClass('entryPlaygroundPainterNumberInput');
        entryPlaygroundPainterAttrResizeX.appendChild(this.objectWidthInput);


        var entryPlaygroundPainterSizeText = Entry.createElement('div');
        entryPlaygroundPainterSizeText.addClass('entryPlaygroundPainterSizeText');
        entryPlaygroundPainterSizeText.innerHTML = "x";
        this.attrResizeArea.appendChild(entryPlaygroundPainterSizeText);
//속성 y

        var entryPlaygroundPainterAttrResizeY = Entry.createElement('div');
        entryPlaygroundPainterAttrResizeY.addClass('entryPlaygroundAttrReiszeY');
        this.attrResizeArea.appendChild(entryPlaygroundPainterAttrResizeY);

        var entryPlaygroundPainterAttrResizeYTop = Entry.createElement('div');
        entryPlaygroundPainterAttrResizeYTop.addClass('entryPlaygroundPainterAttrResizeYTop');
        entryPlaygroundPainterAttrResizeYTop.innerHTML = 'Y';
        entryPlaygroundPainterAttrResizeY.appendChild(entryPlaygroundPainterAttrResizeYTop);


        this.objectHeightInput = Entry.createElement('input', 'entryPainterAttrHeight');
        this.objectHeightInput.onblur = function() {
            if (isNaN(this.value)) {
                alert('숫자만 입력 가능합니다.');
                return false;
            }
            painter.handle.height = this.value;
            painter.updateImageHandle();
        };
        this.objectHeightInput.addClass('entryPlaygroundPainterNumberInput');
        entryPlaygroundPainterAttrResizeY.appendChild(this.objectHeightInput);

//속성 y
        this.attrRotateArea = Entry.createElement('div', 'painterAttrRotateArea');
        this.attrRotateArea.addClass('painterAttrRotateArea');
        painterAttr.appendChild(this.attrRotateArea);

        var painterAttrRotate = Entry.createElement('fieldset', 'entryPainterAttrRotate');
        painterAttrRotate.addClass('entryPlaygroundPainterAttrRotate');
        this.attrRotateArea.appendChild(painterAttrRotate);

        var painterAttrRotateName = Entry.createElement('div');
        painterAttrRotateName.addClass("painterAttrRotateName");
        painterAttrRotateName.innerHTML = Lang.Workspace.picture_rotation;
        this.attrRotateArea.appendChild(painterAttrRotateName);

        var painterAttrRotateTop = Entry.createElement('div');
        painterAttrRotateTop.addClass('painterAttrRotateTop');
        painterAttrRotateTop.innerHTML = "ο";
        painterAttrRotate.appendChild(painterAttrRotateTop);

        this.objectRotateInput = Entry.createElement('input', 'entryPainterAttrDegree');
        this.objectRotateInput.onblur = function() {
            if (isNaN(this.value)) {
                alert('숫자만 입력 가능합니다.');
                return false;
            }

            if(this.value >= 360){
                this.value = this.value % 360;
            }else if(this.value < 0){
                this.value = 360 + (this.value % 360);
            }
            painter.handle.rotation = this.value;
            painter.updateImageHandle();
        };
        this.objectRotateInput.addClass('entryPlaygroundPainterNumberInput');
        this.objectRotateInput.defaultValue = "0";
        painterAttrRotate.appendChild(this.objectRotateInput);

        this.attrColorArea = Entry.createElement('fieldset', 'entryPainterAttrColor');
        this.attrColorArea.addClass('entryPlaygroundPainterAttrColor');
        painterAttr.appendChild(this.attrColorArea);

        var painterAttrColorContainer = Entry.createElement('div');
        painterAttrColorContainer.addClass('entryPlaygroundPainterAttrColorContainer');
        this.attrColorArea.appendChild(painterAttrColorContainer);

        this.attrCircleArea = Entry.createElement('div');
        this.attrCircleArea.addClass('painterAttrCircleArea');
        painterAttr.appendChild(this.attrCircleArea);

        var painterAttrCircle = Entry.createElement('div', 'entryPainterAttrCircle');
        painterAttrCircle.addClass('painterAttrCircle');
        this.attrCircleArea.appendChild(painterAttrCircle);

        // var painterInnerCircle = Entry.createElement('div');
        // painterInnerCircle.addClass('painterInnerCircle');
        // painterAttrCircle.appendChild(painterInnerCircle);

        this.attrCircleArea.painterAttrCircle = painterAttrCircle;
        // painterAttrCircle.painterInnerCircle = painterInnerCircle;

        var painterAttrCircleInput = Entry.createElement('input', 'entryPainterAttrCircleInput');
        painterAttrCircleInput.value = '#000000';
        painterAttrCircleInput.addClass('painterAttrCircleInput');
        this.attrCircleArea.appendChild(painterAttrCircleInput);

        this.attrColorSpoid = Entry.createElement('div');
        this.attrColorSpoid.bindOnClick(function() {
            painter.selectToolbox('spoid');
        });
        this.attrColorSpoid.addClass('painterAttrColorSpoid');
        painterAttr.appendChild(this.attrColorSpoid);

        var painterColors = Entry.getColourCodes();
        painterColors.forEach(function(color) {
            var element = Entry.createElement('div');
            element.addClass('entryPlaygroundPainterAttrColorElement');
            if (color === 'transparent') {
                var transparentImage = Entry.mediaFilePath + '/transparent.png';
                element.style.backgroundImage = "url("+transparentImage+")";
            } else {
                element.style.backgroundColor = color;
            }
            element.bindOnClick(function(event) {
                if (color === 'transparent') {
                    painter.stroke.transparent = true;
                    painter.stroke.lineColor= '#ffffff';
                } else {
                    painter.stroke.transparent = false;
                    if(backgroundClick){
                        document.getElementById("entryPainterShapeBackgroundColor").style.backgroundColor = color;
                        painter.stroke.fillColor = color;
                    }if(!backgroundClick){
                        document.getElementById("entryPainterShapeLineColor").style.backgroundColor = color;
                        painter.stroke.lineColor = color;
                    }
                }
                document.getElementById('entryPainterAttrCircle').style.backgroundColor = painter.stroke.lineColor;
                document.getElementById('entryPainterAttrCircleInput').value = color;
            });
            painterAttrColorContainer.appendChild(element);
        });
        this.attrThickArea = Entry.createElement('div','painterAttrThickArea');
        this.attrThickArea.addClass('entryPlaygroundentryPlaygroundPainterAttrThickArea');
        painterAttr.appendChild(this.attrThickArea);

        var painterAttrThickName = Entry.createElement('legend');
        painterAttrThickName.addClass('painterAttrThickName');
        painterAttrThickName.innerHTML = Lang.Workspace.thickness;
        this.attrThickArea.appendChild(painterAttrThickName);

        var painterAttrThick = Entry.createElement('fieldset', 'entryPainterAttrThick');
        painterAttrThick.addClass('entryPlaygroundPainterAttrThick');
        this.attrThickArea.appendChild(painterAttrThick);

        var painterAttrThickTop = Entry.createElement('div');
        painterAttrThickTop.addClass('paintAttrThickTop');
        painterAttrThick.appendChild(painterAttrThickTop);

        var painterAttrThickInput = Entry.createElement('select', 'entryPainterAttrThick');
        painterAttrThickInput.addClass('entryPlaygroundPainterAttrThickInput');
        painterAttrThickInput.size = '1';
        painterAttrThickInput.onchange = function(evt) {
            painter.stroke.thickness = evt.target.value;
        };

        for (var i=1; i<=10; i++) {
            var element = Entry.createElement('option');
            element.value = i;
            element.innerHTML = i;
            painterAttrThickInput.appendChild(element);
        }
        painterAttrThick.appendChild(painterAttrThickInput);
        var painterAttrShapeLineColor = Entry.createElement('div', 'entryPainterShapeLineColor');
        painterAttrShapeLineColor.addClass('painterAttrShapeLineColor');

        var painterAttrShapeBackgroundInnerColor = Entry.createElement('div','entryPainterShapeInnerBackground');
        painterAttrShapeBackgroundInnerColor.addClass('painterAttrShapeInnerBackground');

        painterAttrShapeLineColor.appendChild(painterAttrShapeBackgroundInnerColor);
        painterAttrThick.appendChild(painterAttrShapeLineColor);

        this.attrThickArea.painterAttrShapeLineColor = painterAttrShapeLineColor;

        painterAttrThick.bindOnClick(function(){
            painterAttrShapeBackgroundColor.style.zIndex='1';
            this.style.zIndex = '10';
            backgroundClick = false;
        });

        this.attrBackgroundArea = Entry.createElement('div','painterAttrBackgroundArea');
        this.attrBackgroundArea.addClass('entryPlaygroundPainterBackgroundArea');
        painterAttr.appendChild(this.attrBackgroundArea);

        var painterAttrBackground = Entry.createElement('fieldset', 'entryPainterAttrbackground');
        painterAttrBackground.addClass('entryPlaygroundPainterAttrBackground');
        this.attrBackgroundArea.appendChild(painterAttrBackground);

        var painterAttrBackgroundTop = Entry.createElement('div');
        painterAttrBackgroundTop.addClass('paintAttrBackgroundTop');
        painterAttrBackground.appendChild(painterAttrBackgroundTop);


        var painterAttrShapeBackgroundColor = Entry.createElement('div', 'entryPainterShapeBackgroundColor');
        painterAttrShapeBackgroundColor.addClass('painterAttrShapeBackgroundColor');

        this.attrBackgroundArea.painterAttrShapeBackgroundColor = painterAttrShapeBackgroundColor;

        painterAttrBackgroundTop.appendChild(painterAttrShapeBackgroundColor);

        var backgroundClick = false;
        painterAttrShapeBackgroundColor.bindOnClick(function(evt) {
            painterAttrThick.style.zIndex='1';
            this.style.zIndex = '10';
            backgroundClick = true;
        });

        this.attrFontArea = Entry.createElement('div', 'painterAttrFont');
        this.attrFontArea.addClass('entryPlaygroundPainterAttrFont');
        painterAttr.appendChild(this.attrFontArea);

        var paintAttrFontTop = Entry.createElement('div');
        paintAttrFontTop.addClass('entryPlaygroundPainterAttrTop');
        this.attrFontArea.appendChild(paintAttrFontTop);

        var paintAttrFontTop_ = Entry.createElement('div');
        paintAttrFontTop_.addClass('entryPlaygroundPaintAttrTop_');
        paintAttrFontTop.appendChild(paintAttrFontTop_);

        var painterAttrFontTitle = Entry.createElement('legend');
        painterAttrFontTitle.addClass("panterAttrFontTitle");
        painterAttrFontTitle.innerHTML = Lang.Workspace.textStyle;

        var painterAttrFontName = Entry.createElement('select', 'entryPainterAttrFontName');
        painterAttrFontName.addClass('entryPlaygroundPainterAttrFontName');
        painterAttrFontName.size = '1';
        painterAttrFontName.onchange = function(evt) {
            painter.font.name = evt.target.value;
        };
        for (var i=0; i<Entry.fonts.length; i++) {
            var font = Entry.fonts[i];
            var element = Entry.createElement('option');
            element.value = font.family;
            element.innerHTML = font.name;
            painterAttrFontName.appendChild(element);
        }
        paintAttrFontTop.appendChild(painterAttrFontName);

        var painterAttrFontSizeArea = Entry.createElement('div');
        painterAttrFontSizeArea.addClass('painterAttrFontSizeArea');
        this.attrFontArea.appendChild(painterAttrFontSizeArea);

        var painterAttrFontSizeTop = Entry.createElement('div');
        painterAttrFontSizeTop.addClass('painterAttrFontSizeTop');
        painterAttrFontSizeArea.appendChild(painterAttrFontSizeTop);

        var painterAttrFontSize = Entry.createElement('select', 'entryPainterAttrFontSize');
        painterAttrFontSize.addClass('entryPlaygroundPainterAttrFontSize');
        painterAttrFontSize.size = '1';
        painterAttrFontSize.onchange = function(evt) {
            painter.font.size = evt.target.value;
        };

        for (var i=20; i<=72; i++) {
            var element = Entry.createElement('option');
            element.value = i;
            element.innerHTML = i;
            painterAttrFontSize.appendChild(element);
        }
        painterAttrFontSizeArea.appendChild(painterAttrFontSize);

        var paintAttrFontStyleArea = Entry.createElement('div');
        paintAttrFontStyleArea.addClass('entryPlaygroundPainterAttrFontStyleArea');
        this.attrFontArea.appendChild(paintAttrFontStyleArea);

        var painterAttrFontStyleTop = Entry.createElement('div');
        painterAttrFontStyleTop.addClass('entryPlaygroundPainterAttrFontTop');
        paintAttrFontStyleArea.appendChild(painterAttrFontStyleTop);

        var painterAttrFontStyle = Entry.createElement('select', 'entryPainterAttrFontStyle');
        painterAttrFontStyle.addClass('entryPlaygroundPainterAttrFontStyle');
        painterAttrFontStyle.size = '1';
        painterAttrFontStyle.onchange = function(evt) {
            painter.font.style = evt.target.value;
        };

        var fontStyles = [
            {
                label: '보통',
                value: 'normal'
            },
            {
                label: '굵게',
                value: 'bold'
            },
            {
                label: '기울임',
                value: 'italic'
            }
        ];

        for (var i=0; i<fontStyles.length; i++) {
            var style = fontStyles[i];
            var element = Entry.createElement('option');
            element.value = style.value;
            element.innerHTML = style.label;
            painterAttrFontStyle.appendChild(element);
        }
        paintAttrFontStyleArea.appendChild(painterAttrFontStyle);

        this.attrLineArea = Entry.createElement('div', 'painterAttrLineStyle');
        this.attrLineArea.addClass('entryPlaygroundPainterAttrLineStyle');
        painterAttr.appendChild(this.attrLineArea);

        var painterAttrLineStyleLine = Entry.createElement('div');
        painterAttrLineStyleLine.addClass('entryPlaygroundPainterAttrLineStyleLine');
        this.attrLineArea.appendChild(painterAttrLineStyleLine);

        var painterAttrLineArea = Entry.createElement('div');
        painterAttrLineArea.addClass('entryPlaygroundPaitnerAttrLineArea');
        this.attrLineArea.appendChild(painterAttrLineArea);

        var painterAttrLineStyleLine1 = Entry.createElement('div');
        painterAttrLineStyleLine1.addClass('entryPlaygroundPainterAttrLineStyleLine1');
        painterAttrLineArea.appendChild(painterAttrLineStyleLine1);
        painterAttrLineStyleLine1.value = 'line';

        var painterAttrLineStyleBackgroundLine = Entry.createElement('div');
        painterAttrLineStyleBackgroundLine.addClass('painterAttrLineStyleBackgroundLine');

        painterAttrLineStyleLine.bindOnClick(function(evt){
            painterAttrLineArea.removeClass('entryRemove');
        });
        painterAttrLineArea.blur = function(evt){
            this.addClass('entryRemove');
        };
        painterAttrLineArea.onmouseleave = function(evt){
            this.addClass('entryRemove');
        };

        painterAttrLineStyleLine1.bindOnClick(function(evt){
            this.attrLineArea.removeClass(painterAttrLineStyleLine);
            this.attrLineArea.appendChild(painterAttrLineStyleBackgroundLine);
            this.attrLineArea.onchange(evt);
            painterAttrLineArea.blur();
        });
        painterAttrLineStyleBackgroundLine.bindOnClick(function(evt){
             painterAttrLineArea.removeClass('entryRemove');
        });
        this.attrLineArea.onchange = function(evt) {
            painter.stroke.style = evt.target.value;
        };


        painterAttrLineArea.blur();
        //- 속성창 끝

    }

};

Entry.Painter.prototype.restoreHandle = function() {
    if (this.selectedObject && this.handle.visible === false) {
        this.handle.visible = true;
        this.stage.update();
    }

};

Entry.Painter.prototype.initDisplay = function() {
    this.stroke.enabled = false;

    // Toolbox
    this.toolboxCursor.addClass("entryPlaygroundPainterToolboxCursor");
    this.toolboxCursor.removeClass('entryToolboxCursorClicked');
    this.toolboxSelect.addClass("entryPlaygroundPainterToolboxSelect");
    this.toolboxSelect.removeClass('entryToolboxSelectClicked');
    this.toolboxPen.addClass("entryPlaygroundPainterToolboxPen");
    this.toolboxPen.removeClass('entryToolboxPenClicked');
    this.toolboxLine.addClass("entryPlaygroundPainterToolboxLine");
    this.toolboxLine.removeClass('entryToolboxLineClicked');
    this.toolboxRect.addClass("entryPlaygroundPainterToolboxRect");
    this.toolboxRect.removeClass('entryToolboxRectClicked');
    this.toolboxCircle.addClass("entryPlaygroundPainterToolboxCircle");
    this.toolboxCircle.removeClass('entryToolBoxCircleClicked');
    this.toolboxText.addClass("entryPlaygroundPainterToolboxText");
    this.toolboxText.removeClass('entryToolBoxTextClicked');
    this.toolboxFill.addClass("entryPlaygroundPainterToolboxFill");
    this.toolboxFill.removeClass('entryToolBoxFillClicked');
    this.toolboxErase.addClass("entryPlaygroundPainterToolboxErase");
    this.toolboxErase.removeClass('entryToolBoxEraseClicked');
    this.attrColorSpoid.addClass("painterAttrColorSpoid");
    this.attrColorSpoid.removeClass('painterAttrColorSpoidClicked');

    // Attributes
    this.attrResizeArea.addClass("entryRemove");
    this.attrRotateArea.addClass("entryRemove");
    this.attrThickArea.addClass("entryRemove");
    // this.attrButtonArea.addClass("entryRemove");
    this.attrFontArea.addClass("entryRemove");
    this.attrLineArea.addClass("entryRemove");
    this.attrColorArea.addClass("entryRemove");
    this.attrCircleArea.addClass("entryRemove");
    this.attrColorSpoid.addClass("entryRemove");
    this.attrFontArea.addClass("entryRemove");
    this.attrBackgroundArea.addClass("entryRemove");
    this.flipObject.addClass('entryRemove');
    this.attrThickArea.painterAttrShapeLineColor.addClass('entryRemove');
    this.attrBackgroundArea.painterAttrShapeBackgroundColor.addClass('entryRemove');
    this.attrCircleArea.painterAttrCircle.addClass('entryRemove');
    // this.attrCircleArea.painterAttrCircle.painterInnerCircle.addClass('entryRemove');

    if (this.inputField && !this.inputField._isHidden) {
        this.inputField.hide();
        this.stage.update();
    }

};

Entry.Painter.prototype.selectToolbox = function(name){
    this.toolbox.selected = name;
    if(name != 'erase'){
        $('.entryPlaygroundPainterContainer').removeClass('dd');
    }
    this.initDisplay();
    if (name !== 'cursor')
        this.clearHandle();

    if (name !== 'text' && this.inputField)
        delete this.inputField;

    switch (name){
        case 'cursor':
            this.restoreHandle();
            this.toolboxCursor.addClass('entryToolboxCursorClicked');
            this.attrResizeArea.removeClass("entryRemove");
            this.attrRotateArea.removeClass("entryRemove");
            this.flipObject.removeClass('entryRemove');
            break;
        case 'select':
            this.toolboxSelect.addClass('entryToolboxSelectClicked');
            break;
        case 'pen':
            this.toolboxPen.addClass('entryToolboxPenClicked');
            this.attrThickArea.removeClass("entryRemove");
            this.attrColorArea.removeClass("entryRemove");
            this.attrCircleArea.removeClass("entryRemove");
            this.attrColorSpoid.removeClass("entryRemove");
            this.attrThickArea.painterAttrShapeLineColor.removeClass('entryRemove');
            break;
        case 'line':
            this.toolboxLine.addClass('entryToolboxLineClicked');
            this.attrThickArea.removeClass("entryRemove");
            this.attrColorArea.removeClass("entryRemove");
            this.attrCircleArea.removeClass("entryRemove");
            this.attrColorSpoid.removeClass("entryRemove");
            this.attrThickArea.painterAttrShapeLineColor.removeClass('entryRemove');
            break;
        case 'rect':
            this.toolboxRect.addClass('entryToolboxRectClicked');
            this.attrThickArea.removeClass("entryRemove");
            this.attrColorArea.removeClass("entryRemove");
            this.attrCircleArea.removeClass("entryRemove");
            this.attrColorSpoid.removeClass("entryRemove");
            this.attrBackgroundArea.removeClass("entryRemove");
            this.attrThickArea.painterAttrShapeLineColor.removeClass('entryRemove');
            this.attrBackgroundArea.painterAttrShapeBackgroundColor.removeClass("entryRemove");
            break;
        case 'circle':
            this.toolboxCircle.addClass('entryToolBoxCircleClicked');
            this.attrThickArea.removeClass("entryRemove");
            this.attrColorArea.removeClass("entryRemove");
            this.attrCircleArea.removeClass("entryRemove");
            this.attrColorSpoid.removeClass("entryRemove");
            this.attrThickArea.painterAttrShapeLineColor.removeClass('entryRemove');
            this.attrBackgroundArea.removeClass("entryRemove");
            this.attrBackgroundArea.painterAttrShapeBackgroundColor.removeClass("entryRemove");
            break;
        case 'text':
            this.toolboxText.addClass('entryToolBoxTextClicked');
            this.attrFontArea.removeClass("entryRemove");
            this.attrColorArea.removeClass("entryRemove");
            this.attrCircleArea.removeClass("entryRemove");
            this.attrColorSpoid.removeClass("entryRemove");
            this.attrCircleArea.painterAttrCircle.removeClass('entryRemove');
            // this.attrCircleArea.painterAttrCircle.painterInnerCircle.removeClass('entryRemove');

            break;
        case 'fill':
            this.toolboxFill.addClass('entryToolBoxFillClicked');
            this.attrColorArea.removeClass("entryRemove");
            this.attrCircleArea.removeClass("entryRemove");
            this.attrColorSpoid.removeClass("entryRemove");
            this.attrCircleArea.painterAttrCircle.removeClass("entryRemove");
            break;
        case 'erase':
            $('.entryPlaygroundPainterContainer').addClass('dd');
            this.toolboxErase.addClass('entryToolBoxEraseClicked');
            this.attrThickArea.removeClass("entryRemove");
            break;
        case 'spoid':
            this.attrColorArea.removeClass("entryRemove");
            this.attrCircleArea.removeClass("entryRemove");
            this.attrColorSpoid.removeClass("entryRemove");
            this.attrColorSpoid.removeClass('painterAttrColorSpoid');
            this.attrColorSpoid.addClass('painterAttrColorSpoidClicked');
            break;
        case 'coordinate':
            this.toggleCoordinator();
    }
};

