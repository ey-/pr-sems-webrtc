#include "WebRTC_trsp.h"
#include "LibWebsocketAdapter.h"

WebRTC_trsp::WebRTC_trsp(ServerSocket* sock)
: transport(sock)
{
	initialize();
}

WebRTC_trsp::~WebRTC_trsp()
{

}

void WebRTC_trsp::initialize()
{
	INFO("TRANSPORT Initialized\n");
	// We register this instance as the receiver of all callbacks
	// that are forwarded by LibWebsocket
	LibWebsocketAdapter* adapter = LibWebsocketAdapter::getInstance();
	if (adapter != NULL)
	{
		INFO("Got Instance\n");
		adapter->registerCallbackReceiver(this);
	}else
	{
		ERROR("WebRTC\tNo LibWebsocketAdapter Instance available\n");
	}
}

void WebRTC_trsp::run()
{

}

void WebRTC_trsp::on_stop()
{

}

int WebRTC_trsp::callbackHTTP(struct libwebsocket_context *context,
	                         struct libwebsocket *wsi,
	                         enum libwebsocket_callback_reasons reason,
	                         void *user, void *in, size_t len)
{
	return 0;
}

int WebRTC_trsp::callbackSIP(struct libwebsocket_context *context,
							 struct libwebsocket *wsi,
							 enum libwebsocket_callback_reasons reason,
							 void *user, void *in, size_t len)
{
	return 0;
}
