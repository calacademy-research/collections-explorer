interface CountryInfo {
  emoji: string;
  alpha2: string;
  alpha3: string;
}

const countryData: { [key: string]: CountryInfo } = {
  "United States": {
    emoji: "🇺🇸",
    alpha2: "US",
    alpha3: "USA"
  },
  "Canada": {
    emoji: "🇨🇦",
    alpha2: "CA",
    alpha3: "CAN"
  },
  "Mexico": {
    emoji: "🇲🇽",
    alpha2: "MX",
    alpha3: "MEX"
  },
  "United Kingdom": {
    emoji: "🇬🇧",
    alpha2: "GB",
    alpha3: "GBR"
  },
  "Germany": {
    emoji: "🇩🇪",
    alpha2: "DE",
    alpha3: "DEU"
  },
  "France": {
    emoji: "🇫🇷",
    alpha2: "FR",
    alpha3: "FRA"
  },
  "Italy": {
    emoji: "🇮🇹",
    alpha2: "IT",
    alpha3: "ITA"
  },
  "Spain": {
    emoji: "🇪🇸",
    alpha2: "ES",
    alpha3: "ESP"
  },
  "Australia": {
    emoji: "🇦🇺",
    alpha2: "AU",
    alpha3: "AUS"
  },
  "India": {
    emoji: "🇮🇳",
    alpha2: "IN",
    alpha3: "IND"
  },
  "China": {
    emoji: "🇨🇳",
    alpha2: "CN",
    alpha3: "CHN"
  },
  "Japan": {
    emoji: "🇯🇵",
    alpha2: "JP",
    alpha3: "JPN"
  },
  "Brazil": {
    emoji: "🇧🇷",
    alpha2: "BR",
    alpha3: "BRA"
  },
  "South Africa": {
    emoji: "🇿🇦",
    alpha2: "ZA",
    alpha3: "ZAF"
  },
  "Costa Rica": {
    emoji: "🇨🇷",
    alpha2: "CR",
    alpha3: "CRI"
  },
  "Argentina": {
    emoji: "🇦🇷",
    alpha2: "AR",
    alpha3: "ARG"
  },
  "Chile": {
    emoji: "🇨🇱",
    alpha2: "CL",
    alpha3: "CHL"
  },
  "Colombia": {
    emoji: "🇨🇴",
    alpha2: "CO",
    alpha3: "COL"
  },
  "Peru": {
    emoji: "🇵🇪",
    alpha2: "PE",
    alpha3: "PER"
  },
  "New Zealand": {
    emoji: "🇳🇿",
    alpha2: "NZ",
    alpha3: "NZL"
  },
  "Russia": {
    emoji: "🇷🇺",
    alpha2: "RU",
    alpha3: "RUS"
  },
  "South Korea": {
    emoji: "🇰🇷",
    alpha2: "KR",
    alpha3: "KOR"
  },
  "Sweden": {
    emoji: "🇸🇪",
    alpha2: "SE",
    alpha3: "SWE"
  },
  "Norway": {
    emoji: "🇳🇴",
    alpha2: "NO",
    alpha3: "NOR"
  },
  "Finland": {
    emoji: "🇫🇮",
    alpha2: "FI",
    alpha3: "FIN"
  },
  "Denmark": {
    emoji: "🇩🇰",
    alpha2: "DK",
    alpha3: "DNK"
  },
  "Netherlands": {
    emoji: "🇳🇱",
    alpha2: "NL",
    alpha3: "NLD"
  },
  "Belgium": {
    emoji: "🇧🇪",
    alpha2: "BE",
    alpha3: "BEL"
  },
  "Switzerland": {
    emoji: "🇨🇭",
    alpha2: "CH",
    alpha3: "CHE"
  },
  "Austria": {
    emoji: "🇦🇹",
    alpha2: "AT",
    alpha3: "AUT"
  },
  "Greece": {
    emoji: "🇬🇷",
    alpha2: "GR",
    alpha3: "GRC"
  },
  "Portugal": {
    emoji: "🇵🇹",
    alpha2: "PT",
    alpha3: "PRT"
  },
  "Turkey": {
    emoji: "🇹🇷",
    alpha2: "TR",
    alpha3: "TUR"
  },
  "Israel": {
    emoji: "🇮🇱",
    alpha2: "IL",
    alpha3: "ISR"
  },
  "Egypt": {
    emoji: "🇪🇬",
    alpha2: "EG",
    alpha3: "EGY"
  },
  "Saudi Arabia": {
    emoji: "🇸🇦",
    alpha2: "SA",
    alpha3: "SAU"
  },
  "United Arab Emirates": {
    emoji: "🇦🇪",
    alpha2: "AE",
    alpha3: "ARE"
  },
  "Singapore": {
    emoji: "🇸🇬",
    alpha2: "SG",
    alpha3: "SGP"
  },
  "Malaysia": {
    emoji: "🇲🇾",
    alpha2: "MY",
    alpha3: "MYS"
  },
  "Thailand": {
    emoji: "🇹🇭",
    alpha2: "TH",
    alpha3: "THA"
  },
  "Vietnam": {
    emoji: "🇻🇳",
    alpha2: "VN",
    alpha3: "VNM"
  },
  "Philippines": {
    emoji: "🇵🇭",
    alpha2: "PH",
    alpha3: "PHL"
  },
  "Indonesia": {
    emoji: "🇮🇩",
    alpha2: "ID",
    alpha3: "IDN"
  },
  "Bangladesh": {
    emoji: "🇧🇩",
    alpha2: "BD",
    alpha3: "BGD"
  },
  "Pakistan": {
    emoji: "🇵🇰",
    alpha2: "PK",
    alpha3: "PAK"
  },
  "Iraq": {
    emoji: "🇮🇶",
    alpha2: "IQ",
    alpha3: "IRQ"
  },
  "Iran": {
    emoji: "🇮🇷",
    alpha2: "IR",
    alpha3: "IRN"
  },
  "Afghanistan": {
    emoji: "🇦🇫",
    alpha2: "AF",
    alpha3: "AFG"
  },
  "Kazakhstan": {
    emoji: "🇰🇿",
    alpha2: "KZ",
    alpha3: "KAZ"
  },
  "Ukraine": {
    emoji: "🇺🇦",
    alpha2: "UA",
    alpha3: "UKR"
  },
  "Poland": {
    emoji: "🇵🇱",
    alpha2: "PL",
    alpha3: "POL"
  },
  "Czech Republic": {
    emoji: "🇨🇿",
    alpha2: "CZ",
    alpha3: "CZE"
  },
  "Hungary": {
    emoji: "🇭🇺",
    alpha2: "HU",
    alpha3: "HUN"
  },
  "Slovakia": {
    emoji: "🇸🇰",
    alpha2: "SK",
    alpha3: "SVK"
  },
  "Romania": {
    emoji: "🇷🇴",
    alpha2: "RO",
    alpha3: "ROU"
  },
  "Bulgaria": {
    emoji: "🇧🇬",
    alpha2: "BG",
    alpha3: "BGR"
  },
  "Serbia": {
    emoji: "🇷🇸",
    alpha2: "RS",
    alpha3: "SRB"
  },
  "Croatia": {
    emoji: "🇭🇷",
    alpha2: "HR",
    alpha3: "HRV"
  },
  "Slovenia": {
    emoji: "🇸🇮",
    alpha2: "SI",
    alpha3: "SVN"
  },
  "Lithuania": {
    emoji: "🇱🇹",
    alpha2: "LT",
    alpha3: "LTU"
  },
  "Latvia": {
    emoji: "🇱🇻",
    alpha2: "LV",
    alpha3: "LVA"
  },
  "Estonia": {
    emoji: "🇪🇪",
    alpha2: "EE",
    alpha3: "EST"
  },
  "Moldova": {
    emoji: "🇲🇩",
    alpha2: "MD",
    alpha3: "MDA"
  },
  "Georgia": {
    emoji: "🇬🇪",
    alpha2: "GE",
    alpha3: "GEO"
  },
  "Armenia": {
    emoji: "🇦🇲",
    alpha2: "AM",
    alpha3: "ARM"
  },
  "Azerbaijan": {
    emoji: "🇦🇿",
    alpha2: "AZ",
    alpha3: "AZE"
  },
  "Jamaica": {
    emoji: "🇯🇲",
    alpha2: "JM",
    alpha3: "JAM"
  },
  "Dominican Republic": {
    emoji: "🇩🇴",
    alpha2: "DO",
    alpha3: "DOM"
  },
  "Haiti": {
    emoji: "🇭🇹",
    alpha2: "HT",
    alpha3: "HTI"
  },
  "Cuba": {
    emoji: "🇨🇺",
    alpha2: "CU",
    alpha3: "CUB"
  },
  "Barbados": {
    emoji: "🇧🇧",
    alpha2: "BB",
    alpha3: "BRB"
  },
  "Trinidad and Tobago": {
    emoji: "🇹🇹",
    alpha2: "TT",
    alpha3: "TTO"
  },
  "Bahamas": {
    emoji: "🇧🇸",
    alpha2: "BS",
    alpha3: "BHS"
  },
  "Saint Lucia": {
    emoji: "🇱🇨",
    alpha2: "LC",
    alpha3: "LCA"
  },
  "Saint Vincent and the Grenadines": {
    emoji: "🇻🇨",
    alpha2: "VC",
    alpha3: "VCT"
  },
  "Grenada": {
    emoji: "🇬🇩",
    alpha2: "GD",
    alpha3: "GRD"
  },
  "Antigua and Barbuda": {
    emoji: "🇦🇬",
    alpha2: "AG",
    alpha3: "ATG"
  },
  "Dominica": {
    emoji: "🇩🇲",
    alpha2: "DM",
    alpha3: "DMA"
  },
  "Belize": {
    emoji: "🇧🇿",
    alpha2: "BZ",
    alpha3: "BLZ"
  },
  "Guatemala": {
    emoji: "🇬🇹",
    alpha2: "GT",
    alpha3: "GTM"
  },
  "El Salvador": {
    emoji: "🇸🇻",
    alpha2: "SV",
    alpha3: "SLV"
  },
  "Nicaragua": {
    emoji: "🇳🇮",
    alpha2: "NI",
    alpha3: "NIC"
  },
  "Panama": {
    emoji: "🇵🇦",
    alpha2: "PA",
    alpha3: "PAN"
  },
  "Bolivia": {
    emoji: "🇧🇴",
    alpha2: "BO",
    alpha3: "BOL"
  },
  "Ecuador": {
    emoji: "🇪🇨",
    alpha2: "EC",
    alpha3: "ECU"
  },
  "Paraguay": {
    emoji: "🇵🇾",
    alpha2: "PY",
    alpha3: "PRY"
  },
  "Uruguay": {
    emoji: "🇺🇾",
    alpha2: "UY",
    alpha3: "URY"
  },
  "Venezuela": {
    emoji: "🇻🇪",
    alpha2: "VE",
    alpha3: "VEN"
  },
  "Guyana": {
    emoji: "🇬🇾",
    alpha2: "GY",
    alpha3: "GUY"
  },
  "Suriname": {
    emoji: "🇸🇷",
    alpha2: "SR",
    alpha3: "SUR"
  },
  "French Guiana": {
    emoji: "🇬🇫",
    alpha2: "GF",
    alpha3: "GUF"
  },
  "São Tomé and Príncipe": {
    emoji: "🇸🇹",
    alpha2: "ST",
    alpha3: "STP"
  },
  "Equatorial Guinea": {
    emoji: "🇬🇶",
    alpha2: "GQ",
    alpha3: "GNQ"
  },
  "Gabon": {
    emoji: "🇬🇦",
    alpha2: "GA",
    alpha3: "GAB"
  },
  "Cameroon": {
    emoji: "🇨🇲",
    alpha2: "CM",
    alpha3: "CMR"
  },
  "Central African Republic": {
    emoji: "🇨🇫",
    alpha2: "CF",
    alpha3: "CAF"
  },
  "Democratic Republic of the Congo": {
    emoji: "🇨🇩",
    alpha2: "CD",
    alpha3: "COD"
  },
  "Republic of the Congo": {
    emoji: "🇨🇬",
    alpha2: "CG",
    alpha3: "COG"
  },
  "Burundi": {
    emoji: "🇧🇮",
    alpha2: "BI",
    alpha3: "BDI"
  },
  "Rwanda": {
    emoji: "🇷🇼",
    alpha2: "RW",
    alpha3: "RWA"
  },
  "Uganda": {
    emoji: "🇺🇬",
    alpha2: "UG",
    alpha3: "UGA"
  },
  "Kenya": {
    emoji: "🇰🇪",
    alpha2: "KE",
    alpha3: "KEN"
  },
  "Tanzania": {
    emoji: "🇹🇿",
    alpha2: "TZ",
    alpha3: "TZA"
  },
  "Mozambique": {
    emoji: "🇲🇿",
    alpha2: "MZ",
    alpha3: "MOZ"
  },
  "Madagascar": {
    emoji: "🇲🇬",
    alpha2: "MG",
    alpha3: "MDG"
  },
  "Comoros": {
    emoji: "🇰🇲",
    alpha2: "KM",
    alpha3: "COM"
  },
  "Seychelles": {
    emoji: "🇸🇨",
    alpha2: "SC",
    alpha3: "SYC"
  },
  "Mauritius": {
    emoji: "🇲🇺",
    alpha2: "MU",
    alpha3: "MUS"
  },
  "Malawi": {
    emoji: "🇲🇼",
    alpha2: "MW",
    alpha3: "MWI"
  },
  "Zambia": {
    emoji: "🇿🇲",
    alpha2: "ZM",
    alpha3: "ZMB"
  },
  "Zimbabwe": {
    emoji: "🇿🇼",
    alpha2: "ZW",
    alpha3: "ZWE"
  },
  "Botswana": {
    emoji: "🇧🇼",
    alpha2: "BW",
    alpha3: "BWA"
  },
  "Namibia": {
    emoji: "🇳🇦",
    alpha2: "NA",
    alpha3: "NAM"
  },
  "Angola": {
    emoji: "🇦🇴",
    alpha2: "AO",
    alpha3: "AGO"
  },
  "Lesotho": {
    emoji: "🇱🇸",
    alpha2: "LS",
    alpha3: "LSO"
  },
  "Eswatini": {
    emoji: "🇸🇿",
    alpha2: "SZ",
    alpha3: "SWZ"
  },
  "Ethiopia": {
    emoji: "🇪🇹",
    alpha2: "ET",
    alpha3: "ETH"
  },
  "Eritrea": {
    emoji: "🇪🇷",
    alpha2: "ER",
    alpha3: "ERI"
  },
  "Djibouti": {
    emoji: "🇩🇯",
    alpha2: "DJ",
    alpha3: "DJI"
  },
  "Somalia": {
    emoji: "🇸🇴",
    alpha2: "SO",
    alpha3: "SOM"
  },
  "Sudan": {
    emoji: "🇸🇩",
    alpha2: "SD",
    alpha3: "SDN"
  },
  "South Sudan": {
    emoji: "🇸🇸",
    alpha2: "SS",
    alpha3: "SSD"
  },
  "Chad": {
    emoji: "🇹🇩",
    alpha2: "TD",
    alpha3: "TCD"
  },
  "Niger": {
    emoji: "🇳🇪",
    alpha2: "NE",
    alpha3: "NER"
  },
  "Mali": {
    emoji: "🇲🇱",
    alpha2: "ML",
    alpha3: "MLI"
  },
  "Burkina Faso": {
    emoji: "🇧🇫",
    alpha2: "BF",
    alpha3: "BFA"
  },
  "Senegal": {
    emoji: "🇸🇳",
    alpha2: "SN",
    alpha3: "SEN"
  },
  "Gambia": {
    emoji: "🇬🇲",
    alpha2: "GM",
    alpha3: "GMB"
  },
  "Guinea-Bissau": {
    emoji: "🇬🇼",
    alpha2: "GW",
    alpha3: "GNB"
  },
  "Guinea": {
    emoji: "🇬🇳",
    alpha2: "GN",
    alpha3: "GIN"
  },
  "Sierra Leone": {
    emoji: "🇸🇱",
    alpha2: "SL",
    alpha3: "SLE"
  },
  "Liberia": {
    emoji: "🇱🇷",
    alpha2: "LR",
    alpha3: "LBR"
  },
  "Cote d'Ivoire": {
    emoji: "🇨🇮",
    alpha2: "CI",
    alpha3: "CIV"
  },
  "Ghana": {
    emoji: "🇬🇭",
    alpha2: "GH",
    alpha3: "GHA"
  },
  "Togo": {
    emoji: "🇹🇬",
    alpha2: "TG",
    alpha3: "TGO"
  },
  "Benin": {
    emoji: "🇧🇯",
    alpha2: "BJ",
    alpha3: "BEN"
  },
  "Nigeria": {
    emoji: "🇳🇬",
    alpha2: "NG",
    alpha3: "NGA"
  },
  "Nepal": {
    emoji: "🇳🇵",
    alpha2: "NP",
    alpha3: "NPL"
  },
  "Bhutan": {
    emoji: "🇧🇹",
    alpha2: "BT",
    alpha3: "BTN"
  },
  "Sri Lanka": {
    emoji: "🇱🇰",
    alpha2: "LK",
    alpha3: "LKA"
  },
  "Maldives": {
    emoji: "🇲🇻",
    alpha2: "MV",
    alpha3: "MDV"
  },
  "Myanmar": {
    emoji: "🇲🇲",
    alpha2: "MM",
    alpha3: "MMR"
  },
  "Laos": {
    emoji: "🇱🇦",
    alpha2: "LA",
    alpha3: "LAO"
  },
  "Cambodia": {
    emoji: "🇰🇭",
    alpha2: "KH",
    alpha3: "KHM"
  },
  "Brunei": {
    emoji: "🇧🇳",
    alpha2: "BN",
    alpha3: "BRN"
  },
  "Timor-Leste": {
    emoji: "🇹🇱",
    alpha2: "TL",
    alpha3: "TLS"
  },
  "Papua New Guinea": {
    emoji: "🇵🇬",
    alpha2: "PG",
    alpha3: "PNG"
  },
  "Fiji": {
    emoji: "🇫🇯",
    alpha2: "FJ",
    alpha3: "FJI"
  },
  "Vanuatu": {
    emoji: "🇻🇺",
    alpha2: "VU",
    alpha3: "VUT"
  },
  "Solomon Islands": {
    emoji: "🇸🇧",
    alpha2: "SB",
    alpha3: "SLB"
  },
  "Samoa": {
    emoji: "🇼🇸",
    alpha2: "WS",
    alpha3: "WSM"
  },
  "Tonga": {
    emoji: "🇹🇴",
    alpha2: "TO",
    alpha3: "TON"
  },
  "Kiribati": {
    emoji: "🇰🇮",
    alpha2: "KI",
    alpha3: "KIR"
  },
  "Marshall Islands": {
    emoji: "🇲🇭",
    alpha2: "MH",
    alpha3: "MHL"
  },
  "Micronesia": {
    emoji: "🇫🇲",
    alpha2: "FM",
    alpha3: "FSM"
  },
  "Palau": {
    emoji: "🇵🇼",
    alpha2: "PW",
    alpha3: "PLW"
  },
  "Nauru": {
    emoji: "🇳🇷",
    alpha2: "NR",
    alpha3: "NRU"
  },
  "Tuvalu": {
    emoji: "🇹🇻",
    alpha2: "TV",
    alpha3: "TUV"
  }
};

//Turn country's code into country name
export const getCountryFromCode = (code: string): string | undefined => {
  const upperCode = code.toUpperCase();
  return Object.entries(countryData).find(
    ([_, data]) => data.alpha2 === upperCode || data.alpha3 === upperCode
  )?.[0];
};

export const getCountryEmoji = (country: string): string => {
  return countryData[country]?.emoji || ""; // Return empty string if country not found
};
export const getCountryAlpha2 = (country: string): string | undefined => { //undefined will trigger the existing "No results found" UI component in app/botany/page.tsx
  return countryData[country]?.alpha2;
};
export const getCountryAlpha3 = (country: string): string | undefined => {
  return countryData[country]?.alpha3;
};
