#include "WebRTC_trsp.h"
#include "LibWebsocketAdapter.h"
#include "SocketHelper.h"


WebRTC_trsp::WebRTC_trsp(ServerSocket* sock)
: transport(sock)
{
	mbStopThread = false;
	mServerSocket = sock;
	mbNewSocket = false;
	mPollFDs = NULL;

	// Initialisierung von LibWebsocket
	initialize();

	recreateFDArray();
}

WebRTC_trsp::~WebRTC_trsp()
{

}

void WebRTC_trsp::initialize()
{
	// We register this instance as the receiver of all callbacks
	// that are forwarded by LibWebsocket
	LibWebsocketAdapter::getInstance()->registerCallbackReceiver(this);
	LibWebsocketAdapter::getInstance()->initLibWebsocket();
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
		}

		// Alle FD prüfen ob irgendwas mit ihnen gemacht werden soll.
		// => Poll
		int n = poll(mPollFDs, mPollFDsCount, 25);
		if (n >= 0)
		{
			for (n = 0; n < mPollFDsCount; n++)
			{
				if (mPollFDs[n].revents)
				{
					/*
					* returns immediately if the fd does not
					* match anything under libwebsockets
					* control
					*/
					if (libwebsocket_service_fd(LibWebsocketAdapter::getInstance()->getContext(), &mPollFDs[n]))
					{
						// Fehler ?!
					}
				}
			}
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
	mPollFDs[fdIndex].events = POLLIN;
	mPollFDs[fdIndex].revents = 0;

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
	}

	mPollFDsCount = fdIndex;
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
			// Im User steht der verwendete SD
			// (Eventuell steht der FD/SD auch im "in" Parameter
			int socketDiscriptor = (int)(long)user;

			// FD für die eingehende Client-Verbindung erstellen
			ClientSocket* clientSocket = new ClientSocket(mServerSocket, socketDiscriptor, SocketHelper::getAddressStorage(context,wsi,user));

			mClientSockets.push_back(clientSocket);
			/*pollfds[count_pollfds].fd = (int)(long)user;
			pollfds[count_pollfds].events = (int)len;
			pollfds[count_pollfds++].revents = 0;*/
			break;
		}
	    case LWS_CALLBACK_DEL_POLL_FD:
	    {
	    	// Bestimmen welcher Socket gelöscht werden soll
	    	int socketDiscriptor = (int)(long)user;

	    	// FD Wieder freigeben

	    	for (ClientSocketListIterator iter = mClientSockets.begin();
	    			iter != mClientSockets.end();
	    			iter++)
	    	{
	    		ClientSocket* clientSocket = (*iter);
	    		if (clientSocket->get_sd() == socketDiscriptor)
	    		{
	    			mClientSockets.remove(clientSocket);
	    			break;
	    		}
	    	}
	    	break;
	    }
	    default:
	    	break;
	}

	return 0;
}

int WebRTC_trsp::callbackSIP(struct libwebsocket_context *context,
							 struct libwebsocket *wsi,
							 enum libwebsocket_callback_reasons reason,
							 void *user, void *in, size_t len)
{
	return 0;
}


