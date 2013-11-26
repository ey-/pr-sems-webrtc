/*
 * SocketHelper.cpp
 *
 *      Authors: Arne Krawielitzki <arne.krawie@gmail.com>
 *		Engin Yilmaz <ey@esyi.de>
 */

#include "SocketHelper.h"
#include <arpa/inet.h>

#include <netdb.h>
#include "../../core/sip/ip_util.h"
#include "../../core/log.h"


SocketHelper::SocketHelper()
{}

SocketHelper::~SocketHelper()
{}

struct sockaddr_storage SocketHelper::getAddressStorage(struct libwebsocket_context *context,
		struct libwebsocket *wsi, void* user)
{
	struct sockaddr_storage sa;

	char client_name[128];
	char client_ip[128];
	DBG("SocketHelper::getAddressStorage user=%i",(int)(long)user);
	if (user == 0)
	{
	    user = libwebsocket_context_user(context);
	    	DBG("SocketHelper::getAddressStorage user=%i",(int)(long)user);
	}

	libwebsockets_get_peer_addresses(context, wsi, (int)(long)user,client_name,
						     sizeof(client_name), client_ip, sizeof(client_ip));
    DBG("getAddressStorage ip:%s name: %s",client_ip,client_name);

//	if (inet_pton(AF_INET,client_ip,&(((struct sockaddr_in *)&sa)->sin_addr)) == 0)
//	{
//	    DBG("IPv6");
//		inet_pton(AF_INET6,client_ip,&(((struct sockaddr_in6 *)&sa)->sin6_addr));
//	}
	int ret = am_inet_pton((const char*)&client_ip,&sa);
	DBG("ret am_inet_pton: %i", ret);
	return sa;
}

string SocketHelper::getConnectionIdByAddressStorage(struct sockaddr_storage* sa)
{
	char host[NI_MAXHOST] = "";
	return am_inet_ntop(sa,host,NI_MAXHOST);
}
