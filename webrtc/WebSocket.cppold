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
 */

#include "WebSocket.h"
#include "AmConfig.h"
#include "AmUtils.h"
#include "AmPlugIn.h"
#include "AmUACAuth.h"

#include "sems.h"
#include "log.h"

#define MOD_NAME "websocket"

EXPORT_SESSION_FACTORY(WebSocketFactory,MOD_NAME);

string WebSocketFactory::AnnouncePath;
string WebSocketFactory::AnnounceFile;
bool   WebSocketFactory::Loop = false;
WebSocketServer* WebSocketFactory::mWebSocketServer;


WebSocketFactory::WebSocketFactory(const string& _app_name)
  : AmSessionFactory(_app_name)
{
	INFO("WebSocketFactory::WebSocketFactory\n");
}

int WebSocketFactory::onLoad()
{
	INFO("WebSocketFactory::onLoad\n");
  AmConfigReader cfg;
  //if(cfg.loadFile(AmConfig::ModConfigPath + string(MOD_NAME ".conf")))
    //return -1;

  // get application specific global parameters
  //configureModule(cfg);
  mWebSocketServer = WebSocketServer::instance();
  mWebSocketServer->start();
/*
  AnnouncePath = cfg.getParameter("announce_path",ANNOUNCE_PATH);
  if( !AnnouncePath.empty() 

		  AnnouncePath = cfg.getParameter("announce_path",ANNOUNCE_PATH);
		  if( !AnnouncePath.empty()

		  AnnouncePath = cfg.getParameter("announce_path",ANNOUNCE_PATH);
		  if( !AnnouncePath.empty()
		   s   && AnnouncePath[AnnouncePath.length()-1] != '/' )
    AnnouncePath += "/";

  AnnounceFile = cfg.getParameter("default_announce",ANNOUNCE_FILE);

  string announce_file = AnnouncePath + AnnounceFile;
  if(!file_exists(announce_file)){
    ERROR("default file for WebSocket module does not exist ('%s').\n",
	  announce_file.c_str());
    return -1;
  }

  Loop = cfg.getParameter("loop") == "true";
*/
  return 0;
}

string WebSocketFactory::getAnnounceFile(const AmSipRequest& req) {
  string announce_path = AnnouncePath;
  string announce_file = announce_path + req.domain 
    + "/" + req.user + ".wav";

  DBG("trying '%s'\n",announce_file.c_str());
  if(file_exists(announce_file))
    goto end;

  announce_file = announce_path + req.user + ".wav";
  DBG("trying '%s'\n",announce_file.c_str());
  if(file_exists(announce_file))
    goto end;

  announce_file = AnnouncePath + AnnounceFile;
    
 end:
  return announce_file;
}

AmSession* WebSocketFactory::onInvite(const AmSipRequest& req, const string& app_name,
					 const map<string,string>& app_params)
{
  return new WebSocketDialog(getAnnounceFile(req), NULL);
}

AmSession* WebSocketFactory::onInvite(const AmSipRequest& req, const string& app_name,
					 AmArg& session_params)
{
  UACAuthCred* cred = AmUACAuth::unpackCredentials(session_params);
  AmSession* s = new WebSocketDialog(getAnnounceFile(req), cred);
  
  if (NULL == cred) {
    WARN("discarding unknown session parameters.\n");
  } else {
    AmUACAuth::enable(s);
  }

  return s;
}

WebSocketDialog::WebSocketDialog(const string& filename,
				       UACAuthCred* credentials)
  : filename(filename), cred(credentials)
{
  // we can drop all received packets
  // this disables DTMF detection as well
  setReceiving(false);
}

WebSocketDialog::~WebSocketDialog()
{
}

void WebSocketDialog::onSessionStart() {
  DBG("WebSocketDialog::onSessionStart()...\n");

  if(wav_file.open(filename,AmAudioFile::Read)) {
    ERROR("Couldn't open file %s.\n", filename.c_str());
    throw string("WebSocketDialog::onSessionStart: Cannot open file\n");
  }

  if (WebSocketFactory::Loop)
    wav_file.loop.set(true);

  setOutput(&wav_file);

  AmSession::onSessionStart();
}

void WebSocketDialog::onBye(const AmSipRequest& req)
{
  DBG("onBye: stopSession\n");
  AmSession::onBye(req);
}


void WebSocketDialog::process(AmEvent* event)
{

  AmAudioEvent* audio_event = dynamic_cast<AmAudioEvent*>(event);
  if(audio_event && (audio_event->event_id == AmAudioEvent::cleared)){
    dlg->bye();
    setStopped();
    return;
  }

  AmSession::process(event);
}

inline UACAuthCred* WebSocketDialog::getCredentials() {
  return cred.get();
}
