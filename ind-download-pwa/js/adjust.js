export const getAdjustUrl = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const affidValue = searchParams.get("p0") || searchParams.get("id") || "D2E144";
  const campaignname = searchParams.get("p1") || searchParams.get("campaignname");
  const campaignid = searchParams.get("p2") || searchParams.get("campaignid");
  const adsetname = searchParams.get("p4") || searchParams.get("adsetname");
  const adsetid = searchParams.get("p3") || searchParams.get("adsetid");
  const adname = searchParams.get("p5") || searchParams.get("adname");
  const adid = searchParams.get("p6") || searchParams.get("adid");
  const fbclid = searchParams.get("fbclid");
  const date = Date.now();
  const adjustUrlCode = affiliateLists[affidValue]["adCode"];
  const apiUrl = `${window.location.origin}/blank.html`;

  return `https://app.adjust.com/${adjustUrlCode}?campaign=${campaignname}%20%28${campaignid}%29&adgroup=${adsetname}%20%28${adsetid}%29&creative=${adname}%20%28${adid}%29&fbclid=${fbclid}&redirect=${apiUrl}?v=${date}`;
};

const affiliateLists = {
  119748: {
    adCode: "1h31oss3",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1841666782683119618/android/apk/1.0.27_20241030161542.apk"
  },
  296995: {
    adCode: "1hwr1b5d",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1841671205726621697/android/apk/1.0.27_20241030161917.apk"
  },
  411155: {
    adCode: "1haj8d9s",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1851091604396699649/android/apk/1.0.27_20241030163642.apk"
  },
  465475: {
    adCode: "1cjl84xe",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1796386315862343681/android/apk/1.0.27_20241030154342.apk"
  },
  545314: {
    adCode: "1hbzv021",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1844384979767074817/android/apk/1.0.27_20241030162943.apk"
  },
  703711: {
    adCode: "1dr2pfur",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1801797056128020481/android/apk/1.0.27_20241030160107.apk"
  },
  804691: {
    adCode: "1dhdinet",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1797289660479496194/android/apk/1.0.27_20241030155405.apk"
  },
  851306: {
    adCode: "19kl12xf",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1762110094578331649/android/apk/1.0.27_20241030151941.apk"
  },
  "8115FA": {
    adCode: "1hdieb8p",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1841666552607707137/android/apk/1.0.27_20241030161351.apk"
  },
  EDEF95: {
    adCode: "1d9nhils",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1802923087836057602/android/apk/1.0.27_20241030160417.apk"
  },
  FF9C03: {
    adCode: "1hvb4f63",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1841670904366940162/android/apk/1.0.27_20241030161741.apk"
  },
  "1C2DCB": {
    adCode: "191upe5r",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1760226173744492546/android/apk/1.0.27_20241030151717.apk"
  },
  "6E8466": {
    adCode: "1cp0rabe",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1796386374175752193/android/apk/1.0.27_20241030154408.apk"
  },
  "48AABA": {
    adCode: "1h9xbbh3",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1843536931632701441/android/apk/1.0.27_20241030162517.apk"
  },
  "9D625E": {
    adCode: "1her8cht",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1844386002448076801/android/apk/1.0.27_20241030163217.apk"
  },
  "744F3B": {
    adCode: "19y3pch7",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1760225528236658690/android/apk/1.0.27_20241030151604.apk"
  },
  "79FCF5": {
    adCode: "",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1760225083607134210/android/apk/1.0.27_20241030151541.apk"
  },
  "576F8F": {
    adCode: "1iduns78",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1851160214946918402/android/apk/1.0.27_20241114134747.apk"
  },
  "18542E": {
    adCode: "1cb0k1ce",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1796385708124471298/android/apk/1.0.27_20241030153805.apk"
  },
  F39F9C: {
    adCode: "1cq314bu",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1796386570506928130/android/apk/1.0.27_20241030154605.apk"
  },
  "1D9312": {
    adCode: "1dgxetd5",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1797288969153339393/android/apk/1.0.27_20241030155147.apk"
  },
  "7B96BD": {
    adCode: "1cylyi1x",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1796385953382203394/android/apk/1.0.27_20241030154005.apk"
  },
  "8999B3": {
    adCode: "176rzvj9",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1744318095075315714/android/apk/1.0.27_20241114133946.apk"
  },
  EC9CCC: {
    adCode: "199rnmvf",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1762109851891707905/android/apk/1.0.27_20241030151806.apk"
  },
  "5B2DA1": {
    adCode: "1dvobnj7",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1797288031659667457/android/apk/1.0.27_20241030155008.apk"
  },
  "119BBE": {
    adCode: "1cs9owm1",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1796385830598148097/android/apk/1.0.27_20241030153917.apk"
  },
  "4821FC": {
    adCode: "1h34c7oc",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1841666860880662529/android/apk/1.0.27_20241030161608.apk"
  },
  "4C7BD6": {
    adCode: "",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1769733582997082114/android/apk/1.0.27_20241030153148.apk"
  },
  "65AEEF": {
    adCode: "1d2u2qzv",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1801796969450483714/android/apk/1.0.27_20241030160042.apk"
  },
  B7BE5F: {
    adCode: "",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1747857328940617729/android/apk/1.0.27_20241114134546.apk"
  },
  "09909C": {
    adCode: "1hmw7fe1",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1841665809561587713/android/apk/1.0.27_20241030160917.apk"
  },
  "0A0936": {
    adCode: "1donc08l",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1797290245258129410/android/apk/1.0.27_20241030155614.apk"
  },
  "41D5D6": {
    adCode: "1db5cj2k",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1801796593217519617/android/apk/1.0.27_20241030155717.apk"
  },
  "8EBD06": {
    adCode: "1hsv4pha",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1841671836874518530/android/apk/1.0.27_20241030161941.apk"
  },
  C470A2: {
    adCode: "1aq5gxf0",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1771072141649821697/android/apk/1.0.27_20241030153317.apk"
  },
  "094ABB": {
    adCode: "18tffyfi",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1745328310775500802/android/apk/1.0.27_20241114134317.apk"
  },
  "84B1C0": {
    adCode: "",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1748272185158123522/android/apk/1.0.27_20241030150817.apk"
  },
  "5344BD": {
    adCode: "1hnsivxc",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1851091060064501762/android/apk/1.0.27_20241030163442.apk"
  },
  A3C221: {
    adCode: "1cu1e213",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1796386636579799042/android/apk/1.0.27_20241030154717.apk"
  },
  "37BC5E": {
    adCode: "1hyr1hha",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1841665477126860801/android/apk/1.0.27_20241030160817.apk"
  },
  "0CC9A8": {
    adCode: "1h2h4vi6",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1843537402531405825/android/apk/1.0.27_20241030162613.apk"
  },
  "05A99F": {
    adCode: "1hy39dk3",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1841665903346225153/android/apk/1.0.27_20241030160954.apk"
  },
  "19A27A": {
    adCode: "19tr9x9t",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1762115159057805314/android/apk/1.0.27_20241030152117.apk"
  },
  "0831BE": {
    adCode: "",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1769733414988537858/android/apk/1.0.27_20241030153117.apk"
  },
  "18B60A": {
    adCode: "1dwfhxw5",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1797289329740726273/android/apk/1.0.27_20241030155317.apk"
  },
  CEC48B: {
    adCode: "1hm4vir6",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1841666445146505218/android/apk/1.0.27_20241030161317.apk"
  },
  "8BAFDC": {
    adCode: "1dua14am",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1802922998114496514/android/apk/1.0.27_20241030160306.apk"
  },
  FF5F9A: {
    adCode: "1hi4tzca",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1841672440455835650/android/apk/1.0.27_20241030162117.apk"
  },
  "8C1936": {
    adCode: "1h96kbk3",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1843536853783728130/android/apk/1.0.27_20241030162405.apk"
  },
  "89117A": {
    adCode: "1amk7ni1",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1772265107514376193/android/apk/1.0.27_20241030153541.apk"
  },
  "6B97B8": {
    adCode: "1hstaife",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1841665024027168770/android/apk/1.0.27_20241030160617.apk"
  },
  B592C7: {
    adCode: "1c5sk0cs",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1796386442662424577/android/apk/1.0.27_20241030154517.apk"
  },
  "654BAC": {
    adCode: "19d24ju9",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1759107060633497602/android/apk/1.0.27_20241030151405.apk"
  },
  E4B265: {
    adCode: "19dod94d",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1760195655213957122/android/apk/1.0.27_20241030151517.apk"
  },
  A15248: {
    adCode: "19wmzsdx",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1762115354139078658/android/apk/1.0.27_20241030152141.apk"
  },
  "4B598D": {
    adCode: "",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1747869583510151169/android/apk/1.0.27_20241114134616.apk"
  },
  "806C42": {
    adCode: "1hs239gh",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1844281065725349890/android/apk/1.0.27_20241030162743.apk"
  },
  EFFB8A: {
    adCode: "1hq53ksc",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1841672589093580802/android/apk/1.0.27_20241030162209.apk"
  },
  AB0375: {
    adCode: "1h7p3zpg",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1851089280761053186/android/apk/1.0.27_20241030163307.apk"
  },
  C9C32B: {
    adCode: "1h9oiq9t",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1851090096070836226/android/apk/1.0.27_20241030163417.apk"
  },
  "7F5675": {
    adCode: "1hq2vzg8",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1841667579257499650/android/apk/1.0.27_20241030161717.apk"
  },
  EDED85: {
    adCode: "1hklp53f",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1843536773504749570/android/apk/1.0.27_20241030162341.apk"
  },
  D1EFCE: {
    adCode: "1ahjht1q",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1763511717367451649/android/apk/1.0.27_20241030152517.apk"
  },
  E0FC39: {
    adCode: "1dv9sx5i",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1797290074302492673/android/apk/1.0.27_20241030155548.apk"
  },
  "8E8F88": {
    adCode: "1h6wug82",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1851091454999527425/android/apk/1.0.27_20241030163617.apk"
  },
  "1D1924": {
    adCode: "1htuyfwf",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1843537039422119938/android/apk/1.0.27_20241030162549.apk"
  },
  "97A619": {
    adCode: "1hg281ql",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1851092103107833857/android/apk/1.0.27_20241030163706.apk"
  },
  "6169BF": {
    adCode: "1hh881oi",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1844385035438071809/android/apk/1.0.27_20241030164917.apk"
  },
  "05E53D": {
    adCode: "1cz3qdas",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1796386506097078273/android/apk/1.0.27_20241030154541.apk"
  },
  C00B93: {
    adCode: "1dczhh33",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1797288659756691457/android/apk/1.0.27_20241030155117.apk"
  },
  A594A9: {
    adCode: "",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1759103148400254977/android/apk/1.0.27_20241030151117.apk"
  },
  E4F4E4: {
    adCode: "19mh2469",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1759103449182183425/android/apk/1.0.27_20241030151141.apk"
  },
  CCF46E: {
    adCode: "18welwre",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1744597677348941825/android/apk/1.0.27_20241114134016.apk"
  },
  "7FD58E": {
    adCode: "1hb9j1bd",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1841665112058281986/android/apk/1.0.27_20241030160649.apk"
  },
  "2F4A53": {
    adCode: "1he67v5x",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1841670963530731522/android/apk/1.0.27_20241030161805.apk"
  },
  "03F482": {
    adCode: "",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1760364116355751938/android/apk/1.0.27_20241030151742.apk"
  },
  "872CBD": {
    adCode: "1cdzg0ph",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1796384989749248001/android/apk/1.0.27_20241030153740.apk"
  },
  "70379D": {
    adCode: "19i9rsji",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1755180742599327745/android/apk/1.0.27_20241030151033.apk"
  },
  D357DB: {
    adCode: "1a2mms00",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1764453914598248450/android/apk/1.0.27_20241030152933.apk"
  },
  "6123B3": {
    adCode: "1aldh0pd",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1763511546590367746/android/apk/1.0.27_20241030152404.apk"
  },
  "12BDEA": {
    adCode: "1ama0got",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1768489521211842561/android/apk/1.0.27_20241030153017.apk"
  },
  F8BDF6: {
    adCode: "18hk039l",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1745329190182637570/android/apk/1.0.27_20241114134347.apk"
  },
  "09F5B4": {
    adCode: "18g4esev",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1744597878990106626/android/apk/1.0.27_20241114134117.apk"
  },
  "8F592E": {
    adCode: "1c1g2npp",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1796386825883398145/android/apk/1.0.27_20241030154943.apk"
  },
  "55410F": {
    adCode: "1hichq0d",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1851092535697268738/android/apk/1.0.27_20241030163817.apk"
  },
  "808E00": {
    adCode: "18fchgq3",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1745327279806427137/android/apk/1.0.27_20241114134141.apk"
  },
  "50E50C": {
    adCode: "1hooeank",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1851091239711858689/android/apk/1.0.27_20241030163506.apk"
  },
  "97701C": {
    adCode: "1dgux7s3",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1797289529071951873/android/apk/1.0.27_20241030155341.apk"
  },
  "6CB162": {
    adCode: "1hb3bph2",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1841665344645574657/android/apk/1.0.27_20241030160714.apk"
  },
  "3A6AFE": {
    adCode: "1h4kj776",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1841665992504545281/android/apk/1.0.27_20241030161033.apk"
  },
  D2E144: {
    adCode: "176rzvj9",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1738143955014434817/android/apk/1.0.27_20241114133717.apk"
  },
  "6B3CA4": {
    adCode: "19ukar64",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1759103607815335938/android/apk/1.0.27_20241030151206.apk"
  },
  "3EC114": {
    adCode: "18udrhih",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1748272425843298306/android/apk/1.0.27_20241030150917.apk"
  },
  "48AA71": {
    adCode: "",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1769733702362779650/android/apk/1.0.27_20241030153213.apk"
  },
  E7AC25: {
    adCode: "1hqz3xvs",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1841666348027949057/android/apk/1.0.27_20241030161211.apk"
  },
  "122C1B": {
    adCode: "1hffb30e",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1841665728613134337/android/apk/1.0.27_20241030160905.apk"
  },
  "014536": {
    adCode: "1huiebrq",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1841666219841630209/android/apk/1.0.27_20241030161147.apk"
  },
  A52C2A: {
    adCode: "1i4aix68",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1856934861850456065/android/apk/1.0.27_20241114134818.apk"
  },
  "61865D": {
    adCode: "18re1tvu",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1741671091215323137/android/apk/1.0.27_20241114133917.apk"
  },
  "9A3137": {
    adCode: "18yxon9n",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1745329662201221121/android/apk/1.0.27_20241114134517.apk"
  },
  BBC05B: {
    adCode: "1delj0eh",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1801796703235190785/android/apk/1.0.27_20241030155813.apk"
  },
  AF3C9E: {
    adCode: "1au3rm1b",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1772264830339493890/android/apk/1.0.27_20241030153407.apk"
  },
  "7C3D98": {
    adCode: "199sudqb",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1755180116922417154/android/apk/1.0.27_20241030150955.apk"
  },
  EDC070: {
    adCode: "1ag2vel5",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1772265261638270978/android/apk/1.0.27_20241030153606.apk"
  },
  "6539E6": {
    adCode: "1ccx3zuz",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1796386780249370625/android/apk/1.0.27_20241030154917.apk"
  },
  AC3A03: {
    adCode: "1al3j8bb",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1771072318972411905/android/apk/1.0.27_20241030153342.apk"
  },
  "50015B": {
    adCode: "184e6g1p",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1748272305361915905/android/apk/1.0.27_20241030150855.apk"
  },
  E7306F: {
    adCode: "1c3pol70",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1796386088501706754/android/apk/1.0.27_20241030154141.apk"
  },
  "42BD80": {
    adCode: "1c9ec4ai",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1796385881254834177/android/apk/1.0.27_20241030153941.apk"
  },
  EEE331: {
    adCode: "19ka1h7h",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1762114828320157697/android/apk/1.0.27_20241030152006.apk"
  },
  "5FC16C": {
    adCode: "1akg6xj3",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1763511103042719746/android/apk/1.0.27_20241030152205.apk"
  },
  "912CDD": {
    adCode: "18dze5u5",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1745328196761735170/android/apk/1.0.27_20241114134206.apk"
  },
  F66387: {
    adCode: "19b9d6ze",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1762109986604363777/android/apk/1.0.27_20241030151917.apk"
  },
  "53F760": {
    adCode: "1avmlh9f",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1763511399106056193/android/apk/1.0.27_20241030152341.apk"
  },
  "7F25D9": {
    adCode: "1dreoc4v",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1802598359277817857/android/apk/1.0.27_20241030160217.apk"
  },
  "7AB28A": {
    adCode: "1d7k4uay",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1797289793649029121/android/apk/1.0.27_20241030155517.apk"
  },
  "2BBBA2": {
    adCode: "1h71thf1",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1841665636191092738/android/apk/1.0.27_20241030160841.apk"
  },
  A3BB94: {
    adCode: "1hyvy4rn",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1841672647809089538/android/apk/1.0.27_20241030162317.apk"
  },
  "37C256": {
    adCode: "1c9thmfl",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1796386229344317441/android/apk/1.0.27_20241030154317.apk"
  },
  "023150": {
    adCode: "1ckuebeo",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1796386681423179777/android/apk/1.0.27_20241030154741.apk"
  },
  "5C42C0": {
    adCode: "1dgzyx78",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1797289169765777410/android/apk/1.0.27_20241030155212.apk"
  },
  "4E640C": {
    adCode: "1c96hm1a",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1796384865595731969/android/apk/1.0.27_20241030153717.apk"
  },
  "3CDE35": {
    adCode: "1ace8fub",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1763511258095357954/android/apk/1.0.27_20241030152317.apk"
  },
  "1C8E5B": {
    adCode: "1agq43ie",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1764453832253870081/android/apk/1.0.27_20241030152854.apk"
  },
  "1A301D": {
    adCode: "1cdvm9c4",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1796386726881046530/android/apk/1.0.27_20241030154806.apk"
  },
  "360FCF": {
    adCode: "1hpcnpjc",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1841666715679666177/android/apk/1.0.27_20241030161517.apk"
  },
  "8C537A": {
    adCode: "1cqka2iv",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1796386014516260866/android/apk/1.0.27_20241030154117.apk"
  },
  "8EC6E0": {
    adCode: "1awwgia9",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1772264943250157570/android/apk/1.0.27_20241030153517.apk"
  },
  "7AC5EF": {
    adCode: "1hdxpe7f",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1841672293616893954/android/apk/1.0.27_20241030162006.apk"
  },
  "1C2861": {
    adCode: "18dlzagt",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1748272035786375170/android/apk/1.0.27_20241030150728.apk"
  },
  E3C9A7: {
    adCode: "1addjlbk",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1763511829110296578/android/apk/1.0.27_20241030152603.apk"
  },
  "72AC3D": {
    adCode: "1aikdqig",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1764453722715426817/android/apk/1.0.27_20241030152817.apk"
  },
  D30822: {
    adCode: "1hbrem4v",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1844280991424630786/android/apk/1.0.27_20241030162717.apk"
  },
  E7342E: {
    adCode: "1995m6ch",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1759106865144995842/android/apk/1.0.27_20241030151317.apk"
  },
  F8FD49: {
    adCode: "1h97hl84",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1841672508516253697/android/apk/1.0.27_20241030162143.apk"
  },
  "143B11": {
    adCode: "1hke64fm",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1841666617402376193/android/apk/1.0.27_20241030161416.apk"
  },
  "22D8AD": {
    adCode: "1awhgp7o",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1768489613675274242/android/apk/1.0.27_20241030153041.apk"
  },
  "87478A": {
    adCode: "1hk34eb2",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1851084108282064897/android/apk/1.0.27_20241030163243.apk"
  },
  DEFC54: {
    adCode: "1cbix9fo",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1796386149507858433/android/apk/1.0.27_20241030154206.apk"
  },
  E9F13B: {
    adCode: "18djnpt5",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1748271735449042945/android/apk/1.0.27_20241114134717.apk"
  },
  B8500A: {
    adCode: "18y8dqld",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1745329295656038401/android/apk/1.0.27_20241114134418.apk"
  },
  "7FC8EE": {
    adCode: "1hyvmlkq",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1841666115264495617/android/apk/1.0.27_20241030161117.apk"
  },
  "17FC4F": {
    adCode: "1htdeybi",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1844384917951930370/android/apk/1.0.27_20241030162917.apk"
  },
  A5F501: {
    adCode: "1dk5xbn8",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1801796880457986050/android/apk/1.0.27_20241030160017.apk"
  },
  "45A512": {
    adCode: "1hvg16de",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1844384871676174338/android/apk/1.0.27_20241030162809.apk"
  },
  E08204: {
    adCode: "17ekry4l",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1739494934465810434/android/apk/1.0.27_20241114133746.apk"
  },
  "8098CD": {
    adCode: "18cyucb2",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1741670997247512577/android/apk/1.0.27_20241114133816.apk"
  },
  "86C42B": {
    adCode: "19dyujqy",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1759106977041018882/android/apk/1.0.27_20241030151341.apk"
  },
  "60AF3F": {
    adCode: "1d6mrqyh",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1801796785681248257/android/apk/1.0.27_20241030155854.apk"
  },
  C29B0B: {
    adCode: "1hleokj0",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1841664839512961026/android/apk/1.0.27_20241030160446.apk"
  },
  "1EFF41": {
    adCode: "1dsv3r1f",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1802598478286618625/android/apk/1.0.27_20241030160241.apk"
  },
  "27DA46": {
    adCode: "1anirq9b",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1768489759762882562/android/apk/1.0.27_20241030153106.apk"
  },
  "3B636F": {
    adCode: "1akvn455",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1764453620940640257/android/apk/1.0.27_20241030152648.apk"
  },
  "88CA31": {
    adCode: "1hpdakdu",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1841664918460731393/android/apk/1.0.27_20241030160510.apk"
  },
  "015E93": {
    adCode: "1hqw0848",
    url: "https://p8s1-ind-files.s3.ap-south-1.amazonaws.com/app/5/affiliate/1851092698485092354/android/apk/1.0.27_20241030163841.apk"
  }
};
