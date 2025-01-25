/******************************************************************
 * Refined Spotify API Helper by Jason Mayes.
 * Cleaned up and adapted from:
 * https://github.com/makeratplay/SpotifyWebAPI <3
 ******************************************************************/

let spotifyAPIHelper = function() {
  const REDIRECT_URI = "https://spotify-web-ai-agent-dj.glitch.me/index.html"; // YOU NEED TO UPDATE THIS TO BE YOUR DOMAIN AND AUTH WITH YOUR OWN CREDENTIALS BELOW.

  const AUTHORIZE = "https://accounts.spotify.com/authorize"
  const TOKEN = "https://accounts.spotify.com/api/token";
  const DEVICES = "https://api.spotify.com/v1/me/player/devices";
  const PLAY = "https://api.spotify.com/v1/me/player/play";
  const PAUSE = "https://api.spotify.com/v1/me/player/pause";
  const NEXT = "https://api.spotify.com/v1/me/player/next";
  const PREVIOUS = "https://api.spotify.com/v1/me/player/previous";
  const PLAYER = "https://api.spotify.com/v1/me/player";

  let devicesDomDropdown = undefined;
  var client_id = ""; // UPDATE THIS VIA GUI RIGHT HAND SIDE PANEL ON LIVE PAGE SO NOT IN CODE.
  var client_secret = ""; // UPDATE THIS VIA GUI RIGHT HAND SIDE PANEL ON LIVE PAGE SO NOT IN CODE.
  var access_token = "";
  var refresh_token = "";


  function onPageLoad(devicesDropdownDOMID){
    devicesDomDropdown = document.getElementById(devicesDropdownDOMID);
    if (client_id == '') {
      client_id = localStorage.getItem("client_id");
    }
    if (client_id !== '') {
      if (client_secret == '') {
        client_secret = localStorage.getItem("client_secret");
      }
      if ( window.location.search.length > 0 ){
        handleRedirect();
      }
      else{
        if (access_token == '') {
          access_token = localStorage.getItem("access_token");
        }
        if ( access_token !== null ){
          // we have an access token so present device section
          refreshDevices();
        }
      }
    }
  }

  
  function handleRedirect(){
    let code = getCode();
    fetchAccessToken( code );
    window.history.pushState("", "", REDIRECT_URI); // remove param from url
  }

  
  function getCode(){
    let code = null;
    const queryString = window.location.search;
    if ( queryString.length > 0 ){
      const urlParams = new URLSearchParams(queryString);
      code = urlParams.get('code');
      console.log(urlParams);
    }
    return code;
  }

  
  function requestAuthorization(client_id, client_secret){
    localStorage.setItem("client_id", client_id);
    // In a real app you should not expose your client_secret to the user
    localStorage.setItem("client_secret", client_secret);
    
    let url = AUTHORIZE;
    url += "?client_id=" + client_id;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(REDIRECT_URI);
    url += "&show_dialog=true";
    url += "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private";
    window.location.href = url; // Show Spotify's authorization screen
  }

  
  function fetchAccessToken( code ){
    let body = "grant_type=authorization_code";
    body += "&code=" + code; 
    body += "&redirect_uri=" + encodeURI(REDIRECT_URI);
    body += "&client_id=" + client_id;
    body += "&client_secret=" + client_secret;
    callAuthorizationApi(body);
  }

  
  function refreshAccessToken() {
    if (refresh_token === '') {
      refresh_token =  localStorage.getItem("refresh_token");
    }
    let body = "grant_type=refresh_token";
    body += "&refresh_token=" + refresh_token;
    body += "&client_id=" + client_id;
    callAuthorizationApi(body);
  }

  
  function callAuthorizationApi(body){
    let xhr = new XMLHttpRequest();
    xhr.open("POST", TOKEN, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(client_id + ":" + client_secret));
    xhr.send(body);
    xhr.onload = handleAuthorizationResponse;
  }

  
  function handleAuthorizationResponse(){
    if ( this.status == 200 ){
      var data = JSON.parse(this.responseText);
      // console.log(data);
      var data = JSON.parse(this.responseText);
      if ( data.access_token != undefined ){
          access_token = data.access_token;
          localStorage.setItem("access_token", access_token);
      }
      if ( data.refresh_token  != undefined ){
          refresh_token = data.refresh_token;
          localStorage.setItem("refresh_token", refresh_token);
      }
      onPageLoad();
    }
    else {
      console.log(this.responseText);
      alert(this.responseText);
    }
  }
  

  function refreshDevices(){
    callApi( "GET", DEVICES, null, handleDevicesResponse );
  }

  
  function handleDevicesResponse(){
    if ( this.status == 200 ){
      var data = JSON.parse(this.responseText);
      console.log(data);
      data.devices.forEach(item => addDevice(item));
    }
    else if ( this.status == 401 ){
      refreshAccessToken()
    }
    else {
      console.log(this.responseText);
      alert(this.responseText);
    }
  }
  

  function addDevice(item){
    let node = document.createElement("option");
    node.value = item.id;
    node.innerHTML = item.name;
    devicesDomDropdown.appendChild(node);
  }

  
  function callApi(method, url, body, callback){
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
    xhr.send(body);
    xhr.onload = callback;
  }

  
  function play(playlist_id, trackindex, album){
    let body = {};
    if ( album.length > 0 ){
      body.context_uri = album;
    }
    else{
      body.context_uri = "spotify:playlist:" + playlist_id;
    }
    body.offset = {};
    body.offset.position = trackindex.length > 0 ? Number(trackindex) : 0;
    body.offset.position_ms = 0;
    callApi( "PUT", PLAY + "?device_id=" + deviceId(), JSON.stringify(body), handleApiResponse );
  }
  

  function pause(){
    callApi( "PUT", PAUSE + "?device_id=" + deviceId(), null, handleApiResponse );
  }

  
  function next(){
    callApi( "POST", NEXT + "?device_id=" + deviceId(), null, handleApiResponse );
  }

  
  function previous(){
    callApi( "POST", PREVIOUS + "?device_id=" + deviceId(), null, handleApiResponse );
  }

  
  function transfer(){
    let body = {};
    body.device_ids = [];
    body.device_ids.push(deviceId())
    callApi( "PUT", PLAYER, JSON.stringify(body), handleApiResponse);
  }

  
  function handleApiResponse(){
    if ( this.status == 200){
     console.log(this.responseText);
    }
    else if ( this.status == 401 ){
      refreshAccessToken();
    }
    else {
      console.log(this.responseText);
      alert(this.responseText);
    }
  }

  
  function deviceId(){
    return devicesDomDropdown.value;
  }

  
  return {
    init: onPageLoad,
    requestAuth: requestAuthorization,
    refreshAuth: refreshAccessToken,
    callAPI: callApi
  };
}();

export default spotifyAPIHelper;
