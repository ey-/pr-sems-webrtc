/*
 * WebRTC_trsp.h
 *
 *      Authors: Arne Krawielitzki <arne.krawie@gmail.com>
 *		Engin Yilmaz <ey@esyi.de>
 */

#ifndef _WEBRTC_TRSP_H
#define _WEBRTC_TRSP_H

#include "../../core/sip/transport.h"
#include "ServerSocket.h"
#include "ClientSocket.h"
#include "ILibWebsocketCallback.h"
#include <sys/poll.h>
#include <list>
using std::list;

class WebRTC_trsp: public transport, public ILibWebsocketCallback
{
protected:
	/** @see AmThread **/
	void run();
	/** @see AmThread **/
	void on_stop();
	/** **/


protected:
	bool mbStopThread;
	ServerSocket* mServerSocket;

	typedef list<ClientSocket*> ClientSocketList;
	typedef list<ClientSocket*>::iterator ClientSocketListIterator;
	ClientSocketList mClientSockets;

	// Gibt an, ob ein neuer Client hinzugefügt wurde, damit bei Bedarf das
	// Array mit den ClientSockets erneuert werden kann
	bool mbNewSocket;
	pollfd* mPollFDs;
	int mPollFDsCount;

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

	void initialize(unsigned short port,bool use_ssl,string* certpath, string* privatekeypath, string* sInterface);

protected:
	void recreateFDArray();
};

#endif
