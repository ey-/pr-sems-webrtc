#include "ClientSocket.h"

ClientSocket::ClientSocket(ServerSocket* server_sock,int sd, sockaddr_storage sa)
: trsp_socket(server_sock->get_if(),0,0,sd)
{
	mServer_sock = server_sock;
	mSocketAddress = sa;
}

ClientSocket::~ClientSocket()
{

}

int ClientSocket::send(const sockaddr_storage* sa, const char* msg, const int msg_len)
{
	return 0;
}

int ClientSocket::bind(const string& address, unsigned short port)
{
	return 0;
}

const char* ClientSocket::get_transport() const
{
	return mServer_sock->get_transport();
}
