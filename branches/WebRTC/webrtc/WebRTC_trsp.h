#ifndef _WEBRTC_TRSP_H
#define _WEBRTC_TRSP_H

#include "../../core/sip/transport.h"
#include "ServerSocket.h"

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
