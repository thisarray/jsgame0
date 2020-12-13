# jsgame0

jsgame0.js is a collection of JavaScript objects following the Pygame Zero specifications.
This makes porting Pygame Zero scripts from Python to JavaScript straightforward.
There are still language quirks that may trip you up.
The game runs in the browser using the [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API).

## Differences from Pygame Zero

- Actor class
  - x and y always refer to the topleft corner and ARE NOT aliases for pos.
  - There is no opacity attribute.
- There is no music.
  The [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) is up to the task but music is experimental in Pygame Zero.
  Without a firm specification, I did not want to implement it.
- There is no tone.
- There is no storage.
  The [localStorage object](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API) serves the same purpose.

## Why?

jsgame0.js began as an excuse to port the code listings in [Wireframe magazine](https://wfmag.cc).
Porting forced me to understand the code at a deeper level than just reading it.
I also was not comfortable with Pygame Zero's use of compile() to run arbitrary Python scripts.
I preferred the JavaScript sandbox which limited what a script could do.

In addition,
- Pygame Zero restricts itself to a subset of Pygame which seemed in reach of my limited JavaScript skills.
- Pygame Zero uses globals so polluting the global namespace is not a problem.
  (This is a feature not a bug.)
- Performance does not matter.
- It is designed for educational environments and emphasizes getting the features right first time.
  So the API is very stable.
- It will all be for nought when [WebAssembly](https://developer.mozilla.org/en-US/docs/WebAssembly) allows Python to run directly in the browser.

## License

Based on my reading of the pgzero license, jsgame0.js is free to be licensed however I wish because
- It is in a different language
- It is not a work produced by combining or linking pgzero.

I chose a MIT license for more freedom.

You can find examples and tests not encumbered by the license in examples and tests, respectively.
For more, look in the javascript branch of my pgzero fork.

## References

- [Pygame Zero documentation](https://pygame-zero.readthedocs.io/)
- [Pygame Zero GitHub](https://github.com/lordmauve/pgzero/)
- [Pygame](https://www.pygame.org)
- [Pygame GitHub](https://github.com/pygame/pygame/)
- [Wireframe magazine](https://wfmag.cc)
- [Wireframe magazine GitHub](https://github.com/Wireframe-Magazine/)
