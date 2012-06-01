﻿window.Microsoft=window.Microsoft||{},window.Microsoft.Maps=window.Microsoft.Maps||{},window.Microsoft.Maps.initVenueMapsCode=function(){var k="View {0} map",i=window.Microsoft.Maps,l=i.Gimme,ft=i.Globals,tt=i.Point,et=i.PixelReference,t=i.Events,b=i.LocationRect,e=i.Location,u=i.MapTypeId,s=i.LabelOverlay,o=i.Color,nt=i.Polygon,g=i.Infobox,ut=i.TileSource,rt=i.TileLayer,it=i.QuadKey,a=i.InternalNamespaceForDelay,v=a.Network,w=a.Quirks,d=a.PRF,n={},r,p,c,f,y,h;n.VenueMapConstants={_strokeWeightNormal:"2",_strokeWeightHighlighted:"2",_log_FeatureName:"VenueMaps",_log_Action_LaunchVenueMap:"LaunchVenueMap",_log_Action_CloseVenueMap:"CloseVenueMap",_log_Action_SetFloor:"SetFloor",_log_Action_StoreClick:"StoreClick",_log_Action_FootprintClick:"FootprintClick",_log_Info_NullOrEmptyMetadata:"NullOrEmptyMetadata",_log_Info_InvalidMetadata:"InvalidMetadata",_log_Key_MapId:"mapId",_log_Key_MapType:"mapType",_log_Key_MapView:"mapView",_log_Key_Floor:"floor",_log_Key_YpId:"ypId",_log_Key_BusinessName:"businessName",_log_Key_TargetLod:"targetLod",viewHidden:"hidden",viewHalfImmersed:"halfImmersed",viewFullyImmersed:"fullyImmersed"},n.bind=function(n,t){return function(){return t.apply(n,arguments)}},n._callAsync=function(){var r=arguments[0],t,n,i;if(r){for(t=[],n=1,i=arguments.length;n<i;n++)t[n-1]=arguments[n];window.setTimeout(function(){r.apply(window,t)},1)}},n.BreadcrumbEventNames={locked:"locked",unlocked:"unlocked",breadcrumbsChanged:"breadcrumbschanged",pathNodeClicked:"pathnodeclicked",closed:"closed",groupSelectedItemChanged:"groupselecteditemchanged"},n.BreadcrumbManager=function(n,t,i,r,u,f,e){this._map=n,this._bounds=f,this._buildingName=t,this._selectedFloor=i[0],this._zoom=u,this._center=r,this._halfImmersedRange=e,this._floors=i,this._isMultiFloor=i.length>1,this._isDisposed=!1,this._added=!1,this._breadcrumb=null,this._mapStyleChangedHandler=null,this._viewChangedHandler=null,this._closeButtonHandler=null,this._selectionChangedHandler=null,this._componentAddedHandler=null,this._nodeChangedHandler=null,this._showWhenLoaded=!1,this._isLocked=!1,this._init()},n.BreadcrumbManager.prototype={show:function(){this._breadcrumb?(this._updateBreadcrumb(),this._captureMapEvents()):this._showWhenLoaded=!0},hide:function(){this._removeVenueFromBreadcrumb(),this._uncaptureMapEvents()},_raiseEvent:function(n,i){t.invoke(this,n,i)},get__floor:function(){return this._selectedFloor},set__floor:function(n){return this._selectedFloor!==n&&(this._selectedFloor=n,this._breadcrumb&&this._added&&this._isMultiFloor&&this._breadcrumb.selectGroupItem("floor",this._selectedFloor)),n},_dispose:function(){this._uncaptureMapEvents(),this._removeVenueFromBreadcrumb();var n=this._componentAddedHandler;n&&(t.removeHandler(n),this._componentAddedHandler=null),this._breadcrumb=null,this._isDisposed=!0},_captureMapEvents:function(){this._viewChangedHandler||(this._viewChangedHandler=t.addHandler(this._map.getMap(),"viewchangeend",n.bind(this,this._onViewChanged))),this._mapStyleChangedHandler||(this._mapStyleChangedHandler=t.addHandler(this._map,"stylechanged",n.bind(this,this._onStyleChanged)))},_uncaptureMapEvents:function(){t.removeHandler(this._viewChangedHandler),t.removeHandler(this._mapStyleChangedHandler),this._viewChangedHandler=null,this._mapStyleChangedHandler=null},_init:function(){var r,i,f,u;if(this._isDisposed)return;r=this._map.get_Breadcrumb(),r?(i=this._componentAddedHandler,i&&(t.removeHandler(i),this._componentAddedHandler=null),this._breadcrumb=r,this._showWhenLoaded&&(this.show(),delete this._showWhenLoaded)):this._componentAddedHandler||(f=n.bind,u=this._map,this._componentAddedHandler=t.addHandler(u.getMap(),"componentadded",f(this,this._init)))},_attachEventHandlers:function(){this._breadcrumb&&(this._closeButtonHandler=t.addHandler(this._breadcrumb,n.BreadcrumbEventNames.closed,n.bind(this,this._onCloseButtonClicked)),this._selectionChangedHandler=t.addHandler(this._breadcrumb,n.BreadcrumbEventNames.groupSelectedItemChanged,n.bind(this,this._onSelectionChanged)),this._nodeChangedHandler=t.addHandler(this._breadcrumb,n.BreadcrumbEventNames.pathNodeClicked,n.bind(this,this._onBreadcrumbNodeChanged)))},_removeEventHandlers:function(){this._breadcrumb&&(t.removeHandler(this._closeButtonHandler),t.removeHandler(this._selectionChangedHandler),t.removeHandler(this._nodeChangedHandler))},_onBreadcrumbNodeChanged:function(t){var i=t;i.pathNodeLevel==="building"?this._map.SetView(n.$create_ViewSpecification(this._center,this._zoom),!0):i.pathNodeLevel==="floor"&&(this._breadcrumb.highlightCrumb(null),this._updateHighlight())},_onCloseButtonClicked:function(n){this._breadcrumb&&this._removeVenueFromBreadcrumb(),this._raiseEvent("closed",n)},_onSelectionChanged:function(n){if(this._breadcrumb){this._breadcrumb.highlightCrumb(null),this._updateHighlight();var t=n;t.groupName==="floor"&&t.newItem!==this._selectedFloor&&(this._selectedFloor=t.newItem,this._raiseEvent("floorchanged",t))}},_onViewChanged:function(){this._updateBreadcrumb(),this._updateHighlight()},_onStyleChanged:function(){this._updateBreadcrumb()},_updateHighlight:function(){var n=this._map.GetTargetZoomLevel();n===this._zoom?this._breadcrumb.highlightCrumb("building"):n>this._zoom&&this._breadcrumb.highlightCrumb(null)},_updateBreadcrumb:function(){this._breadcrumb&&(this._map.IsMercator()?this._updateVisibility():this._removeVenueFromBreadcrumb())},_updateVisibility:function(){if(this._breadcrumb){var n=this._map.GetTargetZoomLevel();n<this._halfImmersedRange.get_from()||!this._bounds.intersects(this._map.GetBounds())?this._removeVenueFromBreadcrumb():n>this._halfImmersedRange.get_to()?(this._isLocked||(this._breadcrumb.lockToLocation(this._center),this._isLocked=!0),this._addVenueToBreadcrumb(),this._breadcrumb.setVisibility("building",!0),this._isMultiFloor&&this._breadcrumb.setVisibility("floor",!0),this._breadcrumb.showCloseButton()):(this._isLocked||(this._breadcrumb.lockToLocation(this._center),this._isLocked=!0),this._addVenueToBreadcrumb(),this._breadcrumb.setVisibility("building",!0),this._isMultiFloor&&this._breadcrumb.setVisibility("floor",!1),this._breadcrumb.hideCloseButton())}},_addVenueToBreadcrumb:function(){this._breadcrumb&&!this._added&&(this._breadcrumb.addCrumb("element","building",this._buildingName,null,!0),this._isMultiFloor&&this._breadcrumb.addCrumb("group","floor",this._selectedFloor,this._floors,!0),this._breadcrumb.showCloseButton(),this._attachEventHandlers(),this._added=!0)},_removeVenueFromBreadcrumb:function(){this._breadcrumb&&this._added&&(this._breadcrumb.removeCrumb("building"),this._isMultiFloor&&this._breadcrumb.removeCrumb("floor"),this._breadcrumb.hideCloseButton(),this._breadcrumb.unlockFromLocation(),this._removeEventHandlers(),this._isLocked=!1),this._added=!1}},n.CosmosAnalytics={_s4:function(){return((1+Math.random())*65536|0).toString(16).substr(1)},guid:function(){return n.CosmosAnalytics._s4()+n.CosmosAnalytics._s4()+"-"+n.CosmosAnalytics._s4()+"-"+n.CosmosAnalytics._s4()+"-"+n.CosmosAnalytics._s4()+"-"+n.CosmosAnalytics._s4()+n.CosmosAnalytics._s4()+n.CosmosAnalytics._s4()}},n.DoubleRange=function(n,t){this._fromValue=n,this._toValue=t},n.DoubleRange.prototype={_fromValue:0,_toValue:0,get_to:function(){return this._toValue},get_from:function(){return this._fromValue},get_range:function(){return this.get_to()-this.get_from()}},n.LocationPolygon=function(n,t,i,r){for(var p=n.length,y=new Array(p),o=i[3]*n[0]+i[4]*t[0]+i[5],l=o,f=i[0]*n[0]+i[1]*t[0]+i[2],c=f,h,s,a,v,u=0;u<p;u++)h=i[0]*n[u]+i[1]*t[u]+i[2],s=i[3]*n[u]+i[4]*t[u]+i[5],y[u]=new e(s,h),o<s&&(o=s),l>s&&(l=s),f>h&&(f=h),c<h&&(c=h);a=new e((o+l)/2,(f+c)/2),v=new b(a,c-f,o-l),this.latLongs=y,this.center=a,this.boundingBox=v,this.optimalZoom=function(n){var s=r.getRootElement().clientWidth,h=r.getRootElement().clientHeight,u=r.getTargetZoom(),t=r.tryLocationToPixel(new e(o,f)),i=r.tryLocationToPixel(new e(l,c));if(t&&i&&s&&h&&u){var y=Math.abs(t.y-i.y),p=Math.abs(i.x-t.x),a=u+Math.log(n*h/y)*Math.LOG2E,v=u+Math.log(n*s/p)*Math.LOG2E;return Math.round(Math.min(a,v))}return 18}},n.MapController=function(n){this._map=n,this._shapes={},this._layers={},this._mapEntities={},this._registerEvents()},n.MapController.prototype={_map:null,_layers:null,_shapes:null,_zoomAwareLines:null,_isDisposed:!1,_offscreenPoint:new tt(-1e4,-1e4),getMap:function(){return this._map},IsMercator:function(){return this._map.isMercator()},GetBounds:function(){return this._map.getBounds()},get_Breadcrumb:function(){return this._map.getComponent("breadcrumb")},GetMapStyle:function(){var r=this._map.getMapTypeId(),i=this._map.getOptions(),t=i.labelOverlay;return n.ViewSpecificationHelper.getMapStyle(r,t)},SetMapStyle:function(t){if(t!==this.GetMapStyle()){var i=n.$create_ViewSpecification();n.ViewSpecificationHelper.populateViewForStyle(i,t),this._map.setView(i)}},SetView:function(n){this._map.setView(n)},GetMapWidth:function(){return this._map.getWidth()},GetMapHeight:function(){return this._map.getHeight()},GetTargetZoomLevel:function(){return this._map.getTargetZoom()},AddLayer:function(n,t){this._layers[n]||(t.layerId=n,this._map.entities.push(t),this._layers[n]=t)},RemoveLayer:function(n){this._layers[n]&&(this._map.entities.remove(this._layers[n]),delete this._layers[n])},GetShape:function(n){return this._shapes[n]},AddShapeById:function(n,t){this._addShape(n,t),this._shapes[n]=t},RemoveShapeById:function(n){if(n){var t=this.GetShape(n);t&&t.eroController&&t.eroController.detachFromShape(),this._removeShape(n),delete this._shapes[n]}},_mapEntities:null,_addShape:function(n,t){this._removeShape(n);var i=this._map.entities;i.push(t),this._mapEntities[n]=t},_removeShape:function(n){var i=this._mapEntities[n],t;i&&(t=i.parentCollection,t||(t=this._map.entities),t.remove(i),delete this._mapEntities[n])},get_MapContainer:function(){return this._map?this._map.getRootElement():null},AddPolygon:function(n,t,i,r,u){var f=this._addPolygon2(n,t,i,r,u);return this._shapes[n]=f,f},_addPolygon2:function(n,t,i,r,u){this._removeShape(n);var f=new nt(t,{strokeThickness:i,strokeColor:r,fillColor:u}),e=this._map.entities;return e.push(f),this._mapEntities[n]=f,f},_viewChangeEndHandler:null,_imageryChangedHandler:null,_registerEvents:function(){this._viewChangeEndHandler||(this._viewChangeEndHandler=t.addHandler(this._map,"targetviewchanged",n.bind(this,this._map_ViewChanged))),this._imageryChangedHandler||(this._imageryChangedHandler=t.addHandler(this._map,"imagerychanged",n.bind(this,this._map_ImageryChanged)))},dispose:function(){if(this._isDisposed)return;this._unregisterEvents(),this._isDisposed=!0},_unregisterEvents:function(){this._viewChangeEndHandler&&(t.removeHandler(this._viewChangeEndHandler),this._viewChangeEndHandler=null),this._imageryChangedHandler&&(t.removeHandler(this._imageryChangedHandler),this._imageryChangedHandler=null)},_raiseEvent:function(n,i){t.invoke(this,n,i)},_map_ViewChanged:function(){this._raiseEvent("viewchanged",new n.MapControllerEventArgs)},_map_ImageryChanged:function(){this._raiseEvent("stylechanged",new n.MapControllerEventArgs)}},n.MapControllerEventArgs=function(n){this._keyCode=n},n.MapControllerEventArgs.prototype={_keyCode:0,get_key:function(){return this._keyCode}},n.MultiscaleTileSource=function(n,t){this._tileWidth=n,this._tileHeight=t},n.MultiscaleTileSource.prototype={_tileWidth:0,_tileHeight:0,get__tileWidth:function(){return this._tileWidth},get__tileHeight:function(){return this._tileHeight},isSame:function(n){return this.get__tileWidth()===n.get__tileWidth()&&this.get__tileHeight()===n.get__tileHeight()&&this.get_uriFormat()===n.get_uriFormat()&&this.get_numberOfTileServers()===n.get_numberOfTileServers()},createTileSource:function(){return new ut({width:this.get__tileWidth(),height:this.get__tileHeight(),uriFormat:this.get_uriFormat().replace("{{","{").replace("}}","}"),uriConstructor:n.bind(this,this.getTileUri)})}},n.MercatorModeTileSource=function(t){n.MultiscaleTileSource.apply(this,[n.MercatorModeTileSource._defaultTileSize$1,n.MercatorModeTileSource._defaultTileSize$1]),this._format$1=t,this._numberOfTileServers$1=i.Globals.venueMapsNumberOfMapTileServers||0;var u=i.Globals.venueMapsTileServerSubdomainsX||"",r=i.Globals.venueMapsTileServerSubdomainsY||"";this._subdomains$1=[u.split(","),r.split(",")],n.MercatorModeTileSource._xLength$1=this._subdomains$1.length,n.MercatorModeTileSource._yLength$1=this._subdomains$1[0].length},n.MercatorModeTileSource.prototype=new n.MultiscaleTileSource(0,0),r=n.MercatorModeTileSource.prototype,r._format$1="",r._numberOfTileServers$1=0,r._hasZoomRange$1=!1,r._minZoom$1=0,r._maxZoom$1=0,r.get_tileServerCount=function(){return this._numberOfTileServers$1},r._subdomains$1=null,r.get_hasZoomRange=function(){return this._hasZoomRange$1},r.set_hasZoomRange=function(n){return this._hasZoomRange$1=n,n},r.get_minZoom=function(){return this._minZoom$1},r.set_minZoom=function(n){return this._minZoom$1=n,n},r.get_maxZoom=function(){return this._maxZoom$1},r.set_maxZoom=function(n){return this._maxZoom$1=n,n},r.getTileUri=function(n){return this.get_hasZoomRange()&&(n.levelOfDetail<this.get_minZoom()||n.levelOfDetail>this.get_maxZoom())?null:this.getTileUriFromFormat(n,this.get_uriFormat())},r.getTileUriFromFormat=function(n,t){var u=null,i=it.fromTileId(n),r;return this.get_numberOfTileServers()===4?(r=i.charAt(i.length-1),u=t.replace("{{quadkey}}",i).replace("{{subdomain}}",(r%this.get_tileServerCount()).toString())):(r=this.tileCoordinatesToSubdomainNumber(n.x,n.y),u=t.replace("{{quadkey}}",i).replace("{{subdomain}}",r)),u},r.tileCoordinatesToSubdomainNumber=function(t,i){return this._subdomains$1[t%n.MercatorModeTileSource._xLength$1][i%n.MercatorModeTileSource._yLength$1]},r.get_uriFormat=function(){return this._format$1},r.set_uriFormat=function(n){return this._format$1=n,n},r.get_numberOfTileServers=function(){return this._numberOfTileServers$1},r.set_numberOfTileServers=function(n){return this._numberOfTileServers$1=n,n},p=n.MercatorModeTileSource,p._defaultTileSize$1=256,p._xLength$1=0,p._yLength$1=0,n.MapCruncherTileSource=function(t,i,r){n.MercatorModeTileSource.apply(this,[t]),this._bounds$2=i,this._lodRange$2=r,this.set_hasZoomRange(!1)},n.MapCruncherTileSource.prototype=new n.MercatorModeTileSource(""),c=n.MapCruncherTileSource.prototype,c._bounds$2=null,c._lodRange$2=null,c.getTileUri=function(t){var i="";return this._tileIsInBounds$2(t.x,t.y,t.levelOfDetail)&&(i=n.MercatorModeTileSource.prototype.getTileUri.apply(this,[t])),i},c._tileIsInBounds$2=function(t,i,r){if(!this._bounds$2)return!0;if(this._lodRange$2)if(!(this._lodRange$2.get_from()<=r&&this._lodRange$2.get_to()>=r))return!1;var u=n.TileSystem._tileXYToPixelXY(t,i),f=n.$create_PointD(u.x+255,u.y+255),s=n.TileSystem.pixelXYToLatLong(u.x,u.y,r),o=n.TileSystem.pixelXYToLatLong(f.x,f.y,r),e=b.fromCorners(s,o);return e.intersects(this._bounds$2)},n.MetadataRequest=function(n){n.timeout||(n.timeout=6e3),n.metadataUriFormat||(n.metadataUriFormat="http://bing.com/maps/VenueMapMetadata.ashx?id={0}"),this._options=n},n.MetadataRequest.prototype={options:function(){return this._options},metadata:function(){return this._data},timedOut:function(){return this._timeout},execute:function(){var t=this._options.metadataUriFormat.replace("{0}",this._options.venueMapId);w.useXHR||(t+="&jsonp=microsoftMapsNetworkCallback&jsonso={jsono}"),v.getObjectAsync(t,n.bind(this,this._onWebRequestCompleted),null,this._options.timeout)},_onWebRequestCompleted:function(n,t){this._timeout=!t.success;if(t.success&&n)try{this._data=n}catch(i){}else this._data=null;this._options.callback&&this._options.callback(this)}},n.$create_PointD=function(n,t){var i={};return i.x=n?n:0,i.y=t?t:0,i},n.ScriptExt2=function(){},n.ScriptExt2.measure=function(t){var i,r;if(!t)return n.$create_Size(0,0);i=n.$create_Size(t.offsetWidth,t.offsetHeight);if(!i.width&&!i.height){var e=t.style.visibility,f=t.style.position,o=t.style.top,u=t.style.left;l(t).set_style("visibility","hidden").set_style("position","absolute").set_style("top","-1000px").set_style("left","-1000px"),r=!1,t.offsetParent||(document.body.appendChild(t),r=!0),i=n.$create_Size(t.offsetWidth,t.offsetHeight),r&&document.body.removeChild(t),l(t).set_style("visibility",e).set_style("position",f).set_style("top",o).set_style("left",u)}return i},n.$create_Size=function(n,t){var i={};return i.width=n?n:0,i.height=t?t:0,i},n.TileSystem=function(){},f=n.TileSystem,f._clip=function(n,t,i){return Math.min(Math.max(n,t),i)},f._mapSize=function(n){return 256<<n},f.pixelXYToLatLong=function(t,i,r){var u=n.TileSystem._mapSize(r),o=n.TileSystem._clip(t,0,u-1)/u-.5,f=.5-n.TileSystem._clip(i,0,u-1)/u;return new e(90-360*Math.atan(Math.exp(-f*2*Math.PI))/Math.PI,360*o)},f._tileXYToPixelXY=function(t,i){return n.$create_PointD(t*256,i*256)},f._earthRadius=6378137,f._minLatitude=-85.05112878,f._maxLatitude=85.05112878,f._minLongitude=-180,f._maxLongitude=180,n.ToolTipHelper=function(t){var r=t,u=0,i=document.createElement("div");i.style.cssText="position:absolute;display:block;visibility:hidden;border:solid 1px black;padding:4px;background-color:#FFFFE0;z-index:20;white-space:nowrap;font-family:sans-serif",r.get_MapContainer().appendChild(i);var f=20,o=function(n){var i=r.GetMapWidth(),t=n+f;return t<0&&(t=0),t+u>i&&(t-=t+u-i),t},e=function(n){var i=r.GetMapHeight(),t=n+f;return t<0?t=0:t+40>i&&(t-=t+40-i),t};this.turnOff=function(){i.style.visibility="hidden"},this.turnOn=function(){i.innerHTML&&(i.style.visibility="visible")},this.setPosition=function(n,t){i.style.top=e(n)+"px",i.style.left=o(t)+"px"},this.updateContent=function(t){t?(i.style.zIndex=1e4,i.innerHTML=t,u=n.ScriptExt2.measure(i).width+10):i.innerHTML=""}},n.VEMapStyle={auto:"u",road:"r",aerial:"a",hybrid:"h",birdsEye:"o",birdsEyeHybrid:"b",collinsBart:"c",ordnanceSurvey:"s"},n.validateMetadata=function(n){var u,r,f,i,t;if(n&&n.Floors&&n.DefaultFloor&&n.Footprint&&n.MapId&&n.Floors[n.DefaultFloor]){u=n.Floors;for(r in u){f={key:r,value:u[r]},i=f.value;if(i&&i.Name&&i.Transform&&i.LodRange&&n.Floors[i.Name]){if(i.Primitives)for(t=0;t<i.Primitives.length;t++){if(!i.Primitives[t].X||!i.Primitives[t].Y||i.Primitives[t].X.length<3||i.Primitives[t].Y.length<3||i.Primitives[t].X.length!==i.Primitives[t].Y.length)return!1;if(i.Primitives[t].YpId&&!i.Primitives[t].Name)return!1}}else return!1}if(n.Footprint.Polygons&&n.Footprint.Polygons.length){for(t=0;t<n.Footprint.Polygons.length;t++)if(!n.Footprint.Polygons[t].X||!n.Footprint.Polygons[t].Y||n.Footprint.Polygons[t].X.length<3||n.Footprint.Polygons[t].Y.length<3||n.Footprint.Polygons[t].X.length!==n.Footprint.Polygons[t].Y.length)return!1}else return!1;return!0}return!1},n.VenueMap=function(r){var s=this,o,u,v,h,p,f,c,a,l,y;this._showFlag=!1,this._map=r.map,this._options=r,o=this._map.getComponent("venueMaps"),o||(o={activeVenueMap:null},this._map.addComponent("venueMaps",o)),this._venueMapsMapComponent=o,u=r.metadata,v=0,this._mapController=new n.MapController(s._map),this._hashtable={};var w=function(t,i,r,u){var f=new n.LocationPolygon(t,i,r,s._map);u.center=f.center,u.bounds=f.boundingBox,u.optimalZoom=f.optimalZoom,u.locations=f.latLongs},g=function(n,t){var r={},u=n.Polygons,i,t;for(r.polygons=[],i=0;i<u.length;i++)t={},w(u[i].X,u[i].Y,n.Transform,t),r.polygons[i]=t;return r.zoomRange=n.LodRange,r},nt=function(n,t){var r=n,i={};return w(r.X,r.Y,t,i),i.businessId=r.YpId,i.name=r.Name,i.categoryId=r.CatId,i.categoryName=r.CatName,i},d=function(t){var f=t,r={},o,h,u,i,e;r.name=f.Name,r.zoomRange=f.LodRange,r.primitives=[];if(f.Primitives)for(o=f.Primitives,h=f.Transform,u=0;u<o.length;u++)i=nt(o[u],h),i.floor=r,i.id=v.toString(),e=new n.VenueMapPolygon(i,s._mapController),s._hashtable[i.id]=e,i.highlight=e.highlight,i.unhighlight=e.unhighlight,r.primitives[u]=i,++v;return r};this.name=u.Name,this.address=u.Address,this.phoneNumber=u.PhoneNumber,this.id=u.MapId,this.defaultFloor=u.DefaultFloor,this.type=u.MapType,this.floorHeader=u.FloorHeader,this.businessId=u.YpId,this.center=new e(u.CenterLatitude,u.CenterLongitude),this.footprint=g(u.Footprint),this.floors=[],h=0;for(p in u.Floors)u.Floors.hasOwnProperty(p)&&(this.floors[h]=d(u.Floors[p]),++h);delete h,delete v,f=u.TileUriFormat,f||(f=r.tileUriFormat,f||(f="http://embedmap.blob.core.windows.net/{0}/{1}/{{quadkey}}.png")),this._tileUriFormat=f,this._mapStyleChangedHandler=null,this._floorChangedHandler=null,this._closeHandler=null,this._footprintBoundingBox=null,this._tileLayer=null,this._footprint=null,this._polygonsOnCurrentFloor=null,this._currentFloor=null,this._breadcrumbManager=null,this._isDisposed=!1,this._halfImmersed=new n.DoubleRange(13,15);var tt=18,it=16,b=17;for(this._fractionForBestVenueMapView=.9,this._polygonEvents=[],c=[],a=0;a<this.footprint.polygons.length;a++)c=c.concat(this.footprint.polygons[a].locations);l=i.LocationRect.fromLocations(c),this._footprintBoundingBox=l,y=n.VenueMapHelper.optimalZoom(s._map,l,.8),this._footprint=new n.VenueMapFootprint(this._mapController,this.footprint,k.replace("{0}",u.Name)),this._footprintClickedHandler=t.addHandler(this._footprint,"click",n.bind(this,this.onFootprintClicked)),this._fullyImmersedView=n.$create_ViewSpecification(l.center,Math.max(Math.min(y,tt),it)),this._halfImmersedView=n.$create_ViewSpecification(this._fullyImmersedView.center,Math.max(Math.min(y-1,this._halfImmersed.get_from()),0)),this.bestMapView=this._fullyImmersedView.zoom<b?n.$create_ViewSpecification(this._fullyImmersedView.center,b):this._fullyImmersedView},n.VenueMap.prototype={_captureMapEvents:function(){this._viewChangedHandler||(this._viewChangedHandler=t.addHandler(this._mapController,"viewchanged",n.bind(this,this._onViewChanged))),this._mapStyleChangedHandler||(this._mapStyleChangedHandler=t.addHandler(this._mapController,"stylechanged",n.bind(this,this.map_StyleChanged)))},_uncaptureMapEvents:function(){t.removeHandler(this._viewChangedHandler),t.removeHandler(this._mapStyleChangedHandler),delete this._viewChangedHandler,delete this._mapStyleChangedHandler},_detachFromBreadcrumb:function(){this._breadcrumbManager&&(this._breadcrumbManager.hide(),t.removeHandler(this._floorChangedHandler),t.removeHandler(this._closeHandler),this._breadcrumbManager._dispose(),this._breadcrumbManager=null)},_attachToBreadcrumb:function(){var u,i,f,r;if(!this._breadcrumbManager){for(u=[],i=0;i<this.floors.length;i++)f=this.floors[i],u.push(f.name);this._breadcrumbManager=new n.BreadcrumbManager(this._mapController,this.name,u,this._fullyImmersedView.center,this._fullyImmersedView.zoom,this._footprintBoundingBox,new n.DoubleRange(this._halfImmersedView.zoom,this._fullyImmersedView.zoom-1)),r=this._currentFloor,r&&this._breadcrumbManager.set__floor(r.name),this._floorChangedHandler=t.addHandler(this._breadcrumbManager,"floorchanged",n.bind(this,this._onFloorChanged)),this._closeHandler=t.addHandler(this._breadcrumbManager,"closed",n.bind(this,this._onCloseButtonClicked)),this._breadcrumbManager.show()}},dispose:function(){if(this._isDisposed)return;this._hideEro();var n=this.id;this._hashtable=null,this._currentFloor=null,this._clearPois(),this._tileLayer&&(this._tileLayer.dispose(),this._tileLayer=null),this._footprint&&(t.removeHandler(this._footprintClickedHandler),this._footprint.dispose(),this._footprint=null),this._mapController&&(this._mapController.dispose(),this._mapController=null),this._isDisposed=!0,this._showFlag&&this._setActiveVenueMap(null)},_setActiveVenueMap:function(n){var i=this._venueMapsMapComponent.activeVenueMap;i!==n&&(this._venueMapsMapComponent.activeVenueMap=n,i&&i._detachFromBreadcrumb(),n&&n._attachToBreadcrumb(),t.invoke(this._map,"activevenuemapchanged",{oldVenueMap:i,newVenueMap:n}))},_getActiveVenueMap:function(){return this._venueMapsMapComponent.activeVenueMap},_onViewChanged:function(){this._updateVisibility()},highlight:function(n){if(this._hashtable&&this._hashtable[n]){var t=this._hashtable[n];t.highlight()}},unhighlight:function(n){if(this._hashtable&&this._hashtable[n]){var t=this._hashtable[n];t.unhighlight()}},map_StyleChanged:function(){this._updateVisibility()},_onFloorChanged:function(n){var i=n,t=i.newItem;t!==this._currentFloor.name&&(this._setFloor(t),this._updateVisibility())},supportedProjections:["r","a","h"],_changeMapProjectionSoThatVenueMapCanBeDisplayed:function(){var n=this._mapController.GetMapStyle(),t;n!=="r"&&n!=="a"&&n!=="h"&&(t="r",n==="o"?t="a":n==="b"&&(t="h"),this._mapController.SetMapStyle(t))},setActiveFloor:function(n){this._setFloor(n),this._updateVisibility();var t=this._currentFloor;t&&this._breadcrumbManager&&this._breadcrumbManager.set__floor(t.name)},getActiveFloor:function(){var t=this._currentFloor,n=null;return t&&(n=t.name),n},_getFloorWithGivenName:function(n){for(var r=n.toLowerCase(),i,t=0;t<this.floors.length;t++){i=this.floors[t];if(i.name.toLowerCase()===r)return i}throw Error.argument("floor","the given floor "+n+" does not exist");},_setFloor:function(r){var l,c,u,h,s,e,o,f;if(!r)throw Error.argumentNull("floor");if(this._currentFloor&&this._currentFloor.name===r)return;l=this._currentFloor&&this._currentFloor.name,this._currentFloor=this._getFloorWithGivenName(r),this._hideEro(),this._clearPois(),this._tileLayer&&this._tileLayer.dispose(),c=this._tileUriFormat.replace("{0}",this.id).replace("{1}",this._currentFloor.name),u=this._options.metadata;if(u.MaxLatitude){var v=u.MaxLatitude,a=u.MinLatitude,y=u.MinLongitude,p=u.MaxLongitude;h=i.LocationRect.fromEdges(v,y,a,p)}else h=this._footprintBoundingBox;this._tileLayer=new n.VenueMapTileLayer("VenueMapTileLayer",this._mapController,c,h,new n.DoubleRange(this._currentFloor.zoomRange[0],this._currentFloor.zoomRange[1])),s=[];if(w.isShapeEventsSupported())for(e=0;e<this._currentFloor.primitives.length;e++)o=this._currentFloor.primitives[e],o.name&&(f=this._hashtable[o.id],this._polygonEvents.push(t.addHandler(f,"click",n.bind(this,this.onPolygonClick))),this._polygonEvents.push(t.addHandler(f,"mouseover",n.bind(this,this.onPolygonMouseOver))),this._polygonEvents.push(t.addHandler(f,"mouseout",n.bind(this,this.onPolygonMouseOut))),s.push(f));this._polygonsOnCurrentFloor=s,t.invoke(this,"floorchanged",{oldFloor:l,newFloor:r})},_onCloseButtonClicked:function(){t.invoke(this,"close",null),this.dispose()},onFootprintClicked:function(n){this._mapController.SetView(this._fullyImmersedView,!0),t.invoke(this,"footprintclick",n)},_eroInfobox:null,_pendingPrimitive:null,_eroJsonCache:{},_eroRequestQue:{},_eroCallback:function(n){if(n&&n.SearchResponse&&n.SearchResponse.Query&&n.SearchResponse.Query.SearchTerms)var t=n.SearchResponse.Query.SearchTerms;else return;delete this._eroRequestQue[t],this._eroJsonCache[t]=n,this._showPendingEro()},_showPendingEro:function(){var t=this._pendingPrimitive,f,u,i,n,r;if(!t)return;f=t.businessId,u=!0;if(f){i=this._eroJsonCache[f];if(!i)return;i.SearchResponse&&i.SearchResponse.Phonebook&&i.SearchResponse.Phonebook.Results&&(n=i.SearchResponse.Phonebook.Results[0],n&&(u=!1))}u?r={id:t.id,visible:!0,showPointer:!0,title:t.name,description:"No information available."}:(r={id:t.id,visible:!0,showPointer:!0,title:t.name,description:n.Address+", "+n.City+", "+n.StateOrProvince+" "+n.PostalCode+"<br>"+n.PhoneNumber},n.DisplayUrl&&(r.titleClickHandler=function(){window.open(n.DisplayUrl+"&form=VMBERO","_blank")})),this._showEro(t.center,r),this._pendingPrimitive=null},_hideEro:function(){this._eroInfobox&&(this._map.entities.remove(this._eroInfobox),this._eroInfobox=null)},_showEro:function(n,t){var i=this._eroInfobox;i&&i.getId()===t.id?this._eroInfobox.setOptions({visible:!0}):(this._hideEro(),this._eroInfobox=new g(n,t),this._map.entities.push(this._eroInfobox))},_loadEro:function(n){var t=n.businessId,f,u;if(t){f=this._eroJsonCache[t];if(f)this._showPendingEro();else if(!this._eroRequestQue[t]){var e=i.Globals.venueMapsEroServiceAppId,s=i.Globals.venueMapsEroServiceUrl,r="microsoftMapsVenueMapsEroCallback",o=this;window[r]=function(n){o._eroCallback(n)},u=s.replace("{ypid}",t).replace("{query}",t).replace("{appid}",e).replace("{latitude}",n.center.latitude).replace("{longitude}",n.center.longitude).replace("{jsonp}",r).replace("{jsonso}",t),this._eroRequestQue[t]=!0,w.useXHR?v.getObjectAsyncCacheFriendly(u,window[r],t):v.getObjectAsyncCacheFriendly(u)}}else this._showPendingEro()},onPolygonClick:function(n){t.hasHandler(this,"click")||(this._pendingPrimitive=n,this._loadEro(n)),t.invoke(this,"click",n)},onPolygonMouseOver:function(n){t.hasHandler(this,"click")||this._loadEro(n),t.hasHandler(this,"mouseover")||this.highlight(n.id),t.invoke(this,"mouseover",n)},onPolygonMouseOut:function(n){t.hasHandler(this,"mouseout")||this.unhighlight(n.id),t.invoke(this,"mouseout",n)},show:function(){this._showFlag||(this._showFlag=!0,this._changeMapProjectionSoThatVenueMapCanBeDisplayed(),this._currentFloor||this.setActiveFloor(this.defaultFloor),this._updateVisibility(),this._captureMapEvents()),this._setActiveVenueMap(this)},hide:function(){this._showFlag&&(this._showFlag=!1,this._hideEro(),this._updateVisibility(),this._uncaptureMapEvents(),this._setActiveVenueMap(null))},_activeView:n.VenueMapConstants.viewHidden,getActiveView:function(){return this._activeView},_updateVisibility:function(){var f=this._mapController.GetTargetZoomLevel(),r,i,u;if(f>=this._halfImmersedView.zoom&&this._mapController.IsMercator()&&this._showFlag)if(f<this._fullyImmersedView.zoom){this._tileLayer&&this._tileLayer.hide(),this._footprint&&this._footprint.show();if(this._polygonsOnCurrentFloor)for(i=0;i<this._polygonsOnCurrentFloor.length;i++)this._polygonsOnCurrentFloor[i].hide();this._hideEro(),r=n.VenueMapConstants.viewHalfImmersed}else{this._tileLayer&&this._tileLayer.show(),this._footprint&&this._footprint.hide();if(this._polygonsOnCurrentFloor)for(i=0;i<this._polygonsOnCurrentFloor.length;i++)this._polygonsOnCurrentFloor[i].show();r=n.VenueMapConstants.viewFullyImmersed}else{this._tileLayer&&this._tileLayer.hide(),this._footprint&&this._footprint.hide();if(this._polygonsOnCurrentFloor)for(i=0;i<this._polygonsOnCurrentFloor.length;i++)this._polygonsOnCurrentFloor[i].hide();this._hideEro(),r=n.VenueMapConstants.viewHidden}r!==this._activeView&&(u=this._activeView,this._activeView=r,t.invoke(this,"viewchanged",{newView:r,oldView:u}))},_clearPois:function(){for(var n=0;n<this._polygonEvents.length;n++)t.removeHandler(this._polygonEvents[n]);this._polygonEvents=[];if(this._polygonsOnCurrentFloor)for(n=0;n<this._polygonsOnCurrentFloor.length;n++)this._polygonsOnCurrentFloor[n].hide();this._polygonsOnCurrentFloor=null}},n.VenueMapFootprint=function(i,r,u){function ut(){t.removeHandler(e),e=null,l(i.get_MapContainer()).set_style("cursor",s);for(var u=0;u<f.length;u++)n.VenueMapHelper._setProperties(f[u],b,g,d);h.turnOff()}function nt(r){var o,u;for(h.turnOn(),e=t.addHandler(i.getMap(),"mousemove",tt),o=r,it(),u=0;u<f.length;u++)n.VenueMapHelper._setProperties(f[u],ft,st,et)}function it(){var n=l(i.get_MapContainer());s=n.get_style("cursor"),s==="pointer"&&(s="default"),n.set_style("cursor","pointer")}function tt(n){var t=i.getMap(),u=t.getWidth()/2+n.getX(),r=t.getHeight()/2+n.getY();h.setPosition(r,u)}function rt(n){t.invoke(ot,"click",n)}for(var ot=this,b=n.VenueMapConstants._strokeWeightNormal,ft=n.VenueMapConstants._strokeWeightHighlighted,g=n.VenueMapFootprint.footprintStrokeNormal,st=n.VenueMapFootprint.footprintStrokeHighlighted,d=n.VenueMapFootprint.footprintFillNormal,et=n.VenueMapFootprint.footprintFillHighlighted,v=r.polygons,o=v.length,y=new Array(o),s="default",f=new Array(o),c,e,a=0;a<o;a++)y[a]=n.CosmosAnalytics.guid();try{s=l(i.get_MapContainer()).get_style("cursor")}catch(ht){s="default"}var w=new Array(o),k=new Array(o),p=new Array(o),h=new n.ToolTipHelper(i);h.updateContent(u),c=!1,e=null,this.dispose=function(){this.hide()},this.show=function(){if(!c){for(var n=0;n<v.length;n++)f[n]=i.AddPolygon(y[n],v[n].locations,b,g,d),w[n]=t.addHandler(f[n],"mouseover",nt),k[n]=t.addHandler(f[n],"mouseout",ut),p[n]=t.addHandler(f[n],"click",rt);c=!0}},this.hide=function(){if(c){for(var n=0;n<v.length;n++)t.removeHandler(k[n]),t.removeHandler(w[n]),t.removeHandler(p[n]),i.RemoveShapeById(y[n]);e&&(t.removeHandler(e),e=null),h.turnOff()}c=!1}},n.VenueMapFootprint.footprintFillNormal=new o(51,0,0,255),n.VenueMapFootprint.footprintFillHighlighted=new o(51,0,0,255),n.VenueMapFootprint.footprintStrokeNormal=new o(154,255,255,255),n.VenueMapFootprint.footprintStrokeHighlighted=new o(255,0,0,0),n.VenueMapFootprint._lineStyle="solid",n.VenueMapFootprint._lineJoinMode="round",n.VenueMapHelper=function(){},y=n.VenueMapHelper,y._addDivElement=function(n,t,i){var r=document.createElement("div");return r.id=n,r.className=t,i&&i.appendChild(r),r},y._setProperties=function(n,t,i,r){n&&n.setOptions({strokeColor:i,strokeWeight:t,fillColor:r})},y.optimalZoom=function(n,t,i){var p=t.getNorth(),w=t.getSouth(),v=t.getEast(),y=t.getWest(),s=n.getRootElement().clientWidth,o=n.getRootElement().clientHeight,r=n.getTargetZoom(),u=n.tryLocationToPixel(new e(p,y)),f=n.tryLocationToPixel(new e(w,v));if(u&&f&&s&&o&&r){var c=Math.abs(u.y-f.y),h=Math.abs(f.x-u.x),a=r+Math.log(i*o/c)*Math.LOG2E,l=r+Math.log(i*s/h)*Math.LOG2E;return Math.round(Math.min(a,l))}return 17},h={},i.VenueMaps=h,h.VenueMapFactory=function(n){this._map=n;var t=n.getComponent("venueMaps");t||(t={activeVenueMap:null},n.addComponent("venueMaps",t)),this._venueMapsMapComponent=t},h.VenueMapFactory.prototype.getActiveVenueMap=function(){return this._venueMapsMapComponent.activeVenueMap},h.VenueMapFactory.prototype.create=function(t){var s=function(n,t){return(t==="prod"||t==="dev"||t==="staging")&&(n=n+"&venuemapenv="+t),n},h=function(n,t){t&&(t==="prod"||t==="dev"||t==="staging")||(t="default");var r=new RegExp(t+"=([^;]*)"),i=n.match(r);return i&&(i=i[1]),i||(i=n),i},o=function(n){callback=t.success,callback&&callback(n,t)},r=function(n){callback=t.error,callback&&callback(n,t)},c=this._map,u=t.metadataUriFormat,f,e;u||(u=s(i.Globals.venueMapsMetadataJsonpUrl,t.environment)),f=h(i.Globals.venueMapsTileUrl,t.environment),e=new n.MetadataRequest({venueMapId:t.venueMapId,metadataUriFormat:u,timeout:1e4,callback:function(i){var h=t.venueMapId,s=i.options().venueMapId,u,e;h===s&&(u=i.metadata(),e=i.timedOut(),e?r(3):u?n.validateMetadata(u)?o(new n.VenueMap({map:c,metadata:u,tileUriFormat:f})):r(2):r(1))}}),e.execute()},h.VenueMapFactory.prototype.getNearbyVenues=function(t){var r=t.callback,u=t.location,f=t.radius;r&&(u&&f?this._map.getCredentials(function(e){if(e){var o=i.Globals.venueMapsNearbyUrl.replace("{location}",u.latitude+","+u.longitude).replace("{radius}",f).replace("{credentials}",e);v.getObjectAsync(o,function(i){n._callAsync(r,i,t)})}else n._callAsync(r,null,t)}):n._callAsync(r,null,t))},n.VenueMapPolygon=function(i,r){function c(){e&&(t.removeHandler(e),e=null),o&&(t.removeHandler(o),o=null)}function ht(){c(),e=t.addHandler(r.getMap(),"mousemove",et),o=t.addHandler(r.getMap(),"mouseup",ot)}function et(){c()}function ot(){c(),t.invoke(k,"click",l)}var k=this,y=n.VenueMapConstants._strokeWeightNormal,d=n.VenueMapConstants._strokeWeightHighlighted,p=n.VenueMapPolygon.polygonStrokeNormal,it=n.VenueMapPolygon.polygonStrokeHighlighted,v=n.VenueMapPolygon.polygonFillNormal,rt=n.VenueMapPolygon.polygonFillHighlighted,w=y,b=p,h=v,f=!1,s=i.id,a=r,l=i,st=i.locations,u=null,ut=null,ft=null,tt=null,e=null,o=null,nt,g;a.RemoveShapeById(s),nt=function(){t.invoke(k,"mouseout",l)},g=function(){t.invoke(k,"mouseover",l)},this.show=function(){f||(u=a.AddPolygon(s,st,w,b,h),ut=t.addHandler(u,"mouseover",g),ft=t.addHandler(u,"mouseout",nt),tt=t.addHandler(u,"mousedown",ht),f=!0)},this.hide=function(){f&&(a.RemoveShapeById(s),t.removeHandler(ut),t.removeHandler(ft),t.removeHandler(tt),f=!1)},this.highlight=function(){w=d,b=it,h=rt,u&&n.VenueMapHelper._setProperties(u,d,it,rt)},this.unhighlight=function(){w=y,b=p,h=v,u&&n.VenueMapHelper._setProperties(u,y,p,v)}},n.VenueMapPolygon.polygonStrokeNormal=new o(0,158,185,184),n.VenueMapPolygon.polygonStrokeHighlighted=new o(255,0,0,0),n.VenueMapPolygon.polygonFillNormal=new o(0,191,215,217),n.VenueMapPolygon.polygonFillHighlighted=new o(0,236,246,247),n.VenueMapPolygon._lineStyle="solid",n.VenueMapPolygon._lineJoinMode="round",n.VenueMapTileLayer=function(t,i,r,u,f){this._map=i,this._layerId=t,this._tileSource=new n.MapCruncherTileSource(r,u,f),this._layer=new rt({zIndex:n.VenueMapTileLayer.tileLayerZIndex,mercator:this._tileSource.createTileSource()})},n.VenueMapTileLayer.prototype={show:function(){this._added||(this._map.AddLayer(this._layerId,this._layer),this._added=!0)},hide:function(){this._added&&(this._map.RemoveLayer(this._layerId),this._added=!1)},dispose:function(){this.hide()}},n.VenueMapTileLayer.tileLayerZIndex=2,n.$create_ViewSpecification=function(n,t,i){var r={};return r.center=n,r.zoom=t,r.animate=i,r},n.ViewSpecificationHelper={populateViewForStyle:function(t,i){switch(i){case n.VEMapStyle.road:default:t.mapTypeId=u.road;break;case n.VEMapStyle.auto:t.mapTypeId=u.auto;break;case n.VEMapStyle.aerial:t.mapTypeId=u.aerial,t.labelOverlay=s.hidden;break;case n.VEMapStyle.hybrid:t.mapTypeId=u.aerial,t.labelOverlay=s.visible;break;case n.VEMapStyle.birdsEye:t.mapTypeId=u.birdseye,t.labelOverlay=s.hidden;break;case n.VEMapStyle.birdsEyeHybrid:t.mapTypeId=u.birdseye,t.labelOverlay=s.visible;break;case n.VEMapStyle.collinsBart:t.mapTypeId=u.collinsBart;break;case n.VEMapStyle.ordnanceSurvey:t.mapTypeId=u.ordnanceSurvey}},getMapStyle:function(t,i){var r="\x00";switch(t){case u.road:default:r=n.VEMapStyle.road;break;case u.auto:r=n.VEMapStyle.auto;break;case u.aerial:r=i===s.visible?n.VEMapStyle.hybrid:n.VEMapStyle.aerial;break;case u.birdseye:r=i===s.visible?n.VEMapStyle.birdsEyeHybrid:n.VEMapStyle.birdsEye;break;case u.collinsBart:r=n.VEMapStyle.collinsBart;break;case u.ordnanceSurvey:r=n.VEMapStyle.ordnanceSurvey}return r}},delete window.Microsoft.Maps.initVenueMapsCode,a.Dynamic&&a.Dynamic.done("Microsoft.Maps.VenueMaps"),d.end("Module initialized","Microsoft.Maps.VenueMaps",{module:"VenueMaps"})},Microsoft.Maps.Map&&Microsoft.Maps.initVenueMapsCode&&window.Microsoft.Maps.initVenueMapsCode()