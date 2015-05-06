var lxml = require('libxmljs');
var moment = require('moment-timezone');
var R = require('ramda');


module.exports = structure;


function structure(def) {
  // Return some syntactic sugar for nice little english sentences. Example:
  //   structure(definition).outOf.xml(content)
  //   structure(definition).outOf.html(content)
  //   structure(definition).outOf(element_tree)

  var outOf = R.partial(extractStructure, def);
  outOf.xml = R.partial(parseXml, def);
  outOf.html = R.partial(parseHtml, def);

  return {
    outOf: outOf
  };
}

function parseXml(def, xml) {
  var doc = lxml.parseXmlString(xml);
  return extractStructure(def, doc.root());
};

function parseHtml(def, html) {
  var doc = lxml.parseHtmlString(html);
  return extractStructure(def, doc.root());
};

function extractStructure(def, root) {
  if (R.is(Function, def)) {
    // Definition is a simple field, parse it
    return def(root);
  }
  else if (R.is(String, def)) {
    // Definition is merely an xpath, treat it as a text field and parse it
    return extractTextFromSelector(def, root);
  }
  else if (R.is(Object, def)) {
    // Definition is a mapping structure, parse the values as fields
    return R.mapObj(function extractField(extractor) {
      if (R.is(Function, extractor)) return extractor(root);
      if (R.is(String, extractor)) return extractTextFromSelector(extractor, root);
      return extractor;
    }, def);
  }
};


// Simple fields

function extractTextFromSelector(xpath, root) {
  var nodes = root.find(xpath);
  if (R.isEmpty(nodes)) return;

  return getNodeContents(nodes[0]);
}
structure.text = function(xpath) { return R.partial(extractTextFromSelector, xpath); };

function extractIntFromSelector(xpath, root) {
  var nodes = root.find(xpath);
  if (R.isEmpty(nodes)) return;

  return parseInt(getNodeContents(nodes[0]));
}
structure.int = function(xpath) { return R.partial(extractIntFromSelector, xpath); };

function extractFloatFromSelector(xpath, root) {
  var nodes = root.find(xpath);
  if (R.isEmpty(nodes)) return;

  return parseFloat(getNodeContents(nodes[0]));
}
structure.int = function(xpath) { return R.partial(extractFloatFromSelector, xpath); };

function extractMomentFromSelector(xpath, format, timezone, root) {
  timezone = timezone || 'Etc/UTC';

  var nodes = root.find(xpath);
  if (R.isEmpty(nodes)) return;

  return moment.tz(getNodeContents(nodes[0]), format, timezone);
}
structure.moment = function(xpath, format, timezone) { return R.partial(extractMomentFromSelector, xpath, format, timezone); };


// Compound fields, based on recursive extractStructure

function extractObjectFromSelector(xpath, def, root) {
  var nodes = root.find(xpath);
  if (R.isEmpty(nodes)) return;

  return extractStructure(def, nodes[0]);
}
structure.object = function(xpath, def) { return R.partial(extractObjectFromSelector, xpath, def); };

function extractListFromSelector(xpath, def, root) {
  var nodes = root.find(xpath);

  return R.map(R.partial(extractStructure, def), nodes);
}
structure.list = function(xpath, def) { return R.partial(extractListFromSelector, xpath, def); };


// Helpers

function getNodeContents(node) {
  if (R.hasIn('text', node) && R.is(Function, node.text)) {
    // Node is element or comment
    return node.text();
  }
  if (R.hasIn('value', node) && R.is(Function, node.value)) {
    // Node is attribute
    return node.value();
  }
}
