/*
 * LibWebsocketAdapter.cpp
 *
 *      Authors: Arne Krawielitzki <arne.krawie@gmail.com>
 *		Engin Yilmaz <ey@esyi.de>
 */

#include "LibWebsocketAdapter.h"
#include "../../core/log.h"
#include <string.h>

LibWebsocketAdapter* LibWebsocketAdapter::mpStaticInstance = NULL;

LibWebsocketAdapter::LibWebsocketAdapter()
{
	mpReceiver = NULL;
	mpContext = NULL;
}

LibWebsocketAdapter::~LibWebsocketAdapter()
{
	if (mpContext != NULL)
	{
		libwebsocket_context_destroy(mpContext);
	}
}

void LibWebsocketAdapter::initLibWebsocket()
{
	int port = 7689;
	const char *interface = NULL;

	// we're not using ssl
	const char *cert_path = NULL;
	const char *key_path = NULL;

	// no special options
	int opts = 0;
	struct lws_context_creation_info info;
	memset(&info, 0, sizeof(info));
	info.extensions=libwebsocket_get_internal_extensions();
	info.port=port;
	info.protocols =protocols;
	info.iface= interface;
	info.ssl_cert_filepath=cert_path;
	info.ssl_private_key_filepath=key_path;
	info.options=opts;
	info.gid=-1;
	info.uid=-1;

	INFO("WebRTC\tCreating Context\n");

	// create libwebsocket context representing this server
	mpContext = libwebsocket_create_context(&info);
	INFO("WebRTC\tCreated Context\n");
	if (mpContext == NULL)
	{
		ERROR("libwebsocket init failed\n");
	}
	else
	{
		INFO("starting WebSocket...\n port:%i",info.port);
	}
}

void LibWebsocketAdapter::registerCallbackReceiver(ILibWebsocketCallback* receiver)
{
	INFO("CallbackReceiver registered");
	mpReceiver = receiver;
}

int LibWebsocketAdapter::send(unsigned char* data, int dataLength, struct libwebsocket* wsi)
{
DBG("sending msg: %s",data);
	return libwebsocket_write(wsi, data, dataLength, LWS_WRITE_BINARY);
}

int LibWebsocketAdapter::callbackHTTP(struct libwebsocket_context *context,
	                         struct libwebsocket *wsi,
	                         enum libwebsocket_callback_reasons reason,
	                         void *user, void *in, size_t len)
{
	// forward the callback to the registered callback receiver
	if (mpReceiver != 0)
	{
		return mpReceiver->callbackHTTP(context, wsi, reason, user, in, len);
	}
	return 0;
}

int LibWebsocketAdapter::callbackSIP(struct libwebsocket_context *context,
						 struct libwebsocket *wsi,
						 enum libwebsocket_callback_reasons reason,
						 void *user, void *in, size_t len)
{
	// forward the callback to the registered callback receiver
	if (mpReceiver != 0)
	{
		return mpReceiver->callbackSIP(context, wsi, reason, user, in, len);
	}
	return 0;
}

