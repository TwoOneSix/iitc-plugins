// ==UserScript==
// @id             iitc-plugin-faction-toggle@jim
// @name           IITC plugin: Limit viewable portals by specific faction
// @version        0.0.1.20130427.095510
// @namespace      https://github.com/TwoOneSix/iitc-plugins
// @updateURL      https://raw.github.com/TwoOneSix/iitc-plugins/master/iitc-plugin-faction-toggle.meta.js
// @downloadURL    https://raw.github.com/TwoOneSix/iitc-plugins/master/iitc-plugin-faction-toggle.user.js
// @description    [2013-04-27-095510] Limit viewable portals by specific faction
// @include        https://www.ingress.com/intel*
// @include        http://www.ingress.com/intel*
// @match          https://www.ingress.com/intel*
// @match          http://www.ingress.com/intel*
// ==/UserScript==

/* whatsnew
* 0.0.1 : initial release, show only portals of a specific faction
* todo : 
*/ 

function wrapper() {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};

// PLUGIN START ////////////////////////////////////////////////////////

// use own namespace for plugin
window.plugin.factiontoggle = function() {};
    
window.plugin.factiontoggle.listPortals = []; // structure : name, team, level, resonators = Array, Shields = Array, APgain
window.plugin.factiontoggle.sortOrder=-1;    
window.plugin.factiontoggle.enlP = 0;
window.plugin.factiontoggle.resP = 0;
window.plugin.factiontoggle.filter=0;

//fill the listPortals array with portals avalaible on the map (level filtered portals will not appear in the table)
window.plugin.factiontoggle.hideFaction = function(hide) {
  //filter : 0 = All, 1 = Res, 2 = Enl
  console.log('** getPortals');
  var retval=false;
  
  window.plugin.factiontoggle.listPortals = [];
  //get portals informations from IITC
  $.each(window.portals, function(i, portal) {

    retval=true;
    //testing
    var d = portal.options.details;
    var name = d.portalV2.descriptiveText.TITLE;
    var guid = portal.options.guid;
    var team = portal.options.team;
      
    console.log('** GUID: ' + guid);
    switch (team){
      case 1 :
        window.plugin.factiontoggle.resP++;
        console.log('** Faction: Resistance');
        if (hide === team){ removeByGuid(guid); }
        break;
      case 2 :
        window.plugin.factiontoggle.enlP++;
        console.log('** Faction: Enlightened');
        if (hide === team){ removeByGuid(guid); }
        break;
    }
    console.log('** Name: ' + name);
  });

  return retval;
}

window.plugin.factiontoggle.displayPL = function() {
  // debug tools
  var start = new Date().getTime();
  console.log('***** Start ' + start);

  window.plugin.factiontoggle.sortOrder=-1;
  window.plugin.factiontoggle.enlP = 0;
  window.plugin.factiontoggle.resP = 0;

  if (window.plugin.factiontoggle.getPortals()) {
    alert('Enlightened: '+window.plugin.factiontoggle.enlP+'<br>Resistance: '+window.plugin.factiontoggle.resP);
  } else {
    alert('Nothing to Show!');
  }
 }

var setup =  function() {
  $('#toolbox').append(' <a onclick="window.plugin.factiontoggle.hideFaction(1)" title="Hide Resistance Portals">Hide Res</a>');
  $('#toolbox').append(' <a onclick="window.plugin.factiontoggle.hideFaction(2)" title="Hide Enlightened Portals">Hide Enl</a>');
  //add layer options
  //plugin.factiontoggle.showEnl = new L.LayerGroup();
  //plugin.factiontoggle.showRes = new L.LayerGroup();
  //window.layerChooser.addOverlay(plugin.factiontoggle.showEnl, 'Enlightened');
  //window.layerChooser.addOverlay(plugin.factiontoggle.showRes, 'Resistance');
  //map.addLayer(plugin.factiontoggle.showEnl);
  //map.addLayer(plugin.factiontoggle.showRes);

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
