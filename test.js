
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

function add_rect()
{
	log("click!\n");
	var e = new EditableRect(map, map.getBounds());
}
