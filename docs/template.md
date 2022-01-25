# Anatomy of the HTML template

jsgame0.js uses an HTML template to setup the structures it needs in the browser.
Below is an explanation of what each part of the template does.

```html
<!DOCTYPE html>

<html lang="en-US">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Title</title>
  <script src="jsgame0.js"></script>
```

Standard preamble to tell the browser the page uses HTML5, is in US English, and contains characters encoded using UTF-8.
The viewport meta tag tells the browser not to zoom in on the page.
The title tag contains the title of the page.
The script tag loads jsgame0.js.

```html
  <style type="text/css" media="screen">
@font-face {
  font-family: 'foobar';
  src: url('fonts/foobar.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}
body {
  background-color: white;
  color: black;
}
.hidden {
  display: none;
}
#original {
  margin-left: 1em;
}
  </style>
```

[Cascading Style Sheets (CSS)](https://developer.mozilla.org/en-US/docs/Web/CSS) is used to style elements of the page.
The [@font-face CSS at-rule](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face) is used to load any fonts used in the port.
The hidden rule keeps the image and audio tags used to load the resources from being drawn.
Without this rule, you would see images and audio controls in the body of the page.

```html
</head>

<body>
<section id="imageLoader" class="hidden">
  <img class="hidden" src="images/foobar.png" alt="foobar" data-name="foobar">
</section>
<section id="soundLoader" class="hidden">
  <audio class="hidden" controls preload="auto" src="sounds/foobar.wav" data-name="foobar">Your browser does not support the audio element.</audio>
</section>
<section id="musicLoader" class="hidden">
  <audio class="hidden" controls preload="auto" src="music/foobar.mp3" data-name="foobar">Your browser does not support the audio element.</audio>
</section>

<main>
<h1>Title</h1>
```

The head section is closed as we start the body of the page.
The imageLoader, soundLoader, and musicLoader sections load the respective resource.
They are placed at the start of the body section so the browser sees them as soon as possible and starts to download them over the network which takes time.
Both sound and music use the same audio tag.
There is no difference to the HTML.
They only differ in the interface used to access them.
The title is duplicated in the h1 tag.

```html
<canvas id="screen">
The game screen appears here if your browser supports the Canvas API.
</canvas>
<section id="controls">
  <button type="button" id="reset">Reset</button>
  <button type="button" id="pause">Pause</button>
</section>
```

The canvas tag creates an area where jsgame0.js can draw the screen.
Below it are 2 buttons to reset and pause the port.
These elements are connected to the screen global object later.

```html
<h2>Original Python code</h2>

<pre id="original"><code>
# Original Python code
</code></pre>
</main>
```

Closing out the main section in the body is the original Python code.

```html
<script>
// JavaScript port

window.addEventListener('load', (event) => {
  images.LOAD('#imageLoader img');
  sounds.LOAD('#soundLoader audio');
  music.LOAD('#musicLoader audio');
  reset();
  screen.set_mode('#screen', '#reset', '#pause');
});
</script>
</body>

</html>
```

The JavaScript port is placed inside a script tag at the end of the body section.
This way it is run after all the page elements have been created.
To make sure all the resources are available, the port waits for the page to finish loading before running.
This is done by registering an event listener to reset and run the port once the page has loaded.
The screen global object is given the IDs of the canvas tag, the reset button, and the pause button so it knows where to draw and can respond to button clicks.
