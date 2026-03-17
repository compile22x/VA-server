"use strict";

const WebSocket = require("ws");
const vlog = require("./js_vertair_logger");
const CONST_S2S_WS_RETRY_TIME = 2000;
let m_ws;
let Me;

function fn_onOpen_Handler() {
    vlog.info("[S2S] Connected to AuthServer at " + global.m_serverconfig.m_configuration.s2s_ws_target_ip + ":" + global.m_serverconfig.m_configuration.s2s_ws_target_port);
    if (Me.fn_onMessageOpened) Me.fn_onMessageOpened();
}
function fn_onClose_Handler() {
    vlog.warn("[S2S] Connection to AuthServer closed — retrying in 2s");
    const c_url = "ws://" + global.m_serverconfig.m_configuration.s2s_ws_target_ip + ":" + global.m_serverconfig.m_configuration.s2s_ws_target_port;
    setTimeout(() => fn_startWebSocketListener(c_url), CONST_S2S_WS_RETRY_TIME);
}
function fn_onError_Handler(err) {
    vlog.error("[S2S] Auth connection error: " + (err.message || err));
}
function fn_onMessage_Handler(data) {
    if (Me.fn_onMessageReceived) Me.fn_onMessageReceived(data);
}
function fn_startWebSocketListener(p_url) {
    m_ws = new WebSocket(p_url);
    m_ws.on("open", fn_onOpen_Handler);
    m_ws.on("close", fn_onClose_Handler);
    m_ws.on("message", fn_onMessage_Handler);
    m_ws.on("error", fn_onError_Handler);
}
function fn_startServer() {
    Me = this;
    const c_url = "ws://" + global.m_serverconfig.m_configuration.s2s_ws_target_ip + ":" + global.m_serverconfig.m_configuration.s2s_ws_target_port;
    vlog.info("[S2S] Connecting to AuthServer at " + c_url);
    fn_startWebSocketListener(c_url);
}
function fn_sendMessage(p_message) {
    if (m_ws && m_ws.readyState === WebSocket.OPEN) m_ws.send(p_message);
}

exports.fn_onMessageReceived = undefined;
exports.fn_onMessageOpened = undefined;
module.exports = { fn_startServer, fn_sendMessage };
