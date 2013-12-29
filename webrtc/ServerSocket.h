/*
 * ServerSocket.h
 *
 *      Authors: Arne Krawielitzki <arne.krawie@gmail.com>
 *		Engin Yilmaz <ey@esyi.de>
 */

#ifndef SERVERSOCKET_H
#define SERVERSOCKET_H

#include "../../core/sip/transport.h"

#include <map>
#include <deque>
#include <string>
using std::map;
using std::deque;
using std::string;

class ClientSocket;

class ServerSocket : public trsp_socket
{
private:

	typedef map<string, ClientSocket*> CONNECTION_MAP;
	CONNECTION_MAP mConnections;
	AmMutex mConnectionsMutex;

	typedef deque<ClientSocket*> CLIENT_SOCKET_QUEUE;
	CLIENT_SOCKET_QUEUE mClientSocketQueue;
	AmMutex mClientSocketQueueMutex;

	bool use_ssl;
	string* cert_filepath;
	string* privatkey_path;

	string* mInterfaceString;
public:
	ServerSocket(unsigned short if_num, unsigned short port, bool ssl, string* certpath, string* privatekeypath,string* sInterface);
	~ServerSocket();

    virtual int send(const sockaddr_storage* sa, const char* msg, const int msg_len);
    virtual int bind(const string& address, unsigned short port);
    virtual const char* get_transport() const;

    bool registerClient(ClientSocket* pClientSocket);
    bool unregisterClient(ClientSocket* pClientSocket);

    void queueClientSocket(ClientSocket* pClientSocket);

    bool hasToSend() { return mClientSocketQueue.size() > 0; };
    void triggerSend();
    /**
     *  Getter for the socket descriptor
     */
    int get_sd() const;

    string set_ip(string interfacestring);

    bool get_use_ssl(){return use_ssl;};
    string* get_cert_filepath(){return cert_filepath;};
    string* get_privatekey_path(){return privatkey_path;};

    string* get_InterfaceString(){return mInterfaceString;};
};

#endif
