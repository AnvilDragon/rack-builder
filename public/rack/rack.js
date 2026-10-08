const RACKS=[
 {id:"w9",name:"9U wall-mount cabinet",u:9,p:120},
 {id:"o12",name:"12U 4-post open frame",u:12,p:140},
 {id:"o15",name:"15U 4-post open frame",u:15,p:170},
 {id:"o18",name:"18U 4-post open frame",u:18,p:200},
 {id:"st18",name:"StarTech 4POSTRACK18U",u:18,p:370},
 {id:"sys22",name:"Sysracks 22U open frame",u:22,p:234},
 {id:"c22",name:"22U enclosed cabinet",u:22,p:420},
 {id:"o25",name:"25U 4-post open frame",u:25,p:260},
 {id:"o42",name:"42U 4-post open frame",u:42,p:400},
 {id:"srw15",name:"Sysracks SRW 15.900 enclosed, glass door",u:15,p:475},
 {id:"pr18",name:"Sysracks PR 18.900 enclosed, mesh + fans",u:18,p:631},
 {id:"tl18",name:"Tripp Lite SR18UB enclosed",u:18,p:1061},
 {id:"srf18",name:"Sysracks SRF 18.6.10 enclosed, glass + fans, PDU + shelf incl.",u:18,p:837.5},
 {id:"srf22",name:"Sysracks SRF 22.6.10 enclosed, glass + fans, PDU + shelf incl.",u:22,p:887.5},
 {id:"srf27",name:"Sysracks SRF 27.6.10 enclosed, glass + fans, PDU + shelf incl.",u:27,p:950},
 {id:"none",name:"Rack I already own",u:24,p:0}
];
const CATS={network:"Networking",server:"Servers & chassis",power:"Power",shelf:"Shelves",mgmt:"Panels & cooling",acc:"Drives & accessories (0U)"};
const CAT=[
 ["lcpanel","network","1U LC fiber adapter panel",1,0,35],
 ["patch24","network","24-port Cat6 keystone patch panel",1,0,38],
 ["brush","network","FS.com 1U brush panel",1,0,25],
 ["crs309","network","MikroTik CRS309 8x SFP+ (fanless)",1,23,269],
 ["crs305","network","MikroTik CRS305 4x SFP+ (on shelf)",1,10,149],
 ["crs310","network","MikroTik CRS310 8x 2.5G + 2x SFP+",1,20,219],
 ["sg3428","network","TP-Link TL-SG3428 24-port gigabit",1,20,215],
 ["usw24","network","UniFi USW-24 24-port gigabit",1,25,225],
 ["usxagg","network","UniFi USW-Aggregation 8x SFP+",1,20,269],
 ["udm","network","UniFi Dream Machine Pro",1,33,379],
 ["udmmax","network","UniFi Dream Machine Pro Max",1,35,599],
 ["protectli","network","Protectli VP2440e on 1U shelf",1,15,529],
 ["l4500","server","Rosewill RSV-L4500U 4U 15-bay",4,140,230],
 ["r4100","server","Rosewill RSV-R4100U 4U 7-bay",4,120,130],
 ["l4412","server","Rosewill RSV-L4412U 4U 12 hot-swap",4,140,400],
 ["cx4712","server","Sliger CX4712 4U 10 hot-swap",4,140,498],
 ["rm44","server","SilverStone RM44 4U",4,120,400],
 ["sm846","server","Used 24-bay 4U storage server",4,180,450],
 ["mini","server","1U mini PC shelf (holds 2-3)",1,0,35],
 ["cp1500","power","CyberPower CP1500PFCRM2U UPS",2,25,360],
 ["smt1500","power","APC SMT1500RM2UC UPS",2,25,927],
 ["pdu1u","power","8-outlet 1U PDU",1,0,45],
 ["pdu0","power","Vertical 0U PDU strip",0,0,70],
 ["sh1","shelf","1U vented shelf",1,0,30],
 ["sh2","shelf","2U cantilever shelf",2,0,40],
 ["sl1","shelf","1U sliding keyboard drawer",1,0,90],
 ["blank1","mgmt","1U blank panel",1,0,8],
 ["blank2","mgmt","2U blank panel",2,0,12],
 ["cm1","mgmt","1U horizontal cable manager",1,0,20],
 ["fan1","mgmt","1U fan tray (thermostat)",1,20,80],
 ["nic82599","acc","Intel 82599 10G SFP+ card",0,5,31],
 ["x710","acc","Intel X710-DA2 dual SFP+ card",0,7,124],
 ["sr","acc","10G SR optic, Intel-coded",0,1,18],
 ["om4","acc","OM4 LC-LC duplex fiber cord, 15 m",0,0,25],
 ["dac","acc","10G SFP+ DAC cable, 1 m",0,0,16],
 ["hba","acc","LSI 9300-8i HBA (refurb, IT mode)",0,10,100],
 ["d9l","acc","Noctua NH-D9L cooler (est.)",0,0,70],
 ["hdd20","acc","20TB IronWolf Pro drive",0,7,840],
 ["exos18","acc","18TB Exos drive",0,7,420],
 ["istar","acc","iStarUSA TC-RAIL-26 rails",0,0,64],
 ["gdrail","acc","GD rails for Sliger",0,0,129],
 ["rms05","acc","SilverStone RMS05-22 rails",0,0,109],
 ["nuts","acc","M6 cage nuts & screws, 50 pack",0,0,15],
 ["patch","acc","Cat6 patch cables, 1 ft, 10 pack",0,0,20],
 ["caster","acc","Rack caster set",0,0,30],
 ["srf27","acc","Closed cabinet: Sysracks SRF 27.6.10 (move everything in)",0,0,950],
 ["srf18x","acc","Optional: Sysracks SRF 18.6.10 so rack 2 matches",0,0,837.5],
 ["arc12","acc","Arctic P12 Pro LN 120mm PWM fans, 5-pack",0,0,19.59],
 ["split3","acc","3-way 4-pin PWM fan splitter cable",0,0,5.99],
 ["arc8","acc","Arctic P8 PWM PST 80mm fan (est.)",0,0,8],
 ["fhub","acc","PWM fan hub, SATA powered (est.)",0,0,12],
 ["nf12","acc","Optional: Noctua NF-A12x25 PWM 120mm fan (est.)",0,0,33],
 ["nf8","acc","Optional: Noctua NF-A8 PWM 80mm fan (est.)",0,0,20],
 ["dnsbox","acc","Used mini PC for Pi-hole + Unbound (est.)",0,8,120],
 ["guts","acc","Storage server guts: used CPU, board, 16GB RAM, PSU, boot SSD (est.)",0,0,350],
 ["cloud","mgmt","AC Infinity CLOUDPLATE T1 exhaust fan",1,10,139],
 ["shelfsw","network","MikroTik CRS305 on 1U shelf",1,10,179],
 ["rack2","acc","Second cabinet, same model (est.)",0,0,631],
 ["ups2","acc","UPS for rack 2, 2200VA+ (est., size to your PCs)",0,25,900],
 ["offsite","acc","External drive for off-site backup copy (est.)",0,0,300],
 ["gpucase","acc","4U case for full-size GPU (est.)",0,0,250],
 ["dpaoc","acc","Fiber DisplayPort cable, 15 m (est.)",0,0,70],
 ["usbfib","acc","USB 3 over fiber extender (est.)",0,0,180],
 ["hub","acc","Powered USB hub with USB-C, 12 port (est.)",0,0,60]
].map(([id,cat,name,u,w,p])=>({id,cat,name,u,w,p}));

