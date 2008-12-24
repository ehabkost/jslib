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
