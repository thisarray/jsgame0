"""Generate the HTML file for a Pygame Zero script."""

import collections
import html
import os
import os.path
import unittest

FONT_EXTENSION_SET = {
    '.otf': 'opentype',
    '.ttf': 'truetype',
    '.woff': 'woff',
    '.woff2': 'woff2'
}
"""Dictionary of accepted file extensions for fonts."""

IMAGE_EXTENSION_SET = frozenset([
    '.apng', '.avif', '.bmp', '.gif', '.jfif', '.jpg', '.jpeg',
    '.pjpeg', '.pjp', '.png', '.svg', '.webp'])
"""frozenset of accepted file extensions for images."""

SOUND_EXTENSION_SET = frozenset([
    '.3gp', '.aac', '.flac', '.m4a', '.mpg', '.mpeg', '.mp3', '.mp4',
    '.oga', '.ogg', '.wav', '.webm'])
"""frozenset of accepted file extensions for sounds."""

TRICKY_CASES = ['Actor', 'images', 'sounds', 'keyboard', 'font',
                '.image', '.x', '.y']
"""List of string gotchas that are tricky for porting."""

HTML_TO_FONT = """\
<!DOCTYPE html>

<html lang="en-US">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  <script src="jsgame0.js"></script>
  <style type="text/css" media="screen">
"""
"""String HTML template up to the font loading section."""

HTML_TO_RESOURCE = """\
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
</head>

<body>
"""
"""String HTML up to the image and sound loading section."""

# Note the newline to separate the main section
HTML_WITH_CODE = """
<main>
<h1>{title}</h1>

<canvas id="screen">
The game screen appears here if your browser supports the Canvas API.
</canvas>
<section id="controls">
  <button type="button" id="reset">Reset</button>
  <button type="button" id="pause">Pause</button>
</section>

<h2>Original Python code</h2>

<pre id="original"><code>
{code}
</code></pre>
</main>

<script>
"""
"""String HTML template up to the script section."""

# Note the newline to handle the code not ending with newline
HTML_TO_END = """
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
"""
"""String HTML to the end."""

def is_valid(name):
    """Return whether name is valid for Pygame Zero.

    name can contain lowercase letters, numbers and underscores only.
    They also have to start with a letter.

    Args:
        name: String name to test.
    Returns:
        True if name is valid for Pygame Zero. False otherwise.
    """
    if not isinstance(name, str):
        return False
    if len(name) <= 0:
        return False
    if not name[0].isalpha():
        return False
    no_underscore = name.replace('_', '')
    if no_underscore.islower() and no_underscore.isalnum():
        return True
    return False

def list_directory(directory, accepted=()):
    """Return a list of files in directory with extensions in accepted.

    Args:
        directory: String path to the directory.
        accepted: Iterable containing string lowercase extensions to accept.
            Defaults to an empty iterable which accepts all extensions.
    Returns:
        List of string filenames of files in directory with the extensions in
        accepted.
    """
    if not os.path.isdir(directory):
        return []
    filenames = os.listdir(directory)
    length = len(accepted)

    result = []
    for f in filenames:
        name, extension = os.path.splitext(f)
        if is_valid(name):
            if length > 0:
                # Filter for accepted extensions
                if extension.strip().lower() in accepted:
                    result.append(f)
            else:
                result.append(f)
    return result

def print_font_load(filenames):
    """Print the @font-face CSS rules to load fonts from filenames in fonts/.

    Args:
        filenames: List of string valid filenames in the "fonts/" directory.
    """
    for f in filenames:
        name, extension = os.path.splitext(f)
        print('@font-face {')
        print("  font-family: '{}';".format(name))
        print("  src: url('fonts/{}') format('{}');".format(
            f, FONT_EXTENSION_SET.get(extension.strip().lower())))
        print("""  font-weight: normal;
  font-style: normal;
}""")

def print_image_load(filenames):
    """Print the image tags to load images from filenames in images/.

    Args:
        filenames: List of string valid filenames in the "images/" directory.
    """
    if len(filenames) <= 0:
        return

    print('<section id="imageLoader" class="hidden">')
    for f in filenames:
        name, _ = os.path.splitext(f)
        # Put the name in the alt attribute to avoid it clashing with sounds
        print('  <img class="hidden" src="images/{0}" alt="{1}" \
data-name="{1}">'.format(f, name))
    print('</section>')

def print_audio_load(filenames, section_ID='soundLoader', directory='sounds'):
    """Print the audio tags to load audio from filenames in directory.

    Args:
        filenames: List of string valid filenames in directory.
        section_ID: Optional string ID of the section.
            Defaults to "soundLoader".
        directory: Optional string directory. Defaults to "sounds".
    """
    if len(filenames) <= 0:
        return

    print('<section id="{}" class="hidden">'.format(section_ID))
    for f in filenames:
        name, _ = os.path.splitext(f)
        print("""  <audio class="hidden" controls preload="auto" \
src="{}/{}" data-name="{}">\
Your browser does not support the audio element.</audio>""".format(
    directory, f, name))
    print('</section>')

