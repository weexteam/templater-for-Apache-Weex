function stringify(json) {
  return JSON.stringify(json, function replacer(key, value) {
    if (typeof value === 'function') {
      return value.toString()
    }
    return value;
  })
}

/**
 * format richtext root node
 * - children -> attr.value binding function
 *
 * @param  {Node} node
 */
// TODO: support event
function format(node) {
  var val = stringify(node.children)
  val = val.replace(/\"function\s*\(\)\s*{\s*return\s*(.*?)}\"/g, function ($0, $1) {
    return $1
  }).replace(/\"([^,]*?)\":/g, function ($0, $1) {
    return $1 + ': '
  }).replace(/(,)(\S)/g, function ($0, $1, $2) {
    return $1 + ' ' + $2
  }).replace(/\"/g, '\'')
  delete node.children
  node.attr = node.attr || {}
  node.attr.value = eval('(function () {return ' + val + '})')
}

/**
 * walk all nodes and format richtext root node
 *
 * @param  {Node} node
 */
function walkAndFormat(node) {
  if (node) {
    if (node.append !== 'once') {
      if (node.children && node.children.length) {
        for (var i = 0, len = node.children.length; i < len; i++) {
          walkAndFormat(node.children[i])
        }
      }
    }
    else {
      format(node)
    }
  }
}

exports.walkAndFormat = walkAndFormat
