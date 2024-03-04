"use strict";

import { MYFREECAMS_DOMAINS } from "./servers.js";
import { loadDomainList } from "./servers.js";
import { saveDomainList } from "./servers.js";
import { getServerList } from "./servers.js";

const nodeModelCount = document.querySelector(".model-count");
const nodeModelListRoot = document.querySelector(".model-list");
const nodeWchat = document.querySelector(".wchat");

//FC server commands
const FC_COMMAND_HELLO = "fcsws_20180422\n\0";
const FC_COMMAND_LOGIN = "1 0 0 20071025 0 1/guest:guest\n\0";
const FC_COMMAND_PING = "0 0 0 0 0\n\0";
//const FC_COMMAND_LOGOUT = "99 0 0 0 0\n\0";

//Full constant list is here: https://assets.myfreecams.com/_js/mfccore.js?vcc=1709255195
const FCTYPE_SESSIONSTATE = 20;
const FCL_CAMS = 21;
const FCVIDEO_RX_IDLE = 90;
const FCVIDEO_RX_CLUB = 94;
const FCVIDEO_RX_GRP = 93;
const FCVIDEO_RX_PVT = 91;
const FCVIDEO_TX_CLUB = 14;
const FCVIDEO_TX_GRP = 13;
const FCVIDEO_TX_PVT = 12;
const FCVIDEO_TX_IDLE = 0;
const FCVIDEO_TX_AWAY = 2;
const FCVIDEO_OFFLINE = 127;
const FCS_CHANNEL_ID_START = 100000000;
const ACCESS_LEVEL_MODEL = 4;

let timerPing = null;
const modelList = [];
const packets = [];
let WCHAT;

function isJson(s) {
    return (s.startsWith("%7B") && s.endsWith("%7D")) || (s.startsWith("{") && s.endsWith("}"));
}

function isModelOnline(modelObj) {
    return modelObj.state !== undefined && modelObj.state !== null &&
        modelObj.state !== FCVIDEO_OFFLINE && modelObj.state !== FCVIDEO_RX_IDLE && modelObj.state !== FCVIDEO_TX_AWAY;
}

function isModelConnected(modelObj) {
    return modelObj.state !== modelObj.previousState &&
        modelObj.state !== FCVIDEO_RX_IDLE &&
        modelObj.state !== FCVIDEO_TX_AWAY &&
        modelObj.state !== FCVIDEO_OFFLINE &&
        (modelObj.previousState === FCVIDEO_OFFLINE || modelObj.previousState === FCVIDEO_RX_IDLE || modelObj.previousState === FCVIDEO_TX_AWAY ||
        modelObj.previousState === undefined || modelObj.previousState === null);
}

function isModelDisconnected(modelObj) {
    return modelObj.state !== modelObj.previousState &&
        (modelObj.state === FCVIDEO_OFFLINE ||
        modelObj.state === FCVIDEO_RX_IDLE ||
        modelObj.state === FCVIDEO_TX_AWAY ||
        modelObj.state === undefined || modelObj.state === null) &&
        modelObj.previousState === FCVIDEO_TX_IDLE;
}

async function getRandomWchat() {
    const serverList = await getServerList();
    if (serverList.chat_servers?.length === 0) { return ""; }

    let wchat = "";
    let tries = 0;
    while (!wchat.startsWith("wchat") && tries++ <= 100) {
        const randomInt = Math.floor(Math.random() * serverList.chat_servers.length);
        wchat = serverList.chat_servers[randomInt];
    }

    return wchat;
}

function getFcslUrl() {
    return `wss://${WCHAT}.myfreecams.com/fcsl`;
}

export async function fetchJsonBypassCors(url) {
    //To get it working, you must run a special local HTTP-server.
    //You can build suitable one from C# source code: https://github.com/BlackMightyRavenDark/Fetch-server
    try {
        const proxyUrl = `http://127.0.0.1:5555/fetch?${encodeURIComponent(url)}`;
        const r = await fetch(proxyUrl);
        return r.status === 200 ? await r.json() : null;
    } catch (ex) {
        console.error(`${getFormattedDateTime()}> The CORS bypassing server is down!`);
        console.error(ex);
        return null;
    }
}

