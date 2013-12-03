/*
 * WebRTC_trsp.cpp
 *
 *      Authors: Arne Krawielitzki <arne.krawie@gmail.com>
 *		Engin Yilmaz <ey@esyi.de>
 */


#include "WebRTC_trsp.h"
#include "LibWebsocketAdapter.h"
#include "SocketHelper.h"
#include "ClientSocket.h"
#include "../../core/sip/sip_parser.h"
#include "../../core/sip/trans_layer.h"
#include <private-libwebsockets.h>

WebRTC_trsp::WebRTC_trsp(ServerSocket* sock)
: transport(sock)
{
	mbStopThread = false;
	mServerSocket = sock;
	mbNewSocket = false;
	mPollFDs = NULL;

	// Initialisierung von LibWebsocket
	initialize((unsigned short)sock->get_port());

	recreateFDArray();
}

WebRTC_trsp::~WebRTC_trsp()
{

}

void WebRTC_trsp::initialize(unsigned short port)
{
	// We register this instance as the receiver of all callbacks
	// that are forwarded by LibWebsocket
	LibWebsocketAdapter::getInstance()->registerCallbackReceiver(this);
	LibWebsocketAdapter::getInstance()->initLibWebsocket(port);
}

void WebRTC_trsp::run()
{
	// Wir laufen bis wir aufhören sollen
	while (mbStopThread == false)
	{
		// wenn ein neuer Socket hinzugefügt wurde, muss dieser in das Array
		// der via Poll zu Prüfenden FDs aufgenommen werden
		if (mbNewSocket == true)
		{
			recreateFDArray();
			mbNewSocket=false;
		}

//libwebsocket_service(LibWebsocketAdapter::getInstance()->getContext(),50);
		// Alle FD prüfen ob irgendwas mit ihnen gemacht werden soll.
		// => Poll
		int n = poll(mPollFDs, mPollFDsCount, 25);
		if (n >= 0)
		{
			for (n = 0; n < mPollFDsCount; n++)
			{
				if (mPollFDs[n].revents)
				{//DBG("poll loop revents: %i , %i",n,mPollFDs[n].fd);
					/*
					* returns immediately if the fd does not
					* match anything under libwebsockets
					* control
					*/
					if (libwebsocket_service_fd(LibWebsocketAdapter::getInstance()->getContext(), &mPollFDs[n]))
					{DBG("poll loop service_fd error");
						// Fehler ?!
					}
				}
			}
		}
		if (mServerSocket->hasToSend() == true)
		{
		DBG("trigger send Webrtc");
			mServerSocket->triggerSend();
		}
	}
}

void WebRTC_trsp::recreateFDArray()
{
	if (mPollFDs != NULL)
	{
		delete []mPollFDs;
	}

	mPollFDs = new pollfd[1 + mClientSockets.size()];

	int fdIndex = 0;
	mPollFDs[fdIndex].fd = mServerSocket->get_sd();
	mPollFDs[fdIndex].events = POLLIN | POLLOUT;
	mPollFDs[fdIndex].revents = 0;
	DBG("ServerFD: %i",mPollFDs[fdIndex].fd);
	fdIndex++;
	for (ClientSocketListIterator iter = mClientSockets.begin();
			iter != mClientSockets.end();
			iter++)
	{
		ClientSocket* clientSocket = (*iter);
		mPollFDs[fdIndex].fd = clientSocket->get_sd();
		mPollFDs[fdIndex].events = POLLIN | POLLOUT;
		mPollFDs[fdIndex].revents = 0;
		fdIndex++;
		DBG("ClientFD: %i",mPollFDs[fdIndex].fd);
	}

	mPollFDsCount = fdIndex;
DBG("recreated PollFDs: %i", fdIndex);
}

void WebRTC_trsp::on_stop()
{
	mbStopThread = true;
}

int WebRTC_trsp::callbackHTTP(struct libwebsocket_context *context,
	                         struct libwebsocket *wsi,
	                         enum libwebsocket_callback_reasons reason,
	                         void *user, void *in, size_t len)
{
	// Reason auswerten
	switch (reason)
	{
		case LWS_CALLBACK_ADD_POLL_FD:
		{
		    DBG("Adding Pollfd");
			// Im User steht der verwendete SD
			// (Eventuell steht der FD/SD auch im "in" Parameter
			int socketDiscriptor = wsi->sock;

			if (socketDiscriptor > 0 && socketDiscriptor != mServerSocket->get_sd() && mServerSocket->get_sd() != -1){
			    DBG("Adding Pollfd, server ready & not serverSocket");
			// FD für die eingehende Client-Verbindung erstellen
			ClientSocket* clientSocket = new ClientSocket(mServerSocket, wsi, socketDiscriptor, SocketHelper::getAddressStorage(context,wsi,(void*)socketDiscriptor));
			inc_ref(clientSocket);

			mClientSockets.push_back(clientSocket);

			mServerSocket->registerClient(clientSocket);
			/*pollfds[count_pollfds].fd = (int)(long)user;
			pollfds[count_pollfds].events = (int)len;
			pollfds[count_pollfds++].revents = 0;*/

			mbNewSocket=true;
			}
			break;
		}
	    case LWS_CALLBACK_DEL_POLL_FD:
	    {
	    	// Bestimmen welcher Socket gelöscht werden soll
	    	int socketDiscriptor = wsi->sock;

	    	// FD Wieder freigeben
		DBG("delete Pollfd");
	    	for (ClientSocketListIterator iter = mClientSockets.begin();
	    			iter != mClientSockets.end();
	    			iter++)
	    	{
	    		ClientSocket* clientSocket = (*iter);
	    		if (clientSocket->get_sd() == socketDiscriptor)
	    		{
	    		    DBG("delete real Pollfd");
	    			mClientSockets.remove(clientSocket);
	    			DBG("unreg Client");
	    			mServerSocket->unregisterClient(clientSocket);
	    			dec_ref(clientSocket);
	    			break;
	    		}
	    	}
		mbNewSocket=true;
	    	break;
	    }
	    default:
DBG("CALLBACK_HTTP_REASON : %i", reason);
	    	break;
	}

	return 0;
}

int WebRTC_trsp::callbackSIP(struct libwebsocket_context *context,
							 struct libwebsocket *wsi,
							 enum libwebsocket_callback_reasons reason,
							 void *user, void *in, size_t len)
{
	switch (reason) {
	case LWS_CALLBACK_ESTABLISHED:
		DBG("Connection established, Handshake success");
		break;
	case LWS_CALLBACK_RECEIVE:
	{
		DBG("Received Message: %s",(char*)in);
		sip_msg* s_msg = new sip_msg((const char*) in, len);
		s_msg->local_socket = mServerSocket;
		inc_ref(mServerSocket);
		struct sockaddr_storage remoteSA = SocketHelper::getAddressStorage(context, wsi, (void*)wsi->sock);
		memcpy(&s_msg->remote_ip, &remoteSA, sizeof(sockaddr_storage));
		mServerSocket->copy_addr_to(&s_msg->local_ip);

		trans_layer::instance()->received_msg(s_msg);
		break;
	}
	default:
		break;
	}
	return 0;

}


