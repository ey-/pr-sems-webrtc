#include "WebRTC_trsp.h"

WebRTC_trsp::WebRTC_trsp(ServerSocket* sock)
: transport(sock)
{

}

WebRTC_trsp::~WebRTC_trsp()
{

}

void WebRTC_trsp::initialize()
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
		mbFailure = true;
	}

	INFO("starting WebSocket...\n port:%i",info.port);

}

void WebRTC_trsp::run()
{

}

void WebRTC_trsp::on_stop()
{

}