async function getModelListResponceJson(msg) {
    const arg1 = msg["msg"]["arg1"];
    const arg2 = msg["msg"]["arg2"];
    const respKey = msg["respkey"];
    const serverId = msg["serv"];

    for (let i = 0; i < MYFREECAMS_DOMAINS.length; ++i) {
        const ncValue = Math.round(new Date().getTime() / 600000);

        const query = new URLSearchParams();
        query.append("host", WCHAT);
        query.append("respkey", respKey);
        query.append("type", "14");
        query.append("opts", "256");
        query.append("serv", serverId);
        query.append("arg1", arg1);
        query.append("arg2", arg2);
        query.append("owner", "0");
        query.append("nc", ncValue);
        query.append("debug", "cams");

        const url = `${MYFREECAMS_DOMAINS[i]}/php/FcwExtResp.php?${query.toString()}`;
        const response = await fetchJsonBypassCors(url);
        if (response) {
            if (i > 0) {
                const tmp = MYFREECAMS_DOMAINS[i];
                MYFREECAMS_DOMAINS.splice(i, 1);
                MYFREECAMS_DOMAINS.splice(0, 0, tmp);

                saveDomainList();
            }

            return response;
        } else {
            console.error(`${getFormattedDateTime()}> Can't get full model list!`);
        }
    }

    return null;
}

function parseModelList(unparsedJson) {
    //TODO: Write a clever parser relying on received "dataConfig" fields order.
    const rData = unparsedJson["rdata"];
    if (rData?.length > 1) {
        const dataConfig = rData[0];
        if (dataConfig) {
            for (let i = 1; i < rData.length; ++i) {
                if (rData[i][5] !== ACCESS_LEVEL_MODEL) { continue; }
                const modelName = rData[i][0];
                const modelObj = findOrCreateModelInList(modelName);
                if (!modelObj["country"]) {
                    modelObj["country"] = "";
                }
                modelObj["name"] = modelName;
                modelObj["sessionId"] = rData[i][1];
                modelObj["userId"] = rData[i][2];
                modelObj["state"] = rData[i][3];
                modelObj["previousState"] = modelObj["state"];
                modelObj["platformId"] = rData[i][4];
                modelObj["accessLevel"] = rData[i][5];
                modelObj["camServer"] = rData[i][6];
                modelObj["phase"] = rData[i][7];
                modelObj["chatColor"] = rData[i][8];
                modelObj["chatFont"] = rData[i][9];
                modelObj["chatOpt"] = rData[i][10];
                modelObj["creation"] = rData[i][11];
                modelObj["avatar"] = rData[i][12];
                modelObj["profile"] = rData[i][13];
                modelObj["photoCount"] = rData[i][14];
                modelObj["about"] = rData[i][15];
                modelObj["isNewModel"] = rData[i][16];
                modelObj["isMissMfc"] = rData[i][17];
                modelObj["camScore"] = rData[i][18];
                if (!modelObj["continent"]) {
                    modelObj["continent"] = rData[i][19] || "";
                }
                modelObj["flags"] = rData[i][20];
                modelObj["rank"] = rData[i][21];
                modelObj["rc"] = rData[i][22];
                modelObj["topic"] = decodeURIComponent(rData[i][23]);
                modelObj["hidecs"] = rData[i][24];

                if (!modelObj["avatarUrl"]) {
                    modelObj["avatarUrl"] = getModelAvatarUrl(modelObj["userId"]);
                }

                if (dataConfig.length > 8) {
                    const xObj = dataConfig[8]["x"];
                    if (xObj) {
                        const x = {};
                        for (let k in xObj) {
                            const id = parseInt(k);
                            x[xObj[id]] = rData[i][id + 25];
                        }
                        modelObj["x"] = x;
                    }
                }

                addOrUpdateModelNode(modelObj);
            }
        }
    }
}

