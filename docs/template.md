# Anatomy of the HTML Boilerplate

[jsgame0.js](https://github.com/thisarray/jsgame0) uses an HTML boilerplate to setup the structures it needs in the browser.
Below is an explanation of what each part does.

```html
<!DOCTYPE html>

<html lang="en-US">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Title</title>
  <script src="jsgame0.js"></script>
```

This is the standard HTML5 preamble to tell the browser the page uses HTML5, is in US English, and contains characters encoded using UTF-8.
The viewport meta tag tells the browser not to zoom in on the page.
The title tag contains the title of the page.
The script tag tells the browser where to find the JavaScript file for [jsgame0.js](https://github.com/thisarray/jsgame0) relative to the page.

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
The [@font-face CSS at-rule](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face) is used to load any fonts used in the game.

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

The `imageLoader`, `soundLoader`, and `musicLoader` sections load the respective resources.
They are placed at the start of the body section so the browser sees them as soon as possible and starts to download them over the network which takes time.
Both sound and music use the same audio tag.
There is no difference to the HTML.
They only differ in the interface used to access them.
The title is duplicated in the h1 tag.

The tags in the `imageLoader`, `soundLoader`, and `musicLoader` sections get a CSS class of "hidden" to hide them.
Without this CSS class, images and audio controls would show up on the page which is not what we want.
This does not stop the browser from loading these resources though.

```html
<canvas id="screen">
The game screen appears here if your browser supports the Canvas API.
</canvas>
<section id="controls">
  <button type="button" id="reset">Reset</button>
  <button type="button" id="pause">Pause</button>
</section>
```

The canvas tag creates an area where [jsgame0.js](https://github.com/thisarray/jsgame0) can draw the screen.
Below it are 2 buttons to reset and pause the game.
These elements are connected to the `screen` global object later.

```html
<h2>Original Python code</h2>

<pre id="original"><code>
# Original Python code
</code></pre>
</main>
```

Closing out the main section is the original Python code.
It is included for easy comparison to the JavaScript port.

```html
<script>
// JavaScript port

window.addEventListener('load', (event) => {
  screen.init();
});
</script>
</body>

</html>
```

The JavaScript port is placed inside a script tag at the end of the body section.
This way it is run after all the page elements have been created.

We wait in an event listener for the page to finish loading to make sure all the resources are available before running.
The game then waits for the user to click in the canvas.
The game NEVER autoplays because that can be annoying.
When the user finally clicks in the canvas, `reset()` is called and the game started.
