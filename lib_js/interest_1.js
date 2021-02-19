var jvsversion= "2.0.0";
var pi, pi2;
var show, hide;
var lyposabs, lyposrel, lypossat;
var jvs;
var jvsdebug= 0;
var jvslibready;
var jvsrunway= -1;
var jvsloaded, jvsload;
var jvsloadtimes;
var jvsloadingfunc= "jvsLoadingMsg()";
var jvsbodyonload;
var jvstopname= "jvstopname";
var jvscookienamepub= "leadwarepub";
var jvscookiesessionenabled= jvscookiesessioncheck();
var jvsbaselayername= "jvsbaselayer";
var jvsbaselayer;
var jvsmidiprelayername= "jvsmidiprelayer";
var jvsmidiprelayer;
var jvsmidiprename= "sjvsmidipre";
var jvsmidipre;
var jvsmidipreurl;
var objMAs;

var hexletters= "0123456789abcdef";
var zeroletters= "0000000000000000";
var decimal10s= new Array(1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000, 10000000000);

//if(0 && jvsdoclocmatch("http://www.leadware.com") && jvsdoclocmatch("file:")) {
//	jvslinkimg= new Image();
//	jvslinkimg.src= "http://www.leadware.com/cgi-bin/jvslink.pl";
//	}

//function jvsdoclocmatch(s) {
//	return document.location.href.substring(0, s.length)!= s;
//	}

function jvsBodyOnload(f) {
	if(f== null) {
		return jvsbodyonload;
		}
	else {
		jvsbodyonload= f;
		}
	}

function jvsSetDebug(n) {
	jvsdebug= n;
	}

function jvsSetMidiPreUrl(n) {
	jvsmidipreurl= n;
	}

function jvsmain(mf) {	// invoke from html body
	if(mf==null) mf= "main()";
//	if(!jvsLibInit()) { setTimeout("jvsmain()", 250); return; }
	if(!jvsLibInit()) { setTimeout("jvsmain(\""+ mf+ "\")", 250); return; }
	hideLoadingMsg();
	jvsRunFaster(1);

	jvsmidiprelayer= objLayer(jvsmidiprelayername);
	if((jvsmidiprelayer== null) || (""+ jvsmidiprelayer== "undefined")) { }
	else {
		jvsmidipre= objFromLayer(jvsmidiprelayer, jvsmidiprename);
		}

	eval(mf);
//	main();
	}

function SndIEPlay(o) {
	if(""+o.Run=="undefined") o.Play(); else o.Run();
	}

function SndIEPlayState(o) {
	return ((""+o.CurrentState=="undefined") ? o.PlayState:o.CurrentState);
	}

function soundReady(o) {	// func
	switch(jvsrunway) {
		case 2: return (SndIEPlayState(o)>=0);
		default:
		case 3: // not checked
		case 1: return ((""+o=="undefined") ? false:o.IsReady());
		}
	}

function imageReady(o) {	// func
	return o.complete;
	}

function runFaster() {	// private func
	if(jvs.runfaster && jvs.actives) {
		if(!jvs.fastrun) jvs.fastrun= true;
		setTimeout("runFaster()", jvs.runfaster);
		}
	else
		jvs.fastrun= false;
	}

function jvsRunFaster(ms) {	// func
	jvs.runfaster= ms;
	}

function jvsNetwork(ip, mask) {	// func
	var ia, ma, na, i, n, net;

	net= "0.0.0.0";
	n= 4;
	ia= ip.split(".", n+1);
	ma= mask.split(".", n+1);
	na= new Array(n);

	while(1) {
		if((ia.length!= 4) || (ma.length!= 4)) break;
		for(i=0; i<n; i++) {
			if((ia[i]<0) || (ia[i]>255) || (ma[i]<0) || (ma[i]>255)) break;
			na[i]= jvsparseInt(ia[i]) & jvsparseInt(ma[i]);
			}
		if(i!= n) break;
		net= na[0];
		for(i=1; i<n; i++) {
			net+= "."+ na[i];
			}

		break;
		}

	return net;
	}

function jvspx(n) {
	return n+ "px";
	}

function jvsparseInt(s) {
	var n;
	n= parseInt(s);
	return (isNaN(n) ? 0:n);
	}

function jvsparseFloat(s) {
	var n;
	n= parseFloat(s);
	return (isNaN(n) ? 0.0:n);
	}

function hexToDec(s) {	// func
	return parseInt("0x"+ s);
	}

function decToHex(i, n) {	// func
	var s;

	for(i= Math.abs(i), s=""; i>0; i= Math.floor(i/16)) s= hexletters.charAt(i%16)+ s;
	s= zeroletters.substring(0, n-s.length)+ s;
	return s;
	}

function jvsRound(n, d) {
	var r= decimal10s[d];

	return Math.round(n* r)/ r;
	}

function jvsURound(n, d) {
	var r= decimal10s[d];

	return (n>=0) ? (Math.round(n* r)/ r):-(Math.round(-n* r)/ r);
	}

function colorSToRGB(s, objc) {	// func
	objc.r= hexToDec(s.substring(1,3));
	objc.g= hexToDec(s.substring(3,5));
	objc.b= hexToDec(s.substring(5,7));
	}

