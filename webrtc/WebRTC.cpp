#include "WebRTC.h"

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
	INFO("WebRTC\tTEST\n");
	int interfaces = AmConfig::SIP_Ifs.size() +1;

	INFO("WebRTC\tInterfaces=%u", interfaces);

	// Instantiate Instances of the server socket and the WebRTC Transport,
	// which processes this server socket.

	// To create a Serversocket it needs a independed Interface Index, which
	// isn't used yet. So we take the total number of SIP-Interfaces and add 1
	mpServerSocket = new ServerSocket(interfaces +1);
	INFO("WebRTC\tServerSocket created\n");

	mpWebRTCTransport = new WebRTC_trsp(mpServerSocket);
	INFO("WebRTC\tWebRTC Transport created\n");

	mpWebRTCTransport->start();
	INFO("WebRTC\tWebRTC Transport started\n");

	// TODO serversocket beim trsp_layer registieren
	return 0;
}

AmSession* CWebRTCFactory::onInvite(const AmSipRequest& req,
		const string& app_name, const map<string, string>& app_params)
{
	return NULL;
}
