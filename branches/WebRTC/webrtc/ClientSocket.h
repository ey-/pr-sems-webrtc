/*
 * ClientSocket.h
 *
 *      Authors: Arne Krawielitzki <arne.krawie@gmail.com>
 *		Engin Yilmaz <ey@esyi.de>
 */

#ifndef CLIENTSOCKET_H
#define CLIENTSOCKET_H

#include "../../core/sip/transport.h"
#include "ServerSocket.h"

#include <deque>
using std::deque;

class ClientSocket : public trsp_socket
{
private:
	ServerSocket* mServer_sock;
	struct sockaddr_storage mSocketAddress;
	struct libwebsocket* mWsi;

	string msPeerIp;

	struct msg_buf
	{
		sockaddr_storage addr;
		char*            msg;
		int              msg_len;
		char*            cursor;

		msg_buf(const sockaddr_storage* sa, const char* msg,
			const int msg_len);
		~msg_buf();

		int bytes_left() { return msg_len - (cursor - msg); }
	};

	typedef deque<msg_buf*> SEND_QUEUE;
	SEND_QUEUE mSendQueue;
	AmMutex mSendQueueMutex;


public:
	ClientSocket(ServerSocket* server_sock, struct libwebsocket *wsi, int sd, sockaddr_storage sa);
	~ClientSocket();

    virtual int send(const sockaddr_storage* sa, const char* msg, const int msg_len);
    virtual int bind(const string& address, unsigned short port);
    virtual const char* get_transport() const;

    string getPeerIp() { return msPeerIp; };
    struct sockaddr_storage* getSocketAddress() {return &mSocketAddress; };
    struct libwebsocket* getWSI() {return mWsi; };

    void realSend();
};

#endif