function jvsPause(y) {	// func
	if(y!= null) jvs.pause= y;
	return jvs.pause;
	}

function jvsRunway() {	// func
	if(jvsrunway==-1) {
		if(document.all) {
			jvsrunway= 2;	// IE
			if(!(navigator.appName== "Microsoft Internet Explorer")) {
				if(document.getElementById) jvsrunway= 3;	// Opera
				}
			}
		else
			if(document.getElementById) jvsrunway= 3;	// Firefox, Netscape 6+, Mozilla
			else
				if(document.layers) jvsrunway= 1;	// Netscape 4.7
				else
					if(navigator.appName.length>0) jvsrunway= 0;

//		if(navigator.appName== "Netscape") jvsrunway= 1;
//		else
//			if(navigator.appName== "Microsoft Internet Explorer") jvsrunway= 2;
//			else
//				if(navigator.appName.length>0) jvsrunway= 0;
		}

	return jvsrunway;
	}

function jvsWinsize() {	// func
//	jvs.winouterwidth= jvs.wininnerwidth= jvs.framewidth= jvs.screenwidth= screen.width;
//	jvs.winouterheight= jvs.wininnerheight= jvs.frameheight= jvs.screenheight= screen.height;
	jvs.scrollwidth= 23;
	jvs.scrollheight= 23;
	jvs.doctopmargin= 0;
	jvs.docrightmargin= 0;
	switch(jvsrunway) {
		case 1:
			jvs.winouterwidth= top.window.outerWidth;
			jvs.wininnerwidth= top.window.innerWidth;
			jvs.framewidth= window.innerWidth+ (top.frames.length ? 4:0);
			jvs.screenwidth= screen.width;
			jvs.winouterheight= top.window.outerHeight;
			jvs.wininnerheight= top.window.innerHeight;
			jvs.frameheight= window.innerHeight+ (top.frames.length ? 4:0);
			jvs.screenheight= screen.height;
			jvs.doctopmargin= jvs.docrightmargin= (top.frames.length ? 1:8);
			break;
		case 2:
			// wow & woh are wrong
			jvs.wininnerwidth= jvs.framewidth= document.body.offsetWidth- (top.frames.length ? 0:4);
			jvs.winouterwidth= screen.width;
			jvs.screenwidth= screen.width;
			jvs.wininnerheight= jvs.frameheight= document.body.offsetHeight- (top.frames.length ? 0:4);
			jvs.winouterheight= screen.height;
			jvs.screenheight= screen.height;
			break;

		default:
		case 3:
			jvs.winouterwidth= top.window.outerWidth;
			jvs.wininnerwidth= top.window.innerWidth;
			if(window.innerWidth) {
				jvs.framewidth= window.innerWidth+ (top.frames.length ? 4:0);
//				jvs.screenwidth= screen.width;
				jvs.screenwidth= top.window.outerWidth;
				}
			else {
				jvs.framewidth= top.window.innerWidth+ (top.frames.length ? 4:0);
				jvs.screenwidth= top.window.outerWidth;
				}
				
			jvs.winouterheight= top.window.outerHeight;
			jvs.wininnerheight= top.window.innerHeight;
			if(window.innerHeight) {
				jvs.frameheight= window.innerHeight+ (top.frames.length ? 4:0);
//				jvs.screenheight= screen.height;
				jvs.screenheight= top.window.outerHeight;
				}
			else {
				jvs.frameheight= top.window.innerHeight+ (top.frames.length ? 4:0);
				jvs.screenheight= top.window.outerHeight;
				}
				
			jvs.doctopmargin= jvs.docrightmargin= (top.frames.length ? 1:8);
		}
	}

function jvsLibInit(ws) {	// func
	if(jvslibready== true) return true;
	if(!((jvs==null) && ((""+jvs)=="undefined"))) return false;

	jvsRunway();
	jvs= new Object();
	pi= Math.PI;
	pi2= pi+pi;
	jvs.runfaster= 0;
	jvs.fastrun= false;
	jvs.actives= 0;
	jvs.pause= false;
	if(ws || (ws== null)) jvsWinsize();
	show= "visible", hide= "hidden";
	lyposabs= "absolute", lyposrel= "relative", lypossta= "static";
	objMAs= new Array();

	switch(jvsrunway) {
		case 1:	show= "show"; hide= "hide";
			break;
		case 2:
		case 3:	break;
		}

	jvslibready= true;

	return jvslibready;
	}

function objHide() {	// method
	this.obj.visibility= hide;
	}

function objShow() {	// method
	this.obj.visibility= show;
	}

function objReverse() {	// method
	this.dir= -this.dir;
	}

function objRewind() {	// method
	this.selfrewind();
	this.s= ((this.dir>0) ? 0:this.ss);
	}

function objRewindSmooth() {	// method
	this.s= ((this.dir>0) ? 0:this.ss);
	}

function objRun() {	// method
	if(this.inuse== "freeze") {
		var s= this.s+ this.dir;
		if((s>=0) && (s<=this.ss)) { 
			this.inuse= "active";
			jvs.actives++;
			this.runner();
			}
		}
	}

function objRerun() {	// method
	if(this.inuse!= "free") {
		this.rewindsmooth();
		if(this.inuse!= "active") {
			this.inuse= "active";
			jvs.actives++;
			this.runner();
			}
		}
	}