let S,W;
const uid=()=>Math.random().toString(36).slice(2,9);
const mk=(id,pos,extra={})=>{const c=CAT.find(x=>x.id===id);return {id:uid(),ref:c.id,cat:c.cat,name:c.name,u:c.u,w:c.w,p:c.p,qty:1,pos,...extra}};
const own=(name,u,w,pos)=>({id:uid(),cat:"custom",name,u,w,p:0,qty:1,pos});
function presets(){const p=presetsRaw();for(const k in p)p[k].items.forEach((it,i)=>it.id=k+"-"+i+"-"+(it.ref||"own"));return p}
function presetsRaw(){const P=(n,x)=>({...x,ph:n});return {
  budget:{rack:"srf27",rate:0.128,target:null,sel:null,items:[
    P(1,mk("shelfsw",17)),P(1,mk("l4500",11,{name:"Rosewill RSV-L4500U: TrueNAS (your mobo, CPU, RAM, PSU)",w:180})),P(1,mk("cp1500",1)),
    P(1,mk("istar",null)),P(1,mk("nic82599",null,{qty:2,name:"Intel 82599 SFP+ card (NAS + your PC)"})),P(1,mk("dac",null,{name:"10G SFP+ DAC, 1 m (NAS)"})),P(1,mk("sr",null,{qty:2})),P(1,mk("om4",null)),P(1,mk("nuts",null)),P(4,mk("offsite",null)),
    P(2,mk("lcpanel",18)),P(2,mk("brush",16)),P(2,mk("cm1",15)),P(2,mk("l4500",7,{name:"Rosewill RSV-L4500U: Minecraft host (your mobo, CPU, RAM, PSU)",w:150})),P(2,mk("istar",null)),
    P(3,mk("l4500",3,{name:"Rosewill RSV-L4500U: storage + backup server (receives NAS snapshots)",w:120})),P(3,mk("hba",null)),P(3,mk("exos18",null,{qty:4,name:"18TB Exos drive (buy as prices drop)"})),P(3,mk("istar",null)),
    P(4,mk("rack2",null)),P(4,mk("ups2",null)),P(4,mk("gpucase",null,{qty:2})),P(4,mk("dpaoc",null,{qty:4})),P(4,mk("usbfib",null,{qty:2})),P(4,mk("hub",null,{qty:4}))
  ]},
  upgrade:{rack:"sys22",rackPh:2,rate:0.128,target:null,sel:null,
    notes:{1:"Buy the UPS first. It protects the NAS right away, lying flat on the floor or a shelf until the cabinet arrives. Plug the NAS into it and turn on TrueNAS's UPS service.",
      2:"Order the Sysracks 22U open frame and set its depth to about 29-30 in so the 26 in rails fit. Mount the UPS at U1-2 and put your current switch and router on the shelf. Cage nuts come with it.",
      3:"Write down each NAS drive's serial number, then move the NAS into the Rosewill L4500U and mount it on its rails at U12-15. Swap its 6 stock 120mm and 2 stock 80mm fans for the quiet Arctics on the fan hub, and set a BIOS fan curve that keeps drives under about 40-45 C. These fans stop completely below 5% PWM, so set the curve's lowest point above that.",
      4:"Your Minecraft server is shut down for now, so this step can wait until you bring it back. Move the Minecraft host into the R4100U at U8-11 and set it up as a UPS client. Add the brush panel and cable manager. Use the spare Arctic 120mm fans from step 3 in this case, on the 3-way splitter into one motherboard fan header; check how many fans it needs first.",
      5:"Set up the mini PC with Pi-hole + Unbound and put it on the shelf. Point your router's DNS at it.",
      6:"Install an SFP+ card in the NAS and one in your PC. Connect them with the two SR optics and the OM4 fiber cord. Your PC now talks to the NAS at 10G.",
      7:"Mount the CRS309 at U20. Move your PC's fiber from the NAS to the switch, and connect the NAS to the switch with the DAC.",
      8:"Build the storage + backup server in the L4500U at U4-7 with the used parts and HBA. Connect it to the switch with its SFP+ card and DAC. Swap its stock fans for quiet Arctics the same way as the NAS.",
      9:"Install 2 drives and create a mirror pool. Set up a replication task on the NAS that sends its snapshots here, and point Minecraft backups at it.",
      10:"Add 2 more drives as a second mirror to the same pool. This doubles the space with no rebuild.",
      11:"Install an SFP+ card in your husband's PC, run his fiber cord, and mount the LC panel at U22.",
      12:"Swap the NAS's single-port card for the dual-port X710. Keep the old card as a spare or sell it.",
      13:"Only when your ISP offers 10G. Mount the router at U17, then give the Minecraft host its SFP+ card and DAC.",
      12:"Move everything from the open rack into the closed SRF 27.6.10, keeping the same U positions. Its fans, PDU and shelf come with it. The empty open rack becomes rack 2 for the gaming PCs.",
      13:"Install OPNsense on the Protectli and put it on the shelf at U17 in place of your current router. Plug the modem into its WAN port and your fiber switch into one of its SFP+ ports, so it is already ready for 10G internet. Turn on CrowdSec to block scanners and brute-force attempts. Real DDoS protection still comes from TCPShield or a Cloudflare tunnel in front of anything public.",
      15:"Set up the old open rack as rack 2 near a different breaker from rack 1. Size this UPS to both gaming PCs' real power draw before buying.",
      16:"Move each gaming PC into its 4U case. Check each GPU's length against the case first.",
      17:"Run fiber DisplayPort cables and the USB-over-fiber extender to your desk, then add powered hubs there.",
      18:"Same as step 15, for your husband's desk.",
      19:"Nothing here is needed to finish rack 1. The experiment box is a used mini PC for Proxmox, so you can try things like the Pi-hole + Unbound project without touching the NAS. The NAS card upgrade is a nice-to-have, and the 10G internet parts only matter once your ISP offers 10G. Buy any of it whenever you want."},
    phases:{1:"1: UPS",2:"2: Cabinet",3:"3: Rack the NAS",4:"4: Rack the Minecraft host",6:"5: First fiber link (NAS to your PC)",7:"6: Fiber switch",
      8:"7: Storage + backup server",9:"8: First 2 drives (mirror)",10:"9: Next 2 drives",11:"10: Husband's PC on fiber",12:"11: Closed cabinet",13:"12: Firewall (OPNsense)",
      15:"13: Rack 2 UPS",16:"14: Gaming PC cases",17:"15: Your PC fiber video + USB",18:"16: Husband's PC fiber video + USB",19:"Later / optional"},items:[
    
    P(1,mk("cp1500",1)),P(3,mk("l4500",12,{name:"Rosewill RSV-L4500U: TrueNAS (your mobo, CPU, RAM, PSU, cooler)",w:85})),P(3,mk("istar",null)),P(3,mk("arc12",null,{qty:2})),P(3,mk("arc8",null,{qty:2})),P(3,mk("fhub",null)),
    P(2,mk("sh1",null,{u:0,name:"1U vented shelf for current network gear"})),P(2,own("Your current switch/router, gigabit copper until fiber in step 5 (on the 1U shelf)",1,20,21)),
    P(4,mk("r4100",8,{name:"Rosewill RSV-R4100U: Minecraft host (your parts, boot + storage drive)",w:70})),P(4,mk("istar",null)),P(19,mk("dnsbox",null,{name:"Experiment box: used mini PC for Proxmox (DNS project, VMs, testing) (est.)"})),P(4,mk("split3",null)),P(4,mk("brush",19)),P(4,mk("cm1",18)),P(4,mk("blank1",16)),
    P(6,mk("nic82599",null,{qty:2,name:"Intel 82599 SFP+ card (NAS + your PC, direct link)"})),P(6,mk("sr",null,{qty:2})),P(6,mk("om4",null)),
    P(7,mk("crs309",20,{name:"MikroTik CRS309 8x SFP+ (your PC's fiber moves here)"})),P(7,mk("dac",null,{name:"10G SFP+ DAC, 1 m (NAS to switch)"})),
    P(8,mk("l4500",4,{name:"Rosewill RSV-L4500U: storage + backup server (NAS snapshots + Minecraft backups)",w:55})),P(8,mk("guts",null)),P(8,mk("istar",null)),P(8,mk("hba",null)),P(8,mk("arc12",null)),P(8,mk("arc8",null,{qty:2})),P(8,mk("fhub",null)),
    P(8,mk("nic82599",null,{name:"Intel 82599 SFP+ card (storage server)"})),P(8,mk("dac",null,{name:"10G SFP+ DAC, 1 m (storage server)"})),
    P(9,mk("exos18",null,{qty:2,name:"18TB Exos drive (start as a mirror pair)"})),
    P(10,mk("exos18",null,{qty:2,name:"18TB Exos drive (add as a second mirror pair)"})),
    P(11,mk("nic82599",null,{name:"Intel 82599 SFP+ card (husband's PC)"})),P(11,mk("sr",null,{qty:2})),P(11,mk("om4",null)),P(11,mk("lcpanel",22)),
    P(19,mk("x710",null,{name:"Upgrade: Intel X710-DA2 dual SFP+ for TrueNAS"})),
    P(19,mk("udmmax",null,{u:0,w:0,name:"Optional: UniFi Dream Machine Pro Max, only if the firewall can't keep up with 10G internet"})),P(19,mk("nic82599",null,{name:"Intel 82599 SFP+ card (Minecraft host)"})),P(19,mk("dac",null,{name:"10G SFP+ DAC, 1 m (Minecraft host)"})),
    P(12,mk("srf27",null)),P(13,mk("protectli",17,{name:"Protectli VP2440e firewall (OPNsense) on 1U shelf"})),
    P(15,mk("ups2",null)),
    P(16,mk("gpucase",null,{qty:2})),
    P(17,mk("dpaoc",null,{qty:2})),P(17,mk("usbfib",null)),P(17,mk("hub",null,{qty:2})),
    P(18,mk("dpaoc",null,{qty:2})),P(18,mk("usbfib",null)),P(18,mk("hub",null,{qty:2})),
    P(19,mk("nf12",null,{qty:6,name:"Optional: Noctua NF-A12x25 PWM 120mm fans for the NAS (est.)"})),P(19,mk("nf8",null,{qty:2,name:"Optional: Noctua NF-A8 PWM 80mm fans for the NAS (est.)"})),P(19,mk("srf18x",null)),P(19,mk("offsite",null)),P(19,mk("cx4712",null,{u:0,w:0,name:"Optional: Sliger CX4712 hot-swap case for TrueNAS"})),P(19,mk("gdrail",null,{name:"Optional: GD rails for Sliger"})),
    P(19,mk("smt1500",null,{u:0,w:0,name:"Optional: APC SMT1500RM2UC (longer runtime)"}))
  ]},
  stepup:{rack:"tl18",rate:0.128,target:null,sel:null,items:[
    P(1,mk("lcpanel",18)),P(1,mk("crs309",17)),P(1,mk("cx4712",11,{name:"Sliger CX4712: TrueNAS (your mobo, CPU, RAM, PSU)",w:180})),P(1,mk("gdrail",null)),P(1,mk("smt1500",1)),
    P(1,mk("x710",null)),P(1,mk("nic82599",null,{qty:2})),P(1,mk("dac",null,{qty:3})),P(1,mk("sr",null,{qty:2})),P(1,mk("om4",null)),P(1,mk("nuts",null)),P(4,mk("offsite",null)),
    P(2,mk("sg3428",16)),P(2,mk("protectli",15)),P(2,mk("rm44",7,{name:"SilverStone RM44: Minecraft host (your mobo, CPU, RAM, PSU)",w:150})),P(2,mk("rms05",null)),P(2,mk("patch",null)),
    P(3,mk("cx4712",3,{name:"Sliger CX4712: storage + backup server (receives NAS snapshots)",w:120})),P(3,mk("gdrail",null)),P(3,mk("hba",null)),P(3,mk("exos18",null,{qty:4,name:"18TB Exos drive (buy as prices drop)"})),
    P(4,mk("rack2",null,{name:"Second Tripp Lite SR18UB (est.)",p:1061})),P(4,mk("ups2",null)),P(4,mk("gpucase",null,{qty:2})),P(4,mk("dpaoc",null,{qty:4})),P(4,mk("usbfib",null,{qty:2})),P(4,mk("hub",null,{qty:4}))
  ]}
}}
const pmax=()=>Math.max(4,...Object.keys(S.phases||{}).map(Number),...S.items.map(i=>i.ph||1));
const NE=q=>"https://www.newegg.com/p/pl?d="+encodeURIComponent(q),EB=q=>"https://www.ebay.com/sch/i.html?_nkw="+encodeURIComponent(q);
const BUY={sys22:"https://www.newegg.com/sysracks-22u-dor-4-post-open-frame-server-rack/p/2BA-004S-00023",srf18x:"https://sysracks.com/product/18u-39-depth-it-telecom-cabinet-srf-18-6-10/",srf27:"https://sysracks.com/product/27u-39-depth-it-telecom-cabinet-srf-27-6-10/",srf22:"https://sysracks.com/product/22u-39-depth-it-telecom-cabinet-srf-22-6-10/",srf18:"https://sysracks.com/product/18u-39-depth-it-telecom-cabinet-srf-18-6-10/",
 l4500:"https://www.newegg.com/rosewill-rsv-l4500u-black/p/N82E16811147328",istar:"https://www.bhphotovideo.com/c/product/834849-REG/iStarUSA_TC_RAIL_26_Sliding_Rail_Kit_26.html",
 cp1500:"https://www.bhphotovideo.com/c/product/1709939-REG/cyberpower_cp1500pfcrm2u_cp15_1500va_100w_2u_rackmount.html",crs309:"https://www.microcom.us/crs3091g8s-in.html",
 crs310:"https://mikrotik.com/product/crs310_8g_2s_in",sg3428:"https://www.bhphotovideo.com/c/product/1680700-REG/tp_link_tl_sg3428_jetstream_24_port_gigabit_l2.html",
 protectli:"https://protectli.com/product/vp2440e/",cx4712:"https://www.avadirect.com/CX4712-25-4U-Rackmount-Chassis-ATX-PSU-Support-360mm-AIO-Support-2x-5-25-10x-3-5-6x-2-5-Black/Product/16426792",
 gdrail:"https://www.avadirect.com/Rackmount-General-Devices-Rail-Kit-26in-Slide-with-All-Extensions-Min-27in-Max-43in-REV-B/Product/19690222",rm44:"https://www.newegg.com/p/2AM-006F-001D2",
 rms05:"https://www.newegg.com/silverstone-rms05-22-rack-rail/p/N82E16816640001",smt1500:"https://www.newegg.com/apc-smt1500rm2uc-nema-5-15r/p/N82E16842301691",brush:"https://www.fs.com/products/29033.html",
 cloud:"https://www.bhphotovideo.com/c/product/1370952-REG/ac_infinity_ai_cpt1_cloudplate_t1_quiet_rack.html",exos18:"https://diskprices.com/?locale=us&condition=new&capacity=16-24&disk_types=internal_hdd"};
