/*
 * ILibWebsocketCallback.h
 *
 *      Authors: Arne Krawielitzki <arne.krawie@gmail.com>
 *		Engin Yilmaz <ey@esyi.de>
 */

#ifndef ILIB_WEBSOCKET_CALLBACK_H
#define ILIB_WEBSOCKET_CALLBACK_H

#include <libwebsockets.h>

/******************************************************************************
 * @brief This Interfaces is used to forward the callback function calls of
 * the LibWebsocket Library to a specific object by inheriting from this
 * interface and registering it to the LibWebsocketAdapter class.
 *****************************************************************************/
class ILibWebsocketCallback
{
public:
	ILibWebsocketCallback() {};
	virtual ~ILibWebsocketCallback() {};

	virtual int callbackHTTP(struct libwebsocket_context *context,
                         struct libwebsocket *wsi,
                         enum libwebsocket_callback_reasons reason,
                         void *user, void *in, size_t len) = 0;

	virtual int callbackSIP(struct libwebsocket_context *context,
	                         struct libwebsocket *wsi,
	                         enum libwebsocket_callback_reasons reason,
	                         void *user, void *in, size_t len) = 0;
};

#endif