function objRerunSmooth() {	// method
	if(this.inuse!= "free") {
		this.rewindsmooth();
		this.s+= this.dir;
		if(this.inuse!= "active") {
			this.inuse= "active";
			jvs.actives++;
			this.runner();
			}
		}
	}

function objResumeSmooth() {	// method
	if((this.inuse!= "free") && (this.inuse!= "active")) {
		if(this.s<= 0) this.s=0;
		else 
			if(this.s>= this.ss) this.s= this.ss;
		var s= this.s+ this.dir;
		if((s>=0) && (s<=this.ss)) { 
			this.s= s;
			this.inuse= "active";
			jvs.actives++;
			this.runner();
			}
		}
	}

function objActive() {	// method
	return (this.inuse== "active");
	}

function objFreed() {	// method
	return (this.inuse== "free");
	}

function objFrozen() {	// method
	return (this.inuse== "freeze");
	}

function objFree() {	// method
	if(this.inuse== "active") jvs.actives--;
	this.inuse= "free";
	}

function objFreeze() {	// method
	if(this.inuse== "active") jvs.actives--;
	this.inuse= "freeze";
	}

function objFinish() {	// method
	if(this.pf.length) eval(this.pf);
	if((this.sfs== this.s) && (this.sf.length)) setTimeout(this.sf, 0);
	var s= this.s+ this.dir;
	if((s>=0) && (s<=this.ss)) {
		this.s= s;
		setTimeout(this.name+ ".runner()", this.t);
		if(jvs.runfaster && jvs.actives && !jvs.fastrun) { jvs.fastrun= true;  runFaster(); }
		}
	else {
		if(this.inuse== "active") jvs.actives--;
		this.inuse= ((this.autofree) ? "free":"freeze");
		if((this.sfs< 0) && (this.sf.length)) setTimeout(this.sf, 0);
		if(this.nf.length) setTimeout(this.nf, 0);
		}
	}

function objCurrStep() {	// method
	return this.s;
	}

function objSetObj(obj) {	// method
	this.obj= obj;
	}

function objGetObj() {	// method
	return this.obj;
	}

function objSteps() {
	return this.ss+ 1;
	}

function objMA(objtype, obj, nextfunc, syncfunc, stepfunc, power, steps, syncstep, times, autofree, dir) {	// method
	var i;

	for(i=0; i<objMAs.length; i++) if(objMAs[i].inuse=="free") { objMAs[i]= null;  break; }
	objMAs[i]= this;

	this.inuse= "freeze";
	this.index= i;
	this.name= "objMAs["+ i+ "]";
	this.objtype= objtype;
	this.autofree= autofree;
	this.obj= obj;

	this.nf= nextfunc;
	this.sf= syncfunc;
	this.sfs= syncstep;
	this.pf= stepfunc;

	this.run= objRun;
	this.rerun= objRerun;
	this.rerunsmooth= objRerunSmooth;
	this.resumesmooth= objResumeSmooth;
	this.hide= objHide;
	this.show= objShow;
	this.reverse= objReverse;
	this.rewind= objRewind;
	this.rewindsmooth= objRewindSmooth;
	this.free= objFree;
	this.freeze= objFreeze;
	this.active= objActive;
	this.freed= objFreed;
	this.frozen= objFrozen;
	this.currstep= objCurrStep;
	this.steps= objSteps;
	this.setobj= objSetObj;
	this.getobj= objGetObj;

	this.finish= objFinish;

	this.power= Math.abs(power);
	this.ss= steps-1;
	if(dir>0) { this.dir= 1;  this.s= 0; }
	else 
		{ this.dir= -1;  this.s= this.ss; }
	this.t= times;

	return this;
	}

function rewComXY() {	// method
	this.obj.left= jvspx(this.xo), this.obj.top= jvspx(this.yo);
	}

function rewComBgColor() {	// method
	this.obj.bgColor= this.bgcolor;
	}

function objStepBgColor() {	// method
	if(this.s>0) {
		var r, g, b, pw;
		pw= Math.pow(this.s/ this.ss, this.power);
		r= Math.floor(this.bc.r+ (this.bc2.r-this.bc.r)* pw);
		g= Math.floor(this.bc.g+ (this.bc2.g-this.bc.g)* pw);
		b= Math.floor(this.bc.b+ (this.bc2.b-this.bc.b)* pw);
		this.obj.bgColor= "#"+ decToHex(r, 2)+ decToHex(g, 2)+ decToHex(b, 2);
		}
	else
		this.obj.bgColor= this.bgcolor;
	}

function objMABgColor(nextfunc, syncfunc, stepfunc, obj, bgcolor2, power, steps, syncstep, times, autofree, dir) {	// class
	this.runner= moveAsBgColor;
	this.selfrewind= rewComBgColor;
	this.stepbgcolor= objStepBgColor;
	this.objMA= objMA;
	this.objMA("BgColor", obj, nextfunc, syncfunc, stepfunc, power, steps, syncstep, times, autofree, dir);
	this.bgcolor= obj.bgColor;
	this.bc= new Object();
	this.bc2= new Object();
	colorSToRGB(obj.bgColor, this.bc);
	colorSToRGB(bgcolor2, this.bc2);

	return this;
	}

