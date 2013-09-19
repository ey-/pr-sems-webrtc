#ifndef _WEBRTC_TRSP_H
#define _WEBRTC_TRSP_H

#include <arpa/inet.h>
#include "../../core/sip/transport.h"
#include "ServerSocket.h"
#include "ClientSocket.h"


struct per_session_data__echo {
	unsigned char buf[100];
	unsigned int len;
	unsigned int index;
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
