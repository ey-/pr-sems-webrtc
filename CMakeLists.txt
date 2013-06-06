set (websocket_SRCS
WebSocket.cpp
WebSocketServer.cpp
)

INCLUDE(lib/libwebsockets.c)

SET(sems_module_name websocket)
INCLUDE(${CMAKE_SOURCE_DIR}/cmake/module.rules.txt)
