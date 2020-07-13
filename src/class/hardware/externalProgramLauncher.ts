class ExternalProgramLauncher {
    public programNotInstalled = false;
    private loadingView: Window;

    public executeUrl(schemeUrl: string, notInstalledCallback: () => void) {
        if (navigator.userAgent.indexOf('MSIE') > 0 || navigator.userAgent.indexOf('Trident') > 0) {
            if (navigator.msLaunchUri !== undefined) {
                executeIe(schemeUrl);
            } else {
                let ieVersion;
                // @ts-ignore IE 에 실제 있는 프로퍼티이다.
                if (document.documentMode > 0) {
                    // @ts-ignore IE 에 실제 있는 프로퍼티이다.
                    ieVersion = document.documentMode;
                } else {
                    ieVersion = navigator.userAgent.match(/(?:MSIE) ([0-9.]+)/)[1];
                }

                if (ieVersion < 9) {
                    alert(Lang.msgs.not_support_browser);
                } else {
                    this.init(schemeUrl, (programInstalled) => {
                        if (programInstalled === false) {
                            notInstalledCallback();
                        }
                    });
                }
            }
        } else if (navigator.userAgent.indexOf('Firefox') > 0) {
            executeFirefox(schemeUrl);
        } else if (navigator.userAgent.indexOf('Chrome') > 0) {
            executeChrome(schemeUrl);
        } else if (navigator.userAgent.indexOf('Safari') > 0) {
            executeSafari(schemeUrl);
        } else {
            alert(Lang.msgs.not_support_browser);
        }

        function executeIe(customUrl: string) {
            navigator.msLaunchUri(
                customUrl,
                () => {},
                () => {
                    notInstalledCallback();
                }
            );
        }

        function executeFirefox(customUrl: string) {
            const iFrame = document.createElement('iframe');
            iFrame.src = 'about:blank';
            iFrame.setAttribute('style', 'display:none');
            document.getElementsByTagName('body')[0].appendChild(iFrame);
            const fnTimeout = setTimeout(() => {
                let isInstalled = false;
                try {
                    iFrame.contentWindow.location.href = customUrl;
                    isInstalled = true;
                } catch (e) {
                    if (e.name === 'NS_ERROR_UNKNOWN_PROTOCOL') {
                        isInstalled = false;
                    }
                }

                if (!isInstalled) {
                    notInstalledCallback();
                }

                document.getElementsByTagName('body')[0].removeChild(iFrame);
                clearTimeout(fnTimeout);
            }, 500);
        }

        function executeChrome(customUrl: string) {
            let isInstalled = false;
            window.focus();
            $(window).one('blur', () => {
                isInstalled = true;
            });
            Entry.dispatchEvent('workspaceUnbindUnload', true);
            location.assign(encodeURI(customUrl));
            setTimeout(() => {
                Entry.dispatchEvent('workspaceBindUnload', true);
            }, 100);
            setTimeout(() => {
                if (isInstalled === false) {
                    notInstalledCallback();
                }
                window.onblur = null;
            }, 3000);
        }

        /**
         * safari 브라우저에서 ${customUrl} 인식하여 페이지 이동 처리되서 분기처리(미설치 안내팝업)
         *
         * @param customUrl
         */
        function executeSafari(customUrl: string) {
            const iFrame = document.createElement('iframe');
            iFrame.src = 'about:blank';
            iFrame.setAttribute('style', 'display:none');
            document.getElementsByTagName('body')[0].appendChild(iFrame);
            let isInstalled;

            try {
                iFrame.contentWindow.location.href = customUrl;
                isInstalled = true;
            } catch (err) {
                isInstalled = false;
            }

            if (!isInstalled) {
                notInstalledCallback();
            }
            setTimeout(() => {
                document.getElementsByTagName('body')[0].removeChild(iFrame);
            }, 500);
        }
    }

    public set() {
        this.programNotInstalled = true;
    }

    private init(schemeUrl: string, callback: (programInstalled: boolean) => void) {
        const settings = this.getLoadingViewStyle();

        this.loadingView = window.open('/views/hwLoading.html', 'entry_hw_launcher', settings);
        let fnInterval: NodeJS.Timeout = undefined;
        fnInterval = setTimeout(() => {
            this.runViewer(schemeUrl, callback);
            clearInterval(fnInterval);
        }, 1000);
    }

    private runViewer(schemeUrl: string, callback: (programInstalled: boolean) => void) {
        this.loadingView.document.write(
            // eslint-disable-next-line max-len
            `<iframe src='${schemeUrl}' onload='opener.Entry.hw.programLauncher.set()' style='display:none;width:0;height:0'></iframe>`
        );
        let tryCounter = 0;
        const programNotInstalled = false;
        let tryExecutionTimeout: NodeJS.Timeout = undefined;
        tryExecutionTimeout = setInterval(() => {
            try {
                this.loadingView.location.href;
            } catch (e) {
                this.programNotInstalled = true;
            }

            if (programNotInstalled || tryCounter > 10) {
                clearInterval(tryExecutionTimeout);
                let nCloseCounter = 0;
                let nCloseInterval: NodeJS.Timeout = undefined;
                nCloseInterval = setInterval(() => {
                    nCloseCounter++;
                    if (this.loadingView.closed || nCloseCounter > 2) {
                        clearInterval(nCloseInterval);
                    } else {
                        this.loadingView.close();
                    }
                    this.programNotInstalled = false;
                    tryCounter = 0;
                }, 5000);
                callback(!this.programNotInstalled);
            }
            tryCounter++;
        }, 100);
    }

    private getLoadingViewStyle() {
        const width = 220;
        const height = 225;
        const left = window.screenLeft;
        const top = window.screenTop;
        return `width=${width}, height=${height},  top=${top}, left=${left}`;
    }
}

export default ExternalProgramLauncher;
