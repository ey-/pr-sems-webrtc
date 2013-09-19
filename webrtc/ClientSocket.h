#ifndef CLIENTSOCKET_H
#define CLIENTSOCKET_H

#include "../../core/sip/transport.h"
#include "ServerSocket.h"

class ClientSocket : public trsp_socket
{
private:
	ServerSocket* mServer_sock;
public:
	ClientSocket(ServerSocket* server_sock,int sd, sockaddr_storage* sa);
	~ClientSocket();
    virtual int send(const sockaddr_storage* sa, const char* msg, const int msg_len);
    virtual int bind(const string& address, unsigned short port);
    virtual const char* get_transport() const;
};

#endif
