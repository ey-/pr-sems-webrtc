#ifndef _WEBRTC_TRSP_H
#define _WEBRTC_TRSP_H

#include "../../core/sip/transport.h"
#include "ServerSocket.h"
#include "ILibWebsocketCallback.h"

class WebRTC_trsp: public transport, public ILibWebsocketCallback
{
protected:
	/** @see AmThread **/
	void run();
	/** @see AmThread **/
	void on_stop();


	/** **/
	void initialize();

public:
	WebRTC_trsp(ServerSocket* sock);
	~WebRTC_trsp();

	virtual int callbackHTTP(struct libwebsocket_context *context,
	                         struct libwebsocket *wsi,
	                         enum libwebsocket_callback_reasons reason,
	                         void *user, void *in, size_t len);

	virtual int callbackSIP(struct libwebsocket_context *context,
		                         struct libwebsocket *wsi,
		                         enum libwebsocket_callback_reasons reason,
		                         void *user, void *in, size_t len);
};

#endif
