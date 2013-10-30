#include "LibWebsocketAdapter.h"
#include "../../core/log.h"

LibWebsocketAdapter::LibWebsocketAdapter()
{
	mpReceiver = NULL;
	mpContext = NULL;

	initLibWebsocket();
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
	int port = 7682;
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
