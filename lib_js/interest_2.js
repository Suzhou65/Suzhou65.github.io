jvsRunway();
jvsArgToCookie();
var jvsargstru= jvsArgStru("?"+ doccookie(jvscookienamepub));
var noarg= jvsArgByName("noarg");
if((noarg!=null) && (("0"+noarg)!= "00")) while(1) {
	if(jvsargstru) if(jvsargstru.tourl) if(jvsargstru.tourl.length) {
		docsubcookie(null, "tourl", "", null, "/");
		window.location.replace(jvsargstru.tourl);
		break;
		}

	window.location.replace(jvsDocURL());
	break;
	}
