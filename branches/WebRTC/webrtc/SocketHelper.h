/*
 * SocketHelper.h
 *
 *  Created on: 12.11.2013
 *      Author: arne
 */

#ifndef SOCKETHELPER_H_
#define SOCKETHELPER_H_

#include <libwebsockets.h>
#include <sys/socket.h>

class SocketHelper
{
private:
	SocketHelper();

public:
	virtual ~SocketHelper();

	static struct sockaddr_storage getAddressStorage(struct libwebsocket_context *context, struct libwebsocket *wsi, void* user);
};

#endif /* SOCKETHELPER_H_ */
