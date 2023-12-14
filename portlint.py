"""Check a JavaScript port for common errors."""

import html.parser
import unittest

LINE_ENDINGS = ('*/', '{', '}', '[', ']', ';', ',', '||', '&&')
"""Tuple of accepted string line endings in JavaScript excluding whitespace."""

TRICKY_CASES = ['self.', '.image',
                # This only makes Joystick support difficult
                'keyboard[keys.',
                # These are only bad for Actor instances
                '.x', '.y',
                # Legacy loader calls
                '.LOAD(', '.set_mode(', '.playButton(',
                # Equality or inequality that are not strict
                ' == ', ' != ',
                # Extra argument
                '.toFixed(0)']
"""List of string elements that should not be in the JavaScript."""

def check_javascript(code):
    """Return a list of errors in the Javascript in code."""
    errors = []

    for case in TRICKY_CASES:
        if case in code:
            if (('=' in case) and
                (case not in code.replace(case + 'null', ''))):
                # Ignore comparisons to null that are not strict
                continue
            errors.append('"{}" found in JavaScript!'.format(case))

    # Check line by line
    in_comment = False
    for line in code.splitlines():
        # This block comment check only catches when they are on own lines
        if '/*' in line:
            # Start of a block comment
            in_comment = True
        if '*/' in line:
            # End of a block comment
            in_comment = False
        if in_comment:
            continue
        index = line.find('//')
        if index >= 0:
            # Remove the inline comment
            line = line[:index].rstrip()
        # Check the endings of lines that are not comments
        cleaned = line.rstrip()
        if len(cleaned) != len(line):
            errors.append('''Trailing whitespace in line:
{}'''.format(cleaned))
        if len(cleaned) > 0:
            if not cleaned.endswith(LINE_ENDINGS):
                errors.append('''Line does not end correctly:
{}'''.format(cleaned))

    return errors


class _PortParser(html.parser.HTMLParser):

    """HTMLParser to parse the JavaScript port HTML webpage."""

    def reset(self):
        super().reset()

        self.current_tag = ''
        """String current tag being processed."""

        self.errors = []
        """List of errors in the JavaScript port HTML webpage."""

        self.title = ''
        """String title of the page."""

    def get_errors(self):
        """Return a list of string errors in the JavaScript port."""
        return list(self.errors)

    def handle_starttag(self, tag, attrs):
        """Mark when we enter a tag."""
        self.current_tag = tag

    def handle_endtag(self, tag):
        """Mark when we exit a tag."""
        self.current_tag = ''

    def handle_data(self, data):
        """Handle the data of the current tag."""
        if self.current_tag == 'title':
            self.title = data
        elif self.current_tag == 'h1':
            if data != self.title:
                self.errors.append('h1 tag does not match title tag!')
        elif self.current_tag == 'script':
            # Check the JavaScript port
            self.errors.extend(check_javascript(data))


