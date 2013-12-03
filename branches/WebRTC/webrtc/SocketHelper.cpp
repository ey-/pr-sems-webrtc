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

	struct sockaddr_in address = { 0 };
	socklen_t addressLength = sizeof(address);
	string ip;
	int port;

	int result = getpeername((int)(long)user, (struct sockaddr*) &address,&addressLength);

	ip = inet_ntoa(address.sin_addr);
	port = ntohs(address.sin_port);

	//libwebsockets_get_peer_addresses(context, wsi, (int)(long)user,client_name,
		//				     sizeof(client_name), client_ip, sizeof(client_ip));
    DBG("getAddressStorage ip:%s name: %i",ip.c_str(),port);

//	if (inet_pton(AF_INET,client_ip,&(((struct sockaddr_in *)&sa)->sin_addr)) == 0)
//	{
//	    DBG("IPv6");
//		inet_pton(AF_INET6,client_ip,&(((struct sockaddr_in6 *)&sa)->sin6_addr));
//	}
	int ret = am_inet_pton(ip.c_str(),&sa);
	am_set_port(&sa,port);
	DBG("ret am_inet_pton: %i", ret);
	return sa;
}

string SocketHelper::getConnectionIdByAddressStorage(struct sockaddr_storage* sa)
{
	char host[NI_MAXHOST] = "";
	am_inet_ntop(sa,host,NI_MAXHOST);

	unsigned short port = am_get_port(sa);

	char output[NI_MAXHOST + 1 + 5];

	sprintf(output, "%s:%u", host, port);

	return output;
}