const FIND={arc12:"https://www.amazon.com/s?k=ARCTIC+P12+Pro+LN+5+Pack",split3:"https://www.amazon.com/s?k=3+way+4+pin+PWM+fan+splitter",arc8:NE("Arctic P8 PWM PST"),fhub:NE("PWM fan hub SATA powered"),nf12:NE("Noctua NF-A12x25 PWM"),nf8:NE("Noctua NF-A8 PWM"),r4100:NE("Rosewill RSV-R4100U"),l4412:NE("Rosewill RSV-L4412U"),shelfsw:NE("MikroTik CRS305-1G-4S+IN"),nic82599:EB("Intel 82599 SFP+ 10G network card"),x710:EB("Intel X710-DA2"),
 sr:NE("10GBASE-SR SFP+ transceiver Intel compatible"),om4:NE("OM4 LC LC duplex fiber patch cable 15m"),dac:NE("10G SFP+ DAC cable 1m passive"),lcpanel:NE("1U LC fiber adapter panel"),
 hba:EB("LSI 9300-8i IT mode"),cm1:NE("1U horizontal cable management panel"),blank1:NE("1U rack blank panel"),blank2:NE("2U rack blank panel"),nuts:NE("M6 cage nuts screws 50"),
 dnsbox:EB("Lenovo ThinkCentre Tiny mini PC"),guts:EB("used desktop motherboard CPU RAM combo"),udmmax:"https://store.ui.com/",ups2:NE("2200VA rackmount UPS pure sine wave"),
 rack2:"https://sysracks.com/product/18u-39-depth-it-telecom-cabinet-srf-18-6-10/",gpucase:NE("4U rackmount ATX chassis full size GPU"),dpaoc:NE("fiber optic DisplayPort 1.4 cable 15m"),
 usbfib:NE("USB 3.0 fiber optic extender"),hub:NE("powered USB 3 hub 12 port USB-C"),offsite:NE("external hard drive 16TB"),sh1:NE("1U vented rack shelf"),patch:NE("Cat6 patch cable 1 ft 10 pack"),
 patch24:NE("24 port Cat6 keystone patch panel"),sh2:NE("2U cantilever rack shelf"),fan1:NE("1U rack fan tray thermostat"),pdu1u:NE("1U rackmount PDU 8 outlet"),pdu0:NE("0U vertical PDU"),
 ch4u15:NE("Rosewill RSV-L4500U"),ch4u8:NE("4U ATX rackmount chassis"),ch2u:NE("2U short depth ATX chassis"),sm846:EB("Supermicro 846 4U 24 bay"),udm:NE("UniFi Dream Machine Pro"),usw24:NE("UniFi USW-24"),
 usxagg:NE("UniFi USW-Aggregation"),hdd20:NE("IronWolf Pro 20TB"),mini:NE("1U rack shelf mini PC"),sl1:NE("1U keyboard drawer rack"),caster:NE("server rack casters"),crs305:NE("MikroTik CRS305-1G-4S+IN"),
 rails:NE("universal rack rails")};
