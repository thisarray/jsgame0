"""Check a JavaScript port for common errors."""

import html.parser
import unittest

LINE_ENDINGS = ('*/', '{', '}', '[', ']', ';', ',', '||', '&&')
"""Tuple of accepted line endings in JavaScript excluding whitespace."""

TRICKY_CASES = ['self.', '.image',
                # These are only bad for Actor instances
                '.x', '.y']
"""List of string Python elements that should not be in the JavaScript."""

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
                self.errors.append('h1 tag does not match title!')
        elif self.current_tag == 'script':
            # Check the JavaScript port
            for case in TRICKY_CASES:
                if case in data:
                    self.errors.append(
                        '"{}" found in JavaScript!'.format(case))
            in_comment = False
            for line in data.splitlines():
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
                    line = line[0:index].rstrip()
                # Check the endings of lines that are not comments
                cleaned = line.rstrip()
                if len(cleaned) != len(line):
                    self.errors.append('''Trailing whitespace in line:
{}'''.format(cleaned))
                if len(cleaned) > 0:
                    if not cleaned.endswith(LINE_ENDINGS):
                        self.errors.append('''Line does not end correctly:
{}'''.format(cleaned))


class _UnitTest(unittest.TestCase):
    def test_constants(self):
        """Test the constants."""
        for ending in LINE_ENDINGS:
            self.assertEqual(ending, ending.strip())
        for case in TRICKY_CASES:
            self.assertIn('.', case)

    def test_PortParser(self):
        """Test the HTML parser."""
        parser = _PortParser()
        for value in [
            '', 'foobar', 'f00', '8ar', '<html></html>',
            '<html><head></head></html>',
            '<html><head></head><body></body></html>']:
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
</html>''', 'h1 tag does not match title!'),
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
</html>''', '".y" found in JavaScript!')]:
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
            self.assertEqual(len(errors), 2)
            self.assertEqual(errors[0], expected)
            self.assertTrue(
                errors[1].startswith('Trailing whitespace in line:'))

            parser = _PortParser()
            parser.feed(value.replace(';', ''))
            errors = parser.get_errors()
            self.assertEqual(len(errors), 2)
            self.assertEqual(errors[0], expected)
            self.assertTrue(
                errors[1].startswith('Line does not end correctly:'))

            parser = _PortParser()
            parser.feed(value.replace(';', ' // comment'))
            errors = parser.get_errors()
            self.assertEqual(len(errors), 2)
            self.assertEqual(errors[0], expected)
            self.assertTrue(
                errors[1].startswith('Line does not end correctly:'))

if __name__ == '__main__':
    import argparse
    import os.path
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        'path', nargs='?', default='',
        help='path to the JavaScript port HTML webpage or directory')
    args = parser.parse_args()

    paths = []
    if os.path.isfile(args.path):
        paths = [args.path]
    elif os.path.isdir(args.path):
        filenames = os.listdir(args.path)
        for filename in filenames:
            if filename.endswith('.html'):
                paths.append(os.path.join(args.path, filename))

    if len(paths) > 0:
        for path in paths:
            with open(path, 'r', encoding='utf-8') as f:
                source = f.read()
            port_parser = _PortParser()
            port_parser.feed(source)
            errors = port_parser.get_errors()
            if len(errors) > 0:
                if len(paths) > 1:
                    print(path)
                for error in errors:
                    print(error)
    else:
        suite = unittest.defaultTestLoader.loadTestsFromTestCase(_UnitTest)
        unittest.TextTestRunner(verbosity=2).run(suite)
