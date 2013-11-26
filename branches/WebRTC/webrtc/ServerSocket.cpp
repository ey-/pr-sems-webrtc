/*
 * ServerSocket.cpp
 *
 *      Authors: Arne Krawielitzki <arne.krawie@gmail.com>
 *		Engin Yilmaz <ey@esyi.de>
 */

#include "ServerSocket.h"
#include "ClientSocket.h"

#include "SocketHelper.h"

ServerSocket::ServerSocket(unsigned short if_num)
:trsp_socket(if_num,0)
{

}
ServerSocket::~ServerSocket()
{

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
	return "WS";
}

bool ServerSocket::registerClient(ClientSocket* pClientSocket)
{
	struct sockaddr_storage* sa = pClientSocket->getSocketAddress();
	string connId = SocketHelper::getConnectionIdByAddressStorage(sa);

	DBG("adding WebRTC connection from %s", connId.c_str());

	mConnectionsMutex.lock();

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

int ServerSocket::getClientSdByWSI(struct libwebsocket *wsi)
{
    for (CONNECTION_MAP::iterator iter = mConnections.begin();
			iter != mConnections.end();
			iter++)
	{
		ClientSocket* pClientSocket = (*iter).second;
        struct libwebsocket* connWsi = pClientSocket->getWSI();

		if (wsi == connWsi)
		{
		    DBG("ServerSocket getClientByWSI wsi==connWsi");
			// Message an Clientsocket weiterleiten
			return pClientSocket->get_sd();
		}
	}
}
