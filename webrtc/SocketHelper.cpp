/*
 * SocketHelper.cpp
 *
 *  Created on: 12.11.2013
 *      Author: arne
 */

#include "SocketHelper.h"
#include <arpa/inet.h>

SocketHelper::SocketHelper() {
	// TODO Auto-generated constructor stub

}

SocketHelper::~SocketHelper() {
	// TODO Auto-generated destructor stub
}

struct sockaddr_storage SocketHelper::getAddressStorage(struct libwebsocket_context *context,
		struct libwebsocket *wsi, void* user)
{
	struct sockaddr_storage sa;

	char client_name[128];
	char client_ip[128];

	libwebsockets_get_peer_addresses(context, wsi, (int)(long)user,client_name,
						     sizeof(client_name), client_ip, sizeof(client_ip));

	if (inet_pton(AF_INET,client_ip,&(((struct sockaddr_in *)&sa)->sin_addr)) == 0)
	{
		inet_pton(AF_INET6,client_ip,&(((struct sockaddr_in6 *)&sa)->sin6_addr));
	}

	return sa;
}