function getModelIdFromUserId(userId) {
    return FCS_CHANNEL_ID_START + userId;
}

async function getHlsPlaylistUrl(modelObj, aCheckBoxChecked) {
    const modelId = getModelIdFromUserId(modelObj.userId);
    const realCamServerId = await getRealCamServerId(modelObj.camServer, modelId);
    const clientVersion = "1.97.22";
    const randomNumberNc = Math.random();

    //Sometimes, we need to add 'a_' between 'mfc_' and '${modelId}', like this: 'mfc_a_${modelId}'.
    //It's working for some models. I don't know why.
    const aParameterValue = aCheckBoxChecked ? "a_" : "";
    const query = new URLSearchParams();
    query.append("nc", randomNumberNc);
    query.append("v", clientVersion);

    const edgeVideoDomain = "https://edgevideo.myfreecams.com";
    return `${edgeVideoDomain}/llhls/NxServer/${realCamServerId}/ngrp:mfc_${aParameterValue}${modelId}.f4v_cmaf/playlist_sfm4s.m3u8?${query.toString()}`;
}

async function getRealCamServerId(camServ, modelId) {
    if (!camServ) { return 0; }

    const regExp = /^\D+/g;
    const serverList = await getServerList();
    if (serverList.wzobs_servers.hasOwnProperty(camServ)) {
        const id = serverList.wzobs_servers[camServ];
        return id.replace(regExp, "");
    } else if (serverList.ngvideo_servers.hasOwnProperty(camServ)) {
        const id = serverList.ngvideo_servers[camServ];
        return id.replace(regExp, "");
    } else if (serverList.h5video_servers.hasOwnProperty(camServ)) {
        const id = serverList.h5video_servers[camServ];
        return id.replace(regExp, "");
    } else {
        let realCamServer;
        if (camServ >= 3000) {
            realCamServer = camServ - 1000;
        } else if (camServ >= 1690) {
            realCamServer = camServ - 700;
        } else {
            realCamServer = camServ > 500 ? camServ - 500 : camServ;
        }

        const typeOfModelId = typeof(modelId);
        if ((typeOfModelId === "number" || typeOfModelId === "bigint") && modelId >= FCS_CHANNEL_ID_START) {
            realCamServer -= 200;
        }

        return realCamServer;
    }
}

function getModelAvatarUrl(userId, avatarImageSizeXY) {
    if (!userId) { return ""; }

    const typeOfUserId = typeof(userId);
    const userIdString = typeOfUserId === "string" ? userId : (typeOfUserId === "number" || typeOfUserId === "bigint") ? userId.toString() : "";
    if (!userIdString || userIdString.length < 3) { return ""; }
    const firstThree = userIdString.substring(0, 3);
    if (!avatarImageSizeXY || avatarImageSizeXY < 10) { avatarImageSizeXY = 90; }

    return `https://img.mfcimg.com/photos2/${firstThree}/${userIdString}/avatar.${avatarImageSizeXY}x${avatarImageSizeXY}.jpg`;
}

