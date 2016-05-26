# froogaloopelise
Wrapper to create a standard custom Froogaloop Vimeo Player

## How to use
Download the distribution version of Froogaloopelise and link the necessary files in your `<head>` tag like so:

	<script type="text/javascript" src="../dist/vimeo.froogaloopelise.min.js"></script>
	<link rel="stylesheet" type="text/css" href="../dist/vimeo.froogaloopelise.css" />

You do not have to use the included CSS or icons, and you can replace them. Remove the CSS file to see the naked version of Froogaloopelise: a wrapper with an iframe and an UL.

When included you can call Froogaloopelise from anywhere after including it by simply calling:

    froogaloopelise.init('iframe[src*="vimeo"]');
    
The passed string will be a querySelector to select your element. When called just once the above querySelector will probably be useful. Froogaloopelise will add the latest version of the froogaloop API and then start wrapping the selected element. When the script for the API is loading, the element will remain as is. When multiply calls to Froogaloopelise are called before the script has loaded, they will be added to a queue and executed as soon as the script has been loaded.

You can also provide a callback function as a second parameter which will have one arguments, `wrapper`, which is the domElement that wraps your new froogaloop element. To get access to the froogaloop api itself, you can use `wrapper.froogaloop`:

    froogaloopelise.init('iframe[src*="vimeo"]', function(wrapper){
    	wrapper.froogaloop.api('play'); // Play video on ready
    });