export const allCategorias = ["Hombre", "Infantil", "Juvenil", "Mujer"]
export const tiposByCategoria: Record<string, string[]> = {
  "Hombre": [
    "Accesorios",
    "Calzado",
    "Camisas",
    "Chumpas",
    "Pantalones",
    "Playeras",
    "Polos",
    "Ropa Interior",
    "Suéteres"
  ],
  "Infantil": [
    "Chumpas / Suéteres / Sudaderas",
    "Pantalones",
    "Polos / Camisas / Playeras"
  ],
  "Juvenil": [
    "Chumpas / Suéteres / Sudaderas",
    "Pantalones",
    "Polos / Camisas / Playeras"
  ],
  "Mujer": [
    "Blusas",
    "Chumpas / Suéteres / Sudaderas",
    "Pantalones",
    "Polos"
  ]
}
export const subtiposByTipo: Record<string, string[]> = {
  "Accesorios": [
    "Billeteras",
    "Cinturones",
    "Gorras"
  ],
  "Camisas": [
    "Manga corta",
    "Manga larga"
  ],
  "Pantalones": [
    "Cargo",
    "De vestir",
    "Jeans",
    "Tela",
    "Tela / Gabardina"
  ],
  "Ropa Interior": [
    "Bóxer",
    "Calcetines"
  ]
}
export const marcasByCategoria: Record<string, string[]> = {
  "Hombre": [
    "Beverly Hills Polo Club",
    "Carven",
    "Denizen",
    "Dougger",
    "Dutton",
    "Estivaneli",
    "Hummer Jeans",
    "Johnny Cotton",
    "Jordache",
    "Kenneth Cole",
    "Levi's",
    "Lupo",
    "Manhattan",
    "Nautica Jeans",
    "Original Penguin",
    "Oscar de la Renta",
    "Otras",
    "Pepe",
    "Perrry Ellis",
    "Pierre Cardin",
    "Polo Club Long Beach",
    "Ted Lapidus",
    "Totto",
    "U.S Polo Assn",
    "Van Heusen"
  ],
  "Infantil": [
    "Beverly Hills Polo Club",
    "Cataño Kids",
    "Hummer Jeans",
    "Jordache",
    "Otras",
    "Pepe",
    "U.S Polo Assn"
  ],
  "Juvenil": [
    "Cataño Kids",
    "Hummer Jeans",
    "Jordache",
    "Levi's",
    "Otras",
    "Pepe",
    "RedSand",
    "U.S Polo Assn"
  ],
  "Mujer": [
    "Otras",
    "Pierre Cardin",
    "Totto"
  ]
}
export const coloresAll: string[] = ["Amarillo", "Azul / Celeste", "Beige / Khaki", "Blanco", "Café", "Morado", "Multicolor / Estampado", "Naranja", "Negro / Gris", "Rojo / Corinto", "Rosa", "Verde"]
export const tallasByContext: Record<string, string[]> = {
  "Hombre|Accesorios": [
    "30",
    "31",
    "32",
    "33",
    "34",
    "36",
    "40",
    "42"
  ],
  "Hombre|Chumpas": [
    "L",
    "M",
    "S",
    "XL"
  ],
  "Hombre|Suéteres": [
    "L",
    "M",
    "S",
    "XL"
  ],
  "Hombre|Polos": [
    "L",
    "M",
    "S",
    "XL",
    "XS"
  ],
  "Hombre|Camisas": [
    "L",
    "M",
    "S",
    "XL",
    "XS"
  ],
  "Hombre|Playeras": [
    "L",
    "M",
    "S",
    "XL",
    "XS"
  ],
  "Hombre|Pantalones": [
    "27",
    "28",
    "29",
    "30",
    "31",
    "32",
    "33",
    "34",
    "36",
    "38"
  ],
  "Hombre|Ropa Interior": [
    "L",
    "M",
    "S",
    "XL"
  ],
  "Mujer|Polos": [
    "L",
    "M",
    "S"
  ],
  "Mujer|Pantalones": [
    "3",
    "4",
    "5",
    "6",
    "8",
    "14",
    "1/2",
    "3/4",
    "5/6",
    "7/8",
    "9/10",
    "M",
    "S"
  ],
  "Mujer|Blusas": [
    "L",
    "M",
    "S"
  ],
  "Mujer|Chumpas / Suéteres / Sudaderas": [
    "L",
    "M",
    "S"
  ],
  "Juvenil|Pantalones": [
    "8",
    "10",
    "12",
    "14",
    "16",
    "18"
  ],
  "Juvenil|Polos / Camisas / Playeras": [
    "8",
    "10",
    "12",
    "14",
    "16",
    "18",
    "L",
    "M",
    "S",
    "XL"
  ],
  "Juvenil|Chumpas / Suéteres / Sudaderas": [
    "8",
    "10",
    "12",
    "14",
    "16",
    "18",
    "L",
    "M",
    "XL"
  ],
  "Infantil|Pantalones": [
    "3",
    "4",
    "5",
    "6",
    "8"
  ],
  "Infantil|Polos / Camisas / Playeras": [
    "2",
    "3",
    "4",
    "5",
    "6",
    "8"
  ],
  "Infantil|Chumpas / Suéteres / Sudaderas": [
    "4",
    "6",
    "8"
  ],
  "Hombre|Calzado": [
    "7",
    "7.5",
    "8",
    "8.5",
    "9",
    "9.5",
    "10",
    "37",
    "38",
    "40"
  ]
}
export const colorSynonyms: Record<string, string> = {
  'blanco': 'Blanco', 'hueso': 'Blanco', 'marfil': 'Blanco', 'crema': 'Blanco',
  'negro': 'Negro / Gris', 'gris': 'Negro / Gris', 'plomo': 'Negro / Gris', 'carbón': 'Negro / Gris', 'pizarra': 'Negro / Gris', 'plateado': 'Negro / Gris',
  'azul': 'Azul / Celeste', 'celeste': 'Azul / Celeste', 'turquesa': 'Azul / Celeste', 'marino': 'Azul / Celeste', 'navy': 'Azul / Celeste', 'índigo': 'Azul / Celeste', 'denim': 'Azul / Celeste', 'mezclilla': 'Azul / Celeste',
  'rojo': 'Rojo / Corinto', 'corinto': 'Rojo / Corinto', 'vino': 'Rojo / Corinto', 'granate': 'Rojo / Corinto', 'borgoña': 'Rojo / Corinto', 'carmesí': 'Rojo / Corinto',
  'amarillo': 'Amarillo', 'mostaza': 'Amarillo', 'oro': 'Amarillo', 'dorado': 'Amarillo',
  'verde': 'Verde', 'olivo': 'Verde', 'militar': 'Verde', 'menta': 'Verde', 'esmeralda': 'Verde',
  'naranja': 'Naranja', 'coral': 'Naranja', 'terracota': 'Naranja',
  'morado': 'Morado', 'lila': 'Morado', 'violeta': 'Morado', 'púrpura': 'Morado',
  'café': 'Café', 'marrón': 'Café', 'chocolate': 'Café', 'camel': 'Café', 'tabaco': 'Café',
  'beige': 'Beige / Khaki', 'khaki': 'Beige / Khaki', 'arena': 'Beige / Khaki', 'taupe': 'Beige / Khaki',
  'rosa': 'Rosa', 'rosado': 'Rosa', 'fucsia': 'Rosa', 'magenta': 'Rosa', 'salmón': 'Rosa',
  'estampado': 'Multicolor / Estampado', 'multicolor': 'Multicolor / Estampado', 'cuadros': 'Multicolor / Estampado', 'rayas': 'Multicolor / Estampado', 'floral': 'Multicolor / Estampado'
}
