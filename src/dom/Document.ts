import { Node } from './Node'
import { Element } from './Element'
import { DOMImplementation } from './DOMImplementation'
import { DocumentType } from './DocumentType'
import { DOMException } from './DOMException'
import { HTMLCollection } from './HTMLCollection'
import { Utility } from './Utility'
import { DocumentFragment } from './DocumentFragment'
import { Comment } from './Comment'
import { ProcessingInstruction } from './ProcessingInstruction'
import { NodeFilter } from './NodeFilter'
import { CDATASection } from './CDATASection'
import { Text } from './Text'
import { Attr } from './Attr'
import { ShadowRoot } from './ShadowRoot';

/**
 * Represents a document node.
 */
export class Document extends Node {

  _URL: string = 'about:blank'
  _origin: string = ''
  _compatMode: string = 'CSS1Compat'
  _characterSet: string = 'UTF-8'
  _contentType: string = 'application/xml'

  /**
   * Initializes a new instance of `Document`.
   */
  public constructor() {
    super(null)
  }

  /**
   * Returns the document's URL.
   */
  get URL(): string { return this._URL }

  /**
   * Returns sets the document's origin.
   */
  get origin(): string { return this._origin }

  /**
   * Returns whether the document is rendered in Quirks mode or
   * Standards mode.
   */
  get compatMode(): string { return this._compatMode }

  /**
   * Returns the character set.
   */
  get characterSet(): string { return this._characterSet }

  /**
   * Returns the MIME type of the document.
   */
  get contentType(): string { return this._contentType }

  /** 
   * Returns the type of node. 
   */
  get nodeType(): number { return Node.Document }

  /** 
   * Returns a string appropriate for the type of node. 
   */
  get nodeName(): string { return '#document' }

  /** 
   * Returns the {@link DOMImplementation} object that is associated 
   * with the document.
   */
  get implementation(): DOMImplementation {
    return DOMImplementation.Instance
  }

  /**
   * Gets or sets the document's URL.
   */
  get documentURI(): string { return this.URL }

  /**
   * Gets or sets the character set.
   */
  get charset(): string { return this.characterSet }

  /**
   * Returns the character set.
   */
  get inputEncoding(): string { return this.characterSet }

  /** 
   * Returns the {@link DocType} or `null` if there is none.
   */
  get doctype(): DocumentType | null {
    for (let child of this.childNodes) {
      if (child.nodeType === Node.DocumentType)
        return <DocumentType>child
    }
    return null
  }

  /** 
   * Returns the document element or `null` if there is none.
   */
  get documentElement(): Element | null {
    for (let child of this.childNodes) {
      if (child.nodeType === Node.Element)
        return <Element>child
    }
    return null
  }

  /**
   * Returns an {@link Element}  who has an id attribute `elementId`.
   * 
   * @param elementId - the value of the `id` attribute to match
   */
  getElementById(elementId: string): Element | null { return null }

  /**
   * Returns a {@link HTMLCollection} of all descendant elements 
   * whose qualified name is `qualifiedName`.
   * 
   * @param qualifiedName - the qualified name to match or `*` to match all
   * descendant elements.
   * 
   * @returns an {@link HTMLCollection} of matching descendant
   * elements
   */
  getElementsByTagName(qualifiedName: string): HTMLCollection {
    return new HTMLCollection(this, function (ele: Element) {
      return (qualifiedName === '*' || ele.tagName === qualifiedName)
    })
  }

  /**
   * Returns a {@link HTMLCollection} of all descendant elements 
   * whose namespace is `namespace` and local name is `localName`.
   * 
   * @param namespace - the namespace to match or `*` to match any
   * namespace.
   * @param localName - the local name to match or `*` to match any
   * local name.
   * 
   * @returns an {@link HTMLCollection} of matching descendant
   * elements
   */
  getElementsByTagNameNS(namespace: string, localName: string): HTMLCollection {
    return new HTMLCollection(this, function (ele: Element) {
      return ((localName === '*' || ele.localName === localName) &&
        (namespace === '*' || ele.namespaceURI === namespace))
    })
  }

  /**
   * Returns a {@link HTMLCollection} of all descendant elements 
   * whose classes are contained in the list of classes given in 
   * `classNames`.
   * 
   * @param classNames - a space-separated list of classes
   * 
   * @returns an {@link HTMLCollection} of matching descendant
   * elements
   */
  getElementsByClassName(classNames: string): HTMLCollection {
    let arr = Utility.OrderedSet.parse(classNames)
    return new HTMLCollection(this, function (ele: Element) {
      let classes = ele.classList
      let allClassesFound = true
      for (let className of arr) {
        if (!classes.contains(className)) {
          allClassesFound = false
          break
        }
      }
      return allClassesFound
    })
  }