async function processPacket(packet) {
    const splitted = packet.split(" ");
    if (splitted.length > 5 && isJson(splitted[5])) {
        const decoded = decodeURIComponent(splitted[5]);
        const j = JSON.parse(decoded);
        if (j["respkey"] && j.msg?.arg2 === FCL_CAMS) {
            const unparsedModelsData = await getModelListResponceJson(j);
            if (unparsedModelsData) {
                parseModelList(unparsedModelsData);
            }
            return null;
        }

        const fcType = splitted[0];
        const accessLevel = j["lv"];
        if (fcType == FCTYPE_SESSIONSTATE && accessLevel === ACCESS_LEVEL_MODEL) {
            const modelName = j["nm"];
            if (modelName) {
                const modelObj = findOrCreateModelInList(modelName);
                modelObj["name"] = modelName;
                modelObj["userId"] = j["uid"];
                modelObj["accessLevel"] = accessLevel;
                modelObj["sessionId"] = j["sid"];
                modelObj["plaformId"] = j["pid"];
                modelObj["state"] = j["vs"];

                const uObj = j["u"];
                if (uObj) {
                    const age = modelObj["age"] || 0;
                    if (age === 0) {
                        modelObj["age"] = uObj["age"] || 0;
                    }
                    modelObj["about"] = uObj["blurb"];
                    if (!modelObj["camServer"]) {
                        const newCamServer = uObj["camserv"];
                        if (newCamServer) {
                            modelObj["camServer"] = newCamServer;
                        }
                    }
                    if (!modelObj["country"]) {
                        modelObj["country"] = uObj["country"]?.trim() || "";
                    }
                    if (!modelObj["city"]) {
                        modelObj["city"] = uObj["city"]?.trim() || "";
                    }
                    modelObj["creation"] = uObj["creation"];
                    modelObj["ethnic"] = uObj["ethnic"];
                    if (!modelObj["profile"]) {
                        modelObj["profile"] = uObj["profile"];
                    }
                }

                const mObj = j["m"];
                if (mObj) {
                    if (!modelObj["continent"]) {
                        modelObj["continent"] = mObj["continent"];
                    }
                    modelObj["topic"] = decodeURIComponent(mObj["topic"]) || "";
                }

                if (!modelObj["avatarUrl"]) {
                    modelObj["avatarUrl"] = getModelAvatarUrl(modelObj["userId"]);
                }

                if (isModelConnected(modelObj)) {
                    //console.log(`${getFormattedDateTime()}> Model ${modelObj.name} is connected`);
                    modelObj["previousState"] = modelObj.state;
                } else if (isModelDisconnected(modelObj)) {
                    //console.log(`${getFormattedDateTime()}> Model ${modelObj.name} is disconnected`);
                    modelObj["previousState"] = modelObj.state;
                }

                addOrUpdateModelNode(modelObj);
                return modelObj;
            }
        }
    }

    return null;
}

function getModelInList(modelName) {
    const length = modelList.length;
    for (let i = 0; i < length; ++i) {
        if (modelList[i].name === modelName) { return modelList[i]; }
    }

    return null;
}

function findOrCreateModelInList(modelName) {
    const model = getModelInList(modelName);
    if (model) { return model; }

    const newModel = {};
    modelList.push(newModel);
    return newModel;
}

function findOrCreateModelNode(modelName) {
    const children = nodeModelListRoot.childNodes;
    const length = children.length;
    for (let i = 0; i < length; ++i) {
        const nameAttr = children[i].attributes["modelname"].nodeValue;
        if (nameAttr === modelName) {
            return children[i];
        }
    }

    const node = document.createElement("div");
    node.setAttribute("modelname", modelName);
    node.classList.add("model-item");
    nodeModelListRoot.appendChild(node);
    return node;
}

