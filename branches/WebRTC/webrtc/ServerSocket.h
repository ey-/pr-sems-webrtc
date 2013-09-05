#ifndef SERVERSOCKET_H
#define SERVERSOCKET_H
#include "../../core/sip/transport.h"

class ServerSocket : public trsp_socket
{

public:
	ServerSocket(unsigned short if_num);
	~ServerSocket();
    virtual int send(const sockaddr_storage* sa, const char* msg, const int msg_len);
    virtual int bind(const string& address, unsigned short port);
    virtual const char* get_transport() const;
};

#endif;
