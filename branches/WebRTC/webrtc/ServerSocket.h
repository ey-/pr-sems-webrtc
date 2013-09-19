#ifndef SERVERSOCKET_H
#define SERVERSOCKET_H

#include "../../core/sip/transport.h"
#include "singleton.h"
#include "AmConfig.h"
#include "lwebsockets_declarations.h"

class ClientSocket;

class ServerSocket : public trsp_socket
{
protected:
	libwebsocket_context* mContext;
public:
	ServerSocket(unsigned short if_num);
	~ServerSocket();
    virtual int send(const sockaddr_storage* sa, const char* msg, const int msg_len);
    virtual int bind(const string& address, unsigned short port);
    virtual const char* get_transport() const;
    libwebsocket_context* get_context();
    void add_connection(ClientSocket* client);
};
class ServerSocketWrapper
{
protected:
	ServerSocket* mServerSocket;
public:
	ServerSocketWrapper();
	~ServerSocketWrapper();
	ServerSocket* get_ServerSocket();
};
typedef singleton<ServerSocketWrapper> SServerSocket;

#endif