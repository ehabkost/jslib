
var map;

function log(s)
{
	var w = document.getElementById("log");
	var txt = document.createTextNode(s);
	w.appendChild(txt)
	w.scrollTop = w.scrollHeight;
}

function _do_load()
{
	map = new GMap2(document.getElementById("map"));
	map.addControl(new GLargeMapControl());
	map.addControl(new GMapTypeControl());
	map.addControl(new GScaleControl());
	//map.addControl(new GOverviewMapControl());
	map.setCenter(new GLatLng(-25.437893,-49.237407), 13);
}

function test_load()
{
	if (GBrowserIsCompatible()) {
		_do_load();
		log("map loaded\n");
	}
}

function test_bounds()
{
	var b = map.getBounds();
	var c = b.getCenter();
	var s = (b.getSouthWest().lat()+c.lat())/2;
	var n = (b.getNorthEast().lat()+c.lat())/2;
	var w = (b.getSouthWest().lng()+c.lng())/2;
	var e = (b.getNorthEast().lng()+c.lng())/2;

	return new GLatLngBounds(new GLatLng(s, w), new GLatLng(n, e));
}

function add_rect()
{
	log("click!\n");
	var e = new EditableRect(map, test_bounds(), "testrect");
}

function add_dom()
{
	var o = new DomOverlay(map.getBounds(), document.getElementById("overlaydiv"), G_MAP_MAP_PANE);
	map.addOverlay(o);
}
