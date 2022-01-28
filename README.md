# jsgame0

jsgame0.js is a collection of JavaScript objects following the Pygame Zero specifications.
It makes porting Pygame Zero scripts from Python to JavaScript straightforward.
There are still language quirks like the [remainder operator (%)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder) that may trip you up.
The game runs in the browser using the [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API).

## Differences from Pygame Zero

- There is some boilerplate code to get the browser to load the JavaScript, images, sounds, and music.
  So instead of the "zero" standing for no boilerplate, it stands for no installation.

- Actor class
  - x and y always refer to the topleft corner and ARE NOT aliases for pos.
  - posx and posy ARE the aliases for pos you are looking for.
  - The Rect methods do not account for rotation.
    getBoundingBox() returns the [minimum bounding box](https://en.wikipedia.org/wiki/Minimum_bounding_box)
    as a Rect object for collision detection with a rotated Actor instance.

- global variables **SHOULD BE** initialized in a reset() function.
  This is just good organization and lets you find them easily in one section.
  In addition, it allows you to reset the game without reloading the page.
  In particular, Actor instances **MUST BE** created in the reset() function because the browser may not have loaded their images yet.
  reset() is called after the browser has retrieved all the resources.

- images, sounds, and music map to the underlying [HTMLMediaElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement).
  I did not write wrappers for them because for simple operations HTMLMediaElement works the way you expect.
  For more complex operations, wrappers get in the way.

- There is no storage because the
  [localStorage object](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API) serves the same purpose.

## Why?

jsgame0.js began as an excuse to port the code listings in [Wireframe magazine](https://wfmag.cc).
Porting forced me to understand the code at a deeper level than just reading it.
I also was not comfortable with Pygame Zero's use of compile() to run arbitrary Python scripts on my computer.
I preferred the JavaScript sandbox which limited what a script could do.

In addition,
- Pygame Zero restricts itself to a subset of Pygame which seemed in reach of my limited JavaScript skills.
- Pygame Zero uses globals so polluting the global namespace is not a problem.
  (This is a feature not a bug.)
- Performance does not matter.
- Pygame Zero is designed for educational environments and emphasizes getting the features right first time.
  So the API is very stable.
- It will all be for nought when [WebAssembly](https://developer.mozilla.org/en-US/docs/WebAssembly) allows Python to run directly in the browser.

## License

Based on my reading of the Pygame Zero license, jsgame0.js is free to be licensed however I wish because
- It is in a different language.
- It is not a work produced by combining or linking Pygame Zero.

I chose a MIT license for more freedom.

You can find examples and tests not encumbered by the license in the docs and tests directories, respectively.
For more, look in the javascript branch of my Pygame Zero (pgzero) fork.

Images were made by [Kenney](https://www.kenney.nl/) and published under [CC0 - Public Domain license](https://creativecommons.org/publicdomain/zero/1.0/).

## References

- [Pygame Zero documentation](https://pygame-zero.readthedocs.io/)
- [Pygame Zero GitHub](https://github.com/lordmauve/pgzero/)
- [Pygame](https://www.pygame.org)
- [Pygame GitHub](https://github.com/pygame/pygame/)
- [Wireframe magazine](https://wfmag.cc)
- [Wireframe magazine GitHub](https://github.com/Wireframe-Magazine/)
