/*
 * LibWebsocketAdapter.h
 *
 *      Authors: Arne Krawielitzki <arne.krawie@gmail.com>
 *		Engin Yilmaz <ey@esyi.de>
 */

#ifndef LIB_WEBSOCKET_ADAPTER_H
#define LIB_WEBSOCKET_ADAPTER_H

#include "ILibWebsocketCallback.h"
#include "singleton.h"
#include "../../core/log.h"
#include <string>
using std::string;




class LibWebsocketAdapter : public ILibWebsocketCallback
{
public:
	static LibWebsocketAdapter* getInstance()
	{
		if (mpStaticInstance == NULL)
		{
			INFO("WebRTC\tcreate Instance\n");
			mpStaticInstance = new LibWebsocketAdapter();
			INFO("WebRTC\tcreated Instance\n");
		}
		return mpStaticInstance;
	}

protected:
	static LibWebsocketAdapter* mpStaticInstance;

public:
	LibWebsocketAdapter();
	virtual ~LibWebsocketAdapter();

	void initLibWebsocket(unsigned short port,bool use_ssl,string* certpath, string* privatekeypath,string* listenintf);

	void registerCallbackReceiver(ILibWebsocketCallback* receiver);

	int send(unsigned char* data, int dataLength, struct libwebsocket* wsi);

	virtual int callbackHTTP(struct libwebsocket_context *context,
	                         struct libwebsocket *wsi,
	                         enum libwebsocket_callback_reasons reason,
	                         void *user, void *in, size_t len);

	virtual int callbackSIP(struct libwebsocket_context *context,
							 struct libwebsocket *wsi,
							 enum libwebsocket_callback_reasons reason,
							 void *user, void *in, size_t len);
	struct libwebsocket_context* getContext() { return mpContext; };

protected:
	ILibWebsocketCallback* mpReceiver;
	struct libwebsocket_context* mpContext;
};
//typedef singleton<LibWebsocketAdapter> LibWebsocketAdapter;


static int callback_sip (struct libwebsocket_context *context,
		struct libwebsocket *wsi,
		enum libwebsocket_callback_reasons reason,
		void *user, void *in, size_t len)
{
    DBG("Callback Static sip");
	return LibWebsocketAdapter::getInstance()->callbackSIP(context, wsi, reason, user, in, len);
}

static int callback_http(struct libwebsocket_context *context,
                         struct libwebsocket *wsi,
                         enum libwebsocket_callback_reasons reason,
                         void *user, void *in, size_t len)
{
        DBG("Callback Static http");
	return LibWebsocketAdapter::getInstance()->callbackHTTP(context, wsi, reason, user, in, len);
}

static struct libwebsocket_protocols protocols[] = {
    /* first protocol must always be HTTP handler */
    {
        "http-only",	// name
        callback_http,	// C-Style callback function for SIP
        0				// per_session_data_size
    },
    {
    	"sip",			// protocol name - very important!
        callback_sip,	// C-Style callback function for SIP
        0				// we don't use any per session data

    },
    {
        NULL, NULL, 0   /* End of list */
    }
};


#endif
