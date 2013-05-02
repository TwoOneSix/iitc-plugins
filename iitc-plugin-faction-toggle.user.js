// ==UserScript==
// @id             iitc-plugin-faction-toggle@TwoOneSix
// @name           IITC plugin: Limit viewable portals by specific faction
// @version        0.0.1.20130501.112017
// @namespace      https://github.com/TwoOneSix/iitc-plugins
// @updateURL      https://raw.github.com/TwoOneSix/iitc-plugins/master/iitc-plugin-faction-toggle.meta.js
// @downloadURL    https://raw.github.com/TwoOneSix/iitc-plugins/master/iitc-plugin-faction-toggle.user.js
// @description    [2013-05-01-112017] Limit viewable portals by specific faction
// @include        https://www.ingress.com/intel*
// @include        http://www.ingress.com/intel*
// @match          https://www.ingress.com/intel*
// @match          http://www.ingress.com/intel*
// ==/UserScript==

/* whatsnew
* 0.1.0 : initial release, allows user to show/hide portals of a specific faction
* TODO : use a better toggle system?
* TODO : research more 'hooks'
*
* KNOWN ISSUE : 'Hidden' Portals render before being removed
* KNOWN ISSUE : The system to toggle faction visibility sucks, sorry
*/ 

function wrapper() {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};

// PLUGIN START ////////////////////////////////////////////////////////

// use own namespace for plugin
window.plugin.factiontoggle = function() {};

//handle the map_data updates
window.plugin.factiontoggle.handleUpdate = function() {
    if(!requests.isLastRequest('getThinnedEntitiesV2')) return;
    window.plugin.factiontoggle.toggle(0);
}

window.plugin.factiontoggle.showEnl = true;
window.plugin.factiontoggle.showRes = true;

window.plugin.factiontoggle.toggle = function(infact) {
  infact = typeof infact !== 'undefined' ? infact : 0;
  //console.log('** Changing Portal Visibility...maybe...(' + infact + ')');
  var retval = false;
  var pdown = 0;
  switch(infact){
    case 1 :
      if (window.plugin.factiontoggle.showRes === true) {
          window.plugin.factiontoggle.showRes = false;
      } else {
          window.plugin.factiontoggle.showRes = true;
          window.requestData();
      }
      pdown = 1;
      break;
    case 2 :
      if (window.plugin.factiontoggle.showEnl === true) {
          window.plugin.factiontoggle.showEnl = false;
      } else {
          window.plugin.factiontoggle.showEnl = true;
          window.requestData();
      }
      pdown = 2;
      break;
  }

  //console.log('** resStatus: '+ window.plugin.factiontoggle.showRes);
  //console.log('** enlStatus: '+ window.plugin.factiontoggle.showEnl);
  //process portal information
  $.each(window.portals, function(i, portal) {
    retval = true;

    var d = portal.options.details;
    var name = d.portalV2.descriptiveText.TITLE;
    var guid = portal.options.guid;
    var team = portal.options.team;
      
    if (pdown <= 1 && team === 1){
        if (window.plugin.factiontoggle.showRes === false){ removeByGuid(guid); }
    } else if (pdown <= 2 && team === 2){
        if (window.plugin.factiontoggle.showEnl === false){ removeByGuid(guid); }
    }
  });

  return retval;
}

var setup =  function() {
  $('#toolbox').append(' <a id="factiontoggle1" onclick="window.plugin.factiontoggle.toggle(1)" title="Resistance Portals">Hide Res</a>');
  $('#toolbox').append(' <a id="factiontoggle2" onclick="window.plugin.factiontoggle.toggle(2)" title="Enlightened Portals">Hide Enl</a>');
  $('a#factiontoggle1').click(function() {
    $(this).text($(this).text() == 'Show Res' ? 'Hide Res' : 'Show Res');
    return false;
  });
  $('a#factiontoggle2').click(function() {
    $(this).text($(this).text() == 'Show Enl' ? 'Hide Enl' : 'Show Enl');
    return false;
  });

  //handle data updates
  window.addHook('requestFinished', window.plugin.factiontoggle.handleUpdate);

}

// PLUGIN END //////////////////////////////////////////////////////////

if(window.iitcLoaded && typeof setup === 'function') {
  setup();
} else {
  if(window.bootPlugins)
    window.bootPlugins.push(setup);
  else
    window.bootPlugins = [setup];
}
} // wrapper end
// inject code into site context
var script = document.createElement('script');
script.appendChild(document.createTextNode('('+ wrapper +')();'));
(document.body || document.head || document.documentElement).appendChild(script);
