/*
 * WebRTC.cpp
 *
 *      Authors: Arne Krawielitzki <arne.krawie@gmail.com>
 *		Engin Yilmaz <ey@esyi.de>
 */

#include "WebRTC.h"
#include "../../core/AmConfig.h"

EXPORT_SESSION_FACTORY(CWebRTCFactory, WEBRTC_MODULE_NAME)

CWebRTCFactory::CWebRTCFactory(const string& _app_name)
:AmSessionFactory(_app_name)
{
	mpServerSocket = NULL;
	mpWebRTCTransport = NULL;
}

CWebRTCFactory::~CWebRTCFactory()
{
	// Clean up Memory
	if (mpServerSocket != NULL)
	{
		delete mpServerSocket;
	}
	if (mpWebRTCTransport != NULL)
	{
		delete mpWebRTCTransport;
	}
}

int CWebRTCFactory::onLoad()
{
    unsigned short port = 7688;

	INFO("WebRTC\tTEST\n");
	int interfaces = AmConfig::SIP_Ifs.size();
	INFO("WebRTC\tInterfaces=%u", interfaces);
	//Create SIP_Interface
	AmConfig::SIP_interface intf;
	intf.LocalPort = port;
	intf.RtpInterface = 0;
	intf.SigSockOpts = 0;
	intf.LocalIP="192.168.80.128";
	intf.name = "WS";
	AmConfig::SIP_Ifs.push_back(intf);
	INFO("WebRTC\tInterfaces=%u", interfaces);
	//webRTCInterface

	// Instantiate Instances of the server socket and the WebRTC Transport,
	// which processes this server socket.

	// To create a Serversocket it needs a independed Interface Index, which
	// isn't used yet. So we take the total number of SIP-Interfaces and add 1
	mpServerSocket = new ServerSocket(interfaces,port);
	INFO("WebRTC\tServerSocket created\n");

	mpWebRTCTransport = new WebRTC_trsp(mpServerSocket);
	inc_ref(mpServerSocket);
INFO("WebRTC\tServerSocket set IP\n");
	//let the ServerSocket get the ip
	mpServerSocket->set_ip();

	INFO("WebRTC\tWebRTC Transport created\n");
	trans_layer::instance()->register_transport(mpServerSocket);
	inc_ref(mpServerSocket);
	INFO("WebRTC\tServerSocket registered\n");
	mpWebRTCTransport->start();
	INFO("WebRTC\tWebRTC Transport started\n");

	return 0;
}

AmSession* CWebRTCFactory::onInvite(const AmSipRequest& req,
		const string& app_name, const map<string, string>& app_params)
{
	return NULL;
}
