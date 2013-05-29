set (websocket_SRCS
WebSocket.cpp
WebSocketServer.cpp
)

SET(sems_module_name websocket)
INCLUDE(${CMAKE_SOURCE_DIR}/cmake/module.rules.txt)