function moveAsBgColor() {	// method
	if(this.inuse!= "active") return;
	if(jvs.pause) { setTimeout(this.name+ ".runner()", this.t); return; }
	this.stepbgcolor();
	this.finish();
	}

function objClipComb(o, l, t, r, b) {	// func
	switch(jvsrunway) {
		default:		// not checked
		case 3: o.clip= "rect("+ jvspx(t)+ ", "+ jvspx(r)+ ", "+ jvspx(b)+ ", "+ jvspx(l)+ ")";  break;		// not checked
		case 2: o.clip= "rect("+ jvspx(t)+ " "+ jvspx(r)+ " "+ jvspx(b)+ " "+ jvspx(l)+ ")";  break;
		case 1: o.clip.left= jvspx(l), o.clip.top= jvspx(t), o.clip.right= jvspx(r), o.clip.bottom= jvspx(b);  break;
		}
	}
		
function objClipSep(o, m) {	// func
	switch(jvsrunway) {
		default:
		case 3: var s= o.clip, i;	// not checked
			if((i= s.indexOf("rect("))< 0) m.l= m.t= 0, m.r= m.b= 10000;
			else {
				m.t= parseInt(s= s.substring(i+ 5));
				m.r= parseInt(s= s.substring(s.indexOf(",")+ 1));
				m.b= parseInt(s= s.substring(s.indexOf(",")+ 1));
				m.l= parseInt(s= s.substring(s.indexOf(",")+ 1));
				}
			break;

		case 2: var s= o.clip, i;
			if((i= s.indexOf("rect("))< 0) m.l= m.t= 0, m.r= m.b= 10000;
			else {
				m.t= parseInt(s= s.substring(i+ 5));
				m.r= parseInt(s= s.substring(s.indexOf(" ")+ 1));
				m.b= parseInt(s= s.substring(s.indexOf(" ")+ 1));
				m.l= parseInt(s= s.substring(s.indexOf(" ")+ 1));
				}
			break;
		case 1: m.l= o.clip.left, m.t= o.clip.top, m.r= o.clip.right, m.b= o.clip.bottom;  break;
		}
	}

function rewClip() {	// method
	objClipComb(this.obj, this.l, this.t, this.r, this.b)
	}

function objMAClip(nextfunc, syncfunc, stepfunc, obj, l2, t2, r2, b2, power, steps, syncstep, times, autofree, dir) {	// class
	this.runner= moveAsClip;
	this.selfrewind= rewClip;
	this.objMA= objMA;
	this.objMA("Clip", obj, nextfunc, syncfunc, stepfunc, power, steps, syncstep, times, autofree, dir);
	objClipSep(obj, this);
	this.l2= parseFloat(l2);
	this.t2= parseFloat(t2);
	this.r2= parseFloat(r2);
	this.b2= parseFloat(b2);

	return this;
	}

function moveAsClip() {	// method
	if(this.inuse!= "active") return;
	if(jvs.pause) { setTimeout(this.name+ ".runner()", this.t); return; }
	if(this.s>0) {
		var pw;
		pw= Math.pow(this.s/ this.ss, this.power);
		objClipComb(this.obj, this.l+ (this.l2-this.l)* pw, this.t+ (this.t2-this.t)* pw, this.r+ (this.r2-this.r)* pw, this.b+ (this.b2-this.b)* pw);
		}
	else
		this.selfrewind();

	this.finish();
	}

function objMALine(nextfunc, syncfunc, stepfunc, obj, x2, y2, power, steps, syncstep, times, autofree, dir) {	// class
	this.runner= moveAsLine;
	this.selfrewind= rewComXY;
	this.objMA= objMA;
	this.objMA("Line", obj, nextfunc, syncfunc, stepfunc, power, steps, syncstep, times, autofree, dir);
	this.xo= parseFloat(obj.left);
	this.yo= parseFloat(obj.top);
	this.x2= parseFloat(x2);
	this.y2= parseFloat(y2);

	return this;
	}

function moveAsLine() {	// method
	if(this.inuse!= "active") return;
	if(jvs.pause) { setTimeout(this.name+ ".runner()", this.t); return; }
	if(this.s>0) {
		var pw;
		pw= Math.pow(this.s/ this.ss, this.power);
		this.obj.left= jvspx(this.xo+ (this.x2-this.xo)* pw);
		this.obj.top= jvspx(this.yo+ (this.y2-this.yo)* pw);
		}
	else
		this.selfrewind();

	this.finish();
	}

function objMASine(nextfunc, syncfunc, stepfunc, obj, x2, y2, r, ra0, period, power, steps, syncstep, times, autofree, dir) {	// class
	var a, b, t2, d1, d2;

	this.runner= moveAsSine;
	this.selfrewind= rewComXY;
	this.objMA= objMA;
	this.objMA("Sine", obj, nextfunc, syncfunc, stepfunc, power, steps, syncstep, times, autofree, dir);
	this.xo= parseFloat(obj.left);
	this.yo= parseFloat(obj.top);
	this.x2= parseFloat(x2);
	this.y2= parseFloat(y2);
	this.d2= period* 2* pi;
	this.r= -parseFloat(r);	// for correct y axis with: r
	if(this.d2<0) this.d2= -this.d2, this.r= -this.r;

	a= this.x2- this.xo;
	b= this.y2- this.yo;
	t2= Math.sqrt(a*a+b*b);
	if(!t2) this.dd= ra0* 2* pi, this.m= 0;
	else {
		d1= Math.acos(a/t2);
		if(b<0) d1= -d1;		// correct angle
		a= this.r* Math.sin(this.d2);
		d2= Math.asin(a/t2);
		this.dd= d1- d2;
		this.m= Math.sqrt(t2*t2-a*a)/ this.d2;
		}

	return this;
	}

