import React, { Component, useState } from "react";
// Reference: https://docs.kommunicate.io/docs/web-installation#react-js

export default class KommunicateChatBot extends Component{
    constructor(props){
        super(props);
    }
// The below code will launch the chat widget on the front-end of the website.
componentDidMount(){
    (function(d, m){
        var kommunicateSettings = 
            {"appId":"9b901ca941ead40b286fab3adeab6661","popupWidget":true,"automaticChatOpenOnNavigation":true};
        var s = document.createElement("script"); s.type = "text/javascript"; s.async = true;
        s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
        var h = document.getElementsByTagName("head")[0]; h.appendChild(s);
        window.kommunicate = m; m._globals = kommunicateSettings;
    })(document, window.kommunicate || {});
}
render(){
    return (
        <div></div>
    )
}
}

