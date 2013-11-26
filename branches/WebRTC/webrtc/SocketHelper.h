/*
 * SocketHelper.h
 *
 *      Authors: Arne Krawielitzki <arne.krawie@gmail.com>
 *		Engin Yilmaz <ey@esyi.de>
 */

#ifndef SOCKETHELPER_H_
#define SOCKETHELPER_H_

#include <libwebsockets.h>
#include <sys/socket.h>

#include <string>
using std::string;

class SocketHelper
{
private:
	SocketHelper();

public:
	virtual ~SocketHelper();

	static struct sockaddr_storage getAddressStorage(struct libwebsocket_context *context, struct libwebsocket *wsi, void* user);

	static string getConnectionIdByAddressStorage(struct sockaddr_storage* sa);
};

#endif /* SOCKETHELPER_H_ */
