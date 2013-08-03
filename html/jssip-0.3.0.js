(function(window){var JsSIP=(function(){"use strict";var JsSIP={};Object.defineProperties(JsSIP,{version:{get:function(){return '0.3.0';}},name:{get:function(){return 'JsSIP';}}});return JsSIP;}());(function(JsSIP){var
EventEmitter,Event,LOG_PREFIX=JsSIP.name+' | '+'EVENT EMITTER'+' | ';EventEmitter=function(){};EventEmitter.prototype={initEvents:function(events){var i=events.length;this.events={};this.onceNotFired=[];this.maxListeners=10;this.events.newListener=function(event){console.log(LOG_PREFIX+'new listener added to event '+event);};while(i--){console.log(LOG_PREFIX+'adding event '+events[i]);this.events[events[i]]=[];}},checkEvent:function(event){if(!this.events[event]){console.error(LOG_PREFIX+'no event named '+event);return false;}else{return true;}},addListener:function(event,listener){if(!this.checkEvent(event)){return;}
if(this.events[event].length>=this.maxListeners){console.warn(LOG_PREFIX+'max listeners exceeded for event '+event);}
this.events[event].push(listener);this.events.newListener.call(null,event);},on:function(event,listener){this.addListener(event,listener);},once:function(event,listener){this.events[event].unshift(listener);this.onceNotFired.push(event);},removeListener:function(event,listener){if(!this.checkEvent(event)){return;}
var array=this.events[event],i=0,length=array.length;while(i<length){if(array[i]&&array[i].toString()===listener.toString()){array.splice(i,1);}else{i++;}}},removeAllListener:function(event){if(!this.checkEvent(event)){return;}
this.events[event]=[];},setMaxListeners:function(listeners){if(Number(listeners)){this.maxListeners=listeners;}},listeners:function(event){return this.events[event];},emit:function(event,sender,data){var listeners,length,idx=0;if(!this.checkEvent(event)){return;}
console.log(LOG_PREFIX+'emitting event '+event);listeners=this.events[event];length=listeners.length;var e=new JsSIP.Event(event,sender,data);if(e){for(idx;idx<length;idx++){listeners[idx].apply(null,[e]);}}else{for(idx;idx<length;idx++){listeners[idx].call();}}
idx=this.onceNotFired.indexOf(event);if(idx!==-1){this.onceNotFired.splice(idx,1);this.events[event].shift();}},newListener:function(listener){this.events.newListener=listener;}};Event=function(type,sender,data){this.type=type;this.sender=sender;this.data=data;};JsSIP.EventEmitter=EventEmitter;JsSIP.Event=Event;}(JsSIP));JsSIP.C={USER_AGENT:JsSIP.name+' '+JsSIP.version,SIP:'sip',INVALID_TARGET_URI:'sip:invalid@invalid',causes:{CONNECTION_ERROR:'Connection Error',REQUEST_TIMEOUT:'Request Timeout',SIP_FAILURE_CODE:'SIP Failure Code',INVALID_TARGET:'Invalid Target',INTERNAL_ERROR:'Internal Error',BUSY:'Busy',REJECTED:'Rejected',REDIRECTED:'Redirected',UNAVAILABLE:'Unavailable',NOT_FOUND:'Not Found',ADDRESS_INCOMPLETE:'Address Incomplete',INCOMPATIBLE_SDP:'Incompatible SDP',AUTHENTICATION_ERROR:'Authentication Error',DIALOG_ERROR:'Dialog Error',WEBRTC_NOT_SUPPORTED:'WebRTC Not Supported',WEBRTC_ERROR:'WebRTC Error',CANCELED:'Canceled',NO_ANSWER:'No Answer',EXPIRES:'Expires',NO_ACK:'No ACK',USER_DENIED_MEDIA_ACCESS:'User Denied Media Access',BAD_MEDIA_DESCRIPTION:'Bad Media Description',RTP_TIMEOUT:'RTP Timeout'},SIP_ERROR_CAUSES:{REDIRECTED:[300,301,302,305,380],BUSY:[486,600],REJECTED:[403,603],NOT_FOUND:[404,604],UNAVAILABLE:[480,410,408,430],ADDRESS_INCOMPLETE:[484],INCOMPATIBLE_SDP:[488,606],AUTHENTICATION_ERROR:[401,407]},ACK:'ACK',BYE:'BYE',CANCEL:'CANCEL',INFO:'INFO',INVITE:'INVITE',MESSAGE:'MESSAGE',NOTIFY:'NOTIFY',OPTIONS:'OPTIONS',REGISTER:'REGISTER',UPDATE:'UPDATE',SUBSCRIBE:'SUBSCRIBE',REASON_PHRASE:{100:'Trying',180:'Ringing',181:'Call Is Being Forwarded',182:'Queued',183:'Session Progress',199:'Early Dialog Terminated',200:'OK',202:'Accepted',204:'No Notification',300:'Multiple Choices',301:'Moved Permanently',302:'Moved Temporarily',305:'Use Proxy',380:'Alternative Service',400:'Bad Request',401:'Unauthorized',402:'Payment Required',403:'Forbidden',404:'Not Found',405:'Method Not Allowed',406:'Not Acceptable',407:'Proxy Authentication Required',408:'Request Timeout',410:'Gone',412:'Conditional Request Failed',413:'Request Entity Too Large',414:'Request-URI Too Long',415:'Unsupported Media Type',416:'Unsupported URI Scheme',417:'Unknown Resource-Priority',420:'Bad Extension',421:'Extension Required',422:'Session Interval Too Small',423:'Interval Too Brief',428:'Use Identity Header',429:'Provide Referrer Identity',430:'Flow Failed',433:'Anonymity Disallowed',436:'Bad Identity-Info',437:'Unsupported Certificate',438:'Invalid Identity Header',439:'First Hop Lacks Outbound Support',440:'Max-Breadth Exceeded',469:'Bad Info Package',470:'Consent Needed',478:'Unresolvable Destination',480:'Temporarily Unavailable',481:'Call/Transaction Does Not Exist',482:'Loop Detected',483:'Too Many Hops',484:'Address Incomplete',485:'Ambiguous',486:'Busy Here',487:'Request Terminated',488:'Not Acceptable Here',489:'Bad Event',491:'Request Pending',493:'Undecipherable',494:'Security Agreement Required',500:'Server Internal Error',501:'Not Implemented',502:'Bad Gateway',503:'Service Unavailable',504:'Server Time-out',505:'Version Not Supported',513:'Message Too Large',580:'Precondition Failure',600:'Busy Everywhere',603:'Decline',604:'Does Not Exist Anywhere',606:'Not Acceptable'}};(function(JsSIP){var Exceptions;Exceptions={ConfigurationError:(function(){var exception=function(parameter,value){this.code=1;this.name='CONFIGURATION_ERROR';this.parameter=parameter;this.value=value;this.message=(!this.value)?'Missing parameter: '+this.parameter:'Invalid value '+window.JSON.stringify(this.value)+' for parameter "'+this.parameter+'"';};exception.prototype=new Error();return exception;}()),InvalidTargetError:(function(){var exception=function(target){this.code=2;this.name='INVALID_TARGET_ERROR';this.target=target;this.message='Invalid target: '+this.target;};exception.prototype=new Error();return exception;}()),InvalidStateError:(function(){var exception=function(status){this.code=3;this.name='INVALID_STATE_ERROR';this.status=status;};exception.prototype=new Error();return exception;}())};JsSIP.Exceptions=Exceptions;}(JsSIP));(function(JsSIP){var Timers,T1=500,T2=4000,T4=5000;Timers={T1:T1,T2:T2,T4:T4,TIMER_B:64*T1,TIMER_D:0*T1,TIMER_F:64*T1,TIMER_H:64*T1,TIMER_I:0*T1,TIMER_J:0*T1,TIMER_K:0*T4,TIMER_L:64*T1,TIMER_M:64*T1};JsSIP.Timers=Timers;}(JsSIP));(function(JsSIP){var Transport,LOG_PREFIX=JsSIP.name+' | '+'TRANSPORT'+' | ',C={STATUS_READY:0,STATUS_DISCONNECTED:1,STATUS_ERROR:2};Transport=function(ua,server){this.ua=ua;this.ws=null;this.server=server;this.reconnection_attempts=0;this.closed=false;this.connected=false;this.reconnectTimer=null;this.lastTransportError={};this.ua.transport=this;this.connect();};Transport.prototype={send:function(msg){var message=msg.toString();if(this.ws&&this.ws.readyState===WebSocket.OPEN){if(this.ua.configuration.trace_sip===true){console.log(LOG_PREFIX+'sending WebSocket message:\n\n'+message+'\n');}
this.ws.send(message);return true;}else{console.warn(LOG_PREFIX+'unable to send message, WebSocket is not open');return false;}},disconnect:function(){if(this.ws){this.closed=true;console.log(LOG_PREFIX+'closing WebSocket '+this.server.ws_uri);this.ws.close();}},connect:function(){var transport=this;if(this.ws&&(this.ws.readyState===WebSocket.OPEN||this.ws.readyState===WebSocket.CONNECTING)){console.log(LOG_PREFIX+'WebSocket '+this.server.ws_uri+' is already connected');return false;}
if(this.ws){this.ws.close();}
console.log(LOG_PREFIX+'connecting to WebSocket '+this.server.ws_uri);try{this.ws=new WebSocket(this.server.ws_uri,'sip');}catch(e){console.warn(LOG_PREFIX+'error connecting to WebSocket '+this.server.ws_uri+': '+e);}
this.ws.binaryType='arraybuffer';this.ws.onopen=function(){transport.onOpen();};this.ws.onclose=function(e){transport.onClose(e);};this.ws.onmessage=function(e){transport.onMessage(e);};this.ws.onerror=function(e){transport.onError(e);};},onOpen:function(){this.connected=true;console.log(LOG_PREFIX+'WebSocket '+this.server.ws_uri+' connected');window.clearTimeout(this.reconnectTimer);this.closed=false;this.ua.onTransportConnected(this);},onClose:function(e){var connected_before=this.connected;this.connected=false;this.lastTransportError.code=e.code;this.lastTransportError.reason=e.reason;console.warn(LOG_PREFIX+'WebSocket disconnected (code: '+e.code+(e.reason?'| reason: '+e.reason:'')+')');if(e.wasClean===false){console.warn(LOG_PREFIX+'WebSocket abrupt disconnection');}
if(connected_before===true){this.ua.onTransportClosed(this);if(!this.closed){ this.reconnection_attempts=0;this.reConnect();}else{this.ua.emit('disconnected',this.ua,{transport:this,code:this.lastTransportError.code,reason:this.lastTransportError.reason});}}else{this.ua.onTransportError(this);}},onMessage:function(e){var message,transaction,data=e.data;if(data==='\r\n'){if(this.ua.configuration.trace_sip===true){console.log(LOG_PREFIX+'received WebSocket message with CRLF Keep Alive response');}
return;}
else if(typeof data!=='string'){try{data=String.fromCharCode.apply(null,new Uint8Array(data));}catch(evt){console.warn(LOG_PREFIX+'received WebSocket binary message failed to be converted into string, message discarded');return;}
if(this.ua.configuration.trace_sip===true){console.log(LOG_PREFIX+'received WebSocket binary message:\n\n'+data+'\n');}}
else{if(this.ua.configuration.trace_sip===true){console.log(LOG_PREFIX+'received WebSocket text message:\n\n'+data+'\n');}}
message=JsSIP.Parser.parseMessage(data);if(this.ua.status===JsSIP.UA.C.STATUS_USER_CLOSED&&message instanceof JsSIP.IncomingRequest){return;}
if(message&&JsSIP.sanityCheck(message,this.ua,this)){if(message instanceof JsSIP.IncomingRequest){message.transport=this;this.ua.receiveRequest(message);}else if(message instanceof JsSIP.IncomingResponse){/**/
switch(message.method){case JsSIP.C.INVITE:transaction=this.ua.transactions.ict[message.via_branch];if(transaction){transaction.receiveResponse(message);}
break;case JsSIP.C.ACK:break;default:transaction=this.ua.transactions.nict[message.via_branch];if(transaction){transaction.receiveResponse(message);}
break;}}}},onError:function(e){console.warn(LOG_PREFIX+'WebSocket connection error: '+e);},reConnect:function(){var transport=this;this.reconnection_attempts+=1;if(this.reconnection_attempts>this.ua.configuration.ws_server_max_reconnection){console.warn(LOG_PREFIX+'maximum reconnection attempts for WebSocket '+this.server.ws_uri);this.ua.onTransportError(this);}else{console.log(LOG_PREFIX+'trying to reconnect to WebSocket '+this.server.ws_uri+' (reconnection attempt '+this.reconnection_attempts+')');this.reconnectTimer=window.setTimeout(function(){transport.connect();},this.ua.configuration.ws_server_reconnection_timeout*1000);}}};Transport.C=C;JsSIP.Transport=Transport;}(JsSIP));(function(JsSIP){var Parser,LOG_PREFIX=JsSIP.name+' | '+'PARSER'+' | ';function getHeader(data,headerStart){var
start=headerStart,end=0,partialEnd=0;if(data.substring(start,start+2).match(/(^\r\n)/)){return-2;}
while(end===0){partialEnd=data.indexOf('\r\n',start);if(partialEnd===-1){return partialEnd;}
if(!data.substring(partialEnd+2,partialEnd+4).match(/(^\r\n)/)&&data.charAt(partialEnd+2).match(/(^\s+)/)){start=partialEnd+2;}else{end=partialEnd;}}
return end;}
function parseHeader(message,data,headerStart,headerEnd){var header,idx,parsed,hcolonIndex=data.indexOf(':',headerStart),headerName=data.substring(headerStart,hcolonIndex).trim(),headerValue=data.substring(hcolonIndex+1,headerEnd).trim();switch(headerName.toLowerCase()){case 'via':case 'v':message.addHeader('via',headerValue);if(message.countHeader('via')===1){parsed=message.parseHeader('Via');if(parsed){message.via=parsed;message.via_branch=parsed.branch;}}else{parsed=0;}
break;case 'from':case 'f':message.setHeader('from',headerValue);parsed=message.parseHeader('from');if(parsed){message.from=parsed;message.from_tag=parsed.getParam('tag');}
break;case 'to':case 't':message.setHeader('to',headerValue);parsed=message.parseHeader('to');if(parsed){message.to=parsed;message.to_tag=parsed.getParam('tag');}
break;case 'record-route':parsed=JsSIP.Grammar.parse(headerValue,'Record_Route');if(parsed===-1){parsed=undefined;}
for(idx in parsed){header=parsed[idx];message.addHeader('record-route',headerValue.substring(header.possition,header.offset));message.headers['Record-Route'][message.countHeader('record-route')-1].parsed=header.parsed;}
break;case 'call-id':case 'i':message.setHeader('call-id',headerValue);parsed=message.parseHeader('call-id');if(parsed){message.call_id=headerValue;}
break;case 'contact':case 'm':parsed=JsSIP.Grammar.parse(headerValue,'Contact');if(parsed===-1){parsed=undefined;}
for(idx in parsed){header=parsed[idx];message.addHeader('contact',headerValue.substring(header.possition,header.offset));message.headers['Contact'][message.countHeader('contact')-1].parsed=header.parsed;}
break;case 'content-length':case 'l':message.setHeader('content-length',headerValue);parsed=message.parseHeader('content-length');break;case 'content-type':case 'c':message.setHeader('content-type',headerValue);parsed=message.parseHeader('content-type');break;case 'cseq':message.setHeader('cseq',headerValue);parsed=message.parseHeader('cseq');if(parsed){message.cseq=parsed.value;}
if(message instanceof JsSIP.IncomingResponse){message.method=parsed.method;}
break;case 'max-forwards':message.setHeader('max-forwards',headerValue);parsed=message.parseHeader('max-forwards');break;case 'www-authenticate':message.setHeader('www-authenticate',headerValue);parsed=message.parseHeader('www-authenticate');break;case 'proxy-authenticate':message.setHeader('proxy-authenticate',headerValue);parsed=message.parseHeader('proxy-authenticate');break;default:message.setHeader(headerName,headerValue);parsed=0;}
if(parsed===undefined){return false;}else{return true;}}
Parser={};Parser.parseMessage=function(data){var message,firstLine,contentLength,bodyStart,parsed,headerStart=0,headerEnd=data.indexOf('\r\n');if(headerEnd===-1){console.warn(LOG_PREFIX+'no CRLF found, not a SIP message, discarded');return;}
firstLine=data.substring(0,headerEnd);parsed=JsSIP.Grammar.parse(firstLine,'Request_Response');if(parsed ===-1){console.warn(LOG_PREFIX+'error parsing first line of SIP message: "'+firstLine+'"');return;}else if(!parsed.status_code){message=new JsSIP.IncomingRequest();message.method=parsed.method;message.ruri=parsed.uri;}else{message=new JsSIP.IncomingResponse();message.status_code=parsed.status_code;message.reason_phrase=parsed.reason_phrase;}
message.data=data;headerStart=headerEnd+2;while(true){headerEnd=getHeader(data,headerStart);if(headerEnd===-2){bodyStart=headerStart+2;break;}
else if(headerEnd===-1){return;}
parsed=parseHeader(message,data,headerStart,headerEnd);if(!parsed){return;}
headerStart=headerEnd+2;}
if(message.hasHeader('content-length')){contentLength=message.getHeader('content-length');message.body=data.substr(bodyStart,contentLength);}else{message.body=data.substring(bodyStart);}
return message;};JsSIP.Parser=Parser;}(JsSIP));(function(JsSIP){var
OutgoingRequest,IncomingMessage,IncomingRequest,IncomingResponse,LOG_PREFIX=JsSIP.name+' | '+'SIP MESSAGE'+' | ';/**/
OutgoingRequest=function(method,ruri,ua,params,extraHeaders,body){var
to,from,call_id,cseq;params=params||{};if(!method||!ruri||!ua){return null;}
this.headers={};this.method=method;this.ruri=ruri;this.body=body;this.extraHeaders=extraHeaders||[];if(params.route_set){this.setHeader('route',params.route_set);}else if(ua.configuration.use_preloaded_route){this.setHeader('route',ua.transport.server.sip_uri);}
this.setHeader('via','');this.setHeader('max-forwards',JsSIP.UA.C.MAX_FORWARDS);to=(params.to_display_name||params.to_display_name===0)?'"'+params.to_display_name+'" ':'';to+='<'+(params.to_uri||ruri)+'>';to+=params.to_tag?';tag='+params.to_tag:'';this.to=new JsSIP.NameAddrHeader.parse(to);this.setHeader('to',to);if(params.from_display_name||params.from_display_name===0){from='"'+params.from_display_name+'" ';}else if(ua.configuration.display_name){from='"'+ua.configuration.display_name+'" ';}else{from='';}
from+='<'+(params.from_uri||ua.configuration.uri)+'>;tag=';from+=params.from_tag||JsSIP.Utils.newTag();this.from=new JsSIP.NameAddrHeader.parse(from);this.setHeader('from',from);call_id=params.call_id||(ua.configuration.jssip_id+JsSIP.Utils.createRandomToken(15));this.call_id=call_id;this.setHeader('call-id',call_id);cseq=params.cseq||Math.floor(Math.random()*10000);this.cseq=cseq;this.setHeader('cseq',cseq+' '+method);};OutgoingRequest.prototype={/**/
setHeader:function(name,value){this.headers[JsSIP.Utils.headerize(name)]=(value instanceof Array)?value:[value];},toString:function(){var msg='',header,length,idx;msg+=this.method+' '+this.ruri+' SIP/2.0\r\n';for(header in this.headers){for(idx in this.headers[header]){msg+=header+': '+this.headers[header][idx]+'\r\n';}}
length=this.extraHeaders.length;for(idx=0;idx<length;idx++){msg+=this.extraHeaders[idx]+'\r\n';}
msg+='Supported: '+JsSIP.UA.C.SUPPORTED+'\r\n';msg+='User-Agent: '+JsSIP.C.USER_AGENT+'\r\n';if(this.body){length=JsSIP.Utils.str_utf8_length(this.body);msg+='Content-Length: '+length+'\r\n\r\n';msg+=this.body;}else{msg+='Content-Length: 0\r\n\r\n';}
return msg;}};IncomingMessage=function(){this.data=null;this.headers=null;this.method=null;this.via=null;this.via_branch=null;this.call_id =null;this.cseq=null;this.from=null;this.from_tag=null;this.to=null;this.to_tag=null;this.body=null;};IncomingMessage.prototype={addHeader:function(name,value){var header={raw:value};name=JsSIP.Utils.headerize(name);if(this.headers[name]){this.headers[name].push(header);}else{this.headers[name]=[header];}},countHeader:function(name){var header=this.headers[JsSIP.Utils.headerize(name)];if(header){return header.length;}else{return 0;}},getHeader:function(name,idx){var header=this.headers[JsSIP.Utils.headerize(name)];idx=idx||0;if(header){if(header[idx]){return header[idx].raw;}}else{return;}},getHeaderAll:function(name){var idx,header=this.headers[JsSIP.Utils.headerize(name)],result=[];if(!header){return[];}
for(idx in header){result.push(header[idx].raw);}
return result;},hasHeader:function(name){return(this.headers[JsSIP.Utils.headerize(name)])?true:false;},parseHeader:function(name,idx){var header,value,parsed;name=JsSIP.Utils.headerize(name);idx=idx||0;if(!this.headers[name]){console.log(LOG_PREFIX+'header "'+name+'" not present');return;}else if(idx>=this.headers[name].length){console.log(LOG_PREFIX+'not so many "'+name+'" headers present');return;}
header=this.headers[name][idx];value=header.raw;if(header.parsed){return header.parsed;}
parsed=JsSIP.Grammar.parse(value,name.replace(/-/g,'_'));if(parsed===-1){this.headers[name].splice(idx,1);console.warn(LOG_PREFIX+'error parsing "'+name+'" header field with value "'+value+'"');return;}else{header.parsed=parsed;return parsed;}},s:function(name,idx){return this.parseHeader(name,idx);},setHeader:function(name,value){var header={raw:value};this.headers[JsSIP.Utils.headerize(name)]=[header];},toString:function(){return this.data;}};/**/
IncomingRequest=function(){this.headers={};this.ruri=null;this.transport=null;this.server_transaction=null;};IncomingRequest.prototype=new IncomingMessage();IncomingRequest.prototype.reply=function(code,reason,extraHeaders,body,onSuccess,onFailure){var rr,vias,length,idx,response,to=this.getHeader('To'),r=0,v=0;code=code||null;reason=reason||null;if(!code||(code<100||code>699)){throw new TypeError('Invalid status_code: '+code);}else if(reason&&typeof reason!=='string'&&!(reason instanceof String)){throw new TypeError('Invalid reason_phrase: '+reason);}
reason=reason||JsSIP.C.REASON_PHRASE[code]||'';extraHeaders=extraHeaders||[];response='SIP/2.0 '+code+' '+reason+'\r\n';if(this.method===JsSIP.C.INVITE&&code>100&&code<=200){rr=this.countHeader('record-route');for(r;r<rr;r++){response+='Record-Route: '+this.getHeader('record-route',r)+'\r\n';}}
vias=this.countHeader('via');for(v;v<vias;v++){response+='Via: '+this.getHeader('via',v)+'\r\n';}
if(!this.to_tag){to+=';tag='+JsSIP.Utils.newTag();}else if(this.to_tag&&!this.s('to').hasParam('tag')){to+=';tag='+this.to_tag;}
response+='To: '+to+'\r\n';response+='From: '+this.getHeader('From')+'\r\n';response+='Call-ID: '+this.call_id+'\r\n';response+='CSeq: '+this.cseq+' '+this.method+'\r\n';length=extraHeaders.length;for(idx=0;idx<length;idx++){response+=extraHeaders[idx]+'\r\n';}
if(body){length=JsSIP.Utils.str_utf8_length(body);response+='Content-Type: application/sdp\r\n';response+='Content-Length: '+length+'\r\n\r\n';response+=body;}else{response+='Content-Length: '+0+'\r\n\r\n';}
this.server_transaction.receiveResponse(code,response,onSuccess,onFailure);};IncomingRequest.prototype.reply_sl=function(code,reason){var to,response,vias=this.countHeader('via');code=code||null;reason=reason||null;if(!code||(code<100||code>699)){throw new TypeError('Invalid status_code: '+code);}else if(reason&&typeof reason!=='string'&&!(reason instanceof String)){throw new TypeError('Invalid reason_phrase: '+reason);}
reason=reason||JsSIP.C.REASON_PHRASE[code]||'';response='SIP/2.0 '+code+' '+reason+'\r\n';for(var v=0;v<vias;v++){response+='Via: '+this.getHeader('via',v)+'\r\n';}
to=this.getHeader('To');if(!this.to_tag){to+=';tag='+JsSIP.Utils.newTag();}else if(this.to_tag&&!this.s('to').hasParam('tag')){to+=';tag='+this.to_tag;}
response+='To: '+to+'\r\n';response+='From: '+this.getHeader('From')+'\r\n';response+='Call-ID: '+this.call_id+'\r\n';response+='CSeq: '+this.cseq+' '+this.method+'\r\n';response+='Content-Length: '+0+'\r\n\r\n';this.transport.send(response);};IncomingResponse=function(){this.headers={};this.status_code=null;this.reason_phrase=null;};IncomingResponse.prototype=new IncomingMessage();JsSIP.OutgoingRequest=OutgoingRequest;JsSIP.IncomingRequest=IncomingRequest;JsSIP.IncomingResponse=IncomingResponse;}(JsSIP));(function(JsSIP){var URI;URI=function(scheme,user,host,port,parameters,headers){var param,header;if(!host){throw new TypeError('missing or invalid "host" parameter');}
scheme=scheme||JsSIP.C.SIP;this.parameters={};this.headers={};for(param in parameters){this.setParam(param,parameters[param]);}
for(header in headers){this.setHeader(header,headers[header]);}
Object.defineProperties(this,{scheme:{get:function(){return scheme;},set:function(value){scheme=value.toLowerCase();}},user:{get:function(){return user;},set:function(value){user=value;}},host:{get:function(){return host;},set:function(value){host=value.toLowerCase();}},port:{get:function(){return port;},set:function(value){port=value===0?value:(parseInt(value,10)||null);}}});};URI.prototype={setParam:function(key,value){if(key){this.parameters[key.toLowerCase()]=(typeof value==='undefined'||value===null)?null:value.toString().toLowerCase();}},getParam:function(key){if(key){return this.parameters[key.toLowerCase()];}},hasParam:function(key){if(key){return(this.parameters.hasOwnProperty(key.toLowerCase())&&true)||false;}},deleteParam:function(parameter){var value;parameter=parameter.toLowerCase();if(this.parameters.hasOwnProperty(parameter)){value=this.parameters[parameter];delete this.parameters[parameter];return value;}},clearParams:function(){this.parameters={};},setHeader:function(name,value){this.headers[JsSIP.Utils.headerize(name)]=(value instanceof Array)?value:[value];},getHeader:function(name){if(name){return this.headers[JsSIP.Utils.headerize(name)];}},hasHeader:function(name){if(name){return(this.headers.hasOwnProperty(JsSIP.Utils.headerize(name))&&true)||false;}},deleteHeader:function(header){var value;header=JsSIP.Utils.headerize(header);if(this.headers.hasOwnProperty(header)){value=this.headers[header];delete this.headers[header];return value;}},clearHeaders:function(){this.headers={};},clone:function(){return new URI(this.scheme,this.user,this.host,this.port,window.JSON.parse(window.JSON.stringify(this.parameters)),window.JSON.parse(window.JSON.stringify(this.headers)));},toString:function(){var header,parameter,idx,uri,headers=[];uri=this.scheme+':';if(this.user){uri+=JsSIP.Utils.escapeUser(this.user)+'@';}
uri+=this.host;if(this.port||this.port===0){uri+=':'+this.port;}
for(parameter in this.parameters){uri+=';'+parameter;if(this.parameters[parameter]!==null){uri+='='+this.parameters[parameter];}}
for(header in this.headers){for(idx in this.headers[header]){headers.push(header+'='+this.headers[header][idx]);}}
if(headers.length>0){uri+='?'+headers.join('&');}
return uri;},toAor:function(show_port){var aor;aor=this.scheme+':';if(this.user){aor+=JsSIP.Utils.escapeUser(this.user)+'@';}
aor+=this.host;if(show_port&&(this.port||this.port===0)){aor+=':'+this.port;}
return aor;}};URI.parse=function(uri){uri=JsSIP.Grammar.parse(uri,'SIP_URI');if(uri!==-1){return uri;}else{return undefined;}};JsSIP.URI=URI;}(JsSIP));(function(JsSIP){var NameAddrHeader;NameAddrHeader=function(uri,display_name,parameters){var param;if(!uri||!(uri instanceof JsSIP.URI)){throw new TypeError('missing or invalid "uri" parameter');}
this.uri=uri;this.parameters={};for(param in parameters){this.setParam(param,parameters[param]);}
Object.defineProperties(this,{display_name:{get:function(){return display_name;},set:function(value){display_name=(value===0)?'0':value;}}});};NameAddrHeader.prototype={setParam:function(key,value){if(key){this.parameters[key.toLowerCase()]=(typeof value==='undefined'||value===null)?null:value.toString();}},getParam:function(key){if(key){return this.parameters[key.toLowerCase()];}},hasParam:function(key){if(key){return(this.parameters.hasOwnProperty(key.toLowerCase())&&true)||false;}},deleteParam:function(parameter){var value;parameter=parameter.toLowerCase();if(this.parameters.hasOwnProperty(parameter)){value=this.parameters[parameter];delete this.parameters[parameter];return value;}},clearParams:function(){this.parameters={};},clone:function(){return new NameAddrHeader(this.uri.clone(),this.display_name,window.JSON.parse(window.JSON.stringify(this.parameters)));},toString:function(){var body,parameter;body=(this.display_name||this.display_name===0)?'"'+this.display_name+'" ':'';body+='<'+this.uri.toString()+'>';for(parameter in this.parameters){body+=';'+parameter;if(this.parameters[parameter]!==null){body+='='+this.parameters[parameter];}}
return body;}};NameAddrHeader.parse=function(name_addr_header){name_addr_header=JsSIP.Grammar.parse(name_addr_header,'Name_Addr_Header');if(name_addr_header!==-1){return name_addr_header;}else{return undefined;}};JsSIP.NameAddrHeader=NameAddrHeader;}(JsSIP));(function(JsSIP){var Transactions,LOG_PREFIX=JsSIP.name+' | '+'TRANSACTION'+' | ',C={STATUS_TRYING:1,STATUS_PROCEEDING:2,STATUS_CALLING:3,STATUS_ACCEPTED:4,STATUS_COMPLETED:5,STATUS_TERMINATED:6,STATUS_CONFIRMED:7};Transactions={};var ClientTransaction=function(){this.init=function(request_sender,request,transport){var via;this.transport=transport; this.id='z9hG4bK'+Math.floor(Math.random()*10000000);this.request_sender=request_sender;this.request=request;via='SIP/2.0/'+(request_sender.ua.configuration.hack_via_tcp?'TCP':transport.server.scheme);via+=' '+request_sender.ua.configuration.via_host+';branch='+this.id;this.request.setHeader('via',via);};};var NonInviteClientTransactionPrototype=function(){this.send=function(){var tr=this;this.state=C.STATUS_TRYING;this.F=window.setTimeout(function(){tr.timer_F();},JsSIP.Timers.TIMER_F);if(!this.transport.send(this.request)){this.onTransportError();}};this.onTransportError=function(){console.log(LOG_PREFIX+'transport error occurred, deleting non-INVITE client transaction '+this.id);window.clearTimeout(this.F);window.clearTimeout(this.K);delete this.request_sender.ua.transactions.nict[this.id];this.request_sender.onTransportError();};this.timer_F=function(){console.log(LOG_PREFIX+'Timer F expired for non-INVITE client transaction '+this.id);this.state=C.STATUS_TERMINATED;this.request_sender.onRequestTimeout();delete this.request_sender.ua.transactions.nict[this.id];};this.timer_K=function(){this.state=C.STATUS_TERMINATED;delete this.request_sender.ua.transactions.nict[this.id];};this.receiveResponse=function(response){var
tr=this,status_code=response.status_code;if(status_code<200){switch(this.state){case C.STATUS_TRYING:case C.STATUS_PROCEEDING:this.state=C.STATUS_PROCEEDING;this.request_sender.receiveResponse(response);break;}}else{switch(this.state){case C.STATUS_TRYING:case C.STATUS_PROCEEDING:this.state=C.STATUS_COMPLETED;window.clearTimeout(this.F);if(status_code===408){this.request_sender.onRequestTimeout();}else{this.request_sender.receiveResponse(response);}
this.K=window.setTimeout(function(){tr.timer_K();},JsSIP.Timers.TIMER_K);break;case C.STATUS_COMPLETED:break;}}};};NonInviteClientTransactionPrototype.prototype=new ClientTransaction();var InviteClientTransactionPrototype=function(){this.send=function(){var tr=this;this.state=C.STATUS_CALLING;this.B=window.setTimeout(function(){tr.timer_B();},JsSIP.Timers.TIMER_B);if(!this.transport.send(this.request)){this.onTransportError();}};this.onTransportError=function(){console.log(LOG_PREFIX+'transport error occurred, deleting INVITE client transaction '+this.id);window.clearTimeout(this.B);window.clearTimeout(this.D);window.clearTimeout(this.M);delete this.request_sender.ua.transactions.ict[this.id];this.request_sender.onTransportError();};//
this.timer_M=function(){console.log(LOG_PREFIX+'Timer M expired for INVITE client transaction '+this.id);if(this.state===C.STATUS_ACCEPTED){this.state=C.STATUS_TERMINATED;window.clearTimeout(this.B);delete this.request_sender.ua.transactions.ict[this.id];}};this.timer_B=function(){console.log(LOG_PREFIX+'Timer B expired for INVITE client transaction '+this.id);if(this.state===C.STATUS_CALLING){this.state=C.STATUS_TERMINATED;this.request_sender.onRequestTimeout();delete this.request_sender.ua.transactions.ict[this.id];}};this.timer_D=function(){console.log(LOG_PREFIX+'Timer D expired for INVITE client transaction '+this.id);this.state=C.STATUS_TERMINATED;window.clearTimeout(this.B);delete this.request_sender.ua.transactions.ict[this.id];};this.sendACK=function(response){var tr=this;this.ack='ACK '+this.request.ruri+' SIP/2.0\r\n';this.ack+='Via: '+this.request.headers['Via'].toString()+'\r\n';if(this.request.headers['Route']){this.ack+='Route: '+this.request.headers['Route'].toString()+'\r\n';}
this.ack+='To: '+response.getHeader('to')+'\r\n';this.ack+='From: '+this.request.headers['From'].toString()+'\r\n';this.ack+='Call-ID: '+this.request.headers['Call-ID'].toString()+'\r\n';this.ack+='CSeq: '+this.request.headers['CSeq'].toString().split(' ')[0];this.ack+=' ACK\r\n\r\n';this.D=window.setTimeout(function(){tr.timer_D();},JsSIP.Timers.TIMER_D);this.transport.send(this.ack);};this.cancel_request=function(tr,reason){var request=tr.request;this.cancel=JsSIP.C.CANCEL+' '+request.ruri+' SIP/2.0\r\n';this.cancel+='Via: '+request.headers['Via'].toString()+'\r\n';if(this.request.headers['Route']){this.cancel+='Route: '+request.headers['Route'].toString()+'\r\n';}
this.cancel+='To: '+request.headers['To'].toString()+'\r\n';this.cancel+='From: '+request.headers['From'].toString()+'\r\n';this.cancel+='Call-ID: '+request.headers['Call-ID'].toString()+'\r\n';this.cancel+='CSeq: '+request.headers['CSeq'].toString().split(' ')[0]+
' CANCEL\r\n';if(reason){this.cancel+='Reason: '+reason+'\r\n';}
this.cancel+='Content-Length: 0\r\n\r\n';if(this.state===C.STATUS_PROCEEDING){this.transport.send(this.cancel);}};this.receiveResponse=function(response){var
tr=this,status_code=response.status_code;if(status_code>=100&&status_code<=199){switch(this.state){case C.STATUS_CALLING:this.state=C.STATUS_PROCEEDING;this.request_sender.receiveResponse(response);if(this.cancel){this.transport.send(this.cancel);}
break;case C.STATUS_PROCEEDING:this.request_sender.receiveResponse(response);break;}}else if(status_code>=200&&status_code<=299){switch(this.state){case C.STATUS_CALLING:case C.STATUS_PROCEEDING:this.state=C.STATUS_ACCEPTED;this.M=window.setTimeout(function(){tr.timer_M();},JsSIP.Timers.TIMER_M);this.request_sender.receiveResponse(response);break;case C.STATUS_ACCEPTED:this.request_sender.receiveResponse(response);break;}}else if(status_code>=300&&status_code<=699){switch(this.state){case C.STATUS_CALLING:case C.STATUS_PROCEEDING:this.state=C.STATUS_COMPLETED;this.sendACK(response);this.request_sender.receiveResponse(response);break;case C.STATUS_COMPLETED:this.sendACK(response);break;}}};};InviteClientTransactionPrototype.prototype=new ClientTransaction();var ServerTransaction=function(){this.init=function(request,ua){this.id=request.via_branch;this.request=request;this.transport=request.transport;this.ua=ua;this.last_response='';request.server_transaction=this;};};var NonInviteServerTransactionPrototype=function(){this.timer_J=function(){console.log(LOG_PREFIX+'Timer J expired for non-INVITE server transaction '+this.id);this.state=C.STATUS_TERMINATED;delete this.ua.transactions.nist[this.id];};this.onTransportError=function(){if(!this.transportError){this.transportError=true;console.log(LOG_PREFIX+'transport error occurred, deleting non-INVITE server transaction '+this.id);window.clearTimeout(this.J);delete this.ua.transactions.nist[this.id];}};this.receiveResponse=function(status_code,response,onSuccess,onFailure){var tr=this;if(status_code===100){switch(this.state){case C.STATUS_TRYING:this.state=C.STATUS_PROCEEDING;if(!this.transport.send(response)){this.onTransportError();}
break;case C.STATUS_PROCEEDING:this.last_response=response;if(!this.transport.send(response)){this.onTransportError();if(onFailure){onFailure();}}else if(onSuccess){onSuccess();}
break;}}else if(status_code>=200&&status_code<=699){switch(this.state){case C.STATUS_TRYING:case C.STATUS_PROCEEDING:this.state =C.STATUS_COMPLETED;this.last_response=response;this.J=window.setTimeout(function(){tr.timer_J();},JsSIP.Timers.TIMER_J);if(!this.transport.send(response)){this.onTransportError();if(onFailure){onFailure();}}else if(onSuccess){onSuccess();}
break;case C.STATUS_COMPLETED:break;}}};};NonInviteServerTransactionPrototype.prototype=new ServerTransaction();var InviteServerTransactionPrototype=function(){this.timer_H=function(){console.log(LOG_PREFIX+'Timer H expired for INVITE server transaction '+this.id);if(this.state===C.STATUS_COMPLETED){console.warn(LOG_PREFIX+'transactions','ACK for INVITE server transaction was never received, call will be terminated');this.state=C.STATUS_TERMINATED;}
delete this.ua.transactions.ist[this.id];};this.timer_I=function(){this.state=C.STATUS_TERMINATED;delete this.ua.transactions.ist[this.id];};this.timer_L=function(){console.log(LOG_PREFIX+'Timer L expired for INVITE server transaction '+this.id);if(this.state===C.STATUS_ACCEPTED){this.state=C.STATUS_TERMINATED;delete this.ua.transactions.ist[this.id];}};this.onTransportError=function(){if(!this.transportError){this.transportError=true;console.log(LOG_PREFIX+'transport error occurred, deleting INVITE server transaction '+this.id);window.clearTimeout(this.reliableProvisionalTimer);window.clearTimeout(this.L);window.clearTimeout(this.H);window.clearTimeout(this.I);delete this.ua.transactions.ist[this.id];}};this.timer_reliableProvisional=function(retransmissions){var
tr=this,response=this.last_response,timeout=JsSIP.Timers.T1*(Math.pow(2,retransmissions+1));if(retransmissions>8){window.clearTimeout(this.reliableProvisionalTimer);}else{retransmissions+=1;if(!this.transport.send(response)){this.onTransportError();}
this.reliableProvisionalTimer=window.setTimeout(function(){tr.timer_reliableProvisional(retransmissions);},timeout);}};this.receiveResponse=function(status_code,response,onSuccess,onFailure){var tr=this;if(status_code>=100&&status_code<=199){switch(this.state){case C.STATUS_PROCEEDING:if(!this.transport.send(response)){this.onTransportError();}
this.last_response=response;break;}}
if(status_code>100&&status_code<=199){if(!this.reliableProvisionalTimer){this.reliableProvisionalTimer=window.setTimeout(function(){tr.timer_reliableProvisional(1);},JsSIP.Timers.T1);}}else if(status_code>=200&&status_code<=299){switch(this.state){case C.STATUS_PROCEEDING:this.state=C.STATUS_ACCEPTED;this.last_response=response;this.L=window.setTimeout(function(){tr.timer_L();},JsSIP.Timers.TIMER_L);window.clearTimeout(this.reliableProvisionalTimer);case C.STATUS_ACCEPTED:if(!this.transport.send(response)){this.onTransportError();if(onFailure){onFailure();}}else if(onSuccess){onSuccess();}
break;}}else if(status_code>=300&&status_code<=699){switch(this.state){case C.STATUS_PROCEEDING:window.clearTimeout(this.reliableProvisionalTimer);if(!this.transport.send(response)){this.onTransportError();if(onFailure){onFailure();}}else{this.state=C.STATUS_COMPLETED;this.H=window.setTimeout(function(){tr.timer_H();},JsSIP.Timers.TIMER_H);if(onSuccess){onSuccess();}}
break;}}};};InviteServerTransactionPrototype.prototype=new ServerTransaction();Transactions.NonInviteClientTransaction=function(request_sender,request,transport){this.init(request_sender,request,transport);this.request_sender.ua.transactions.nict[this.id]=this;};Transactions.NonInviteClientTransaction.prototype=new NonInviteClientTransactionPrototype();/**/
Transactions.InviteClientTransaction=function(request_sender,request,transport){var tr=this;this.init(request_sender,request,transport);this.request_sender.ua.transactions.ict[this.id]=this;this.request.cancel=function(reason){tr.cancel_request(tr,reason);};};Transactions.InviteClientTransaction.prototype=new InviteClientTransactionPrototype();Transactions.AckClientTransaction=function(request_sender,request,transport){this.init(request_sender,request,transport);this.send=function(){this.transport.send(request);};};Transactions.AckClientTransaction.prototype=new NonInviteClientTransactionPrototype();Transactions.NonInviteServerTransaction=function(request,ua){this.init(request,ua);this.state=C.STATUS_TRYING;ua.transactions.nist[this.id]=this;};Transactions.NonInviteServerTransaction.prototype=new NonInviteServerTransactionPrototype();Transactions.InviteServerTransaction=function(request,ua){this.init(request,ua);this.state=C.STATUS_PROCEEDING;ua.transactions.ist[this.id]=this;this.reliableProvisionalTimer=null;request.reply(100);};Transactions.InviteServerTransaction.prototype=new InviteServerTransactionPrototype();Transactions.checkTransaction=function(ua,request){var tr;switch(request.method){case JsSIP.C.INVITE:tr=ua.transactions.ist[request.via_branch];if(tr){switch(tr.state){case C.STATUS_PROCEEDING:tr.transport.send(tr.last_response);break;case C.STATUS_ACCEPTED:break;}
return true;}
break;case JsSIP.C.ACK:tr=ua.transactions.ist[request.via_branch];if(tr){if(tr.state===C.STATUS_ACCEPTED){return false;}else if(tr.state===C.STATUS_COMPLETED){tr.state=C.STATUS_CONFIRMED;tr.I=window.setTimeout(function(){tr.timer_I();},JsSIP.Timers.TIMER_I);return true;}}
else{return false;}
break;case JsSIP.C.CANCEL:tr=ua.transactions.ist[request.via_branch];if(tr){if(tr.state===C.STATUS_PROCEEDING){return false;}else{return true;}}else{request.reply_sl(481);return true;}
break;default:tr=ua.transactions.nist[request.via_branch];if(tr){switch(tr.state){ case C.STATUS_TRYING:break;case C.STATUS_PROCEEDING:case C.STATUS_COMPLETED:tr.transport.send(tr.last_response);break;}
return true;}
break;}};Transactions.C=C;JsSIP.Transactions=Transactions;}(JsSIP));(function(JsSIP){var Dialog,LOG_PREFIX=JsSIP.name+' | '+'DIALOG'+' | ',C={STATUS_EARLY:1,STATUS_CONFIRMED:2};Dialog=function(session,message,type,state){var contact;if(!message.hasHeader('contact')){console.error(LOG_PREFIX+'unable to create a Dialog without Contact header field');return false;}
if(message instanceof JsSIP.IncomingResponse){state=(message.status_code<200)?C.STATUS_EARLY:C.STATUS_CONFIRMED;}else{state=state||C.STATUS_CONFIRMED;}
contact=message.parseHeader('contact');if(type==='UAS'){this.id={call_id:message.call_id,local_tag:message.to_tag,remote_tag:message.from_tag,toString:function(){return this.call_id+this.local_tag+this.remote_tag;}};this.state=state;this.remote_seqnum=message.cseq;this.local_uri=message.parseHeader('to').uri;this.remote_uri=message.parseHeader('from').uri;this.remote_target=contact.uri;this.route_set=message.getHeaderAll('record-route');}
else if(type==='UAC'){this.id={call_id:message.call_id,local_tag:message.from_tag,remote_tag:message.to_tag,toString:function(){return this.call_id+this.local_tag+this.remote_tag;}};this.state=state;this.local_seqnum=message.cseq;this.local_uri=message.parseHeader('from').uri;this.remote_uri=message.parseHeader('to').uri;this.remote_target=contact.uri;this.route_set=message.getHeaderAll('record-route').reverse();}
this.session=session;session.ua.dialogs[this.id.toString()]=this;console.log(LOG_PREFIX+'new '+type+' dialog created with status '+(this.state===C.STATUS_EARLY?'EARLY':'CONFIRMED'));};Dialog.prototype={update:function(message,type){this.state=C.STATUS_CONFIRMED;console.log(LOG_PREFIX+'dialog '+this.id.toString()+'  changed to CONFIRMED state');if(type==='UAC'){this.route_set=message.getHeaderAll('record-route').reverse();}},terminate:function(){console.log(LOG_PREFIX+'dialog '+this.id.toString()+' deleted');delete this.session.ua.dialogs[this.id.toString()];},createRequest:function(method,extraHeaders){var cseq,request;extraHeaders=extraHeaders||[];if(!this.local_seqnum){this.local_seqnum=Math.floor(Math.random()*10000);}
cseq=(method===JsSIP.C.CANCEL||method===JsSIP.C.ACK)?this.local_seqnum:this.local_seqnum+=1;request=new JsSIP.OutgoingRequest(method,this.remote_target,this.session.ua,{'cseq':cseq,'call_id':this.id.call_id,'from_uri':this.local_uri,'from_tag':this.id.local_tag,'to_uri':this.remote_uri,'to_tag':this.id.remote_tag,'route_set':this.route_set},extraHeaders);request.dialog=this;return request;},checkInDialogRequest:function(request){if(!this.remote_seqnum){this.remote_seqnum=request.cseq;}else if(request.method!==JsSIP.C.INVITE&&request.cseq<this.remote_seqnum){if(request.method!==JsSIP.C.ACK){request.reply(500);}
return false;}else if(request.cseq>this.remote_seqnum){this.remote_seqnum=request.cseq;}
switch(request.method){case JsSIP.C.INVITE:if(request.cseq<this.remote_seqnum){if(this.state===C.STATUS_EARLY){var retryAfter=(Math.random()*10|0)+1;request.reply(500,null,['Retry-After:'+retryAfter]);}else{request.reply(500);}
return false;}
if(this.state===C.STATUS_EARLY){request.reply(491);return false;}//
if(request.hasHeader('contact')){this.remote_target=request.parseHeader('contact').uri;}
break;case JsSIP.C.NOTIFY:if(request.hasHeader('contact')){this.remote_target=request.parseHeader('contact').uri;}
break;}
return true;},receiveRequest:function(request){if(!this.checkInDialogRequest(request)){return;}
this.session.receiveRequest(request);}};Dialog.C=C;JsSIP.Dialog=Dialog;}(JsSIP));(function(JsSIP){var RequestSender,LOG_PREFIX=JsSIP.name+' | '+'REQUEST SENDER'+' | ';RequestSender=function(applicant,ua){this.ua=ua;this.applicant=applicant;this.method=applicant.request.method;this.request=applicant.request;this.credentials=null;this.challenged=false;this.staled=false;if(ua.status===JsSIP.UA.C.STATUS_USER_CLOSED&&(this.method!==JsSIP.C.BYE||this.method!==JsSIP.C.ACK)){this.onTransportError();}};RequestSender.prototype={send:function(){switch(this.method){case "INVITE":this.clientTransaction=new JsSIP.Transactions.InviteClientTransaction(this,this.request,this.ua.transport);break;case "ACK":this.clientTransaction=new JsSIP.Transactions.AckClientTransaction(this,this.request,this.ua.transport);break;default:this.clientTransaction=new JsSIP.Transactions.NonInviteClientTransaction(this,this.request,this.ua.transport);}
this.clientTransaction.send();},onRequestTimeout:function(){this.applicant.onRequestTimeout();},onTransportError:function(){this.applicant.onTransportError();},receiveResponse:function(response){var cseq,challenge,authorization_header_name,status_code=response.status_code;if((status_code===401||status_code===407)&&this.ua.configuration.password!==null){if(response.status_code===401){challenge=response.parseHeader('www-authenticate');authorization_header_name='authorization';}else{challenge=response.parseHeader('proxy-authenticate');authorization_header_name='proxy-authorization';}
if(!challenge){console.warn(LOG_PREFIX+response.status_code+' with wrong or missing challenge, cannot authenticate');this.applicant.receiveResponse(response);return;}
if(!this.challenged||(!this.staled&&challenge.stale===true)){if(!this.credentials){this.credentials=new JsSIP.DigestAuthentication(this.ua);}
if(!this.credentials.authenticate(this.request,challenge)){this.applicant.receiveResponse(response);return;}
this.challenged=true;if(challenge.stale){this.staled=true;}
if(response.method===JsSIP.C.REGISTER){cseq=this.applicant.cseq+=1;}else if(this.request.dialog){cseq=this.request.dialog.local_seqnum+=1;}else{cseq=this.request.cseq+1;this.request.cseq=cseq;}
this.request.setHeader('cseq',cseq+' '+this.method);this.request.setHeader(authorization_header_name,this.credentials.toString());this.send();}else{this.applicant.receiveResponse(response);}}else{this.applicant.receiveResponse(response);}}};JsSIP.RequestSender=RequestSender;}(JsSIP));(function(JsSIP){var InDialogRequestSender;InDialogRequestSender=function(applicant){this.applicant=applicant;this.request=applicant.request;};InDialogRequestSender.prototype={send:function(){var request_sender=new JsSIP.RequestSender(this,this.applicant.session.ua);request_sender.send();},onRequestTimeout:function(){this.applicant.session.onRequestTimeout();this.applicant.onRequestTimeout();},onTransportError:function(){this.applicant.session.onTransportError();this.applicant.onTransportError();},receiveResponse:function(response){if(response.status_code===408||response.status_code===481){this.applicant.session.ended('remote',response,JsSIP.C.causes.DIALOG_ERROR);}
this.applicant.receiveResponse(response);}};JsSIP.InDialogRequestSender=InDialogRequestSender;}(JsSIP));
/**/
(function(JsSIP){var Registrator,LOG_PREFIX=JsSIP.name+' | '+'REGISTRATOR'+' | ';Registrator=function(ua,transport){var reg_id=1;this.ua=ua;this.transport=transport;this.registrar=ua.configuration.registrar_server;this.expires=ua.configuration.register_expires;this.min_expires=ua.configuration.register_min_expires;this.call_id=JsSIP.Utils.createRandomToken(22);this.cseq=80;this.to_uri=ua.configuration.uri;this.registrationTimer=null;this.registered=this.registered_before=false;this.ua.registrator=this;this.contact=this.ua.contact.toString();if(reg_id){this.contact+=';reg-id='+reg_id;this.contact+=';+sip.instance="<urn:uuid:'+this.ua.configuration.instance_id+'>"';}};Registrator.prototype={/**/
register:function(options){var request_sender,cause,extraHeaders,self=this;options=options||{};extraHeaders=options.extraHeaders||[];extraHeaders.push('Contact: '+this.contact+';expires='+this.expires);extraHeaders.push('Allow: '+JsSIP.Utils.getAllowedMethods(this.ua));this.request=new JsSIP.OutgoingRequest(JsSIP.C.REGISTER,this.registrar,this.ua,{'to_uri':this.to_uri,'call_id':this.call_id,'cseq':(this.cseq+=1)},extraHeaders);request_sender=new JsSIP.RequestSender(this,this.ua);this.receiveResponse=function(response){var contact,expires,min_expires,contacts=response.countHeader('contact');if(response.cseq!==this.cseq){return;}
switch(true){case/^1[0-9]{2}$/.test(response.status_code):break;case/^2[0-9]{2}$/.test(response.status_code):if(response.hasHeader('expires')){expires=response.getHeader('expires');}
if(!contacts){console.warn(LOG_PREFIX+'no Contact header in response to REGISTER, response ignored');break;}
while(contacts--){contact=response.parseHeader('contact',contacts);if(contact.uri.user===this.ua.contact.uri.user){expires=contact.getParam('expires');break;}else{contact=null;}}
if(!contact){console.warn(LOG_PREFIX+'no Contact header pointing to us, response ignored');break;}
if(!expires){expires=this.expires;}//
this.registrationTimer=window.setTimeout(function(){self.register();},(expires*1000)-3000);if(contact.hasParam('temp-gruu')){this.ua.contact.temp_gruu=contact.getParam('temp-gruu').replace(/"/g,'');}
if(contact.hasParam('pub-gruu')){this.ua.contact.pub_gruu=contact.getParam('pub-gruu').replace(/"/g,'');}
this.registered=true;this.ua.emit('registered',this.ua,{response:response});break;case/^423$/.test(response.status_code):if(response.hasHeader('min-expires')){min_expires=response.getHeader('min-expires');expires=(min_expires-this.expires);this.registrationTimer=window.setTimeout(function(){self.register();},this.expires*1000);}else{console.warn(LOG_PREFIX+'423 response received for REGISTER without Min-Expires');this.registrationFailure(response,JsSIP.C.causes.SIP_FAILURE_CODE);}
break;default:cause=JsSIP.Utils.sipErrorCause(response.status_code);this.registrationFailure(response,cause);}};this.onRequestTimeout=function(){this.registrationFailure(null,JsSIP.C.causes.REQUEST_TIMEOUT);};this.onTransportError=function(){this.registrationFailure(null,JsSIP.C.causes.CONNECTION_ERROR);};request_sender.send();},unregister:function(options){var extraHeaders;if(!this.registered){console.warn(LOG_PREFIX+'already unregistered');return;}
options=options||{};extraHeaders=options.extraHeaders||[];this.registered=false;window.clearTimeout(this.registrationTimer);if(options.all){extraHeaders.push('Contact: *');extraHeaders.push('Expires: 0');this.request=new JsSIP.OutgoingRequest(JsSIP.C.REGISTER,this.registrar,this.ua,{'to_uri':this.to_uri,'call_id':this.call_id,'cseq':(this.cseq+=1)},extraHeaders);}else{extraHeaders.push('Contact: '+this.contact+';expires=0');this.request=new JsSIP.OutgoingRequest(JsSIP.C.REGISTER,this.registrar,this.ua,{'to_uri':this.to_uri,'call_id':this.call_id,'cseq':(this.cseq+=1)},extraHeaders);}
var request_sender=new JsSIP.RequestSender(this,this.ua);this.receiveResponse=function(response){var cause;switch(true){case/^1[0-9]{2}$/.test(response.status_code):break;case/^2[0-9]{2}$/.test(response.status_code):this.unregistered(response);break;default:cause=JsSIP.Utils.sipErrorCause(response.status_code);this.unregistered(response,cause);}};this.onRequestTimeout=function(){this.unregistered(null,JsSIP.C.causes.REQUEST_TIMEOUT);};this.onTransportError=function(){this.unregistered(null,JsSIP.C.causes.CONNECTION_ERROR);};request_sender.send();},registrationFailure:function(response,cause){this.ua.emit('registrationFailed',this.ua,{response:response||null,cause:cause});if(this.registered){this.registered=false;this.ua.emit('unregistered',this.ua,{response:response||null,cause:cause});}},unregistered:function(response,cause){this.registered=false;this.ua.emit('unregistered',this.ua,{response:response||null,cause:cause||null});},onTransportClosed:function(){this.registered_before=this.registered;window.clearTimeout(this.registrationTimer);if(this.registered){this.registered=false;this.ua.emit('unregistered',this.ua);}},onTransportConnected:function(){this.register();},close:function(){this.registered_before=this.registered;this.unregister();}};JsSIP.Registrator=Registrator;}(JsSIP));(function(JsSIP){var RequestSender=(function(JsSIP){var RequestSender=function(applicant,request){this.applicant=applicant;this.request=request||applicant.request;this.session=(applicant instanceof JsSIP.RTCSession)?applicant:applicant.session;this.reattempt=false;this.reatemptTimer=null;this.request_sender=new JsSIP.InDialogRequestSender(this);};RequestSender.prototype={receiveResponse:function(response){var
self=this,status_code=response.status_code;if(response.method===JsSIP.C.INVITE&&status_code===491){if(!this.reattempt){this.request.cseq.value=this.request.dialog.local_seqnum+=1;this.reatemptTimer=window.setTimeout(function(){if(self.session.status!==JsSIP.RTCSession.C.STATUS_TERMINATED){self.reattempt=true;self.request_sender.send();}},this.getReattemptTimeout());}else{this.applicant.receiveResponse(response);}}else{this.applicant.receiveResponse(response);}},send:function(){this.request_sender.send();},onRequestTimeout:function(){this.applicant.onRequestTimeout();},onTransportError:function(){this.applicant.onTransportError();},getReattemptTimeout:function(){if(this.session.direction==='outgoing'){return(Math.random()*(4-2.1)+2.1).toFixed(2);}else{return(Math.random()*2).toFixed(2);}}};return RequestSender;}(JsSIP));var RTCMediaHandler=(function(JsSIP){var RTCMediaHandler=function(session,constraints){constraints=constraints||{};this.session=session;this.localMedia=null;this.peerConnection=null;this.init(constraints);};RTCMediaHandler.prototype={createOffer:function(onSuccess,onFailure){var
self=this,sent=false;this.onIceCompleted=function(){if(!sent){sent=true;onSuccess(self.peerConnection.localDescription.sdp);}};this.peerConnection.createOffer(function(sessionDescription){self.setLocalDescription(sessionDescription,onFailure);},function(e){console.error(LOG_PREFIX+'unable to create offer');console.error(e);onFailure();});},createAnswer:function(onSuccess,onFailure){var
self=this,sent=false;this.onIceCompleted=function(){if(!sent){sent=true;onSuccess(self.peerConnection.localDescription.sdp);}};this.peerConnection.createAnswer(function(sessionDescription){self.setLocalDescription(sessionDescription,onFailure);},function(e){console.error(LOG_PREFIX+'unable to create answer');console.error(e);onFailure();});},setLocalDescription:function(sessionDescription,onFailure){this.peerConnection.setLocalDescription(sessionDescription,null,function(e){console.error(LOG_PREFIX+'unable to set local description');console.error(e);onFailure();});},addStream:function(stream,onSuccess,onFailure,constraints){try{this.peerConnection.addStream(stream,constraints);}catch(e){console.error(LOG_PREFIX+'error adding stream');console.error(e);onFailure();return;}
onSuccess();},init:function(constraints){var idx,server,scheme,url,self=this,servers=[];for(idx in this.session.ua.configuration.stun_servers){server=this.session.ua.configuration.stun_servers[idx];servers.push({'url':server});}
for(idx in this.session.ua.configuration.turn_servers){server=this.session.ua.configuration.turn_servers[idx];url=server.server;scheme=url.substr(0,url.indexOf(':'));servers.push({'url':scheme+':'+server.username+'@'+url.substr(scheme.length+1),'credential':server.password});}
this.peerConnection=new JsSIP.WebRTC.RTCPeerConnection({'iceServers':servers},constraints);this.peerConnection.onaddstream=function(e){console.log(LOG_PREFIX+'stream added: '+e.stream.id);};this.peerConnection.onremovestream=function(e){console.log(LOG_PREFIX+'stream removed: '+e.stream.id);};this.peerConnection.onicecandidate=function(e){if(e.candidate){console.log(LOG_PREFIX+'ICE candidate received: '+e.candidate.candidate);}else{self.onIceCompleted();}};this.peerConnection.ongatheringchange=function(e){if(e.currentTarget.iceGatheringState==='complete'&&this.iceConnectionState!=='closed'){self.onIceCompleted();}};this.peerConnection.onicechange=function(){console.log(LOG_PREFIX+'ICE connection state changed to "'+this.iceConnectionState+'"');};this.peerConnection.onstatechange=function(){console.log(LOG_PREFIX+'PeerConnection state changed to "'+this.readyState+'"');};},close:function(){console.log(LOG_PREFIX+'closing PeerConnection');if(this.peerConnection){this.peerConnection.close();if(this.localMedia){this.localMedia.stop();}}},getUserMedia:function(onSuccess,onFailure,constraints){var self=this;console.log(LOG_PREFIX+ 'requesting access to local media');JsSIP.WebRTC.getUserMedia(constraints,function(stream){console.log(LOG_PREFIX+'got local media stream');self.localMedia=stream;onSuccess(stream);},function(e){console.error(LOG_PREFIX+'unable to get user media');console.error(e);onFailure();});},onMessage:function(type,body,onSuccess,onFailure){this.peerConnection.setRemoteDescription(new JsSIP.WebRTC.RTCSessionDescription({type:type,sdp:body}),onSuccess,onFailure);}};return RTCMediaHandler;}(JsSIP));var DTMF=(function(JsSIP){var DTMF,C={MIN_DURATION:70,MAX_DURATION:6000,DEFAULT_DURATION:100,MIN_INTER_TONE_GAP:50,DEFAULT_INTER_TONE_GAP:500};DTMF=function(session){var events=['succeeded','failed'];this.session=session;this.direction=null;this.tone=null;this.duration=null;this.initEvents(events);};DTMF.prototype=new JsSIP.EventEmitter();DTMF.prototype.send=function(tone,options){var request_sender,event,eventHandlers,extraHeaders;if(tone===undefined){throw new TypeError('Not enough arguments');}
this.direction='outgoing';if(this.session.status!==JsSIP.RTCSession.C.STATUS_CONFIRMED&&this.session.status!==JsSIP.RTCSession.C.STATUS_WAITING_FOR_ACK){throw new JsSIP.Exceptions.InvalidStateError(this.session.status);}
options=options||{};extraHeaders=options.extraHeaders?options.extraHeaders.slice():[];eventHandlers=options.eventHandlers||{};if(typeof tone==='string'){tone=tone.toUpperCase();}else if(typeof tone==='number'){tone=tone.toString();}else{throw new TypeError('Invalid tone: '+tone);}
if(!tone.match(/^[0-9A-D#*]$/)){throw new TypeError('Invalid tone: '+tone);}else{this.tone=tone;}
if(options.duration&&!JsSIP.Utils.isDecimal(options.duration)){throw new TypeError('Invalid tone duration: '+options.duration);}else if(!options.duration){options.duration=C.DEFAULT_DURATION;}else if(options.duration<C.MIN_DURATION){console.warn(LOG_PREFIX+'"duration" value is lower than the minimum allowed, setting it to '+C.MIN_DURATION+' milliseconds');options.duration=C.MIN_DURATION;}else if(options.duration>C.MAX_DURATION){console.warn(LOG_PREFIX+'"duration" value is greater than the maximum allowed, setting it to '+C.MAX_DURATION+' milliseconds');options.duration=C.MAX_DURATION;}else{options.duration=Math.abs(options.duration);}
this.duration=options.duration;
for(event in eventHandlers){this.on(event,eventHandlers[event]);}
extraHeaders.push('Content-Type: application/dtmf-relay');this.request=this.session.dialog.createRequest(JsSIP.C.INFO,extraHeaders);this.request.body="Signal= "+this.tone+"\r\n";this.request.body+="Duration= "+this.duration;request_sender=new RequestSender(this);this.session.emit('newDTMF',this.session,{originator:'local',dtmf:this,request:this.request});request_sender.send();};DTMF.prototype.receiveResponse=function(response){var cause;switch(true){case/^1[0-9]{2}$/.test(response.status_code):break;case/^2[0-9]{2}$/.test(response.status_code):this.emit('succeeded',this,{originator:'remote',response:response});break;default:cause=JsSIP.Utils.sipErrorCause(response.status_code);this.emit('failed',this,{originator:'remote',response:response,cause:cause});break;}};DTMF.prototype.onRequestTimeout=function(){this.emit('failed',this,{originator:'system',cause:JsSIP.C.causes.REQUEST_TIMEOUT});};DTMF.prototype.onTransportError=function(){this.emit('failed',this,{originator:'system',cause:JsSIP.C.causes.CONNECTION_ERROR});};DTMF.prototype.init_incoming=function(request){var body,reg_tone=/^(Signal\s*?=\s*?)([0-9A-D#*]{1})(\s)?.*/,reg_duration=/^(Duration\s?=\s?)([0-9]{1,4})(\s)?.*/;this.direction='incoming';this.request=request;request.reply(200);if(request.body){body=request.body.split('\r\n');if(body.length===2){if(reg_tone.test(body[0])){this.tone=body[0].replace(reg_tone,"$2");}
if(reg_duration.test(body[1])){this.duration=parseInt(body[1].replace(reg_duration,"$2"),10);}}}
if(!this.tone||!this.duration){console.warn(LOG_PREFIX+'invalid INFO DTMF received, discarded');}else{this.session.emit('newDTMF',this.session,{originator:'remote',dtmf:this,request:request});}};DTMF.C=C;return DTMF;}(JsSIP));var RTCSession,LOG_PREFIX=JsSIP.name+' | '+'RTC SESSION'+' | ',C={STATUS_NULL:0,STATUS_INVITE_SENT:1,STATUS_1XX_RECEIVED:2,STATUS_INVITE_RECEIVED:3,STATUS_WAITING_FOR_ANSWER:4,STATUS_WAITING_FOR_ACK:5,STATUS_CANCELED:6,STATUS_TERMINATED:7,STATUS_CONFIRMED:8};RTCSession=function(ua){var events=['progress','failed','started','ended','newDTMF'];this.ua=ua;this.status=C.STATUS_NULL;this.dialog=null;this.earlyDialogs=[];this.rtcMediaHandler=null;this.timers={ackTimer:null,expiresTimer:null,invite2xxTimer:null,userNoAnswerTimer:null};this.direction=null;this.local_identity=null;this.remote_identity=null;this.start_time=null;this.end_time=null;this.data={};this.initEvents(events);};RTCSession.prototype=new JsSIP.EventEmitter();RTCSession.prototype.terminate=function(options){options=options||{};var cancel_reason,status_code=options.status_code,reason_phrase=options.reason_phrase,extraHeaders=options.extraHeaders||[],body=options.body;if(this.status===C.STATUS_TERMINATED){throw new JsSIP.Exceptions.InvalidStateError(this.status);}
switch(this.status){case C.STATUS_NULL:case C.STATUS_INVITE_SENT:case C.STATUS_1XX_RECEIVED:console.log(LOG_PREFIX+'canceling RTCSession');if(status_code&&(status_code<200||status_code>=700)){throw new TypeError('Invalid status_code: '+status_code);}else if(status_code){reason_phrase=reason_phrase||JsSIP.C.REASON_PHRASE[status_code]||'';cancel_reason='SIP ;cause='+status_code+' ;text="'+reason_phrase+'"';}
if(this.status===C.STATUS_NULL){this.isCanceled=true;this.cancelReason=cancel_reason;}else if(this.status===C.STATUS_INVITE_SENT){if(this.received_100){this.request.cancel(cancel_reason);}else{this.isCanceled=true;this.cancelReason=cancel_reason;}}else if(this.status===C.STATUS_1XX_RECEIVED){this.request.cancel(cancel_reason);}
this.failed('local',null,JsSIP.C.causes.CANCELED);break;case C.STATUS_WAITING_FOR_ANSWER:console.log(LOG_PREFIX+'rejecting RTCSession');status_code=status_code||480;if(status_code<300||status_code>=700){throw new TypeError('Invalid status_code: '+status_code);}
this.request.reply(status_code,reason_phrase,extraHeaders,body);this.failed('local',null,JsSIP.C.causes.REJECTED);break;case C.STATUS_WAITING_FOR_ACK:case C.STATUS_CONFIRMED:console.log(LOG_PREFIX+'terminating RTCSession');this.sendBye(options);this.ended('local',null,JsSIP.C.causes.BYE);break;}
this.close();};RTCSession.prototype.answer=function(options){options=options||{};var
self=this,request=this.request,extraHeaders=options.extraHeaders||[],mediaConstraints=options.mediaConstraints||{'audio':true,'video':true},userMediaSucceeded=function(stream){self.rtcMediaHandler.addStream(stream,streamAdditionSucceeded,streamAdditionFailed);},userMediaFailed=function(){request.reply(480);self.failed('local',null,JsSIP.C.causes.USER_DENIED_MEDIA_ACCESS);},streamAdditionSucceeded=function(){self.rtcMediaHandler.createAnswer(answerCreationSucceeded,answerCreationFailed);},streamAdditionFailed=function(){if(self.status===C.STATUS_TERMINATED){return;}
self.failed('local',null,JsSIP.C.causes.WEBRTC_ERROR);},answerCreationSucceeded=function(body){var
replySucceeded=function(){self.status=C.STATUS_WAITING_FOR_ACK;/**/
self.timers.invite2xxTimer=window.setTimeout(function invite2xxRetransmission(retransmissions){retransmissions=retransmissions||1;var timeout=JsSIP.Timers.T1*(Math.pow(2,retransmissions));if((retransmissions*JsSIP.Timers.T1)<=JsSIP.Timers.T2){retransmissions+=1;request.reply(200,null,['Contact: '+self.contact],body);self.timers.invite2xxTimer=window.setTimeout(invite2xxRetransmission(retransmissions),timeout);}else{window.clearTimeout(self.timers.invite2xxTimer);}},JsSIP.Timers.T1);self.timers.ackTimer=window.setTimeout(function(){if(self.status===C.STATUS_WAITING_FOR_ACK){console.log(LOG_PREFIX+'no ACK received, terminating the call');window.clearTimeout(self.timers.invite2xxTimer);self.sendBye();self.ended('remote',null,JsSIP.C.causes.NO_ACK);}},JsSIP.Timers.TIMER_H);self.started('local');},replyFailed=function(){self.failed('system',null,JsSIP.C.causes.CONNECTION_ERROR);};extraHeaders.push('Contact: '+self.contact);request.reply(200,null,extraHeaders,body,replySucceeded,replyFailed);},answerCreationFailed=function(){if(self.status===C.STATUS_TERMINATED){return;}
self.failed('local',null,JsSIP.C.causes.WEBRTC_ERROR);};//
if(this.direction!=='incoming'){throw new TypeError('Invalid method "answer" for an outgoing call');}else if(this.status!==C.STATUS_WAITING_FOR_ANSWER){throw new JsSIP.Exceptions.InvalidStateError(this.status);}
if(!this.createDialog(request,'UAS')){request.reply(500,'Missing Contact header field');return;}
window.clearTimeout(this.timers.userNoAnswerTimer);this.rtcMediaHandler.getUserMedia(userMediaSucceeded,userMediaFailed,mediaConstraints);};RTCSession.prototype.sendDTMF=function(tones,options){var timer,interToneGap,possition=0,self=this,ready=true;options=options||{};interToneGap=options.interToneGap||null;if(tones===undefined){throw new TypeError('Not enough arguments');}
if(this.status!==C.STATUS_CONFIRMED&&this.status!==C.STATUS_WAITING_FOR_ACK){throw new JsSIP.Exceptions.InvalidStateError(this.status);}
if(!tones||(typeof tones!=='string'&&typeof tones!=='number')||!tones.toString().match(/^[0-9A-D#*]+$/i)){throw new TypeError('Invalid tones: '+tones);}
tones=tones.toString();if(interToneGap&&!JsSIP.Utils.isDecimal(interToneGap)){throw new TypeError('Invalid interToneGap: '+interToneGap);}else if(!interToneGap){interToneGap=DTMF.C.DEFAULT_INTER_TONE_GAP;}else if(interToneGap<DTMF.C.MIN_INTER_TONE_GAP){console.warn(LOG_PREFIX+'"interToneGap" value is lower than the minimum allowed, setting it to '+DTMF.C.MIN_INTER_TONE_GAP+' milliseconds');interToneGap=DTMF.C.MIN_INTER_TONE_GAP;}else{interToneGap=Math.abs(interToneGap);}
function sendDTMF(){var tone,dtmf=new DTMF(self);dtmf.on('failed',function(){ready=false;});tone=tones[possition];possition+=1;dtmf.send(tone,options);}
sendDTMF();timer=window.setInterval(function(){if(self.status!==C.STATUS_TERMINATED&&ready&&tones.length>possition){sendDTMF();}else{window.clearInterval(timer);}},interToneGap);};RTCSession.prototype.getLocalStreams=function(){return this.rtcMediaHandler&&this.rtcMediaHandler.peerConnection&&this.rtcMediaHandler.peerConnection.getLocalStreams()||[];};RTCSession.prototype.getRemoteStreams=function(){return this.rtcMediaHandler&&this.rtcMediaHandler.peerConnection&&this.rtcMediaHandler.peerConnection.getRemoteStreams()||[];};RTCSession.prototype.init_incoming=function(request){var expires,self=this,contentType=request.getHeader('Content-Type');if(!request.body||(contentType!=='application/sdp')){request.reply(415);return;}
this.status=C.STATUS_INVITE_RECEIVED;this.from_tag=request.from_tag;this.id=request.call_id+this.from_tag;this.request=request;this.contact=this.ua.contact.toString();this.ua.sessions[this.id]=this;if(request.hasHeader('expires')){expires=request.getHeader('expires')*1000;}
request.to_tag=JsSIP.Utils.newTag();if(!this.createDialog(request,'UAS',true)){request.reply(500,'Missing Contact header field');return;}
this.rtcMediaHandler=new RTCMediaHandler(this);this.rtcMediaHandler.onMessage('offer',request.body,function(){request.reply(180,null,['Contact: '+self.contact]);self.status=C.STATUS_WAITING_FOR_ANSWER;self.timers.userNoAnswerTimer=window.setTimeout(function(){request.reply(408);self.failed('local',null,JsSIP.C.causes.NO_ANSWER);},self.ua.configuration.no_answer_timeout);if(expires){self.timers.expiresTimer=window.setTimeout(function(){if(self.status===C.STATUS_WAITING_FOR_ANSWER){request.reply(487);self.failed('system',null,JsSIP.C.causes.EXPIRES);}},expires);}
self.newRTCSession('remote',request);},function(e){console.warn(LOG_PREFIX+'invalid SDP');console.warn(e);request.reply(488);});};RTCSession.prototype.connect=function(target,options){options=options||{};var event,requestParams,invalidTarget=false,eventHandlers=options.eventHandlers||{},extraHeaders=options.extraHeaders||[],mediaConstraints=options.mediaConstraints||{audio:true,video:true},RTCConstraints=options.RTCConstraints||{};if(target===undefined){throw new TypeError('Not enough arguments');}
if(this.status!==C.STATUS_NULL){throw new JsSIP.Exceptions.InvalidStateError(this.status);}
for(event in eventHandlers){this.on(event,eventHandlers[event]);}
try{target=JsSIP.Utils.normalizeURI(target,this.ua.configuration.hostport_params);}catch(e){target=JsSIP.URI.parse(JsSIP.C.INVALID_TARGET_URI);invalidTarget=true;}
this.from_tag=JsSIP.Utils.newTag();this.rtcMediaHandler=new RTCMediaHandler(this,RTCConstraints);this.anonymous=options.anonymous;this.isCanceled=false;this.received_100=false;requestParams={from_tag:this.from_tag};this.contact=this.ua.contact.toString({anonymous:this.anonymous,outbound:true});if(this.anonymous){requestParams.from_display_name='Anonymous';requestParams.from_uri='sip:anonymous@anonymous.invalid';extraHeaders.push('P-Preferred-Identity: '+this.ua.configuration.uri.toString());extraHeaders.push('Privacy: id');}
extraHeaders.push('Contact: '+this.contact);extraHeaders.push('Allow: '+JsSIP.Utils.getAllowedMethods(this.ua));extraHeaders.push('Content-Type: application/sdp');this.request=new JsSIP.OutgoingRequest(JsSIP.C.INVITE,target,this.ua,requestParams,extraHeaders);this.id=this.request.call_id+this.from_tag;this.ua.sessions[this.id]=this;this.newRTCSession('local',this.request);if(invalidTarget){this.failed('local',null,JsSIP.C.causes.INVALID_TARGET);}else if(!JsSIP.WebRTC.isSupported){this.failed('local',null,JsSIP.C.causes.WEBRTC_NOT_SUPPORTED);}else{this.sendInitialRequest(mediaConstraints);}};RTCSession.prototype.close=function(){var idx;if(this.status===C.STATUS_TERMINATED){return;}
console.log(LOG_PREFIX+'closing INVITE session '+this.id);if(this.rtcMediaHandler){this.rtcMediaHandler.close();}
for(idx in this.timers){window.clearTimeout(this.timers[idx]);}
if(this.dialog){this.dialog.terminate();delete this.dialog;}
for(idx in this.earlyDialogs){this.earlyDialogs[idx].terminate();delete this.earlyDialogs[idx];}
this.status=C.STATUS_TERMINATED;delete this.ua.sessions[this.id];};RTCSession.prototype.createDialog=function(message,type,early){var dialog,early_dialog,local_tag=(type==='UAS')?message.to_tag:message.from_tag,remote_tag=(type==='UAS')?message.from_tag:message.to_tag,id=message.call_id+local_tag+remote_tag;early_dialog=this.earlyDialogs[id];if(early){if(early_dialog){return true;}else{early_dialog=new JsSIP.Dialog(this,message,type,JsSIP.Dialog.C.STATUS_EARLY);if(early_dialog.id){this.earlyDialogs[id]=early_dialog;return true;}
else{this.failed('remote',message,JsSIP.C.causes.INTERNAL_ERROR);return false;}}}
else{//
if(early_dialog){early_dialog.update(message,type);this.dialog=early_dialog;delete this.earlyDialogs[id];return true;}
dialog=new JsSIP.Dialog(this,message,type);if(dialog.id){this.to_tag=message.to_tag;this.dialog=dialog;return true;}
else{this.failed('remote',message,JsSIP.C.causes.INTERNAL_ERROR);return false;}}};RTCSession.prototype.receiveRequest=function(request){var contentType;if(request.method===JsSIP.C.CANCEL){this.request.reply(487);/**/
if(this.status===C.STATUS_WAITING_FOR_ANSWER){this.status=C.STATUS_CANCELED;this.failed('remote',request,JsSIP.C.causes.CANCELED);}}else{switch(request.method){case JsSIP.C.ACK:if(this.status===C.STATUS_WAITING_FOR_ACK){window.clearTimeout(this.timers.ackTimer);window.clearTimeout(this.timers.invite2xxTimer);this.status=C.STATUS_CONFIRMED;}
break;case JsSIP.C.BYE:if(this.status===C.STATUS_CONFIRMED){request.reply(200);this.ended('remote',request,JsSIP.C.causes.BYE);}
break;case JsSIP.C.INVITE:if(this.status===C.STATUS_CONFIRMED){console.log(LOG_PREFIX+'re-INVITE received');}
break;case JsSIP.C.INFO:if(this.status===C.STATUS_CONFIRMED||this.status===C.STATUS_WAITING_FOR_ACK){contentType=request.getHeader('content-type');if(contentType&&(contentType.match(/^application\/dtmf-relay/i))){new DTMF(this).init_incoming(request);}}}}};RTCSession.prototype.sendInitialRequest=function(constraints){var
self=this,request_sender=new JsSIP.RequestSender(self,this.ua),userMediaSucceeded=function(stream){self.rtcMediaHandler.addStream(stream,streamAdditionSucceeded,streamAdditionFailed);},userMediaFailed=function(){if(self.status===C.STATUS_TERMINATED){return;}
self.failed('local',null,JsSIP.C.causes.USER_DENIED_MEDIA_ACCESS);},streamAdditionSucceeded=function(){self.rtcMediaHandler.createOffer(offerCreationSucceeded,offerCreationFailed);},streamAdditionFailed=function(){if(self.status===C.STATUS_TERMINATED){return;}
self.failed('local',null,JsSIP.C.causes.WEBRTC_ERROR);},offerCreationSucceeded=function(offer){if(self.isCanceled||self.status===C.STATUS_TERMINATED){return;}
self.request.body=offer;self.status=C.STATUS_INVITE_SENT;request_sender.send();},offerCreationFailed=function(){if(self.status===C.STATUS_TERMINATED){return;}
self.failed('local',null,JsSIP.C.causes.WEBRTC_ERROR);};this.rtcMediaHandler.getUserMedia(userMediaSucceeded,userMediaFailed,constraints);};RTCSession.prototype.receiveResponse=function(response){var cause,session=this;if(this.status!==C.STATUS_INVITE_SENT&&this.status!==C.STATUS_1XX_RECEIVED){return;}
if(this.isCanceled){if(response.status_code>=100&&response.status_code<200){this.request.cancel(this.cancelReason);}else if(response.status_code>=200&&response.status_code<299){this.acceptAndTerminate(response);}
return;}
switch(true){case/^100$/.test(response.status_code):this.received_100=true;break;case/^1[0-9]{2}$/.test(response.status_code):if(!response.to_tag){console.warn(LOG_PREFIX+'1xx response received without to tag');break;}
if(response.hasHeader('contact')){this.createDialog(response,'UAC',true);}
this.status=C.STATUS_1XX_RECEIVED;this.progress('remote',response);break;
case/^2[0-9]{2}$/.test(response.status_code):if(this.dialog){break;}
if(!response.body){this.acceptAndTerminate(response,400,'Missing session description');this.failed('remote',response,JsSIP.C.causes.BAD_MEDIA_DESCRIPTION);break;}
this.rtcMediaHandler.onMessage('answer',response.body,function(){if(!session.createDialog(response,'UAC')){return;}
session.sendACK();session.status=C.STATUS_CONFIRMED;session.started('remote',response);},function(e){console.warn(e);session.acceptAndTerminate(response,488,'Not Acceptable Here');session.failed('remote',response,JsSIP.C.causes.BAD_MEDIA_DESCRIPTION);});break;default:cause=JsSIP.Utils.sipErrorCause(response.status_code);this.failed('remote',response,cause);}};RTCSession.prototype.acceptAndTerminate=function(response,status_code,reason_phrase){if(this.dialog||this.createDialog(response,'UAC')){this.sendACK();this.sendBye({status_code:status_code,reason_phrase:reason_phrase});}};RTCSession.prototype.sendACK=function(){var request=this.dialog.createRequest(JsSIP.C.ACK);this.sendRequest(request);};RTCSession.prototype.sendBye=function(options){options=options||{};var request,reason,status_code=options.status_code,reason_phrase=options.reason_phrase||JsSIP.C.REASON_PHRASE[status_code]||'',extraHeaders=options.extraHeaders||[],body=options.body;if(status_code&&(status_code<200||status_code>=700)){throw new TypeError('Invalid status_code: '+status_code);}else if(status_code){reason='SIP ;cause='+status_code+'; text="'+reason_phrase+'"';extraHeaders.push('Reason: '+reason);}
request=this.dialog.createRequest(JsSIP.C.BYE,extraHeaders);request.body=body;this.sendRequest(request);};RTCSession.prototype.sendRequest=function(request){var request_sender=new RequestSender(this,request);request_sender.send();};RTCSession.prototype.onTransportError=function(){if(this.status!==C.STATUS_TERMINATED){if(this.status===C.STATUS_CONFIRMED){this.ended('system',null,JsSIP.C.causes.CONNECTION_ERROR);}else{this.failed('system',null,JsSIP.C.causes.CONNECTION_ERROR);}}};RTCSession.prototype.onRequestTimeout=function(){if(this.status!==C.STATUS_TERMINATED){if(this.status===C.STATUS_CONFIRMED){this.ended('system',null,JsSIP.C.causes.REQUEST_TIMEOUT);}else{this.failed('system',null,JsSIP.C.causes.CONNECTION_ERROR);}}};RTCSession.prototype.newRTCSession=function(originator,request){var session=this,event_name='newRTCSession';if(originator==='remote'){session.direction='incoming';session.local_identity=request.to;session.remote_identity=request.from;}else if(originator==='local'){session.direction='outgoing';session.local_identity=request.from;session.remote_identity=request.to;}
session.ua.emit(event_name,session.ua,{originator:originator,session:session,request:request});};RTCSession.prototype.connecting=function(originator,request){var session=this,event_name='connecting';session.emit(event_name,session,{originator:'local',request:request});};RTCSession.prototype.progress=function(originator,response){var session=this,event_name='progress';session.emit(event_name,session,{originator:originator,response:response||null});};RTCSession.prototype.started=function(originator,message){var session=this,event_name='started';session.start_time=new Date();session.emit(event_name,session,{response:message||null});};RTCSession.prototype.ended=function(originator,message,cause){var session=this,event_name='ended';session.end_time=new Date();session.close();session.emit(event_name,session,{originator:originator,message:message||null,cause:cause});};RTCSession.prototype.failed=function(originator,message,cause){var session=this,event_name='failed';session.close();session.emit(event_name,session,{originator:originator,message:message||null,cause:cause});};RTCSession.C=C;JsSIP.RTCSession=RTCSession;}(JsSIP));(function(JsSIP){var Message;Message=function(ua){this.ua=ua;this.direction=null;this.local_identity=null;this.remote_identity=null;this.data={};};Message.prototype=new JsSIP.EventEmitter();Message.prototype.send=function(target,body,options){var request_sender,event,contentType,eventHandlers,extraHeaders,events=['succeeded','failed'],invalidTarget=false;if(target===undefined||body===undefined){throw new TypeError('Not enough arguments');}
this.initEvents(events);options=options||{};extraHeaders=options.extraHeaders||[];eventHandlers=options.eventHandlers||{};contentType=options.contentType||'text/plain';for(event in eventHandlers){this.on(event,eventHandlers[event]);}
try{target=JsSIP.Utils.normalizeURI(target,this.ua.configuration.hostport_params);}catch(e){target=JsSIP.URI.parse(JsSIP.C.INVALID_TARGET_URI);invalidTarget=true;}
this.direction='outgoing';this.local_identity=this.ua.configuration.uri;this.remote_identity=target;this.closed=false;this.ua.applicants[this]=this;extraHeaders.push('Content-Type: '+contentType);this.request=new JsSIP.OutgoingRequest(JsSIP.C.MESSAGE,target,this.ua,null,extraHeaders);if(body){this.request.body=body;}
request_sender=new JsSIP.RequestSender(this,this.ua);this.ua.emit('newMessage',this.ua,{originator:'local',message:this,request:this.request});if(invalidTarget){this.emit('failed',this,{originator:'local',cause:JsSIP.C.causes.INVALID_TARGET});}else{request_sender.send();}};Message.prototype.receiveResponse=function(response){var cause;if(this.closed){return;}
switch(true){case/^1[0-9]{2}$/.test(response.status_code):break;case/^2[0-9]{2}$/.test(response.status_code):delete this.ua.applicants[this];this.emit('succeeded',this,{originator:'remote',response:response});break;default:delete this.ua.applicants[this];cause=JsSIP.Utils.sipErrorCause(response.status_code);this.emit('failed',this,{originator:'remote',response:response,cause:cause});break;}};Message.prototype.onRequestTimeout=function(){if(this.closed){return;}
this.emit('failed',this,{originator:'system',cause:JsSIP.C.causes.REQUEST_TIMEOUT});};Message.prototype.onTransportError=function(){if(this.closed){return;}
this.emit('failed',this,{originator:'system',cause:JsSIP.C.causes.CONNECTION_ERROR});};Message.prototype.close=function(){this.closed=true;delete this.ua.applicants[this];};Message.prototype.init_incoming=function(request){var transaction,contentType=request.getHeader('content-type');this.direction='incoming';this.request=request;this.local_identity=request.to.uri;this.remote_identity=request.from.uri;if(contentType&&(contentType.match(/^text\/plain(\s*;\s*.+)*$/i)||contentType.match(/^text\/html(\s*;\s*.+)*$/i))){this.ua.emit('newMessage',this.ua,{originator:'remote',message:this,request:request});transaction=this.ua.transactions.nist[request.via_branch];if(transaction&&(transaction.state===JsSIP.Transactions.C.STATUS_TRYING||transaction.state===JsSIP.Transactions.C.STATUS_PROCEEDING)){ request.reply(200);}}else{request.reply(415,null,['Accept: text/plain, text/html']);}};Message.prototype.accept=function(options){options=options||{};var
extraHeaders=options.extraHeaders||[],body=options.body;if(this.direction!=='incoming'){throw new TypeError('Invalid method "accept" for an outgoing message');}
this.request.reply(200,null,extraHeaders,body);};Message.prototype.reject=function(options){options=options||{};var
status_code=options.status_code||480,reason_phrase=options.reason_phrase,extraHeaders=options.extraHeaders||[],body=options.body;if(this.direction!=='incoming'){throw new TypeError('Invalid method "reject" for an outgoing message');}
if(status_code<300||status_code>=700){throw new TypeError('Invalid status_code: '+status_code);}
this.request.reply(status_code,reason_phrase,extraHeaders,body);};JsSIP.Message=Message;}(JsSIP));(function(JsSIP){var UA,LOG_PREFIX=JsSIP.name+' | '+'UA'+' | ',C={STATUS_INIT:0,STATUS_READY:1,STATUS_USER_CLOSED:2,STATUS_NOT_READY:3,CONFIGURATION_ERROR:1,NETWORK_ERROR:2,EVENT_METHODS:{'newRTCSession':'INVITE','newMessage':'MESSAGE'},ALLOWED_METHODS:['ACK','CANCEL','BYE','OPTIONS'],ACCEPTED_BODY_TYPES:['application/sdp','application/dtmf-relay'],SUPPORTED:'path, outbound, gruu',MAX_FORWARDS:69,TAG_LENGTH:10};UA=function(configuration){var events=['connected','disconnected','registered','unregistered','registrationFailed','newRTCSession','newMessage'];C.ACCEPTED_BODY_TYPES=C.ACCEPTED_BODY_TYPES.toString();this.cache={credentials:{}};this.configuration={};this.dialogs={};this.registrator=null;this.applicants={};this.sessions={};this.transport=null;this.contact=null;this.status=C.STATUS_INIT;this.error=null;this.transactions={nist:{},nict:{},ist:{},ict:{}};this.transportRecoverAttempts=0;if(configuration===undefined){throw new TypeError('Not enough arguments');}
try{this.loadConfig(configuration);this.initEvents(events);}catch(e){this.status=C.STATUS_NOT_READY;this.error=C.CONFIGURATION_ERROR;throw e;}};UA.prototype=new JsSIP.EventEmitter();UA.prototype.register=function(options){this.configuration.register=true;this.registrator.register(options);};UA.prototype.unregister=function(options){this.configuration.register=false;this.registrator.unregister(options);};UA.prototype.isRegistered=function(){if(this.registrator&&this.registrator.registered){return true;}else{return false;}};UA.prototype.isConnected=function(){if(this.transport){return this.transport.connected;}else{return false;}};UA.prototype.call=function(target,options){var session;session=new JsSIP.RTCSession(this);session.connect(target,options);};UA.prototype.sendMessage=function(target,body,options){var message;message=new JsSIP.Message(this);message.send(target,body,options);};UA.prototype.stop=function(){var session,applicant,ua=this;console.log(LOG_PREFIX+'user requested closure...');if(this.status===C.STATUS_USER_CLOSED){console.warn('UA already closed');return;}
if(this.registrator){console.log(LOG_PREFIX+'closing registrator');this.registrator.close();}
for(session in this.sessions){console.log(LOG_PREFIX+'closing session '+session);this.sessions[session].terminate();}
for(applicant in this.applicants){this.applicants[applicant].close();}
this.status=C.STATUS_USER_CLOSED;this.shutdownGraceTimer=window.setTimeout(function(){ua.transport.disconnect();},'5000');};UA.prototype.start=function(){var server;console.log(LOG_PREFIX+'user requested startup...');if(this.status===C.STATUS_INIT){server=this.getNextWsServer();new JsSIP.Transport(this,server);}else if(this.status===C.STATUS_USER_CLOSED){console.log(LOG_PREFIX+'resuming');this.status=C.STATUS_READY;this.transport.connect();}else if(this.status===C.STATUS_READY){console.log(LOG_PREFIX+'UA is in READY status, not resuming');}else{console.error('Connection is down. Auto-Recovery system is trying to connect');}};UA.prototype.saveCredentials=function(credentials){this.cache.credentials[credentials.realm]=this.cache.credentials[credentials.realm]||{};this.cache.credentials[credentials.realm][credentials.uri]=credentials;};UA.prototype.getCredentials=function(request){var realm,credentials;realm=request.ruri.host;if(this.cache.credentials[realm]&&this.cache.credentials[realm][request.ruri]){credentials=this.cache.credentials[realm][request.ruri];credentials.method=request.method;}
return credentials;};UA.prototype.onTransportClosed=function(transport){var type,idx, client_transactions=['nict','ict','nist','ist'];transport.server.status=JsSIP.Transport.C.STATUS_DISCONNECTED;console.log(LOG_PREFIX+'connection state set to '+JsSIP.Transport.C.STATUS_DISCONNECTED);for(type in client_transactions){for(idx in this.transactions[client_transactions[type]]){this.transactions[client_transactions[type]][idx].onTransportError();}}
if(!this.contact.pub_gruu){this.closeSessionsOnTransportError();}};UA.prototype.onTransportError=function(transport){var server;console.log(LOG_PREFIX+'transport '+transport.server.ws_uri+' failed | connection state set to '+JsSIP.Transport.C.STATUS_ERROR);transport.server.status=JsSIP.Transport.C.STATUS_ERROR;this.emit('disconnected',this,{transport:transport,code:transport.lastTransportError.code,reason:transport.lastTransportError.reason});server=this.getNextWsServer();if(server){new JsSIP.Transport(this,server);}else{this.closeSessionsOnTransportError();if(!this.error||this.error!==C.NETWORK_ERROR){this.status=C.STATUS_NOT_READY;this.error=C.NETWORK_ERROR;}
this.recoverTransport();}};UA.prototype.onTransportConnected=function(transport){this.transport=transport;this.transportRecoverAttempts=0;transport.server.status=JsSIP.Transport.C.STATUS_READY;console.log(LOG_PREFIX+'connection state set to '+JsSIP.Transport.C.STATUS_READY);if(this.status===C.STATUS_USER_CLOSED){return;}
this.status=C.STATUS_READY;this.error=null;this.emit('connected',this,{transport:transport});if(this.configuration.register){if(this.registrator){this.registrator.onTransportConnected();}else{this.registrator=new JsSIP.Registrator(this,transport);this.register();}}else{this.registrator=new JsSIP.Registrator(this,transport);}};UA.prototype.receiveRequest=function(request){var dialog,session,message,method=request.method;if(request.ruri.user!==this.configuration.uri.user&&request.ruri.user!==this.contact.uri.user){console.warn(LOG_PREFIX+'Request-URI does not point to us');if(request.method!==JsSIP.C.ACK){request.reply_sl(404);}
return;}
if(JsSIP.Transactions.checkTransaction(this,request)){return;}
if(method===JsSIP.C.INVITE){new JsSIP.Transactions.InviteServerTransaction(request,this);}else if(method!==JsSIP.C.ACK){new JsSIP.Transactions.NonInviteServerTransaction(request,this);}
if(method===JsSIP.C.OPTIONS){request.reply(200,null,['Allow: '+JsSIP.Utils.getAllowedMethods(this),'Accept: '+C.ACCEPTED_BODY_TYPES]);}else if(method===JsSIP.C.MESSAGE){if(!this.checkEvent('newMessage')||this.listeners('newMessage').length===0){request.reply(405,null,['Allow: '+JsSIP.Utils.getAllowedMethods(this)]);return;}
message=new JsSIP.Message(this);message.init_incoming(request);}//
if(!request.to_tag){if(!this.isRegistered()){request.reply(410);return;}
switch(method){case JsSIP.C.INVITE:if(JsSIP.WebRTC.isSupported){session=new JsSIP.RTCSession(this);session.init_incoming(request);}else{console.warn(LOG_PREFIX+'INVITE received but WebRTC is not supported');request.reply(488);}
break;case JsSIP.C.BYE:request.reply(481);break;case JsSIP.C.CANCEL:request.reply(200);session=this.findSession(request);if(session){session.receiveRequest(request);}else{console.warn(LOG_PREFIX+'received CANCEL request for a non existent session');}
break;case JsSIP.C.ACK:break;default:request.reply(405);break;}}//
else{dialog=this.findDialog(request);if(dialog){dialog.receiveRequest(request);}else if(method===JsSIP.C.NOTIFY){session=this.findSession(request);if(session){session.receiveRequest(request);}else{console.warn(LOG_PREFIX+'received NOTIFY request for a non existent session');request.reply(481,'Subscription does not exist');}}
else{if(method!==JsSIP.C.ACK){request.reply(481);}}}};UA.prototype.findSession=function(request){var
sessionIDa=request.call_id+request.from_tag,sessionA=this.sessions[sessionIDa],sessionIDb=request.call_id+request.to_tag,sessionB=this.sessions[sessionIDb];if(sessionA){return sessionA;}else if(sessionB){return sessionB;}else{return null;}};UA.prototype.findDialog=function(request){var
id=request.call_id+request.from_tag+request.to_tag,dialog=this.dialogs[id];if(dialog){return dialog;}else{id=request.call_id+request.to_tag+request.from_tag;dialog=this.dialogs[id];if(dialog){return dialog;}else{return null;}}};UA.prototype.getNextWsServer=function(){var idx,ws_server,candidates=[];for(idx in this.configuration.ws_servers){ws_server=this.configuration.ws_servers[idx];if(ws_server.status===JsSIP.Transport.C.STATUS_ERROR){continue;}else if(candidates.length===0){candidates.push(ws_server);}else if(ws_server.weight>candidates[0].weight){candidates=[ws_server];}else if(ws_server.weight===candidates[0].weight){candidates.push(ws_server);}}
idx=Math.floor((Math.random()*candidates.length));return candidates[idx];};UA.prototype.closeSessionsOnTransportError=function(){var idx;for(idx in this.sessions){this.sessions[idx].onTransportError();}
if(this.registrator){this.registrator.onTransportClosed();}};UA.prototype.recoverTransport=function(ua){var idx,k,nextRetry,count,server;ua=ua||this;count=ua.transportRecoverAttempts;for(idx in ua.configuration.ws_servers){ua.configuration.ws_servers[idx].status=0;}
server=ua.getNextWsServer();k=Math.floor((Math.random()*Math.pow(2,count))+1);nextRetry=k*ua.configuration.connection_recovery_min_interval;if(nextRetry>ua.configuration.connection_recovery_max_interval){console.log(LOG_PREFIX+'time for next connection attempt exceeds connection_recovery_max_interval, resetting counter');nextRetry=ua.configuration.connection_recovery_min_interval;count=0;}
console.log(LOG_PREFIX+'next connection attempt in '+nextRetry+' seconds');window.setTimeout(function(){ua.transportRecoverAttempts=count+1;new JsSIP.Transport(ua,server);},nextRetry*1000);};UA.prototype.loadConfig=function(configuration){var parameter,value,checked_value,hostport_params,registrar_server,settings={via_host:JsSIP.Utils.createRandomToken(12)+'.invalid',password:null,register_expires:600,register_min_expires:120,register:true,registrar_server:null,ws_server_max_reconnection:3,ws_server_reconnection_timeout:4,connection_recovery_min_interval:2,connection_recovery_max_interval:30,use_preloaded_route:false,no_answer_timeout:60,stun_servers:['stun:stun.l.google.com:19302'],turn_servers:[],trace_sip:false,hack_via_tcp:false,hack_ip_in_contact:false};for(parameter in UA.configuration_check.mandatory){if(!configuration.hasOwnProperty(parameter)){throw new JsSIP.Exceptions.ConfigurationError(parameter);}else{value=configuration[parameter];checked_value=UA.configuration_check.mandatory[parameter](value);if(checked_value!==undefined){settings[parameter]=checked_value;}else{throw new JsSIP.Exceptions.ConfigurationError(parameter,value);}}}
for(parameter in UA.configuration_check.optional){if(configuration.hasOwnProperty(parameter)){value=configuration[parameter];if(value===null||value===""||value===undefined){continue;}
else if(typeof(value)==='number'&&window.isNaN(value)){continue;}
checked_value=UA.configuration_check.optional[parameter](value);if(checked_value!==undefined){settings[parameter]=checked_value;}else{throw new JsSIP.Exceptions.ConfigurationError(parameter,value);}}}
if(settings.connection_recovery_max_interval<settings.connection_recovery_min_interval){throw new JsSIP.Exceptions.ConfigurationError('connection_recovery_max_interval',settings.connection_recovery_max_interval);}
if(settings.display_name===0){settings.display_name='0';}
settings.instance_id=JsSIP.Utils.newUUID();settings.jssip_id=JsSIP.Utils.createRandomToken(5);hostport_params=settings.uri.clone();hostport_params.user=null;settings.hostport_params=hostport_params.toString().replace(/^sip:/i,'');if(!settings.authorization_user){settings.authorization_user=settings.uri.user;}
if(!settings.registrar_server){registrar_server=settings.uri.clone();registrar_server.user=null;settings.registrar_server=registrar_server;}
settings.no_answer_timeout=settings.no_answer_timeout*1000;if(settings.hack_ip_in_contact){settings.via_host=JsSIP.Utils.getRandomTestNetIP();}
this.contact={pub_gruu:null,temp_gruu:null,uri:new JsSIP.URI('sip',JsSIP.Utils.createRandomToken(8),settings.via_host,null,{transport:'ws'}),toString:function(options){options=options||{};var
anonymous=options.anonymous||null,outbound =options.outbound||null,contact='<';if(anonymous){contact+=this.temp_gruu||'sip:anonymous@anonymous.invalid;transport=ws';}else{contact+=this.pub_gruu||this.uri.toString();}
if(outbound){contact+=';ob';}
contact+='>';return contact;}};console.log(LOG_PREFIX+'configuration parameters after validation:');for(parameter in settings){switch(parameter){case 'uri':case 'registrar_server':console.log('· '+parameter+': '+settings[parameter]);break;default:console.log('· '+parameter+': '+window.JSON.stringify(settings[parameter]));}
UA.configuration_skeleton[parameter].value=settings[parameter];}
Object.defineProperties(this.configuration,UA.configuration_skeleton);for(parameter in settings){UA.configuration_skeleton[parameter].value='';}
return;};UA.configuration_skeleton=(function(){var idx,parameter,skeleton={},parameters=["instance_id","jssip_id","register_min_expires","ws_server_max_reconnection","ws_server_reconnection_timeout","hostport_params","uri","ws_servers","authorization_user","connection_recovery_max_interval","connection_recovery_min_interval","display_name","hack_via_tcp","hack_ip_in_contact","no_answer_timeout","password","register_expires","registrar_server","stun_servers","trace_sip","turn_servers","use_preloaded_route","via_core_value","via_host"];for(idx in parameters){parameter=parameters[idx];skeleton[parameter]={value:'',writable:false,configurable:false};}
skeleton['register']={value:'',writable:true,configurable:false};return skeleton;}());UA.configuration_check={mandatory:{uri:function(uri){var parsed;if(!/^sip:/i.test(uri)){uri=JsSIP.C.SIP+':'+uri;}
parsed=JsSIP.URI.parse(uri);if(!parsed){return;}else if(!parsed.user){return;}else{return parsed;}},ws_servers:function(ws_servers){var idx,url;if(typeof ws_servers==='string'){ws_servers=[{ws_uri:ws_servers}];}else if(ws_servers instanceof Array){for(idx in ws_servers){if(typeof ws_servers[idx]==='string'){ws_servers[idx]={ws_uri:ws_servers[idx]};}}}else{return;}
if(ws_servers.length===0){return false;}
for(idx in ws_servers){if(!ws_servers[idx].ws_uri){console.error(LOG_PREFIX+'missing "ws_uri" attribute in ws_servers parameter');return;}
if(ws_servers[idx].weight&&!Number(ws_servers[idx].weight)){console.error(LOG_PREFIX+'"weight" attribute in ws_servers parameter must be a Number');return;}
url=JsSIP.Grammar.parse(ws_servers[idx].ws_uri,'absoluteURI');if(url===-1){console.error(LOG_PREFIX+'invalid "ws_uri" attribute in ws_servers parameter: '+ws_servers[idx].ws_uri);return;}else if(url.scheme!=='wss'&&url.scheme!=='ws'){console.error(LOG_PREFIX+'invalid URI scheme in ws_servers parameter: '+url.scheme);return;}else{ws_servers[idx].sip_uri='<sip:'+url.host+(url.port?':'+url.port:'')+';transport=ws;lr>';if(!ws_servers[idx].weight){ws_servers[idx].weight=0;}
ws_servers[idx].status=0;ws_servers[idx].scheme=url.scheme.toUpperCase();}}
return ws_servers;}},optional:{authorization_user:function(authorization_user){if(JsSIP.Grammar.parse('"'+authorization_user+'"','quoted_string')===-1){return;}else{return authorization_user;}},connection_recovery_max_interval:function(connection_recovery_max_interval){var value;if(JsSIP.Utils.isDecimal(connection_recovery_max_interval)){value=window.Number(connection_recovery_max_interval);if(value>0){return value;}}},connection_recovery_min_interval:function(connection_recovery_min_interval){var value;if(JsSIP.Utils.isDecimal(connection_recovery_min_interval)){value=window.Number(connection_recovery_min_interval);if(value>0){return value;}}},display_name:function(display_name){if(JsSIP.Grammar.parse('"'+display_name+'"','display_name')===-1){return;}else{return display_name;}},hack_via_tcp:function(hack_via_tcp){if(typeof hack_via_tcp==='boolean'){return hack_via_tcp;}},hack_ip_in_contact:function(hack_ip_in_contact){if(typeof hack_ip_in_contact==='boolean'){return hack_ip_in_contact;}},no_answer_timeout:function(no_answer_timeout){var value;if(JsSIP.Utils.isDecimal(no_answer_timeout)){value=window.Number(no_answer_timeout);if(value>0){return value;}}},password:function(password){return String(password);},register:function(register){if(typeof register==='boolean'){return register;}},register_expires:function(register_expires){var value;if(JsSIP.Utils.isDecimal(register_expires)){value=window.Number(register_expires);if(value>0){return value;}}},registrar_server:function(registrar_server){var parsed;if(!/^sip:/i.test(registrar_server)){registrar_server=JsSIP.C.SIP+':'+registrar_server;}
parsed=JsSIP.URI.parse(registrar_server);if(!parsed){return;}else if(parsed.user){return;}else{return parsed;}},stun_servers:function(stun_servers){var idx,stun_server;if(typeof stun_servers==='string'){stun_servers=[stun_servers];}else if(!(stun_servers instanceof Array)){return;}
for(idx in stun_servers){stun_server=stun_servers[idx];if(!(/^stuns?:/.test(stun_server))){stun_server='stun:'+stun_server;}
if(JsSIP.Grammar.parse(stun_server,'stun_URI')===-1){return;}else{stun_servers[idx]=stun_server;}}
return stun_servers;},trace_sip:function(trace_sip){if(typeof trace_sip==='boolean'){return trace_sip;}},turn_servers:function(turn_servers){var idx,turn_server;if(turn_servers instanceof Array){}else{turn_servers=[turn_servers];}
for(idx in turn_servers){turn_server=turn_servers[idx];if(!turn_server.server||!turn_server.username||!turn_server.password){return;}else if(!(/^turns?:/.test(turn_server.server))){turn_server.server='turn:'+turn_server.server;}
if(JsSIP.Grammar.parse(turn_server.server,'turn_URI')===-1){return;}else if(JsSIP.Grammar.parse(turn_server.username,'user')===-1){return;}else if(JsSIP.Grammar.parse(turn_server.password,'password')===-1){return;}}
return turn_servers;},use_preloaded_route:function(use_preloaded_route){if(typeof use_preloaded_route==='boolean'){return use_preloaded_route;}}}};UA.C=C;JsSIP.UA=UA;}(JsSIP));(function(JsSIP){var Utils;Utils={str_utf8_length:function(string){return window.unescape(encodeURIComponent(string)).length;},isFunction:function(fn){if(fn!==undefined){return(Object.prototype.toString.call(fn)==='[object Function]')?true:false;}else{return false;}},isDecimal:function(num){return!isNaN(num)&&(parseFloat(num)===parseInt(num,10));},createRandomToken:function(size,base){var i,r,token='';base=base||32;for(i=0;i<size;i++){r=Math.random()*base|0;token+=r.toString(base);}
return token;},newTag:function(){return JsSIP.Utils.createRandomToken(JsSIP.UA.C.TAG_LENGTH);},newUUID:function(){var UUID='xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c){var r=Math.random()*16|0,v=c==='x'?r:(r&0x3|0x8);return v.toString(16);});return UUID;},hostType:function(host){if(!host){return;}else{host=JsSIP.Grammar.parse(host,'host');if(host!==-1){return host.host_type;}}},normalizeURI:function(target,domain){var uri,target_array,target_user,target_domain,original_target=target;if(!target){throw new JsSIP.Exceptions.InvalidTargetError(original_target);}else if(target instanceof JsSIP.URI){return target;}else if(typeof target==='string'){target_array=target.split('@');switch(target_array.length){case 1:if(!domain){throw new JsSIP.Exceptions.InvalidTargetError(original_target);}
target_user=target;target_domain=domain;break;case 2:target_user=target_array[0];target_domain=target_array[1];break;default:target_user=target_array.slice(0,target_array.length-1).join('@');target_domain=target_array[target_array.length-1];}
target_user=target_user.replace(/^(sips?|tel):/i,'');if(/^[\-\.\(\)]*\+?[0-9\-\.\(\)]+$/.test(target_user)){target_user=target_user.replace(/[\-\.\(\)]/g,'');}
target=JsSIP.C.SIP+':'+JsSIP.Utils.escapeUser(target_user)+'@'+target_domain;if(uri=JsSIP.URI.parse(target)){return uri;}else{throw new JsSIP.Exceptions.InvalidTargetError(original_target);}}
else{throw new JsSIP.Exceptions.InvalidTargetError(original_target);}},escapeUser:function(user){return window.encodeURIComponent(window.decodeURIComponent(user)).replace(/%3A/ig,':').replace(/%2B/ig,'+').replace(/%3F/ig,'?').replace(/%2F/ig,'/');},headerize:function(string){var exceptions={'Call-Id':'Call-ID','Cseq':'CSeq','Www-Authenticate':'WWW-Authenticate'},name=string.toLowerCase().replace(/_/g,'-').split('-'),hname='',part;for(part in name){if(part!=='0'){hname+='-';}
hname+=name[part].charAt(0).toUpperCase()+name[part].substring(1);}
if(exceptions[hname]){hname=exceptions[hname];}
return hname;},sipErrorCause:function(status_code){var cause;for(cause in JsSIP.C.SIP_ERROR_CAUSES){if(JsSIP.C.SIP_ERROR_CAUSES[cause].indexOf(status_code)!==-1){return JsSIP.C.causes[cause];}}
return JsSIP.C.causes.SIP_FAILURE_CODE;},/**/
getRandomTestNetIP:function(){function getOctet(from,to){return window.Math.floor(window.Math.random()*(to-from+1)+from);}
return '192.0.2.'+getOctet(1,254);},getAllowedMethods:function(ua){var event,allowed=JsSIP.UA.C.ALLOWED_METHODS.toString();for(event in JsSIP.UA.C.EVENT_METHODS){if(ua.checkEvent(event)&&ua.listeners(event).length>0){allowed+=','+JsSIP.UA.C.EVENT_METHODS[event];}}
return allowed;},calculateMD5:function(string){function RotateLeft(lValue,iShiftBits){return(lValue<<iShiftBits)|(lValue>>>(32-iShiftBits));}
function AddUnsigned(lX,lY){var lX4,lY4,lX8,lY8,lResult;lX8=(lX&0x80000000);lY8=(lY&0x80000000);lX4=(lX&0x40000000);lY4=(lY&0x40000000);lResult=(lX&0x3FFFFFFF)+(lY&0x3FFFFFFF);if(lX4&lY4){return(lResult^0x80000000^lX8^lY8);}
if(lX4|lY4){if(lResult&0x40000000){return(lResult^0xC0000000^lX8^lY8);}else{return(lResult^0x40000000^lX8^lY8);}}else{return(lResult^lX8^lY8);}}
function F(x,y,z){return(x&y)|((~x)&z);}
function G(x,y,z){return(x&z)|(y&(~z));}
function H(x,y,z){return(x^y^z);}
function I(x,y,z){return(y^(x|(~z)));}
function FF(a,b,c,d,x,s,ac){a=AddUnsigned(a,AddUnsigned(AddUnsigned(F(b,c,d),x),ac));return AddUnsigned(RotateLeft(a,s),b);}
function GG(a,b,c,d,x,s,ac){a=AddUnsigned(a,AddUnsigned(AddUnsigned(G(b,c,d),x),ac));return AddUnsigned(RotateLeft(a,s),b);}
function HH(a,b,c,d,x,s,ac){a=AddUnsigned(a,AddUnsigned(AddUnsigned(H(b,c,d),x),ac));return AddUnsigned(RotateLeft(a,s),b);}
function II(a,b,c,d,x,s,ac){a=AddUnsigned(a,AddUnsigned(AddUnsigned(I(b,c,d),x),ac));return AddUnsigned(RotateLeft(a,s),b);}
function ConvertToWordArray(string){var lWordCount;var lMessageLength=string.length;var lNumberOfWords_temp1=lMessageLength+8;var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1%64))/64;var lNumberOfWords=(lNumberOfWords_temp2+1)*16;var lWordArray=Array(lNumberOfWords-1);var lBytePosition=0;var lByteCount=0;while(lByteCount<lMessageLength){lWordCount=(lByteCount-(lByteCount%4))/4;lBytePosition=(lByteCount%4)*8;lWordArray[lWordCount]=(lWordArray[lWordCount]|(string.charCodeAt(lByteCount)<<lBytePosition));lByteCount++;}
lWordCount=(lByteCount-(lByteCount%4))/4;lBytePosition=(lByteCount%4)*8;lWordArray[lWordCount]=lWordArray[lWordCount]|(0x80<<lBytePosition);lWordArray[lNumberOfWords-2]=lMessageLength<<3;lWordArray[lNumberOfWords-1]=lMessageLength>>>29;return lWordArray;}
function WordToHex(lValue){var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;for(lCount=0;lCount<=3;lCount++){lByte=(lValue>>>(lCount*8))&255;WordToHexValue_temp="0"+lByte.toString(16);WordToHexValue=WordToHexValue+WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);}
return WordToHexValue;}
function Utf8Encode(string){string=string.replace(/\r\n/g,"\n");var utftext="";for(var n=0;n<string.length;n++){var c=string.charCodeAt(n);if(c<128){utftext+=String.fromCharCode(c);}
else if((c>127)&&(c<2048)){utftext+=String.fromCharCode((c>>6)|192);utftext+=String.fromCharCode((c&63)|128);}
else{utftext+=String.fromCharCode((c>>12)|224);utftext+=String.fromCharCode(((c>>6)&63)|128);utftext+=String.fromCharCode((c&63)|128);}}
return utftext;}
var x=[];var k,AA,BB,CC,DD,a,b,c,d;var S11=7,S12=12,S13=17,S14=22;var S21=5,S22=9,S23=14,S24=20;var S31=4,S32=11,S33=16,S34=23;var S41=6,S42=10,S43=15,S44=21;string=Utf8Encode(string);x=ConvertToWordArray(string);a=0x67452301;b=0xEFCDAB89;c=0x98BADCFE;d=0x10325476;for(k=0;k<x.length;k+=16){AA=a;BB=b;CC=c;DD=d;a=FF(a,b,c,d,x[k+0],S11,0xD76AA478);d=FF(d,a,b,c,x[k+1],S12,0xE8C7B756);c=FF(c,d,a,b,x[k+2],S13,0x242070DB);b=FF(b,c,d,a,x[k+3],S14,0xC1BDCEEE);a=FF(a,b,c,d,x[k+4],S11,0xF57C0FAF);d=FF(d,a,b,c,x[k+5],S12,0x4787C62A);c=FF(c,d,a,b,x[k+6],S13,0xA8304613);b=FF(b,c,d,a,x[k+7],S14,0xFD469501);a=FF(a,b,c,d,x[k+8],S11,0x698098D8);d=FF(d,a,b,c,x[k+9],S12,0x8B44F7AF);c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);a=FF(a,b,c,d,x[k+12],S11,0x6B901122);d=FF(d,a,b,c,x[k+13],S12,0xFD987193);c=FF(c,d,a,b,x[k+14],S13,0xA679438E);b=FF(b,c,d,a,x[k+15],S14,0x49B40821);a=GG(a,b,c,d,x[k+1],S21,0xF61E2562);d=GG(d,a,b,c,x[k+6],S22,0xC040B340);c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);b=GG(b,c,d,a,x[k+0],S24,0xE9B6C7AA);a=GG(a,b,c,d,x[k+5],S21,0xD62F105D);d=GG(d,a,b,c,x[k+10],S22,0x2441453);c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);b=GG(b,c,d,a,x[k+4],S24,0xE7D3FBC8);a=GG(a,b,c,d,x[k+9],S21,0x21E1CDE6);d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);c=GG(c,d,a,b,x[k+3],S23,0xF4D50D87);b=GG(b,c,d,a,x[k+8],S24,0x455A14ED);a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);d=GG(d,a,b,c,x[k+2],S22,0xFCEFA3F8);c=GG(c,d,a,b,x[k+7],S23,0x676F02D9);b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);a=HH(a,b,c,d,x[k+5],S31,0xFFFA3942);d=HH(d,a,b,c,x[k+8],S32,0x8771F681);c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);a=HH(a,b,c,d,x[k+1],S31,0xA4BEEA44);d=HH(d,a,b,c,x[k+4],S32,0x4BDECFA9);c=HH(c,d,a,b,x[k+7],S33,0xF6BB4B60);b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);d=HH(d,a,b,c,x[k+0],S32,0xEAA127FA);c=HH(c,d,a,b,x[k+3],S33,0xD4EF3085);b=HH(b,c,d,a,x[k+6],S34,0x4881D05);a=HH(a,b,c,d,x[k+9],S31,0xD9D4D039);d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);b=HH(b,c,d,a,x[k+2],S34,0xC4AC5665);a=II(a,b,c,d,x[k+0],S41,0xF4292244);d=II(d,a,b,c,x[k+7],S42,0x432AFF97);c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);b=II(b,c,d,a,x[k+5],S44,0xFC93A039);a=II(a,b,c,d,x[k+12],S41,0x655B59C3);d=II(d,a,b,c,x[k+3],S42,0x8F0CCC92);c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);b=II(b,c,d,a,x[k+1],S44,0x85845DD1);a=II(a,b,c,d,x[k+8],S41,0x6FA87E4F);d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);c=II(c,d,a,b,x[k+6],S43,0xA3014314);b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);a=II(a,b,c,d,x[k+4],S41,0xF7537E82);d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);c=II(c,d,a,b,x[k+2],S43,0x2AD7D2BB);b=II(b,c,d,a,x[k+9],S44,0xEB86D391);a=AddUnsigned(a,AA);b=AddUnsigned(b,BB);c=AddUnsigned(c,CC);d=AddUnsigned(d,DD);}
var temp=WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);return temp.toLowerCase();}};JsSIP.Utils=Utils;}(JsSIP));(function(JsSIP){var sanityCheck,LOG_PREFIX=JsSIP.name+' | '+'SANITY CHECK'+' | ',message,ua,transport,requests=[],responses=[],all=[];function rfc3261_8_2_2_1(){if(message.s('to').uri.scheme!=='sip'){reply(416);return false;}}
function rfc3261_16_3_4(){if(!message.to_tag){if(message.call_id.substr(0,5)===ua.configuration.jssip_id){reply(482);return false;}}}
function rfc3261_18_3_request(){var len=JsSIP.Utils.str_utf8_length(message.body),contentLength=message.getHeader('content-length');if(len<contentLength){reply(400);return false;}}
function rfc3261_8_2_2_2(){var tr,idx,fromTag=message.from_tag,call_id=message.call_id,cseq=message.cseq;if(!message.to_tag){if(message.method===JsSIP.C.INVITE){tr=ua.transactions.ist[message.via_branch];if(!tr){return;}else{for(idx in ua.transactions.ist){tr=ua.transactions.ist[idx];if(tr.request.from_tag===fromTag&&tr.request.call_id===call_id&&tr.request.cseq===cseq){reply(482);return false;}}}}else{tr=ua.transactions.nist[message.via_branch];if(!tr){return;}else{for(idx in ua.transactions.nist){tr=ua.transactions.nist[idx];if(tr.request.from_tag===fromTag&&tr.request.call_id===call_id&&tr.request.cseq===cseq){reply(482);return false;}}}}}}
function rfc3261_8_1_3_3(){if(message.countHeader('via')>1){console.warn(LOG_PREFIX+'More than one Via header field present in the response. Dropping the response');return false;}}
function rfc3261_18_1_2(){var via_host=ua.configuration.via_host;if(message.via.host!==via_host){console.warn(LOG_PREFIX+'Via host in the response does not match UA Via host value. Dropping the response');return false;}}
function rfc3261_18_3_response(){var
len=JsSIP.Utils.str_utf8_length(message.body),contentLength=message.getHeader('content-length');if(len<contentLength){console.warn(LOG_PREFIX+'Message body length is lower than the value in Content-Length header field. Dropping the response');return false;}}
function minimumHeaders(){var
mandatoryHeaders=['from','to','call_id','cseq','via'],idx=mandatoryHeaders.length;while(idx--){if(!message.hasHeader(mandatoryHeaders[idx])){console.warn(LOG_PREFIX+'Missing mandatory header field : '+mandatoryHeaders[idx]+'. Dropping the response');return false;}}}
function reply(status_code){var to,response="SIP/2.0 "+status_code+" "+JsSIP.C.REASON_PHRASE[status_code]+"\r\n",via_length=message.countHeader('via'),idx=0;for(idx;idx<via_length;idx++){response+="Via: "+message.getHeader('via',idx)+"\r\n";}
to=message.getHeader('To');if(!message.to_tag){to+=';tag='+JsSIP.Utils.newTag();}
response+="To: "+to+"\r\n";response+="From: "+message.getHeader('From')+"\r\n";response+="Call-ID: "+message.call_id+"\r\n";response+="CSeq: "+message.cseq+" "+message.method+"\r\n";response+="\r\n";transport.send(response);}
requests.push(rfc3261_8_2_2_1);requests.push(rfc3261_16_3_4);requests.push(rfc3261_18_3_request);requests.push(rfc3261_8_2_2_2);responses.push(rfc3261_8_1_3_3);responses.push(rfc3261_18_1_2);responses.push(rfc3261_18_3_response);all.push(minimumHeaders);sanityCheck=function(m,u,t){var len,pass;message=m;ua=u;transport=t;len=all.length;while(len--){pass=all[len](message);if(pass===false){return false;}}
if(message instanceof JsSIP.IncomingRequest){len=requests.length;while(len--){pass=requests[len](message);if(pass===false){return false;}}}
else if(message instanceof JsSIP.IncomingResponse){len=responses.length;while(len--){pass=responses[len](message);if(pass===false){return false;}}}
return true;};JsSIP.sanityCheck=sanityCheck;}(JsSIP));(function(JsSIP){var DigestAuthentication,LOG_PREFIX=JsSIP.name+' | '+'DIGEST AUTHENTICATION'+' | ';DigestAuthentication=function(ua){this.username=ua.configuration.authorization_user;this.password=ua.configuration.password;this.cnonce=null;this.nc=0;this.ncHex='00000000';this.response=null;};DigestAuthentication.prototype.authenticate=function(request,challenge){this.algorithm=challenge.algorithm;this.realm=challenge.realm;this.nonce=challenge.nonce;this.opaque=challenge.opaque;this.stale=challenge.stale;if(this.algorithm){if(this.algorithm!=='MD5'){console.warn(LOG_PREFIX+'challenge with Digest algorithm different than "MD5", authentication aborted');return false;}}else{this.algorithm='MD5';}
if(!this.realm){console.warn(LOG_PREFIX+'challenge without Digest realm, authentication aborted');return false;}
if(!this.nonce){console.warn(LOG_PREFIX+'challenge without Digest nonce, authentication aborted');return false;}
if(challenge.qop){if(challenge.qop.indexOf('auth')>-1){this.qop='auth';}else if(challenge.qop.indexOf('auth-int')>-1){this.qop='auth-int';}else{console.warn(LOG_PREFIX+'challenge without Digest qop different than "auth" or "auth-int", authentication aborted');return false;}}else{this.qop=null;}
this.method=request.method;this.uri=request.ruri;this.cnonce=JsSIP.Utils.createRandomToken(12);this.nc+=1;this.updateNcHex();if(this.nc===4294967296){this.nc=1;this.ncHex='00000001';}
this.calculateResponse();return true;};DigestAuthentication.prototype.calculateResponse=function(){var ha1,ha2;ha1=JsSIP.Utils.calculateMD5(this.username+":"+this.realm+":"+this.password);if(this.qop==='auth'){ha2=JsSIP.Utils.calculateMD5(this.method+":"+this.uri);this.response=JsSIP.Utils.calculateMD5(ha1+":"+this.nonce+":"+this.ncHex+":"+this.cnonce+":auth:"+ha2);}else if(this.qop==='auth-int'){ha2=JsSIP.Utils.calculateMD5(this.method+":"+this.uri+":"+JsSIP.Utils.calculateMD5(this.body?this.body:""));this.response=JsSIP.Utils.calculateMD5(ha1+":"+this.nonce+":"+this.ncHex+":"+this.cnonce+":auth-int:"+ha2);}else if(this.qop===null){ha2=JsSIP.Utils.calculateMD5(this.method+":"+this.uri);this.response=JsSIP.Utils.calculateMD5(ha1+":"+this.nonce+":"+ha2);}};DigestAuthentication.prototype.toString=function(){var auth_params=[];if(!this.response){throw new Error('response field does not exist, cannot generate Authorization header');}
auth_params.push('algorithm='+this.algorithm);auth_params.push('username="'+this.username+'"');auth_params.push('realm="'+this.realm+'"');auth_params.push('nonce="'+this.nonce+'"');auth_params.push('uri="'+this.uri+'"');auth_params.push('response="'+this.response+'"');if(this.opaque){auth_params.push('opaque="'+this.opaque+'"');}
if(this.qop){auth_params.push('qop='+this.qop);auth_params.push('cnonce="'+this.cnonce+'"');auth_params.push('nc='+this.ncHex);}
return 'Digest '+auth_params.join(', ');};DigestAuthentication.prototype.updateNcHex=function(){var hex=Number(this.nc).toString(16);this.ncHex='00000000'.substr(0,8-hex.length)+hex;};JsSIP.DigestAuthentication=DigestAuthentication;}(JsSIP));(function(JsSIP){var WebRTC;WebRTC={};if(window.navigator.webkitGetUserMedia){WebRTC.getUserMedia=window.navigator.webkitGetUserMedia.bind(navigator);}
else if(window.navigator.mozGetUserMedia){WebRTC.getUserMedia=window.navigator.mozGetUserMedia.bind(navigator);}
else if(window.navigator.getUserMedia){WebRTC.getUserMedia=window.navigator.getUserMedia.bind(navigator);}
if(window.webkitRTCPeerConnection){WebRTC.RTCPeerConnection=window.webkitRTCPeerConnection;}
else if(window.mozRTCPeerConnection){WebRTC.RTCPeerConnection=window.mozRTCPeerConnection;}
else if(window.RTCPeerConnection){WebRTC.RTCPeerConnection=window.RTCPeerConnection;}
if(window.webkitRTCSessionDescription){WebRTC.RTCSessionDescription=window.webkitRTCSessionDescription;}
else if(window.mozRTCSessionDescription){WebRTC.RTCSessionDescription=window.mozRTCSessionDescription;}
else if(window.RTCSessionDescription){WebRTC.RTCSessionDescription=window.RTCSessionDescription;}
if(WebRTC.RTCPeerConnection&&WebRTC.RTCPeerConnection.prototype){if(!WebRTC.RTCPeerConnection.prototype.getLocalStreams){WebRTC.RTCPeerConnection.prototype.getLocalStreams=function(){return this.localStreams;};WebRTC.RTCPeerConnection.prototype.getRemoteStreams=function(){return this.remoteStreams;};}}
if(WebRTC.getUserMedia&&WebRTC.RTCPeerConnection&&WebRTC.RTCSessionDescription){WebRTC.isSupported=true;}
else{WebRTC.isSupported=false;}
JsSIP.WebRTC=WebRTC;}(JsSIP));window.JsSIP=JsSIP;}(window));JsSIP.Grammar=(function(){function quote(s){/**/
return '"'+s
.replace(/\\/g,'\\\\')
.replace(/"/g,'\\"')
.replace(/\x08/g,'\\b')
.replace(/\t/g,'\\t')
.replace(/\n/g,'\\n')
.replace(/\f/g,'\\f')
.replace(/\r/g,'\\r')
.replace(/[\x00-\x07\x0B\x0E-\x1F\x80-\uFFFF]/g,escape)
+'"';}
var result={parse:function(input,startRule){var parseFunctions={"CRLF":parse_CRLF,"DIGIT":parse_DIGIT,"ALPHA":parse_ALPHA,"HEXDIG":parse_HEXDIG,"WSP":parse_WSP,"OCTET":parse_OCTET,"DQUOTE":parse_DQUOTE,"SP":parse_SP,"HTAB":parse_HTAB,"alphanum":parse_alphanum,"reserved":parse_reserved,"unreserved":parse_unreserved,"mark":parse_mark,"escaped":parse_escaped,"LWS":parse_LWS,"SWS":parse_SWS,"HCOLON":parse_HCOLON,"TEXT_UTF8_TRIM":parse_TEXT_UTF8_TRIM,"TEXT_UTF8char":parse_TEXT_UTF8char,"UTF8_NONASCII":parse_UTF8_NONASCII,"UTF8_CONT":parse_UTF8_CONT,"LHEX":parse_LHEX,"token":parse_token,"token_nodot":parse_token_nodot,"separators":parse_separators,"word":parse_word,"STAR":parse_STAR,"SLASH":parse_SLASH,"EQUAL":parse_EQUAL,"LPAREN":parse_LPAREN,"RPAREN":parse_RPAREN,"RAQUOT":parse_RAQUOT,"LAQUOT":parse_LAQUOT,"COMMA":parse_COMMA,"SEMI":parse_SEMI,"COLON":parse_COLON,"LDQUOT":parse_LDQUOT,"RDQUOT":parse_RDQUOT,"comment":parse_comment,"ctext":parse_ctext,"quoted_string":parse_quoted_string,"quoted_string_clean":parse_quoted_string_clean,"qdtext":parse_qdtext,"quoted_pair":parse_quoted_pair,"SIP_URI_noparams":parse_SIP_URI_noparams,"SIP_URI":parse_SIP_URI,"uri_scheme":parse_uri_scheme,"userinfo":parse_userinfo,"user":parse_user,"user_unreserved":parse_user_unreserved,"password":parse_password,"hostport":parse_hostport,"host":parse_host,"hostname":parse_hostname,"domainlabel":parse_domainlabel,"toplabel":parse_toplabel,"IPv6reference":parse_IPv6reference,"IPv6address":parse_IPv6address,"h16":parse_h16,"ls32":parse_ls32,"IPv4address":parse_IPv4address,"dec_octet":parse_dec_octet,"port":parse_port,"uri_parameters":parse_uri_parameters,"uri_parameter":parse_uri_parameter,"transport_param":parse_transport_param,"user_param":parse_user_param,"method_param":parse_method_param,"ttl_param":parse_ttl_param,"maddr_param":parse_maddr_param,"lr_param":parse_lr_param,"other_param":parse_other_param,"pname":parse_pname,"pvalue":parse_pvalue,"paramchar":parse_paramchar,"param_unreserved":parse_param_unreserved,"headers":parse_headers,"header":parse_header,"hname":parse_hname,"hvalue":parse_hvalue,"hnv_unreserved":parse_hnv_unreserved,"Request_Response":parse_Request_Response, "Request_Line":parse_Request_Line,"Request_URI":parse_Request_URI,"absoluteURI":parse_absoluteURI,"hier_part":parse_hier_part,"net_path":parse_net_path,"abs_path":parse_abs_path,"opaque_part":parse_opaque_part,"uric":parse_uric,"uric_no_slash":parse_uric_no_slash,"path_segments":parse_path_segments,"segment":parse_segment,"param":parse_param,"pchar":parse_pchar,"scheme":parse_scheme,"authority":parse_authority,"srvr":parse_srvr,"reg_name":parse_reg_name,"query":parse_query,"SIP_Version":parse_SIP_Version,"INVITEm":parse_INVITEm,"ACKm":parse_ACKm,"OPTIONSm":parse_OPTIONSm,"BYEm":parse_BYEm,"CANCELm":parse_CANCELm,"REGISTERm":parse_REGISTERm,"SUBSCRIBEm":parse_SUBSCRIBEm,"NOTIFYm":parse_NOTIFYm,"Method":parse_Method,"Status_Line":parse_Status_Line,"Status_Code":parse_Status_Code,"extension_code":parse_extension_code,"Reason_Phrase":parse_Reason_Phrase,"Allow_Events":parse_Allow_Events,"Call_ID":parse_Call_ID,"Contact":parse_Contact,"contact_param":parse_contact_param,"name_addr":parse_name_addr,"display_name":parse_display_name,"contact_params":parse_contact_params,"c_p_q":parse_c_p_q,"c_p_expires":parse_c_p_expires,"delta_seconds":parse_delta_seconds,"qvalue":parse_qvalue,"generic_param":parse_generic_param,"gen_value":parse_gen_value,"Content_Disposition":parse_Content_Disposition,"disp_type":parse_disp_type,"disp_param":parse_disp_param,"handling_param":parse_handling_param,"Content_Encoding":parse_Content_Encoding,"Content_Length":parse_Content_Length,"Content_Type":parse_Content_Type,"media_type": parse_media_type,"m_type":parse_m_type,"discrete_type":parse_discrete_type,"composite_type":parse_composite_type,"extension_token":parse_extension_token,"x_token":parse_x_token,"m_subtype":parse_m_subtype,"m_parameter":parse_m_parameter,"m_value":parse_m_value,"CSeq":parse_CSeq,"CSeq_value":parse_CSeq_value,"Expires":parse_Expires,"Event":parse_Event,"event_type":parse_event_type,"From":parse_From,"from_param":parse_from_param,"tag_param":parse_tag_param,"Max_Forwards":parse_Max_Forwards,"Min_Expires":parse_Min_Expires,"Name_Addr_Header":parse_Name_Addr_Header,"Proxy_Authenticate":parse_Proxy_Authenticate,"challenge":parse_challenge,"other_challenge":parse_other_challenge,"auth_param":parse_auth_param,"digest_cln":parse_digest_cln,"realm":parse_realm,"realm_value":parse_realm_value,"domain":parse_domain,"URI":parse_URI,"nonce":parse_nonce,"nonce_value":parse_nonce_value,"opaque":parse_opaque,"stale":parse_stale,"algorithm":parse_algorithm,"qop_options":parse_qop_options,"qop_value":parse_qop_value,"Proxy_Require":parse_Proxy_Require,"Record_Route":parse_Record_Route,"rec_route":parse_rec_route,"Require":parse_Require,"Route":parse_Route,"route_param":parse_route_param,"Subscription_State":parse_Subscription_State,"substate_value":parse_substate_value,"subexp_params":parse_subexp_params,"event_reason_value":parse_event_reason_value,"Subject":parse_Subject,"Supported":parse_Supported,"To":parse_To,"to_param":parse_to_param,"Via":parse_Via,"via_parm":parse_via_parm,"via_params":parse_via_params,"via_ttl":parse_via_ttl,"via_maddr":parse_via_maddr,"via_received":parse_via_received,"via_branch":parse_via_branch,"response_port":parse_response_port,"sent_protocol":parse_sent_protocol,"protocol_name":parse_protocol_name,"transport":parse_transport,"sent_by":parse_sent_by,"via_host":parse_via_host,"via_port":parse_via_port,"ttl":parse_ttl,"WWW_Authenticate":parse_WWW_Authenticate,"extension_header":parse_extension_header,"header_value":parse_header_value,"message_body":parse_message_body,"stun_URI":parse_stun_URI,"stun_scheme":parse_stun_scheme,"stun_host_port":parse_stun_host_port,"stun_host":parse_stun_host,"reg_name":parse_reg_name,"stun_unreserved":parse_stun_unreserved,"sub_delims":parse_sub_delims,"turn_URI":parse_turn_URI,"turn_scheme":parse_turn_scheme,"turn_transport":parse_turn_transport};if(startRule!==undefined){if(parseFunctions[startRule]===undefined){throw new Error("Invalid rule name: "+quote(startRule)+".");}}else{startRule="CRLF";}
var pos=0;var reportFailures=0;var rightmostFailuresPos=0;var rightmostFailuresExpected=[];function padLeft(input,padding,length){var result=input;var padLength=length-input.length;for(var i=0;i<padLength;i++){result=padding+result;}
return result;}
function escape(ch){var charCode=ch.charCodeAt(0);var escapeChar;var length;if(charCode<=0xFF){escapeChar='x';length=2;}else{escapeChar='u';length=4;}
return '\\'+escapeChar+padLeft(charCode.toString(16).toUpperCase(),'0',length);}
function matchFailed(failure){if(pos<rightmostFailuresPos){return;}
if(pos>rightmostFailuresPos){rightmostFailuresPos=pos;rightmostFailuresExpected=[];}
rightmostFailuresExpected.push(failure);}
function parse_CRLF(){var result0;if(input.substr(pos,2)==="\r\n"){result0="\r\n";pos+=2;}else{result0=null;if(reportFailures===0){matchFailed("\"\\r\\n\"");}}
return result0;}
function parse_DIGIT(){var result0;if(/^[0-9]/.test(input.charAt(pos))){result0=input.charAt(pos);pos++;}else{result0=null;if(reportFailures===0){matchFailed("[0-9]");}}
return result0;}
function parse_ALPHA(){var result0;if(/^[a-zA-Z]/.test(input.charAt(pos))){result0=input.charAt(pos);pos++;}else{result0=null;if(reportFailures===0){matchFailed("[a-zA-Z]");}}
return result0;}
function parse_HEXDIG(){var result0;if(/^[0-9a-fA-F]/.test(input.charAt(pos))){result0=input.charAt(pos);pos++;}else{result0=null;if(reportFailures===0){matchFailed("[0-9a-fA-F]");}}
return result0;}
function parse_WSP(){var result0;result0=parse_SP();if(result0===null){result0=parse_HTAB();}
return result0;}
function parse_OCTET(){var result0;if(/^[\0-\xFF]/.test(input.charAt(pos))){result0=input.charAt(pos);pos++;}else{result0=null;if(reportFailures===0){matchFailed("[\\0-\\xFF]");}}
return result0;}
function parse_DQUOTE(){var result0;if(/^["]/.test(input.charAt(pos))){result0=input.charAt(pos);pos++;}else{result0=null;if(reportFailures===0){matchFailed("[\"]");}}
return result0;}
function parse_SP(){var result0;if(input.charCodeAt(pos)===32){result0=" ";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\" \"");}}
return result0;}
function parse_HTAB(){var result0;if(input.charCodeAt(pos)===9){result0="\t";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"\\t\"");}}
return result0;}
function parse_alphanum(){var result0;if(/^[a-zA-Z0-9]/.test(input.charAt(pos))){result0=input.charAt(pos);pos++;}else{result0=null;if(reportFailures===0){matchFailed("[a-zA-Z0-9]");}}
return result0;}
function parse_reserved(){var result0;if(input.charCodeAt(pos)===59){result0=";";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\";\"");}}
if(result0===null){if(input.charCodeAt(pos)===47){result0="/";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"/\"");}}
if(result0===null){if(input.charCodeAt(pos)=== 63){result0="?";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"?\"");}}
if(result0===null){if(input.charCodeAt(pos)===58){result0=":";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result0===null){if(input.charCodeAt(pos)===64){result0="@";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"@\"");}}
if(result0===null){if(input.charCodeAt(pos)===38){result0="&";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"&\"");}}
if(result0===null){if(input.charCodeAt(pos)===61){result0="=";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"=\"");}}
if(result0===null){if(input.charCodeAt(pos)===43){result0="+";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"+\"");}}
if(result0===null){ if(input.charCodeAt(pos)===36){result0="$";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"$\"");}}
if(result0===null){if(input.charCodeAt(pos)===44){result0=",";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\",\"");}}}}}}}}}}}
return result0;}
function parse_unreserved(){var result0;result0=parse_alphanum();if(result0===null){result0=parse_mark();}
return result0;}
function parse_mark(){var result0;if(input.charCodeAt(pos)===45){result0="-";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"-\"");}}
if(result0===null){if(input.charCodeAt(pos)===95){result0="_";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"_\"");}}
if(result0===null){if(input.charCodeAt(pos)===46){result0=".";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\".\"");}}
 if(result0===null){if(input.charCodeAt(pos)===33){result0="!";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"!\"");}}
