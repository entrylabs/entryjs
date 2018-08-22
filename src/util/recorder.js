'use strict';


Entry.Recorder = function() {
    this.initialized = false;
    this.mediaRecorder = null;
    this.recordedBlobs = [];
    this.sourceBuffer = null;
};

(function(p) {
    p.init = function(canvas) {
        function handleSourceOpen(event) {
            this.sourceBuffer = this.mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
        }

        if(this.initialized == false) {
            this.canvas = canvas;
            this.mediaSource = new MediaSource();
            this.mediaSource.addEventListener('sourceopen', handleSourceOpen, false);

            this.isRecording = false;
            this.initialized = true;

            this.stream = this.canvas.captureStream(); // frames per second
        }
    }

    p.toggleRecording = function() {
        if(this.isRecording) {
            this.stopRecording();
        } else {
            this.startRecording();
        }
    };

    p.stopRecording = function() {
        console.log('end Recording');
        this.mediaRecorder.stop();
        this.download();
    }

    p.startRecording = function() {
        console.log('start Recording');
        var recordedBlobs = this.recordedBlobs = [];

        try {
            this.mediaRecorder = new MediaRecorder(this.stream, {mimeType: 'video/webm'});
        } catch (e0) {
            console.log('Unable to create MediaRecorder with options Object: ', e0);
            try {
                this.mediaRecorder  = new MediaRecorder(this.stream, {mimeType: 'video/webm,codecs=vp9'});
            } catch (e1) {
                console.log('Unable to create MediaRecorder with options Object: ', e1);
                try {
                    this.mediaRecorder  = new MediaRecorder(this.stream, {mimeType: 'video/vp8'});// Chrome 47
                } catch (e2) {
                    alert('MediaRecorder is not supported by this browser.\n\n' +
                        'Try Firefox 29 or later, or Chrome 47 or later, ' +
                        'with Enable experimental Web Platform features enabled from chrome://flags.');
                    console.error('Exception while creating MediaRecorder:', e2);
                    return;
                }
            }
        }

        this.isRecording = true;

        this.mediaRecorder.onstop = function(event) {
            const superBuffer = new Blob(recordedBlobs, {type: 'video/webm'});
        };
        this.mediaRecorder.ondataavailable = function(event) {
            if (event.data && event.data.size > 0) {
                recordedBlobs.push(event.data);
            }
        };
        this.mediaRecorder.start(20); // collect 20ms of data
    }

    p.download = function() {
        const blob = new Blob(this.recordedBlobs, {type: 'video/webm'});
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'test.webm';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);
    }
})(Entry.Recorder.prototype);