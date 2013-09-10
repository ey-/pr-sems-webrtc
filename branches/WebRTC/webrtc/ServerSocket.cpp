#include "ServerSocket.h"

ServerSocket::ServerSocket(unsigned short if_num)
:trsp_socket(if_num,0)
{
	int port = 7681;
		const char *interface = NULL;

		// we're not using ssl
		const char *cert_path = NULL;
		const char *key_path = NULL;
		// no special options
		int opts = 0;
		struct lws_context_creation_info info;
		info.extensions=libwebsocket_get_internal_extensions();
		info.port=port;
		info.protocols =protocols;
		info.iface= interface;
		info.ssl_cert_filepath=cert_path;
		info.ssl_private_key_filepath=key_path;
		info.options=opts;
		info.gid=-1;
		info.uid=-1;
		// create libwebsocket context representing this server
		mContext = libwebsocket_create_context(&info);

		if (mContext == NULL) {
			fprintf(stderr, "libwebsocket init failed\n");
			//mbFailure = true;
		}

		INFO("starting WebSocket...\n port:%i",info.port);
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

libwebsocket_context* ServerSocket::get_context()
{
	return mContext;
}



ServerSocketWrapper::ServerSocketWrapper()
{
	mServerSocket = new ServerSocket(AmConfig::SIP_Ifs.size()+1);
}

ServerSocketWrapper::~ServerSocketWrapper()
{
}

ServerSocket* ServerSocketWrapper::get_ServerSocket()
{
	return mServerSocket;
}
