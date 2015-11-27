/**
 * @fileoverview script object execute function user made
 */
'use strict';

/**
 * Construct script class
 * @constructor
 * @param {Entry.EntryObject} entity
 */
Entry.Script = function(entity) {
    this.entity = entity;
};

var p = Entry.Script.prototype;

/**
 * Inject xml to script
 * @param {xml script} xml
 * @param {Entry.Script} previousScript
 * @param {Entry.Script} parentScript
 */
p.init = function(xml, previousScript, parentScript) {
    Entry.assert(xml.tagName.toUpperCase() == 'BLOCK', xml.tagName);
    this.type = xml.getAttribute("type");
    this.id = Number(xml.getAttribute("id"));
    if (xml.getElementsByTagName('mutation').length &&
        xml.getElementsByTagName('mutation')[0].hasAttribute('hashid')) {
        this.hashId = xml.childNodes[0].getAttribute('hashid');
    }
    if (this.type.substr(0, 6).toUpperCase() == "REPEAT")
        this.isRepeat = true;
    if (previousScript instanceof Entry.Script) {
        this.previousScript = previousScript;
        if (previousScript.parentScript)
            this.parentScript = previousScript.parentScript;
    }
    if (parentScript instanceof Entry.Script)
        this.parentScript = parentScript;

    var childrens = xml.childNodes;
    for (var i = 0; i<childrens.length; i++) {
        var children = childrens[i];
        if (children.tagName.toUpperCase() == "NEXT") {
            this.nextScript = new Entry.Script(this.entity);
            if (this.register)
                this.nextScript.register = this.register;
            this.nextScript.init(childrens[i].childNodes[0], this);
        } else if (children.tagName.toUpperCase() == "VALUE") {
            if (!this.values)
                this.values = {};
            var value = new Entry.Script(this.entity);
            if (this.register)
                value.register = this.register;
            value.init(children.childNodes[0]);
            this.values[children.getAttribute("name")] = value;
        } else if (children.tagName.toUpperCase() == "FIELD") {
            if (!this.fields)
                this.fields = {};
            this.fields[children.getAttribute("name")] = children.textContent;
        } else if (children.tagName.toUpperCase() == "STATEMENT") {
            if (!this.statements)
                this.statements = {};
            var statement = new Entry.Script(this.entity);
            if (this.register)
                statement.register = this.register;
            statement.init(children.childNodes[0], null, this);
            statement.key = children.getAttribute("name");
            this.statements[children.getAttribute("name")] = statement;
        }
    }
};

p.clone = function(clonedEntity, type) {
    var clone = new Entry.Script(clonedEntity);
    clone.id = this.id;
    clone.type = this.type;
    clone.isRepeat = this.isRepeat;
    if (this.parentScript && !this.previousScript && type != 2) {
        clone.parentScript = this.parentScript.clone(clonedEntity);
        clone.parentScript.statements[this.key] = clone;
        var script = clone;
        while (script.nextScript) {
            script = script.nextScript;
            script.parentScript = clone.parentScript;
        }
    } else {

    }
    if (this.nextScript && type != 1) {
        clone.nextScript = this.nextScript.clone(clonedEntity, 0);
        clone.nextScript.previousScript = this;
    }
    if (this.previousScript && type !== 0) {
        clone.previousScript = this.previousScript.clone(clonedEntity, 1);
        clone.previousScript.previousScript = this;
    }
    if (this.fields) {
        clone.fields = {};
        for (var i in this.fields) {
            clone.fields[i] = this.fields[i];
        }
    }
    if (this.values) {
        clone.values = {};
        for (var i in this.values) {
            clone.values[i] = this.values[i].clone(clonedEntity);
        }
    }
    if (this.statements) {
        clone.statements = {};
        for (var i in this.statements) {
            clone.statements[i] = this.statements[i].clone(clonedEntity, 2);
            var script = clone.statements[i];
            script.parentScript = clone;
            while (script.nextScript) {
                script = script.nextScript;
                script.parentScript = clone;
            }
        }
    }
    return clone;
};

p.getStatement = function(statementName) {
    return this.statements[statementName];
};
p.compute = function() {

};

p.getValue = function(valueName) {
    return this.values[valueName].run();
};
p.getNumberValue = function(valueName) {
    return Number(this.values[valueName].run());
};
p.getStringValue = function(valueName) {
    return String(this.values[valueName].run());
};

p.getBooleanValue = function(valueName) {
    return this.values[valueName].run() ? true : false;
};

p.getField = function(fieldName) {
    return this.fields[fieldName];
};

p.getStringField = function(fieldName) {
    return String(this.fields[fieldName]);
};

p.getNumberField = function(fieldName) {
    return Number(this.fields[fieldName]);
};

p.callReturn = function() {
    if (this.nextScript) {
        return this.nextScript;
    }
    else if (this.parentScript)
        return this.parentScript;
    else
        return null;
};

p.run = function() {
    return Entry.block[this.type](this.entity, this);
};
