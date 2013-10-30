#include "ServerSocket.h"

ServerSocket::ServerSocket(unsigned short if_num)
:trsp_socket(if_num,0)
{

}
ServerSocket::~ServerSocket()
{

}



int ServerSocket::send(const sockaddr_storage* sa, const char* msg, const int msg_len)
{
	return 0;
}
int ServerSocket::bind(const string& address, unsigned short port)
{
	return 0;
}

const char* ServerSocket::get_transport() const
{
	return "WS";
}
