function argBgcolor() {
	if(jvsargstru) if(jvsargstru.bgcolor) if(jvsargstru.bgcolor.length) document.bgColor= "#"+ jvsargstru.bgcolor;
	}

function argBgimage() {
	if(jvsargstru) if(jvsargstru.bgimage) if(jvsargstru.bgimage.length) {
		switch(jvsrunway) {
			case 1: break;	// by jsss
			case 2: document.body.background= jvsargstru.bgimage;  break;
			}		
		}
	}

argBgcolor();
argBgimage();