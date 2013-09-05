
#include "WebRTC.h";

CWebRTCFactory::CWebRTCFactory(const string& _app_name)
:AmSessionFactory(_app_name)
{

}

int CWebRTCFactory::onLoad()
{

	// TODO serversocket beim trsp_layer registieren
return 0;
}

AmSession* CWebRTCFactory::onInvite(const AmSipRequest& req,
		const string& app_name, const map<string, string>& app_params)
{
return NULL;
}