  /**
   * Returns a new {@link Element} with the given `localName`.
   * 
   * @param localName - local name
   * 
   * @returns the new {@link Element}
   */
  createElement(localName: string): Element {
    if (!localName.match(Utility.XMLSpec.Name))
      throw DOMException.InvalidCharacterError

    return new Element(this, localName, null, null)
  }

  /**
   * Returns a new {@link Element} with the given `namespace` and
   * `qualifiedName`.
   * 
   * @param namespace - namespace URL
   * @param qualifiedName - qualified name
   * 
   * @returns the new {@link Element}
   */
  createElementNS(namespace: string | null, qualifiedName: string): Element {
    let names = Utility.Namespace.extractNames(namespace, qualifiedName)

    return new Element(this, names.localName, names.namespace,
      names.prefix)
  }

  /**
   * Returns a new {@link DocumentFragment}.
   * 
   * @returns the new {@link DocumentFragment}
   */
  createDocumentFragment(): DocumentFragment {
    return new DocumentFragment(this)
  }

  /**
   * Returns a new {@link Text} with the given `data`.
   * 
   * @param data - text content
   * 
   * @returns the new {@link Text}
   */
  createTextNode(data: string): Text {
    return new Text(this, data)
  }

  /**
   * Returns a new {@link CDATASection} with the given `data`.
   * 
   * @param data - text content
   * 
   * @returns the new {@link CDATASection}
   */
  createCDATASection(data: string): CDATASection {
    if (data.includes(']]>'))
      throw DOMException.InvalidCharacterError
    return new CDATASection(this, data)
  }

  /**
   * Returns a new {@link Comment} with the given `data`.
   * 
   * @param data - text content
   * 
   * @returns the new {@link Comment}
   */
  createComment(data: string): Comment {
    return new Comment(this, data)
  }

  /**
   * Returns a new {@link ProcessingInstruction} with the given `target`
   * and `data`.
   * 
   * @param target - instruction target
   * @param data - text content
   * 
   * @returns the new {@link ProcessingInstruction}
   */
  createProcessingInstruction(target: string, data: string): ProcessingInstruction {
    if (!target.match(Utility.XMLSpec.Name))
      throw DOMException.InvalidCharacterError
    if (data.includes("?>"))
      throw DOMException.InvalidCharacterError

    return new ProcessingInstruction(this, target, data)
  }

  /**
   * Returns a copy of `node`.
   * 
   * @param deep - true to include descendant nodes.
   * 
   * @returns clone of node
   */
  importNode(node: Node, deep: boolean = false): Node {
    if (node.nodeType === Node.Document)
      throw DOMException.NotSupportedError

    if (node instanceof ShadowRoot)
      throw DOMException.NotSupportedError

    const clonedNode = node.cloneNode(deep)

    Utility.Tree.forEachDescendant(clonedNode, { self: true, shadow: false}, (child) => {
      child._ownerDocument = this
      if (child.nodeType === Node.Element) {
        const ele = <Element>child
        for(const attr of ele.attributes) {
          attr._ownerDocument = this
        }
      }
    })

    return clonedNode
  }

  /**
   * Moves `node` from another document into this document and returns
   * it.
   * 
   * @param node - node to move.
   * 
   * @returns the adopted node
   */
  adoptNode(node: Node): Node {
    if (node.nodeType === Node.Document)
      throw DOMException.NotSupportedError

    if (node instanceof ShadowRoot)
      throw DOMException.HierarchyRequestError

    Utility.Tree.Mutation.adoptNode(node, this)

    return node
  }

  /**
   * Returns a new {@link Attr} with the given `localName`.
   * 
   * @param localName - local name
   * 
   * @returns the new {@link Attr}
   */
  createAttribute(localName: string): Attr {
    if (!localName.match(Utility.XMLSpec.Name))
      throw DOMException.InvalidCharacterError

    return new Attr(this, null, localName, null, null, '')
  }