if(result0===null){if(input.charCodeAt(pos)===126){result0="~";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"~\"");}}
if(result0===null){if(input.charCodeAt(pos)===42){result0="*";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"*\"");}}
if(result0===null){if(input.charCodeAt(pos)===39){result0="'";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"'\"");}}
if(result0===null){if(input.charCodeAt(pos)===40){result0="(";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"(\"");}}
if(result0===null){if(input.charCodeAt(pos)===41){result0=")";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\")\"");}}}}}}}}}}
return result0;}
function parse_escaped(){var result0,result1,result2;var pos0;pos0=pos;if(input.charCodeAt(pos)===37){result0="%";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"%\"");}}
if(result0!==null){result1=parse_HEXDIG();if(result1!==null){result2=parse_HEXDIG();if(result2!==null){result0=[result0,result1,result2];}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
return result0;}
function parse_LWS(){var result0,result1,result2;var pos0,pos1,pos2;pos0=pos;pos1=pos;pos2=pos;result0=[];result1=parse_WSP();while(result1!==null){result0.push(result1);result1=parse_WSP();}
if(result0!==null){result1=parse_CRLF();if(result1!==null){result0=[result0,result1];}else{result0=null;pos=pos2;}}else{result0=null;pos=pos2;}
result0=result0!==null?result0:"";if(result0!==null){result2=parse_WSP();if(result2!==null){result1=[];while(result2!==null){result1.push(result2);result2=parse_WSP();}}else{result1=null;}
if(result1!==null){result0=[result0,result1];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset){return " ";})(pos0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_SWS(){var result0;result0=parse_LWS();result0=result0!==null?result0:"";return result0;}
function parse_HCOLON(){var result0,result1,result2;var pos0,pos1;pos0=pos;pos1=pos;result0=[];result1=parse_SP();if(result1===null){result1=parse_HTAB();}
while(result1!==null){result0.push(result1);result1=parse_SP();if(result1===null){result1 =parse_HTAB();}}
if(result0!==null){if(input.charCodeAt(pos)===58){result1=":";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result1!==null){result2=parse_SWS();if(result2!==null){result0=[result0,result1,result2];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset){return ':';})(pos0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_TEXT_UTF8_TRIM(){var result0,result1,result2,result3;var pos0,pos1,pos2;pos0=pos;pos1=pos;result1=parse_TEXT_UTF8char();if(result1!==null){result0=[];while(result1!==null){result0.push(result1);result1=parse_TEXT_UTF8char();}}else{result0=null;}
if(result0!==null){result1=[];pos2=pos;result2=[];result3=parse_LWS();while(result3!==null){result2.push(result3);result3=parse_LWS();}
if(result2!==null){result3=parse_TEXT_UTF8char();if(result3!==null){result2=[result2,result3];}else{result2=null;pos=pos2;}}else{result2=null;pos=pos2;}
while(result2!==null){result1.push(result2);pos2= pos;result2=[];result3=parse_LWS();while(result3!==null){result2.push(result3);result3=parse_LWS();}
if(result2!==null){result3=parse_TEXT_UTF8char();if(result3!==null){result2=[result2,result3];}else{result2=null;pos=pos2;}}else{result2=null;pos=pos2;}}
if(result1!==null){result0=[result0,result1];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset){return input.substring(pos,offset);})(pos0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_TEXT_UTF8char(){var result0;if(/^[!-~]/.test(input.charAt(pos))){result0=input.charAt(pos);pos++;}else{result0=null;if(reportFailures===0){matchFailed("[!-~]");}}
if(result0===null){result0=parse_UTF8_NONASCII();}
return result0;}
function parse_UTF8_NONASCII(){var result0;if(/^[\x80-\uFFFF]/.test(input.charAt(pos))){result0=input.charAt(pos);pos++;}else{result0=null;if(reportFailures===0){matchFailed("[\\x80-\\uFFFF]");}}
return result0;}
function parse_UTF8_CONT(){var result0;if(/^[\x80-\xBF]/.test(input.charAt(pos))){result0=input.charAt(pos);pos++;}else{
result0=null;if(reportFailures===0){matchFailed("[\\x80-\\xBF]");}}
return result0;}
function parse_LHEX(){var result0;result0=parse_DIGIT();if(result0===null){if(/^[a-f]/.test(input.charAt(pos))){result0=input.charAt(pos);pos++;}else{result0=null;if(reportFailures===0){matchFailed("[a-f]");}}}
return result0;}
function parse_token(){var result0,result1;var pos0;pos0=pos;result1=parse_alphanum();if(result1===null){if(input.charCodeAt(pos)===45){result1="-";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"-\"");}}
if(result1===null){if(input.charCodeAt(pos)===46){result1=".";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\".\"");}}
if(result1===null){if(input.charCodeAt(pos)===33){result1="!";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"!\"");}}
if(result1===null){if(input.charCodeAt(pos)===37){result1="%";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"%\"");}}
if(result1===null){if(input.charCodeAt(pos)===42){result1="*";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"*\"");}}
if(result1===null){if(input.charCodeAt(pos)===95){result1="_";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"_\"");}}
if(result1===null){if(input.charCodeAt(pos)===43){result1="+";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"+\"");}}
if(result1===null){if(input.charCodeAt(pos)===96){ result1="`";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"`\"");}}
if(result1===null){if(input.charCodeAt(pos)===39){result1="'";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"'\"");}}
if(result1===null){if(input.charCodeAt(pos)===126){result1="~";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"~\"");}}}}}}}}}}}}
if(result1!==null){result0=[];while(result1!==null){result0.push(result1);result1=parse_alphanum();if(result1===null){if(input.charCodeAt(pos)===45){result1="-";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"-\"");}}
if(result1===null){if(input.charCodeAt(pos)===46){result1=".";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\".\"");}}
if(result1===null){if(input.charCodeAt(pos)===33){result1="!";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"!\"");}}
if(result1===null){if(input.charCodeAt(pos)===37){result1="%";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"%\"");}}
if(result1===null){if(input.charCodeAt(pos)===42){result1="*";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"*\"");}}
if(result1===null){if(input.charCodeAt(pos)===95){result1="_";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"_\"");}}
if(result1===null){if(input.charCodeAt(pos)===43){result1="+";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"+\"");}}
if(result1===null){if(input.charCodeAt(pos)===96){result1="`";pos++;}else{ result1=null;if(reportFailures===0){matchFailed("\"`\"");}}
if(result1===null){if(input.charCodeAt(pos)===39){result1="'";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"'\"");}}
if(result1===null){if(input.charCodeAt(pos)===126){result1="~";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"~\"");}}}}}}}}}}}}}}else{result0=null;}
if(result0!==null){result0=(function(offset){return input.substring(pos,offset);})(pos0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_token_nodot(){var result0,result1;var pos0;pos0=pos;result1=parse_alphanum();if(result1===null){if(input.charCodeAt(pos)===45){result1="-";pos++;}else{result1= null;if(reportFailures===0){matchFailed("\"-\"");}}
if(result1===null){if(input.charCodeAt(pos)===33){result1="!";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"!\"");}}
if(result1===null){if(input.charCodeAt(pos)===37){result1="%";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"%\"");}}
if(result1===null){if(input.charCodeAt(pos)===42){result1="*";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"*\"");}}
if(result1===null){if(input.charCodeAt(pos)===95){result1="_";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"_\"");}}
if(result1===null){if(input.charCodeAt(pos)===43){result1="+";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"+\"");}}
if(result1===null){if(input.charCodeAt(pos)===96){result1="`";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"`\"");}}
if(result1===null){if(input.charCodeAt(pos)===39){result1="'";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"'\"");}}
if(result1===null){if(input.charCodeAt(pos)===126){result1="~";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"~\"");}}}}}}}}}}}
if(result1!==null){result0=[];while(result1!==null){result0.push(result1);result1=parse_alphanum();if(result1===null){if(input.charCodeAt(pos)===45){result1="-";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"-\"");}}
if(result1===null){if(input.charCodeAt(pos)===33){result1="!";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"!\"");}}
if(result1===null){if(input.charCodeAt(pos)===37){result1="%";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"%\"");}}
if(result1===null){if(input.charCodeAt(pos)===42){result1="*";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"*\"");}}
if(result1===null){if(input.charCodeAt(pos)===95){result1="_";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"_\"");}}
if(result1===null){if(input.charCodeAt(pos)===43){result1="+";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"+\"");}}
if(result1===null){if(input.charCodeAt(pos)===96){result1="`";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"`\"");}}
if(result1===null){if(input.charCodeAt(pos)===39){result1="'";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"'\"");}}
if(result1===null){if(input.charCodeAt(pos)===126){result1="~";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"~\"");}}}}}}}}}}}}}else{result0=null;}
if(result0!==null){result0=(function(offset){return input.substring(pos,offset);})(pos0);}
 if(result0===null){pos=pos0;}
