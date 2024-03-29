/* eslint-disable */
const { TextDecoder, TextEncoder } = require('util');
const fileloader = require('./fileloader');
const mapsloader = require('./mapsloader.js');

const NODE_ESC = 0xFD;
const NODE_INIT = 0xFE;
const NODE_TERM = 0xFF;
/*
	OTBM_ROOTV1
	|
	|--- OTBM_MAP_DATA
	|	|
	|	|--- OTBM_TILE_AREA
	|	|	|--- OTBM_TILE
	|	|	|--- OTBM_TILE_SQUARE (not implemented)
	|	|	|--- OTBM_TILE_REF (not implemented)
	|	|	|--- OTBM_HOUSETILE
	|	|
	|	|--- OTBM_SPAWNS (not implemented)
	|	|	|--- OTBM_SPAWN_AREA (not implemented)
	|	|	|--- OTBM_MONSTER (not implemented)
	|	|
	|	|--- OTBM_TOWNS
	|	|	|--- OTBM_TOWN
	|	|
	|	|--- OTBM_WAYPOINTS
	|		|--- OTBM_WAYPOINT
	|
	|--- OTBM_ITEM_DEF (not implemented)
*/

function readFlags(flags) {
    return {      
        'protection': flags & mapsloader.TILESTATE_PROTECTIONZONE,
        'noPVP': flags & mapsloader.TILESTATE_NOPVP,
        'noLogout': flags & mapsloader.TILESTATE_NOLOGOUT,
        'PVPZone': flags & mapsloader.TILESTATE_PVPZONE,
        'refresh': flags & mapsloader.TILESTATE_REFRESH
    };
}
function serializeFlags(zones) {
    let flags = 0x0;
    if(zones.protection === mapsloader.TILESTATE_PROTECTIONZONE) flags |= mapsloader.TILESTATE_PROTECTIONZONE;
    if(zones.noPVP === mapsloader.TILESTATE_NOPVP) flags |= mapsloader.TILESTATE_NOPVP;
    if(zones.noLogout === mapsloader.TILESTATE_NOLOGOUT) flags |= mapsloader.TILESTATE_NOLOGOUT;
    if(zones.PVPZone === mapsloader.TILESTATE_PVPZONE) flags |= mapsloader.TILESTATE_PVPZONE;
    if(zones.refresh === mapsloader.TILESTATE_REFRESH) flags |= mapsloader.TILESTATE_REFRESH;
    return flags;
}

function loadFromOtbm(fileName) {

    const Node = function(rawNode) {
        
        const stream = new DataView(rawNode.props.buffer);
        let i = 0;
        
        // console.log('node type: ', rawNode.type)
        // console.log('children number: ', rawNode.children.length)
        // console.log('props begin: ', rawNode.propsBegin)
        // console.log('props end: ', rawNode.propsEnd)
        switch(rawNode.type) {
            case mapsloader.OTBM_MAP_HEADER: {
                this.type = 'OTBM_MAP_HEADER';
                this.version = stream.getUint32(i, true);
                i += 4;
                this.mapWidth = stream.getUint16(i, true);
                i += 2;
                this.mapHeight = stream.getUint16(i, true);
                i += 2;
                this.itemsMajorVersion = stream.getUint32(i, true);
                i += 4;
                this.itemsMinorVersion = stream.getUint32(i, true);
                i += 4;
                break;
            }

            case mapsloader.OTBM_MAP_DATA: {
                this.type = 'OTBM_MAP_DATA';
                i = this.readAttributes(stream, i);
                break;
            }

            case mapsloader.OTBM_TILE_AREA: {
                this.type = 'OTBM_TILE_AREA';
                this.x = stream.getUint16(i, true);
                i += 2;
                this.y = stream.getUint16(i, true);
                i += 2;
                this.z = stream.getUint8(i);
                i += 1;
                break;
            }

            case mapsloader.OTBM_TILE: {
                this.type = 'OTBM_TILE';
                this.x = stream.getUint8(i);
                i += 1;
                this.y = stream.getUint8(i);
                i += 1;
                i = this.readAttributes(stream, i);
                break;
            }

            case mapsloader.OTBM_ITEM: {
                this.type = 'OTBM_ITEM';
                this.id = stream.getUint16(i, true);
                i += 2;
                i = this.readAttributes(stream, i);
                break;
            }

            case mapsloader.OTBM_HOUSETILE: {
                this.type = 'OTBM_HOUSETILE';
                this.x = stream.getUint8(i);
                i += 1;
                this.y = stream.getUint8(i);
                i += 1;
                this.houseId = stream.getUint32(i, true);
                i += 4;
                i = this.readAttributes(stream, i);
                break;
            }

            case mapsloader.OTBM_WAYPOINTS: {
                this.type = 'OTBM_WAYPOINTS';
                break;
            }

            case mapsloader.OTBM_WAYPOINT: {
                this.type = 'OTBM_WAYPOINT';

                let nameLength = stream.getUint16(i, true);
                i += 2;                
                let nameBuffer = stream.buffer.slice(i, i+nameLength);
                let name = '';
                if (nameLength > 0)
                    name = new TextDecoder('utf-8')
                        .decode(nameBuffer);
                i += nameLength;
                this.name = name;
                
                this.x = stream.getUint16(i, true);
                i += 2;
                this.y = stream.getUint16(i, true);
                i += 2;
                this.z = stream.getUint8(i);
                i += 1;
                break;
            }

            case mapsloader.OTBM_TOWNS: {
                this.type = 'OTBM_TOWNS';
                break;
            }

            case mapsloader.OTBM_TOWN: {
                this.type = 'OTBM_TOWN';
                this.townId = stream.getUint32(i, true);
                i += 4;

                let nameLength = stream.getUint16(i, true);
                i += 2;                
                let nameBuffer = stream.buffer.slice(i, i+nameLength);
                let name = new TextDecoder('utf-8')
                    .decode(nameBuffer);
                i += nameLength;
                this.name = name;
                
                this.x = stream.getUint16(i, true);
                i += 2;
                this.x = stream.getUint16(i, true);
                i += 2;
                this.x = stream.getUint8(i);
                i += 1;
                break;
            }

            default: {
                console.log('Warning: unsupported node type ', rawNode.type);
                console.log('rawNode propsBegin propsEnd ', rawNode.propsBegin, ' ', rawNode.propsEnd);
            }
        }

        if (rawNode.children.length) {
            this.setChildren(rawNode.children);
        }
    }

    Node.prototype.readAttributes = function(stream, i) {
        
        while (i<stream.byteLength) {
            let attrib = stream.getUint8(i);
            i += 1;
            switch(attrib) {
                case mapsloader.OTBM_ATTR_TEXT: {
                    let textLength = stream.getUint16(i, true);
                    i += 2;                
                    let textBuffer = stream.buffer.slice(i, i+textLength);
                    let text = new TextDecoder('utf-8')
                        .decode(textBuffer);
                    i += textLength;
                    this.text = text;
                    break;
                }

                case mapsloader.OTBM_ATTR_EXT_SPAWN_FILE: {
                    let spawnFileLength = stream.getUint16(i, true);
                    i += 2;                
                    let spawnFileBuffer = stream.buffer.slice(i, i+spawnFileLength);
                    let spawnFile = new TextDecoder('utf-8')
                        .decode(spawnFileBuffer);
                    i += spawnFileLength;
                    this.spawnFile = spawnFile;
                    break;
                }

                case mapsloader.OTBM_ATTR_EXT_HOUSE_FILE: {
                    let houseFileLength = stream.getUint16(i, true);
                    i += 2;                
                    let houseFileBuffer = stream.buffer.slice(i, i+houseFileLength);
                    let houseFile = new TextDecoder('utf-8')
                        .decode(houseFileBuffer);
                    i += houseFileLength;
                    this.houseFile = houseFile;
                    break;
                }

                case mapsloader.OTBM_ATTR_HOUSEDOORID: {
                    this.houseDoorId = stream.getUint8(i);
                    i += 1;
                    break;
                }

                case mapsloader.OTBM_ATTR_DESCRIPTION: {
                    let descriptionStringLength = stream.getUint16(i, true);
                    i += 2;                
                    let descriptionStringBuffer = stream.buffer.slice(i, i+descriptionStringLength);
                    let descriptionString = new TextDecoder('utf-8')
                        .decode(descriptionStringBuffer);
                    i += descriptionStringLength;
                    if (this.description)
                        this.description += ' ' + descriptionString;
                    else
                        this.description =  descriptionString;
                    break;
                }

                case mapsloader.OTBM_ATTR_DESC: {
                    let descriptionLength = stream.getUint16(i, true);
                    i += 2;                
                    let descriptionBuffer = stream.buffer.slice(i, i+descriptionLength);
                    let description = new TextDecoder('utf-8')
                        .decode(descriptionBuffer);
                    i += descriptionLength;
                    this.text =  description;
                    break;
                }

                case mapsloader.OTBM_ATTR_DEPOT_ID: {
                    this.depotId = stream.getUint16(i, true);
                    i += 2;
                    break;
                }

                case mapsloader.OTBM_ATTR_TILE_FLAGS: {
                    let flags = stream.getUint32(i, true);
                    i += 4;
                    this.zones = readFlags(flags);
                    break;
                }

                case mapsloader.OTBM_ATTR_RUNE_CHARGES: {
                    this.runeCharges = stream.getUint16(i, true);
                    i += 1;
                    break;
                }

                case mapsloader.OTBM_ATTR_COUNT: {
                    this.count = stream.getUint8(i);
                    i += 1;
                    break;
                }

                case mapsloader.OTBM_ATTR_CHARGES: {
                    this.count = stream.getUint16(i, true);
                    i += 2;
                    break;
                }

                case mapsloader.OTBM_ATTR_ITEM: {
                    this.tileid = stream.getUint16(i, true);
                    i += 2;
                    break;
                }

                case mapsloader.OTBM_ATTR_ACTION_ID: {
                    this.aid = stream.getUint16(i, true);
                    i += 2;
                    break;
                }

                case mapsloader.OTBM_ATTR_UNIQUE_ID: {
                    this.uid = stream.getUint16(i, true);
                    i += 2;
                    break;
                }

                // (x, y, z) using 2, 2, 1 bytes little endian
                case mapsloader.OTBM_ATTR_TELE_DEST: {
                    this.destination = {
                        x: stream.getUint16(i, true),
                        y: stream.getUint16(i+2, true),
                        z: stream.getUint8(i+4)
                    };
                    i += 5;
                    break;
                }

                case mapsloader.OTBM_ATTR_WRITTENDATE: {
                    this.writtendate = stream.getUint32(i, true);
                    i += 4;
                    break;
                }

                case mapsloader.OTBM_ATTR_WRITTENBY: {
                    let writtenbyLength = stream.getUint16(i, true);
                    i += 2;                
                    let writtenbyBuffer = stream.buffer.slice(i, i+writtenbyLength);
                    let writtenby = new TextDecoder('utf-8')
                        .decode(writtenbyBuffer);
                    i += writtenbyLength;
                    this.writtenby =  writtenby;
                    break;
                }

                default: {
                    console.log('Warning: unsupported node attribute ', attrib);
                    console.log('node type ', this.type);
                    console.log('stream bytelength: ', stream.byteLength);
                    let s = '';
                    for(let j=0; j<stream.byteLength; j++) {
                        s += stream.getUint8(j) + ' ';
                    }
                    console.log(s)
                }
            }
        }
        return i;
    }

    Node.prototype.setChildren = function (children) {
        switch (this.type) {
            case 'OTBM_TILE_AREA': {
                this.tiles = children
                    .map( child => new Node(child) );
                break;
            }

            case 'OTBM_TILE':
            case 'OTBM_HOUSETILE': {
                this.items = children
                    .map( child => new Node(child) );
                break;
            }

            case 'OTBM_TOWNS': {
                this.towns = children
                    .map( child => new Node(child) );
                break;
            }

            case 'OTBM_ITEM': {
                this.content = children
                    .map( child => new Node(child) );
                break;
            }

            case 'OTBM_MAP_DATA': {
                this.features = children
                    .map( child => new Node(child) );
                break;
            }

            default: {
                this.nodes = children
                    .map( child => new Node(child) );
                break;
            }
        }
    }


    const root = fileloader.readOtb(fileName);
    const map = new Node(root);

    const MAP_IDENTIFIER = 0x4D42544F;
    // Create an object to hold the data
    var mapData = {
      "identifier": MAP_IDENTIFIER,
      "data": map
    }
    return mapData;
}