function moveAsSine() {	// method
	var a, b, tp, dp, d;

	if(this.inuse!= "active") return;
	if(jvs.pause) { setTimeout(this.name+ ".runner()", this.t); return; }
	if(this.s>0) {
		d= this.d2* Math.pow(this.s/ this.ss, this.power);
		a= this.m* d;
		b= this.r* Math.sin(d);
		tp= Math.sqrt(a*a+b*b);
		if(!tp) d=0;
		else {
			d= Math.acos(a/tp)
			if(b<0) d= -d;		// correct angle
			}
		dp= d+ this.dd;

		this.obj.left= jvspx(this.xo+ tp*Math.cos(dp));
		this.obj.top= jvspx(this.yo+ tp*Math.sin(dp));
		}
	else
		this.selfrewind();

	this.finish();
	}

function objMAEllips(nextfunc, syncfunc, stepfunc, obj, xc, yc, rx, ry, ra, rp0, rp2, power, steps, syncstep, times, autofree, dir) {	// class
	this.runner= moveAsEllips;
	this.selfrewind= rewComXY;
	this.objMA= objMA;
	this.objMA("Ellips", obj, nextfunc, syncfunc, stepfunc, power, steps, syncstep, times, autofree, dir);
	this.xo= parseFloat(obj.left);
	this.yo= parseFloat(obj.top);
	this.xc= parseFloat(xc);
	this.yc= parseFloat(yc);
	this.rx= parseFloat(rx);
	this.ry= parseFloat(ry);
	this.ra= ra* 2* pi;
	this.rp0= rp0* 2* pi;
	this.rp2= rp2* 2* pi;

	this.rp= this.rp2- this.rp0;

	return this;
	}

function moveAsEllips() {	// method
	var d, dp, a, b, t;

	if(this.inuse!= "active") return;
	if(jvs.pause) { setTimeout(this.name+ ".runner()", this.t); return; }
	if(this.s>=0) {
		dp= this.rp* Math.pow(this.s/ this.ss, this.power)+ this.rp0;
		a= this.rx* Math.cos(dp);
		b= this.ry* Math.sin(dp);
		t= Math.sqrt(a*a+b*b);
		dp= Math.acos(a/t);
		if(b<0) dp= -dp;	// correct angle
		d= dp+ this.ra;
		this.obj.left= jvspx(this.xc+ t* Math.cos(d));
		this.obj.top= jvspx(this.yc- t* Math.sin(d));		// for correct y axis with: +
		}
//	else
//		this.selfrewind();

	this.finish();
	}

function objLayer(n) {	// func
	var o;

	switch(jvsrunway) {
		case 3:	if((o= document.getElementById(n))== null) break;
			o.style.div= o;
			return o.style;

		case 2:	if(document.all[n]== null) break;
			document.all[n].style.div= document.all[n];
			return document.all[n].style;
		default:
		case 1:	if(document[n]== null) break;
			return document[n];
		}

	if(jvsdebug) alert("\""+ n+ "\" not a layer name!");
	return null;
	}

function objFromLayer(y, n) {	// func
	var o;

	if(typeof(y)== "string") {
		switch(jvsrunway) {
			case 3:	if((o= document.getElementsByName(n))== null) break;	// not from layer, checked it
				if(o.item(0)== null) break;		// not from layer, checked it
//				alert(o.getElementsByName(n).item(0));
				return o.item(0);

			case 2:	if(document.all[y]== null) break;
				return document.all[y].all[n];
			default:
			case 1:	if(document[y]== null) break;
				return document[y].document[n];
			}

		if(jvsdebug) alert("\""+ n+ "\" not a layer name!");
		return null;
		}
	else {
		switch(jvsrunway) {
			case 3:	return document.getElementsByName(n);		// not from layer, checked
			case 2:	return y.div.all[n];
			default:
			case 1:	return y.document[n];
			}
		}
	}

function objLayerFromLayer(y, n) {	// func
	var o;

	if(typeof(y)== "string") {
		if((o= objFromLayer(y, n))==null) {
			if(jvsdebug) alert("\""+ y+ "."+ n+ "\" not a layer name!");
			return null;
			}

		switch(jvsrunway) {
			case 3:	o.style.div= o;	// not checked, maybe right
				return o.style;
			case 2:	o.style.div= o;
				return o.style;
			default:
			case 1:	return o;
			}
		}
	else {
		switch(jvsrunway) {
//			case 3:	if(document.getElementById(n)== null) break;
//				document.getElementById(n).style.div= document.getElementById(n);	// not checked
//				return document.getElementById(n).style;
			case 2:	if(y.div.all[n]== null) break;
				y.div.all[n].style.div= y.div.all[n];
				return y.div.all[n].style;
			default:
			case 1:	return y.document[n];
			}
		}
	if(jvsdebug) alert("...\""+ n+ "\" not a layer name!");
	return null;
	}

