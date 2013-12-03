/*
 * ServerSocket.cpp
 *
 *      Authors: Arne Krawielitzki <arne.krawie@gmail.com>
 *		Engin Yilmaz <ey@esyi.de>
 */

#include "ServerSocket.h"
#include "ClientSocket.h"

#include "SocketHelper.h"
#include "LibWebsocketAdapter.h"
#include <private-libwebsockets.h>
#include "../../core/sip/ip_util.h"

ServerSocket::ServerSocket(unsigned short if_num,unsigned short port)
:trsp_socket(if_num,0)
{
    this->port = (const unsigned short) port;
}
ServerSocket::~ServerSocket()
{

}

int ServerSocket::set_ip()
{
    sockaddr sa;
    socklen_t* sizeofsock;
    DBG("ServerSock is: %i",get_sd());
    getsockname(get_sd(),&sa,sizeofsock);
    struct sockaddr_in *sa_ipv4 = (struct sockaddr_in *) &sa;
    char host[NI_MAXHOST] = "";
    inet_ntop(AF_INET, &(sa_ipv4->sin_addr.s_addr), host, INET_ADDRSTRLEN);
    DBG("ServerIP is: %s",host);
    ip = "192.168.80.128";//host;
	return 1;
}

int ServerSocket::send(const sockaddr_storage* sa, const char* msg, const int msg_len)
{
	string target = SocketHelper::getConnectionIdByAddressStorage((sockaddr_storage*)sa);
	DBG("ServerSocket Send to %s",target.c_str());
	for (CONNECTION_MAP::iterator iter = mConnections.begin();
			iter != mConnections.end();
			iter++)
	{
		ClientSocket* pClientSocket = (*iter).second;
		struct sockaddr_storage* connSA = pClientSocket->getSocketAddress();
		string connId = SocketHelper::getConnectionIdByAddressStorage(connSA);
		DBG("ServerSocket Connections connId: %s",connId.c_str());
		if (target == connId)
		{
		    DBG("ServerSocket Send to target==connId");
			// Message an Clientsocket weiterleiten
			pClientSocket->send(sa, msg, msg_len);

			// wir brauchen nicht weiter nach dem Socket suchen
			return 0;
		}
	}
	// Es wurde keine passender Socket gefunden
	// TODO Irgendeinen Fehler zurückgeben
	return -1;
}
int ServerSocket::bind(const string& address, unsigned short port)
{
	return 0;
}

const char* ServerSocket::get_transport() const
{
	return "ws";
}

bool ServerSocket::registerClient(ClientSocket* pClientSocket)
{
	struct sockaddr_storage* sa = pClientSocket->getSocketAddress();
	string connId = SocketHelper::getConnectionIdByAddressStorage(sa);

	DBG("adding WebRTC connection from %s", connId.c_str());

	mConnectionsMutex.lock();
DBG("connectionmutex locked");
	CONNECTION_MAP::iterator connectionIter = mConnections.find(connId);
	// Prüfen ob die Verbindung bereits vorhanden ist
	if (connectionIter != mConnections.end())
	{
		// Referenz auf den alten Socket freigeben
		dec_ref(connectionIter->second);
		// den neuen Socket übernehmen
		connectionIter->second = pClientSocket;
	}
	// Verbindung ist nocht nicht enthalten
	else
	{
		// neuen Socket hinzufügen
		mConnections[connId] = pClientSocket;

	}

	inc_ref(pClientSocket);

	mConnectionsMutex.unlock();
	DBG("connectionmutex unlocked");
	return true;
}

bool ServerSocket::unregisterClient(ClientSocket* pClientSocket)
{
	struct sockaddr_storage* sa = pClientSocket->getSocketAddress();
	string connId = SocketHelper::getConnectionIdByAddressStorage(sa);

	DBG("removing WebRTC connection from %s", connId.c_str());

	mConnectionsMutex.lock();

	CONNECTION_MAP::iterator sock_it = mConnections.find(connId);
	if(sock_it != mConnections.end())
	{
		dec_ref(sock_it->second);
		mConnections.erase(sock_it);
	}

	mConnectionsMutex.unlock();

	return false;
}

void ServerSocket::queueClientSocket(ClientSocket* pClientSocket)
{
    DBG("queueClientSocket ");
	mClientSocketQueueMutex.lock();
	mClientSocketQueue.push_back(pClientSocket);
	mClientSocketQueueMutex.unlock();
}

void ServerSocket::triggerSend()
{
	// Das richtige Senden in den Clientsockts anstoßen
	mClientSocketQueueMutex.lock();
	while(!mClientSocketQueue.empty())
	{
		mClientSocketQueue.front()->realSend();
		mClientSocketQueue.pop_front();
	}
	mClientSocketQueueMutex.unlock();
}

int ServerSocket::get_sd() const
{
   libwebsocket_context* context = LibWebsocketAdapter::getInstance()->getContext();
    if (context != NULL)
    {
        return context->fds->fd;
    }
    return -1;
}