async function addOrUpdateModelNode(modelObj) {
    const nodeModel = findOrCreateModelNode(modelObj.name);
    if (nodeModel.childNodes.length === 0) {
        const nodeName = document.createElement("div");
        nodeName.textContent = modelObj.name;

        const nodeAge = document.createElement("div");
        nodeAge.textContent = `Age: ${modelObj.age ? modelObj.age : "[N / A]"}`;

        const nodeStreamState = document.createElement("div");
        nodeStreamState.textContent = `Stream state: ${modelObj.state}`;

        const nodeStreamStateDescribed = document.createElement("div");
        nodeStreamStateDescribed.textContent = getStreamStateDescription(modelObj.state);

        const nodeUserLocation = document.createElement("div");
        nodeUserLocation.textContent = formatUserLocation(modelObj);

        const nodeCheckBoxA = document.createElement("input");
        nodeCheckBoxA.setAttribute("type", "checkbox");
        nodeCheckBoxA.setAttribute("title", "Set/unset misterious 'a_' parameter in URL (it's needed sometimes)");
        nodeCheckBoxA.setAttribute("id", `${modelObj.name}_${modelObj.userId}_${Math.random()}`);
        nodeCheckBoxA.onchange = (e) => addOrUpdateModelNode(modelObj);

        const url = await getHlsPlaylistUrl(modelObj, false);
        const nodeUrl = document.createElement("a");
        nodeUrl.textContent = url;
        nodeUrl.setAttribute("href", url);
        nodeUrl.setAttribute("target", "_blank");

        const nodeNameAgeWrapper = document.createElement("div");
        nodeNameAgeWrapper.appendChild(nodeName);
        nodeNameAgeWrapper.appendChild(nodeAge);

        const nodeStreamStateWrapper = document.createElement("div");
        nodeStreamStateWrapper.style.color = getStreamStateLabelColor(modelObj);
        nodeStreamStateWrapper.appendChild(nodeStreamState);
        nodeStreamStateWrapper.appendChild(nodeStreamStateDescribed);

        const nodeUrlWrapper = document.createElement("div");
        nodeUrlWrapper.appendChild(nodeCheckBoxA);
        nodeUrlWrapper.appendChild(nodeUrl);

        const nodeModelData = document.createElement("div");
        nodeModelData.classList.add("model-data");
        nodeModelData.appendChild(nodeNameAgeWrapper);
        nodeModelData.appendChild(nodeStreamStateWrapper);
        nodeModelData.appendChild(nodeUserLocation);

        nodeModel.appendChild(nodeModelData);
        nodeModel.appendChild(nodeUrlWrapper);
    } else {
        const nodeUserLocation = nodeModel.childNodes[0].childNodes[2];
        const nodeStreamState = nodeModel.childNodes[0].childNodes[1].childNodes[0];
        const nodeStreamStateDescribed = nodeModel.childNodes[0].childNodes[1].childNodes[1];
        const nodeCheckBoxA = nodeModel.childNodes[1].childNodes[0];
        const nodeUrl = nodeModel.childNodes[1].childNodes[1];

        nodeUserLocation.textContent = formatUserLocation(modelObj);

        nodeStreamState.textContent = `Stream state: ${modelObj.state}`;
        nodeStreamState.parentNode.style.color = getStreamStateLabelColor(modelObj);
        nodeStreamStateDescribed.textContent = getStreamStateDescription(modelObj.state);

        const url = await getHlsPlaylistUrl(modelObj, nodeCheckBoxA.checked);
        nodeUrl.textContent = url;
        nodeUrl.setAttribute("href", url);
    }

    const countData = getModelCount();
    let s = `Found models: ${modelList.length}, Online: ${countData.online}`;
    if (countData.online) { s += ` (Free: ${countData.free}, Paid: ${countData.paid})`; }
    nodeModelCount.textContent = s;
}

function formatUserLocation(modelObj) {
    let t = "";
    if (modelObj.country) { t += modelObj.country; }
    if (modelObj.continent) { t += modelObj.country ? ` [${modelObj.continent}]` : `[${modelObj.continent}]`; }
    if (modelObj.city) { t += t ? `, ${modelObj.city}` : modelObj.city; }
    return t;
}

function getStreamStateLabelColor(modelObj) {
    switch (modelObj.state) {
        case FCVIDEO_TX_IDLE:
            return "lime";

        case FCVIDEO_OFFLINE:
        case FCVIDEO_TX_AWAY:
        case FCVIDEO_RX_IDLE:
            return "white";

        default: return "orange";
    }
}

function getStreamStateDescription(state) {
    switch (state) {
        case FCVIDEO_TX_IDLE:
            return "Online (Free)";

        case FCVIDEO_TX_CLUB:
        case FCVIDEO_RX_CLUB:
            return "Online (Club show)";

        case FCVIDEO_TX_GRP:
        case FCVIDEO_RX_GRP:
            return "Online (Group show)";

        case FCVIDEO_TX_PVT:
        case FCVIDEO_RX_PVT:
            return "Online (Private show)";

        case FCVIDEO_TX_AWAY:
            return "Offline (Away)";

        case FCVIDEO_OFFLINE:
        case FCVIDEO_RX_IDLE:
            return "Offline";

        default: return "Unknown";
    }
}