function layerWriteOpen(o) {	// func
	switch(jvsrunway) {
		case 3:	break;	// not checked
		case 2:	break;
		default:
		case 1:	o.document.open();
			break;
		}
	}

function layerWriteClose(o) {	// func
	switch(jvsrunway) {
		case 3:	break;	// not checked
		case 2:	break;
		default:
		case 1:	o.document.close();
			break;
		}
	}

function layerWrite(o,s) {	// func
	switch(jvsrunway) {
		case 3:	document.createElement("div");	// not checked
			break;
		case 2:	o.div.innerHTML+= s;
			break;
		default:
		case 1:	o.document.write(s);
			break;
		}
	}

function layerWriteAll(o,s) {	// func
	switch(jvsrunway) {
		case 2:	o.div.innerHTML= s;
			break;
		default:
		case 1:	o.document.open();
			o.document.write(s);
			o.document.close();
			break;
		}
	}

function layerWriteArray(y, a) {	// func
	var i, n;

	i= 0;
	n= a.length;
	for(i=0; i<n; i++) {
		layerWrite(y, jvsNewLayerCode(a[i][0], a[i][1], a[i][2], a[i][3], a[i][4], a[i][5], a[i][6]));
		}
	}

function objLayerArrayFromLayer(y, a) {	// func
	var i, n, t;

	i= 0;
	n= a.length;
	t= new Array();
	this.t= t;
	for(i=0; i<n; i++) {
		t[i]= objLayerFromLayer(y, a[i][0]);
		}
	return t;
	}

function layerSetSize(o, w, h) {
	switch(jvsrunway) {
		case 2:	o.width= w;
						o.height= h;
			break;
		default:
		case 1:	o.resizeBy(w, h);
			break;
		}
	}

function layerClear(o) {	// func
	layerWriteAll(o, "");
	}

function jvsNewLayerCode(n, s, p, l, t, w, h) {	// func
	switch(jvsrunway) {
		case 1:	return "<layer visibility=\""+ s+ "\" name=\""+ n+ "\" left=\""+ l+ "\" top=\""+ t+ "\""+ ((w==null) ? "":" width=\""+ w+ "\"")+ ((h==null) ? "":" height=\""+ h+ "\"")+ "></layer>";
		default:
		case 3:
		case 2:	return "<div id=\""+ n+ "\" style=\"position:"+ p+ "; visibility:"+ s+ "; left:"+ l+ "; top:"+ t+ ";"+ ((w==null) ? "":" width:"+ w+ ";")+ ((h==null) ? "":" height:"+ h+ ";")+ "\"></div>";
		}
	}

function jvsNewLayer(y, n, s, p, l, t, w, h) {	// func
	layerWriteAll(y, jvsNewLayerCode(n, s, p, l, t, w, h));
	return objLayerFromLayer(y, n);
	}

function jvsNewLayerArray2(y, a) {	// func
	var i, n, t;

	i= 0;
	n= a.length;
	t= new Array();
	this.t= t;
	layerWriteOpen(y);
	for(i=0; i<n; i++) {
		layerWrite(y, jvsNewLayerCode(a[i][0], a[i][1], a[i][2], a[i][3], a[i][4], a[i][5], a[i][6]));
		}
	layerWriteClose(y);
	for(i=0; i<n; i++) {
		t[i]= objLayerFromLayer(y, a[i][0]);
		}
	return t;
	}

function jvsNewLayerArray(y, a) {	// func
	layerWriteOpen(y);
	layerWriteArray(y, a);
	layerWriteClose(y);
	this.t= new objLayerArrayFromLayer(y, a);
	return this.t;
	}

function jvsBaseLayer() {	// func
	if(jvsbaselayer== null) {
		jvsbaselayer= objLayer(jvsbaselayername);
		if((jvsbaselayer== null) || (""+ jvsbaselayer== "undefined")) alert("jvsbaselayer undefined!\nPlease include file \"leadbaselayer.js\" at top of body.");
		}
	return jvsbaselayer;
	}

function jvsBaseNewLayer(n, s, p, l, t, w, h) {	// func
	if(jvsBaseLayer()!= null) {
		return jvsNewLayer(jvsbaselayer, n, s, p, l, t, w, h);
		}
	return null;
	}

function jvsBaseNewLayerArray(a) {	// func
	if(jvsBaseLayer()!= null) {
		return jvsNewLayerArray(jvsbaselayer, a);
		}
	return null;
	}

//function jvsNewImageOnLayer(y, n, s, p, l, t, w, h, isrc, in, ia, iw, ih, ib) {	// func
function jvsNewImageCode(src, n, a, w, h, b) {	// func
	return "<img src=\""+ src+ "\" name=\""+ n+ "\""+ ((a==null) ? "":" alt=\""+ a+ "\"")+ ((w==null) ? "":" width=\""+ w+ "\"")+ ((h==null) ? "":" height=\""+ h+ "\"")+ ((b==null) ? "":" border=\""+ b+ "\"")+ ">";
	}

