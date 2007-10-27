function _binfo(b)
{
	var ne = b.getSouthWest();
	var sw = b.getNorthEast();
	var w = (ne.lng() - sw.lng())*1000;
	var h = (ne.lat() - sw.lat())*1000;
	var ar = w*h;

	return 'w: '+w+'.  h: '+h+'.  area: '+ar;
}

function EditableRect(m, b) {
	var markers = {};
	var rbounds;
	var rpoly = null;
	var map = m;

	var squareIcon = new GIcon();
	squareIcon.image = 'http://localhost/gmaps/jslib/images/redsquare.png';
	squareIcon.shadow = null;
	squareIcon.iconSize = new GSize(10, 10);
	squareIcon.iconAnchor = new GPoint(5, 5);

	var dmarker_opts = {
		draggable:true,
		clickable:false,
		icon:squareIcon,
	}

	function rect_poly(p1, p2) {
		var p12 = new GLatLng(p1.lat(), p2.lng());
		var p21 = new GLatLng(p2.lat(), p1.lng());

		return new GPolygon([p1, p12, p2, p21, p1], "#222222", 1, 1, "#0000ff", 0.2);
	}

	function show_sizes(ctrl)
	{
		ctrl.value = _binfo(rbounds);
	}

	function redraw_rect(b)
	{
		if (rpoly) {
			map.removeOverlay(rpoly);
			delete rpoly;
		}
		rpoly = rect_poly(b.getSouthWest(), b.getNorthEast());
		map.addOverlay(rpoly);
	}

	function redraw_all()
	{
		var sw = rbounds.getSouthWest();
		var ne = rbounds.getNorthEast();

		markers.msw.setLatLng(sw);
		markers.mne.setLatLng(ne);
		markers.mnw.setLatLng(new GLatLng(ne.lat(), sw.lng()));
		markers.mse.setLatLng(new GLatLng(sw.lat(), ne.lng()));

		redraw_rect(rbounds);

		//TODO: resize event
		//get_counts();
		//show_sizes();
	}

	function change(b) {
		rbounds = b;
		redraw_all();
	}

	function dmarker(point, corner)
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

		/*GEvent.addListener(m, "drag",
			function () {
				redraw_rect(newBounds(m));
			});*/
		GEvent.addListener(m, "dragend",
			function () {
				change(newBounds(m));
			});
		return m;
	}

	rbounds = b;

	// dummy point. the markers will be moved on redraw_all()
	var p = b.getSouthWest();

	markers.mne = dmarker(p, "ne");
	markers.mnw = dmarker(p, "nw");
	markers.msw = dmarker(p, "sw");
	markers.mse = dmarker(p, "se");

	redraw_all();

	this.change = change;
}

