
export const WARD_SYMBOL_MAP: Record<string, string> = {
  'Nakota Isga': 'Na',
  'Anirniq': 'An',
  'tastawiyiniwak': 'ta',
  'Dene': 'De',
  'O-day\'min': 'Od',
  'O-day’min': 'Od', // Handle smart quote
  'Métis': 'Mé',
  'sipiwiyiniwak': 'si',
  'papastew': 'pa',
  'pihêsiwin': 'pi',
  'Ipiihkoohkanipiaohtsi': 'Ip',
  'Karhiio': 'Ka',
  'Sspomitapi': 'Ss'
};

export const COLOR_SCALE = [
  '#2c7bb6', // Cold (Blue)
  '#abd9e9', 
  '#ffffbf', // Neutral
  '#fdae61', 
  '#d7191c'  // Warm (Red)
];

// CSV Header Template for external municipalities
export const CSV_TEMPLATE_HEADER = `ID,Ward Name,Neighbourhood,Type,Population,Households,Median Income,Median Home Price,Sustainable Mode %,Affordabliiy Ratio`;

// CSV Header: ID, Ward Name, Neighbourhood, Type, Population, Households, Median Income, Median Home Price, Sustainable Mode %, Affordabliiy Ratio
export const RAW_CSV_DATA = `${CSV_TEMPLATE_HEADER}
An,Anirniq,Athlone,Residential,"3,240","1,410","78,500","365,000",14.7,4.6
An,Anirniq,Baranow,Residential,"1,200",700,"72,000","240,000",18.5,3.3
An,Anirniq,Baturyn,Residential,"4,800","1,750","94,000","410,000",12.4,4.4
An,Anirniq,Beaumaris,Residential,"4,250","1,850","91,200","415,000",14.7,4.6
An,Anirniq,Caernarvon,Residential,"3,800","1,450","88,000","395,000",13.2,4.5
An,Anirniq,Calder,Residential,"4,120","1,880","72,100","342,000",14.7,4.7
An,Anirniq,Canossa,Residential,"3,600","1,200","105,000","465,000",11.2,4.4
An,Anirniq,Carlisle,Residential,"3,800","1,450","82,000","360,000",14.5,4.4
An,Anirniq,Chambery,Residential,"2,400",800,"125,000","540,000",9.8,4.3
An,Anirniq,Dovercourt,Residential,"1,850",820,"86,400","431,000",14.7,5.0
An,Anirniq,Dunluce,Residential,"6,200","2,400","84,000","370,000",14.2,4.4
An,Anirniq,Elsinore,Residential,"2,100",750,"112,000","495,000",10.4,4.4
An,Anirniq,Griesbach,Residential,"5,400","2,100","105,000","540,000",14.7,5.1
An,Anirniq,Kensington,Residential,"3,620","1,590","82,000","375,000",14.7,4.6
An,Anirniq,Lauderdale,Residential,"2,850","1,290","71,000","338,000",14.7,4.8
An,Anirniq,Lorelei,Residential,"3,800","1,400","92,000","405,000",12.8,4.4
An,Anirniq,Oxford,Residential,"3,600","1,300","108,000","480,000",11.5,4.4
An,Anirniq,Prince Charles,Residential,"1,320",640,"79,500","398,000",14.7,5.0
An,Anirniq,Rosslyn,Residential,"3,410","1,520","81,200","388,000",14.7,4.8
An,Anirniq,Sherbrooke,Residential,"2,550","1,180","89,200","442,000",14.7,5.0
An,Anirniq,Wellington,Residential,"3,100","1,380","84,500","392,000",14.7,4.6
De,Dene,Bannerman,Residential,"2,950","1,120","86,500","368,000",11.4,4.3
De,Dene,Belmont,Residential,"5,100","1,980","88,400","382,000",11.4,4.3
De,Dene,Casselman,Residential,"3,620","1,450","82,300","362,000",11.4,4.4
De,Dene,Clareview Town Centre,Residential,"4,150","1,820","74,100","328,000",11.4,4.4
De,Dene,Ebbers,Residential,"1,200",500,"105,000","425,000",12.4,4.0
De,Dene,Fraser,Residential,"3,250","1,180","98,100","425,000",11.4,4.3
De,Dene,Hairsine,Residential,"2,550","1,050","83,200","345,000",11.4,4.1
De,Dene,Hollick-Kenyon,Residential,"5,400","1,750","112,000","485,000",9.8,4.3
De,Dene,Kernohan,Residential,"3,120","1,210","95,200","412,000",11.4,4.3
De,Dene,Kildare,Residential,"2,800","1,100","78,000","345,000",15.2,4.4
De,Dene,Kirkness,Residential,"3,400","1,250","92,000","395,000",12.4,4.3
De,Dene,McLeod,Residential,"2,400",950,"88,000","385,000",14.1,4.4
De,Dene,Miller,Residential,"3,400","1,200","102,000","445,000",11.4,4.4
De,Dene,Overlanders,Residential,"2,850","1,150","81,400","332,000",11.4,4.1
De,Dene,Sifton Park,Residential,"2,100",900,"76,000","315,000",16.4,4.1
De,Dene,York,Residential,"3,850","1,510","81,500","358,000",11.4,4.4
Ip,Ipiihkoohkanipiaohtsi,Allard,Residential,"4,250","1,420","118,500","525,000",11.7,4.4
Ip,Ipiihkoohkanipiaohtsi,Blackburne,Residential,"1,520",610,"124,500","565,000",11.7,4.5
Ip,Ipiihkoohkanipiaohtsi,Blackmud Creek,Residential,"2,800","1,050","128,000","585,000",10.2,4.6
Ip,Ipiihkoohkanipiaohtsi,Callaghan,Residential,"2,850","1,050","116,200","498,000",11.7,4.3
Ip,Ipiihkoohkanipiaohtsi,Cavanagh,Residential,"2,150",810,"105,400","462,000",11.7,4.4
Ip,Ipiihkoohkanipiaohtsi,Chappelle,Residential,"8,540","2,950","112,400","495,000",11.7,4.4
Ip,Ipiihkoohkanipiaohtsi,Desrochers,Residential,"3,850","1,350","108,200","475,000",11.7,4.4
Ip,Ipiihkoohkanipiaohtsi,Graydon Hill,Residential,"1,100",450,"115,000","495,000",10.8,4.3
Ip,Ipiihkoohkanipiaohtsi,Hays Ridge,Residential,850,320,"132,000","595,000",9.4,4.5
Ip,Ipiihkoohkanipiaohtsi,MacEwan,Residential,"5,850","2,350","102,500","425,000",11.7,4.1
Ip,Ipiihkoohkanipiaohtsi,Paisley,Residential,"1,400",620,"98,000","385,000",14.5,3.9
Ip,Ipiihkoohkanipiaohtsi,Richford,Residential,650,240,"145,000","725,000",8.2,5.0
Ip,Ipiihkoohkanipiaohtsi,Rutherford,Residential,"9,250","3,420","115,200","488,000",11.7,4.2
Ka,Karhiio,Bisset,Residential,"3,800","1,400","88,000","385,000",9.8,4.4
Ka,Karhiio,Crawford Plains,Residential,"4,200","1,450","86,000","375,000",9.8,4.4
Ka,Karhiio,Daly Grove,Residential,"3,450","1,210","88,400","378,000",9.8,4.3
Ka,Karhiio,Ekota,Residential,"2,600","1,050","82,000","365,000",12.1,4.5
Ka,Karhiio,Greenview,Residential,"2,800","1,150","78,000","355,000",15.4,4.6
Ka,Karhiio,Hillview,Residential,"3,200","1,250","76,000","345,000",14.8,4.5
Ka,Karhiio,Jackson Heights,Residential,"3,920","1,250","108,500","498,000",9.8,4.6
Ka,Karhiio,Kameyosek,Residential,"2,600","1,100","68,000","285,000",22.4,4.2
Ka,Karhiio,Kiniski Gardens,Residential,"6,850","2,250","94,200","395,000",9.8,4.2
Ka,Karhiio,Menisa,Residential,"2,550",950,"104,500","465,000",9.8,4.4
Ka,Karhiio,Meyokumin,Residential,"2,850","1,050","92,400","415,000",9.8,4.5
Ka,Karhiio,Meyonohk,Residential,"3,100","1,200","78,000","340,000",12.8,4.4
Ka,Karhiio,Pollard Meadows,Residential,"4,520","1,650","82,500","345,000",9.8,4.2
Ka,Karhiio,Sakaw,Residential,"3,850","1,320","95,200","428,000",9.8,4.5
Ka,Karhiio,Satoo,Residential,"3,400","1,250","96,000","435,000",10.4,4.5
Ka,Karhiio,Tipaskan,Residential,"2,900","1,150","74,000","325,000",14.2,4.4
Ka,Karhiio,Weinlos,Residential,"3,400","1,250","84,000","370,000",10.8,4.4
Me,Métis,Alberta Avenue,Residential,"6,200","3,100","58,000","315,000",32.1,5.4
Me,Métis,Beacon Heights,Residential,"2,800","1,250","72,000","345,000",20.4,4.8
Me,Métis,Bellevue,Residential,"2,200","1,100","84,000","465,000",18.5,5.5
Me,Métis,Britannia Youngstown,Residential,"4,500","2,100","68,000","320,000",24.5,4.7
Me,Métis,Canora,Residential,"3,400","1,800","62,000","310,000",26.8,5.0
Me,Métis,Crestwood,Residential,"2,350",980,"142,000","925,000",20.4,6.5
Me,Métis,Cromdale,Residential,"2,100","1,200","52,000","245,000",42.1,4.7
Me,Métis,Delton,Residential,"2,100",950,"68,000","340,000",28.4,5.0
Me,Métis,Eastwood,Residential,"3,600","2,100","48,000","235,000",38.5,4.9
Me,Métis,Elmwood Park,Residential,"1,100",550,"56,000","310,000",30.2,5.5
Me,Métis,Glenora,Residential,"3,820","1,450","135,400","895,000",20.4,6.6
Me,Métis,Grovenor,Residential,"2,250","1,050","94,500","542,000",20.4,5.7
Me,Métis,High Park,Residential,"1,400",750,"72,000","365,000",18.4,5.1
Me,Métis,Inglewood,Residential,"3,200","1,900","65,000","335,000",30.1,5.2
Me,Métis,Jasper Park,Residential,"1,800",950,"76,000","375,000",20.4,4.9
Me,Métis,Laurier Heights,Residential,"2,850","1,120","132,400","845,000",20.4,6.4
Me,Métis,Mayfield,Residential,"1,950",900,"78,000","365,000",19.5,4.7
Me,Métis,McQueen,Residential,"1,600",750,"82,000","410,000",20.4,5.0
Me,Métis,Montrose,Residential,"3,200","1,500","68,000","345,000",22.5,5.1
Me,Métis,North Glenora,Residential,"1,950",880,"98,200","585,000",20.4,6.0
Me,Métis,Parkview,Residential,"3,250","1,310","128,500","815,000",20.4,6.3
Me,Métis,Sherwood,Residential,"1,200",600,"74,000","385,000",20.4,5.2
Me,Métis,Spruce Avenue,Residential,"2,100","1,150","62,000","320,000",35.1,5.2
Me,Métis,Virginia Park,Residential,800,450,"78,000","395,000",24.8,5.1
Me,Métis,Westmount,Residential,"6,120","2,850","88,500","518,000",20.4,5.9
Me,Métis,Woodcroft,Residential,"2,800","1,400","72,000","360,000",22.1,5.0
Na,Nakota Isga,Aldergrove,Residential,"5,420","2,100","91,200","412,000",11.9,4.5
Na,Nakota Isga,Belmead,Residential,"4,650","1,750","88,500","395,000",11.9,4.5
Na,Nakota Isga,Callingwood North,Residential,"2,450","1,100","78,000","320,000",15.4,4.1
Na,Nakota Isga,Callingwood South,Residential,"3,800","1,650","76,500","310,000",15.8,4.1
Na,Nakota Isga,Dechene,Residential,"1,650",580,"122,500","565,000",10.6,4.6
Na,Nakota Isga,Gariepy,Residential,"1,850",720,"118,500","545,000",9.4,4.6
Na,Nakota Isga,Glastonbury,Residential,"6,520","2,450","108,400","492,000",11.9,4.5
Na,Nakota Isga,Granville,Residential,"3,850","1,420","115,400","535,000",11.9,4.6
Na,Nakota Isga,Hamptons,Residential,"9,850","3,150","112,500","518,000",11.9,4.6
Na,Nakota Isga,Jamieson Place,Residential,"3,800","1,300","105,000","480,000",10.1,4.6
Na,Nakota Isga,Lymburn,Residential,"5,600","2,100","92,000","410,000",12.1,4.5
Na,Nakota Isga,Ormsby Place,Residential,"5,400","2,050","94,000","420,000",11.8,4.5
Na,Nakota Isga,Potter Greens,Residential,"1,420",550,"142,000","610,000",9.2,4.3
Na,Nakota Isga,Rosenthal,Residential,"4,520","1,650","102,500","462,000",11.9,4.5
Na,Nakota Isga,Secord,Residential,"6,250","2,210","104,200","475,000",11.9,4.6
Na,Nakota Isga,Stewart Greens,Residential,"1,200",450,"108,000","490,000",10.5,4.5
Na,Nakota Isga,Suder Greens,Residential,"2,100",800,"110,000","505,000",10.8,4.6
Na,Nakota Isga,Summerlea,Residential,"2,100","1,100","72,000","290,000",18.2,4.0
Na,Nakota Isga,Terra Losa,Residential,"2,400","1,400","68,000","260,000",21.4,3.8
Na,Nakota Isga,Thorncliffe,Residential,"3,600","1,450","79,000","340,000",14.5,4.3
Na,Nakota Isga,Wedgewood Heights,Residential,"1,500",520,"155,000","740,000",7.8,4.8
Na,Nakota Isga,Westridge,Residential,"1,400",500,"148,000","690,000",8.4,4.7
Od,O-day’min,Boyle Street,Residential,"7,250","4,850","42,500","245,000",71.5,5.8
Od,O-day’min,Central McDougall,Residential,"5,600","3,100","44,200","255,000",52.4,5.8
Od,O-day’min,Cloverdale,Residential,850,450,"115,000","620,000",32.5,5.4
Od,O-day’min,Downtown,Residential,"10,240","6,120","64,500","318,000",71.5,4.9
Od,O-day’min,McCauley,Residential,"4,520","2,450","48,500","295,000",47.7,6.1
Od,O-day’min,Oliver (Wîhkwêntôwin),Residential,"19,550","11,250","62,500","308,000",71.5,4.9
Od,O-day’min,Queen Mary Park,Residential,"7,200","4,500","52,000","265,000",54.8,5.1
Od,O-day’min,Riverdale,Residential,"2,100","1,000","94,000","580,000",38.4,6.2
Od,O-day’min,Rossdale,Residential,850,450,"105,000","585,000",47.7,5.6`;
