Entry.moduleManager = new class {
    /**
     * 해당 url 을 동적으로 로드한다.
     * 해당 함수는 굉장히 위험하므로 추가적인 방어로직이 필요하다.
     * @param url 로드할 주소
     */
    loadScript(url) {
        if (!url) {
            return;
        }
        const scriptElement = document.createElement('script');

        scriptElement.onload = function() {
            // nothing to do yet
        };
        scriptElement.src = url;

        // noinspection JSCheckFunctionSignatures
        document.body.appendChild(scriptElement);
    }

    /**
     * 함수를 등록한다. 블록모듈 파일이 마지막에 호출해야하는 함수이다.
     * @param moduleObject 하드웨어 모듈. 여타 하드웨어 모듈 파일 참조
     */
    registerHardwareModule(moduleObject) {
        Entry.HARDWARE_LIST[moduleObject.id] = moduleObject;
        Entry.reloadBlock();
    }
}();
