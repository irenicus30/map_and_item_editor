const fs = require('fs');

const NODE_ESC = 0xfd;
const NODE_INIT = 0xfe;
const NODE_TERM = 0xff;

class Stack {
  constructor(...args) {
    this.store = [...args];
  }

  push(value) {
    return this.store.push(value);
  }

  pop() {
    return this.store.pop();
  }

  peek() {
    return this.store[this.store.length - 1];
  }
}

function readOtb(fileName) {
  function extractProps(currentNode, data) {
    let i = currentNode.propsBegin;
    let length = 0;
    while (i < currentNode.propsEnd) {
      const byte = data.readUInt8(i);
      switch (byte) {
        case NODE_ESC:
          i += 1;
          break;
        default:
          break;
      }
      length += 1;
      i += 1;
    }
    // eslint-disable-next-line no-param-reassign
    currentNode.props = new Uint8Array(length);
    i = currentNode.propsBegin;
    let propsPosition = 0;
    while (i < currentNode.propsEnd) {
      let byte = data.readUInt8(i);
      switch (byte) {
        case NODE_ESC: {
          i += 1;
          byte = data.readUInt8(i);
          break;
        }
        default: {
          break;
        }
      }
      // eslint-disable-next-line no-param-reassign
      currentNode.props[propsPosition] = byte;
      propsPosition += 1;
      i += 1;
    }
  }
  function parseTree(data) {
    let i = 4; // magic 4 bytes are already checked here
    i += 1; // skipped byte should be NODE_INIT
    const root = {};
    root.type = data.readUInt8(i);
    i += 1;
    root.children = [];
    root.propsBegin = i;

    const parseStack = new Stack();
    parseStack.push(root);

    while (i < data.length) {
      const byte = data.readUInt8(i);
      let currentNode = {};
      const child = {};
      switch (byte) {
        case NODE_INIT: {
          currentNode = parseStack.peek();
          if (currentNode.children.length === 0) {
            currentNode.propsEnd = i;
            extractProps(currentNode, data);
          }
          currentNode.children.push(child);
          i += 1;
          child.type = data.readUInt8(i);
          child.children = [];
          child.propsBegin = i + 1;
          parseStack.push(child);
          break;
        }
        case NODE_TERM: {
          currentNode = parseStack.peek();
          if (currentNode.children.length === 0) {
            currentNode.propsEnd = i;
            extractProps(currentNode, data);
          }
          parseStack.pop();
          break;
        }
        case NODE_ESC: {
          i += 1;
          break;
        }
        default: {
          break;
        }
      }
      i += 1;
    }
    return root;
  }

  const data = fs.readFileSync(fileName);

  const MAP_IDENTIFIER = data.readUInt32LE(0);

  // Confirm OTB format by reading magic bytes (NULL or "OTBI" or "OTBM")
  if (
    MAP_IDENTIFIER !== 0x00000000 &&
    MAP_IDENTIFIER !== 0x4d425449 &&
    MAP_IDENTIFIER !== 0x4d42544f
  ) {
    throw new Error('Unknown OTB format: unexpected magic bytes.');
  }

  const rootNode = parseTree(data);

  return rootNode;
}

function writeOtb(fileName, rootNode) {
  function getPropsLength(node) {
    let thisNodePropsLength = 0;
    node.props.forEach(Uint8Value => {
      if (
        Uint8Value === NODE_ESC ||
        Uint8Value === NODE_INIT ||
        Uint8Value === NODE_TERM
      )
        thisNodePropsLength += 2;
      else thisNodePropsLength += 1;
    });
    return thisNodePropsLength;
  }

  function getLength(node) {
    let thisNodeSize = 1; // type
    thisNodeSize += getPropsLength(node);
    node.children.forEach(child => {
      const childSize = getLength(child);
      thisNodeSize += 1 + childSize + 1; // 2 for NODE_INIT and NODE_TERM
    });
    return thisNodeSize;
  }

  function serializeProps(node, data, position) {
    let i = position;
    node.props.forEach(Uint8Value => {
      if (
        Uint8Value === NODE_ESC ||
        Uint8Value === NODE_INIT ||
        Uint8Value === NODE_TERM
      ) {
        data.writeUInt8(NODE_ESC, i);
        i += 1;
        data.writeUInt8(Uint8Value, i);
        i += 1;
      } else {
        data.writeUInt8(Uint8Value, i);
        i += 1;
      }
    });
    return i;
  }

  function serializeNode(node, data, position) {
    let i = position;
    const { type } = node;
    data.writeUInt8(type, i);
    i += 1;

    i = serializeProps(node, data, i);

    if (node.children !== undefined) {
      node.children.forEach(child => {
        data.writeUInt8(NODE_INIT, i);
        i += 1;

        i = serializeNode(child, data, i);

        data.writeUInt8(NODE_TERM, i);
        i += 1;
      });
    }
    return i;
  }

  const MAP_IDENTIFIER = 0x00000000; // magic bytes - 0 are universal
  const size = getLength(rootNode) + 4;

  const data = Buffer.allocUnsafe(size);
  let i = 0; // offset for buffer writing
  data.writeUInt32LE(MAP_IDENTIFIER, i);
  i += 4;
  i = serializeNode(rootNode, data, i);

  fs.writeFileSync(fileName, data);

  return true;
}

module.exports.readOtb = readOtb;
module.exports.writeOtb = writeOtb;
