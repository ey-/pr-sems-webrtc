/*
 * Copyright (C) 2002-2003 Fhg Fokus
 *
 * This file is part of SEMS, a free SIP media server.
 *
 * SEMS is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * For a license to use the sems software under conditions
 * other than those described here, or to purchase support for this
 * software, please contact iptel.org by e-mail at the following addresses:
 *    info@iptel.org
 *
 * SEMS is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
 *
 *
 * WebRTC.cpp
 *
 *      Authors: Arne Krawielitzki <arne.krawie@gmail.com>
 *		Engin Yilmaz <ey@esyi.de>
 */


#ifndef _WebRTC_h_
#define _WebRTC_h_

#include "AmSession.h"
#include "WebRTC_trsp.h"

#define WEBRTC_MODULE_NAME "WebRTC"

/** \brief Factory for WebRTC sessions */
class CWebRTCFactory: public AmSessionFactory
{
public:
  CWebRTCFactory(const string& _app_name);
  virtual ~CWebRTCFactory();

  int onLoad();
  AmSession* onInvite(const AmSipRequest& req, const string& app_name,
		      const map<string,string>& app_params);

private:
  ServerSocket* mpServerSocket;
  WebRTC_trsp* mpWebRTCTransport;

};

/**\brief  WebSocket session logic implementation
class WebSocketDialog : public AmSession,
			   public CredentialHolder
{
  AmAudioFile wav_file;
  string filename;

  std::auto_ptr<UACAuthCred> cred;
public:
  WebSocketDialog(const string& filename,
		     UACAuthCred* credentials = NULL);
  ~WebSocketDialog();

  void onSessionStart();
  void onBye(const AmSipRequest& req);
  void onDtmf(int event, int duration_msec) {}

  void process(AmEvent* event);

  UACAuthCred* getCredentials();
};
*/
#endif
// Local Variables:
// mode:C++
// End:
