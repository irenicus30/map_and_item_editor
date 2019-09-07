const fileloader = require('./fileloader');
const itemloader = require('./itemloader.js');

function hasBitSet(flag, flags) {
  return (flags & flag) !== 0; // eslint-disable-line no-bitwise
}

function loadFromOtb(fileName) {
  const root = fileloader.readOtb(fileName);

  const rootDataView = new DataView(root.props.buffer);
  // don't care about 4 bytes flags at the beggining, go to 5th byte
  const attr = rootDataView.getUint8(4);
  if (attr === itemloader.ROOT_ATTR_VERSION) {
    const majorVersion = rootDataView.getUint32(7, true); // items otb format file version
    const minorVersion = rootDataView.getUint32(11, true); // client version
    const buildNumber = rootDataView.getUint32(15, true); // revision
    // console.log('majorVersion: ', majorVersion);
    // console.log('minorVersion: ', minorVersion);
    // console.log('buildNumber: ', buildNumber);
  } else {
    throw new Error('No version info items otb file');
  }

  const items = [];

  root.children.forEach(itemNode => {
    const stream = new DataView(itemNode.props.buffer);
    let flags = 0; // 32 bits
    flags = stream.getUint32(0, true); // revision

    let serverId = 0; // 16 bits
    let clientId = 0; // 16 bits
    let speed = 0; // 16 bits
    let wareId = 0; // 16 bits
    let lightLevel = 0; // 8 bits
    let lightColor = 0; // 8 bits
    let alwaysOnTopOrder = 0; // 8 bits

    let attrib = 0; // 8 bits
    let datalen = 0; // 16 bits

    let i = 4; // current position in props stream, after reading flags 4
    while (i < stream.byteLength) {
      attrib = stream.getUint8(i);
      i += 1;
      datalen = stream.getUint16(i, true);
      i += 2;
      switch (attrib) {
        case itemloader.ITEM_ATTR_SERVERID: {
          serverId = stream.getUint16(i, true);
          i += 2;
          if (serverId > 30000 && serverId < 30100) {
            serverId -= 30000;
          }
          break;
        }

        case itemloader.ITEM_ATTR_CLIENTID: {
          if (datalen !== 2) {
            console.log('datalene: ', datalen);
            throw new Error('Invalid format');
          }
          clientId = stream.getUint16(i, true);
          i += 2;
          break;
        }

        case itemloader.ITEM_ATTR_SPEED: {
          if (datalen !== 2) {
            console.log('datalene: ', datalen);
            throw new Error('Invalid format');
          }
          speed = stream.getUint16(i, true);
          i += 2;
          break;
        }

        case itemloader.ITEM_ATTR_LIGHT2: {
          if (datalen !== 4) {
            console.log('datalene: ', datalen);
            throw new Error('Invalid format');
          }
          lightLevel = stream.getUint16(i, true);
          i += 2;
          lightColor = stream.getUint16(i, true);
          i += 2;
          break;
        }

        case itemloader.ITEM_ATTR_TOPORDER: {
          if (datalen !== 1) {
            console.log('datalene: ', datalen);
            throw new Error('Invalid format');
          }
          alwaysOnTopOrder = stream.getUint8(i);
          i += 1;
          break;
        }

        case itemloader.ITEM_ATTR_WAREID: {
          if (datalen !== 2) {
            console.log('datalene: ', datalen);
            throw new Error('Invalid format');
          }
          wareId = stream.getUint16(i, true);
          i += 2;
          break;
        }

        default: {
          i += datalen;
          break;
        }
      }
    }

    items[serverId] = {};
    const iType = items[serverId];
    iType.group = itemNode.type;
    iType.type = 0;
    switch (itemNode.type) {
      case itemloader.ITEM_GROUP_CONTAINER:
        iType.type = itemloader.ITEM_TYPE_CONTAINER;
        break;
      case itemloader.ITEM_GROUP_DOOR:
        // not used
        iType.type = itemloader.ITEM_TYPE_DOOR;
        break;
      case itemloader.ITEM_GROUP_MAGICFIELD:
        // not used
        iType.type = itemloader.ITEM_TYPE_MAGICFIELD;
        break;
      case itemloader.ITEM_GROUP_TELEPORT:
        // not used
        iType.type = itemloader.ITEM_TYPE_TELEPORT;
        break;
      case itemloader.ITEM_GROUP_NONE:
      case itemloader.ITEM_GROUP_GROUND:
      case itemloader.ITEM_GROUP_SPLASH:
      case itemloader.ITEM_GROUP_FLUID:
      case itemloader.ITEM_GROUP_CHARGES:
      case itemloader.ITEM_GROUP_DEPRECATED:
        break;
      default:
        console.log('itemNode.propsBegin: ', itemNode.propsBegin);
        console.log('itemNode.propsEnd: ', itemNode.propsEnd);
        console.log('itemNode.type: ', itemNode.type);
        throw new Error('Invalid format');
    }

    iType.blockSolid = hasBitSet(itemloader.FLAG_BLOCK_SOLID, flags);
    iType.blockProjectile = hasBitSet(itemloader.FLAG_BLOCK_PROJECTILE, flags);
    iType.blockPathFind = hasBitSet(itemloader.FLAG_BLOCK_PATHFIND, flags);
    iType.hasHeight = hasBitSet(itemloader.FLAG_HAS_HEIGHT, flags);
    iType.useable = hasBitSet(itemloader.FLAG_USEABLE, flags);
    iType.pickupable = hasBitSet(itemloader.FLAG_PICKUPABLE, flags);
    iType.moveable = hasBitSet(itemloader.FLAG_MOVEABLE, flags);
    iType.stackable = hasBitSet(itemloader.FLAG_STACKABLE, flags);

    iType.alwaysOnTop = hasBitSet(itemloader.FLAG_ALWAYSONTOP, flags);
    iType.isVertical = hasBitSet(itemloader.FLAG_VERTICAL, flags);
    iType.isHorizontal = hasBitSet(itemloader.FLAG_HORIZONTAL, flags);
    iType.isHangable = hasBitSet(itemloader.FLAG_HANGABLE, flags);
    iType.allowDistRead = hasBitSet(itemloader.FLAG_ALLOWDISTREAD, flags);
    iType.rotatable = hasBitSet(itemloader.FLAG_ROTATABLE, flags);
    iType.canReadText = hasBitSet(itemloader.FLAG_READABLE, flags);
    iType.lookThrough = hasBitSet(itemloader.FLAG_LOOKTHROUGH, flags);
    iType.isAnimation = hasBitSet(itemloader.FLAG_ANIMATION, flags);
    // iType.walkStack = !hasBitSet(itemloader.FLAG_FULLTILE, flags);
    iType.forceUse = hasBitSet(itemloader.FLAG_FORCEUSE, flags);

    iType.id = serverId;
    iType.clientId = clientId;
    iType.speed = speed;
    iType.lightLevel = lightLevel;
    iType.lightColor = lightColor;
    iType.wareId = wareId;
    iType.alwaysOnTopOrder = alwaysOnTopOrder;
  });
  return items;
}

function convertToOtb(items) {


  
}

module.exports.loadFromOtb = loadFromOtb;
module.exports.convertToOtb = convertToOtb;

