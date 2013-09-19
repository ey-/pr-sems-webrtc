
#include "WebRTC.h";


CWebRTCFactory::CWebRTCFactory(const string& _app_name)
:AmSessionFactory(_app_name)
{
	webrtc_trsp=NULL;
}

int CWebRTCFactory::onLoad()
{
	webrtc_trsp = new WebRTC_trsp(SServerSocket::instance()->get_ServerSocket());

	webrtc_trsp->start();
	trans_layer::instance()->register_transport(SServerSocket::instance()->get_ServerSocket());
return 0;
}

AmSession* CWebRTCFactory::onInvite(const AmSipRequest& req,
		const string& app_name, const map<string, string>& app_params)
{
return NULL;
}
