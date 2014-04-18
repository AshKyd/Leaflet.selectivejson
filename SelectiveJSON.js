/*
 * Selectively shows GeoJSON points as you zoom in or out.
 */

L.SelectiveJSON = L.FeatureGroup.extend({
	initialize: function (geojson, options) {
		L.setOptions(this, options);

		this._layers = L.layerGroup();

		if (geojson) {
			this.addData(geojson);
		}
	},

	addData: function (geojson) {
		this._geojson = geojson;
	},
	addTo: function(map){
		var _this = this;

		_this.map = map.addLayer(this._layers);

		map.on('zoomend moveend',function(){
			_this._layers.clearLayers();
			_this._showPoints();
		});
		_this._showPoints();
		return this;
	},

	_showPoints: function(){
		var _this, bounds, pointsTotal, minDistance, added, placell;
		_this = this;
		bounds = _this.map.getBounds();
		pointsTotal = 0;
		added = [];

		// Minimum distance points must be apart to be displayed.
		minDistance = L.latLng(bounds.getNorth(),bounds.getEast())
			.distanceTo([bounds.getSouth(),bounds.getWest()]);
		minDistance /= _this.options.distance || 10;

		_this._geojson.features.forEach(function(place){
			placell = L.latLng(place.geometry.coordinates[1],place.geometry.coordinates[0])
			if(!bounds.contains(placell)){
				return;
			}
			if(_this.options.displayCondition && _this.options.displayCondition(place.properties, placell)){
				// continue
			} else if(_this.options.distance == 0){
				return;
			} else{
				for(var i=0; i<added.length; i++){
					if(added[i].distanceTo(placell) < minDistance){
						return;
					}
				}
			}

			if(_this.options.pointToLayer){
				_this._layers.addLayer(_this.options.pointToLayer(place.properties,placell));
			} else {
				_this._layers.addLayer(_this._makePoint(place.properties,placell));
			}
			added.push(placell);
		})
	},

	_makePoint: function(properties, latlng){
		return L.circleMarker(latlng,this.options.style);
	}
});



L.selectiveJSON = function (geojson, options) {
	return new L.SelectiveJSON(geojson, options);
};
