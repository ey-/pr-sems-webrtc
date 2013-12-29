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
#include <ifaddrs.h>

ServerSocket::ServerSocket(unsigned short if_num,unsigned short port, bool ssl, string* certpath, string* privatekeypath, string* sInterface)
:trsp_socket(if_num,0)
{
    this->port = (const unsigned short) port;
    this->use_ssl = ssl;
    this->cert_filepath = certpath;
    this->privatkey_path = privatekeypath;
    this->mInterfaceString = sInterface;
}
ServerSocket::~ServerSocket()
{

}

/**
 * see http://man7.org/linux/man-pages/man3/getifaddrs.3.html
 */
string ServerSocket::set_ip(string interfacestring)
{
    struct ifaddrs *ifaddr, *ifa;
    int family, s;
    char* intfname;
    char host[NI_MAXHOST];


    if (getifaddrs(&ifaddr) == -1) {
        perror("getifaddrs");
        exit(EXIT_FAILURE);
        }
        /* Walk through linked list, maintaining head pointer so we
              can free list later */
    for (ifa = ifaddr; ifa != NULL; ifa = ifa->ifa_next) {
        if (ifa->ifa_addr == NULL)
        continue;

        family = ifa->ifa_addr->sa_family;
        intfname = ifa->ifa_name;
        /* Display interface name and family (including symbolic
                  form of the latter for the common families) */
                   printf("%s  address family: %d%s\n",
                       ifa->ifa_name, family,
                       (family == AF_PACKET) ? " (AF_PACKET)" :
                       (family == AF_INET) ?   " (AF_INET)" :
                       (family == AF_INET6) ?  " (AF_INET6)" : "");

        /* For an AF_INET* interface address, display the address */
        if ((strcmp(intfname,interfacestring.c_str()) == 0) && (family == AF_INET || family == AF_INET6)){
            s = getnameinfo(ifa->ifa_addr,
                           (family == AF_INET) ? sizeof(struct sockaddr_in) :
                                                 sizeof(struct sockaddr_in6),
                           host, NI_MAXHOST, NULL, 0, NI_NUMERICHOST);
            if (s != 0) {
                printf("getnameinfo() failed: %s\n", gai_strerror(s));
                exit(EXIT_FAILURE);
            }
            ip = host;
            DBG("ServerIP: <%s>\n", host);
            freeifaddrs(ifaddr);
            return host;
        }
    }
    ERROR("Interface %s given in Config not found",interfacestring.c_str());
    return "127.0.0.1";
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
