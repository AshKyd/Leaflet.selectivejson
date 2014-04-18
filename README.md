Leaflet.selectivejson
=====================

Plugin to selectively display points from a GeoJSON file on a Leaflet map.

This is useful for displaying large datasets which can be zoomed for more detail.

Source Data
===========
This plugin will show items in order they are specified in the source data. For 
this reason your features sorted by importance descending, otherwise the
results may not be excellent.

If you wish to display multiple datasets, you should merge them into the one
GeoJSON file prior to creating a new SelectiveJSON object, otherwise the layers
will act independently.

Options
=======

distance
--------
Minimum distance between points. This is calculated as the distance in metres
from the top left of the viewport to the bottom right of the vewport, divided by
this value.

Set to a lower value to increase the distance between points or a higher value
to show points tighter.

displayCondition(latlng, properties)
----------------
A function to check whether this item should be displayed.

Is passed two parameters

* latlng - The L.LatLng object for this point.
* properties - The properties on this GeoJSON point.

pointToLayer
------------
See [GeoJSON.pointToLayer](http://leafletjs.com/reference.html#geojson-pointtolayer).

Sample
======
The following sample code shows all points with the isImportant property set to
true, as well as any other points that will fit within 10% of the size of the
viewport.

    // Selective cities.
    $.getJSON(cities,function(cities){
        L.selectiveJSON(cities,{
            distance: 10,
            displayCondition: function(latlng, properties){
                return properties.isImportant;
            },
            pointToLayer: function(latlng, properties){
                return L.circleMarker(latlng,{
                    radius: 2.5,
                    fillColor: 'black',
                    fillOpacity: 1,
                    stroke: false
                }).bindLabel(properties.name, { noHide: true });
            }
        }).addTo(map);
    });