class _UnitTest(unittest.TestCase):
    def test_constants(self):
        """Test the constants."""
        for ending in LINE_ENDINGS:
            self.assertEqual(ending, ending.strip())
        for case in TRICKY_CASES:
            if '=' in case:
                self.assertTrue(case.endswith('= '))
            else:
                self.assertIn('.', case)

    def test_PortParser(self):
        """Test the HTML parser."""
        parser = _PortParser()
        for value in [
            '', 'foobar', 'f00', '8ar', '<html></html>',
            '<html><head></head></html>',
            '<html><head></head><body></body></html>',
            '''<html>
<head>
</head>
<body>
<script>
if (this == null) {
}
</script>
</body>
</html>''',
            '''<html>
<head>
</head>
<body>
<script>
if (this != null) {
}
</script>
</body>
</html>''']:
            parser.feed(value)
            self.assertEqual(parser.get_errors(), [])

        for value, expected in [
            ('''<html>
<head>
  <title>Foobar</title>
</head>
<body>
<h1>Baz</h1>
</body>
</html>''', 'h1 tag does not match title tag!'),
            ('''<html>
<head>
</head>
<body>
<script>
class Game {
  constructor() {
    self.array = new Array();
  }
}
</script>
</body>
</html>''', '"self." found in JavaScript!'),
            ('''<html>
<head>
</head>
<body>
<script>
class Game {
  constructor() {
    this.image = 'foobar';
  }
}
</script>
</body>
</html>''', '".image" found in JavaScript!'),
            ('''<html>
<head>
</head>
<body>
<script>
class Game {
  constructor() {
    if (keyboard[keys.ESCAPE]) {
    }
  }
}
</script>
</body>
</html>''', '"keyboard[keys." found in JavaScript!'),
            ('''<html>
<head>
</head>
<body>
<script>
class Game {
  constructor() {
    this.x = 42;
  }
}
</script>
</body>
</html>''', '".x" found in JavaScript!'),
            ('''<html>
<head>
</head>
<body>
<script>
class Game {
  constructor() {
    this.y = 42;
  }
}
</script>
</body>
</html>''', '".y" found in JavaScript!'),
            ('''<html>
<head>
</head>
<body>
<script>
window.addEventListener('load', (event) => {
  images.LOAD('#imageLoader img');
});
</script>
</body>
</html>''', '".LOAD(" found in JavaScript!'),
            ('''<html>
<head>
</head>
<body>
<script>
window.addEventListener('load', (event) => {
  screen.set_mode('#screen', '#reset', '#pause');
});
</script>
</body>
</html>''', '".set_mode(" found in JavaScript!'),
            ('''<html>
<head>
</head>
<body>
<script>
window.addEventListener('load', (event) => {
  reset();
  screen.draw.playButton();
});
</script>
</body>
</html>''', '".playButton(" found in JavaScript!'),
            ('''<html>
<head>
</head>
<body>
<script>
if (this == 'foobar') {
}
</script>
</body>
</html>''', '" == " found in JavaScript!'),
            ('''<html>
<head>
</head>
<body>
<script>
if (this != 'foobar') {
}
</script>
</body>
</html>''', '" != " found in JavaScript!'),
            ('''<html>
<head>
</head>
<body>
<script>
if (this != null) {
}
if (this == 'foobar') {
}
</script>
</body>
</html>''', '" == " found in JavaScript!'),
            ('''<html>
<head>
</head>
<body>
<script>
if (this != 'foobar') {
}
if (this == null) {
}
</script>
</body>
</html>''', '" != " found in JavaScript!'),
            ('''<html>
<head>
</head>
<body>
<script>
let foobar = 42;
console.log(foobar.toFixed(0));
</script>
</body>
</html>''', '".toFixed(0)" found in JavaScript!')]:
            start = value.find('<script>')
            if start > 0:
                end = value.find('</script>')
                self.assertEqual(check_javascript(value[start+8:end]),
                                 [expected])

            parser = _PortParser()
            parser.feed(value)
            self.assertEqual(parser.get_errors(), [expected])

            if ';' not in value:
                continue

            parser = _PortParser()
            parser.feed(value.replace(
                'constructor() {', '/*constructor() {').replace(';', ';*/'))
            self.assertEqual(parser.get_errors(), [expected])

            parser = _PortParser()
            parser.feed(value.replace('this', '//this'))
            self.assertEqual(parser.get_errors(), [expected])

            parser = _PortParser()
            parser.feed(value.replace(';', ';    '))
            errors = parser.get_errors()
            self.assertGreater(len(errors), 1)
            self.assertEqual(errors[0], expected)
            for error in errors[1:]:
                self.assertTrue(
                    error.startswith('Trailing whitespace in line:'))

            parser = _PortParser()
            parser.feed(value.replace(';', ''))
            errors = parser.get_errors()
            self.assertGreater(len(errors), 1)
            self.assertEqual(errors[0], expected)
            for error in errors[1:]:
                self.assertTrue(
                    error.startswith('Line does not end correctly:'))

            parser = _PortParser()
            parser.feed(value.replace(';', ' // comment'))
            errors = parser.get_errors()
            self.assertGreater(len(errors), 1)
            self.assertEqual(errors[0], expected)
            for error in errors[1:]:
                self.assertTrue(
                    error.startswith('Line does not end correctly:'))

if __name__ == '__main__':
    import argparse
    import os.path
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        'path', nargs='?', default='',
        help='path to the JavaScript, port HTML webpage, or directory')
    args = parser.parse_args()

    paths = []
    if os.path.isfile(args.path):
        paths = [args.path]
    elif os.path.isdir(args.path):
        filenames = os.listdir(args.path)
        for filename in filenames:
            if filename.endswith(('.html', '.js')):
                paths.append(os.path.join(args.path, filename))

    if len(paths) > 0:
        for path in paths:
            with open(path, 'r', encoding='utf-8') as f:
                source = f.read()
            if path.endswith('.js'):
                errors = check_javascript(source)
            else:
                port_parser = _PortParser()
                port_parser.feed(source)
                errors = port_parser.get_errors()
            if len(errors) > 0:
                if len(paths) > 1:
                    print('==> {} <=='.format(path))
                for error in errors:
                    print(error)
    else:
        suite = unittest.defaultTestLoader.loadTestsFromTestCase(_UnitTest)
        unittest.TextTestRunner(verbosity=2).run(suite)
