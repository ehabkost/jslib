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

function _binfo(b)
{
	var ne = b.getSouthWest();
	var sw = b.getNorthEast();
	var w = (ne.lng() - sw.lng())*1000;
	var h = (ne.lat() - sw.lat())*1000;
	var ar = w*h;

	return 'ne: '+ne+', sw: '+sw+'. w: '+w+'.  h: '+h+'.  area: '+ar;
}

function boundsDict(b)
{
	var d = {};
	d.sw = b.getSouthWest();
	d.ne = b.getNorthEast();

	d.s = d.sw.lat();
	d.n = d.ne.lat();

	d.w = d.sw.lng();
	d.e = d.ne.lng();
	return d;
}

function EditableRect(m, b, cls, resizefunc) {
	var markers = {};
	var rbounds;
	var map = m;
	var that = this;

	var squareIcon = new GIcon();
	squareIcon.image = 'http://localhost/gmaps/jslib/images/redsquare.png';
	squareIcon.shadow = null;
	squareIcon.iconSize = new GSize(10, 10);
	squareIcon.iconAnchor = new GPoint(5, 5);
	squareIcon.maxHeight = 0;

	var rect_overlay = new DomRectOverlay(b, cls, G_MAP_MAP_PANE);
	map.addOverlay(rect_overlay);

	function redraw_rect(b)
	{
		rect_overlay.setBounds(b);
	}

	function for_each_corner(func)
	{
		var lats = ['s', 'n'];
		var lngs = ['w', 'e'];
		arrayForEach(lats, function (lat) {
			arrayForEach(lngs, function (lng) {
				func(lat+lng);
			})
		})
	}

	function move_markers(bd)
	{
		for_each_corner(function (corner) {
			var p = new GLatLng(bd[corner[0]], bd[corner[1]]);
			markers[corner].setLatLng(p);
		});
	}

	function redraw_all()
	{
		var d = boundsDict(rbounds);
		move_markers(d);

		redraw_rect(rbounds);

		//get_counts();
	}

	function change(b) {
		rbounds = b;
		redraw_all();
	}

	var dmarker_opts = {
		draggable:true,
		clickable:false,
		icon:squareIcon,
	}

	function newMarker(point, corner)
	{
		var m = new GMarker(point, dmarker_opts);
		var t = this;
		map.addOverlay(m);
		function newBounds(m)
		{
			var sw = rbounds.getSouthWest();
			var ne = rbounds.getNorthEast();
			var p = m.getLatLng();

			// trick to change the right parameter
			// according to the corner
			var lats = { s: sw.lat(), n:ne.lat() };
			var lngs = { w: sw.lng(), e:ne.lng() };

			// change either n or s
			lats[corner[0]] = p.lat();
			// change either s or w
			lngs[corner[1]] = p.lng();

			sw = new GLatLng(lats.s, lngs.w);
			ne = new GLatLng(lats.n, lngs.e);
			return new GLatLngBounds(sw, ne);
		}

		GEvent.addListener(m, "drag",
			function () {
				var b = newBounds(m);
				var bd = boundsDict(b);
				redraw_rect(b);

				// move the markers, except the one being dragged
				for_each_corner(function (c) {
					if (c == corner) return;

					var p = new GLatLng(bd[c[0]], bd[c[1]]);
					markers[c].setLatLng(p);
				});
			});
		GEvent.addListener(m, "dragend",
			function () {
				change(newBounds(m));
				resizefunc(rbounds);
			});

		markers[corner] = m;
	}

	this.bounds = function () { return rbounds; }

	rbounds = b;

	// dummy point. the markers will be moved on redraw_all()
	var p = b.getSouthWest();

	for_each_corner(function (c) {
		newMarker(p, c);
	});

	redraw_all();

	this.change = change;
}