function saveToOtbm(fileName, mapData) {
    const { data } = map;

    
    function getAttributesSize(node) {
        let size = 0;
        
        if(node.text !== undefined) {
            size += 1 + 2 + node.text.length; // attrib text.length text
        }
        if(node.spawnFile !== undefined) {
            size += 1 + 2 + node.spawnFile.length; // attrib spawnFile.length spawnFile
        }
        if(node.houseFile !== undefined) {
            size += 1 + 2 + node.houseFile.length; // attrib houseFile.length houseFile
        }
        if(node.houseDoorId !== undefined) {
            size += 1 + 1; // attrib houseDoorId
        }
        if(node.description !== undefined) {
            size += 1 + 2 + node.description.length; // attrib description.length description
        }
        if(node.depotId !== undefined) {
            size += 1 + 2; // attrib depotId
        }
        if(node.depotId !== undefined) {
            size += 1 + 4; // attrib flags
        }
        if(node.runeCharges !== undefined) {
            size += 1 + 1; // attrib runeCharges
        }
        if(node.count !== undefined) {
            size += 1 + 2; // attrib count
        }
        if(node.tileid !== undefined) {
            size += 1 + 2; // attrib tileid
        }
        if(node.aid !== undefined) {
            size += 1 + 2; // attrib aid
        }
        if(node.uid !== undefined) {
            size += 1 + 2; // attrib uid
        }
        if(node.destination !== undefined) {
            size += 1 + 5; // attrib destination
        }
        if(node.writtendate !== undefined) {
            size += 1 + 4; // attrib writtendate
        }
        if(node.writtenby !== undefined) {
            size += 1 + 2 + node.writtenby.length; // attrib writtenby.length writtenby
        }

        return size;
    }


    function putAttributesIntoBuffer(node, buffer, position) {
        let i = position;
        
        if(node.text !== undefined) {
            buffer.writeUInt8(mapsloader.OTBM_ATTR_TEXT, i);
            i += 1;
            buffer.writeUInt16LE(node.text.length, i);
            i += 2;
            buffer.write(node.text, i, node.text.length);
            i += node.text.length;
            // attrib text.length text
        }
        if(node.spawnFile !== undefined) {
            buffer.writeUInt8(mapsloader.OTBM_ATTR_EXT_SPAWN_FILE, i);
            i += 1;
            buffer.writeUInt16LE(node.spawnFile.length, i);
            i += 2;
            buffer.write(node.spawnFile, i, node.spawnFile.length);
            i += node.spawnFile.length;
            // attrib spawnFile.length spawnFile
        }
        if(node.houseFile !== undefined) {
            buffer.writeUInt8(mapsloader.OTBM_ATTR_EXT_HOUSE_FILE, i);
            i += 1;
            buffer.writeUInt16LE(node.houseFile.length, i);
            i += 2;
            buffer.write(node.houseFile, i, node.houseFile.length);
            i += node.houseFile.length;
            // attrib houseFile.length houseFile
        }
        if(node.houseDoorId !== undefined) {
            buffer.writeUInt8(mapsloader.OTBM_ATTR_HOUSEDOORID, i);
            i += 1;
            buffer.writeUInt8(node.houseDoorId, i);
            i += 1;
            // attrib houseDoorId
        }
        if(node.description !== undefined) {
            buffer.writeUInt8(mapsloader.OTBM_ATTR_DESCRIPTION, i);
            i += 1;
            buffer.writeUInt16LE(node.description.length, i);
            i += 2;
            buffer.write(node.description, i, node.description.length);
            i += node.description.length;
            // attrib description.length description
        }
        if(node.depotId !== undefined) {
            buffer.writeUInt8(mapsloader.OTBM_ATTR_DEPOT_ID, i);
            i += 1;
            buffer.writeUInt16LE(node.depotId, i);
            i += 2;
            // attrib depotId
        }
        if(node.depotId !== undefined) {
            buffer.writeUInt8(mapsloader.OTBM_ATTR_TILE_FLAGS, i);
            i += 1;            
            const flags = serializeFlags(node.zones);
            buffer.writeUInt32LE(flags, i);
            i += 4;
            // attrib flags
        }
        if(node.runeCharges !== undefined) {
            buffer.writeUInt8(mapsloader.OTBM_ATTR_RUNE_CHARGES, i);
            i += 1;
            buffer.writeUInt8(node.runeCharges, i);
            i += 1;
            // attrib runeCharges
        }
        if(node.count !== undefined) {
            buffer.writeUInt8(mapsloader.OTBM_ATTR_CHARGES, i);
            i += 1;
            buffer.writeUInt16LE(node.count, i);
            i += 2;
            // attrib count
        }
        if(node.tileid !== undefined) {
            buffer.writeUInt8(mapsloader.OTBM_ATTR_ITEM, i);
            i += 1;
            buffer.writeUInt16LE(node.tileid, i);
            i += 2;
            // attrib tileid
        }
        if(node.aid !== undefined) {
            buffer.writeUInt8(mapsloader.OTBM_ATTR_ACTION_ID, i);
            i += 1;
            buffer.writeUInt16LE(node.aid, i);
            i += 2;
            // attrib aid
        }
        if(node.uid !== undefined) {
            buffer.writeUInt8(mapsloader.OTBM_ATTR_UNIQUE_ID, i);
            i += 1;
            buffer.writeUInt16LE(node.uid, i);
            i += 2;
            // attrib uid
        }
        if(node.destination !== undefined) {
            buffer.writeUInt8(mapsloader.OTBM_ATTR_TELE_DEST, i);
            i += 1;
            buffer.writeUInt16LE(node.destination.x, i);
            i += 2;
            buffer.writeUInt16LE(node.destination.y, i);
            i += 2;
            buffer.writeUInt8(node.destination.z, i);
            i += 1;
            // attrib destination
        }
        if(node.writtendate !== undefined) {
            buffer.writeUInt8(mapsloader.OTBM_ATTR_WRITTENDATE, i);
            i += 1;
            buffer.writeUInt16LE(node.destination.x, i);
            i += 2;
            size += 1 + 4; // attrib writtendate
        }
        if(node.writtenby !== undefined) {
            buffer.writeUInt8(mapsloader.OTBM_ATTR_WRITTENBY, i);
            i += 1;
            buffer.writeUInt16LE(node.writtenby.length, i);
            i += 2;
            buffer.write(node.writtenby, i, node.writtenby.length);
            i += node.writtenby.length;
            // attrib writtenby.length writtenby
        }

        return i;
    }

    function getRawData(node) {
        const rawNode = {};
        
        switch(node.type) {
            case 'OTBM_MAP_HEADER': {
                rawNode.type = mapsloader.OTBM_MAP_HEADER;

                let bufferSize = 4 + 2 + 2 + 4 + 4; // version mapWidth mapHeight itemsMajorVersion itemsMinorVersion
                bufferSize += getAttributesSize(node);

                const buffer = Buffer.allocUnsafe(bufferSize);
                let i = 0;
                buffer.writeUInt32LE(node.version, i);
                i += 4;
                buffer.writeUInt16LE(node.mapWidth, i);
                i += 2;
                buffer.writeUInt16LE(node.mapHeight, i);
                i += 2;
                buffer.writeUInt32LE(node.itemsMajorVersion, i);
                i += 4;
                buffer.writeUInt32LE(node.itemsMinorVersion, i);
                i += 4;
                i = putAttributesIntoBuffer(node, buffer, i);

                rawNode.props = new Uint8Array(buffer);
                break;
            }

            case 'OTBM_MAP_DATA': {
                rawNode.type = mapsloader.OTBM_MAP_DATA;

                let bufferSize = getAttributesSize(node);

                const buffer = Buffer.allocUnsafe(bufferSize);
                let i = 0;
                i = putAttributesIntoBuffer(node, buffer, i);

                rawNode.props = new Uint8Array(buffer);
                break;
            }

            case 'OTBM_TILE_AREA': {
                rawNode.type = mapsloader.OTBM_TILE_AREA;

                let bufferSize = 2 + 2 + 1; // x y z
                bufferSize += getAttributesSize(node);

                const buffer = Buffer.allocUnsafe(bufferSize);
                let i = 0;
                buffer.writeUInt16LE(node.x, i);
                i += 2;
                buffer.writeUInt16LE(node.y, i);
                i += 2;
                buffer.writeUInt8(node.z, i);
                i += 1;
                i = putAttributesIntoBuffer(node, buffer, i);

                rawNode.props = new Uint8Array(buffer);
                break;
            }

            case 'OTBM_TILE': {
                rawNode.type = mapsloader.OTBM_TILE;

                let bufferSize = 1 + 1; // x y
                bufferSize += getAttributesSize(node);

                const buffer = Buffer.allocUnsafe(bufferSize);
                let i = 0;
                buffer.writeUInt8(node.x, i);
                i += 1;
                buffer.writeUInt8(node.y, i);
                i += 1;
                i = putAttributesIntoBuffer(node, buffer, i);

                rawNode.props = new Uint8Array(buffer);
                break;
            }

            case 'OTBM_ITEM': {
                rawNode.type = mapsloader.OTBM_ITEM;

                let bufferSize = 2; // id
                bufferSize += getAttributesSize(node);

                const buffer = Buffer.allocUnsafe(bufferSize);
                let i = 0;
                buffer.writeUInt16LE(node.id, i);
                i += 2;
                i = putAttributesIntoBuffer(node, buffer, i);

                rawNode.props = new Uint8Array(buffer);
                break;
            }

            case 'OTBM_HOUSETILE': {
                rawNode.type = mapsloader.OTBM_HOUSETILE;

                let bufferSize = 1 + 1 + 4; // x y houseId
                bufferSize += getAttributesSize(node);

                const buffer = Buffer.allocUnsafe(bufferSize);
                let i = 0;
                buffer.writeUInt8(node.x, i);
                i += 1;
                buffer.writeUInt8(node.y, i);
                i += 1;
                buffer.writeUInt32LE(node.houseId, i);
                i += 4;
                i = putAttributesIntoBuffer(node, buffer, i);

                rawNode.props = new Uint8Array(buffer);
                break;
            }

            case 'OTBM_WAYPOINTS': {
                rawNode.type = mapsloader.OTBM_WAYPOINTS;
                rawNode.props = new Uint8Array(0);
                break;
            }

            case 'OTBM_WAYPOINT': {
                rawNode.type = mapsloader.OTBM_WAYPOINT;

                let bufferSize = 2 + node.name.length + 2 + 2 + 1; // nameLength name x y z
                bufferSize += getAttributesSize(node);

                const buffer = Buffer.allocUnsafe(bufferSize);
                let i = 0;
                buffer.writeUInt16LE(node.name.length, i);
                i += 2;
                buffer.write(node.name, i);
                i += node.name.length;
                buffer.writeUInt16LE(node.x, i);
                i += 2;
                buffer.writeUInt16LE(node.y, i);
                i += 2;
                buffer.writeUInt8(node.z, i);
                i += 1;
                i = putAttributesIntoBuffer(node, buffer, i);

                rawNode.props = new Uint8Array(buffer);
                break;
            }

            case 'OTBM_TOWNS': {
                rawNode.type = mapsloader.OTBM_TOWNS;
                rawNode.props = new Uint8Array(0);
                break;
            }

            case 'OTBM_TOWN': {
                rawNode.type = mapsloader.OTBM_TOWN;

                let bufferSize = 4 + 2 + node.name.length + 2 + 2 + 1; // townId nameLength name x y z
                bufferSize += getAttributesSize(node);

                const buffer = Buffer.allocUnsafe(bufferSize);
                let i = 0;
                buffer.writeUInt32LE(node.townId, i);
                i += 4;
                buffer.writeUInt16LE(node.name.length, i);
                i += 2;
                buffer.write(node.name, i);
                i += node.name.length;
                buffer.writeUInt16LE(node.x, i);
                i += 2;
                buffer.writeUInt16LE(node.y, i);
                i += 2;
                buffer.writeUInt8(node.z, i);
                i += 1;
                i = putAttributesIntoBuffer(node, buffer, i);

                rawNode.props = new Uint8Array(buffer);
                break;
            }

            default: {
                console.log('Warning: unsupported node type ', node.type);
            }
        }

        let childrenBeforeMap = [];

        switch (node.type) {
            case 'OTBM_TILE_AREA': {
                childrenBeforeMap = node.tiles;
                break;
            }

            case 'OTBM_TILE':
            case 'OTBM_HOUSETILE': {
                childrenBeforeMap = node.items;
                break;
            }

            case 'OTBM_TOWNS': {
                childrenBeforeMap = node.towns;
                break;
            }

            case 'OTBM_ITEM': {
                childrenBeforeMap = node.content;
                break;
            }

            case 'OTBM_MAP_DATA': {
                childrenBeforeMap = node.features;
                break;
            }

            default: {
                childrenBeforeMap = node.nodes;
                break;
            }
        }
        rawNode.children = childrenBeforeMap.map(child => getRawData(child));


        return rawNode;
    }

    const root = getRawData(map);

    writeOtb(fileName, root);
}

module.exports.loadFromOtbm = loadFromOtbm;
module.exports.saveToOtbm = saveToOtbm;
