/**
 * TileViewer
 *
 * @author     André Fiedler <kontakt at visualdrugs dot net>
 * @author     inspired by many other javascript Wysiwyg Editors
 * @link       http://github.com/SunboX/TileViewer/tree
 * @copyright  2009 André Fiedler.
 * @license    MIT License
 * @version    1.0.1
 */

var TileViewer = new Class(
{
    Implements: [Options, Events],
	
    options:
	{
        dragable: true,
		assets_directory: '.'
    },
	
    initialize: function(tiles, image, options)
	{
		this.tiles = $$(tiles) || [];
		this.image = image || '#';
		this.boundfnc = [];
		
		this.bg_coords = {x: 0, y: 0};
		
        this.setOptions(options);
		
		this.tiles.each(function(el)
		{
			el.setStyles(
			{
				'background-image': 'url(' + image + ')',
				'background-repeat': 'no-repeat'
			});
			if(this.options.dragable)
			{
				el.setStyle('cursor', 'url(' + this.options.assets_directory + '/openhand.cur), move');
			
				el.addEvents(
				{
					'mousedown': this.start.bind(this),
					'mouseup': this.stop.bind(this),
					'mouseleave': this.stop.bind(this)
				});
			}
		}, this);
    },
	
	start: function(e)
	{
		e.stop();
		
		this.coords = e.page;
		
		this.tiles.each(function(el, i)
		{
			this.boundfnc[i] = this.set.bind(this);
			el.addEvent('mousemove', this.boundfnc[i]);
			el.setStyle('cursor', 'url(' + this.options.assets_directory + '/closedhand.cur), move');
		}, this);
        this.fireEvent('start');
	},
	
	stop: function(e)
	{
		this.tiles.each(function(el, i)
		{
			el.removeEvent('mousemove', this.boundfnc[i]);
			el.setStyle('cursor', 'url(' + this.options.assets_directory + '/openhand.cur), move');
		}, this);
        this.fireEvent('complete');
	},
	
	set: function(e)
	{
		e.stop();
		
		this.bg_coords.x -= this.coords.x - e.page.x;
		this.bg_coords.y -= this.coords.y - e.page.y;
		
		this.coords = e.page;
		
		this.tiles.setStyle('background-position', this.bg_coords.x + 'px ' + this.bg_coords.y + 'px');
		
        this.fireEvent('change');
	},
	
	getPosition: function()
	{
		return this.bg_coords;
	}
});