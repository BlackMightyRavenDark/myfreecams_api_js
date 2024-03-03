import { fetchJsonBypassCors } from "./main.js";
import { getFormattedDateTime } from "./main.js"

const predefinedServerList = {
    "ajax_servers": [],
    "chat_servers": ["wchat74", "wchat75", "wchat67", "wchat14", "wchat16", "wchat17", "wchat18", "wchat19", "wchat5", "wchat7", "wchat8", "wchat10", "wchat11", "wchat12", "wchat13", "wchat15", "wchat21", "wchat22", "wchat23", "wchat24", "wchat25", "wchat26", "wchat28", "wchat29", "wchat30", "wchat31", "wchat32", "wchat34", "wchat35", "wchat36", "wchat37", "wchat38", "wchat39", "wchat41", "wchat43", "wchat44", "wchat45", "wchat46", "wchat47", "wchat48", "wchat49", "wchat50", "wchat51", "wchat52", "wchat53", "wchat54", "wchat55", "wchat56", "wchat57", "wchat58", "wchat59", "wchat60", "wchat61", "wchat62", "wchat63", "wchat64", "wchat66", "wchat68", "wchat69", "wchat70", "wchat71", "wchat72", "wchat73", "zbuild-edgetool", "dynworker-b168a06e1a9db9721fd269", "dynworker-1894edfc2e702ec061837b", "dynworker-ac5421e6fb12133d7c0078", "dynworker-27a5bc5564d5a9342c83e1", "dynworker-4a0a3dd573eac3a4117c7a", "dynworker-527eceb2b3f549e733f7db"],
    "h5video_servers": {
        "1099": "myvideo99",
        "1128": "video628",
        "1129": "video629",
        "1130": "video630",
        "1131": "video631",
        "1132": "video632",
        "1133": "video633",
        "1134": "video634",
        "1135": "video635",
        "1136": "video636",
        "1137": "video637",
        "1138": "video638",
        "1139": "video639",
        "1140": "video640",
        "1141": "video641",
        "1142": "video642",
        "1143": "video643",
        "1144": "video644",
        "1145": "video645",
        "1146": "video646",
        "1147": "video647",
        "1148": "video648",
        "1149": "video649",
        "1150": "video650",
        "1151": "video651",
        "1152": "video652",
        "1153": "video653",
        "1154": "video654",
        "1155": "video655",
        "1156": "video656",
        "1157": "video657",
        "1158": "video658",
        "1159": "video659",
        "1200": "video700",
        "1201": "video701",
        "1202": "video702",
        "1203": "video703",
        "1204": "video704",
        "1205": "video705",
        "1206": "video706",
        "1207": "video707",
        "1208": "video708",
        "1209": "video709",
        "1210": "video710",
        "1211": "video711",
        "1212": "video712",
        "1213": "video713",
        "1214": "video714",
        "1215": "video715",
        "1216": "video716",
        "1217": "video717",
        "1218": "video718",
        "1219": "video719",
        "1220": "video720",
        "1221": "video721",
        "1222": "video722",
        "1223": "video723",
        "1224": "video724",
        "1225": "video725",
        "1226": "video726",
        "1227": "video727",
        "1228": "video728",
        "1229": "video729",
        "1230": "video730",
        "1231": "video731",
        "1232": "video732",
        "1233": "video733",
        "1234": "video734",
        "1235": "video735",
        "1236": "video736",
        "1237": "video737",
        "1238": "video738",
        "1239": "video739",
        "1240": "video740",
        "1241": "video741",
        "1242": "video742",
        "1243": "video743",
        "1244": "video744",
        "1245": "video745",
        "1246": "video746",
        "1247": "video747",
        "1248": "video748",
        "1249": "video749",
        "1250": "video750",
        "1251": "video751",
        "1252": "video752",
        "1253": "video753",
        "1254": "video754",
        "1255": "video755",
        "1256": "video756",
        "1257": "video757",
        "1258": "video758",
        "1259": "video759",
        "1260": "video760",
        "1261": "video761",
        "1262": "video762",
        "1263": "video763",
        "1264": "video764",
        "1265": "video765",
        "1266": "video766",
        "1267": "video767",
        "1268": "video768",
        "1269": "video769",
        "1270": "video770",
        "1271": "video771",
        "1272": "video772",
        "1273": "video773",
        "1274": "video774",
        "1275": "video775",
        "1276": "video776",
        "1277": "video777",
        "1278": "video778",
        "1279": "video779",
        "1280": "video780",
        "1281": "video781",
        "1282": "video782",
        "1283": "video783",
        "1284": "video784",
        "1285": "video785",
        "1286": "video786",
        "1287": "video787",
        "1288": "video788",
        "1289": "video789",
        "1290": "video790",
        "1291": "video791",
        "1292": "video792",
        "1293": "video793",
        "1294": "video794",
        "1295": "video795",
        "1296": "video796",
        "1297": "video797",
        "1298": "video798",
        "1299": "video799",
        "1300": "video800",
        "1301": "video801",
        "1302": "video802",
        "1303": "video803",
        "1304": "video804",
        "1305": "video805",
        "1306": "video806",
        "1307": "video807",
        "1308": "video808",
        "1309": "video809",
        "1310": "video810",
        "1311": "video811",
        "1312": "video812",
        "1313": "video813",
        "1314": "video814",
        "1315": "video815",
        "1316": "video816",
        "1317": "video817",
        "1318": "video818",
        "1319": "video819",
        "1320": "video820",
        "1321": "video821",
        "1322": "video822",
        "1323": "video823",
        "1324": "video824",
        "1325": "video825",
        "1326": "video826",
        "1327": "video827",
        "1328": "video828",
        "1329": "video829",
        "1330": "video830",
        "1331": "video831",
        "1332": "video832",
        "1333": "video833",
        "1334": "video834",
        "1335": "video835",
        "1336": "video836",
        "1337": "video837",
        "1338": "video838",
        "1339": "video839",
        "1340": "video840",
        "1341": "video841",
        "1342": "video842",
        "1343": "video843",
        "1344": "video844",
        "1345": "video845",
        "1346": "video846",
        "1347": "video847",
        "1348": "video848",
        "1349": "video849",
        "1350": "video850",
        "1351": "video851",
        "1352": "video852",
        "1353": "video853",
        "1354": "video854",
        "1355": "video855",
        "1356": "video856",
        "1357": "video857",
        "1358": "video858",
        "1359": "video859",
        "1360": "video860",
        "1361": "video861",
        "1362": "video862",
        "1363": "video863",
        "1364": "video864",
        "1365": "video865",
        "1366": "video866",
        "1367": "video867",
        "1368": "video868",
        "1369": "video869",
        "1370": "video870",
        "1371": "video871",
        "1372": "video872",
        "1373": "video873",
        "1374": "video874",
        "1375": "video875",
        "1376": "video876",
        "1377": "video877",
        "1378": "video878",
        "1379": "video879",
        "1380": "video880",
        "1381": "video881",
        "1382": "video882",
        "1383": "video883",
        "1384": "video884",
        "1385": "video885",
        "1386": "video886",
        "1387": "video887",
        "1388": "video888",
        "1389": "video889",
        "1391": "video891",
        "1392": "video892",
        "1393": "video893",
        "1394": "video894",
        "1395": "video895",
        "1396": "video896",
        "1397": "video897",
        "1399": "video899",
        "1600": "video900",
        "1601": "video901",
        "1602": "video902",
        "1603": "video903",
        "1604": "video904",
        "1605": "video905",
        "1606": "video906",
        "1607": "video907",
        "1608": "video908",
        "1609": "video909",
        "1610": "video910",
        "1611": "video911",
        "1612": "video912",
        "1613": "video913",
        "1614": "video914",
        "1615": "video915",
        "1616": "video916",
        "1617": "video917",
        "1618": "video918",
        "1619": "video919",
        "1620": "video920",
        "1621": "video921",
        "1622": "video922",
        "1623": "video923",
        "1624": "video924",
        "1625": "video925",
        "1626": "video926",
        "1627": "video927",
        "1628": "video928",
        "1629": "video929",
        "1630": "video930",
        "1631": "video931",
        "1632": "video932",
        "1633": "video933",
        "1634": "video934",
        "1635": "video935",
        "1636": "video936",
        "1637": "video937",
        "1638": "video938",
        "1639": "video939",
        "1640": "video940",
        "1641": "video941",
        "1642": "video942",
        "1643": "video943",
        "1644": "video944",
        "1645": "video945",
        "1646": "video946",
        "1647": "video947",
        "1648": "video948",
        "1649": "video949",
        "1650": "video950",
        "1651": "video951",
        "1652": "video952",
        "1653": "video953",
        "1654": "video954",
        "1655": "video955",
        "1656": "video956",
        "1657": "video957",
        "1658": "video958",
        "1659": "video959",
        "1660": "video960",
        "1661": "video961",
        "1662": "video962",
        "1663": "video963",
        "1664": "video964",
        "1870": "video1170",
        "1871": "video1171",
        "1872": "video1172",
        "1873": "video1173",
        "1874": "video1174",
        "1875": "video1175",
        "1876": "video1176",
        "1877": "video1177",
        "1878": "video1178",
        "1879": "video1179",
        "1880": "video1180",
        "1881": "video1181",
        "1882": "video1182",
        "1883": "video1183",
        "1884": "video1184",
        "1885": "video1185",
        "1886": "video1186",
        "1887": "video1187",
        "1888": "video1188",
        "1891": "video1191",
        "1892": "video1192",
        "1893": "video1193",
        "1894": "video1194",
        "1895": "video1195",
        "1896": "video1196",
        "1897": "video1197",
        "1898": "video1198",
        "1899": "video1199",
        "1900": "video1200",
        "1901": "video1201",
        "1902": "video1202",
        "1903": "video1203",
        "1904": "video1204",
        "1905": "video1205",
        "1906": "video1206",
        "1907": "video1207",
        "1908": "video1208",
        "1909": "video1209",
        "1910": "video1210",
        "1911": "video1211",
        "1912": "video1212",
        "1913": "video1213",
        "1914": "video1214",
        "1915": "video1215",
        "1916": "video1216",
        "1917": "video1217",
        "1918": "video1218",
        "1919": "video1219",
        "1920": "video1220",
        "1921": "video1221",
        "1922": "video1222",
        "1923": "video1223",
        "1924": "video1224",
        "1925": "video1225",
        "1926": "video1226",
        "1927": "video1227",
        "1928": "video1228",
        "1929": "video1229",
        "1930": "video1230",
        "1931": "video1231",
        "1932": "video1232",
        "1933": "video1233",
        "1934": "video1234",
        "1935": "video1235",
        "1936": "video1236",
        "1937": "video1237",
        "1938": "video1238",
        "1939": "video1239",
        "1940": "video1240",
        "1941": "video1241",
        "1942": "video1242",
        "1943": "video1243",
        "1944": "video1244",
        "840": "video340",
        "841": "video341",
        "842": "video342",
        "844": "video344",
        "845": "video345",
        "846": "video346",
        "847": "video347",
        "848": "video348",
        "849": "video349",
        "850": "video350",
        "851": "video351",
        "852": "video352",
        "853": "video353",
        "854": "video354",
        "855": "video355",
        "856": "video356",
        "857": "video357",
        "858": "video358",
        "859": "video359",
        "860": "video360",
        "861": "video361",
        "862": "video362",
        "863": "video363",
        "864": "video364",
        "865": "video365",
        "866": "video366",
        "867": "video367",
        "868": "video368",
        "869": "video369",
        "942": "video442",
        "943": "video443",
        "944": "video444",
        "945": "video445",
        "946": "video446",
        "947": "video447",
        "948": "video448",
        "949": "video449",
        "950": "video450",
        "951": "video451",
        "952": "video452",
        "953": "video453",
        "954": "video454",
        "955": "video455"
    },
    "ngvideo_servers": {
        "1545": "video545",
        "1546": "video546",
        "1547": "video547",
        "1548": "video548",
        "1549": "video549",
        "1550": "video550",
        "1551": "video551",
        "1552": "video552",
        "1553": "video553",
        "1554": "video554",
        "1555": "video555",
        "1556": "video556",
        "1557": "video557",
        "1558": "video558",
        "1559": "video559",
        "3000": "video2000",
        "3001": "video2001",
        "3002": "video2002",
        "3003": "video2003",
        "3004": "video2004",
        "3005": "video2005",
        "3006": "video2006",
        "3007": "video2007",
        "3008": "video2008",
        "3009": "video2009",
        "3010": "video2010",
        "3011": "video2011",
        "3012": "video2012",
        "3013": "video2013",
        "3014": "video2014",
        "3015": "video2015",
        "3016": "video2016",
        "3040": "video2040"
    },
    "video_servers": [],
    "websocket_servers": {
        "wchat10": "rfc6455",
        "wchat11": "rfc6455",
        "wchat12": "rfc6455",
        "wchat13": "rfc6455",
        "wchat14": "rfc6455",
        "wchat15": "rfc6455",
        "wchat16": "rfc6455",
        "wchat17": "rfc6455",
        "wchat18": "rfc6455",
        "wchat19": "rfc6455",
        "wchat21": "rfc6455",
        "wchat22": "rfc6455",
        "wchat23": "rfc6455",
        "wchat24": "rfc6455",
        "wchat25": "rfc6455",
        "wchat26": "rfc6455",
        "wchat28": "rfc6455",
        "wchat29": "rfc6455",
        "wchat30": "rfc6455",
        "wchat31": "rfc6455",
        "wchat32": "rfc6455",
        "wchat34": "rfc6455",
        "wchat35": "rfc6455",
        "wchat36": "rfc6455",
        "wchat37": "rfc6455",
        "wchat38": "rfc6455",
        "wchat39": "rfc6455",
        "wchat41": "rfc6455",
        "wchat43": "rfc6455",
        "wchat44": "rfc6455",
        "wchat45": "rfc6455",
        "wchat46": "rfc6455",
        "wchat47": "rfc6455",
        "wchat48": "rfc6455",
        "wchat49": "rfc6455",
        "wchat5": "rfc6455",
        "wchat50": "rfc6455",
        "wchat51": "rfc6455",
        "wchat52": "rfc6455",
        "wchat53": "rfc6455",
        "wchat54": "rfc6455",
        "wchat55": "rfc6455",
        "wchat56": "rfc6455",
        "wchat57": "rfc6455",
        "wchat58": "rfc6455",
        "wchat59": "rfc6455",
        "wchat60": "rfc6455",
        "wchat61": "rfc6455",
        "wchat62": "rfc6455",
        "wchat63": "rfc6455",
        "wchat64": "rfc6455",
        "wchat66": "rfc6455",
        "wchat67": "rfc6455",
        "wchat68": "rfc6455",
        "wchat69": "rfc6455",
        "wchat7": "rfc6455",
        "wchat70": "rfc6455",
        "wchat71": "rfc6455",
        "wchat72": "rfc6455",
        "wchat73": "rfc6455",
        "wchat74": "hybi00",
        "wchat75": "rfc6455",
        "wchat8": "rfc6455"
    },
    "wsinfo": {},
    "wzext_servers": {
        "1199": "video699",
        "1390": "video890",
        "1398": "video898",
        "1665": "video965",
        "1666": "video966",
        "1667": "video967",
        "1668": "video968",
        "1669": "video969",
        "1670": "video970",
        "1671": "video971",
        "1672": "video972",
        "1673": "video973",
        "1674": "video974",
        "1675": "video975",
        "1676": "video976",
        "1677": "video977",
        "1678": "video978",
        "1679": "video979",
        "1680": "video980",
        "1681": "video981",
        "1682": "video982",
        "1683": "video983",
        "1684": "video984",
        "1685": "video985",
        "1686": "video986",
        "1687": "video987",
        "1688": "video988",
        "1689": "video989",
        "1691": "video991",
        "1692": "video992",
        "1693": "video993",
        "1694": "video994",
        "1695": "video995",
        "1696": "video996",
        "1697": "video997",
        "1698": "video998",
        "1699": "video999",
        "1700": "video1000",
        "1701": "video1001",
        "1702": "video1002",
        "1703": "video1003",
        "1704": "video1004",
        "1705": "video1005",
        "1706": "video1006",
        "1707": "video1007",
        "1708": "video1008",
        "1709": "video1009",
        "1710": "video1010",
        "1711": "video1011",
        "1712": "video1012",
        "1713": "video1013",
        "1714": "video1014",
        "1715": "video1015",
        "1716": "video1016",
        "1717": "video1017",
        "1718": "video1018",
        "1719": "video1019",
        "1720": "video1020",
        "1721": "video1021",
        "1722": "video1022",
        "1723": "video1023",
        "1724": "video1024",
        "1725": "video1025",
        "1726": "video1026",
        "1727": "video1027",
        "1728": "video1028",
        "1729": "video1029",
        "1730": "video1030",
        "1731": "video1031",
        "1732": "video1032",
        "1733": "video1033",
        "1734": "video1034",
        "1735": "video1035",
        "1736": "video1036",
        "1737": "video1037",
        "1738": "video1038",
        "1739": "video1039",
        "1740": "video1040",
        "1741": "video1041",
        "1742": "video1042",
        "1743": "video1043",
        "1744": "video1044",
        "1745": "video1045",
        "1746": "video1046",
        "1747": "video1047",
        "1748": "video1048",
        "1749": "video1049",
        "1750": "video1050",
        "1751": "video1051",
        "1752": "video1052",
        "1753": "video1053",
        "1754": "video1054",
        "1755": "video1055",
        "1756": "video1056",
        "1757": "video1057",
        "1758": "video1058",
        "1759": "video1059",
        "1760": "video1060",
        "1761": "video1061",
        "1762": "video1062",
        "1763": "video1063",
        "1764": "video1064",
        "1765": "video1065",
        "1766": "video1066",
        "1767": "video1067",
        "1768": "video1068",
        "1769": "video1069",
        "1770": "video1070",
        "1771": "video1071",
        "1772": "video1072",
        "1773": "video1073",
        "1774": "video1074",
        "1775": "video1075",
        "1776": "video1076",
        "1777": "video1077",
        "1778": "video1078",
        "1779": "video1079",
        "1780": "video1080",
        "1781": "video1081",
        "1782": "video1082",
        "1783": "video1083",
        "1784": "video1084",
        "1785": "video1085",
        "1786": "video1086",
        "1787": "video1087",
        "1788": "video1088",
        "1789": "video1089",
        "1791": "video1091",
        "1792": "video1092",
        "1793": "video1093",
        "1794": "video1094",
        "1795": "video1095",
        "1796": "video1096",
        "1797": "video1097",
        "1798": "video1098",
        "1799": "video1099",
        "1800": "video1100",
        "1801": "video1101",
        "1802": "video1102",
        "1803": "video1103",
        "1804": "video1104",
        "1805": "video1105",
        "1806": "video1106",
        "1807": "video1107",
        "1808": "video1108",
        "1809": "video1109",
        "1810": "video1110",
        "1811": "video1111",
        "1812": "video1112",
        "1813": "video1113",
        "1814": "video1114",
        "1815": "video1115",
        "1816": "video1116",
        "1817": "video1117",
        "1818": "video1118",
        "1819": "video1119",
        "1820": "video1120",
        "1821": "video1121",
        "1822": "video1122",
        "1823": "video1123",
        "1824": "video1124",
        "1825": "video1125",
        "1826": "video1126",
        "1827": "video1127",
        "1828": "video1128",
        "1829": "video1129",
        "1830": "video1130",
        "1831": "video1131",
        "1832": "video1132",
        "1833": "video1133",
        "1834": "video1134",
        "1835": "video1135",
        "1836": "video1136",
        "1837": "video1137",
        "1838": "video1138",
        "1839": "video1139",
        "1840": "video1140",
        "1841": "video1141",
        "1842": "video1142",
        "1843": "video1143",
        "1844": "video1144",
        "1845": "video1145",
        "1846": "video1146",
        "1847": "video1147",
        "1848": "video1148",
        "1849": "video1149",
        "1850": "video1150",
        "1851": "video1151",
        "1852": "video1152",
        "1853": "video1153",
        "1854": "video1154",
        "1855": "video1155",
        "1856": "video1156",
        "1857": "video1157",
        "1858": "video1158",
        "1859": "video1159",
        "1860": "video1160",
        "1861": "video1161",
        "1862": "video1162",
        "1863": "video1163",
        "1864": "video1164",
        "1865": "video1165",
        "1866": "video1166",
        "1867": "video1167",
        "1868": "video1168",
        "1869": "video1169",
        "843": "video343",
        "900": "video400",
        "901": "video401",
        "902": "video402",
        "903": "video403",
        "904": "video404",
        "905": "video405",
        "906": "video406",
        "907": "video407",
        "908": "video408",
        "909": "video409",
        "910": "video410",
        "911": "video411",
        "912": "video412",
        "913": "video413",
        "914": "video414",
        "915": "video415",
        "916": "video416",
        "917": "video417",
        "918": "video418",
        "919": "video419"
    },
    "wzobs_servers": {
        "1199": "video699",
        "1390": "video890",
        "1398": "video898",
        "1665": "video965",
        "1666": "video966",
        "1667": "video967",
        "1668": "video968",
        "1669": "video969",
        "1670": "video970",
        "1671": "video971",
        "1672": "video972",
        "1673": "video973",
        "1674": "video974",
        "1675": "video975",
        "1676": "video976",
        "1677": "video977",
        "1678": "video978",
        "1679": "video979",
        "1680": "video980",
        "1681": "video981",
        "1682": "video982",
        "1683": "video983",
        "1684": "video984",
        "1685": "video985",
        "1686": "video986",
        "1687": "video987",
        "1688": "video988",
        "1689": "video989",
        "1691": "video991",
        "1692": "video992",
        "1693": "video993",
        "1694": "video994",
        "1695": "video995",
        "1696": "video996",
        "1697": "video997",
        "1698": "video998",
        "1699": "video999",
        "1700": "video1000",
        "1701": "video1001",
        "1702": "video1002",
        "1703": "video1003",
        "1704": "video1004",
        "1705": "video1005",
        "1706": "video1006",
        "1707": "video1007",
        "1708": "video1008",
        "1709": "video1009",
        "1710": "video1010",
        "1711": "video1011",
        "1712": "video1012",
        "1713": "video1013",
        "1714": "video1014",
        "1715": "video1015",
        "1716": "video1016",
        "1717": "video1017",
        "1718": "video1018",
        "1719": "video1019",
        "1720": "video1020",
        "1721": "video1021",
        "1722": "video1022",
        "1723": "video1023",
        "1724": "video1024",
        "1725": "video1025",
        "1726": "video1026",
        "1727": "video1027",
        "1728": "video1028",
        "1729": "video1029",
        "1730": "video1030",
        "1731": "video1031",
        "1732": "video1032",
        "1733": "video1033",
        "1734": "video1034",
        "1735": "video1035",
        "1736": "video1036",
        "1737": "video1037",
        "1738": "video1038",
        "1739": "video1039",
        "1740": "video1040",
        "1741": "video1041",
        "1742": "video1042",
        "1743": "video1043",
        "1744": "video1044",
        "1745": "video1045",
        "1746": "video1046",
        "1747": "video1047",
        "1748": "video1048",
        "1749": "video1049",
        "1750": "video1050",
        "1751": "video1051",
        "1752": "video1052",
        "1753": "video1053",
        "1754": "video1054",
        "1755": "video1055",
        "1756": "video1056",
        "1757": "video1057",
        "1758": "video1058",
        "1759": "video1059",
        "1760": "video1060",
        "1761": "video1061",
        "1762": "video1062",
        "1763": "video1063",
        "1764": "video1064",
        "1765": "video1065",
        "1766": "video1066",
        "1767": "video1067",
        "1768": "video1068",
        "1769": "video1069",
        "1770": "video1070",
        "1771": "video1071",
        "1772": "video1072",
        "1773": "video1073",
        "1774": "video1074",
        "1775": "video1075",
        "1776": "video1076",
        "1777": "video1077",
        "1778": "video1078",
        "1779": "video1079",
        "1780": "video1080",
        "1781": "video1081",
        "1782": "video1082",
        "1783": "video1083",
        "1784": "video1084",
        "1785": "video1085",
        "1786": "video1086",
        "1787": "video1087",
        "1788": "video1088",
        "1789": "video1089",
        "1791": "video1091",
        "1792": "video1092",
        "1793": "video1093",
        "1794": "video1094",
        "1795": "video1095",
        "1796": "video1096",
        "1797": "video1097",
        "1798": "video1098",
        "1799": "video1099",
        "1800": "video1100",
        "1801": "video1101",
        "1802": "video1102",
        "1803": "video1103",
        "1804": "video1104",
        "1805": "video1105",
        "1806": "video1106",
        "1807": "video1107",
        "1808": "video1108",
        "1809": "video1109",
        "1810": "video1110",
        "1811": "video1111",
        "1812": "video1112",
        "1813": "video1113",
        "1814": "video1114",
        "1815": "video1115",
        "1816": "video1116",
        "1817": "video1117",
        "1818": "video1118",
        "1819": "video1119",
        "1820": "video1120",
        "1821": "video1121",
        "1822": "video1122",
        "1823": "video1123",
        "1824": "video1124",
        "1825": "video1125",
        "1826": "video1126",
        "1827": "video1127",
        "1828": "video1128",
        "1829": "video1129",
        "1830": "video1130",
        "1831": "video1131",
        "1832": "video1132",
        "1833": "video1133",
        "1834": "video1134",
        "1835": "video1135",
        "1836": "video1136",
        "1837": "video1137",
        "1838": "video1138",
        "1839": "video1139",
        "1840": "video1140",
        "1841": "video1141",
        "1842": "video1142",
        "1843": "video1143",
        "1844": "video1144",
        "1845": "video1145",
        "1846": "video1146",
        "1847": "video1147",
        "1848": "video1148",
        "1849": "video1149",
        "1850": "video1150",
        "1851": "video1151",
        "1852": "video1152",
        "1853": "video1153",
        "1854": "video1154",
        "1855": "video1155",
        "1856": "video1156",
        "1857": "video1157",
        "1858": "video1158",
        "1859": "video1159",
        "1860": "video1160",
        "1861": "video1161",
        "1862": "video1162",
        "1863": "video1163",
        "1864": "video1164",
        "1865": "video1165",
        "1866": "video1166",
        "1867": "video1167",
        "1868": "video1168",
        "1869": "video1169",
        "3035": "video2035",
        "843": "video343",
        "900": "video400",
        "901": "video401",
        "902": "video402",
        "903": "video403",
        "904": "video404",
        "905": "video405",
        "906": "video406",
        "907": "video407",
        "908": "video408",
        "909": "video409",
        "910": "video410",
        "911": "video411",
        "912": "video412",
        "913": "video413",
        "914": "video414",
        "915": "video415",
        "916": "video416",
        "917": "video417",
        "918": "video418",
        "919": "video419"
    }
}