const PRICE={},ORD={};let DB=null,dbState="connecting";
const linkFor=i=>(PRICE[i.ref]&&/^https?:\/\//.test(PRICE[i.ref].url||""))?{u:PRICE[i.ref].url,t:"Buy"}:BUY[i.ref]?{u:BUY[i.ref],t:"Buy"}:FIND[i.ref]?{u:FIND[i.ref],t:"Find"}:null;
const PN=n=>(S.phases||PHASE)[n]||("Phase "+n);
const PHASE={1:"Phase 1: now",2:"Phase 2: Minecraft move",3:"Phase 3: storage server",4:"Phase 4: rack 2, gaming PCs"};
const LABEL={upgrade:"Recommended plan",budget:"Budget build",stepup:"Step-up build"};
const KEY="rackBuilder.v32";
function load(){try{const r=localStorage.getItem(KEY);if(r)return JSON.parse(r)}catch(e){}return {active:"upgrade",builds:presets()}}
let planTimer=null,planLoaded=false;
function save(){try{localStorage.setItem(KEY,JSON.stringify(W))}catch(e){}
  if(DB&&planLoaded){clearTimeout(planTimer);planTimer=setTimeout(()=>{DB.doc("plan/state").set({key:KEY,w:JSON.parse(JSON.stringify(W))}).catch(()=>{})},1500)}}
W=load();S=W.builds[W.active];

const $=id=>document.getElementById(id);
const money=n=>"$"+Math.round(n).toLocaleString();
const rack=()=>{const r=RACKS.find(r=>r.id===S.rack)||RACKS[3];return S.rackP!=null?{...r,p:S.rackP}:r};

function occupied(exceptId){const m=new Set();S.items.forEach(i=>{if(i.pos&&i.u>0&&i.id!==exceptId)for(let k=0;k<i.u;k++)m.add(i.pos+k)});return m}
function fits(pos,u,exceptId){const N=rack().u;if(pos<1||pos+u-1>N)return false;const o=occupied(exceptId);for(let k=0;k<u;k++)if(o.has(pos+k))return false;return true}
function firstFit(u,exceptId){for(let top=rack().u;top>=u;top--){const p=top-u+1;if(fits(p,u,exceptId))return p}return null}

function addItem(base,qty=1){
  const it={id:uid(),ref:base.id,cat:base.cat,name:base.name,u:base.u,w:base.w,p:base.p,qty,pos:null,ph:1};
  if(it.u>0){
    let p=null;
    if(S.target){const tp=S.target-it.u+1;if(fits(tp,it.u))p=tp}
    if(p===null)p=firstFit(it.u);
    if(p===null){flash("No room for "+it.u+"U. Pick a bigger rack or remove something.");return}
    it.pos=p;S.target=null;S.sel=it.id;
  }else{
    const same=S.items.find(i=>i.u===0&&i.name===it.name&&i.p===it.p);
    if(same){same.qty+=qty;render();return}
  }
  S.items.push(it);render();
}
let flashMsg="";function flash(m){flashMsg=m;render();setTimeout(()=>{flashMsg="";render()},3500)}

function refit(){S.items.forEach(i=>{if(i.u>0&&i.pos&&!fits(i.pos,i.u,i.id))i.pos=firstFit(i.u,i.id)})}

function renderCatalog(){
  const q=$("q").value.trim().toLowerCase();let h="";
  for(const k in CATS){const list=CAT.filter(c=>c.cat===k&&(!q||c.name.toLowerCase().includes(q)));if(!list.length)continue;
    h+=`<div class="cat-h">${CATS[k]}</div>`;
    list.forEach(c=>{h+=`<div class="item"><div class="nm"><span class="u-tag ${c.u?"":"zero"}">${c.u}U</span>${c.name}</div><div class="meta">${money(c.p)}${c.w?" · "+c.w+" W":""}</div><button data-add="${c.id}" aria-label="Add ${c.name}">Add</button></div>`})}
  $("catalog").innerHTML=h||'<p class="hint">No parts match. Add it as a custom part below.</p>';
}

function applyLive(){
  const num=v=>typeof v==="number"&&isFinite(v)&&v>=0;
  CAT.forEach(c=>{const L=PRICE[c.id];if(L&&num(L.price))c.p=L.price});
  RACKS.forEach(r=>{const L=PRICE[r.id];if(L&&num(L.price))r.p=L.price});
  for(const k in W.builds)W.builds[k].items.forEach(i=>{const L=PRICE[i.ref];if(L&&num(L.price)&&!i.pEdited)i.p=L.price});
}
function render(){const ae=document.activeElement,aid=ae&&ae.id,sel=ae&&typeof ae.selectionStart==="number"?ae.selectionStart:null;
  render0();
  if(aid){const el=document.getElementById(aid);if(el&&el!==document.activeElement){el.focus();try{if(sel!=null)el.setSelectionRange(sel,sel)}catch(e){}}}}
function render0(){
  applyLive();
  const R=rack(),N=R.u;
  $("rackSel").value=S.rack;$("rate").value=S.rate;
  $("rackTitle").textContent=R.name;
  for(const k in LABEL)$("tab-"+k).setAttribute("aria-selected",W.active===k?"true":"false");
  // rails + bay
  const rows=`repeat(${N},26px)`;
  let rl="",bay="";
  for(let u=N;u>=1;u--){rl+=`<div>${u}</div>`}
  const occ=occupied();
  for(let u=N;u>=1;u--){if(!occ.has(u))bay+=`<button class="slot${S.target===u?" target":""}" data-slot="${u}" style="grid-row:${N-u+1}" aria-label="Empty slot U${u}">${S.target===u?"next item lands here":"empty"}</button>`}
  S.items.filter(i=>i.pos&&i.u>0).forEach(i=>{
    const top=i.pos+i.u-1;
    bay+=`<button class="dev c-${i.cat}${S.sel===i.id?" sel":""}" data-dev="${i.id}" style="grid-row:${N-top+1}/span ${i.u}">${i.w?'<span class="led"></span>':""}<span class="dn">${esc(i.name)}</span><span class="du">${i.u}U</span></button>`});
  $("rack").innerHTML=`<div class="rail" style="grid-template-rows:${rows}">${rl}</div><div class="bay" style="grid-template-rows:${rows}">${bay}</div><div class="rail r" style="grid-template-rows:${rows}">${rl}</div>`;

  // selection box
  const sel=S.items.find(i=>i.id===S.sel&&i.pos);
  $("selbox").innerHTML=sel?`<b>${esc(sel.name)}</b><div class="hint">U${sel.pos}${sel.u>1?"–U"+(sel.pos+sel.u-1):""} · ${sel.w} W · ${money(sel.p)}</div><div class="btns"><button data-mv="1">Move up</button><button data-mv="-1">Move down</button><button data-del="${sel.id}">Remove</button></div>`
    :`<div class="hint">Click a device to move or remove it. Click an empty U to set where the next item goes.</div>`;

  // totals
  const used=S.items.reduce((a,i)=>a+(i.pos?i.u:0),0);
  const watts=S.items.reduce((a,i)=>a+i.w*i.qty,0);
  const total=R.p+S.items.reduce((a,i)=>a+i.p*i.qty,0);
  $("sU").textContent=`${used}/${N}U`;$("sW").textContent=`${watts} W`;
  $("sE").textContent=`$${(watts/1000*24*30.4*S.rate).toFixed(2)}/mo`;$("sT").textContent=money(total);
  $("fill").style.width=Math.min(100,used/N*100)+"%";

  const ups=S.items.filter(i=>/UPS/.test(i.name));
  let w=[];
  const lost=S.items.filter(i=>i.u>0&&!i.pos);
  if(lost.length)w.push(`${lost.length} item(s) don't fit in this rack: ${lost.map(i=>esc(i.name)).join(", ")}.`);
  if(ups.length&&watts>900*ups.length)w.push(`Load of ${watts} W is over a 1500VA UPS's ~900 W rating.`);
  if(flashMsg)w.push(esc(flashMsg));
  $("warns").innerHTML=w.map(x=>`<div class="warn">${x}</div>`).join("");

  // parts table
  let t=`<tr><td>${esc(R.name)}</td><td><span class="pos">frame</span></td><td><span class="pos">${S.rackPh||1}</span></td><td class="n">1</td><td class="n">–</td><td class="n"><input id="rp" type="number" min="0" value="${R.p}" data-rackp aria-label="Rack price"></td><td class="n">${money(R.p)}</td><td></td></tr>`;
  const sorted=[...S.items].sort((a,b)=>((a.ph||1)-(b.ph||1))||((b.pos||-1)-(a.pos||-1)));
  sorted.forEach(i=>{
    const where=i.u===0?"0U / loose":i.pos?`U${i.pos}${i.u>1?"–"+(i.pos+i.u-1):""}`:"won't fit";
    t+=`<tr><td>${esc(i.name)}</td><td><span class="pos">${where}</span></td>
    <td><select id="ph-${i.id}" data-f="ph" data-id="${i.id}" aria-label="Phase">${[...Array(pmax()+1).keys()].map(x=>x+1).map(n=>`<option value="${n}"${(i.ph||1)===n?" selected":""}>${n}</option>`).join("")}</select></td>
    <td class="n">${i.u===0?`<input class="q" id="q-${i.id}" type="number" min="1" value="${i.qty}" data-f="qty" data-id="${i.id}" aria-label="Quantity">`:"1"}</td>
    <td class="n"><input id="w-${i.id}" type="number" min="0" value="${i.w}" data-f="w" data-id="${i.id}" aria-label="Watts"></td>
    <td class="n"><input id="p-${i.id}" type="number" min="0" value="${i.p}" data-f="p" data-id="${i.id}" aria-label="Price"></td>
    <td class="n">${money(i.p*i.qty)}</td><td><button class="x" data-del="${i.id}" aria-label="Remove ${esc(i.name)}">✕</button></td></tr>`});
  $("parts").innerHTML=t;
  renderSteps(R);
  const NP=pmax();const ps={};for(let n=1;n<=NP;n++)ps[n]=0;ps[S.rackPh||1]+=R.p;S.items.forEach(i=>ps[i.ph||1]+=i.p*i.qty);
  const phUsed=new Set([1,...S.items.map(i=>i.ph||1)]);
  let run=0;$("phases").innerHTML=[...Array(NP).keys()].map(x=>x+1).filter(n=>phUsed.has(n)).map(n=>{run+=ps[n];return `<div class="ph"><span>${PN(n)}</span><b>${money(ps[n])}</b><small>${money(run)} so far</small></div>`}).join("");$("tTot").textContent=money(total);
  save();
}
const STAT=[["planned","Planned"],["ordered","Ordered"],["shipped","Shipped"],["delivered","Delivered"],["installed","Installed"]];
const BOUGHT=new Set(["ordered","shipped","delivered","installed"]);
const ordOf=id=>(DB?ORD[id]:(S.orders||{})[id])||{};
function setOrd(id,patch){const cur={...ordOf(id),...patch,updated:new Date().toISOString()};
  if(DB){ORD[id]=cur;DB.doc("orders/"+id).set(cur).catch(()=>flash("Couldn't save that order change. Try again."))}
  else{S.orders=S.orders||{};S.orders[id]=cur}
  render()}
const trackUrl=t=>!t?"":/^https?:\/\//.test(t)?t:"https://www.google.com/search?q="+encodeURIComponent("track package "+t);
const openOrd=new Set();let perCheck=null;
function getPerCheck(){if(perCheck!=null)return perCheck;try{const v=localStorage.getItem("rb.perCheck");if(v!=null)return +v}catch(e){}return 70}
const START=new Date(2026,9,6);
const BOOSTS=[{w:7,add:11.88,why:"AirPods paid off"},{w:12,add:20.05,why:"DeWalt organizer paid off"},{w:21,add:20.80,why:"Perpay fully paid off"}];
function rateAt(w,pc){let r=pc;BOOSTS.forEach(b=>{if(w>=b.w)r+=b.add});return r}
function affordWeek(need){const pc=getPerCheck();if(need<=0)return 1;let t=0;for(let w=1;w<=1560;w++){t+=rateAt(w,pc);if(t>=need)return w}return null}
function payDate(w){return new Date(START.getTime()+(w-1)*7*864e5)}
function fmtDate(d){return d.toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"})}
function renderSteps(R){
  const NP=pmax(),RP=S.rackPh||1,rid="rack-"+W.active;let h="",tot=0,got=0,firstOpen=null,need=0;const live=[];
  const pc=getPerCheck();$("perCheck").value=pc;
  for(let n=1;n<=NP;n++){
    const list=S.items.filter(i=>(i.ph||1)===n);
    const rows=(n===RP?[{id:rid,ref:S.rack,name:R.name,qty:1,p:R.p,bought:S.rackBought}]:[]).concat(list);
    if(!rows.length)continue;
    let cost=0,spent=0,done=0,left=0;
    const body=rows.map(i=>{
      const o=ordOf(i.id),st=o.status||(i.bought?"ordered":"planned"),line=i.p*i.qty;
      const paid=o.paid!==undefined&&o.paid!==""&&isFinite(+o.paid)?+o.paid:null,isB=BOUGHT.has(st);
      cost+=line;if(isB){done++;spent+=paid!=null?paid:line}else left+=line;
      if(st==="ordered"||st==="shipped")live.push({i,o,st});
      const L=linkFor(i),LP=PRICE[i.ref];
      const chk=LP&&LP.checked&&!i.pEdited?`<small class="chk">price checked ${esc(String(LP.checked).slice(0,10))}</small>`:"";
      const sel=`<select class="ost" id="os-${i.id}" data-ost="${i.id}" aria-label="Order status">${STAT.map(([v,t])=>`<option value="${v}"${v===st?" selected":""}>${t}</option>`).join("")}</select>`;
      let row=`<div class="buy st-${st}">${sel}<span class="nm">${i.qty>1?i.qty+"× ":""}${esc(i.name)}${chk}</span>${L?`<a class="lk" href="${esc(L.u)}" target="_blank" rel="noopener">${L.t}</a>`:`<span class="lk none">owned</span>`}<span class="pr">${money(isB&&paid!=null?paid:line)}</span><button class="od" data-od="${i.id}" aria-expanded="${openOrd.has(i.id)}" title="Order details">⋯</button></div>`;
      if(openOrd.has(i.id))row+=`<div class="oform">
        <label class="f">Store<input id="of-${i.id}-store" data-of="${i.id}" data-k="store" value="${esc(o.store||"")}"></label>
        <label class="f">Order #<input id="of-${i.id}-orderNo" data-of="${i.id}" data-k="orderNo" value="${esc(o.orderNo||"")}"></label>
        <label class="f">Tracking # or link<input id="of-${i.id}-tracking" data-of="${i.id}" data-k="tracking" value="${esc(o.tracking||"")}"></label>
        <label class="f">Paid $<input id="of-${i.id}-paid" data-of="${i.id}" data-k="paid" type="number" min="0" step="0.01" value="${esc(o.paid??"")}"></label>
        <label class="f">Order date<input id="of-${i.id}-date" data-of="${i.id}" data-k="date" type="date" value="${esc(o.date||"")}"></label></div>`;
      return row}).join("");
    tot+=cost;got+=spent;if(!/optional/i.test(PN(n)))need+=left;
    const opt=/optional/i.test(PN(n)),wk=opt?null:affordWeek(need),od=wk?payDate(wk):null,past=od&&od<=new Date();
    const when=left===0?"bought":opt?"optional, no date":wk==null?"":past?"order now":`order ~${fmtDate(od)}`;
    const orderNote=left>0&&od?`<p class="when">${past?"You should have the money for this step now.":"Order this step around "+fmtDate(od)+", once your savings cover it."}</p>`:"";
    const complete=done===rows.length;if(!complete&&firstOpen===null)firstOpen=n;
    const open=openSteps.has(n)||(firstOpen===n&&!closedSteps.has(n));
    const note=S.notes&&S.notes[n]?`<p class="note">${esc(S.notes[n])}</p>`:"";
    h+=`<details class="step${complete?" done":""}" data-ph="${n}"${open?" open":""}><summary><span class="sn">${esc(PN(n))}</span><span class="sc">${done}/${rows.length} ordered · <b>${money(cost)}</b> · <span class="when">${when}</span></span></summary><div class="sb">${orderNote}${note}${body}</div></details>`;
  }
  $("steps").innerHTML=h;$("stepSum").textContent=`${money(got)} spent of ${money(tot)}`;
  const fw=affordWeek(need);
  $("budgetHint").textContent=pc>0&&fw?`Saving ${money(pc)} a paycheck from Oct 6, 2026, plus about $53 more a week as your Perpay items get paid off (fully by late Feb 2027), covers everything except the optional extras (${money(need)}) by about ${fmtDate(payDate(fw))}. Assumes weekly paydays, no new Perpay purchases, and buying in step order.`:"Set an amount to see when each step fits.";
  $("inflight").innerHTML=live.length?`<div class="inflight"><h3>On the way</h3>${live.map(({i,o,st})=>`<div class="ir"><span class="pill ${st}">${st}</span><span>${esc(i.name)}</span>${o.store?`<span class="hint">${esc(o.store)}</span>`:""}${o.orderNo?`<span class="when">#${esc(o.orderNo)}</span>`:""}${o.tracking?`<a class="lk" href="${esc(trackUrl(o.tracking))}" target="_blank" rel="noopener">Track</a>`:""}</div>`).join("")}</div>`:"";
}
const openSteps=new Set(),closedSteps=new Set();
document.addEventListener("toggle",e=>{const d=e.target;if(!d.dataset||!d.dataset.ph)return;const n=+d.dataset.ph;if(d.open){openSteps.add(n);closedSteps.delete(n)}else{openSteps.delete(n);closedSteps.add(n)}},true);
document.addEventListener("change",e=>{const el=e.target,d=el.dataset||{};
  if(d.ost){const p={status:el.value};const o=ordOf(d.ost);if(el.value!=="planned"&&!o.date)p.date=new Date().toISOString().slice(0,10);setOrd(d.ost,p)}
  else if(d.of){let v=el.value;if(d.k==="paid")v=v===""?"":Math.max(0,+v||0);setOrd(d.of,{[d.k]:v})}
  else if(el.id==="perCheck"){perCheck=Math.max(0,+el.value||0);try{localStorage.setItem("rb.perCheck",perCheck)}catch(e){}if(DB)DB.doc("settings/budget").set({perCheck}).catch(()=>{});render()}
});
document.addEventListener("click",e=>{const b=e.target.closest("[data-od]");if(!b)return;const id=b.dataset.od;openOrd.has(id)?openOrd.delete(id):openOrd.add(id);render()});
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

// rack price override persists per rack
document.addEventListener("click",e=>{
  const b=e.target.closest("button");if(!b)return;
  if(b.dataset.tab){W.active=b.dataset.tab;S=W.builds[W.active];render()}
  else if(b.id==="restore"){W.builds[W.active]=presets()[W.active];S=W.builds[W.active];render()}
  else if(b.dataset.add){addItem(CAT.find(c=>c.id===b.dataset.add))}
  else if(b.dataset.slot){const u=+b.dataset.slot;S.target=S.target===u?null:u;S.sel=null;render()}
  else if(b.dataset.dev){S.sel=S.sel===b.dataset.dev?null:b.dataset.dev;S.target=null;render()}
  else if(b.dataset.mv){const i=S.items.find(x=>x.id===S.sel);const np=i.pos+(+b.dataset.mv);if(fits(np,i.u,i.id)){i.pos=np;render()}else flash("Something is in the way.")}
  else if(b.dataset.del){S.items=S.items.filter(i=>i.id!==b.dataset.del);if(S.sel===b.dataset.del)S.sel=null;render()}
});
document.addEventListener("change",e=>{
  const el=e.target;
  if(el.dataset.f){const i=S.items.find(x=>x.id===el.dataset.id);const v=Math.max(el.dataset.f==="qty"?1:0,+el.value||0);if(el.dataset.f==="p")i.pEdited=true;i[el.dataset.f]=v;render()}
  else if("rackp" in el.dataset){S.rackP=Math.max(0,+el.value||0);render()}
});
$("rackSel").innerHTML=RACKS.map(r=>`<option value="${r.id}">${r.name} (${r.u}U)</option>`).join("");
$("rackSel").addEventListener("change",e=>{S.rack=e.target.value;S.rackP=null;S.target=null;refit();render()});
$("rate").addEventListener("change",e=>{S.rate=Math.max(0,+e.target.value||0);render()});
$("q").addEventListener("input",renderCatalog);
$("cAdd").addEventListener("click",()=>{
  const name=$("cName").value.trim();if(!name){$("cName").focus();return}
  addItem({cat:"custom",name,u:Math.max(0,Math.min(10,+$("cU").value||0)),w:Math.max(0,+$("cW").value||0),p:Math.max(0,+$("cP").value||0)});
  $("cName").value="";
});
let armed=false;
$("reset").addEventListener("click",e=>{
  if(!armed){armed=true;e.target.textContent="Click again to clear";setTimeout(()=>{armed=false;e.target.textContent="Clear build"},3000);return}
  armed=false;e.target.textContent="Clear build";S.items=[];S.sel=null;S.target=null;render();
});
$("copy").addEventListener("click",()=>{
  const R=rack();const lines=[LABEL[W.active],`${R.name} (${R.u}U) - ${money(R.p)}`];
  let lp=0;[...S.items].sort((a,b)=>((a.ph||1)-(b.ph||1))||((b.pos||-1)-(a.pos||-1))).forEach(i=>(i.ph||1)!==lp&&lines.push("",PN(lp=(i.ph||1)))||lines.push(`${i.qty>1?i.qty+"x ":""}${i.name}${i.pos?` [U${i.pos}]`:""} - ${money(i.p*i.qty)}`));
  lines.push(`Total: ${$("sT").textContent} | ${$("sW").textContent} | ${$("sE").textContent}`);
  const txt=lines.join("\n");
  const done=()=>{$("copyMsg").textContent="Parts list copied."};
  navigator.clipboard?.writeText(txt).then(done).catch(()=>{const c=$("clip");c.value=txt;c.select();try{document.execCommand("copy");done()}catch(e){}});
});
/* ---------- NAS apps ---------- */
const APAL=["#4f7cac","#3f9b8a","#c0843a","#8a6bb1","#b9575a","#5b8f3e","#4b9cc1","#a8708f","#8f8a3a","#5c6bc0","#c26a3f","#3a8f6f"];
let AP=null,apTimer=null;
function apLoadLocal(){try{const r=localStorage.getItem("rb.apps");if(r)return JSON.parse(r)}catch(e){}return null}
function apState(){if(!AP)AP=apLoadLocal()||{host:{name:"NAS",cpu:"",threads:16,ram:32,reserve:2},apps:[]};return AP}
const nz=(v,d)=>{v=parseFloat(v);return isFinite(v)&&v>=0?v:d},f2=n=>String(Math.round(n*100)/100);
let apMode=(()=>{try{return localStorage.getItem("rb.apMode2")||"cap"}catch(e){return "cap"}})();
const sizeOf=a=>apMode==="use"&&typeof a.used==="number"?a.used:nz(a.ram,0);
function apTotals(){const A=apState(),on=A.apps.filter(a=>a.on);const ram=on.reduce((s,a)=>s+sizeOf(a),0),cap=on.reduce((s,a)=>s+nz(a.ram,0),0),thr=on.reduce((s,a)=>s+nz(a.threads,0),0);return{on,ram,cap,thr,free:nz(A.host.ram,0)-nz(A.host.reserve,0)-ram}}
function apRack(){const A=apState(),t=apTotals(),R=Math.max(1,nz(A.host.ram,32)),px=Math.max(7,Math.min(14,480/Math.max(R,nz(A.host.reserve,0)+t.ram)));let y=0,bl="";
  t.on.forEach(a=>{const g=sizeOf(a);if(g<=0)return;const hh=g*px;bl+=`<div class="rb" style="top:${y*px}px;height:${hh}px;background:${esc(a.color||"#4f7cac")}" title="${esc(a.name)}: ${f2(g)} GB">${hh>=14?`<span>${esc(a.name)}</span><span>${g<1?Math.round(g*1024)+" MB":f2(g)+" GB"}</span>`:""}</div>`;y+=g});
  const rs=nz(A.host.reserve,0);if(rs>0){bl+=`<div class="rb sys" style="top:${y*px}px;height:${rs*px}px">${rs*px>=14?`<span>TrueNAS system</span><span>${f2(rs)} GB</span>`:""}</div>`;y+=rs}
  if(t.free>0)bl+=`<div class="rb arc" style="top:${y*px}px;height:${t.free*px}px">${t.free*px>=14?`<span>ZFS cache (ARC)</span><span>${f2(t.free)} GB</span>`:""}</div>`;
  else if(t.free<0)bl+=`<div class="rb over" style="top:${R*px}px;height:${-t.free*px}px"><span>Over by</span><span>${f2(-t.free)} GB</span></div>`;
  const T=Math.max(1,nz(A.host.threads,16)),sc=Math.max(T,t.thr);
  return `<div class="ramrack"><div class="rt"><span>RAM</span><span>${f2(R)} GB</span></div><div class="rambay" style="height:${Math.max(R,R-t.free)*px}px">${bl}</div>
  <div class="rt" style="margin-top:12px"><span>Thread caps</span><span>${f2(t.thr)} / ${f2(T)}</span></div><div class="tbar">${t.on.map(a=>nz(a.threads,0)>0?`<i style="width:${nz(a.threads,0)/sc*100}%;background:${esc(a.color||"#4f7cac")}" title="${esc(a.name)}"></i>`:"").join("")}</div></div>`}
const fB=n=>{n=+n||0;const u=["B","KiB","MiB","GiB"];let i=0;while(n>=1024&&i<3){n/=1024;i++}return (i?n.toFixed(n<10?1:0):Math.round(n))+" "+u[i]};
const fR=n=>{n=(+n||0)*8;const u=["b/s","kb/s","Mb/s","Gb/s"];let i=0;while(n>=1000&&i<3){n/=1000;i++}return (i?n.toFixed(n<10?1:0):Math.round(n))+" "+u[i]};
function spark(vals,color){if(!vals.length)return"";const W=120,H=26,mx=Math.max(...vals,1e-9),n=vals.length;
  const pts=vals.map((v,i)=>`${n>1?(i/(n-1)*W).toFixed(1):W},${(H-1-(v/mx)*(H-3)).toFixed(1)}`).join(" ");
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true"><polygon points="0,${H} ${pts} ${W},${H}" fill="${color}" opacity=".18"/><polyline points="${pts}" fill="none" stroke="${color}" stroke-width="1.5" vector-effect="non-scaling-stroke"/></svg>`}
function cardsHTML(){if(!LIVE||!LIVE.apps||!LIVE.apps.length)return"";const A=apState();
  const mp=matchApps(LIVE.apps.map(a=>a.project));
  const rows=LIVE.apps.map(a=>({a,app:mp[a.project]})).filter(r=>!/rack-?builder/.test(r.a.project));
  rows.sort((x,y)=>(x.app?A.apps.indexOf(x.app):999)-(y.app?A.apps.indexOf(y.app):999));
  return `<div class="lcards">${rows.map(({a,app})=>{const h=a.hist||[],col=(app&&app.color)||"#4f7cac",hl=String(a.health||"");
    const st=/unhealthy/.test(hl)?["bad","Unhealthy"]:/starting/.test(hl)?["warn","Starting"]:["ok","Running"];
    const name=app?app.name:String(a.project).replace(/^ix-/,"");
    return `<div class="lcard"><div class="lh"><span class="sq" style="background:${esc(col)}"></span><b title="${esc(name)}">${esc(name)}</b><span class="ldot ${st[0]}">${st[1]}</span></div><div class="lg">
      <div class="lt"><span>CPU</span><b>${(+a.cpu||0).toFixed(1)}%</b><small>${a.cpus?"cap "+f2(a.cpus)+" threads":"no cap"}</small>${spark(h.map(x=>x[1]),col)}</div>
      <div class="lt"><span>Memory</span><b>${fB(a.mem)}</b><small>${a.limit?"of "+fB(a.limit):"no limit"}</small>${spark(h.map(x=>x[2]),col)}</div>
      <div class="lt"><span>Network</span><b>↓ ${fR(a.rx)}</b><small>↑ ${fR(a.tx)}</small>${spark(h.map(x=>x[3]+x[4]),col)}</div>
      <div class="lt"><span>Disk</span><b>R ${fB(a.rd)}/s</b><small>W ${fB(a.wr)}/s</small>${spark(h.map(x=>x[5]+x[6]),col)}</div></div></div>`}).join("")}</div>`}
function liveHTML(){if(!LIVE||!LIVE.host)return"";const h=LIVE.host,g=v=>typeof v==="number"?(v/1073741824).toFixed(1)+" GB":"–";
  return `<div class="stats" style="margin-bottom:10px"><div class="stat"><b>${typeof h.cpu==="number"?h.cpu.toFixed(1)+"%":"–"}</b><span>Live CPU</span></div><div class="stat"><b>${g(h.memUsed)}</b><span>Services</span></div><div class="stat"><b style="color:var(--good)">${g(h.arc)}</b><span>ZFS cache</span></div><div class="stat"><b>${typeof h.memTotal==="number"&&typeof h.memUsed==="number"?g(Math.max(0,h.memTotal-h.memUsed-(h.arc||0))):"–"}</b><span>Free of ${g(h.memTotal)}</span></div><div class="stat"><b>${new Date(LIVE.ts*1000).toLocaleTimeString()}</b><span>${LIVE.docker?"Updated every "+(LIVE.interval||5)+" s":"Docker stats off"}</span></div></div>`}
function apStats(){const A=apState(),t=apTotals();const lvl=t.free<0?"bad":t.free<4?"accent":"good";
  return `<div class="stats" style="margin-bottom:14px"><div class="stat"><b>${t.on.length} / ${A.apps.length}</b><span>Apps running</span></div><div class="stat"><b>${f2(t.ram)} GB</b><span>${apMode==="use"?"RAM apps use (limits "+f2(t.cap)+" GB)":"RAM limits"}</span></div><div class="stat"><b style="color:var(--${lvl})">${f2(Math.max(0,t.free))} GB</b><span>${t.free<0?"Over by "+f2(-t.free)+" GB":"Left for ZFS cache"}</span></div><div class="stat"><b>${f2(t.thr)} / ${f2(nz(A.host.threads,0))}</b><span>Thread caps</span></div></div>`}
function apRow(a,i,n){return `<div class="arow${a.on?"":" off"}" data-ai="${i}">
  <input type="checkbox" id="ap-on-${esc(a.id)}" data-af="on"${a.on?" checked":""} aria-label="Running">
  <button class="sw" data-aact="color" style="background:${esc(a.color||"#4f7cac")}" aria-label="Change color"></button>
  <input class="c-nm" type="text" id="ap-nm-${esc(a.id)}" data-af="name" value="${esc(a.name)}" aria-label="App name">
  <input type="number" id="ap-th-${esc(a.id)}" data-af="threads" min="0" step="0.5" value="${esc(a.threads)}" aria-label="Thread cap">
  <input type="number" id="ap-ram-${esc(a.id)}" data-af="ram" min="0" step="0.25" value="${esc(a.ram)}" aria-label="RAM GB">
  <span class="use" title="From the last pasted docker stats">${typeof a.used==="number"?(a.used<1?Math.round(a.used*1024)+" MB":f2(a.used)+" GB")+(typeof a.cpu==="number"?"<br>"+a.cpu+"% CPU":""):"–"}</span>
  <input type="text" id="ap-ip-${esc(a.id)}" data-af="ip" value="${esc(a.ip||"")}" placeholder="IP" aria-label="IP">
  <input type="text" id="ap-port-${esc(a.id)}" data-af="port" value="${esc(a.port||"")}" placeholder="Port" aria-label="Port">
  <input class="c-nt" type="text" id="ap-nt-${esc(a.id)}" data-af="notes" value="${esc(a.notes||"")}" placeholder="Notes" aria-label="Notes">
  <div class="aacts c-acts"><button data-aact="up"${i===0?" disabled":""} aria-label="Move up">↑</button><button data-aact="down"${i===n-1?" disabled":""} aria-label="Move down">↓</button><button data-aact="del" aria-label="Delete">✕</button></div></div>`}
function renderApps(){const A=apState(),H=A.host;const hf=(l,k,t)=>`<label class="f">${l}<input id="aph-${k}" data-ah="${k}" type="${t}" value="${esc(H[k]??"")}"${t==="number"?' min="0" step="0.5"':""}></label>`;
  $("viewApps").innerHTML=`<div id="apLive">${liveHTML()}</div><div id="apCards">${cardsHTML()}</div><div id="apStats">${apStats()}</div><div class="apps-grid"><div><div class="apmode" role="group" aria-label="Chart shows"><button data-apmode="use" aria-pressed="${apMode==="use"}">Actual use</button><button data-apmode="cap" aria-pressed="${apMode==="cap"}">Limits</button></div><div id="apRack">${apRack()}</div>${A.usedAt?`<p class="hint" style="margin-top:6px">Usage from ${esc(new Date(A.usedAt).toLocaleString())}</p>`:""}</div><div class="panel"><h2>${esc(H.name||"NAS")} apps</h2>
  <div class="hostf" style="margin-top:8px">${hf("Name","name","text")}${hf("CPU","cpu","text")}${hf("Threads","threads","number")}${hf("RAM (GB)","ram","number")}${hf("System reserve (GB)","reserve","number")}</div>
  <div class="arows" style="margin-top:12px"><div class="ahead"><span>On</span><span></span><span>App</span><span>Threads</span><span>Limit GB</span><span>Using</span><span>IP</span><span>Port</span><span>Notes</span><span></span></div>${A.apps.map((a,i)=>apRow(a,i,A.apps.length)).join("")||'<p class="hint">No apps yet. Add your first one below.</p>'}</div>
  <div class="row" style="margin-top:10px"><button data-aact="add" style="flex:0 0 auto">Add app</button><span class="hint" id="apMsg" style="flex:1 1 200px">${DB?"Changes save automatically.":"Saved in this browser only."}</span></div>
  ${LIVE&&LIVE.docker?"":`<div class="paste"><h2>Update from TrueNAS</h2><p class="hint" style="margin:4px 0 6px">Run this in the TrueNAS shell, then paste the whole output below. Running apps get their real RAM, CPU and limit; anything not listed is marked off.</p>
  <code id="apCmd">sudo docker stats --no-stream --format '{{.Name}} {{.CPUPerc}} {{.MemUsage}}'</code> <button data-aact="copycmd" style="font-size:.78rem;padding:2px 8px">Copy</button>
  <textarea id="apPaste" aria-label="Paste docker stats output" placeholder="ix-plex-plex-1 0.15% 149.6MiB / 6GiB"></textarea>
  <div class="row" style="margin-top:6px"><button data-aact="import" class="primary" style="flex:0 0 auto">Update usage</button><span class="hint" id="apImp" style="flex:1 1 200px"></span></div></div>`}
  <p class="foot">TrueNAS app limits are caps, not reservations, so thread caps can add up past your core count. RAM is the number to watch. Whatever apps and the system don't use, ZFS uses as read cache.</p></div></div>`}
const toGB=(v,u)=>{v=parseFloat(v);u=u.toUpperCase();return u.startsWith("G")?v:u.startsWith("M")?v/1024:u.startsWith("K")?v/1048576:v/1073741824};
const normS=x=>String(x||"").toLowerCase().replace(/[^a-z0-9]/g,"");
function apImport(txt){const A=apState(),seen={};let n=0,unk=[];
  txt.split(/\n/).forEach(line=>{const m=line.trim().match(/^(\S+)\s+([\d.]+)%\s+([\d.]+)\s*([KMG]?i?B)\s*\/\s*([\d.]+)\s*([KMG]?i?B)/i);if(!m)return;
    const cn=normS(m[1].replace(/^ix-/,"").replace(/-\d+$/,""));let best=null,bl=0;
    A.apps.forEach(a=>[normS(a.id),normS(a.name)].forEach(k=>{if(k&&cn.includes(k)&&k.length>bl){best=a;bl=k.length}}));
    if(!best){unk.push(m[1]);return}n++;
    const e=seen[best.id]||(seen[best.id]={used:0,cpu:0,lim:0});e.used+=toGB(m[3],m[4]);e.cpu+=parseFloat(m[2]);e.lim+=toGB(m[5],m[6])});
  if(!n){$("apImp").textContent="Couldn't read that. Paste the full output of the command above.";return}
  A.apps.forEach(a=>{const e=seen[a.id];if(e){a.on=true;a.used=Math.round(e.used*1000)/1000;a.cpu=Math.round(e.cpu*100)/100;if(e.lim>0&&e.lim<nz(A.host.ram,32))a.ram=Math.round(e.lim*100)/100}else{a.on=false}});
  A.usedAt=new Date().toISOString();renderApps();apSave();
  $("apImp").textContent=`Updated ${Object.keys(seen).length} apps from ${n} containers.`+(unk.length?` Not matched: ${unk.join(", ")} (add them as apps first).`:"")}
function apRefresh(){$("apRack").innerHTML=apRack();$("apStats").innerHTML=apStats();const l=$("apLive");if(l)l.innerHTML=liveHTML();const c=$("apCards");if(c)c.innerHTML=cardsHTML();setSync()}
function apSave(){clearTimeout(apTimer);apTimer=setTimeout(()=>{const A=apState();try{localStorage.setItem("rb.apps",JSON.stringify(A))}catch(e){}if(DB)DB.doc("nas/apps").set(JSON.parse(JSON.stringify(A))).then(()=>{const m=$("apMsg");if(m)m.textContent="Saved."}).catch(()=>{const m=$("apMsg");if(m)m.textContent="Couldn't save. Try again in a moment."})},700)}
$("viewApps").addEventListener("input",e=>{const el=e.target,A=apState();
  if(el.dataset.ah){const k=el.dataset.ah;A.host[k]=el.type==="number"?nz(el.value,0):el.value;apRefresh();apSave();return}
  const r=el.closest(".arow");if(!r||!el.dataset.af)return;const a=A.apps[+r.dataset.ai],k=el.dataset.af;
  if(k==="on"){a.on=el.checked;r.classList.toggle("off",!a.on)}else a[k]=el.type==="number"?nz(el.value,0):el.value;apRefresh();apSave()});
$("viewApps").addEventListener("click",e=>{const m=e.target.closest("[data-apmode]");if(m){apMode=m.dataset.apmode;try{localStorage.setItem("rb.apMode2",apMode)}catch(x){}renderApps();return}
  const c=e.target.closest('[data-aact="copycmd"]');if(c){const t=$("apCmd").textContent;navigator.clipboard?.writeText(t).then(()=>{c.textContent="Copied"},()=>{});return}
  const im=e.target.closest('[data-aact="import"]');if(im){apImport($("apPaste").value);return}
  const b=e.target.closest("[data-aact]");if(!b||b.disabled)return;const A=apState(),r=b.closest(".arow"),i=r?+r.dataset.ai:-1,act=b.dataset.aact;
  if(act==="add"){const used=A.apps.map(a=>a.color);A.apps.push({id:"app"+Date.now().toString(36),name:"New app",threads:1,ram:1,ip:"",port:"",notes:"",on:true,color:APAL.find(c=>!used.includes(c))||APAL[0]})}
  else if(act==="up"&&i>0)A.apps.splice(i-1,0,A.apps.splice(i,1)[0]);
  else if(act==="down"&&i<A.apps.length-1)A.apps.splice(i+1,0,A.apps.splice(i,1)[0]);
  else if(act==="del"){if(!b.dataset.confirm){b.dataset.confirm="1";b.textContent="?";b.title="Click again to delete";setTimeout(()=>{if(b.isConnected){delete b.dataset.confirm;b.textContent="✕"}},2500);return}A.apps.splice(i,1)}
  else if(act==="color"){const a=A.apps[i];a.color=APAL[(APAL.indexOf(a.color)+1)%APAL.length]}
  renderApps();apSave()});
/* ---------- backup / move ---------- */
$("exportData").addEventListener("click",()=>{const data={rackBuilder:1,orders:DB?ORD:(S.orders||{}),settings:{perCheck:getPerCheck()},apps:apState(),plan:{key:KEY,w:W}};
  const txt=JSON.stringify(data);const done=()=>{$("xferMsg").textContent="Copied. Paste it into the other copy's import box."};
  navigator.clipboard?.writeText(txt).then(done).catch(()=>{const b=$("importBox");b.value=txt;b.select();$("xferMsg").textContent="Copy was blocked here, so the data is in the box below. Select it and copy."})});
$("importData").addEventListener("click",async()=>{let d;try{d=JSON.parse($("importBox").value)}catch(e){$("xferMsg").textContent="That isn't Rack Builder data. Copy it again from the other copy.";return}
  if(!d||d.rackBuilder!==1){$("xferMsg").textContent="That isn't Rack Builder data.";return}
  try{if(d.plan&&d.plan.w&&d.plan.w.builds){W=d.plan.w;S=W.builds[W.active]||W.builds.upgrade;save()}
    if(d.apps&&Array.isArray(d.apps.apps)){AP=d.apps;apSave()}
    if(d.settings&&typeof d.settings.perCheck==="number"){perCheck=d.settings.perCheck;try{localStorage.setItem("rb.perCheck",perCheck)}catch(e){}if(DB)await DB.doc("settings/budget").set({perCheck})}
    const o=d.orders||{};if(DB){for(const k in o){ORD[k]=o[k];await DB.doc("orders/"+k).set(o[k])}}else{S.orders=o}
    if(DB&&d.plan)await DB.doc("plan/state").set({key:KEY,w:JSON.parse(JSON.stringify(W))});
    render();if(VIEW==="apps")renderApps();$("xferMsg").textContent="Imported.";$("importBox").value=""}catch(e){$("xferMsg").textContent="Some of it didn't save. Try importing again."}});
/* ---------- views ---------- */
const KIOSK=location.hash==="#live";if(KIOSK)document.body.classList.add("kiosk");
let VIEW=KIOSK||location.hash==="#apps"?"apps":(()=>{try{return localStorage.getItem("rb.view")||"plan"}catch(e){return "plan"}})();
function setView(v){VIEW=v;if(!KIOSK)try{localStorage.setItem("rb.view",v)}catch(e){}$("viewPlan").hidden=v!=="plan";$("planStats").hidden=v!=="plan";$("viewApps").hidden=v!=="apps";
  $("v-plan").setAttribute("aria-selected",v==="plan");$("v-apps").setAttribute("aria-selected",v==="apps");if(v==="apps")renderApps()}
document.addEventListener("click",e=>{const b=e.target.closest("[data-view]");if(b)setView(b.dataset.view)});
function setSync(){const kl=$("kioskLink");if(kl)kl.hidden=!(LIVE&&LIVE.apps&&LIVE.apps.length);
  $("sync").textContent=SRV?(LIVE&&LIVE.docker?"Running on your NAS · live stats on":"Running on your NAS"):DB?"Synced: orders, prices and apps save to this page":dbState==="off"?"Saving in this browser only":"Connecting…"}
/* ---------- storage: TrueNAS server or claude.ai page db ---------- */
let SRV=false,LIVE=null;
function makeServerDB(){const subs=[];let cache={},ver=-1;
  const snap=p=>({id:p.split("/").pop(),exists:Object.prototype.hasOwnProperty.call(cache,p),data:()=>cache[p]});
  const fire=()=>subs.forEach(f=>{try{f()}catch(e){}});
  async function pull(){try{const r=await fetch("api/state",{cache:"no-store"});if(!r.ok)return;const j=await r.json();if(j.ver!==ver){ver=j.ver;cache=j.docs||{};fire()}}catch(e){}}
  const db={ready:pull(),
    doc(p){return{async set(d){cache[p]=JSON.parse(JSON.stringify(d));const r=await fetch("api/doc/"+p,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(d)});if(!r.ok)throw{code:"unavailable"};const j=await r.json();ver=j.ver;fire()},
      async get(){return snap(p)},
      onSnapshot(cb){const f=()=>cb(snap(p));subs.push(f);f();return()=>{}}}},
    collection(n){return{onSnapshot(cb){const f=()=>{const docs=Object.keys(cache).filter(k=>k.startsWith(n+"/")&&k.split("/").length===2).map(snap);cb({docs,size:docs.length,empty:!docs.length})};subs.push(f);f();return()=>{}}}}};
  setInterval(pull,5000);return db}
function wireDB(){
  DB.collection("orders").onSnapshot(q=>{for(const k in ORD)delete ORD[k];q.docs.forEach(d=>{ORD[d.id]=JSON.parse(JSON.stringify(d.data()||{}))});render()},()=>{});
  DB.collection("prices").onSnapshot(q=>{for(const k in PRICE)delete PRICE[k];q.docs.forEach(d=>{PRICE[d.id]=d.data()||{}});renderCatalog();render()},()=>{});
  DB.doc("settings/budget").onSnapshot(d=>{const v=d.exists?(d.data()||{}).perCheck:null;if(typeof v==="number"&&perCheck!==v){perCheck=v;render()}},()=>{});
  DB.doc("plan/state").onSnapshot(d=>{if(planLoaded)return;planLoaded=true;const v=d.exists?d.data():null;
    if(v&&v.key===KEY&&v.w&&v.w.builds){W=JSON.parse(JSON.stringify(v.w));S=W.builds[W.active]||W.builds.upgrade;render()}else save()},()=>{planLoaded=true});
  DB.doc("nas/apps").onSnapshot(d=>{if(!d.exists)return;const v=JSON.parse(JSON.stringify(d.data()));const ae=document.activeElement;
    AP=v;if(LIVE)applyLiveApps();if(VIEW==="apps"){if(ae&&$("viewApps").contains(ae)&&ae.tagName==="INPUT")apRefresh();else renderApps()}},()=>{});
}
/* live stats from the TrueNAS server */
function projKey(p){return normS(String(p||"").replace(/^ix-/,"").replace(/-\d+$/,""))}
function matchApps(projs){const A=apState(),out={},claimed=new Set();
  projs.forEach(p=>{const k=projKey(p);const a=A.apps.find(x=>x.proj===k&&!claimed.has(x))||A.apps.find(x=>!x.proj&&!claimed.has(x)&&(normS(x.id)===k||normS(x.name)===k));if(a){out[p]=a;claimed.add(a)}});
  projs.forEach(p=>{if(out[p])return;const k=projKey(p);let best=null,bl=0;
    A.apps.forEach(x=>{if(claimed.has(x)||x.proj)return;[normS(x.id),normS(x.name)].forEach(q=>{if(q&&k.includes(q)&&q.length>bl){best=x;bl=q.length}})});
    if(best){out[p]=best;claimed.add(best)}});
  return out}
function applyLiveApps(){if(!LIVE||!LIVE.containers)return;const A=apState(),seen={};
  const projs=[...new Set(LIVE.containers.map(c=>c.project||c.name))].filter(p=>projKey(p)!=="rackbuilder");
  const map=matchApps(projs);
  projs.forEach(p=>{if(map[p])return;const nm=String(p).replace(/^ix-/,"").replace(/-\d+$/,"");const used=A.apps.map(a=>a.color);
    const app={id:projKey(p),proj:projKey(p),name:nm.replace(/[-_]+/g," ").replace(/\b\w/g,m=>m.toUpperCase()),threads:0,ram:0,ip:"",port:"",notes:"Added from live stats",on:true,color:APAL.find(x=>!used.includes(x))||APAL[A.apps.length%APAL.length]};
    A.apps.push(app);map[p]=app;addedLive=true});
  LIVE.containers.forEach(c=>{const app=map[c.project||c.name];if(!app)return;if(!app.proj){app.proj=projKey(c.project||c.name);addedLive=true}
    const e=seen[app.id]||(seen[app.id]={used:0,cpu:0,lim:0,cpus:0});e.used+=c.mem/1073741824;e.cpu+=c.cpu;e.lim+=c.limit/1073741824;e.cpus+=c.cpus||0;
    if(c.ports&&c.ports.length&&!app.port)app.port=c.ports.join(", ");if(c.ip&&!app.ip)app.ip=c.ip});
  A.apps.forEach(a=>{const e=seen[a.id];if(e){a.on=true;a.used=Math.round(e.used*1000)/1000;a.cpu=Math.round(e.cpu*100)/100;if(e.lim>0&&e.lim<nz(A.host.ram,32))a.ram=Math.round(e.lim*100)/100;if(e.cpus>0)a.threads=Math.round(e.cpus*100)/100}else a.on=false});
  if(A.host&&LIVE.host&&LIVE.host.memTotal&&!A.host.ramSet){A.host.ram=Math.round(LIVE.host.memTotal/1073741824)}
  A.usedAt=new Date(LIVE.ts*1000).toISOString()}
let liveSaveAt=0,addedLive=false;
async function pollLive(){try{const r=await fetch("api/live",{cache:"no-store"});if(!r.ok)return;LIVE=await r.json();applyLiveApps();
  const wasAdded=addedLive;if(addedLive||Date.now()-liveSaveAt>300000){liveSaveAt=Date.now();apSave()}addedLive=wasAdded;
  if(VIEW==="apps"){if(addedLive||!$("apCards"))renderApps();else apRefresh()}addedLive=false}catch(e){}}
function liveLoop(){pollLive().finally(()=>setTimeout(liveLoop,VIEW==="apps"?((LIVE&&LIVE.interval)||5)*1000:30000))}
(async()=>{
  try{const r=await fetch("api/ping",{cache:"no-store"});if(r.ok){const j=await r.json();SRV=j&&j.app==="rack-builder"}}catch(e){}
  if(SRV){DB=makeServerDB();await DB.ready;dbState="on";setSync();wireDB();liveLoop();return}
  try{DB=window.claude&&window.claude.use?await window.claude.use("db"):null}catch(e){DB=null}
  dbState=DB?"on":"off";setSync();if(DB)wireDB();
})();
setSync();setView(VIEW);
renderCatalog();render();
