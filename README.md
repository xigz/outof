# OutOf

Pulls data out of HTML and XML.

## Synopsis

```js
var structure = require('outof');

// Declare the structure:
var info_object = {
  foo: '/stuff/@foo',
  bar: structure.text('//bar'),
  lot: structure.int('//bar/@lot'),
  exp: structure.float('//bar/@exp'),
  when: structure.moment('/stuff/@when', 'YYYY-MM-DD HH:mm:ss', 'Etc/UTC')
};

// Parse and pull out the structure in one of three ways:
var info = structure(info_object).outOf.xml(content);
var info = structure(info_object).outOf.html(content);
var info = structure(info_object).outOf(document.root());

// You can do lists too:
var foo_list = structure.list('//foo', structure.int('@id'));
var foo_ids = structure(foo_list).outOf(root);
```

## License

The MIT License (MIT)

Copyright (c) 2014 Xig Katalyst

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
