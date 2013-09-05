#ifndef _WebSocketServer_h_
#define _WebSocketServer_h_


#include "AmThread.h"
#include "singleton.h"
#include <libwebsockets.h>
#include "../../core/sip/sip_parser.h"
#include "../../core/sip/transport.h"

struct per_session_data__echo {
	unsigned char buf[100];
	unsigned int len;
	unsigned int index;
};

struct WebsocketMsg : sip_msg
{
	WebsocketMsg(struct libwebsocket *wsi);
	WebsocketMsg(struct libwebsocket *wsi, const char* msg_buf, int msg_len);

	struct libwebsocket *websocket;
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
: public trsp_socket,AmThread
{
public:
	CWebSocketServer();
	virtual ~CWebSocketServer();

	/** Start it ! */
	void start();
	/** Stop it ! */
	void stop();

	void setSocket(libwebsocket* socket);

    virtual int bind(const string& address, unsigned short port);

    virtual const char* get_transport() const
    {
    	INFO("in get transport ");
    	return "ws"; }

    virtual int send(const sockaddr_storage* sa, const char* msg, const int msg_len);

protected:
	virtual void run();
	virtual void on_stop();

protected:
	bool mbFailure;
	struct libwebsocket_context* mContext;
	libwebsocket* mSocket;
};

typedef singleton<CWebSocketServer> WebSocketServer;

#endif
