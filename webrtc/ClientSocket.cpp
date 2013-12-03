/*
 * ClientSocket.cpp
 *
 *      Authors: Arne Krawielitzki <arne.krawie@gmail.com>
 *		Engin Yilmaz <ey@esyi.de>
 */

#include "ClientSocket.h"

#include <netdb.h>
#include <string.h>
#include "../../core/sip/ip_util.h"
#include "LibWebsocketAdapter.h"

ClientSocket::ClientSocket(ServerSocket* server_sock, struct libwebsocket *wsi, int sd, sockaddr_storage sa)
: trsp_socket(server_sock->get_if(),0,0,sd)
{
	mServer_sock = server_sock;
	mWsi = wsi;
	memcpy(&mSocketAddress, &sa, sizeof(mSocketAddress));

	char host[NI_MAXHOST] = "";
	msPeerIp = am_inet_ntop(&mSocketAddress,host,NI_MAXHOST);
	DBG("ClientSocket created PeerIP: %s, sd: %i, sd %i",msPeerIp.c_str(), this->get_sd(),sd);
}

ClientSocket::~ClientSocket()
{
}

ClientSocket::msg_buf::msg_buf(const sockaddr_storage* sa, const char* msg,
				  const int msg_len)
  : msg_len(msg_len)
{
	memcpy(&addr,sa,sizeof(sockaddr_storage));
	cursor = this->msg = new char[msg_len];
	memcpy(this->msg,msg,msg_len);
}

ClientSocket::msg_buf::~msg_buf()
{
	delete [] msg;
}

int ClientSocket::send(const sockaddr_storage* sa, const char* msg, const int msg_len)
{
	// Nachricht in den einqueuen
	mSendQueueMutex.lock();
	mSendQueue.push_back(new msg_buf(sa,msg,msg_len));
	mSendQueueMutex.unlock();

	// Dem Serversocket bescheidgeben das dieser Socket etwas senden möchte
	mServer_sock->queueClientSocket(this);
	return 0;
}

void ClientSocket::realSend()
{
	mSendQueueMutex.lock();
	  while(!mSendQueue.empty())
	  {
	    msg_buf* msg = mSendQueue.front();
	    mSendQueue.pop_front();
	    mSendQueueMutex.unlock();

	    if(!msg || !msg->bytes_left())
	    {
	      delete msg;
	      mSendQueueMutex.lock();
	      continue;
	    }

	    // send msg
	    int bytes = LibWebsocketAdapter::getInstance()->send((unsigned char*)msg->cursor, msg->bytes_left(), mWsi);
	    /*if(bytes < 0) {
	      DBG("error on write: %i",bytes);
	      switch(errno){
	      case EINTR:
	      case EAGAIN: // would block
		mSendQueueMutex.lock();
		mSendQueue.push_front(msg);
		mSendQueueMutex.unlock();
		break;

	      default: // unforseen error: close connection
		ERROR("unforseen error: close connection (%i/%s)",errno,strerror(errno));
		close();
		break;
	      }

	      return;
	    }*/

	    DBG("bytes written: <%.*s...>\n",30,msg->cursor);

	    if(bytes < msg->bytes_left())
	    {
	      msg->cursor += bytes;
	      mSendQueueMutex.lock();
	      mSendQueue.push_front(msg);
	      mSendQueueMutex.unlock();
	      return;
	    }

	    if(!msg->bytes_left())
	    {
	      delete msg;
	    }

	    mSendQueueMutex.lock();
	  }

	  mSendQueueMutex.unlock();
}

int ClientSocket::bind(const string& address, unsigned short port)
{
	return 0;
}

const char* ClientSocket::get_transport() const
{
	return mServer_sock->get_transport();
}