export let serverList;
export const MYFREECAMS_DOMAINS = [];
const MYFREECAMS_SERVERLIST_URLS = [];

function resetDomainList() {
    MYFREECAMS_DOMAINS.splice(0, MYFREECAMS_DOMAINS.length);
    MYFREECAMS_DOMAINS.push("https://myfreecams.com");
    MYFREECAMS_DOMAINS.push("https://thor.myfreecams.com"); //Reachable from Russia
}

export function saveDomainList() {
    const t = JSON.stringify(MYFREECAMS_DOMAINS);
    localStorage.setItem("domains", t);
}

export function loadDomainList() {
    try {
        const t = localStorage.getItem("domains");
        const json = JSON.parse(t);
        if (!json) {
            resetDomainList();
            saveDomainList();
            return;
        }

        MYFREECAMS_DOMAINS.splice(0, MYFREECAMS_DOMAINS.length);
        for (let k in json) { MYFREECAMS_DOMAINS.push(json[k]); }
    } catch (ex) {
        console.error(`${getFormattedDateTime()}> ${ex}`);
        resetDomainList();
        saveDomainList();
    }
}

function resetServerListUrls() {
    MYFREECAMS_SERVERLIST_URLS.splice(0, MYFREECAMS_SERVERLIST_URLS.length);
    MYFREECAMS_SERVERLIST_URLS.push("https://myfreecams.com/_js/serverconfig.js");
    MYFREECAMS_SERVERLIST_URLS.push("https://thor.myfreecams.com/_js/serverconfig.js"); //Reachable from Russia
}

