import $$ from '../TestHelpers'

describe('Node', function () {

  const doc = $$.dom.createDocument('myns', 'n:root')

  if (!doc.documentElement)
    throw new Error("documentElement is null")

  const de = doc.documentElement

  const ele1 = doc.createElement('ele')
  const anyEle = <any>ele1
  anyEle._baseURI = 'http://www.example.com'
  de.appendChild(ele1)
  const child1 = doc.createElement('child1')
  const child2 = doc.createElement('child2')
  const child3 = doc.createElement('child3')
  const child4 = doc.createElement('child4')
  ele1.appendChild(child1)
  ele1.appendChild(child2)
  ele1.appendChild(child3)
  ele1.appendChild(child4)
  child4.appendChild(doc.createTextNode('master'))
  child4.appendChild(doc.createTextNode('of'))
  child4.appendChild(doc.createComment('puppity'))
  child4.appendChild(doc.createTextNode('puppets'))

  test('baseURI', function () {
    expect(ele1.baseURI).toBe('http://www.example.com')
  })

  test('isConnected', function () {
    expect(ele1.isConnected).toBeTruthy()
    const newEle = doc.createElement('child4')
    expect(newEle.isConnected).toBeFalsy()
    de.appendChild(newEle)
    expect(newEle.isConnected).toBeTruthy()
  })

  test('ownerDocument', function () {
    expect(ele1.ownerDocument).toBe(doc)
    expect(doc.ownerDocument).toBe(doc)
  })

  test('getRootNode()', function () {
    expect(ele1.getRootNode()).toBe(doc)
  })

  test('parentNode', function () {
    expect(ele1.parentNode).toBe(de)
    expect(doc.parentElement).toBeNull()
  })

  test('parentElement', function () {
    expect(ele1.parentElement).toBe(de)
    expect(doc.parentElement).toBeNull()
  })

  test('hasChildNodes', function () {
    expect(ele1.hasChildNodes).toBeTruthy()
  })

  test('childNodes', function () {
    expect(ele1.childNodes.length).toBe(4)
  })

  test('firstChild', function () {
    expect(ele1.firstChild).toBe(child1)
  })

  test('lastChild', function () {
    expect(ele1.lastChild).toBe(child4)
  })

  test('previousSibling', function () {
    expect(child3.previousSibling).toBe(child2)
  })

  test('nextSibling', function () {
    expect(child3.nextSibling).toBe(child4)
  })

  test('nodeValue', function () {
    const charNode = child4.firstChild
    if (!charNode)
      throw new Error("charNode is null")

    expect(charNode.nodeValue).toBe('master')
    charNode.nodeValue = 'maestro'
    expect(charNode.nodeValue).toBe('maestro')
    charNode.nodeValue = 'master'
  })

  test('textContent', function () {
    expect(child4.textContent).toBe('masterofpuppets')
    child4.textContent = 'masterofbobbitts'
    expect(child4.childNodes.length).toBe(1)

    const charNode = child4.firstChild
    if (!charNode)
      throw new Error("charNode is null")

    expect(charNode.textContent).toBe('masterofbobbitts')
  })

  test('normalize()', function () {
    const newEle = doc.createElement('child')
    de.appendChild(newEle)
    newEle.appendChild(doc.createTextNode('part 1 '))
    newEle.appendChild(doc.createTextNode('part 2 '))
    newEle.appendChild(doc.createComment('separator'))
    newEle.appendChild(doc.createTextNode('part 3 '))
    expect(newEle.childNodes.length).toBe(4)
    newEle.normalize()
    expect(newEle.childNodes.length).toBe(3)

    const charNode = newEle.firstChild
    if (!charNode)
      throw new Error("charNode is null")

    expect(charNode.textContent).toBe('part 1 part 2 ')
  })

  test('isEqualNode()', function () {
    const newEle1 = doc.createElement('child')
    newEle1.setAttribute('att1', 'val1')
    newEle1.setAttribute('att2', 'val2')
    de.appendChild(newEle1)
    newEle1.appendChild(doc.createTextNode('part 1 '))
    newEle1.appendChild(doc.createTextNode('part 2 '))

    const newEle2 = doc.createElement('child')
    newEle2.setAttribute('att1', 'val1')
    newEle2.setAttribute('att2', 'val2')
    de.appendChild(newEle2)
    newEle2.appendChild(doc.createTextNode('part 1 '))
    newEle2.appendChild(doc.createTextNode('part 2 '))

    const newEle3 = doc.createElement('child')
    newEle3.setAttribute('att1', 'val1')
    newEle3.setAttribute('att2', 'val2')
    de.appendChild(newEle3)
    newEle3.appendChild(doc.createTextNode('part 1 '))
    newEle3.appendChild(doc.createTextNode('part 4 '))

    expect(newEle1.isEqualNode(newEle2)).toBeTruthy()
    expect(newEle1.isEqualNode(newEle3)).toBeFalsy()
  })

  test('isSameNode()', function () {
    const sameEle1 = de.firstChild
    if (!sameEle1)
      throw new Error("charNode is null")

    expect(ele1.isSameNode(sameEle1)).toBeTruthy()
  })

  test('compareDocumentPosition()', function () {
    expect(child1.compareDocumentPosition(child2) & 4).toBeTruthy()
    expect(child4.compareDocumentPosition(de) & 2).toBeTruthy()
  })

  test('contains()', function () {
    expect(de.contains(child2)).toBeTruthy()
    expect(de.contains(null)).toBeFalsy()
  })


  test('lookupPrefix()', function () {
    const newText = doc.createTextNode('txt')
    child4.appendChild(newText)
    expect(newText.lookupPrefix('myns')).toBe('n')
  })

  test('lookupNamespaceURI()', function () {
    const newText = doc.createTextNode('txt')
    child4.appendChild(newText)
    expect(newText.lookupNamespaceURI('n')).toBe('myns')
  })

  test('isDefaultNamespace()', function () {
    const htmlDoc = $$.dom.createHTMLDocument()
    if (!htmlDoc.documentElement)
      throw new Error("documentElement is null")

    const html = htmlDoc.documentElement
    const newText = htmlDoc.createTextNode('txt')
    html.appendChild(newText)
    expect(newText.isDefaultNamespace('http://www.w3.org/1999/xhtml')).toBeTruthy()
    expect(newText.isDefaultNamespace('none')).toBeFalsy()
  })

  test('insertBefore()', function () {
    const newText = doc.createTextNode('txt')
    ele1.insertBefore(newText, child4)
    expect(child4.previousSibling).toBe(newText)
    expect(newText.nextSibling).toBe(child4)
  })

  test('appendChild()', function () {
    const newText = doc.createTextNode('txt')
    ele1.appendChild(newText)
    expect(child4.nextSibling).toBe(newText)
    expect(newText.previousSibling).toBe(child4)
  })

  test('replaceChild()', function () {
    const newText = doc.createTextNode('txt')
    ele1.replaceChild(child2, newText)
    expect(newText.previousSibling).toBe(child1)
    expect(newText.nextSibling).toBe(child3)
  })

  test('removeChild()', function () {
    const node1 = doc.createElement('child1')
    const node2 = doc.createElement('child2')
    const node3 = doc.createElement('child3')
    ele1.appendChild(node1)
    ele1.appendChild(node2)
    ele1.appendChild(node3)

    ele1.removeChild(node2)
    expect(node3.previousSibling).toBe(node1)
    expect(node1.nextSibling).toBe(node3)
  })

})