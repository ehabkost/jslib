function DomOverlay(aBounds, aNode, aPane)
{
	GOverlay.call(this);
	var node = aNode.cloneNode(true);
	var pane = aPane;
	var bounds = aBounds;
	var map;

	this.initialize = function(m) {
		map = m;
		map.getPane(pane).appendChild(node);
	}

	this.remove = function() {
		node.parentNode.removeChild(node);
	}

	this.copy = function() {
		return new DomOverlay(node, pane);
	}

	this.redraw = function(force) {
		if (!force) return;

		var p1 = map.fromLatLngToDivPixel(bounds.getSouthWest());
		var p2 = map.fromLatLngToDivPixel(bounds.getNorthEast());

		node.style.position = "absolute";
		node.style.width = Math.abs(p2.x-p1.x)+"px";
		node.style.height = Math.abs(p2.y-p1.y)+"px";
		node.style.left = Math.min(p2.x, p1.x)+"px";
		node.style.top = Math.min(p2.y, p1.y)+"px";
		node.style.display = 'block';
	}

	this.setBounds = function(b) {
		bounds = b;
		this.redraw(true);
	}
}

function DomRectOverlay(bounds, cls, pane)
{
	var div = document.createElement("div");
	div.setAttribute('class', cls);
	DomOverlay.call(this, bounds, div, pane);
}
