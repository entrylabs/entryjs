function addCode(code, msg) {
    return { code: code, msg: msg};
}

let EC_NO_WebGL = addCode("1001", "no WebGLRenderingContext");
let EC_HAS_GL_NO_STENCIL = addCode("1002", "has gl, but no stencil");
let EC_NO_GL_CONTEXT = addCode("1003", "can't get gl context");
let EC_NP_BUT = addCode("1004", "no problem ,but...");
let EC_1999 = addCode("1999", "");

export function entryIsWebGLSupported() {
    let log = _getWebGLLog(false);
    if(log.gl_enable) return;
    sendLogAndThrowError(log);
}

function _getWebGLLog(userSend) {
    const contextOptions = { stencil: true, failIfMajorPerformanceCaveat: true };
    let gl_enable = false;
    try
    {
        if (!window.WebGLRenderingContext)
        {
            return _createLog(EC_NO_WebGL, gl_enable, userSend);
        }

        const canvas = document.createElement('canvas');
        let gl = canvas.getContext('webgl', contextOptions) || canvas.getContext('experimental-webgl', contextOptions);

        const hasStencil = !!(gl && gl.getContextAttributes().stencil);
        gl_enable = hasStencil;
        var vendor, renderer;
        if (gl)
        {
            let debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
            renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);

            const loseContext = gl.getExtension('WEBGL_lose_context');

            if (loseContext)
            {
                loseContext.loseContext();
            }
        }

        var hasGL = !!gl;
        let ec;
        if (!hasGL) {
            ec = EC_NO_GL_CONTEXT;
        } else if (hasGL && !hasStencil) {
            ec = EC_HAS_GL_NO_STENCIL;
        } else if (hasGL && hasStencil) {
            ec = EC_NP_BUT;
        }
        return _createLog(ec, gl_enable, userSend, vendor, renderer);

    }
    catch (e)
    {
        let ec = EC_1999;
        ec.msg = e?e.toString() : "error occur, but no error object";
        return _createLog(ec, false, userSend);
    }
}


function _createLog(errorCode, gl_enable, userSend, vendor, renderer) {
    var obj = {};
    obj.code = errorCode.code;
    obj.msg = errorCode.msg;
    obj.userSend = userSend ? "Y" : "N";
    obj.gl_enable = gl_enable ? "Y" : "N";
    obj.gl_vendor = vendor || "NOPE";
    obj.gl_renderer = renderer || "NOPE";
    obj.agent = window.navigator.userAgent;
    obj.url = window.location.href;

    return obj;
}

let sendLogAndThrowError = (obj)=>{
    let alertMsg = "이 환경에서는 실행할 수 없습니다.";
    let url = "/api/webgl/log";
    $.post(url, obj, (d)=>{
        alert(alertMsg);
    }, "json");
    throw new Error(alertMsg);
};




Entry.getWebGLLog = ()=>{
    return _getWebGLLog(true);
};