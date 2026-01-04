// Seal Distribution Data
// Compiled from IUCN Red List, NOAA Marine Mammal Database, and Arctic/Antarctic research databases
// Data represents approximate ranges and populations as of 2024-2025

const sealData = {
    // True Seals (Phocidae)
    trueSeals: [
        {
            id: "harbor_seal",
            commonName: "Harbor Seal",
            scientificName: "Phoca vitulina",
            family: "Phocidae",
            population: 500000,
            conservationStatus: "Least Concern",
            distribution: [
                { lat: 70, lon: -50, intensity: 8, region: "Greenland" },
                { lat: 65, lon: -25, intensity: 7, region: "Iceland" },
                { lat: 58, lon: -5, intensity: 9, region: "British Isles" },
                { lat: 55, lon: 10, intensity: 8, region: "North Sea" },
                { lat: 54, lon: 15, intensity: 7, region: "Baltic Sea" },
                { lat: 60, lon: -150, intensity: 9, region: "Alaska" },
                { lat: 50, lon: -125, intensity: 8, region: "British Columbia" },
                { lat: 42, lon: -70, intensity: 7, region: "New England" },
                { lat: 37, lon: -122, intensity: 8, region: "California" },
                { lat: 34, lon: -120, intensity: 7, region: "Southern California" },
                { lat: 40, lon: 140, intensity: 7, region: "Northern Japan" }
            ],
            characteristics: {
                length: "1.5-2.0m",
                weight: "80-150kg",
                lifespan: "25-30 years",
                diet: "Fish, squid, crustaceans"
            }
        },
        {
            id: "grey_seal",
            commonName: "Grey Seal",
            scientificName: "Halichoerus grypus",
            family: "Phocidae",
            population: 400000,
            conservationStatus: "Least Concern",
            distribution: [
                { lat: 70, lon: -20, intensity: 8, region: "Norway" },
                { lat: 64, lon: -22, intensity: 7, region: "Iceland" },
                { lat: 57, lon: -7, intensity: 9, region: "Scotland" },
                { lat: 53, lon: -5, intensity: 8, region: "Ireland" },
                { lat: 58, lon: 20, intensity: 8, region: "Baltic Sea" },
                { lat: 48, lon: -65, intensity: 8, region: "Gulf of St. Lawrence" },
                { lat: 45, lon: -62, intensity: 9, region: "Nova Scotia" },
                { lat: 42, lon: -70, intensity: 7, region: "Cape Cod" }
            ],
            characteristics: {
                length: "2.0-2.5m",
                weight: "150-300kg",
                lifespan: "25-35 years",
                diet: "Fish, octopus, crustaceans"
            }
        },
        {
            id: "harp_seal",
            commonName: "Harp Seal",
            scientificName: "Pagophilus groenlandicus",
            family: "Phocidae",
            population: 7500000,
            conservationStatus: "Least Concern",
            distribution: [
                { lat: 80, lon: -20, intensity: 9, region: "Svalbard" },
                { lat: 75, lon: 40, intensity: 9, region: "Barents Sea" },
                { lat: 72, lon: -40, intensity: 9, region: "Greenland" },
                { lat: 65, lon: -55, intensity: 8, region: "Labrador" },
                { lat: 50, lon: -60, intensity: 7, region: "Gulf of St. Lawrence" },
                { lat: 68, lon: 180, intensity: 8, region: "Bering Sea" }
            ],
            characteristics: {
                length: "1.7-1.9m",
                weight: "115-140kg",
                lifespan: "30-35 years",
                diet: "Fish, krill"
            }
        },
        {
            id: "ringed_seal",
            commonName: "Ringed Seal",
            scientificName: "Pusa hispida",
            family: "Phocidae",
            population: 2000000,
            conservationStatus: "Least Concern",
            distribution: [
                { lat: 85, lon: -120, intensity: 9, region: "Arctic Ocean" },
                { lat: 82, lon: 100, intensity: 9, region: "Siberian Arctic" },
                { lat: 78, lon: -90, intensity: 9, region: "Canadian Arctic" },
                { lat: 75, lon: -50, intensity: 8, region: "Greenland" },
                { lat: 70, lon: -170, intensity: 9, region: "Bering Sea" },
                { lat: 65, lon: 25, intensity: 8, region: "Baltic Sea" },
                { lat: 62, lon: 160, intensity: 8, region: "Sea of Okhotsk" }
            ],
            characteristics: {
                length: "1.2-1.5m",
                weight: "50-70kg",
                lifespan: "25-30 years",
                diet: "Small fish, crustaceans"
            }
        },
        {
            id: "bearded_seal",
            commonName: "Bearded Seal",
            scientificName: "Erignathus barbatus",
            family: "Phocidae",
            population: 500000,
            conservationStatus: "Least Concern",
            distribution: [
                { lat: 85, lon: -140, intensity: 8, region: "Arctic Ocean" },
                { lat: 78, lon: 60, intensity: 9, region: "Kara Sea" },
                { lat: 75, lon: -100, intensity: 8, region: "Canadian Arctic" },
                { lat: 72, lon: -165, intensity: 9, region: "Bering Strait" },
                { lat: 65, lon: 165, intensity: 8, region: "Sea of Okhotsk" }
            ],
            characteristics: {
                length: "2.1-2.4m",
                weight: "200-360kg",
                lifespan: "25-30 years",
                diet: "Bottom fish, invertebrates"
            }
        },
        {
            id: "hooded_seal",
            commonName: "Hooded Seal",
            scientificName: "Cystophora cristata",
            family: "Phocidae",
            population: 650000,
            conservationStatus: "Vulnerable",
            distribution: [
                { lat: 75, lon: -30, intensity: 9, region: "Greenland Sea" },
                { lat: 70, lon: -25, intensity: 8, region: "Iceland" },
                { lat: 65, lon: -55, intensity: 8, region: "Davis Strait" },
                { lat: 60, lon: -50, intensity: 7, region: "Newfoundland" },
                { lat: 78, lon: 10, intensity: 8, region: "Svalbard" }
            ],
            characteristics: {
                length: "2.0-2.6m",
                weight: "145-300kg",
                lifespan: "30-35 years",
                diet: "Deep-sea fish, squid"
            }
        },
        {
            id: "weddell_seal",
            commonName: "Weddell Seal",
            scientificName: "Leptonychotes weddellii",
            family: "Phocidae",
            population: 800000,
            conservationStatus: "Least Concern",
            distribution: [
                { lat: -77, lon: 166, intensity: 9, region: "Ross Sea" },
                { lat: -75, lon: -65, intensity: 9, region: "Antarctic Peninsula" },
                { lat: -70, lon: 0, intensity: 8, region: "Weddell Sea" },
                { lat: -68, lon: 80, intensity: 8, region: "East Antarctica" },
                { lat: -66, lon: -120, intensity: 7, region: "Amundsen Sea" },
                { lat: -72, lon: -15, intensity: 9, region: "Coats Land" }
            ],
            characteristics: {
                length: "2.5-3.0m",
                weight: "400-600kg",
                lifespan: "20-30 years",
                diet: "Fish, squid, crustaceans"
            }
        },
        {
            id: "leopard_seal",
            commonName: "Leopard Seal",
            scientificName: "Hydrurga leptonyx",
            family: "Phocidae",
            population: 35000,
            conservationStatus: "Least Concern",
            distribution: [
                { lat: -75, lon: -70, intensity: 8, region: "Antarctic Peninsula" },
                { lat: -70, lon: 10, intensity: 9, region: "Antarctic Coast" },
                { lat: -68, lon: 150, intensity: 8, region: "East Antarctica" },
                { lat: -65, lon: -50, intensity: 7, region: "South Georgia" },
                { lat: -55, lon: -67, intensity: 6, region: "Falkland Islands" },
                { lat: -47, lon: 166, intensity: 5, region: "New Zealand (rare)" }
            ],
            characteristics: {
                length: "2.8-3.6m",
                weight: "200-600kg",
                lifespan: "15-26 years",
                diet: "Penguins, seals, fish, krill"
            }
        },
        {
            id: "crabeater_seal",
            commonName: "Crabeater Seal",
            scientificName: "Lobodon carcinophaga",
            family: "Phocidae",
            population: 15000000,
            conservationStatus: "Least Concern",
            distribution: [
                { lat: -70, lon: -80, intensity: 9, region: "Bellingshausen Sea" },
                { lat: -68, lon: 0, intensity: 9, region: "Weddell Sea" },
                { lat: -66, lon: 90, intensity: 9, region: "East Antarctica" },
                { lat: -65, lon: 170, intensity: 9, region: "Ross Sea" },
                { lat: -62, lon: -120, intensity: 8, region: "Amundsen Sea" },
                { lat: -60, lon: -45, intensity: 7, region: "Scotia Sea" }
            ],
            characteristics: {
                length: "2.0-2.6m",
                weight: "200-300kg",
                lifespan: "20-25 years",
                diet: "Krill (not crabs!)"
            }
        },
        {
            id: "ross_seal",
            commonName: "Ross Seal",
            scientificName: "Ommatophoca rossii",
            family: "Phocidae",
            population: 130000,
            conservationStatus: "Least Concern",
            distribution: [
                { lat: -72, lon: -100, intensity: 7, region: "Deep Antarctic Pack Ice" },
                { lat: -70, lon: 20, intensity: 8, region: "Weddell Sea" },
                { lat: -68, lon: 120, intensity: 7, region: "East Antarctica" },
                { lat: -65, lon: -150, intensity: 6, region: "Ross Sea" }
            ],
            characteristics: {
                length: "1.7-2.1m",
                weight: "130-216kg",
                lifespan: "20-25 years",
                diet: "Squid, fish, krill"
            }
        },
        {
            id: "southern_elephant_seal",
            commonName: "Southern Elephant Seal",
            scientificName: "Mirounga leonina",
            family: "Phocidae",
            population: 650000,
            conservationStatus: "Least Concern",
            distribution: [
                { lat: -54, lon: -38, intensity: 9, region: "South Georgia" },
                { lat: -52, lon: -69, intensity: 8, region: "Falkland Islands" },
                { lat: -49, lon: 70, intensity: 9, region: "Kerguelen Islands" },
                { lat: -47, lon: 38, intensity: 8, region: "Prince Edward Islands" },
                { lat: -46, lon: 51, intensity: 8, region: "Crozet Islands" },
                { lat: -64, lon: -58, intensity: 7, region: "Antarctic Peninsula" },
                { lat: -43, lon: 147, intensity: 7, region: "Macquarie Island" }
            ],
            characteristics: {
                length: "3.0-5.0m",
                weight: "400-4000kg",
                lifespan: "20-22 years",
                diet: "Squid, fish"
            }
        },
        {
            id: "northern_elephant_seal",
            commonName: "Northern Elephant Seal",
            scientificName: "Mirounga angustirostris",
            family: "Phocidae",
            population: 210000,
            conservationStatus: "Least Concern",
            distribution: [
                { lat: 37, lon: -122, intensity: 9, region: "Año Nuevo, CA" },
                { lat: 36, lon: -122, intensity: 9, region: "Piedras Blancas, CA" },
                { lat: 34, lon: -120, intensity: 8, region: "San Miguel Island" },
                { lat: 33, lon: -119, intensity: 8, region: "Channel Islands" },
                { lat: 29, lon: -115, intensity: 9, region: "Guadalupe Island, Mexico" },
                { lat: 28, lon: -114, intensity: 7, region: "Baja California" }
            ],
            characteristics: {
                length: "3.0-5.0m",
                weight: "400-2700kg",
                lifespan: "20-22 years",
                diet: "Squid, fish, sharks"
            }
        },
        {
            id: "mediterranean_monk_seal",
            commonName: "Mediterranean Monk Seal",
            scientificName: "Monachus monachus",
            family: "Phocidae",
            population: 700,
            conservationStatus: "Endangered",
            distribution: [
                { lat: 39, lon: 25, intensity: 7, region: "Greece" },
                { lat: 36, lon: 28, intensity: 6, region: "Turkey" },
                { lat: 35, lon: 14, intensity: 5, region: "Malta (rare)" },
                { lat: 34, lon: -6, intensity: 6, region: "Morocco" },
                { lat: 33, lon: 35, intensity: 5, region: "Cyprus" },
                { lat: 29, lon: -13, intensity: 7, region: "Madeira" }
            ],
            characteristics: {
                length: "2.0-2.4m",
                weight: "240-400kg",
                lifespan: "20-30 years",
                diet: "Fish, octopus, eels"
            }
        },
        {
            id: "hawaiian_monk_seal",
            commonName: "Hawaiian Monk Seal",
            scientificName: "Neomonachus schauinslandi",
            family: "Phocidae",
            population: 1400,
            conservationStatus: "Endangered",
            distribution: [
                { lat: 28, lon: -178, intensity: 8, region: "French Frigate Shoals" },
                { lat: 26, lon: -174, intensity: 7, region: "Laysan Island" },
                { lat: 25, lon: -168, intensity: 8, region: "Lisianski Island" },
                { lat: 23, lon: -164, intensity: 7, region: "Pearl and Hermes Atoll" },
                { lat: 22, lon: -160, intensity: 6, region: "Kauai" },
                { lat: 20, lon: -157, intensity: 6, region: "Oahu" },
                { lat: 21, lon: -158, intensity: 7, region: "Niihau" }
            ],
            characteristics: {
                length: "2.0-2.4m",
                weight: "170-270kg",
                lifespan: "25-30 years",
                diet: "Fish, octopus, lobster"
            }
        },
        {
            id: "caspian_seal",
            commonName: "Caspian Seal",
            scientificName: "Pusa caspica",
            family: "Phocidae",
            population: 68000,
            conservationStatus: "Endangered",
            distribution: [
                { lat: 45, lon: 50, intensity: 8, region: "Northern Caspian Sea" },
                { lat: 42, lon: 51, intensity: 7, region: "Mid Caspian Sea" },
                { lat: 39, lon: 50, intensity: 7, region: "Southern Caspian Sea" }
            ],
            characteristics: {
                length: "1.2-1.5m",
                weight: "50-86kg",
                lifespan: "35-50 years",
                diet: "Fish, crustaceans"
            }
        },
        {
            id: "baikal_seal",
            commonName: "Baikal Seal (Nerpa)",
            scientificName: "Pusa sibirica",
            family: "Phocidae",
            population: 80000,
            conservationStatus: "Least Concern",
            distribution: [
                { lat: 53, lon: 108, intensity: 9, region: "Lake Baikal, Russia" }
            ],
            characteristics: {
                length: "1.2-1.4m",
                weight: "50-90kg",
                lifespan: "50-56 years",
                diet: "Fish (golomyanka, sculpin)"
            }
        }
    ],

    // Eared Seals (Otariidae) - Sea Lions and Fur Seals
    earedSeals: [
        {
            id: "california_sea_lion",
            commonName: "California Sea Lion",
            scientificName: "Zalophus californianus",
            family: "Otariidae",
            population: 300000,
            conservationStatus: "Least Concern",
            distribution: [
                { lat: 50, lon: -128, intensity: 7, region: "Vancouver Island" },
                { lat: 45, lon: -124, intensity: 8, region: "Oregon Coast" },
                { lat: 37, lon: -122, intensity: 9, region: "San Francisco Bay" },
                { lat: 34, lon: -120, intensity: 9, region: "Channel Islands" },
                { lat: 32, lon: -117, intensity: 8, region: "San Diego" },
                { lat: 28, lon: -115, intensity: 9, region: "Baja California" },
                { lat: 24, lon: -110, intensity: 8, region: "Gulf of California" }
            ],
            characteristics: {
                length: "2.0-2.5m",
                weight: "100-390kg",
                lifespan: "20-30 years",
                diet: "Fish, squid, octopus"
            }
        },
        {
            id: "steller_sea_lion",
            commonName: "Steller Sea Lion",
            scientificName: "Eumetopias jubatus",
            family: "Otariidae",
            population: 140000,
            conservationStatus: "Near Threatened",
            distribution: [
                { lat: 58, lon: 165, intensity: 8, region: "Kamchatka" },
                { lat: 55, lon: -160, intensity: 9, region: "Aleutian Islands" },
                { lat: 60, lon: -145, intensity: 9, region: "Gulf of Alaska" },
                { lat: 55, lon: -130, intensity: 8, region: "Southeast Alaska" },
                { lat: 48, lon: -125, intensity: 8, region: "British Columbia" },
                { lat: 43, lon: -124, intensity: 7, region: "Oregon" },
                { lat: 38, lon: -123, intensity: 7, region: "Northern California" },
                { lat: 42, lon: 142, intensity: 7, region: "Hokkaido, Japan" }
            ],
            characteristics: {
                length: "2.3-3.3m",
                weight: "240-1120kg",
                lifespan: "20-30 years",
                diet: "Fish, octopus, squid"
            }
        },
        {
            id: "australian_sea_lion",
            commonName: "Australian Sea Lion",
            scientificName: "Neophoca cinerea",
            family: "Otariidae",
            population: 12000,
            conservationStatus: "Endangered",
            distribution: [
                { lat: -32, lon: 115, intensity: 8, region: "Perth, Western Australia" },
                { lat: -34, lon: 122, intensity: 9, region: "Recherche Archipelago" },
                { lat: -35, lon: 136, intensity: 9, region: "South Australia" },
                { lat: -36, lon: 140, intensity: 8, region: "Victoria" }
            ],
            characteristics: {
                length: "1.8-2.5m",
                weight: "100-300kg",
                lifespan: "12-25 years",
                diet: "Fish, squid, octopus"
            }
        },
        {
            id: "south_american_sea_lion",
            commonName: "South American Sea Lion",
            scientificName: "Otaria flavescens",
            family: "Otariidae",
            population: 265000,
            conservationStatus: "Least Concern",
            distribution: [
                { lat: -12, lon: -77, intensity: 7, region: "Peru" },
                { lat: -23, lon: -70, intensity: 8, region: "Chile" },
                { lat: -38, lon: -57, intensity: 9, region: "Argentina" },
                { lat: -51, lon: -69, intensity: 9, region: "Falkland Islands" },
                { lat: -54, lon: -67, intensity: 8, region: "Tierra del Fuego" },
                { lat: -35, lon: -56, intensity: 8, region: "Uruguay" },
                { lat: -23, lon: -43, intensity: 7, region: "Brazil" }
            ],
            characteristics: {
                length: "2.0-2.7m",
                weight: "120-350kg",
                lifespan: "18-24 years",
                diet: "Fish, squid, crustaceans"
            }
        },
        {
            id: "new_zealand_sea_lion",
            commonName: "New Zealand Sea Lion",
            scientificName: "Phocarctos hookeri",
            family: "Otariidae",
            population: 10000,
            conservationStatus: "Endangered",
            distribution: [
                { lat: -50, lon: 166, intensity: 9, region: "Auckland Islands" },
                { lat: -48, lon: 166, intensity: 8, region: "Campbell Island" },
                { lat: -46, lon: 168, intensity: 7, region: "Otago Peninsula" },
                { lat: -44, lon: 171, intensity: 7, region: "Banks Peninsula" }
            ],
            characteristics: {
                length: "2.0-3.3m",
                weight: "90-450kg",
                lifespan: "18-25 years",
                diet: "Fish, squid, octopus"
            }
        },
        {
            id: "northern_fur_seal",
            commonName: "Northern Fur Seal",
            scientificName: "Callorhinus ursinus",
            family: "Otariidae",
            population: 1100000,
            conservationStatus: "Vulnerable",
            distribution: [
                { lat: 57, lon: -170, intensity: 9, region: "Pribilof Islands" },
                { lat: 52, lon: 160, intensity: 9, region: "Commander Islands" },
                { lat: 54, lon: -165, intensity: 8, region: "Bogoslof Island" },
                { lat: 52, lon: 174, intensity: 7, region: "Kuril Islands" },
                { lat: 44, lon: 146, intensity: 7, region: "Hokkaido, Japan" },
                { lat: 37, lon: -123, intensity: 6, region: "Farallon Islands, CA" }
            ],
            characteristics: {
                length: "1.4-2.1m",
                weight: "50-270kg",
                lifespan: "15-25 years",
                diet: "Fish, squid"
            }
        },
        {
            id: "antarctic_fur_seal",
            commonName: "Antarctic Fur Seal",
            scientificName: "Arctocephalus gazella",
            family: "Otariidae",
            population: 2000000,
            conservationStatus: "Least Concern",
            distribution: [
                { lat: -54, lon: -38, intensity: 9, region: "South Georgia" },
                { lat: -60, lon: -46, intensity: 8, region: "South Orkney Islands" },
                { lat: -62, lon: -58, intensity: 8, region: "South Shetland Islands" },
                { lat: -49, lon: 70, intensity: 7, region: "Kerguelen Islands" },
                { lat: -47, lon: 38, intensity: 7, region: "Prince Edward Islands" },
                { lat: -46, lon: 51, intensity: 7, region: "Crozet Islands" }
            ],
            characteristics: {
                length: "1.5-2.0m",
                weight: "40-200kg",
                lifespan: "15-23 years",
                diet: "Krill, fish, squid"
            }
        },
        {
            id: "galapagos_fur_seal",
            commonName: "Galápagos Fur Seal",
            scientificName: "Arctocephalus galapagoensis",
            family: "Otariidae",
            population: 10000,
            conservationStatus: "Endangered",
            distribution: [
                { lat: -0.5, lon: -91, intensity: 9, region: "Galápagos Islands" }
            ],
            characteristics: {
                length: "1.2-1.5m",
                weight: "30-65kg",
                lifespan: "15-20 years",
                diet: "Fish, squid"
            }
        },
        {
            id: "guadalupe_fur_seal",
            commonName: "Guadalupe Fur Seal",
            scientificName: "Arctocephalus townsendi",
            family: "Otariidae",
            population: 20000,
            conservationStatus: "Least Concern",
            distribution: [
                { lat: 29, lon: -118, intensity: 9, region: "Guadalupe Island, Mexico" },
                { lat: 28, lon: -115, intensity: 7, region: "San Benito Islands" },
                { lat: 34, lon: -120, intensity: 6, region: "Channel Islands, CA" }
            ],
            characteristics: {
                length: "1.5-1.8m",
                weight: "50-100kg",
                lifespan: "20+ years",
                diet: "Fish, squid"
            }
        },
        {
            id: "south_african_fur_seal",
            commonName: "South African (Cape) Fur Seal",
            scientificName: "Arctocephalus pusillus",
            family: "Otariidae",
            population: 2000000,
            conservationStatus: "Least Concern",
            distribution: [
                { lat: -22, lon: 14, intensity: 9, region: "Namibia" },
                { lat: -29, lon: 17, intensity: 9, region: "Western Cape" },
                { lat: -34, lon: 23, intensity: 8, region: "Eastern Cape" },
                { lat: -38, lon: 144, intensity: 8, region: "Southern Australia" }
            ],
            characteristics: {
                length: "1.8-2.3m",
                weight: "120-360kg",
                lifespan: "18-25 years",
                diet: "Fish, squid, birds"
            }
        }
    ],

    // Walrus (Odobenidae)
    walrus: [
        {
            id: "atlantic_walrus",
            commonName: "Atlantic Walrus",
            scientificName: "Odobenus rosmarus rosmarus",
            family: "Odobenidae",
            population: 25000,
            conservationStatus: "Vulnerable",
            distribution: [
                { lat: 80, lon: -20, intensity: 9, region: "Svalbard" },
                { lat: 78, lon: 20, intensity: 8, region: "Franz Josef Land" },
                { lat: 75, lon: -60, intensity: 9, region: "Greenland" },
                { lat: 70, lon: -55, intensity: 8, region: "Baffin Island" },
                { lat: 66, lon: -63, intensity: 7, region: "Hudson Bay" },
                { lat: 78, lon: 100, intensity: 7, region: "Laptev Sea" }
            ],
            characteristics: {
                length: "2.2-3.6m",
                weight: "400-1700kg",
                lifespan: "30-40 years",
                diet: "Clams, mussels, shrimp"
            }
        },
        {
            id: "pacific_walrus",
            commonName: "Pacific Walrus",
            scientificName: "Odobenus rosmarus divergens",
            family: "Odobenidae",
            population: 200000,
            conservationStatus: "Vulnerable",
            distribution: [
                { lat: 70, lon: -165, intensity: 9, region: "Chukchi Sea" },
                { lat: 65, lon: -170, intensity: 9, region: "Bering Sea" },
                { lat: 60, lon: -165, intensity: 8, region: "Bristol Bay" },
                { lat: 73, lon: 140, intensity: 8, region: "East Siberian Sea" }
            ],
            characteristics: {
                length: "2.7-3.6m",
                weight: "600-1700kg",
                lifespan: "30-40 years",
                diet: "Clams, mussels, worms"
            }
        }
    ]
};

// Conservation status colors
const conservationColors = {
    "Least Concern": "#28a745",
    "Near Threatened": "#ffc107",
    "Vulnerable": "#fd7e14",
    "Endangered": "#dc3545",
    "Critically Endangered": "#721c24"
};

// Climate zones for seal habitats
const climateZones = {
    arctic: { color: "#00bfff", label: "Arctic (>66.5°N)" },
    subarctic: { color: "#4169e1", label: "Subarctic (45-66.5°N)" },
    temperate: { color: "#32cd32", label: "Temperate (23-45°)" },
    subtropical: { color: "#ffa500", label: "Subtropical (0-23°)" },
    antarctic: { color: "#87ceeb", label: "Antarctic (<-66.5°S)" },
    subantarctic: { color: "#6495ed", label: "Subantarctic (-45 to -66.5°S)" }
};

// Export data
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { sealData, conservationColors, climateZones };
}