function jvsNewImageOnLayer(y, src, n, a, w, h, b) {	// func
	layerWriteAll(y, jvsNewImageCode(src, n, a, w, h, b));
	}

function jvsIFrameLayer(n, f) {	// func, 未完成, 未定案, 框架 frame, 捲動, 等問題尚未測試
	switch(jvsrunway) {
		case 2:	document.write("<iframe NAME=\""+ n+ "\" src=\""+ f+ "\"></iframe>");
			return;
		default:
		case 1:	document.write("<ilayer NAME=\""+ n+ "\" src=\""+ f+ "\"></ilayer>");
			return;
		}
	}

function layerMove(o, l, t) {	// func
	o.left= jvspx(l);
	o.top= jvspx(t);
	}

function docImages(doc) {	// func
	var i, t;
	t= doc.images.length;
	if(jvsrunway==1) for(i=0; i<doc.layers.length; i++) {
		t+= docImages(doc.layers[i].document);
		}
	return t;
	}

function docImagesNamed(doc) {	// func
	var i, t;
	t= 0;	
	for(i=0; i<doc.images.length;i++) if(doc.images[i].name!="") t++;
	if(jvsrunway==1) for(i=0; i<doc.layers.length;i++) {
		t+= docImagesNamed(doc.layers[i].document);
		}
	return t;
	}

function docImagesReady(doc) {	// func
	var i, t;
	t= 0;	
	for(i=0; i<doc.images.length;i++) if(imageReady(doc.images[i])) t++;
	if(jvsrunway==1) for(i=0; i<doc.layers.length;i++) {
		t+= docImagesReady(doc.layers[i].document);
		}
	return t;
	}

function docMedias() {	// func
	return docImages(document)+ document.embeds.length;
	}

function docMediasNamed() {	// func
	return docImagesNamed(document);
	}

function docMediasReady() {	// func
	return docImagesReady(document);
	}

function loadedPercent() {	// func
	var s, t;
	t= docMedias();
	if(!t) return 100;
	s= docMediasReady();
	return Math.floor(i/t*100);
	}

function docReset() {	// func
	window.location.replace(window.location);
	}

function showLoadedPercent() {	// private func
	if(jvsloaded== true) {
		jvsload.bg.visibility= jvsload.s.visibility= hide;
		jvsload.bg.left= jvsload.s.left= jvspx(-300);
		return;
		}
	var a, b, c, t= new Date();
	b= docMedias();
	a= docMediasReady();
	c= docMediasNamed();
	if(!b) jvsload.p= jvsload.w;
	else
		jvsload.p= parseInt(a/b*jvsload.w);
	if(jvsload.p!= jvsload.r) {
		jvsloadtimes= t;
		objClipComb(jvsload.s, 0, 0, jvsload.r=jvsload.p, 3);
		}
	else
		if(jvsrunway==1) if(a>=c) if(Math.abs(t.getTime()-jvsloadtimes.getTime())> ((a==b) ? 1000:30000)) docReset();
	setTimeout("showLoadedPercent()", 50);
	}

function jvsLoadingMsg() {	// private func
	jvsload= new Object();
	jvsload.bg= objLayer("jvsloadbkg");
	jvsload.bg.left= jvspx((jvs.framewidth-300)/ 2);
	jvsload.bg.top= jvspx((jvs.frameheight* 0.7));
	jvsload.bg.visibility= show;
	jvsload.s= objLayer("jvsloadscale");
	jvsload.w= 280;
	jvsload.s.left= jvspx((jvs.framewidth-jvsload.w)/ 2);
	jvsload.s.top= jvspx(parseInt(jvsload.bg.top)+ 31);
	jvsload.r= 0;
	objClipComb(jvsload.s, 0, 0, jvsload.r, 3)
	jvsload.s.visibility= show;
	jvsloadtimes= new Date();
	showLoadedPercent();
	}

function showLoadingMsg(loadfunc) {	// func
	while(1) {
		if(loadfunc!= null) jvsloadingfunc= loadfunc;
		if(self.htmlloaded!= true) break;
		if(jvsRunway()<0) break;
		if(!jvsLibInit()) break;
		jvsRunFaster(2);
		eval(jvsloadingfunc);
		return;
		}
	setTimeout("showLoadingMsg()", 100);
	}

function hideLoadingMsg() {	// func
	jvsloaded= true;
	}

function topnameauto(t) {	// private func
	if(top.frames.length==0) { if(top.name=="") top.name= jvstopname; return top.name;}
	else
		if(t) { top.name= jvstopname; return jvstopname; }
		else
			return window.name;
	}

function topgo(url, dwin) {	// func
	if((url== null) || (url=="")) return;
	if(dwin!= null) window.open(url, dwin);
	else {
		window.open(url, "_top");  return;
		switch(jvsrunway) {
			case 3: // not checked
			case 2: window.open(url, topnameauto(true));  break;
			default:
			case 1: top.location= url;
			}
		}
	}

function go(url, dwin) {	// func
	if((url== null) || (url=="")) return;
	if(dwin!= null) window.open(url, dwin);
	else {
		window.open(url, "_self");  return;
		switch(jvsrunway) {
			case 3: // not checked
			case 2: window.open(url, topnameauto(false)); break;
			default:
			case 1: location= url;
			}
		}
	}

