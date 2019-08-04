/* eslint-disable */
const { TextDecoder } = require('util');
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

function loadFromOtb(fileName) {

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
                this.x = stream.getUint16(i, true);
                i += 2;
                this.x = stream.getUint8(i);
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

module.exports.loadFromOtb = loadFromOtb;