return result0;}
function parse_separators(){var result0;if(input.charCodeAt(pos)===40){result0="(";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"(\"");}}
if(result0===null){if(input.charCodeAt(pos)===41){result0=")";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\")\"");}}
if(result0===null){if(input.charCodeAt(pos)===60){result0="<";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"<\"");}}
if(result0===null){if(input.charCodeAt(pos)===62){result0=">";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\">\"");}}
if(result0===null){if(input.charCodeAt(pos)===64){result0="@";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"@\"");}}
if(result0===null){if(input.charCodeAt(pos)===44){result0=",";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\",\"");}}
if(result0===null){if(input.charCodeAt(pos)=== 59){result0=";";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\";\"");}}
if(result0===null){if(input.charCodeAt(pos)===58){result0=":";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result0===null){if(input.charCodeAt(pos)===92){result0="\\";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"\\\\\"");}}
if(result0===null){ result0=parse_DQUOTE();if(result0===null){if(input.charCodeAt(pos)===47){result0="/";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"/\"");}}
if(result0===null){if(input.charCodeAt(pos)===91){result0="[";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"[\"");}}
if(result0===null){if(input.charCodeAt(pos)===93){result0="]";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"]\"");}}
if(result0===null){if(input.charCodeAt(pos)===63){result0="?";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"?\"");}}
if(result0===null){ if(input.charCodeAt(pos)===61){result0="=";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"=\"");}}
if(result0===null){if(input.charCodeAt(pos)===123){result0="{";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"{\"");}}
if(result0===null){if(input.charCodeAt(pos)===125){result0="}";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"}\"");}}
if(result0===null){result0=parse_SP();if(result0===null){result0=parse_HTAB();}}}}}
}}}}}}}}}}}}}
return result0;}
function parse_word(){var result0,result1;var pos0;pos0=pos;result1=parse_alphanum();if(result1===null){if(input.charCodeAt(pos)===45){result1="-";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"-\"");}}
if(result1===null){if(input.charCodeAt(pos)===46){result1=".";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\".\"");}}
if(result1===null){if(input.charCodeAt(pos)===33){result1="!";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"!\"");}}
if(result1===null){if(input.charCodeAt(pos)===37){result1="%";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"%\"");}}
if(result1===null){if(input.charCodeAt(pos)===42){result1="*";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"*\"");}}
if(result1===null){if(input.charCodeAt(pos)===95){result1="_";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"_\"");}}
if(result1===null){if(input.charCodeAt(pos)===43){result1="+";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"+\"");}}
if(result1===null){if(input.charCodeAt(pos)===96){result1="`";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"`\"");}
}
if(result1===null){if(input.charCodeAt(pos)===39){result1="'";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"'\"");}}
if(result1===null){if(input.charCodeAt(pos)===126){result1="~";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"~\"");}}
if(result1===null){if(input.charCodeAt(pos)===40){result1="(";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"(\"");}}
if(result1===null){if(input.charCodeAt(pos)===41){result1=")";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\")\"");}}
if(result1===null){if(input.charCodeAt(pos)===60){result1="<"; pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"<\"");}}
if(result1===null){if(input.charCodeAt(pos)===62){result1=">";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\">\"");}}
if(result1===null){if(input.charCodeAt(pos)===58){result1=":";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result1===null){if(input.charCodeAt(pos)===92){result1="\\";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"\\\\\"");}}
if(result1===null){ result1=parse_DQUOTE();if(result1===null){if(input.charCodeAt(pos)===47){result1="/"; pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"/\"");}}
if(result1===null){if(input.charCodeAt(pos)===91){result1="[";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"[\"");}}
if(result1===null){if(input.charCodeAt(pos)===93){result1="]";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"]\"");}}
if(result1===null){if(input.charCodeAt(pos)===63){result1="?";pos++;}else{ result1=null;if(reportFailures===0){matchFailed("\"?\"");}}
if(result1===null){if(input.charCodeAt(pos)===123){result1="{";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"{\"");}}
if(result1===null){if(input.charCodeAt(pos)===125){result1="}";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"}\"");}}}}}}}}
}}}}}}}}}}}}}}}}}
if(result1!==null){result0=[];while(result1!==null){result0.push(result1);result1=parse_alphanum();if(result1===null){if(input.charCodeAt(pos)===45){result1="-";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"-\"");}}
if(result1===null){if(input.charCodeAt(pos)===46){result1=".";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\".\"");}}
if(result1===null){if(input.charCodeAt(pos)===33){result1="!";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"!\"");}}
if(result1===null){if(input.charCodeAt(pos)===37){result1="%";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"%\"");}}
if(result1===null){if(input.charCodeAt(pos)===42){ result1="*";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"*\"");}}
if(result1===null){if(input.charCodeAt(pos)===95){result1="_";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"_\"");}}
if(result1===null){if(input.charCodeAt(pos)===43){result1="+";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"+\"");}}
 if(result1===null){if(input.charCodeAt(pos)===96){result1="`";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"`\"");}}
