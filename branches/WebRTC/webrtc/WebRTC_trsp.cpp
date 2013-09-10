#include "WebRTC_trsp.h"


int callback_http(struct libwebsocket_context *context,
                         struct libwebsocket *wsi,
                         enum libwebsocket_callback_reasons reason,
                         void *user, void *in, size_t len)
{
	int n;
	char client_name[128];
	char client_ip[128];

	switch (reason)
	{

	case LWS_CALLBACK_ADD_POLL_FD:
		INFO("LWS_CALLBACK_ADD_POLL_FD");

		pollfds[count_pollfds].fd = (int)(long)user;
		pollfds[count_pollfds].events = (int)len;
		pollfds[count_pollfds++].revents = 0;

		libwebsockets_get_peer_addresses(context,wsi, (int)(long)user,client_name,
					     sizeof(client_name), client_ip, sizeof(client_ip));

		struct sockaddr_storage sa;
		if (inet_pton(AF_INET,client_ip,&(((struct sockaddr_in *)sa)->sin_addr)) == 0)
		{
			inet_pton(AF_INET6,client_ip,&(((struct sockaddr_in6 *)sa)->sin6_addr));
		}

		ClientSocket* client = new ClientSocket((ServerSocket)SServerSocket::instance()->get_ServerSocket(),pollfds[count_pollfds-1].fd,sa);
		SServerSocket::instance()->get_ServerSocket()->add_connection(client);
		break;
	case LWS_CALLBACK_DEL_POLL_FD:
		INFO("LWS_CALLBACK_DEL_POLL_FD");

		for (n = 0; n < count_pollfds; n++)
			if (pollfds[n].fd == (int)(long)user)
				while (n < count_pollfds) {
					pollfds[n] = pollfds[n + 1];
					n++;
				}
		count_pollfds--;
		break;
	case LWS_CALLBACK_SET_MODE_POLL_FD:
		INFO("LWS_CALLBACK_SET_MODE_POLL_FD");

		for (n = 0; n < count_pollfds; n++)
			if (pollfds[n].fd == (int)(long)user)
				pollfds[n].events |= (int)(long)len;
		break;
	case LWS_CALLBACK_CLEAR_MODE_POLL_FD:
		INFO("LWS_CALLBACK_CLEAR_MODE_POLL_FD");

		for (n = 0; n < count_pollfds; n++)
					if (pollfds[n].fd == (int)(long)user)
						pollfds[n].events &= ~(int)(long)len;

		break;
	default:
		INFO("reason : %u",(int)reason);
		break;
	}

    return 0;
}

WebRTC_trsp::WebRTC_trsp(ServerSocket* sock)
: transport(sock)
{

}

WebRTC_trsp::~WebRTC_trsp()
{

}

void WebRTC_trsp::initialize()
{


}

void WebRTC_trsp::run()
{
	int n;

	while(1)
	{
		n = poll(pollfds,count_pollfds,25);
		if (n)
		{
			for (n = 0; n < count_pollfds; n++)
							if (pollfds[n].revents)
								/*
								* returns immediately if the fd does not
								* match anything under libwebsockets
								* control
								*/
								libwebsocket_service_fd(((ServerSocket*)sock)->get_context(),
											  &pollfds[n]);
		}
	}

}

void WebRTC_trsp::on_stop()
{

}

