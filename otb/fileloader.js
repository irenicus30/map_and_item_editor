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
    currentNode.extractProps = [];
    currentNode.extractProps[0] = data.readUInt8(currentNode.propsEnd);
    currentNode.extractProps[1] = data.readUInt8(currentNode.propsEnd+1);
    currentNode.extractProps[2] = data.readUInt8(currentNode.propsEnd+2);
    currentNode.extractProps[3] = data.readUInt8(currentNode.propsEnd+3);
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

module.exports.readOtb = readOtb;
// module.exports.writeOtb = writeOtb;
