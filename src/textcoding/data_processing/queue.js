/*
 *
 */
'use strict';

Entry.Queue = function() {
    this.head = null;
    this.tail = null;
};

function Node(data) {
    this.data = data;
    this.next = null;
}

(function(p) {
    p.enqueue = function(data) {
        var newNode = new Node(data);

        if (this.head === null) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            this.tail.next = newNode;
            this.tail = newNode;
        }
    };

    p.dequeue = function() {
        var newNode;
        if (this.head !== null) {
            newNode = this.head.data;
            this.head = this.head.next;
        }
        return newNode;
    };

    p.clear = function() {
        while (this.dequeue()) {}
    };

    p.toString = function() {
        var curr = this.head;
        var items = [];
        while (curr) {
            items.push(curr.data);
            curr = curr.next;
        }

        return items.toString();
    };
})(Entry.Queue.prototype);
