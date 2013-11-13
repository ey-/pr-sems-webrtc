set (webrtc_SRCS
WebRTC.cpp
WebRTC_trsp.cpp
LibWebsocketAdapter.cpp
ServerSocket.cpp
ClientSocket.cpp
SocketHelper.cpp
)

INCLUDE(lib/libwebsockets.c)

SET(sems_module_name webrtc)
INCLUDE(${CMAKE_SOURCE_DIR}/cmake/module.rules.txt)
