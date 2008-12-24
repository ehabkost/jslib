/* Copyright (c) 2008 Eduardo Pereira Habkost
 * 
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */


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
	var e = new EditableRect(map, test_bounds(), "testrect", function (b) {
		var b = e.bounds();
		document.getElementById("statusbar").innerHTML = _binfo(b);
	});
	return false;
}

function add_dom()
{
	var o = new DomOverlay(map.getBounds(), document.getElementById("overlaydiv"), G_MAP_MAP_PANE);
	map.addOverlay(o);
	return false;
}