def print_javascript(lines):
    """Print a JavaScript version of the Python code in lines.

    Not much actual translation is done. Only some simple substitutions are
    made.

    Args:
        lines: List of string lines of the Python code.
    """
    counter = collections.Counter()
    for line in lines:
        for o in TRICKY_CASES:
            if o in line:
                counter[o] += 1

    # Print a summary of what we found
    print('''\
/*
 * Summary
 * ---''')
    for o in TRICKY_CASES:
        print(' * {}: {}'.format(o, counter[o]))
    print(' */')

    # Figure out the indent level for each line
    indents = [len(line) - len(line.lstrip()) for line in lines]
    if any(i > 0 for i in indents):
        # If a line is indented, then half the indent until the indent is odd
        while True:
            if any((i % 2) == 1 for i in indents):
                break
            for i in range(len(indents)):
                indents[i] = indents[i] // 2

    # Propagate the indent level backwards to deal with spacing empty lines
    i = len(lines) - 2
    while i >= 0:
        while len(lines[i]) <= 0:
            indents[i] = indents[i+1]
            i -= 1
        i -= 1

    # Print the code
    length = len(lines)
    last_indent = 0
    for i, (indent, line) in enumerate(zip(indents, lines)):
        if indent < last_indent:
            # The current line is not inside the block of the previous line
            while indent < last_indent:
                last_indent -= 1
                print(('  ' * last_indent) + '}')
        elif indent > last_indent:
            # The current line is inside the block of the previous line
            while indent > last_indent:
                print(('  ' * last_indent) + '{')
                last_indent += 1

        cleaned = line.lstrip()
        if len(cleaned) <= 0:
            print()
        else:
##            end = cleaned.find('#')
##            if end < 0:
##                end = len(cleaned)
##            else:
##                while cleaned[end-1].isspace():
##                    end -= 1

            if indent <= 0:
                if cleaned.startswith('def '):
                    print('function ' + cleaned[4:])
                else:
                    print(cleaned)
            else:
                print('  ' * indent, end='')
                if cleaned.startswith('def '):
                    print(cleaned[4:])
                else:
                    print(cleaned.replace('self.', 'this.'))

        last_indent = indent

    # Close outstanding blocks
    while 0 < last_indent:
        last_indent -= 1
        print(('  ' * last_indent) + '}')


class _UnitTest(unittest.TestCase):
    def test_constants(self):
        """Test the constants."""
        for extension_set in [FONT_EXTENSION_SET,
                              IMAGE_EXTENSION_SET,
                              SOUND_EXTENSION_SET]:
            self.assertGreater(len(extension_set), 0)
            for e in extension_set:
                self.assertTrue(e.startswith('.'))
                self.assertGreater(len(e), 2)
                self.assertEqual(e, e.strip().lower())
        for value in TRICKY_CASES:
            self.assertGreater(len(value), 1)

    def test_is_valid(self):
        """Test if a name is valid for Pygame Zero."""
        for value in [None, 42, '', [], '_', '_foobar',
                      'Foobar', 'fooBar', 'FOOBAR',
                      '3', '3degrees', 'my-cat', "sam's dog"]:
            self.assertFalse(is_valid(value))
        for value in ['alien', 'alien_hurt', 'alien_run_7', 'eunomia_regular',
                      'f', 'f00bar', 'foo__bar', 'foo_bar_baz']:
            self.assertTrue(is_valid(value))

    def test_list_directory(self):
        """Test listing the contents of a directory."""
        for value in ['', 'foobar']:
            self.assertEqual(list_directory(value), [])
            for accepted in [(), [], {}]:
                self.assertEqual(list_directory(value, accepted), [])

        result = list_directory('.')
        self.assertIn('jsgame0.js', result)
        self.assertIn('jsgame0.py', result)
        for accepted in [(), [], {}]:
            result = list_directory('.', accepted)
            self.assertIn('jsgame0.js', result)
            self.assertIn('jsgame0.py', result)
        for accepted in [FONT_EXTENSION_SET, IMAGE_EXTENSION_SET,
                         SOUND_EXTENSION_SET, ('.html', '.rst'), ['.rst']]:
            self.assertEqual(list_directory('.', accepted), [])

if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        '-c', '--code', action='store_true',
        help='only modify the Python code')
    parser.add_argument(
        '-l', '--list', action='store_true',
        help='only list the resources found for the Pygame Zero script')
    parser.add_argument(
        'path', nargs='?', default='',
        help='path to the Pygame Zero script')
    args = parser.parse_args()

    if os.path.isfile(args.path):
        parent = os.path.dirname(args.path)
        fonts = list_directory(os.path.join(parent, 'fonts'),
                               FONT_EXTENSION_SET)
        images = list_directory(os.path.join(parent, 'images'),
                                IMAGE_EXTENSION_SET)
        sounds = list_directory(os.path.join(parent, 'sounds'),
                                SOUND_EXTENSION_SET)
        music = list_directory(os.path.join(parent, 'music'),
                               SOUND_EXTENSION_SET)
        if args.list:
            for header, filenames in [
                ('Fonts:', fonts),
                ('Images:', images),
                ('Sounds:', sounds),
                ('Music:', music)]:
                print(header)
                for f in filenames:
                    print('\t{}'.format(f))
            parser.exit()

        name, _ = os.path.splitext(os.path.basename(args.path))
        lines = []
        with open(args.path, 'r', encoding='utf-8') as f:
            for line in f:
                clean = line.rstrip()
                lines.append(clean)
        if args.code:
            print_javascript(lines)
            parser.exit()

        html_safe = '\n'.join([html.escape(line) for line in lines])
        print(HTML_TO_FONT.format(title=name), end='')
        print_font_load(fonts)
        print(HTML_TO_RESOURCE, end='')
        print_image_load(images)
        print_audio_load(sounds, 'soundLoader', 'sounds')
        print_audio_load(music, 'musicLoader', 'music')
        print(HTML_WITH_CODE.format(title=name, code=html_safe), end='')
        print_javascript(lines)
        print(HTML_TO_END, end='')
    else:
        suite = unittest.defaultTestLoader.loadTestsFromTestCase(_UnitTest)
        unittest.TextTestRunner(verbosity=2).run(suite)