function getModelCount() {
    let onlineCount = 0;
    let freeCount = 0;
    let paidCount = 0;

    modelList.forEach(element => {
        switch (element.state) {
            case FCVIDEO_TX_IDLE:
                onlineCount++;
                freeCount++;
                break;

            case FCVIDEO_OFFLINE:
            case FCVIDEO_TX_AWAY:
            case FCVIDEO_RX_IDLE:
                break;

            default:
                onlineCount++;
                paidCount++;
                break;
        }
    });

    return { "online": onlineCount, "free": freeCount, "paid": paidCount };
}

function clearChildNodes(node) {
    while (node.childNodes.length) {
        node.removeChild(node.childNodes[0]);
    }
}

async function connectSocket() {
    WCHAT = await getRandomWchat();
    const socket = new WebSocket(getFcslUrl());

    socket.onopen = function(e) {
        nodeWchat.textContent = `Server: ${WCHAT}`;
        console.log(`${getFormattedDateTime()}> Connection is established`);
        socket.send(FC_COMMAND_HELLO);
        socket.send(FC_COMMAND_LOGIN);

        timerPing = setInterval(() => socket.send(FC_COMMAND_PING), 10000);
        console.log(`${getFormattedDateTime()}> The ping timer is activated`);
    }

    socket.onmessage = function(event)	{
        //Process a message from the server.
        //Don't try to understand this black magic :)

        if (!event || !event.data || event.data.length < 1) { return; }

        let m_sQueued = "";
        let nPos = 0;

        m_sQueued += event.data;

        while (nPos + 6 < m_sQueued.length)	{
            // get length of data chunk
            const slicedString = m_sQueued.slice(nPos, nPos + 6);
            const nStrLen = parseInt(slicedString);

            // get data chunk
            if (nStrLen > 0 && nStrLen < 1000000) {
                if (nPos + nStrLen + 6 > m_sQueued.length) {
                    // We can't process this packet yet, lets queue it until we get more data
                    console.error(`${getFormattedDateTime()}> Must queue ${m_sQueued.length - nPos} bytes, pos: ${nPos}, strlen: ${nStrLen} overruns m_sQueued.length: ${m_sQueued.length}`);
                    break;
                }

                const sChunk = m_sQueued.slice(nPos + 6, nPos + nStrLen + 6); // nStrLen includes additional 2?

                if (sChunk != -1) {
                    packets.push(sChunk);
                } else {
                    console.error(`${getFormattedDateTime()}> onmessage: chunk sz ${nStrLen}, but slice failed (-1), pos: ${nPos}, m_sQueued.length: ${m_sQueued.length}`);
                    break;
                }

                nPos += nStrLen + 6;
            } else {
                console.error(`${getFormattedDateTime()}> onmessage: 'nStrLen' is bad: ${nStrLen}, nPos: ${nPos}, m_sQueued.length: ${m_sQueued.length}`);
                return;
            }
        }

        while (packets.length) {
            processPacket(packets[0]);
            packets.splice(0, 1);
        }
    };

    socket.onerror = function(e) {
        console.error(`${getFormattedDateTime()}> Socket error`);
        clearInterval(timerPing);
        timerPing = null;
        console.log(`${getFormattedDateTime()}> The ping timer is deactivated`);
    }

    socket.onclose = function(e) {
        nodeWchat.textContent = "Reconnecting...";
        console.log(`${getFormattedDateTime()}> The socket is closed`);
        clearInterval(timerPing);
        console.log(`${getFormattedDateTime()}> The ping timer is deactivated`);

        console.log(`${getFormattedDateTime()}> Reconnecting in 3 seconds...`);

        setTimeout(() => connectSocket(), 3000);
    }
}

export function getFormattedDateTime() {
    const date = new Date();
    return date.toUTCString();
}

function start() {
    async function run() {
        clearChildNodes(nodeModelListRoot);
        loadDomainList();
        await getServerList();
        connectSocket();
    }
    run();
}
start();