if(result1===null){if(input.charCodeAt(pos)===39){result1="'";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"'\"");}}
if(result1===null){if(input.charCodeAt(pos)===126){result1="~";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"~\"");}}
if(result1===null){if(input.charCodeAt(pos)===40){result1="(";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"(\"");}}
if(result1===null){if(input.charCodeAt(pos)===41){ result1=")";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\")\"");}}
if(result1===null){if(input.charCodeAt(pos)===60){result1="<";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"<\"");}}
if(result1===null){if(input.charCodeAt(pos)===62){result1=">";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\">\"");}}
if(result1===null){if(input.charCodeAt(pos)===58){result1=":";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result1===null){if(input.charCodeAt(pos)===92){result1="\\"; pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"\\\\\"");}}
if(result1===null){result1=parse_DQUOTE();if(result1===null){if(input.charCodeAt(pos)===47){result1="/";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"/\"");}}
if(result1===null){if(input.charCodeAt(pos)===91){result1="[";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"[\"");}}
if(result1===null){if(input.charCodeAt(pos)===93){ result1="]";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"]\"");}}
if(result1===null){if(input.charCodeAt(pos)===63){result1="?";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"?\"");}}
if(result1===null){if(input.charCodeAt(pos)===123){result1="{";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"{\"");}}
if(result1===null){ if(input.charCodeAt(pos)===125){result1="}";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"}\"");}}}}}}}}}}}}}}}}}}}}}}}}}}}else{result0=null;}
if(result0!==null){result0=(function(offset){return input.substring(pos,offset);})(pos0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_STAR(){var result0,result1,result2;var pos0,pos1;pos0=pos;pos1=pos;result0=parse_SWS();if(result0!==null){if(input.charCodeAt(pos)===42){result1="*";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"*\"");}}
if(result1!==null){result2=parse_SWS();if(result2!==null){result0=[result0,result1,result2];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset){return "*";})(pos0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_SLASH(){var result0,result1,result2;var pos0,pos1;pos0=pos;pos1=pos;result0=parse_SWS();if(result0!==null){if(input.charCodeAt(pos)===47){result1="/";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"/\"");}}
if(result1!==null){result2=parse_SWS();if(result2!==null){result0=[result0,result1,result2];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset){return "/";})(pos0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_EQUAL(){var result0,result1,result2;var pos0,pos1;pos0=pos;pos1=pos;result0=parse_SWS();if(result0!==null){if(input.charCodeAt(pos)===61){result1="=";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"=\"");}}
if(result1!==null){result2=parse_SWS();if(result2!==null){result0=[result0,result1,result2];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset){return "=";})(pos0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_LPAREN(){var result0,result1,result2;var pos0,pos1;pos0=pos;pos1=pos;result0=parse_SWS();if(result0!==null){if(input.charCodeAt(pos)===40){ result1="(";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"(\"");}}
if(result1!==null){result2=parse_SWS();if(result2!==null){result0=[result0,result1,result2];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset){return "(";})(pos0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_RPAREN(){var result0,result1,result2;var pos0,pos1;pos0=pos;pos1=pos;result0=parse_SWS();if(result0!==null){if(input.charCodeAt(pos)===41){result1=")";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\")\"");}}
if(result1!==null){result2=parse_SWS();if(result2!==null){result0=[result0,result1,result2];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset){return ")";})(pos0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_RAQUOT(){var result0,result1;var pos0,pos1;pos0=pos;pos1=pos;if(input.charCodeAt(pos)===62){ result0=">";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\">\"");}}
if(result0!==null){result1=parse_SWS();if(result1!==null){result0=[result0,result1];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset){return ">";})(pos0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_LAQUOT(){var result0,result1;var pos0,pos1;pos0=pos;pos1=pos;result0=parse_SWS();if(result0!==null){if(input.charCodeAt(pos)===60){result1="<";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"<\"");}}
if(result1!==null){result0=[result0,result1];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset){return "<";})(pos0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_COMMA(){var result0,result1,result2;var pos0,pos1;pos0=pos;pos1=pos;result0=parse_SWS();if(result0!==null){if(input.charCodeAt(pos)===44){result1=",";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\",\"");}}
if(result1!==null){ result2=parse_SWS();if(result2!==null){result0=[result0,result1,result2];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset){return ",";})(pos0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_SEMI(){var result0,result1,result2;var pos0,pos1;pos0=pos;pos1=pos;result0=parse_SWS();if(result0!==null){if(input.charCodeAt(pos)===59){result1=";";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\";\"");}}
if(result1!==null){result2=parse_SWS();if(result2!==null){result0=[result0,result1,result2];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset){return ";";})(pos0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_COLON(){var result0,result1,result2;var pos0,pos1;pos0=pos;pos1=pos;result0=parse_SWS();if(result0!==null){if(input.charCodeAt(pos)===58){result1=":";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result1!==null){result2=parse_SWS();if(result2!==null){result0=[result0,result1,result2];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset){return ":";})(pos0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_LDQUOT(){var result0,result1;var pos0,pos1;pos0=pos;pos1=pos;result0=parse_SWS();if(result0!==null){result1=parse_DQUOTE();if(result1!==null){result0=[result0,result1];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset){return "\"";})(pos0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_RDQUOT(){var result0,result1;var pos0,pos1;pos0=pos;pos1=pos;result0=parse_DQUOTE();if(result0!==null){result1=parse_SWS();if(result1!==null){result0=[result0,result1];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset){return "\"";})(pos0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_comment(){var result0,result1,result2;var pos0;pos0=pos;result0=parse_LPAREN();if(result0!==null){result1=[];result2=parse_ctext();if(result2===null){result2=parse_quoted_pair();if(result2===null){result2=parse_comment();}}
while(result2!==null){result1.push(result2);result2=parse_ctext();if(result2===null){result2=parse_quoted_pair();if(result2===null){result2=parse_comment();}}}
if(result1!==null){result2=parse_RPAREN();if(result2!==null){result0=[result0,result1,result2];}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
return result0;}
function parse_ctext(){var result0;if(/^[!-']/.test(input.charAt(pos))){result0=input.charAt(pos);pos++;}else{result0=null;if(reportFailures===0){matchFailed("[!-']");}}
if(result0===null){if(/^[*-[]/.test(input.charAt(pos))){result0=input.charAt(pos);pos++;}else{result0=null;if(reportFailures===0){matchFailed("[*-[]");}}
if(result0===null){if(/^[\]-~]/.test(input.charAt(pos))){result0=input.charAt(pos);pos++;}else{result0=null;if(reportFailures===0){matchFailed("[\\]-~]");}}
if(result0===null){result0=parse_UTF8_NONASCII();if(result0===null){result0=parse_LWS();}}}}
return result0;}
function parse_quoted_string(){var result0,result1,result2,result3;var pos0,pos1;pos0=pos;pos1=pos;result0=parse_SWS();if(result0!==null){result1=parse_DQUOTE();if(result1!==null){result2=[];result3=parse_qdtext();if(result3===null){result3=parse_quoted_pair();}
while(result3!==null){result2.push(result3);result3=parse_qdtext();if(result3===null){result3=parse_quoted_pair();}}
if(result2!==null){result3=parse_DQUOTE();if(result3!==null){result0=[result0,result1,result2,result3];}else{result0=null; pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset){return input.substring(pos,offset);})(pos0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_quoted_string_clean(){var result0,result1,result2,result3;var pos0,pos1;pos0=pos;pos1=pos;result0=parse_SWS();if(result0!==null){result1=parse_DQUOTE();if(result1!==null){result2=[];result3=parse_qdtext();if(result3===null){result3=parse_quoted_pair();}
while(result3!==null){result2.push(result3);result3=parse_qdtext();if(result3===null){result3=parse_quoted_pair();}}
if(result2!==null){result3=parse_DQUOTE();if(result3!==null){result0=[result0,result1,result2,result3];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset){return input.substring(pos-1,offset+1);})(pos0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_qdtext(){var result0;result0=parse_LWS();if(result0===null){if(input.charCodeAt(pos)===33){result0="!";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"!\"");}}
if(result0===null){if(/^[#-[]/.test(input.charAt(pos))){result0=input.charAt(pos);pos++;}else{result0=null;if(reportFailures===0){matchFailed("[#-[]");}}
if(result0===null){if(/^[\]-~]/.test(input.charAt(pos))){result0=input.charAt(pos);pos++;}else{result0=null;if(reportFailures===0){matchFailed("[\\]-~]");}}
if(result0===null){result0=parse_UTF8_NONASCII();}}}}
return result0;}
function parse_quoted_pair(){var result0,result1;var pos0;pos0=pos;if(input.charCodeAt(pos)===92){result0="\\";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"\\\\\"");}}
if(result0!==null){if(/^[\0-\t]/.test(input.charAt(pos))){result1=input.charAt(pos);pos++;}else{result1=null;if(reportFailures===0){matchFailed("[\\0-\\t]");}}
if(result1===null){if(/^[\x0B-\f]/.test(input.charAt(pos))){result1=input.charAt(pos);pos++;}else{result1=null;if(reportFailures===0){matchFailed("[\\x0B-\\f]");}}
if(result1===null){if(/^[\x0E-]/.test(input.charAt(pos))){result1=input.charAt(pos);pos++;}else{result1=null;if(reportFailures===0){matchFailed("[\\x0E-]");}}}}
if(result1!==null){result0=[result0,result1];}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
return result0;}
function parse_SIP_URI_noparams(){var result0,result1,result2,result3;var pos0,pos1;pos0=pos;pos1=pos;result0=parse_uri_scheme();if(result0!==null){if(input.charCodeAt(pos)===58){result1=":";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result1!==null){result2=parse_userinfo();result2=result2!==null?result2:"";if(result2!==null){result3=parse_hostport();if(result3!==null){result0=[result0,result1,result2,result3];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset){try{data.uri=new JsSIP.URI(data.scheme,data.user,data.host,data.port);delete data.scheme;delete data.user;delete data.host;delete data.host_type;delete data.port;}catch(e){data=-1;}})(pos0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_SIP_URI(){var result0,result1,result2,result3,result4,result5;var pos0,pos1;pos0=pos;pos1=pos;result0=parse_uri_scheme();if(result0!==null){if(input.charCodeAt(pos)===58){result1=":";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result1!==null){result2=parse_userinfo();result2=result2!==null?result2:"";if(result2!==null){result3=parse_hostport();if(result3!==null){result4=parse_uri_parameters();if(result4!==null){result5=parse_headers();result5=result5!==null?result5:"";if(result5!==null){result0=[result0,result1,result2,result3,result4,result5];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset){var header;try{ data.uri=new JsSIP.URI(data.scheme,data.user,data.host,data.port,data.uri_params,data.uri_headers);delete data.scheme;delete data.user;delete data.host;delete data.host_type;delete data.port;delete data.uri_params;if(startRule==='SIP_URI'){data=data.uri;}}catch(e){data=-1;}})(pos0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_uri_scheme(){var result0;var pos0;pos0=pos;if(input.substr(pos,3).toLowerCase()==="sip"){result0=input.substr(pos,3);pos+=3;}else{result0=null;if(reportFailures===0){matchFailed("\"sip\"");}}
if(result0!==null){result0=(function(offset,uri_scheme){data.scheme=uri_scheme.toLowerCase();})(pos0,result0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_userinfo(){var result0,result1,result2;var pos0,pos1,pos2;pos0=pos;pos1=pos;result0=parse_user();if(result0!==null){pos2=pos;if(input.charCodeAt(pos)===58){result1=":";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result1!==null){result2=parse_password();if(result2!==null){result1=[result1,result2];}else{result1=null;pos=pos2;}}else{result1=null;pos=pos2;}
result1=result1!==null?result1:"";if(result1!==null){if(input.charCodeAt(pos)===64){result2="@";pos++;}else{result2=null;if(reportFailures===0){matchFailed("\"@\"");}}
if(result2!==null){result0=[result0,result1,result2];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset){data.user=window.decodeURIComponent(input.substring(pos-1,offset));})(pos0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_user(){var result0,result1;result1=parse_unreserved();if(result1===null){result1=parse_escaped();if(result1===null){result1=parse_user_unreserved();}}
if(result1!==null){result0=[];while(result1!==null){result0.push(result1);result1=parse_unreserved();if(result1===null){result1=parse_escaped();if(result1===null){result1=parse_user_unreserved();}}}}else{result0=null;}
return result0;}
function parse_user_unreserved(){var result0;if(input.charCodeAt(pos)===38){result0="&";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"&\"");}}
if(result0===null){if(input.charCodeAt(pos)===61){result0="=";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"=\"");}}
if(result0===null){if(input.charCodeAt(pos)===43){result0="+";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"+\"");}}
if(result0===null){if(input.charCodeAt(pos)===36){result0="$";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"$\"");}}
if(result0===null){if(input.charCodeAt(pos)===44){result0=",";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\",\"");}}
if(result0===null){if(input.charCodeAt(pos)===59){result0=";";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\";\"");}}
if(result0===null){if(input.charCodeAt(pos)===63){result0="?";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"?\"");}
}
if(result0===null){if(input.charCodeAt(pos)===47){result0="/";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"/\"");}}}}}}}}}
return result0;}
function parse_password(){var result0,result1;var pos0;pos0=pos;result0=[];result1=parse_unreserved();if(result1===null){result1=parse_escaped();if(result1===null){if(input.charCodeAt(pos)===38){result1="&";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"&\"");}}
if(result1===null){if(input.charCodeAt(pos)===61){result1="=";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"=\"");}}
if(result1===null){if(input.charCodeAt(pos)===43){result1="+";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"+\"");}}
if(result1===null){if(input.charCodeAt(pos)===36){result1="$";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"$\"");}}
if(result1===null){if(input.charCodeAt(pos)===44){result1=",";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\",\"");}}}}}}}}
while(result1!==null){result0.push(result1);result1=parse_unreserved();if(result1===null){result1=parse_escaped();if(result1===null){if(input.charCodeAt(pos)===38){result1="&";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"&\"");}}
if(result1===null){if(input.charCodeAt(pos)===61){result1="=";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"=\"");}}
if(result1===null){if(input.charCodeAt(pos)===43){result1="+";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"+\"");}}
if(result1===null){if(input.charCodeAt(pos)===36){result1="$";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"$\"");}}
if(result1===null){if(input.charCodeAt(pos)===44){result1=",";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\",\"");}}}}}}}}}
if(result0!==null){result0=(function(offset){data.password=input.substring(pos,offset);})(pos0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_hostport(){var result0,result1,result2;var pos0,pos1;pos0=pos;result0=parse_host();if(result0!==null){pos1=pos;if(input.charCodeAt(pos)===58){result1=":";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result1!==null){result2=parse_port();if(result2!==null){result1=[result1,result2];}else{result1=null;pos=pos1;}}else{result1=null;pos=pos1;}
result1=result1!==null?result1:"";if(result1!==null){result0=[result0,result1];}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
return result0;}
function parse_host(){var result0;var pos0;pos0=pos;result0=parse_hostname();if(result0===null){result0=parse_IPv4address();if(result0===null){result0=parse_IPv6reference();}}
if(result0!==null){result0=(function(offset){data.host=input.substring(pos,offset).toLowerCase();return data.host;})(pos0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_hostname(){var result0,result1,result2;var pos0,pos1,pos2;pos0=pos;pos1=pos;result0=[];pos2=pos;result1=parse_domainlabel();if(result1!==null){if(input.charCodeAt(pos)===46){result2=".";pos++;}else{result2=null;if(reportFailures===0){matchFailed("\".\"");}}
if(result2!==null){result1=[result1,result2];}else{result1=null;pos=pos2;}}else{result1=null;pos=pos2;}
while(result1!==null){result0.push(result1);pos2=pos;result1=parse_domainlabel();if(result1!==null){if(input.charCodeAt(pos)===46){result2=".";pos++;}else{result2=null;if(reportFailures===0){matchFailed("\".\"");}}
if(result2!==null){result1=[result1,result2];}else{result1=null;pos=pos2;}}else{result1=null;pos=pos2;}}
if(result0!==null){result1=parse_toplabel();if(result1!==null){if(input.charCodeAt(pos)===46){result2=".";pos++;}else{result2=null;if(reportFailures===0){matchFailed("\".\"");}}
result2=result2!==null?result2:"";if(result2!==null){result0=[result0,result1,result2];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset){data.host_type='domain';return input.substring(pos,offset);})(pos0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_domainlabel(){var result0,result1;if(/^[a-zA-Z0-9_\-]/.test(input.charAt(pos))){result1=input.charAt(pos);pos++;}else{result1=null;if(reportFailures===0){matchFailed("[a-zA-Z0-9_\\-]");}}
if(result1!==null){result0=[];while(result1!==null){result0.push(result1);if(/^[a-zA-Z0-9_\-]/.test(input.charAt(pos))){result1=input.charAt(pos);pos++;}else{result1=null;if(reportFailures===0){matchFailed("[a-zA-Z0-9_\\-]");}}}}else{ result0=null;}
return result0;}
function parse_toplabel(){var result0,result1;if(/^[a-zA-Z_\-]/.test(input.charAt(pos))){result1=input.charAt(pos);pos++;}else{result1=null;if(reportFailures===0){matchFailed("[a-zA-Z_\\-]");}}
if(result1!==null){result0=[];while(result1!==null){result0.push(result1);if(/^[a-zA-Z_\-]/.test(input.charAt(pos))){result1=input.charAt(pos);pos++;}else{result1=null;if(reportFailures===0){matchFailed("[a-zA-Z_\\-]");}}}}else{result0=null;}
return result0;}
function parse_IPv6reference(){var result0,result1,result2;var pos0,pos1;pos0=pos;pos1=pos;if(input.charCodeAt(pos)===91){result0="[";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"[\"");}}
if(result0!==null){result1=parse_IPv6address();if(result1!==null){if(input.charCodeAt(pos)===93){result2="]";pos++;}else{result2=null;if(reportFailures===0){matchFailed("\"]\"");}}
if(result2!==null){result0=[result0,result1,result2];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset){data.host_type='IPv6';return input.substring(pos,offset);})(pos0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_IPv6address(){var result0,result1,result2,result3,result4,result5,result6,result7,result8,result9,result10,result11,result12;var pos0,pos1,pos2;pos0=pos;pos1=pos;result0=parse_h16();if(result0!==null){if(input.charCodeAt(pos)===58){result1=":";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result1!==null){result2=parse_h16();if(result2!==null){if(input.charCodeAt(pos)===58){result3=":";pos++;}else{result3=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result3!==null){result4=parse_h16();if(result4!==null){if(input.charCodeAt(pos)===58){result5=":";pos++;}else{result5=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result5!==null){result6=parse_h16();if(result6!==null){if(input.charCodeAt(pos)===58){result7=":";pos++;}else{result7=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result7!==null){result8=parse_h16();if(result8!==null){if(input.charCodeAt(pos)===58){result9=":";pos++;}else{result9=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result9!==null){result10=parse_h16();if(result10!==null){if(input.charCodeAt(pos)===58){result11=":";pos++;}else{result11=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result11!==null){result12=parse_ls32();if(result12!==null){result0=[result0,result1,result2,result3,result4,result5,result6,result7,result8,result9,result10,result11,result12];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0===null){pos1=pos;if(input.substr(pos,2)==="::"){result0="::";pos+=2;}else{result0=null;if(reportFailures===0){matchFailed("\"::\"");}}
if(result0!==null){result1=parse_h16();if(result1!==null){if(input.charCodeAt(pos)===58){result2=":";pos++;}else{result2=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result2!==null){result3=parse_h16();if(result3!==null){if(input.charCodeAt(pos)===58){result4=":";pos++;}else{result4=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result4!==null){result5=parse_h16();if(result5!==null){if(input.charCodeAt(pos)===58){result6=":";pos++;}else{result6=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result6!==null){result7=parse_h16();if(result7!==null){if(input.charCodeAt(pos)===58){result8=":";pos++;}else{result8=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result8!==null){result9=parse_h16();if(result9!==null){if(input.charCodeAt(pos)===58){result10=":";pos++;}else{result10=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result10!==null){result11=parse_ls32();if(result11!==null){result0=[result0,result1,result2,result3,result4,result5,result6,result7,result8,result9,result10,result11];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0===null){pos1=pos;if(input.substr(pos,2)==="::"){result0="::";pos+=2;}else{result0=null;if(reportFailures===0){matchFailed("\"::\"");}}
if(result0!==null){result1=parse_h16();if(result1!==null){if(input.charCodeAt(pos)===58){result2=":";pos++;}else{result2=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result2!==null){result3=parse_h16();if(result3!==null){if(input.charCodeAt(pos)===58){result4=":";pos++;}else{result4=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result4!==null){result5=parse_h16();if(result5!==null){if(input.charCodeAt(pos)===58){result6=":";pos++;}else{result6=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result6!==null){result7=parse_h16();if(result7!==null){if(input.charCodeAt(pos)===58){result8=":";pos++;}else{result8=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result8!==null){result9=parse_ls32();if(result9!==null){result0=[result0,result1,result2,result3,result4,result5,result6,result7,result8,result9];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0===null){pos1=pos;if(input.substr(pos,2)==="::"){result0="::";pos+=2;}else{result0=null;if(reportFailures===0){matchFailed("\"::\"");}}
if(result0!==null){result1=parse_h16();if(result1!==null){if(input.charCodeAt(pos)===58){result2=":";pos++;}else{result2=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result2!==null){result3=parse_h16();if(result3!==null){if(input.charCodeAt(pos)===58){result4=":";pos++;}else{result4=null; if(reportFailures===0){matchFailed("\":\"");}}
if(result4!==null){result5=parse_h16();if(result5!==null){if(input.charCodeAt(pos)===58){result6=":";pos++;}else{result6=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result6!==null){result7=parse_ls32();if(result7!==null){result0=[result0,result1,result2,result3,result4,result5,result6,result7];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0===null){pos1=pos;if(input.substr(pos,2) ==="::"){result0="::";pos+=2;}else{result0=null;if(reportFailures===0){matchFailed("\"::\"");}}
if(result0!==null){result1=parse_h16();if(result1!==null){if(input.charCodeAt(pos)===58){result2=":";pos++;}else{result2=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result2!==null){result3=parse_h16();if(result3!==null){if(input.charCodeAt(pos)===58){result4=":";pos++;}else{result4=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result4!==null){result5=parse_ls32();if(result5!==null){result0=[result0,result1,result2,result3,result4,result5];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0===null){pos1=pos;if(input.substr(pos,2)==="::"){result0="::";pos+=2;}else{result0=null;if(reportFailures===0){matchFailed("\"::\"");}}
if(result0!==null){result1=parse_h16();if(result1!==null){if(input.charCodeAt(pos)===58){result2=":";pos++;}else{result2=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result2!==null){result3=parse_ls32(); if(result3!==null){result0=[result0,result1,result2,result3];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0===null){pos1=pos;if(input.substr(pos,2)==="::"){result0="::";pos+=2;}else{result0=null;if(reportFailures===0){matchFailed("\"::\"");}}
if(result0!==null){result1=parse_ls32();if(result1!==null){result0=[result0,result1];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0===null){pos1=pos;if(input.substr(pos,2)==="::"){result0="::";pos+=2;}else{result0=null;if(reportFailures===0){matchFailed("\"::\"");}}
if(result0!==null){result1=parse_h16();if(result1!==null){ result0=[result0,result1];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0===null){pos1=pos;result0=parse_h16();if(result0!==null){if(input.substr(pos,2)==="::"){result1="::";pos+=2;}else{result1=null;if(reportFailures===0){matchFailed("\"::\"");}}
if(result1!==null){result2=parse_h16();if(result2!==null){if(input.charCodeAt(pos)===58){result3=":";pos++;}else{result3=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result3!==null){result4=parse_h16();if(result4!==null){if(input.charCodeAt(pos)===58){result5=":";pos++;}else{result5=null;if(reportFailures===0){matchFailed("\":\"");}
}
if(result5!==null){result6=parse_h16();if(result6!==null){if(input.charCodeAt(pos)===58){result7=":";pos++;}else{result7=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result7!==null){result8=parse_h16();if(result8!==null){if(input.charCodeAt(pos)===58){result9=":";pos++;}else{result9=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result9!==null){result10=parse_ls32();if(result10!==null){result0=[result0,result1,result2,result3,result4,result5,result6,result7,result8,result9,result10];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{ result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0===null){pos1=pos;result0=parse_h16();if(result0!==null){pos2=pos;if(input.charCodeAt(pos)===58){result1=":";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result1!==null){result2=parse_h16();if(result2!==null){result1=[result1,result2];}else{result1=null;pos=pos2;}}else{result1=null;pos=pos2;}
result1=result1!==null?result1:"";if(result1!==null){if(input.substr(pos,2)==="::"){result2="::";pos+=2;}else{ result2=null;if(reportFailures===0){matchFailed("\"::\"");}}
if(result2!==null){result3=parse_h16();if(result3!==null){if(input.charCodeAt(pos)===58){result4=":";pos++;}else{result4=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result4!==null){result5=parse_h16();if(result5!==null){if(input.charCodeAt(pos)===58){result6=":";pos++;}else{result6=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result6!==null){result7=parse_h16();if(result7!==null){if(input.charCodeAt(pos)===58){result8=":";pos++;}else{result8=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result8!==null){result9=parse_ls32();if(result9!==null){result0=[result0,result1,result2,result3,result4,result5,result6,result7,result8,result9];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0===null){pos1=pos;result0=parse_h16();if(result0!==null){pos2=pos;if(input.charCodeAt(pos)===58){result1=":";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result1!==null){result2=parse_h16();if(result2!==null){ result1=[result1,result2];}else{result1=null;pos=pos2;}}else{result1=null;pos=pos2;}
result1=result1!==null?result1:"";if(result1!==null){pos2=pos;if(input.charCodeAt(pos)===58){result2=":";pos++;}else{result2=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result2!==null){result3=parse_h16();if(result3!==null){result2=[result2,result3];}else{result2=null;pos=pos2;}}else{ result2=null;pos=pos2;}
result2=result2!==null?result2:"";if(result2!==null){if(input.substr(pos,2)==="::"){result3="::";pos+=2;}else{result3=null;if(reportFailures===0){matchFailed("\"::\"");}}
if(result3!==null){result4=parse_h16();if(result4!==null){if(input.charCodeAt(pos)===58){result5=":";pos++;}else{result5=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result5!==null){result6=parse_h16();if(result6!==null){if(input.charCodeAt(pos)===58){result7=":";pos++;}else{result7=null;if(reportFailures===0){matchFailed("\":\"");}
}
if(result7!==null){result8=parse_ls32();if(result8!==null){result0=[result0,result1,result2,result3,result4,result5,result6,result7,result8];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0===null){pos1=pos;result0=parse_h16();if(result0!==null){pos2=pos;if(input.charCodeAt(pos)===58){result1=":";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result1!==null){result2=parse_h16();if(result2!==null){result1=[result1,result2];}else{result1=null;pos=pos2;}}else{result1=null;pos=pos2;}
result1=result1!==null?result1:"";if(result1!==null){pos2=pos;if(input.charCodeAt(pos)===58){result2=":";pos++;}else{result2=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result2!==null){result3=parse_h16(); if(result3!==null){result2=[result2,result3];}else{result2=null;pos=pos2;}}else{result2=null;pos=pos2;}
result2=result2!==null?result2:"";if(result2!==null){pos2=pos;if(input.charCodeAt(pos)===58){result3=":";pos++;}else{result3=null;if(reportFailures===0){matchFailed("\":\"");}}
 if(result3!==null){result4=parse_h16();if(result4!==null){result3=[result3,result4];}else{result3=null;pos=pos2;}}else{result3=null;pos=pos2;}
result3=result3!==null?result3:"";if(result3!==null){if(input.substr(pos,2)==="::"){result4="::";pos+=2;}else{result4=null;if(reportFailures===0){matchFailed("\"::\"");}}
if(result4!==null){result5=parse_h16();if(result5!==null){if(input.charCodeAt(pos)===58){result6=":";pos++;}else{result6=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result6!==null){ result7=parse_ls32();if(result7!==null){result0=[result0,result1,result2,result3,result4,result5,result6,result7];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0===null){pos1=pos;result0=parse_h16();if(result0!==null){pos2=pos; if(input.charCodeAt(pos)===58){result1=":";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result1!==null){result2=parse_h16();if(result2!==null){result1=[result1,result2];}else{result1=null;pos=pos2;}}else{result1=null;pos=pos2;}
result1=result1!==null?result1:"";if(result1!==null){pos2=pos;if(input.charCodeAt(pos)===58){result2=":";pos++;}else{result2=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result2!==null){result3=parse_h16();if(result3!==null){result2=[result2,result3];}else{ result2=null;pos=pos2;}}else{result2=null;pos=pos2;}
result2=result2!==null?result2:"";if(result2!==null){pos2=pos;if(input.charCodeAt(pos)===58){result3=":";pos++;}else{result3=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result3!==null){result4=parse_h16(); if(result4!==null){result3=[result3,result4];}else{result3=null;pos=pos2;}}else{result3=null;pos=pos2;}
result3=result3!==null?result3:"";if(result3!==null){pos2=pos;if(input.charCodeAt(pos)===58){result4=":";pos++;}else{result4=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result4!==null){result5=parse_h16();if(result5!==null){result4=[result4,result5];}else{result4=null;pos=pos2;}}else{result4=null;pos=pos2;}
result4=result4!==null?result4:"";if(result4!==null){ if(input.substr(pos,2)==="::"){result5="::";pos+=2;}else{result5=null;if(reportFailures===0){matchFailed("\"::\"");}}
if(result5!==null){result6=parse_ls32();if(result6!==null){result0=[result0,result1,result2,result3,result4,result5,result6];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
}else{result0=null;pos=pos1;}
if(result0===null){pos1=pos;result0=parse_h16();if(result0!==null){pos2=pos;if(input.charCodeAt(pos)===58){result1=":";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result1!==null){result2=parse_h16();if(result2!==null){result1=[result1,result2];}else{result1=null;pos=pos2;}}else{result1=null;pos=pos2;}
result1=result1!==null?result1:"";if(result1!==null){pos2=pos;if(input.charCodeAt(pos)===58){result2=":";pos++;}else{result2=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result2!==null){result3=parse_h16();if(result3!==null){result2=[result2,result3];}else{result2=null;pos=pos2;}}else{result2=null;pos=pos2;}
result2=result2!==null?result2:"";if(result2!==null){pos2=pos;if(input.charCodeAt(pos)===58){result3=":"; pos++;}else{result3=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result3!==null){result4=parse_h16();if(result4!==null){result3=[result3,result4];}else{result3=null;pos=pos2;}}else{result3=null;pos=pos2;}
result3=result3!==null?result3:"";if(result3!==null){pos2=pos;if(input.charCodeAt(pos)===58){result4=":";pos++;}else{result4=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result4!==null){result5=parse_h16();if(result5!==null){result4= [result4,result5];}else{result4=null;pos=pos2;}}else{result4=null;pos=pos2;}
result4=result4!==null?result4:"";if(result4!==null){pos2=pos;if(input.charCodeAt(pos)===58){result5=":";pos++;}else{result5=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result5!==null){result6=parse_h16();if(result6!==null){result5=[result5,result6];}else{result5=null;pos=pos2;}}else{result5=null;pos=pos2;}
result5=result5!==null?result5:""; if(result5!==null){if(input.substr(pos,2)==="::"){result6="::";pos+=2;}else{result6=null;if(reportFailures===0){matchFailed("\"::\"");}}
if(result6!==null){result7=parse_h16();if(result7!==null){result0=[result0,result1,result2,result3,result4,result5,result6,result7];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0===null){pos1=pos;result0=parse_h16();if(result0!==null){pos2=pos;if(input.charCodeAt(pos)===58){result1=":";pos++;}else{result1=null; if(reportFailures===0){matchFailed("\":\"");}}
if(result1!==null){result2=parse_h16();if(result2!==null){result1=[result1,result2];}else{result1=null;pos=pos2;}}else{result1=null;pos=pos2;}
result1=result1!==null?result1:"";if(result1!==null){pos2=pos;if(input.charCodeAt(pos)===58){result2=":";pos++;}else{result2=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result2!==null){result3=parse_h16();if(result3!==null){result2=[result2,result3];}else{result2=null;pos=pos2;}
}else{result2=null;pos=pos2;}
result2=result2!==null?result2:"";if(result2!==null){pos2=pos;if(input.charCodeAt(pos)===58){result3=":";pos++;}else{result3=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result3!==null){result4=parse_h16();if(result4!==null){result3=[result3,result4];}else{result3=null;pos=pos2;}}else{result3=null;pos=pos2;}
result3=result3!==null?result3:"";if(result3!==null){pos2=pos;if(input.charCodeAt(pos)===58){result4=":";pos++;}else{result4=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result4!==null){result5=parse_h16();if(result5!==null){result4=[result4,result5];}else{result4=null;pos=pos2;}}else{result4=null;pos=pos2;}
result4=result4!==null?result4:"";if(result4!==null){pos2=pos;if(input.charCodeAt(pos)===58){result5=":";pos++;}else{result5=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result5!==null){result6=parse_h16();if(result6!==null){ result5=[result5,result6];}else{result5=null;pos=pos2;}}else{result5=null;pos=pos2;}
result5=result5!==null?result5:"";if(result5!==null){pos2=pos;if(input.charCodeAt(pos)===58){result6=":";pos++;}else{result6=null;if(reportFailures ===0){matchFailed("\":\"");}}
if(result6!==null){result7=parse_h16();if(result7!==null){result6=[result6,result7];}else{result6=null;pos=pos2;}}else{result6=null;pos=pos2;}
result6=result6!==null?result6:"";if(result6!==null){if(input.substr(pos,2)==="::"){result7="::";pos+=2;}else{result7=null;if(reportFailures===0){matchFailed("\"::\"");}}
if(result7!==null){result0=[result0,result1,result2,result3,result4,result5,result6,result7];}else{ result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}}}}}}}}}}}}}}
if(result0!==null){result0=(function(offset){data.host_type='IPv6';return input.substring(pos,offset);})(pos0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_h16(){var result0,result1,result2,result3;var pos0;pos0=pos;result0=parse_HEXDIG();if(result0!==null){result1=parse_HEXDIG();result1=result1!==null?result1:"";if(result1!==null){result2=parse_HEXDIG();result2=result2!==null?result2:"";if(result2!==null){result3=parse_HEXDIG();result3=result3!==null?result3:"";if(result3!==null){result0=[result0,result1,result2,result3];}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
return result0;}
function parse_ls32(){var result0,result1,result2;var pos0;pos0=pos;result0=parse_h16();if(result0!==null){if(input.charCodeAt(pos)===58){result1=":";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result1!==null){result2=parse_h16();if(result2!==null){result0=[result0,result1,result2];}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
if(result0===null){result0=parse_IPv4address();}
return result0;}
function parse_IPv4address(){var result0,result1,result2,result3,result4,result5,result6;var pos0,pos1;pos0=pos;pos1=pos;result0=parse_dec_octet();if(result0!==null){if(input.charCodeAt(pos)===46){result1=".";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\".\"");}}
if(result1!==null){result2=parse_dec_octet();if(result2!==null){if(input.charCodeAt(pos)===46){result3=".";pos++;}else{result3=null;if(reportFailures===0){matchFailed("\".\"");}}
if(result3!==null){result4=parse_dec_octet();if(result4!==null){if(input.charCodeAt(pos)===46){result5=".";pos++;}else{result5=null;if(reportFailures===0){matchFailed("\".\"");}}
if(result5!==null){result6=parse_dec_octet();if(result6!==null){result0=[result0,result1,result2,result3,result4,result5,result6];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0 =null;pos=pos1;}
if(result0!==null){result0=(function(offset){data.host_type='IPv4';return input.substring(pos,offset);})(pos0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_dec_octet(){var result0,result1,result2;var pos0;pos0=pos;if(input.substr(pos,2)==="25"){result0="25";pos+=2;}else{result0=null;if(reportFailures===0){matchFailed("\"25\"");}}
if(result0!==null){if(/^[0-5]/.test(input.charAt(pos))){result1=input.charAt(pos);pos++;}else{result1=null;if(reportFailures===0){matchFailed("[0-5]");}}
if(result1!==null){result0=[result0,result1];}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
if(result0===null){pos0=pos;if(input.charCodeAt(pos)===50){result0="2";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"2\"");}}
if(result0!==null){if(/^[0-4]/.test(input.charAt(pos))){result1=input.charAt(pos);pos++;}else{result1=null;if(reportFailures===0){matchFailed("[0-4]");}}
if(result1!==null){result2=parse_DIGIT();if(result2!==null){result0=[result0,result1,result2];}else{result0 =null;pos=pos0;}}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
if(result0===null){pos0=pos;if(input.charCodeAt(pos)===49){result0="1";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"1\"");}}
if(result0!==null){result1=parse_DIGIT();if(result1!==null){result2=parse_DIGIT();if(result2!==null){result0=[result0,result1,result2];}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
if(result0===null){pos0=pos; if(/^[1-9]/.test(input.charAt(pos))){result0=input.charAt(pos);pos++;}else{result0=null;if(reportFailures===0){matchFailed("[1-9]");}}
if(result0!==null){result1=parse_DIGIT();if(result1!==null){result0=[result0,result1];}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
if(result0===null){result0=parse_DIGIT();}}}}
return result0;}
function parse_port(){var result0,result1,result2,result3,result4;var pos0,pos1;pos0=pos;pos1=pos;result0=parse_DIGIT();result0=result0!==null?result0:"";if(result0!==null){result1=parse_DIGIT();result1=result1!==null?result1:"";if(result1!==null){result2=parse_DIGIT();result2=result2!==null?result2:"";if(result2!==null){result3=parse_DIGIT();result3=result3!==null?result3:"";if(result3!==null){result4=parse_DIGIT();result4=result4!==null?result4:"";if(result4!==null){result0=[result0,result1,result2,result3,result4];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0= null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset,port){port=parseInt(port.join(''));data.port=port;return port;})(pos0,result0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_uri_parameters(){var result0,result1,result2;var pos0;result0=[];pos0=pos;if(input.charCodeAt(pos)===59){result1=";";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\";\"");}}
if(result1!==null){result2=parse_uri_parameter();if(result2!==null){result1=[result1,result2];}else{result1=null;pos=pos0;}}else{result1=null;pos=pos0;}
while(result1!==null){result0.push(result1);pos0=pos;if(input.charCodeAt(pos)===59){result1=";";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\";\"");}}
if(result1!==null){result2=parse_uri_parameter();if(result2!==null){result1=[result1,result2];}else{result1=null;pos=pos0;}}else{result1=null;pos=pos0;}}
return result0;}
function parse_uri_parameter(){var result0;result0=parse_transport_param();if(result0===null){result0=parse_user_param();if(result0===null){result0=parse_method_param();if(result0===null){result0=parse_ttl_param();if(result0===null){result0=parse_maddr_param();if(result0===null){result0=parse_lr_param();if(result0===null){result0=parse_other_param();}}}}}}
return result0;}
function parse_transport_param(){var result0,result1;var pos0,pos1;pos0=pos;pos1=pos;if(input.substr(pos,10).toLowerCase()==="transport="){result0=input.substr(pos,10);pos+=10;}else{result0=null;if(reportFailures===0){matchFailed("\"transport=\"");}}
if(result0!==null){if(input.substr(pos,3).toLowerCase()==="udp"){result1=input.substr(pos,3);pos+=3;}else{result1=null;if(reportFailures===0){matchFailed("\"udp\"");}}
if(result1===null){if(input.substr(pos,3).toLowerCase()==="tcp"){result1=input.substr(pos,3);pos+=3;}else{result1=null;if(reportFailures===0){matchFailed("\"tcp\"");}}
if(result1===null){if(input.substr(pos,4).toLowerCase()==="sctp"){result1=input.substr(pos,4);pos+=4;}else{result1=null;if(reportFailures===0){matchFailed("\"sctp\"");}}
if(result1===null){if(input.substr(pos,3).toLowerCase()==="tls"){result1=input.substr(pos,3);pos+=3;}else{result1=null;if(reportFailures===0){matchFailed("\"tls\"");}}
if(result1===null){result1=parse_token();}}}}
if(result1!==null){result0=[result0,result1];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset,transport){if(!data.uri_params)data.uri_params={};data.uri_params['transport']=transport.toLowerCase();})(pos0,result0[1]);}
if(result0===null){pos=pos0;}
return result0;}
function parse_user_param(){var result0,result1;var pos0,pos1;pos0=pos;pos1=pos;if(input.substr(pos,5).toLowerCase()==="user="){result0=input.substr(pos,5);pos+=5;}else{result0=null;if(reportFailures===0){matchFailed("\"user=\"");}}
if(result0!==null){if(input.substr(pos,5).toLowerCase()==="phone"){result1=input.substr(pos,5);pos+=5;}else{result1=null;if(reportFailures===0){matchFailed("\"phone\"");}}
if(result1===null){if(input.substr(pos,2).toLowerCase()==="ip"){result1=input.substr(pos,2);pos+=2;}else{result1=null;if(reportFailures===0){matchFailed("\"ip\"");}}
if(result1===null){result1=parse_token();}}
if(result1!==null){result0=[result0,result1];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset,user){if(!data.uri_params)data.uri_params={};data.uri_params['user']=user.toLowerCase();})(pos0,result0[1]);}
if(result0===null){pos=pos0;}
return result0;}
function parse_method_param(){var result0,result1;var pos0,pos1;pos0=pos;pos1=pos;if(input.substr(pos,7).toLowerCase()==="method="){result0=input.substr(pos,7);pos+=7;}else{result0=null;if(reportFailures===0){matchFailed("\"method=\"");}}
 if(result0!==null){result1=parse_Method();if(result1!==null){result0=[result0,result1];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset,method){if(!data.uri_params)data.uri_params={};data.uri_params['method']=method;})(pos0,result0[1]);}
if(result0===null){pos=pos0;}
return result0;}
function parse_ttl_param(){var result0,result1;var pos0,pos1;pos0=pos;pos1=pos;if(input.substr(pos,4).toLowerCase()==="ttl="){result0=input.substr(pos,4);pos+=4;}else{result0=null;if(reportFailures===0){matchFailed("\"ttl=\"");}}
if(result0!==null){result1=parse_ttl();if(result1!==null){result0=[result0,result1];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset,ttl){if(!data.params)data.params={};data.params['ttl']=ttl;})(pos0,result0[1]);}
if(result0===null){pos=pos0;}
return result0;}
function parse_maddr_param(){var result0,result1;var pos0,pos1;pos0=pos;pos1=pos;if(input.substr(pos,6).toLowerCase()==="maddr="){result0=input.substr(pos,6);pos+=6;}else{result0=null;if(reportFailures===0){matchFailed("\"maddr=\"");}}
if(result0!==null){result1=parse_host();if(result1!==null){result0=[result0,result1];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset,maddr){if(!data.uri_params)data.uri_params={};data.uri_params['maddr']=maddr;})(pos0,result0[1]);}
if(result0===null){pos=pos0;}
return result0;}
function parse_lr_param(){var result0,result1,result2;var pos0,pos1,pos2;pos0=pos;pos1=pos;if(input.substr(pos,2).toLowerCase()==="lr"){result0=input.substr(pos,2);pos+=2;}else{result0=null;if(reportFailures===0){matchFailed("\"lr\"");}}
if(result0!==null){pos2=pos;if(input.charCodeAt(pos)===61){result1="=";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"=\"");}}
if(result1!==null){result2=parse_token();if(result2!==null){result1=[result1,result2];}else{result1=null;pos=pos2;}}else{result1=null;pos=pos2;}
result1=result1!==null?result1:"";if(result1!==null){result0=[result0,result1];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset){if(!data.uri_params)data.uri_params={};data.uri_params['lr']=undefined;})(pos0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_other_param(){var result0,result1,result2;var pos0,pos1,pos2;pos0=pos;pos1=pos;result0=parse_pname();if(result0!==null){pos2=pos;if(input.charCodeAt(pos)===61){result1="=";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"=\"");}}
if(result1!==null){result2=parse_pvalue();if(result2!==null){result1=[result1,result2];}else{result1=null;pos=pos2;}}else{result1=null;pos=pos2;}
result1=result1!==null?result1:""; if(result1!==null){result0=[result0,result1];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset,param,value){if(!data.uri_params)data.uri_params={};if(typeof value==='undefined'){value=undefined;}
else{value=value[1];}
data.uri_params[param.toLowerCase()]=value&&value.toLowerCase();})(pos0,result0[0],result0[1]);}
if(result0===null){pos=pos0;}
return result0;}
function parse_pname(){var result0,result1;var pos0;pos0=pos;result1=parse_paramchar();if(result1!==null){result0=[];while(result1!==null){result0.push(result1);result1=parse_paramchar();}}else{result0=null;}
if(result0!==null){result0=(function(offset,pname){return pname.join('');})(pos0,result0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_pvalue(){var result0,result1;var pos0;pos0=pos;result1=parse_paramchar();if(result1!==null){result0=[];while(result1!==null){result0.push(result1);result1=parse_paramchar();}}else{result0=null;}
if(result0!==null){result0=(function(offset,pvalue){return pvalue.join('');})(pos0,result0);}
if(result0=== null){pos=pos0;}
return result0;}
function parse_paramchar(){var result0;result0=parse_param_unreserved();if(result0===null){result0=parse_unreserved();if(result0===null){result0=parse_escaped();}}
return result0;}
function parse_param_unreserved(){var result0;if(input.charCodeAt(pos)===91){result0="[";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"[\"");}}
if(result0===null){if(input.charCodeAt(pos)===93){result0="]";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"]\"");}}
if(result0===null){if(input.charCodeAt(pos)===47){result0="/";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"/\"");}}
if(result0===null){if(input.charCodeAt(pos)===58){result0=":";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result0===null){if(input.charCodeAt(pos)===38){result0="&";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"&\"");}}
if(result0===null){if(input.charCodeAt(pos)===43){result0="+"; pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"+\"");}}
if(result0===null){if(input.charCodeAt(pos)===36){result0="$";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"$\"");}}}}}}}}
return result0;}
function parse_headers(){var result0,result1,result2,result3,result4;var pos0,pos1;pos0=pos;if(input.charCodeAt(pos)===63){result0="?";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"?\"");}}
if(result0!==null){result1=parse_header();if(result1!==null){result2=[];pos1=pos;if(input.charCodeAt(pos)===38){result3="&";pos++;}else{result3=null;if(reportFailures===0){matchFailed("\"&\"");}}
if(result3!==null){result4=parse_header();if(result4!==null){result3=[result3,result4];}else{result3=null;pos=pos1;}}else{result3=null;pos=pos1;}
while(result3!==null){result2.push(result3);pos1=pos;if(input.charCodeAt(pos)===38){result3="&";pos++;}else{result3=null;if(reportFailures===0){matchFailed("\"&\"");}}
if(result3!==null){result4=parse_header();if(result4!==null){result3=[result3,result4];}else{result3=null;pos=pos1;}}else{result3=null;pos=pos1;}}
if(result2!==null){result0=[result0,result1,result2];}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
return result0;}
function parse_header(){var result0,result1,result2;var pos0,pos1;pos0=pos;pos1=pos;result0=parse_hname();if(result0!==null){if(input.charCodeAt(pos)===61){result1="=";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"=\"");}}
if(result1!==null){result2=parse_hvalue();if(result2!==null){result0=[result0,result1,result2];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset,hname,hvalue){hname=hname.join('').toLowerCase();hvalue=hvalue.join('');if(!data.uri_headers)data.uri_headers={};if(!data.uri_headers[hname]){data.uri_headers[hname]=[hvalue];}else{data.uri_headers[hname].push(hvalue);}})(pos0,result0[0],result0[2]);}
if(result0===null){pos=pos0;}
return result0;}
function parse_hname(){var result0,result1;result1=parse_hnv_unreserved();if(result1===null){result1=parse_unreserved();if(result1===null){result1=parse_escaped();}}
if(result1!==null){result0=[];while(result1!==null){result0.push(result1);result1=parse_hnv_unreserved();if(result1===null){result1=parse_unreserved();if(result1===null){result1=parse_escaped();}}}}else{result0=null;}
 return result0;}
function parse_hvalue(){var result0,result1;result0=[];result1=parse_hnv_unreserved();if(result1===null){result1=parse_unreserved();if(result1===null){result1=parse_escaped();}}
while(result1!==null){result0.push(result1);result1=parse_hnv_unreserved();if(result1===null){result1=parse_unreserved();if(result1===null){result1=parse_escaped();}}}
return result0;}
function parse_hnv_unreserved(){var result0;if(input.charCodeAt(pos)===91){result0="[";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"[\"");}}
if(result0===null){if(input.charCodeAt(pos)===93){result0="]";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"]\"");}}
if(result0===null){if(input.charCodeAt(pos)===47){result0="/";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"/\"");}}
if(result0===null){if(input.charCodeAt(pos)===63){result0="?";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"?\"");}}
if(result0===null){if(input.charCodeAt(pos)===58){result0=":";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result0===null){if(input.charCodeAt(pos)===43){result0="+";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"+\"");}}
if(result0===null){if(input.charCodeAt(pos)===36){result0="$";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"$\"");}}}}}}}}
return result0;}
function parse_Request_Response(){var result0;result0=parse_Status_Line();if(result0===null){result0=parse_Request_Line();}
return result0;}
function parse_Request_Line(){var result0,result1,result2,result3,result4;var pos0;pos0=pos;result0=parse_Method();if(result0!==null){result1=parse_SP();if(result1!==null){result2=parse_Request_URI();if(result2!==null){result3=parse_SP();if(result3!==null){result4=parse_SIP_Version();if(result4!==null){result0=[result0,result1,result2,result3,result4];}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}}else{ result0=null;pos=pos0;}}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
return result0;}
function parse_Request_URI(){var result0;result0=parse_SIP_URI();if(result0===null){result0=parse_absoluteURI();}
return result0;}
function parse_absoluteURI(){var result0,result1,result2;var pos0;pos0=pos;result0=parse_scheme();if(result0!==null){if(input.charCodeAt(pos)===58){result1=":";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result1!==null){result2=parse_hier_part();if(result2===null){result2=parse_opaque_part();}
if(result2!==null){result0=[result0,result1,result2];}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
return result0;}
function parse_hier_part(){var result0,result1,result2;var pos0,pos1;pos0=pos;result0=parse_net_path();if(result0===null){result0=parse_abs_path();}
if(result0!==null){pos1=pos;if(input.charCodeAt(pos)===63){result1="?";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"?\"");}}
if(result1!==null){result2=parse_query();if(result2!==null){result1=[result1,result2];}else{result1=null;pos=pos1;}}else{result1=null;pos=pos1;}
result1=result1!==null?result1:"";if(result1!==null){result0=[result0,result1];}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
 return result0;}
function parse_net_path(){var result0,result1,result2;var pos0;pos0=pos;if(input.substr(pos,2)==="//"){result0="//";pos+=2;}else{result0=null;if(reportFailures===0){matchFailed("\"//\"");}}
if(result0!==null){result1=parse_authority();if(result1!==null){result2=parse_abs_path();result2=result2!==null?result2:"";if(result2!==null){result0=[result0,result1,result2];}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
return result0;}
function parse_abs_path(){var result0,result1;var pos0;pos0=pos;if(input.charCodeAt(pos)===47){result0="/";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"/\"");}}
if(result0!==null){result1=parse_path_segments();if(result1!==null){result0=[result0,result1];}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
return result0;}
function parse_opaque_part(){var result0,result1,result2;var pos0;pos0=pos;result0=parse_uric_no_slash();if(result0!==null){result1=[];result2=parse_uric();while(result2!==null){result1.push(result2);result2=parse_uric();}
if(result1!==null){result0=[result0,result1];}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
return result0;}
function parse_uric(){var result0;result0=parse_reserved();if(result0===null){result0=parse_unreserved();if(result0===null){result0=parse_escaped();}}
return result0;}
function parse_uric_no_slash(){var result0;result0=parse_unreserved();if(result0===null){result0=parse_escaped();if(result0===null){if(input.charCodeAt(pos)===59){result0=";";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\";\"");}}
if(result0===null){if(input.charCodeAt(pos)===63){result0="?";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"?\"");}}
if(result0===null){if(input.charCodeAt(pos)===58){result0=":";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result0===null){if(input.charCodeAt(pos)===64){result0="@";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"@\"");}}
if(result0===null){if(input.charCodeAt(pos)===38){result0="&";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"&\"");}}
if(result0===null){if(input.charCodeAt(pos)===61){result0="=";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"=\"");}}
if(result0===null){if(input.charCodeAt(pos)===43){result0="+";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"+\"");}}
if(result0===null){if(input.charCodeAt(pos)===36){result0="$";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"$\"");}}
if(result0===null){if(input.charCodeAt(pos)===44){result0=",";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\",\"");}}
}}}}}}}}}}
return result0;}
function parse_path_segments(){var result0,result1,result2,result3;var pos0,pos1;pos0=pos;result0=parse_segment();if(result0!==null){result1=[];pos1=pos;if(input.charCodeAt(pos)===47){result2="/";pos++;}else{result2=null;if(reportFailures===0){matchFailed("\"/\"");}}
if(result2!==null){result3=parse_segment();if(result3!==null){result2=[result2,result3];}else{result2=null;pos=pos1;}}else{result2=null;pos=pos1;}
while(result2!==null){result1.push(result2);pos1=pos;if(input.charCodeAt(pos)===47){result2="/";pos++;}else{result2=null;if(reportFailures===0){matchFailed("\"/\"");}}
if(result2!==null){result3=parse_segment();if(result3!==null){result2=[result2,result3];}else{result2=null;pos=pos1;}}else{result2=null;pos=pos1;}}
if(result1!==null){result0=[result0,result1];}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
return result0;}
function parse_segment(){var result0,result1,result2,result3;var pos0,pos1;pos0=pos;result0=[];result1=parse_pchar();while(result1!==null){result0.push(result1);result1=parse_pchar();}
if(result0!==null){result1=[];pos1=pos;if(input.charCodeAt(pos)===59){result2=";";pos++;}else{result2=null;if(reportFailures===0){matchFailed("\";\"");}}
if(result2!==null){result3=parse_param();if(result3!==null){result2=[result2,result3];}else{result2=null;pos=pos1;}}else{result2=null;pos=pos1;}
while(result2!==null){result1.push(result2);pos1=pos;if(input.charCodeAt(pos)===59){result2=";";pos++;}else{result2 =null;if(reportFailures===0){matchFailed("\";\"");}}
if(result2!==null){result3=parse_param();if(result3!==null){result2=[result2,result3];}else{result2=null;pos=pos1;}}else{result2=null;pos=pos1;}}
if(result1!==null){result0=[result0,result1];}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
return result0;}
function parse_param(){var result0,result1;result0=[];result1=parse_pchar();while(result1!==null){result0.push(result1);result1=parse_pchar();}
return result0;}
function parse_pchar(){var result0;result0=parse_unreserved();if(result0===null){result0=parse_escaped();if(result0===null){if(input.charCodeAt(pos)===58){result0=":";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result0===null){if(input.charCodeAt(pos)===64){result0="@";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"@\"");}}
if(result0===null){if(input.charCodeAt(pos)===38){result0="&";pos++;}else{result0=null;if(reportFailures ===0){matchFailed("\"&\"");}}
if(result0===null){if(input.charCodeAt(pos)===61){result0="=";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"=\"");}}
if(result0===null){if(input.charCodeAt(pos)===43){result0="+";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"+\"");}}
if(result0===null){if(input.charCodeAt(pos)===36){result0="$";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"$\"");}}
if(result0===null){if(input.charCodeAt(pos)===44){result0=",";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\",\"");}}}}}}}}}}
return result0;}
function parse_scheme(){var result0,result1,result2;var pos0,pos1;pos0=pos;pos1=pos;result0=parse_ALPHA();if(result0!==null){result1=[];result2= parse_ALPHA();if(result2===null){result2=parse_DIGIT();if(result2===null){if(input.charCodeAt(pos)===43){result2="+";pos++;}else{result2=null;if(reportFailures===0){matchFailed("\"+\"");}}
if(result2===null){if(input.charCodeAt(pos)===45){result2="-";pos++;}else{result2=null;if(reportFailures===0){matchFailed("\"-\"");}}
if(result2===null){if(input.charCodeAt(pos)===46){result2=".";pos++;}else{result2=null;if(reportFailures===0){matchFailed("\".\"");}}}}}}
while(result2!==null){result1.push(result2);result2=parse_ALPHA();if(result2===null){result2=parse_DIGIT();if(result2===null){if(input.charCodeAt(pos)===43){result2="+";pos++;}else{result2=null;if(reportFailures===0){matchFailed("\"+\"");}}
if(result2===null){if(input.charCodeAt(pos)===45){result2="-";pos++;}else{result2=null;if(reportFailures===0){matchFailed("\"-\"");}}
if(result2===null){if(input.charCodeAt(pos)===46){result2=".";pos++;}else{result2=null;if(reportFailures===0){matchFailed("\".\"");}}}}}}}
if(result1!==null){result0=[result0,result1];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset){data.scheme=input.substring(pos,offset);})(pos0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_authority(){var result0;result0=parse_srvr();if(result0===null){result0=parse_reg_name();}
return result0;}
function parse_srvr(){var result0,result1;var pos0,pos1;pos0=pos;pos1=pos;result0=parse_userinfo();if(result0!==null){if(input.charCodeAt(pos)===64){result1="@";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"@\"");}}
if(result1!==null){result0=[result0,result1];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
result0=result0!==null?result0:"";if(result0!==null){result1=parse_hostport();if(result1!==null){result0=[result0,result1];}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
result0=result0!==null?result0:"";return result0;}
function parse_reg_name(){var result0,result1;result1=parse_unreserved();if(result1===null){result1=parse_escaped();if(result1===null){if(input.charCodeAt(pos)===36){result1="$";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"$\"");}}
if(result1===null){if(input.charCodeAt(pos)===44){result1=",";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\",\"");}}
if(result1===null){if(input.charCodeAt(pos)===59){result1=";";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\";\"");}}
if(result1===null){if(input.charCodeAt(pos)===58){result1=":";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result1===null){if(input.charCodeAt(pos)===64){result1="@";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"@\"");}}
if(result1===null){if(input.charCodeAt(pos)===38){result1="&";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"&\"");}}
if(result1===null){if(input.charCodeAt(pos)===61){result1="=";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"=\"");}}
if(result1===null){if(input.charCodeAt(pos)===43){result1="+";pos++;}else{result1=null;if(reportFailures===0){ matchFailed("\"+\"");}}}}}}}}}}}
if(result1!==null){result0=[];while(result1!==null){result0.push(result1);result1=parse_unreserved();if(result1===null){result1=parse_escaped();if(result1===null){if(input.charCodeAt(pos)===36){result1="$";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"$\"");}}
if(result1===null){if(input.charCodeAt(pos)===44){result1=",";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\",\"");}}
if(result1===null){if(input.charCodeAt(pos)===59){result1=";";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\";\"");}}
if(result1===null){if(input.charCodeAt(pos)===58){result1=":";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result1===null){if(input.charCodeAt(pos)===64){result1="@";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"@\"");}}
if(result1===null){if(input.charCodeAt(pos)===38){result1="&";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"&\"");}}
if(result1===null){if(input.charCodeAt(pos)===61){result1="=";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"=\"");}}
if(result1===null){if(input.charCodeAt(pos)===43){result1="+";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"+\"");}}}}}}}}}}}}}else{result0=null;}
return result0;}
function parse_query(){var result0,result1;result0=[];result1=parse_uric();while(result1!==null){result0.push(result1);result1=parse_uric();}
return result0;}
function parse_SIP_Version(){var result0,result1,result2,result3,result4,result5;var pos0,pos1;pos0=pos;pos1=pos;if(input.substr(pos,3).toLowerCase()==="sip"){result0=input.substr(pos,3);pos+=3;}else{result0=null;if(reportFailures===0){matchFailed("\"SIP\"");}}
if(result0!==null){if(input.charCodeAt(pos)===47){result1="/";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"/\"");}}
if(result1!==null){result3=parse_DIGIT();if(result3!==null){result2=[];while(result3!==null){result2.push(result3);result3=parse_DIGIT();}}else{result2=null;}
if(result2!==null){if(input.charCodeAt(pos)===46){result3=".";pos++;}else{result3= null;if(reportFailures===0){matchFailed("\".\"");}}
if(result3!==null){result5=parse_DIGIT();if(result5!==null){result4=[];while(result5!==null){result4.push(result5);result5=parse_DIGIT();}}else{result4=null;}
if(result4!==null){result0=[result0,result1,result2,result3,result4];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset){data.sip_version=input.substring(pos,offset);})(pos0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_INVITEm(){var result0;if(input.substr(pos,6)==="INVITE"){result0="INVITE";pos+=6;}else{result0=null;if(reportFailures===0){matchFailed("\"INVITE\"");}}
return result0;}
function parse_ACKm(){var result0;if(input.substr(pos,3)==="ACK"){result0="ACK";pos+=3;}else{result0=null;if(reportFailures===0){matchFailed("\"ACK\"");}}
return result0;}
function parse_OPTIONSm(){var result0;if(input.substr(pos,7)==="OPTIONS"){result0="OPTIONS";pos+=7;}else{result0=null;if(reportFailures===0){matchFailed("\"OPTIONS\"");}}
return result0;}
function parse_BYEm(){var result0;if(input.substr(pos,3)==="BYE"){result0="BYE";pos+=3;}else{result0=null;if(reportFailures===0){matchFailed("\"BYE\"");}}
return result0;}
function parse_CANCELm(){var result0;if(input.substr(pos,6)==="CANCEL"){result0="CANCEL";pos+=6;}else{result0=null;if(reportFailures===0){matchFailed("\"CANCEL\"");}}
return result0;}
function parse_REGISTERm(){var result0;if(input.substr(pos,8)==="REGISTER"){result0="REGISTER";pos+=8;}else{result0=null;if(reportFailures===0){matchFailed("\"REGISTER\"");}}
return result0;}
function parse_SUBSCRIBEm(){var result0;if(input.substr(pos,9)==="SUBSCRIBE"){result0="SUBSCRIBE";pos+=9;}else{result0=null;if(reportFailures===0){matchFailed("\"SUBSCRIBE\"");}}
return result0;}
function parse_NOTIFYm(){var result0;if(input.substr(pos,6)==="NOTIFY"){result0="NOTIFY";pos+=6;}else{result0=null;if(reportFailures===0){matchFailed("\"NOTIFY\"");}}
return result0;}
 function parse_Method(){var result0;var pos0;pos0=pos;result0=parse_INVITEm();if(result0===null){result0=parse_ACKm();if(result0===null){result0=parse_OPTIONSm();if(result0===null){result0=parse_BYEm();if(result0===null){result0=parse_CANCELm();if(result0===null){result0=parse_REGISTERm();if(result0===null){result0=parse_SUBSCRIBEm();if(result0===null){result0=parse_NOTIFYm();if(result0===null){result0=parse_token();}}}}}}}}
if(result0!==null){result0=(function(offset){data.method=input.substring(pos,offset);return data.method;})(pos0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_Status_Line(){var result0,result1,result2,result3,result4;var pos0;pos0=pos;result0=parse_SIP_Version();if(result0!==null){result1=parse_SP();if(result1!==null){result2=parse_Status_Code();if(result2!==null){result3=parse_SP();if(result3!==null){result4=parse_Reason_Phrase();if(result4!==null){result0=[result0,result1,result2,result3,result4];}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
return result0;}
function parse_Status_Code(){var result0;var pos0;pos0=pos;result0=parse_extension_code();if(result0!==null){result0=(function(offset,status_code){data.status_code=parseInt(status_code.join(''));})(pos0,result0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_extension_code(){var result0,result1,result2;var pos0;pos0=pos;result0=parse_DIGIT();if(result0!==null){result1=parse_DIGIT();if(result1!==null){result2=parse_DIGIT();if(result2!==null){result0=[result0,result1,result2];}else{result0= null;pos=pos0;}}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
return result0;}
function parse_Reason_Phrase(){var result0,result1;var pos0;pos0=pos;result0=[];result1=parse_reserved();if(result1===null){result1=parse_unreserved();if(result1===null){result1=parse_escaped();if(result1===null){result1=parse_UTF8_NONASCII();if(result1===null){result1=parse_UTF8_CONT();if(result1===null){result1=parse_SP();if(result1===null){result1=parse_HTAB();}}}}}}
while(result1!==null){result0.push(result1);result1=parse_reserved();if(result1===null){result1=parse_unreserved();if(result1===null){result1=parse_escaped();if(result1===null){result1=parse_UTF8_NONASCII();if(result1===null){result1=parse_UTF8_CONT();if(result1===null){result1=parse_SP();if(result1===null){result1=parse_HTAB();}}}}}}}
if(result0!==null){result0=(function(offset){data.reason_phrase=input.substring(pos,offset);})(pos0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_Allow_Events(){var result0,result1,result2,result3;var pos0,pos1;pos0=pos;result0=parse_event_type();if(result0!==null){result1=[];pos1=pos;result2=parse_COMMA();if(result2!==null){result3=parse_event_type();if(result3!==null){result2=[result2,result3];}else{result2=null;pos=pos1;}}else{result2=null;pos=pos1;}
while(result2!==null){result1.push(result2);pos1=pos;result2=parse_COMMA();if(result2!==null){result3=parse_event_type();if(result3!==null){result2=[result2,result3];}else{result2=null;pos=pos1;}}else{result2=null;pos=pos1;}}
if(result1!==null){result0=[result0,result1];}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
return result0;}
function parse_Call_ID(){var result0,result1,result2;var pos0,pos1,pos2;pos0=pos;pos1=pos;result0=parse_word();if(result0!==null){pos2=pos;if(input.charCodeAt(pos)===64){result1="@";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\"@\"");}}
if(result1!==null){result2=parse_word();if(result2!==null){result1=[result1,result2];}else{result1=null;pos=pos2;}
}else{result1=null;pos=pos2;}
result1=result1!==null?result1:"";if(result1!==null){result0=[result0,result1];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset){data=input.substring(pos,offset);})(pos0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_Contact(){var result0,result1,result2,result3;var pos0,pos1,pos2;pos0=pos;result0=parse_STAR();if(result0===null){pos1=pos;result0=parse_contact_param();if(result0!==null){result1=[];pos2=pos;result2=parse_COMMA();if(result2!==null){result3=parse_contact_param();if(result3!==null){result2=[result2,result3];}else{result2=null;pos=pos2;}}else{result2=null;pos=pos2;}
while(result2!==null){result1.push(result2);pos2=pos;result2=parse_COMMA();if(result2!==null){result3=parse_contact_param();if(result3!==null){result2=[result2,result3];}else{result2=null;pos=pos2;}}else{result2=null;pos=pos2;}}
if(result1!==null){result0=[result0,result1];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}
if(result0!==null){result0=(function(offset){var idx;for(idx in data.multi_header){if(data.multi_header[idx].parsed===null){data=null;break;}}
if(data!==null){data=data.multi_header;}else{data=-1;}})(pos0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_contact_param(){var result0,result1,result2,result3;var pos0,pos1,pos2;pos0=pos;pos1=pos;result0=parse_SIP_URI_noparams();if(result0===null){result0=parse_name_addr();}
if(result0!==null){result1=[];pos2=pos;result2=parse_SEMI();if(result2!==null){result3=parse_contact_params();if(result3!==null){result2=[result2,result3];}else{result2=null;pos=pos2;}}else{result2=null;pos=pos2;}
while(result2!==null){result1.push(result2);pos2=pos;result2=parse_SEMI();if(result2!==null){result3=parse_contact_params();if(result3!==null){result2=[result2,result3];}else{result2=null;pos=pos2;}}else{result2=null;pos=pos2;}}
if(result1!==null){result0=[result0,result1];}else{result0=null;pos=pos1;}}else{result0=null; pos=pos1;}
if(result0!==null){result0=(function(offset){var header;if(!data.multi_header)data.multi_header=[];try{header=new JsSIP.NameAddrHeader(data.uri,data.display_name,data.params);delete data.uri;delete data.display_name;delete data.params;}catch(e){header=null;}
data.multi_header.push({'possition':pos,'offset':offset,'parsed':header});})(pos0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_name_addr(){var result0,result1,result2,result3;var pos0;pos0=pos;result0=parse_display_name();result0=result0!==null?result0:"";if(result0!==null){result1=parse_LAQUOT();if(result1!==null){result2=parse_SIP_URI();if(result2!==null){result3=parse_RAQUOT();if(result3!==null){result0=[result0,result1,result2,result3];}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
return result0;}
function parse_display_name(){var result0,result1,result2,result3;var pos0,pos1,pos2;pos0=pos;pos1=pos;result0=parse_token();if(result0!==null){result1=[];pos2=pos;result2=parse_LWS();if(result2!==null){result3=parse_token();if(result3!==null){result2=[result2,result3];}else{result2=null;pos=pos2;}}else{result2=null;pos=pos2;}
while(result2!==null){result1.push(result2);pos2=pos;result2=parse_LWS();if(result2!==null){result3=parse_token();if(result3!==null){result2=[result2,result3];}else{result2=null;pos=pos2;}}else{result2=null;pos=pos2;}}
if(result1!==null){result0=[result0,result1];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0===null){result0=parse_quoted_string();}
if(result0!==null){result0=(function(offset,display_name){display_name=input.substring(pos,offset).trim();if(display_name[0]==='\"'){display_name=display_name.substring(1,display_name.length-1);}
data.display_name=display_name;})(pos0,result0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_contact_params(){var result0;result0=parse_c_p_q();if(result0===null){result0=parse_c_p_expires();if(result0===null){result0=parse_generic_param();}}
return result0;}
function parse_c_p_q(){var result0,result1,result2;var pos0,pos1;pos0=pos;pos1=pos;if(input.substr(pos,1).toLowerCase()==="q"){result0=input.substr(pos,1);pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"q\"");}}
if(result0!==null){result1=parse_EQUAL();if(result1!==null){result2=parse_qvalue();if(result2!==null){result0=[result0,result1,result2];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0 =(function(offset,q){if(!data.params)data.params={};data.params['q']=q;})(pos0,result0[2]);}
if(result0===null){pos=pos0;}
return result0;}
function parse_c_p_expires(){var result0,result1,result2;var pos0,pos1;pos0=pos;pos1=pos;if(input.substr(pos,7).toLowerCase()==="expires"){result0=input.substr(pos,7);pos+=7;}else{result0=null;if(reportFailures===0){matchFailed("\"expires\"");}}
if(result0!==null){result1=parse_EQUAL();if(result1!==null){result2=parse_delta_seconds();if(result2!==null){result0=[result0,result1,result2];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset,expires){if(!data.params)data.params={};data.params['expires']=expires;})(pos0,result0[2]);}
if(result0===null){pos=pos0;}
return result0;}
function parse_delta_seconds(){var result0,result1;var pos0;pos0=pos;result1=parse_DIGIT();if(result1!==null){result0=[];while(result1!==null){result0.push(result1);result1=parse_DIGIT();}}else{result0=null;}
if(result0!==null){result0=(function(offset,delta_seconds){return parseInt(delta_seconds.join(''));})(pos0,result0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_qvalue(){var result0,result1,result2,result3,result4;var pos0,pos1,pos2;pos0=pos;pos1=pos;if(input.charCodeAt(pos)===48){result0="0";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"0\"");}}
if(result0!==null){pos2=pos;if(input.charCodeAt(pos)===46){result1=".";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\".\"");}}
if(result1!==null){result2=parse_DIGIT();result2=result2!==null?result2:"";if(result2!==null){result3=parse_DIGIT();result3=result3!==null?result3:"";if(result3!==null){result4=parse_DIGIT();result4=result4!==null?result4:"";if(result4!==null){result1=[result1,result2,result3,result4];}else{result1=null;pos=pos2;}}else{result1=null;pos=pos2;}}else{result1=null;pos=pos2;}}else{result1=null;pos=pos2;}
result1=result1!==null?result1:"";if(result1!==null){result0=[result0,result1];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){ result0=(function(offset){return parseFloat(input.substring(pos,offset));})(pos0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_generic_param(){var result0,result1,result2;var pos0,pos1,pos2;pos0=pos;pos1=pos;result0=parse_token();if(result0!==null){pos2=pos;result1=parse_EQUAL();if(result1!==null){result2=parse_gen_value();if(result2!==null){result1=[result1,result2];}else{result1=null;pos=pos2;}}else{result1=null;pos=pos2;}
result1=result1!==null?result1:"";if(result1!==null){result0=[result0,result1];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!== null){result0=(function(offset,param,value){if(!data.params)data.params={};if(typeof value==='undefined'){value=undefined;}
else{value=value[1];}
data.params[param.toLowerCase()]=value;})(pos0,result0[0],result0[1]);}
if(result0===null){pos=pos0;}
return result0;}
function parse_gen_value(){var result0;result0=parse_token();if(result0===null){result0=parse_host();if(result0===null){result0=parse_quoted_string();}}
return result0;}
function parse_Content_Disposition(){var result0,result1,result2,result3;var pos0,pos1;pos0=pos;result0=parse_disp_type();if(result0!==null){result1=[];pos1=pos;result2=parse_SEMI();if(result2!==null){result3=parse_disp_param();if(result3!==null){result2=[result2,result3];}else{result2=null;pos=pos1;}}else{result2=null;pos=pos1;}
while(result2!==null){result1.push(result2);pos1=pos;result2=parse_SEMI();if(result2!==null){result3=parse_disp_param();if(result3!==null){result2=[result2,result3];}else{result2=null;pos=pos1;}}else{result2=null;pos=pos1;}
}
if(result1!==null){result0=[result0,result1];}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
return result0;}
function parse_disp_type(){var result0;if(input.substr(pos,6).toLowerCase()==="render"){result0=input.substr(pos,6);pos+=6;}else{result0=null;if(reportFailures===0){matchFailed("\"render\"");}}
if(result0===null){if(input.substr(pos,7).toLowerCase()==="session"){result0=input.substr(pos,7);pos+=7;}else{result0=null;if(reportFailures===0){matchFailed("\"session\"");}}
if(result0===null){if(input.substr(pos,4).toLowerCase()==="icon"){result0=input.substr(pos,4);pos+=4;}else{result0=null;if(reportFailures===0){matchFailed("\"icon\"");}}
if(result0===null){if(input.substr(pos,5).toLowerCase()==="alert"){result0=input.substr(pos,5);pos+=5;}else{result0=null;if(reportFailures===0){matchFailed("\"alert\"");}}
if(result0===null){result0=parse_token();}}}}
return result0;}
function parse_disp_param(){var result0;result0=parse_handling_param();if(result0===null){result0=parse_generic_param();}
return result0;}
function parse_handling_param(){var result0,result1,result2;var pos0;pos0=pos;if(input.substr(pos,8).toLowerCase()==="handling"){result0=input.substr(pos,8);pos+=8;}else{result0=null;if(reportFailures===0){matchFailed("\"handling\"");}}
if(result0!==null){result1=parse_EQUAL();if(result1!==null){if(input.substr(pos,8).toLowerCase()==="optional"){result2=input.substr(pos,8);pos+=8;}else{result2=null;if(reportFailures===0){matchFailed("\"optional\"");}}
if(result2===null){if(input.substr(pos,8).toLowerCase()==="required"){result2=input.substr(pos,8);pos+=8;}else{result2=null;if(reportFailures===0){matchFailed("\"required\"");}}
if(result2===null){result2=parse_token();}}
if(result2!==null){result0=[result0,result1,result2];}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
return result0;}
function parse_Content_Encoding(){var result0,result1,result2,result3;var pos0,pos1;pos0=pos;result0=parse_token();if(result0!==null){result1=[];pos1=pos;result2=parse_COMMA();if(result2!==null){result3=parse_token();if(result3!==null){result2=[result2,result3];}else{result2=null;pos=pos1;}}else{result2=null;pos=pos1;}
while(result2!==null){result1.push(result2);pos1=pos;result2=parse_COMMA();if(result2!==null){result3=parse_token();if(result3!==null){result2=[result2,result3];}else{result2=null;pos=pos1;}}else{result2=null;pos=pos1;}}
if(result1!==null){result0=[result0,result1];}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
return result0;}
function parse_Content_Length(){var result0,result1;var pos0;pos0=pos;result1=parse_DIGIT();if(result1!==null){result0=[];while(result1!==null){result0.push(result1);result1=parse_DIGIT();}}else{result0=null;}
if(result0!==null){result0=(function(offset,length){data=parseInt(length.join(''));})(pos0,result0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_Content_Type(){var result0;var pos0;pos0=pos;result0=parse_media_type();if(result0!==null){result0=(function(offset){data=input.substring(pos,offset);})(pos0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_media_type(){var result0,result1,result2,result3,result4,result5;var pos0,pos1;pos0=pos;result0=parse_m_type();if(result0!==null){result1=parse_SLASH();if(result1!==null){result2=parse_m_subtype();if(result2!==null){result3=[];pos1=pos;result4=parse_SEMI();if(result4!==null){result5=parse_m_parameter();if(result5!==null){result4=[result4,result5];}else{result4=null;pos=pos1;}}else{result4=null;pos=pos1;}
while(result4!==null){result3.push(result4);pos1=pos;result4=parse_SEMI();if(result4!==null){result5=parse_m_parameter();if(result5!==null){result4=[result4,result5];}else{result4=null;pos=pos1;}}else{result4=null;pos=pos1;}}
if(result3!==null){result0=[result0,result1,result2,result3];}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
return result0;}
function parse_m_type(){var result0;result0=parse_discrete_type();if(result0===null){result0=parse_composite_type();}
return result0;}
function parse_discrete_type(){var result0;if(input.substr(pos,4).toLowerCase()==="text"){result0=input.substr(pos,4);pos+=4;}else{result0=null;if(reportFailures===0){matchFailed("\"text\"");}}
if(result0===null){if(input.substr(pos,5).toLowerCase()==="image"){result0=input.substr(pos,5);pos+=5;}else{result0=null;if(reportFailures===0){matchFailed("\"image\"");}}
if(result0===null){if(input.substr(pos,5).toLowerCase()==="audio"){result0=input.substr(pos,5);pos+=5;}else{result0=null;if(reportFailures===0){matchFailed("\"audio\"");}}
if(result0===null){if(input.substr(pos,5).toLowerCase()==="video"){result0=input.substr(pos,5);pos+=5;}else{result0=null;if(reportFailures===0){matchFailed("\"video\"");}}
if(result0===null){ if(input.substr(pos,11).toLowerCase()==="application"){result0=input.substr(pos,11);pos+=11;}else{result0=null;if(reportFailures===0){matchFailed("\"application\"");}}
if(result0===null){result0=parse_extension_token();}}}}}
return result0;}
function parse_composite_type(){var result0;if(input.substr(pos,7).toLowerCase()==="message"){result0=input.substr(pos,7);pos+=7;}else{result0=null;if(reportFailures===0){matchFailed("\"message\"");}}
if(result0===null){if(input.substr(pos,9).toLowerCase()==="multipart"){result0=input.substr(pos,9);pos+=9;}else{result0=null;if(reportFailures===0){matchFailed("\"multipart\"");}}
if(result0===null){result0=parse_extension_token();}}
return result0;}
function parse_extension_token(){var result0;result0=parse_token();if(result0===null){result0=parse_x_token();}
return result0;}
function parse_x_token(){var result0,result1;var pos0;pos0=pos;if(input.substr(pos,2).toLowerCase()==="x-"){result0=input.substr(pos,2);pos+=2;}else{result0=null;if(reportFailures===0){matchFailed("\"x-\"");}}
if(result0!==null){result1=parse_token();if(result1!==null){result0=[result0,result1];}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
return result0;}
function parse_m_subtype(){var result0;result0=parse_extension_token();if(result0===null){result0=parse_token();}
return result0;}
function parse_m_parameter(){var result0,result1,result2;var pos0;pos0=pos;result0=parse_token();if(result0!==null){result1=parse_EQUAL();if(result1!==null){result2=parse_m_value();if(result2!==null){result0=[result0,result1,result2];}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
return result0;}
function parse_m_value(){var result0;result0=parse_token();if(result0===null){result0=parse_quoted_string();}
return result0;}
function parse_CSeq(){var result0,result1,result2;var pos0;pos0=pos;result0=parse_CSeq_value();if(result0!==null){result1=parse_LWS();if(result1!==null){result2=parse_Method();if(result2!==null){result0=[result0,result1,result2];}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
return result0;}
function parse_CSeq_value(){ var result0,result1;var pos0;pos0=pos;result1=parse_DIGIT();if(result1!==null){result0=[];while(result1!==null){result0.push(result1);result1=parse_DIGIT();}}else{result0=null;}
if(result0!==null){result0=(function(offset,cseq_value){data.value=parseInt(cseq_value.join(''));})(pos0,result0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_Expires(){var result0;var pos0;pos0=pos;result0=parse_delta_seconds();if(result0!==null){result0=(function(offset,expires){data=expires;})(pos0,result0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_Event(){var result0,result1,result2,result3;var pos0,pos1,pos2;pos0=pos;pos1=pos;result0=parse_event_type();if(result0!==null){result1=[];pos2=pos;result2=parse_SEMI();if(result2!==null){result3=parse_generic_param();if(result3!==null){result2=[result2,result3];}else{result2=null;pos=pos2;}}else{result2=null;pos=pos2;}
while(result2!==null){result1.push(result2);pos2=pos;result2=parse_SEMI();if(result2!==null){result3=parse_generic_param();if(result3!==null){result2=[result2,result3];}else{result2=null;pos=pos2;}}else{result2=null;pos=pos2;}}
if(result1!==null){result0=[result0,result1];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset,event_type){data.event=event_type.join('').toLowerCase();})(pos0,result0[0]);}
if(result0===null){pos=pos0;}
return result0;}
function parse_event_type(){var result0,result1,result2,result3;var pos0,pos1;pos0=pos;result0=parse_token_nodot();if(result0!==null){result1=[];pos1=pos;if(input.charCodeAt(pos)===46){result2=".";pos++;}else{result2=null;if(reportFailures===0){matchFailed("\".\"");}}
if(result2!==null){ result3=parse_token_nodot();if(result3!==null){result2=[result2,result3];}else{result2=null;pos=pos1;}}else{result2=null;pos=pos1;}
while(result2!==null){result1.push(result2);pos1=pos;if(input.charCodeAt(pos)===46){result2=".";pos++;}else{result2=null;if(reportFailures===0){matchFailed("\".\"");}}
if(result2!==null){result3=parse_token_nodot();if(result3!==null){result2=[result2,result3];}else{result2=null;pos=pos1;}}else{result2=null;pos=pos1;}}
if(result1!==null){result0=[result0,result1];}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
return result0;}
function parse_From(){var result0,result1,result2,result3;var pos0,pos1,pos2;pos0=pos;pos1=pos;result0=parse_SIP_URI_noparams();if(result0===null){result0=parse_name_addr();}
if(result0!==null){result1=[];pos2=pos;result2=parse_SEMI();if(result2!==null){result3=parse_from_param();if(result3!==null){result2=[result2,result3];}else{result2=null;pos=pos2;}}else{result2=null;pos=pos2;}
while(result2!==null){ result1.push(result2);pos2=pos;result2=parse_SEMI();if(result2!==null){result3=parse_from_param();if(result3!==null){result2=[result2,result3];}else{result2=null;pos=pos2;}}else{result2=null;pos=pos2;}}
if(result1!==null){result0=[result0,result1];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset){var tag=data.tag;try{data=new JsSIP.NameAddrHeader(data.uri,data.display_name,data.params);if(tag){data.setParam('tag',tag)}}catch(e){data=-1;}})(pos0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_from_param(){var result0;result0=parse_tag_param();if(result0===null){result0=parse_generic_param();}
return result0;}
function parse_tag_param(){var result0,result1,result2;var pos0,pos1;pos0=pos;pos1=pos;if(input.substr(pos,3).toLowerCase()==="tag"){result0=input.substr(pos,3);pos+=3;}else{result0=null;if(reportFailures===0){matchFailed("\"tag\"");}}
if(result0!==null){result1=parse_EQUAL();if(result1!==null){result2=parse_token();if(result2!==null){result0=[result0,result1,result2];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset,tag){data.tag=tag;})(pos0,result0[2]);}
if(result0===null){pos=pos0;}
return result0;}
function parse_Max_Forwards(){var result0,result1;var pos0;pos0=pos;result1=parse_DIGIT();if(result1!==null){result0=[];while(result1!==null){result0.push(result1);result1=parse_DIGIT();}}else{result0=null;}
if(result0!==null){result0=(function(offset,forwards){data=parseInt(forwards.join(''));})(pos0,result0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_Min_Expires(){var result0;var pos0;pos0=pos;result0=parse_delta_seconds();if(result0!==null){result0=(function(offset,min_expires){data=min_expires;})(pos0,result0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_Name_Addr_Header(){var result0,result1,result2,result3,result4,result5,result6;var pos0,pos1,pos2;pos0=pos;pos1=pos;result0=[];result1=parse_display_name();while(result1!==null){result0.push(result1);result1=parse_display_name();}
if(result0!==null){result1=parse_LAQUOT();if(result1!==null){result2=parse_SIP_URI();if(result2!==null){result3=parse_RAQUOT();if(result3!==null){result4=[];pos2=pos;result5=parse_SEMI();if(result5!==null){ result6=parse_generic_param();if(result6!==null){result5=[result5,result6];}else{result5=null;pos=pos2;}}else{result5=null;pos=pos2;}
while(result5!==null){result4.push(result5);pos2=pos;result5=parse_SEMI();if(result5!==null){result6=parse_generic_param();if(result6!==null){result5=[result5,result6];}else{result5=null;pos=pos2;}}else{result5=null;pos=pos2;}}
if(result4!==null){result0=[result0,result1,result2,result3,result4];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset){try{data=new JsSIP.NameAddrHeader(data.uri,data.display_name,data.params);}catch(e){data=-1;}})(pos0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_Proxy_Authenticate(){var result0;
result0=parse_challenge();return result0;}
function parse_challenge(){var result0,result1,result2,result3,result4,result5;var pos0,pos1;pos0=pos;if(input.substr(pos,6).toLowerCase()==="digest"){result0=input.substr(pos,6);pos+=6;}else{result0=null;if(reportFailures===0){matchFailed("\"Digest\"");}}
if(result0!==null){result1=parse_LWS();if(result1!==null){result2=parse_digest_cln();if(result2!==null){result3=[];pos1=pos;result4=parse_COMMA();if(result4!==null){result5=parse_digest_cln();if(result5!==null){result4=[result4,result5];}else{result4=null;pos=pos1;}}else{result4=null;pos=pos1;}
while(result4!==null){result3.push(result4);pos1=pos;result4=parse_COMMA();if(result4!==null){result5=parse_digest_cln();if(result5!==null){result4=[result4,result5];}else{result4=null;pos=pos1;}}else{result4=null;pos=pos1;}}
if(result3!==null){result0=[result0,result1,result2,result3];}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
if(result0===null){result0=parse_other_challenge();}
return result0;}
function parse_other_challenge(){var result0,result1,result2,result3,result4,result5;var pos0,pos1;pos0=pos;result0=parse_token();if(result0!==null){result1=parse_LWS();if(result1!==null){result2=parse_auth_param();if(result2!==null){result3=[];pos1=pos;result4=parse_COMMA();if(result4!==null){result5=parse_auth_param();if(result5!==null){result4=[result4,result5];}else{result4=null;pos=pos1;}}else{result4=null;pos=pos1;}
while(result4!==null){result3.push(result4);pos1=pos;result4=parse_COMMA();if(result4!==null){result5=parse_auth_param();if(result5!==null){result4=[result4,result5];}else{result4=null;pos=pos1;}}else{result4=null;pos=pos1;}}
if(result3!==null){result0=[result0,result1,result2,result3];}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
return result0;}
function parse_auth_param(){var result0,result1,result2;var pos0;pos0=pos;result0=parse_token();if(result0!==null){result1=parse_EQUAL();if(result1!==null){result2=parse_token();if(result2===null){result2=parse_quoted_string();}
if(result2!==null){result0=[result0,result1,result2];}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
return result0;}
function parse_digest_cln(){var result0;result0=parse_realm();if(result0===null){result0=parse_domain();if(result0===null){result0=parse_nonce();if(result0===null){result0=parse_opaque();if(result0===null){result0=parse_stale();if(result0===null){result0=parse_algorithm();if(result0===null){result0=parse_qop_options();if(result0===null){result0=parse_auth_param();}}}}}}}
return result0;}
function parse_realm(){var result0,result1,result2;var pos0;pos0=pos;if(input.substr(pos,5).toLowerCase()==="realm"){result0=input.substr(pos,5);pos+=5;}else{result0=null;if(reportFailures===0){matchFailed("\"realm\"");}}
if(result0!==null){result1=parse_EQUAL();if(result1!==null){result2=parse_realm_value();if(result2!==null){result0=[result0,result1,result2];}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
return result0;}
function parse_realm_value(){var result0;var pos0;pos0=pos;result0=parse_quoted_string_clean();if(result0!==null){result0=(function(offset,realm){data.realm=realm;})(pos0,result0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_domain(){var result0,result1,result2,result3,result4,result5,result6;var pos0,pos1;pos0=pos;if(input.substr(pos,6).toLowerCase()==="domain"){result0=input.substr(pos,6);pos+=6;}else{result0=null;if(reportFailures===0){matchFailed("\"domain\"");}}
if(result0!==null){result1=parse_EQUAL();if(result1!==null){result2=parse_LDQUOT();if(result2!==null){result3=parse_URI();if(result3!==null){result4=[];pos1=pos;result6=parse_SP();if(result6!==null){result5=[];while(result6!==null){result5.push(result6);result6=parse_SP();}}else{result5=null;}
if(result5!==null){result6=parse_URI();if(result6!==null){result5=[result5,result6];}else{result5=null;pos=pos1;}}else{result5=null;pos=pos1;}
while(result5!==null){result4.push(result5);pos1=pos;result6=parse_SP();if(result6!==null){result5=[];while(result6!==null){result5.push(result6);result6=parse_SP();}}else{result5=null;}
if(result5!==null){result6=parse_URI();if(result6!==null){result5=[result5,result6];}else{result5=null;pos=pos1;}}else{ result5=null;pos=pos1;}}
if(result4!==null){result5=parse_RDQUOT();if(result5!==null){result0=[result0,result1,result2,result3,result4,result5];}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
return result0;}
function parse_URI(){var result0;result0=parse_absoluteURI();if(result0===null){result0=parse_abs_path();}
return result0;}
function parse_nonce(){var result0,result1,result2;var pos0;pos0=pos;if(input.substr(pos,5).toLowerCase()==="nonce"){result0=input.substr(pos,5);pos+=5;}else{result0=null;if(reportFailures===0){matchFailed("\"nonce\"");}}
if(result0!==null){result1=parse_EQUAL();if(result1!==null){result2=parse_nonce_value();if(result2!==null){result0=[result0,result1,result2];}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
return result0;}
function parse_nonce_value(){var result0;var pos0;pos0=pos;result0=parse_quoted_string_clean();if(result0!==null){result0=(function(offset,nonce){data.nonce=nonce;})(pos0,result0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_opaque(){var result0,result1,result2;var pos0,pos1;pos0=pos;pos1=pos;if(input.substr(pos,6).toLowerCase()==="opaque"){result0=input.substr(pos,6);pos+=6;}else{result0=null;if(reportFailures===0){matchFailed("\"opaque\"");}}
if(result0!==null){result1=parse_EQUAL();if(result1!==null){result2=parse_quoted_string_clean();if(result2!==null){result0=[result0,result1,result2];}else{result0=null;pos=pos1;}}else{result0=null;
pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset,opaque){data.opaque=opaque;})(pos0,result0[2]);}
if(result0===null){pos=pos0;}
return result0;}
function parse_stale(){var result0,result1,result2;var pos0,pos1;pos0=pos;if(input.substr(pos,5).toLowerCase()==="stale"){result0=input.substr(pos,5);pos+=5;}else{result0=null;if(reportFailures===0){matchFailed("\"stale\"");}}
if(result0!==null){result1=parse_EQUAL();if(result1!==null){pos1=pos;if(input.substr(pos,4).toLowerCase()==="true"){result2=input.substr(pos,4);pos+=4;}else{result2=null;if(reportFailures===0){matchFailed("\"true\"");}}
if(result2!==null){result2=(function(offset){data.stale=true;})(pos1);}
if(result2===null){pos=pos1;}
if(result2===null){pos1=pos;if(input.substr(pos,5).toLowerCase()==="false"){result2=input.substr(pos,5);pos+=5;}else{result2=null;if(reportFailures===0){matchFailed("\"false\"");}}
if(result2!==null){result2=(function(offset){data.stale=false;})(pos1);}
if(result2===null){pos=pos1;}}
if(result2!==null){result0=[result0,result1,result2];}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
return result0;}
function parse_algorithm(){var result0,result1,result2;var pos0,pos1;pos0=pos;pos1=pos;if(input.substr(pos,9).toLowerCase()==="algorithm"){result0=input.substr(pos,9);pos+=9;}else{result0=null;if(reportFailures===0){matchFailed("\"algorithm\"");}}
if(result0!==null){result1=parse_EQUAL();if(result1!==null){if(input.substr(pos,3).toLowerCase()==="md5"){result2=input.substr(pos,3);pos+=3;}else{result2=null;if(reportFailures===0){matchFailed("\"MD5\"");}}
if(result2===null){if(input.substr(pos,8).toLowerCase()==="md5-sess"){result2=input.substr(pos,8);pos+=8;}else{result2=null;if(reportFailures===0){matchFailed("\"MD5-sess\"");}}
if(result2===null){result2=parse_token();}}
if(result2!==null){result0=[result0,result1,result2];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset,algorithm){data.algorithm=algorithm.toUpperCase();})(pos0,result0[2]);}
if(result0===null){pos=pos0;}
return result0;}
function parse_qop_options(){var result0,result1,result2,result3,result4,result5,result6;var pos0,pos1,pos2;pos0=pos;if(input.substr(pos,3).toLowerCase()==="qop"){result0=input.substr(pos,3);pos+=3;}else{result0=null;if(reportFailures===0){matchFailed("\"qop\"");}}
if(result0!==null){result1=parse_EQUAL();if(result1!==null){result2=parse_LDQUOT();if(result2!==null){pos1=pos;result3=parse_qop_value();if(result3!==null){result4=[];pos2=pos;if(input.charCodeAt(pos)===44){result5=",";pos++;}else{result5=null;if(reportFailures===0){ matchFailed("\",\"");}}
if(result5!==null){result6=parse_qop_value();if(result6!==null){result5=[result5,result6];}else{result5=null;pos=pos2;}}else{result5=null;pos=pos2;}
while(result5!==null){result4.push(result5);pos2=pos;if(input.charCodeAt(pos)===44){result5=",";pos++;}else{result5=null;if(reportFailures===0){matchFailed("\",\"");}}
if(result5!==null){result6=parse_qop_value();if(result6!==null){result5=[result5,result6];}else{result5=null;pos=pos2;}}else{result5=null;pos=pos2;}}
if(result4!==null){result3=[result3,result4];}else{result3=null;pos=pos1;}}else{result3=null;pos=pos1;}
if(result3!==null){result4=parse_RDQUOT();if(result4!==null){result0=[result0,result1,result2,result3,result4];}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
return result0;}
function parse_qop_value(){var result0;var pos0;pos0=pos;if(input.substr(pos,8).toLowerCase()==="auth-int"){result0=input.substr(pos,8);pos+=8;}else{result0=null;if(reportFailures===0){matchFailed("\"auth-int\"");}}
if(result0===null){if(input.substr(pos,4).toLowerCase()==="auth"){result0=input.substr(pos,4);pos+=4;}else{result0=null;if(reportFailures===0){matchFailed("\"auth\"");}}
if(result0===null){result0=parse_token();}}
if(result0!==null){result0=(function(offset,qop_value){data.qop||(data.qop=[]);data.qop.push(qop_value.toLowerCase());})(pos0,result0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_Proxy_Require(){var result0,result1,result2,result3;var pos0,pos1;pos0=pos;result0=parse_token();if(result0!==null){result1=[];pos1=pos;result2=parse_COMMA();if(result2!==null){result3=parse_token();if(result3!==null){result2=[result2,result3];}else{result2=null;pos=pos1;}}else{result2=null;pos=pos1;}
while(result2!==null){ result1.push(result2);pos1=pos;result2=parse_COMMA();if(result2!==null){result3=parse_token();if(result3!==null){result2=[result2,result3];}else{result2=null;pos=pos1;}}else{result2=null;pos=pos1;}}
if(result1!==null){result0=[result0,result1];}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
return result0;}
function parse_Record_Route(){var result0,result1,result2,result3;var pos0,pos1,pos2;pos0=pos;pos1=pos;result0=parse_rec_route();if(result0!==null){result1=[];pos2=pos;result2=parse_COMMA();if(result2!==null){result3=parse_rec_route();if(result3!==null){result2=[result2,result3];}else{result2=null;pos=pos2;}}else{result2=null;pos=pos2;}
while(result2!==null){result1.push(result2);pos2=pos;result2=parse_COMMA();if(result2!==null){result3=parse_rec_route();if(result3!==null){result2=[result2,result3];}else{result2=null;pos=pos2;}}else{result2=null;pos=pos2;}}
if(result1!==null){result0=[result0,result1];}else{result0=null;pos=pos1;}}else{ result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset){var idx;for(idx in data.multi_header){if(data.multi_header[idx].parsed===null){data=null;break;}}
if(data!==null){data=data.multi_header;}else{data=-1;}})(pos0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_rec_route(){var result0,result1,result2,result3;var pos0,pos1,pos2;pos0=pos;pos1=pos;result0=parse_name_addr();if(result0!==null){result1=[];pos2=pos;result2=parse_SEMI();if(result2!==null){result3=parse_generic_param(); if(result3!==null){result2=[result2,result3];}else{result2=null;pos=pos2;}}else{result2=null;pos=pos2;}
while(result2!==null){result1.push(result2);pos2=pos;result2=parse_SEMI();if(result2!==null){result3=parse_generic_param();if(result3!==null){result2=[result2,result3];}else{result2=null;pos=pos2;}}else{result2=null;pos=pos2;}}
if(result1!==null){result0=[result0,result1];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset){var header;if(!data.multi_header)data.multi_header=[];try{header=new JsSIP.NameAddrHeader(data.uri,data.display_name,data.params);delete data.uri;delete data.display_name;delete data.params;}catch(e){header=null;}
data.multi_header.push({'possition':pos,'offset':offset,'parsed':header});})(pos0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_Require(){var result0,result1,result2,result3;var pos0,pos1;pos0=pos;result0=parse_token();if(result0!==null){result1=[];pos1=pos;result2=parse_COMMA();if(result2!==null){result3=parse_token();if(result3!==null){result2=[result2,result3];}else{result2=null;pos=pos1;}}else{result2=null;pos=pos1;}
while(result2!==null){result1.push(result2);pos1=pos;result2=parse_COMMA();if(result2!==null){result3=parse_token();if(result3!==null){result2=[result2,result3];}else{result2=null;pos=pos1;}}else{result2=null;pos=pos1;}}
if(result1!==null){result0=[result0,result1];}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
return result0;}
function parse_Route(){var result0,result1,result2,result3;var pos0,pos1;pos0=pos;result0=parse_route_param();if(result0!==null){result1=[];pos1=pos;result2=parse_COMMA();if(result2!==null){result3=parse_route_param();if(result3!==null){result2=[result2,result3];}else{result2=null;pos=pos1;}}else{result2=null;pos=pos1;}
while(result2!==null){result1.push(result2);pos1=pos;result2=parse_COMMA();if(result2!==null){result3=parse_route_param();if(result3!==null){result2=[result2,result3];}else{result2=null;pos=pos1;}}else{result2=null;pos=pos1;}}
if(result1!==null){result0=[result0,result1];}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
return result0;}
function parse_route_param(){var result0,result1,result2,result3;var pos0,pos1;pos0=pos;result0=parse_name_addr();if(result0!==null){result1=[];pos1=pos;result2=parse_SEMI();if(result2!==null){result3=parse_generic_param();if(result3!==null){result2=[result2,result3];}else{result2=null;pos=pos1;}}else{result2=null;pos=pos1;}
while(result2!==null){result1.push(result2);pos1=pos;result2=parse_SEMI();if(result2!==null){result3=parse_generic_param();if(result3!==null){result2=[result2,result3];}else{result2=null;pos=pos1;}}else{result2=null;pos=pos1;}}
if(result1!==null){result0=[result0,result1];}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
return result0;}
function parse_Subscription_State(){ var result0,result1,result2,result3;var pos0,pos1;pos0=pos;result0=parse_substate_value();if(result0!==null){result1=[];pos1=pos;result2=parse_SEMI();if(result2!==null){result3=parse_subexp_params();if(result3!==null){result2=[result2,result3];}else{result2=null;pos=pos1;}}else{result2=null;pos=pos1;}
while(result2!==null){result1.push(result2);pos1=pos;result2=parse_SEMI();if(result2!==null){result3=parse_subexp_params();if(result3!==null){result2=[result2,result3];}else{result2=null;pos=pos1;}}else{result2=null;pos=pos1;}}
if(result1!==null){result0=[result0,result1];}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
return result0;}
function parse_substate_value(){var result0;var pos0;pos0=pos;if(input.substr(pos,6).toLowerCase()==="active"){result0=input.substr(pos,6);pos+=6;}else{result0=null;if(reportFailures===0){matchFailed("\"active\"");}}
if(result0===null){if(input.substr(pos,7).toLowerCase()==="pending"){result0=input.substr(pos,7);pos+=7;}else{result0=null;if(reportFailures===0){matchFailed("\"pending\"");}}
if(result0===null){if(input.substr(pos,10).toLowerCase()==="terminated"){result0=input.substr(pos,10);pos+=10;}else{result0=null;if(reportFailures===0){matchFailed("\"terminated\"");}}
if(result0===null){result0=parse_token();}}}
if(result0!==null){result0=(function(offset){data.state=input.substring(pos,offset);})(pos0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_subexp_params(){var result0,result1,result2;var pos0,pos1;pos0=pos;pos1=pos;if(input.substr(pos,6).toLowerCase()==="reason"){result0=input.substr(pos,6);pos+=6;}else{result0=null;if(reportFailures===0){matchFailed("\"reason\"");}}
 if(result0!==null){result1=parse_EQUAL();if(result1!==null){result2=parse_event_reason_value();if(result2!==null){result0=[result0,result1,result2];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset,reason){if(typeof reason!=='undefined')data.reason=reason;})(pos0,result0[2]);}
if(result0===null){pos=pos0;}
if(result0===null){pos0=pos;pos1=pos;if(input.substr(pos,7).toLowerCase()==="expires"){result0=input.substr(pos,7);pos+=7;}else{result0=null;if(reportFailures===0){matchFailed("\"expires\"");}}
if(result0!==null){result1=parse_EQUAL();if(result1!==null){result2=parse_delta_seconds();if(result2!==null){result0=[result0,result1,result2];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset,expires){if(typeof expires!=='undefined')data.expires=expires;})(pos0,result0[2]);}
if(result0===null){pos=pos0;}
if(result0===null){pos0=pos;pos1=pos;if(input.substr(pos,11).toLowerCase()==="retry_after"){result0=input.substr(pos,11);pos+=11;}else{result0=null;if(reportFailures===0){matchFailed("\"retry_after\"");}}
if(result0!==null){result1=parse_EQUAL();if(result1!==null){result2=parse_delta_seconds();if(result2!==null){result0=[result0,result1,result2];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset,retry_after){if(typeof retry_after!=='undefined')data.retry_after=retry_after;})(pos0,result0[2]);}
if(result0===null){pos=pos0;}
if(result0===null){result0=parse_generic_param();}}}
return result0;}
function parse_event_reason_value(){var result0;if(input.substr(pos,11).toLowerCase()==="deactivated"){result0=input.substr(pos,11);pos+=11;}else{result0=null;if(reportFailures===0){matchFailed("\"deactivated\"");}}
if(result0===null){if(input.substr(pos,9).toLowerCase()==="probation"){result0=input.substr(pos,9);pos+=9;}else{result0=null;if(reportFailures===0){matchFailed("\"probation\"");}}
if(result0===null){if(input.substr(pos,8).toLowerCase()==="rejected"){result0=input.substr(pos,8);pos+=8;}else{result0=null;if(reportFailures===0){matchFailed("\"rejected\"");}}
if(result0===null){if(input.substr(pos,7).toLowerCase()==="timeout"){result0=input.substr(pos,7);pos+=7;}else{result0=null;if(reportFailures===0){matchFailed("\"timeout\"");}}
if(result0===null){if(input.substr(pos,6).toLowerCase()==="giveup"){result0=input.substr(pos,6);pos+=6;}else{result0=null;if(reportFailures===0){matchFailed("\"giveup\"");}}
if(result0===null){if(input.substr(pos,10).toLowerCase()==="noresource"){result0=input.substr(pos,10);pos+=10;}else{result0=null;if(reportFailures===0){matchFailed("\"noresource\"");}}
if(result0===null){if(input.substr(pos,9).toLowerCase()==="invariant"){result0=input.substr(pos,9);pos+=9;}else{result0=null;if(reportFailures===0){matchFailed("\"invariant\"");}}
if(result0===null){result0=parse_token();}}}}}}}
return result0;}
function parse_Subject(){var result0;result0=parse_TEXT_UTF8_TRIM();result0=result0!==null?result0:"";return result0;}
function parse_Supported(){var result0,result1,result2,result3;var pos0,pos1;pos0=pos;result0=parse_token();if(result0!==null){result1=[];pos1=pos;result2=parse_COMMA();if(result2!==null){result3=parse_token();if(result3!==null){result2=[result2,result3];}else{result2=null;pos=pos1;}}else{result2=null;pos=pos1;}
while(result2!==null){result1.push(result2);pos1=pos;result2=parse_COMMA();if(result2!==null){result3=parse_token();if(result3!==null){result2=[result2,result3];}else{result2=null;pos=pos1;}}else{result2=null;pos=pos1;}}
if(result1!==null){result0=[result0,result1];}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
result0=result0!==null?result0:"";return result0;}
function parse_To(){var result0,result1,result2,result3;var pos0,pos1,pos2;pos0=pos;pos1=pos;result0=parse_SIP_URI_noparams();if(result0===null){result0=parse_name_addr();}
if(result0!==null){result1=[];pos2=pos;result2=parse_SEMI();if(result2!==null){result3=parse_to_param();if(result3!==null){result2=[result2,result3];}else{result2=null;pos=pos2;}}else{result2=null; pos=pos2;}
while(result2!==null){result1.push(result2);pos2=pos;result2=parse_SEMI();if(result2!==null){result3=parse_to_param();if(result3!==null){result2=[result2,result3];}else{result2=null;pos=pos2;}}else{result2=null;pos=pos2;}}
if(result1!==null){result0=[result0,result1];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset){var tag=data.tag;try{data=new JsSIP.NameAddrHeader(data.uri,data.display_name,data.params);if(tag){data.setParam('tag',tag)}}catch(e){data=-1;}})(pos0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_to_param(){var result0;result0=parse_tag_param();if(result0===null){result0=parse_generic_param();}
return result0;}
function parse_Via(){var result0,result1,result2,result3;var pos0,pos1;pos0=pos;result0=parse_via_parm();if(result0!==null){result1=[];pos1=pos;result2=parse_COMMA();if(result2!==null){result3=parse_via_parm();if(result3!==null){result2=[result2,result3];}else{result2=null;pos=pos1;}}else{result2=null;pos=pos1;}
while(result2!==null){result1.push(result2);pos1=pos;result2=parse_COMMA();if(result2!==null){result3=parse_via_parm();if(result3!==null){result2=[result2,result3];}else{result2=null;pos=pos1;}}else{result2=null;pos=pos1;}}
if(result1!==null){result0=[result0,result1];}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
return result0;}
function parse_via_parm(){var result0,result1,result2,result3,result4,result5;var pos0,pos1;pos0=pos;result0=parse_sent_protocol();if(result0!==null){result1=parse_LWS();if(result1!==null){result2=parse_sent_by();if(result2!==null){result3=[];pos1=pos;result4=parse_SEMI();if(result4!==null){result5=parse_via_params();if(result5!==null){result4=[result4,result5];}else{result4=null;pos=pos1;}}else{result4=null;pos=pos1;}
while(result4!==null){result3.push(result4);pos1=pos;result4=parse_SEMI();if(result4!==null){result5=parse_via_params();if(result5!==null){result4=[result4,result5];}else{result4=null;pos=pos1;}}else{result4=null;pos=pos1;}}
if(result3!==null){result0=[result0,result1,result2,result3];}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
return result0;}
function parse_via_params(){var result0;result0=parse_via_ttl();if(result0===null){result0=parse_via_maddr();if(result0===null){result0=parse_via_received();if(result0===null){result0=parse_via_branch();if(result0===null){result0=parse_response_port();if(result0===null){result0=parse_generic_param();}}}}}
return result0;}
function parse_via_ttl(){var result0,result1,result2;var pos0,pos1;pos0=pos;pos1=pos;if(input.substr(pos,3).toLowerCase()==="ttl"){result0=input.substr(pos,3);pos+=3;}else{result0=null;if(reportFailures===0){matchFailed("\"ttl\"");}}
if(result0!==null){result1=parse_EQUAL();if(result1!==null){result2=parse_ttl();if(result2!==null){result0=[result0,result1,result2];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset,via_ttl_value){data.ttl=via_ttl_value;})(pos0,result0[2]);}
if(result0===null){pos=pos0;}
return result0;}
function parse_via_maddr(){var result0,result1,result2;var pos0,pos1;pos0=pos;pos1=pos;if(input.substr(pos,5).toLowerCase()==="maddr"){result0=input.substr(pos,5);pos+=5;}else{result0=null;if(reportFailures===0){matchFailed("\"maddr\"");}}
if(result0!==null){result1=parse_EQUAL();if(result1!==null){result2=parse_host();if(result2!==null){result0=[result0,result1,result2];}else{result0=null;pos=pos1;}}else{ result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset,via_maddr){data.maddr=via_maddr;})(pos0,result0[2]);}
if(result0===null){pos=pos0;}
return result0;}
function parse_via_received(){var result0,result1,result2;var pos0,pos1;pos0=pos;pos1=pos;if(input.substr(pos,8).toLowerCase()==="received"){result0=input.substr(pos,8);pos+=8;}else{result0=null;if(reportFailures===0){matchFailed("\"received\"");}}
if(result0!==null){result1=parse_EQUAL();if(result1!==null){result2=parse_IPv4address();if(result2===null){result2=parse_IPv6address();}
if(result2!==null){result0=[result0,result1,result2];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset,via_received){data.received=via_received;})(pos0,result0[2]);}
if(result0===null){pos=pos0;}
return result0;}
function parse_via_branch(){var result0,result1,result2;var pos0,pos1;pos0=pos;pos1=pos;if(input.substr(pos,6).toLowerCase()==="branch"){result0=input.substr(pos,6);pos+=6;}else{result0=null;if(reportFailures===0){matchFailed("\"branch\"");}}
if(result0!==null){result1=parse_EQUAL();if(result1!==null){result2=parse_token();if(result2!==null){result0=[result0,result1,result2];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset,via_branch){data.branch=via_branch;})(pos0,result0[2]);}
if(result0===null){pos=pos0;}
return result0;}
function parse_response_port(){var result0,result1,result2,result3;var pos0,pos1,pos2;pos0=pos;pos1=pos;if(input.substr(pos,5).toLowerCase()==="rport"){result0=input.substr(pos,5);pos+=5;}else{result0=null;if(reportFailures===0){matchFailed("\"rport\"");}}
if(result0!==null){pos2=pos;result1=parse_EQUAL();if(result1!==null){result2=[];result3=parse_DIGIT();while(result3!==null){result2.push(result3);result3=parse_DIGIT();}
if(result2!==null){result1=[result1,result2];}else{result1=null;pos=pos2;}}else{result1=null;pos=pos2;}
result1=result1!==null?result1:"";if(result1!==null){result0=[result0,result1];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset){if(typeof response_port!=='undefined')
data.rport=response_port.join('');})(pos0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_sent_protocol(){var result0,result1,result2,result3,result4;var pos0;pos0=pos;result0=parse_protocol_name();if(result0!==null){result1=parse_SLASH();if(result1!==null){result2=parse_token();if(result2!==null){result3=parse_SLASH();if(result3!==null){result4=parse_transport();if(result4!==null){result0=[result0,result1,result2,result3,result4];}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
return result0;}
function parse_protocol_name(){var result0;var pos0;pos0=pos;if(input.substr(pos,3).toLowerCase()==="sip"){result0=input.substr(pos,3);pos+=3;}else{result0=null;if(reportFailures===0){matchFailed("\"SIP\"");}}
if(result0===null){result0=parse_token();}
if(result0!==null){result0=(function(offset,via_protocol){data.protocol=via_protocol;})(pos0,result0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_transport(){var result0;var pos0;pos0=pos;if(input.substr(pos,3).toLowerCase()==="udp"){result0=input.substr(pos,3);pos+=3;}else{result0=null;if(reportFailures===0){matchFailed("\"UDP\"");}}
if(result0===null){if(input.substr(pos,3).toLowerCase()==="tcp"){result0=input.substr(pos,3);pos+=3;}else{result0=null;if(reportFailures===0){matchFailed("\"TCP\"");}}
if(result0===null){if(input.substr(pos,3).toLowerCase()==="tls"){result0=input.substr(pos,3);pos+=3;}else{result0=null;if(reportFailures===0){matchFailed("\"TLS\"");}}
 if(result0===null){if(input.substr(pos,4).toLowerCase()==="sctp"){result0=input.substr(pos,4);pos+=4;}else{result0=null;if(reportFailures===0){matchFailed("\"SCTP\"");}}
if(result0===null){result0=parse_token();}}}}
if(result0!==null){result0=(function(offset,via_transport){data.transport=via_transport;})(pos0,result0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_sent_by(){var result0,result1,result2;var pos0,pos1;pos0=pos;result0=parse_via_host();if(result0!==null){pos1=pos;result1=parse_COLON();if(result1!==null){result2=parse_via_port();if(result2!==null){result1=[result1,result2];}else{result1=null;pos=pos1;}}else{result1=null;pos=pos1;}
result1=result1!==null?result1:"";if(result1!==null){result0=[result0,result1];}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
return result0;}
function parse_via_host(){var result0;var pos0;pos0=pos;result0=parse_hostname();if(result0===null){result0=parse_IPv4address();if(result0===null){result0=parse_IPv6reference();}}
if(result0!==null){result0=(function(offset){data.host=input.substring(pos,offset);})(pos0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_via_port(){var result0,result1,result2,result3,result4;var pos0,pos1;pos0=pos;pos1=pos;result0=parse_DIGIT();result0=result0!==null?result0:"";if(result0!==null){result1=parse_DIGIT();result1=result1!==null?result1:"";if(result1!==null){result2=parse_DIGIT();result2=result2!==null?result2:"";if(result2!==null){result3=parse_DIGIT();result3=result3!==null?result3:"";if(result3!==null){result4=parse_DIGIT();result4=result4!==null?result4:"";if(result4!==null){result0=[result0,result1,result2,result3,result4];}else{result0=null;pos= pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset,via_sent_by_port){data.port=parseInt(via_sent_by_port.join(''));})(pos0,result0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_ttl(){var result0,result1,result2;var pos0,pos1;pos0=pos;pos1=pos;result0=parse_DIGIT();if(result0!==null){result1=parse_DIGIT();result1=result1!==null?result1:"";if(result1!==null){result2=parse_DIGIT();result2=result2!==null?result2:"";if(result2!==null){result0=[result0,result1,result2];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset,ttl){return parseInt(ttl.join(''));})(pos0,result0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_WWW_Authenticate(){var result0;result0=parse_challenge();return result0;}
function parse_extension_header(){var result0,result1,result2;var pos0;pos0=pos;result0=parse_token();if(result0!==null){ result1=parse_HCOLON();if(result1!==null){result2=parse_header_value();if(result2!==null){result0=[result0,result1,result2];}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
return result0;}
function parse_header_value(){var result0,result1;result0=[];result1=parse_TEXT_UTF8char();if(result1===null){result1=parse_UTF8_CONT();if(result1===null){result1=parse_LWS();}}
while(result1!==null){result0.push(result1);result1=parse_TEXT_UTF8char();if(result1===null){result1=parse_UTF8_CONT();if(result1===null){result1=parse_LWS();}}}
return result0;}
function parse_message_body(){var result0,result1;result0=[];result1=parse_OCTET();while(result1!==null){result0.push(result1);result1=parse_OCTET();}
return result0;}
function parse_stun_URI(){var result0,result1,result2;var pos0;pos0=pos;result0=parse_stun_scheme();if(result0!==null){if(input.charCodeAt(pos)===58){result1=":";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result1!==null){result2=parse_stun_host_port();if(result2!==null){result0=[result0,result1,result2];}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
return result0;}
function parse_stun_scheme(){var result0;var pos0;pos0=pos;if(input.substr(pos,5).toLowerCase()==="stuns"){result0=input.substr(pos,5);pos+=5;}else{result0=null;if(reportFailures===0){matchFailed("\"stuns\"");}}
if(result0===null){if(input.substr(pos,4).toLowerCase()==="stun"){result0=input.substr(pos,4);pos+=4;}else{result0=null;if(reportFailures===0){matchFailed("\"stun\"");}}}
if(result0!==null){result0=(function(offset,scheme){data.scheme=scheme;})(pos0,result0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_stun_host_port(){var result0,result1,result2;var pos0,pos1;pos0=pos;result0=parse_stun_host();if(result0!==null){pos1=pos;if(input.charCodeAt(pos)===58){result1=":";pos++;}else{result1=null;if(reportFailures===0){matchFailed("\":\"");}}
if(result1!==null){result2=parse_port();if(result2!==null){result1=[result1,result2];}else{result1=null;pos=pos1;}}else{result1=null;pos=pos1;}
result1=result1!==null?result1:"";if(result1!==null){result0=[result0,result1];}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
return result0;}
function parse_stun_host(){var result0;var pos0;pos0=pos;result0=parse_IPv4address();if(result0===null){result0=parse_IPv6reference();if(result0===null){result0=parse_reg_name();}}
if(result0!==null){result0=(function(offset,host){data.host=host;})(pos0,result0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_reg_name(){var result0,result1;var pos0;pos0=pos;result0=[];result1=parse_stun_unreserved();if(result1===null){result1=parse_escaped();if(result1===null){result1=parse_sub_delims();}}
while(result1!==null){result0.push(result1);result1=parse_stun_unreserved();if(result1===null){result1=parse_escaped();if(result1===null){result1=parse_sub_delims();}}}
if(result0!==null){result0=(function(offset){return input.substring(pos,offset);})(pos0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_stun_unreserved(){var result0;result0=parse_ALPHA();if(result0===null){result0=parse_DIGIT();if(result0===null){if(input.charCodeAt(pos)===45){result0="-";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"-\"");}}
if(result0===null){if(input.charCodeAt(pos)===46){result0=".";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\".\"");}}
if(result0===null){if(input.charCodeAt(pos)===95){result0="_";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"_\"");}}
if(result0===null){if(input.charCodeAt(pos)===126){result0="~";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"~\"");}
}}}}}}
return result0;}
function parse_sub_delims(){var result0;if(input.charCodeAt(pos)===33){result0="!";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"!\"");}}
if(result0===null){if(input.charCodeAt(pos)===36){result0="$";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"$\"");}}
if(result0===null){if(input.charCodeAt(pos)===38){result0="&";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"&\"");}}
if(result0===null){if(input.charCodeAt(pos)===39){result0="'";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"'\"");}}
if(result0===null){if(input.charCodeAt(pos)===40){result0="(";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"(\"");}}
if(result0===null){if(input.charCodeAt(pos)===41){result0=")";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\")\"");}}
if(result0===null){if(input.charCodeAt(pos)===42){result0="*";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"*\"");}}
if(result0===null){if(input.charCodeAt(pos)===43){result0="+";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"+\"");}}
if(result0===null){if(input.charCodeAt(pos)===44){result0=",";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\",\"");}}
if(result0===null){if(input.charCodeAt(pos)===59){result0=";";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\";\"");}}
if(result0===null){if(input.charCodeAt(pos)===61){result0="=";pos++;}else{result0=null;if(reportFailures===0){matchFailed("\"=\"");}}}}
}}}}}}}}
return result0;}
function parse_turn_URI(){var result0,result1,result2,result3,result4;var pos0,pos1;pos0=pos;result0=parse_turn_scheme();if(result0!==null){if(input.charCodeAt(pos)===58){result1=":";pos++;}else{result1=null;if(reportFailures===0){ matchFailed("\":\"");}}
if(result1!==null){result2=parse_stun_host_port();if(result2!==null){pos1=pos;if(input.substr(pos,11)==="?transport="){result3="?transport=";pos+=11;}else{result3=null;if(reportFailures===0){matchFailed("\"?transport=\"");}}
if(result3!==null){result4=parse_transport();if(result4!==null){result3=[result3,result4];}else{result3=null;pos=pos1;}}else{result3=null;pos=pos1;}
result3=result3!==null?result3:"";if(result3!==null){result0=[result0,result1,result2,result3];}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}}else{result0=null;pos=pos0;}
return result0;}
function parse_turn_scheme(){var result0;var pos0;pos0=pos;if(input.substr(pos,5).toLowerCase()==="turns"){result0=input.substr(pos,5);pos+=5;}else{result0=null;if(reportFailures===0){matchFailed("\"turns\"");}}
if(result0===null){if(input.substr(pos,4).toLowerCase()==="turn"){result0=input.substr(pos,4);pos+=4;}else{result0=null;if(reportFailures===0){matchFailed("\"turn\"");}}}
if(result0!==null){result0=(function(offset,scheme){data.scheme=scheme;})(pos0,result0);}
if(result0===null){pos=pos0;}
return result0;}
function parse_turn_transport(){var result0,result1,result2;var pos0,pos1;pos0=pos;pos1=pos;result0=parse_transport();if(result0!==null){if(input.substr(pos,3).toLowerCase()==="udp"){result1=input.substr(pos,3);pos+=3;}else{result1=null;if(reportFailures===0){matchFailed("\"udp\"");}}
if(result1===null){if(input.substr(pos,3).toLowerCase()==="tcp"){result1=input.substr(pos,3);pos+=3;}else{result1=null;if(reportFailures===0){matchFailed("\"tcp\"");}}
if(result1===null){result1=[];result2=parse_unreserved();while(result2!==null){result1.push(result2);result2=parse_unreserved();}}}
if(result1!==null){result0=[result0,result1];}else{result0=null;pos=pos1;}}else{result0=null;pos=pos1;}
if(result0!==null){result0=(function(offset){data.transport=transport;})(pos0);}
if(result0===null){pos=pos0;}
return result0;}
function cleanupExpected(expected){expected.sort();var lastExpected= null;var cleanExpected=[];for(var i=0;i<expected.length;i++){if(expected[i]!==lastExpected){cleanExpected.push(expected[i]);lastExpected=expected[i];}}
return cleanExpected;}
function computeErrorPosition(){var line=1;var column=1;var seenCR=false;for(var i=0;i<Math.max(pos,rightmostFailuresPos);i++){var ch=input.charAt(i);if(ch==="\n"){if(!seenCR){line++;}
column=1;seenCR=false;}else if(ch==="\r"||ch==="\u2028"||ch==="\u2029"){line++;column=1;seenCR=true;}else{column++;seenCR=false;}}
return{line:line,column:column};}
var data={};var result=parseFunctions[startRule]();/**/
if(result===null||pos!==input.length){var offset=Math.max(pos,rightmostFailuresPos);var found=offset<input.length?input.charAt(offset):null;var errorPosition=computeErrorPosition();new this.SyntaxError(cleanupExpected(rightmostFailuresExpected),found,offset,errorPosition.line,errorPosition.column);return-1;}
return data;},toSource:function(){return this._source;}};result.SyntaxError=function(expected,found,offset,line,column){function buildMessage(expected,found){var expectedHumanized,foundHumanized;switch(expected.length){case 0:expectedHumanized="end of input";break;case 1:expectedHumanized=expected[0]; break;default:expectedHumanized=expected.slice(0,expected.length-1).join(", ")
+" or "
+expected[expected.length-1];}
foundHumanized=found?quote(found):"end of input";return "Expected "+expectedHumanized+" but "+foundHumanized+" found.";}
this.name="SyntaxError";this.expected=expected;this.found=found;this.message=buildMessage(expected,found);this.offset=offset;this.line=line;this.column=column;};result.SyntaxError.prototype=Error.prototype;return result;})();