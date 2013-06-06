/*
 * main.cpp
 *
 *  Created on: Feb 13, 2013
 *      Author: sems
 */

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <getopt.h>
#include <string.h>
#include <sys/time.h>
#include <assert.h>
#include <iostream>
#include <fstream>
#include <libwebsockets.h>
using namespace std;

#include <signal.h>
#include "WebSocketServer.h"
#include "log.h"

int callback_sip (struct libwebsocket_context *context,
		struct libwebsocket *wsi,
		enum libwebsocket_callback_reasons reason,
				       void *user, void *in, size_t len)
{
	struct per_session_data__echo *pss = (struct per_session_data__echo *)user;

	switch (reason) {
	case LWS_CALLBACK_ESTABLISHED:
		printf("connection established\n");
		break;
	case LWS_CALLBACK_RECEIVE:{
		  ofstream myfile;
		  myfile.open ("example.txt");
		  myfile << "Writing this to a file.\n" << endl;
		  myfile << (char *)in << endl;

		  printf("receivengin: %s", (char *) in);
		const char* header = "SIP/2.0 200 OK\r\n";
		int header_length = strlen(header);
		//strtok((char*)in, "\r");

		in = (void*)(strchr((char*)in, '\r') +2);
		len = strlen((char*)in);

		//printf("%s" , splittet_in);
		int length= header_length+len;
        unsigned char *buf = (unsigned char*) malloc(LWS_SEND_BUFFER_PRE_PADDING + length +
                                                     LWS_SEND_BUFFER_POST_PADDING);
        printf("received datalength: %i", (int) header_length);
        printf("received: %s", (char *) in);
        int i;

        for (i=0 ; i<header_length; i++) {
        	buf[LWS_SEND_BUFFER_PRE_PADDING + i ] = ((char *) header)[i];
        }
        for (i=header_length; i <length; i++) {
            buf[LWS_SEND_BUFFER_PRE_PADDING + i ] = ((char *) in)[i+header_length];
        }
        myfile << (char *)buf << endl;

        libwebsocket_write(wsi, &buf[LWS_SEND_BUFFER_PRE_PADDING],length, LWS_WRITE_BINARY);
        free(buf);
        myfile.close();
		break;
		}
	}
	return 0;
}

int callback_http(struct libwebsocket_context *context,
                         struct libwebsocket *wsi,
                         enum libwebsocket_callback_reasons reason,
                         void *user, void *in, size_t len)
{
    return 0;
}

/*
int main(void) {
    // server url will be http://localhost:7681
    int port = 7681;
    const char *interface = NULL;

    // we're not using ssl
    const char *cert_path = NULL;
    const char *key_path = NULL;
    // no special options
    int opts = 0;
    struct lws_context_creation_info info;
    info.extensions=libwebsocket_get_internal_extensions();
    info.port=port;
    info.protocols =protocols;
    info.iface= interface;
    info.ssl_cert_filepath=cert_path;
    info.ssl_private_key_filepath=key_path;
    info.options=opts;
    info.gid=-1;
    info.uid=-1;
    // create libwebsocket context representing this server
    context = libwebsocket_create_context(&info);

    if (context == NULL) {
        fprintf(stderr, "libwebsocket init failed\n");
        return -1;
    }

    printf("starting server...\n");

    // infinite loop, to end this server send SIGTERM. (CTRL+C)
    while (1) {
        libwebsocket_service(context, 50);
        // libwebsocket_service will process all waiting events with their
        // callback functions and then wait 50 ms.
        // (this is a single threaded webserver and this will keep our server
        // from generating load while there are not requests to process)
    }

    libwebsocket_context_destroy(context);

    return 0;
}

/******************************************************************************
 * ****************************************************************************
 * ****************************************************************************
 * ****************************************************************************
 */

CWebSocketServer::CWebSocketServer()
:AmThread()
{
	mbFailure = false;
	mContext = 0;
}

CWebSocketServer::~CWebSocketServer()
{
	if (mContext != 0)
	{
		libwebsocket_context_destroy(mContext);
		mContext = 0;
	}
}

/** Start it ! */
void CWebSocketServer::start()
{
	// server url will be http://localhost:7681
	int port = 7681;
	const char *interface = NULL;

	// we're not using ssl
	const char *cert_path = NULL;
	const char *key_path = NULL;
	// no special options
	int opts = 0;
	struct lws_context_creation_info info;
	info.extensions=libwebsocket_get_internal_extensions();
	info.port=port;
	info.protocols =protocols;
	info.iface= interface;
	info.ssl_cert_filepath=cert_path;
	info.ssl_private_key_filepath=key_path;
	info.options=opts;
	info.gid=-1;
	info.uid=-1;
	// create libwebsocket context representing this server
	mContext = libwebsocket_create_context(&info);

	if (mContext == NULL) {
		fprintf(stderr, "libwebsocket init failed\n");
		mbFailure = true;
	}

	INFO("starting server...\n");

	AmThread::start();
}

/** Stop it ! */
void CWebSocketServer::stop()
{
	//libwebsocket_context_destroy(mContext);
	mContext = 0;

	AmThread::stop();
}

void CWebSocketServer::run()
{
	// infinite loop, to end this server send SIGTERM. (CTRL+C)
	while (1)
	{
		libwebsocket_service(mContext, 50);
		// libwebsocket_service will process all waiting events with their
		// callback functions and then wait 50 ms.
		// (this is a single threaded webserver and this will keep our server
		// from generating load while there are not requests to process)
	}
}

void CWebSocketServer::on_stop()
{
	ERROR("not yet supported!\n");
}
