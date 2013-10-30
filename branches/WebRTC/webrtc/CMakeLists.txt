set (webrtc_SRCS
ClientSocket.cpp
ServerSocket.cpp
WebRTC.cpp
WebRTC_trsp.cpp
LibWebsocketAdapter.cpp
)

INCLUDE(lib/libwebsockets.c)

SET(sems_module_name webrtc)
INCLUDE(${CMAKE_SOURCE_DIR}/cmake/module.rules.txt)
