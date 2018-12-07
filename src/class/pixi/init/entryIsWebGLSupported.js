function addCode(code, msg) {
    return { code: code, msg: msg};
}

let EC_NO_WebGL = addCode("1001", "no WebGLRenderingContext");
let EC_HAS_GL_NO_STENCIL = addCode("1002", "has gl, but no stencil");
let EC_NO_GL_CONTEXT = addCode("1003", "can't get gl context");
let EC_NP_BUT = addCode("1004", "no problem ,but...");
let EC_1999 = addCode("1999", "");

export function entryIsWebGLSupported(userSend) {

    const contextOptions = { stencil: true, failIfMajorPerformanceCaveat: true };

    try
    {
        if (!window.WebGLRenderingContext)
        {
            send(EC_NO_WebGL, userSend);
            return false;
        }

        const canvas = document.createElement('canvas');
        let gl = canvas.getContext('webgl', contextOptions) || canvas.getContext('experimental-webgl', contextOptions);

        const success = !!(gl && gl.getContextAttributes().stencil);

        if (gl)
        {
            var debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            var vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
            var renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);

            const loseContext = gl.getExtension('WEBGL_lose_context');

            if (loseContext)
            {
                loseContext.loseContext();
            }
        }

        var hasGL = !!gl;
        var hasStencil  = success;
        if(userSend || !success) {
            let ec;
            if(!hasGL) {
                ec = EC_NO_GL_CONTEXT;
            }
            else if( hasGL && !hasStencil ) {
                ec = EC_HAS_GL_NO_STENCIL;
            } else if ( hasGL && hasStencil ) {
                ec = EC_NP_BUT;
            }
            send(ec, userSend, vendor, renderer);
        }

        gl = null;
        return success;
    }
    catch (e)
    {
        let ec = EC_1999;
        ec.msg = e?e.toString() : "error occur, but no error object";
        send(ec, userSend);
        return false;
    }
}



function send(errorCode, userSend, vendor, renderer) {
    var obj = {};
    obj.code = errorCode.code;
    obj.msg = errorCode.msg;
    obj.userSend = userSend ? "Y" : "N";
    obj.gl_vendor = vendor || "";
    obj.gl_renderer = renderer || "";
    obj.agent = window.navigator.userAgent;
    obj.url = window.location.href;

    var alertMsg;
    if(userSend) {
        alertMsg = "로그가 전송 되었습니다."
    } else {
        alertMsg = "이 환경에서는 실행할 수 없습니다."
    }

    let url = "/api/webgl/log";
    $.post(url, obj, (d)=>{
        alert(alertMsg);
    }, "json");

    if(!userSend) {
        throw new Error(alertMsg);
    }
}

// 유저가 직접 보내야 할 때
window.sendlog = function() {
    entryIsWebGLSupported(true);
};