  /**
   * Returns a new {@link Attr} with the given `namespace` and
   * `qualifiedName`.
   * 
   * @param namespace - namespace URL
   * @param qualifiedName - qualified name
   * 
   * @returns the new {@link Attr}
   */
  createAttributeNS(namespace: string, qualifiedName: string): Attr {
    let names = Utility.Namespace.extractNames(namespace, qualifiedName)

    return new Attr(this, null, names.localName, names.namespace,
      names.prefix, '')
  }

  /**
   * Creates an event of the type specified.
   * 
   * This method is not supported by this module and will throw an
   * exception.
   * 
   * @param eventInterface - a string representing the type of event 
   * to be created
   */
  createEvent(eventInterface: string): never {
    throw DOMException.NotSupportedError
  }

  /**
   * Creates a new Range object.
   * 
   * This method is not supported by this module and will throw an
   * exception.
   */
  createRange(): never {
    throw DOMException.NotSupportedError
  }

  /**
   * Creates a new NodeIterator object.
   * 
   * This method is not supported by this module and will throw an
   * exception.
   */
  createNodeIterator(root: Node, whatToShow: number = NodeFilter.ShowAll,
    filter: NodeFilter | null = null): never {
    throw DOMException.NotSupportedError
  }

  /**
   * Creates a new TreeWalker object.
   * 
   * This method is not supported by this module and will throw an
   * exception.
   */
  createTreeWalker(root: Node, whatToShow: number = NodeFilter.ShowAll,
    filter: NodeFilter | null = null): never {
    throw DOMException.NotSupportedError
  }

  /**
   * Returns a duplicate of this node, i.e., serves as a generic copy 
   * constructor for nodes. The duplicate node has no parent 
   * ({@link parentNode} returns `null`).
   *
   * @param deep - if `true`, recursively clone the subtree under the 
   * specified node; if `false`, clone only the node itself (and its 
   * attributes, if it is an {@link Element}).
   */
  cloneNode(deep: boolean = false): Node {
    let clonedSelf = new Document()

    // clone child nodes
    if (deep) {
      for (let child of this.childNodes) {
        let clonedChild = child.cloneNode(deep)
        clonedSelf.appendChild(clonedChild)
      }
    }
    
    return clonedSelf
  }

  /**
   * Returns the prefix for a given namespace URI, if present, and 
   * `null` if not.
   * 
   * @param namespace - the namespace to search
   */
  lookupPrefix(namespace: string | null): string | null {
    if (!namespace) return null

    if (this.documentElement)
      return this.documentElement.lookupPrefix(namespace)

    return null
  }

  /**
   * Returns the namespace URI for a given prefix if present, and `null`
   * if not.
   * 
   * @param prefix - the prefix to search
   */
  lookupNamespaceURI(prefix: string | null): string | null {
    if (!prefix) prefix = null

    if (this.documentElement)
      return this.documentElement.lookupNamespaceURI(prefix)

    return null
  }

  /**
   * Returns the child elements.
   */
  children(): HTMLCollection { throw "" }

  /**
   * Returns the first child that is an element, and `null` otherwise.
   */
  firstElementChild(): Element | null { throw "" }

  /**
   * Returns the last child that is an element, and `null` otherwise.
   */
  lastElementChild(): Element | null { throw "" }

  /**
   * Returns the number of children that are elements.
   */
  childElementCount(): number { throw "" }

  /**
   * Prepends the list of nodes or strings before the first child node.
   * Strings are converted into {@link Text} nodes.
   * 
   * @param nodes - the array of nodes or strings
   */
  prepend(nodes: [Node | string]): void { throw "" }

  /**
   * Appends the list of nodes or strings after the last child node.
   * Strings are converted into {@link Text} nodes.
   * 
   * @param nodes - the array of nodes or strings
   */
  append(nodes: [Node | string]): void { throw "" }

  /**
   * Returns the first element that is a descendant of node that
   * matches selectors.
   * 
   * This method is not supported by this module and will throw an
   * exception.
   * 
   * @param selectors - a selectors string
   */
  querySelector(selectors: string): Element | null { throw "" }

  /**
   * Returns all element descendants of node that match selectors.
   * 
   * This method is not supported by this module and will throw an
   * exception.
   * 
   * @param selectors - a selectors string
   */
  querySelectorAll(selectors: string): NodeList { throw "" }

  /**
   * Converts the given nodes or strings into a node (if there `nodes`
   * has only one element) or a document fragment.
   * 
   * @param nodes - the array of nodes or strings
   */
  protected convertNodesIntoNode(nodes: [Node | string], document: Document): Node { throw "" }
}
