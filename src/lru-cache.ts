class Node<K, V> {
  constructor(
    public key: K,
    public value: V,
    public prev?: Node<K, V>,
    public next?: Node<K, V>
  ) {}
}

export class LRUCache<K, V> {
  #maxSize!: number
  #map = new Map<K, Node<K, V>>()

  #head?: Node<K, V>
  #tail?: Node<K, V>

  constructor(maxSize = 100) {
    this.#maxSize = maxSize
  }

  #moveToFront(node: Node<K, V>) {
    if (node === this.#head) return

    this.#removeNode(node)
    this.#addFront(node)
  }

  #addFront(node: Node<K, V>) {
    node.prev = undefined
    node.next = this.#head

    if (this.#head) this.#head.prev = node
    this.#head = node

    if (!this.#tail) this.#tail = node
  }

  #removeNode(node: Node<K, V>) {
    if (node.prev) node.prev.next = node.next
    if (node.next) node.next.prev = node.prev

    if (node === this.#head) this.#head = node.next
    if (node === this.#tail) this.#tail = node.prev
  }

  #evict() {
    if (!this.#tail) return

    const node = this.#tail
    this.#removeNode(node)
    this.#map.delete(node.key)
  }

  getOrSet(key: K, factory: () => V): V {
    let val = this.get(key)
    if (val !== undefined) return val

    val = factory()
    this.set(key, val)
    return val
  }

  get(key: K): V | undefined {
    const node = this.#map.get(key)
    if (!node) return

    this.#moveToFront(node)
    return node.value
  }

  peek(key: K): V | undefined {
    return this.#map.get(key)?.value
  }

  set(key: K, value: V) {
    let node = this.#map.get(key)

    if (node) {
      node.value = value
      this.#moveToFront(node)
      return
    }

    node = new Node(key, value)
    this.#map.set(key, node)
    this.#addFront(node)

    if (this.#map.size > this.#maxSize) {
      this.#evict()
    }
  }

  delete(key: K) {
    const node = this.#map.get(key)
    if (!node) return false

    this.#removeNode(node)
    this.#map.delete(key)
    return true
  }

  clear() {
    this.#map.clear()
    this.#head = undefined
    this.#tail = undefined
  }

  get size() {
    return this.#map.size
  }
}
