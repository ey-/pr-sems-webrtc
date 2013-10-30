#ifndef LIB_WEBSOCKET_ADAPTER_H
#define LIB_WEBSOCKET_ADAPTER_H

#include "ILibWebsocketCallback.h"
#include "singleton.h"
#include "../../core/log.h"



class LibWebsocketAdapter : public ILibWebsocketCallback
{
public:
	static LibWebsocketAdapter* getInstance()
	{
		INFO("WebRTC\tcreate Instance\n");
		static LibWebsocketAdapter staticInstance = LibWebsocketAdapter();
		INFO("WebRTC\tcreated Instance\n");
		return &staticInstance;
	}

public:
	LibWebsocketAdapter();
	virtual ~LibWebsocketAdapter();

	void registerCallbackReceiver(ILibWebsocketCallback* receiver);

	virtual int callbackHTTP(struct libwebsocket_context *context,
	                         struct libwebsocket *wsi,
	                         enum libwebsocket_callback_reasons reason,
	                         void *user, void *in, size_t len);

	virtual int callbackSIP(struct libwebsocket_context *context,
							 struct libwebsocket *wsi,
							 enum libwebsocket_callback_reasons reason,
							 void *user, void *in, size_t len);

protected:
	void initLibWebsocket();

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
	return LibWebsocketAdapter::getInstance()->callbackSIP(context, wsi, reason, user, in, len);
}

static int callback_http(struct libwebsocket_context *context,
                         struct libwebsocket *wsi,
                         enum libwebsocket_callback_reasons reason,
                         void *user, void *in, size_t len)
{
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