function topcookie(name, value) {	// func
	var v= subcookie(top.name, "_", "_", name, value);
	if(value!= null) top.name= v;
	return v;
	}

function doccookie(cookie, value, expires, path, domain, secure) {	// func
	if(!cookie) cookie= jvscookienamepub;
	if(value== null) return subcookie(unescape(document.cookie), "=", "; ", cookie);
	else {
		var tail= "";
		if(expires) tail= tail+ ";EXPIRES="+ expires.toGMTString();
		if(path) tail= tail+ ";PATH="+ path;
		if(domain) tail= tail+ ";DOMAIN="+ domain;
		if(secure!= null) tail= tail+ (secure ? ";SECURE":"");
		document.cookie= cookie+ "="+ escape(value)+ tail;
		return true;
		}
	}

function docsubcookie(cookie, name, value, expires, path, domain, secure) {	// func
	if(!cookie) cookie= jvscookienamepub;
	if(value== null) return subcookie(doccookie(cookie), "=", "&", name);
	else
		return doccookie(cookie, subcookie(doccookie(cookie), "=", "&", name, value), expires, path, domain, secure);
	}

function varsubcookie(scookie, name, value) {	// func
	return subcookie(scookie, "=", "&", name, value);
	}

function subcookie(cookie, eq, sep, name, value) {	// func
	var n= ""+ cookie;
	var s, t, r, nh, nt, v, vf;

	vf= (value!=null);
	r= 0;
	while(1) {
		s= n.indexOf(name+eq,r);
		if(s<0) nh= n, nt= "", v= "";
		else {
			r= s+ name.length+ eq.length;
			if((s>0) && (n.substring(s-sep.length,s)!=sep)) continue;
			if(vf) nh= n.substring(0,s);
			t= n.indexOf(sep, r);
			if(t<0) nt= "", v= n.substring(r);
			else {
				if(vf) nt= n.substring(t+sep.length);
				v= n.substring(r, t);
				}
			}

		break;
		}

	if(vf) {
		if(nh.length>0) if(nh.substring(nh.length-sep.length)!= sep) nh= nh+ sep;
		cookie= nh+ name+ eq+ value+ ((nt.length) ? (sep+ nt):"");
		return cookie;
		}

	return v;
	}

function jvscookiesessioncheck() {
	var t= new Date();
	doccookie("jvscookiesessioncheck", t.getTime(), null, "/");
	return (t.getTime()== doccookie("jvscookiesessioncheck"));
	}

function jvsArgWithFunc(func, r) {	// func
	var e, s, t, s2;
	var n, v;
	var fv;

	if(r== null) r= document.location.href;
	s= r.indexOf("?");
	while(s>=0) {
		r= r.substring(s+1);
		s2= t= r.indexOf("&");
		if(t<0) t= r.length;
		p= r.substring(0,t);
		e= p.indexOf("=");
		if(e<0) e= p.length;
		n= p.substring(0,e);
		v= p.substring(e+1, p.length);
		if(func.length) {
			if(func== "this") { if(!this.func(n,v)) break; }
			else {
				fv= func+ '("'+ n+ '", "'+ v+ '");';
				eval(fv);
				}
			}

		s= s2;
		}
	}

function jvsArgToCookie(cn, s) {	// func
	var t= new Object();

	if(cn==null) cn= jvscookienamepub;
	t.cookie= doccookie(cn);
	t.func= jvsArgFuncToCookie;
	t.argrun= jvsArgWithFunc;
	t.argrun("this", s);
	doccookie(cn, t.cookie, null, "/");
	}

function jvsArgFuncToCookie(n, v) {	// method
	this.cookie= varsubcookie(this.cookie, n, v);
	return true;
	}

function jvsArgByName(n, s) {	// func
	var t= new Object();

	t.n= n;
	t.v= null;
	t.func= jvsArgFuncByName;
	t.argrun= jvsArgWithFunc;
	t.argrun("this", s);
	return t.v;
	}

function jvsArgFuncByName(n, v) {	// method
	if(n== this.n) { this.v= v; return false; }
	else
		return true;
	}

function jvsArgStru(s) {	// class
	var t= new Object();

	t.s= this;
	t.func= jvsArgFuncStru;
	t.argrun= jvsArgWithFunc;
	t.argrun("this", s);
	return this;
	}

function jvsArgFuncStru(n, v) {	// method
	this.s[n]= v;
	return true;
	}

function jvsArgArray(s) {	// class
	this.a= new Array();
	this.func= jvsArgFuncArray;
	this.argrun= jvsArgWithFunc;
	this.argrun("this", s);
	return this.a;
	}

function jvsArgFuncArray(n, v) {	// method
	this.a[this.a.length]= new Array(n, v);
	return true;
	}

function jvsDocURL(r) {	// func
	var s;

	if(r== null) r= document.location.href;
	s= r.indexOf("?");
	if(s<0) return r;

	return r.substring(0,s);
	}

function jvsDisplay(n, t) {
	if(t== null) return (objLayer(n).display== "");
	else {
		objLayer(n).display= (t ? "":"none");
		}
	}

function jvsDisplayFlip(n) {
	jvsDisplay(n, !jvsDisplay(n));
	}