#ifndef _WEBRTC_TRSP_H
#define _WEBRTC_TRSP_H

#include "../../core/sip/transport.h"
#include "ServerSocket.h"
#include "ClientSocket.h"

#define MAX_POLL_ELEMENTS 100
struct pollfd pollfds[100];
int count_pollfds = 0;

struct per_session_data__echo {
	unsigned char buf[100];
	unsigned int len;
	unsigned int index;
};

static int callback_sip (struct libwebsocket_context *context,
		struct libwebsocket *wsi,
		enum libwebsocket_callback_reasons reason,
		void *user, void *in, size_t len);

static int callback_http(struct libwebsocket_context *context,
                         struct libwebsocket *wsi,
                         enum libwebsocket_callback_reasons reason,
                         void *user, void *in, size_t len);

static struct libwebsocket_protocols protocols[] = {
    /* first protocol must always be HTTP handler */
    {
        "http-only",   // name
        callback_http, // callback
        0              // per_session_data_size
    },
    {
        "sip", // protocol name - very important!
        callback_sip,   // callback
        0                          // we don't use any per session data

    },
    {
        NULL, NULL, 0   /* End of list */
    }
};


class WebRTC_trsp: public transport
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
};

#endif