function saveServerListUrls() {
    if (MYFREECAMS_SERVERLIST_URLS.length) {
        localStorage.setItem("serverListUrls", JSON.stringify(MYFREECAMS_SERVERLIST_URLS));
    } else if (localStorage.getItem("serverListUrls")) {
        localStorage.removeItem("serverListUrls");
    }
}

function loadServerListUrls() {
    try {
        const t = localStorage.getItem("serverListUrls");
        const json = JSON.parse(t);
        if (json) {
            MYFREECAMS_SERVERLIST_URLS.splice(0, MYFREECAMS_SERVERLIST_URLS.length);
            for (let k in json) { MYFREECAMS_SERVERLIST_URLS.push(element); }

            saveServerListUrls();
            return;
        }
    } catch (ex) {
        console.error(`${getFormattedDateTime()}> ${ex}`);
    }

    resetServerListUrls();
}

export async function getServerList() {
    if (serverList) { return serverList; }

    try {
        const t = localStorage.getItem("servers");
        serverList = JSON.parse(t);
        if (serverList) { return serverList; }

        loadServerListUrls();
        saveServerListUrls();

        for (let i = 0; i < MYFREECAMS_SERVERLIST_URLS.length; ++i) {
            const response = await fetchJsonBypassCors(MYFREECAMS_SERVERLIST_URLS[i]);
            if (response) {
                if (i > 0) {
                    const tmp = MYFREECAMS_SERVERLIST_URLS[i];
                    MYFREECAMS_SERVERLIST_URLS.splice(i, 1);
                    MYFREECAMS_SERVERLIST_URLS.splice(0, 0, tmp);

                    saveServerListUrls();
                }

                serverList = response;
                localStorage.setItem("servers", JSON.stringify(serverList));
                return serverList;
            }
        }
    } catch (ex) {
        console.error(`${getFormattedDateTime()}> ${ex}`);
    }

    if (!serverList) {
        localStorage.setItem("servers", JSON.stringify(predefinedServerList));
        serverList = predefinedServerList;
        return serverList;
    }
}
