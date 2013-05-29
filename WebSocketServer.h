#ifndef WEBSOCKET_SERVER_H
#define WEBSOCKET_SERVER_H

#include "AmThread.h"
#include "singleton.h"
#include <libwebsockets.h>

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

class CWebSocketServer
:AmThread
{
public:
	CWebSocketServer();
	virtual ~CWebSocketServer();

	/** Start it ! */
	void start();
	/** Stop it ! */
	void stop();

protected:
	virtual void run();
	virtual void on_stop();

protected:
	bool mbFailure;
	struct libwebsocket_context* mContext;
};

typedef singleton<CWebSocketServer> WebSocketServer;

#endif
