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

	var m1, m2;
	var rbounds;
	var rpoly = null;
	var map = m;

	var dmarker_opts = {
		draggable:true,
		clickable:false,
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

	function redo_rect()
	{
		rbounds = new GLatLngBounds(m1.getLatLng(), m2.getLatLng());

		if (rpoly) {
			map.removeOverlay(rpoly);
			delete rpoly;
		}
		rpoly = rect_poly(m1.getLatLng(), m2.getLatLng());
		map.addOverlay(rpoly);

		//XXX: resize event
		//get_counts();
		//show_sizes();
	}

	this.change = function(b) {
		var sw = b.getSouthWest();
		var ne = b.getNorthEast();

		m1.setLatLng(sw);
		m2.setLatLng(ne);

		redo_rect();
	}

	function dmarker(point)
	{
		var m = new GMarker(point, dmarker_opts);
		map.addOverlay(m);
		GEvent.addListener(m, "dragend", redo_rect);
		return m;
	}

	m1 = dmarker(b.getSouthWest());
	m2 = dmarker(b.getNorthEast());

	this.m1 = m1;
	this.m2 = m2;
	redo_rect();
}

