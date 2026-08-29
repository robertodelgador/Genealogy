import type { FamilyTreeData } from '../types';

export const seedData: FamilyTreeData = {
  rootId: 'roberto-delgado-ruegg',
  people: {
  "diego-urruela": {
    "id": "diego-urruela",
    "firstName": "Diego",
    "lastName": "de Urruela",
    "gender": "male",
    "birthDate": "1600-01-01",
    "birthPlace": "Sojo, Valle de Ayala, Álava, España",
    "notes": "I Señor del solar primitivo de Urruela en la noble tierra de Ayala.",
    "parentIds": [],
    "spouseIds": [
      "felipa-vina"
    ],
    "childIds": [
      "francisco-urruela-vina"
    ]
  },
  "felipa-vina": {
    "id": "felipa-vina",
    "firstName": "Felipa",
    "lastName": "de la Viña",
    "gender": "female",
    "birthPlace": "Álava, España",
    "parentIds": [],
    "spouseIds": [
      "diego-urruela"
    ],
    "childIds": [
      "francisco-urruela-vina"
    ]
  },
  "francisco-urruela-vina": {
    "id": "francisco-urruela-vina",
    "firstName": "Francisco",
    "lastName": "de Urruela y Viña",
    "gender": "male",
    "birthPlace": "Sojo, Ayala, Álava, España",
    "notes": "II Generación. Regidor del Concejo de Retes de Tudela en 1658.",
    "parentIds": [
      "diego-urruela",
      "felipa-vina"
    ],
    "spouseIds": [
      "catalina-hoyos"
    ],
    "childIds": [
      "jose-urruela-hoyos"
    ]
  },
  "catalina-hoyos": {
    "id": "catalina-hoyos",
    "firstName": "Catalina",
    "lastName": "de Hoyos",
    "gender": "female",
    "birthPlace": "Retes de Tudela, Álava, España",
    "parentIds": [],
    "spouseIds": [
      "francisco-urruela-vina"
    ],
    "childIds": [
      "jose-urruela-hoyos"
    ]
  },
  "jose-urruela-hoyos": {
    "id": "jose-urruela-hoyos",
    "firstName": "José",
    "lastName": "de Urruela y Hoyos",
    "gender": "male",
    "birthPlace": "Retes de Tudela, España",
    "notes": "III Generación. Bautizado en la parroquia de Santa María Magdalena.",
    "parentIds": [
      "francisco-urruela-vina",
      "catalina-hoyos"
    ],
    "spouseIds": [
      "maria-menoyo"
    ],
    "childIds": [
      "juan-urruela-menoyo"
    ]
  },
  "maria-menoyo": {
    "id": "maria-menoyo",
    "firstName": "María",
    "lastName": "de Menoyo",
    "gender": "female",
    "birthPlace": "Álava, España",
    "parentIds": [],
    "spouseIds": [
      "jose-urruela-hoyos"
    ],
    "childIds": [
      "juan-urruela-menoyo"
    ]
  },
  "juan-urruela-menoyo": {
    "id": "juan-urruela-menoyo",
    "firstName": "Juan",
    "lastName": "de Urruela y Menoyo",
    "gender": "male",
    "birthPlace": "Retes de Tudela, España",
    "notes": "IV Generación. Mayordomo del Santo Rosario de Retes.",
    "parentIds": [
      "jose-urruela-hoyos",
      "maria-menoyo"
    ],
    "spouseIds": [
      "maria-barcena"
    ],
    "childIds": [
      "jose-urruela-barcena"
    ]
  },
  "maria-barcena": {
    "id": "maria-barcena",
    "firstName": "María",
    "lastName": "de Bárcena",
    "gender": "female",
    "birthPlace": "Montañas de Burgos, España",
    "parentIds": [],
    "spouseIds": [
      "juan-urruela-menoyo"
    ],
    "childIds": [
      "jose-urruela-barcena"
    ]
  },
  "jose-urruela-barcena": {
    "id": "jose-urruela-barcena",
    "firstName": "José",
    "lastName": "de Urruela y Bárcena",
    "gender": "male",
    "birthDate": "1699-03-19",
    "birthPlace": "Retes de Tudela, Álava, España",
    "notes": "V Generación. Mayordomo de la iglesia parroquial de Retes de Tudela.",
    "parentIds": [
      "juan-urruela-menoyo",
      "maria-barcena"
    ],
    "spouseIds": [
      "maria-santos-angulo"
    ],
    "childIds": [
      "jose-damian-urruela",
      "gregorio-ignacio-urruela",
      "tomas-maria-urruela",
      "juan-antonio-urruela",
      "ana-maria-urruela"
    ]
  },
  "maria-santos-angulo": {
    "id": "maria-santos-angulo",
    "firstName": "María Santos",
    "lastName": "de Angulo y Valle",
    "gender": "female",
    "birthDate": "1705-11-01",
    "birthPlace": "Retes de Tudela, España",
    "parentIds": [],
    "spouseIds": [
      "jose-urruela-barcena"
    ],
    "childIds": [
      "jose-damian-urruela",
      "gregorio-ignacio-urruela",
      "tomas-maria-urruela",
      "juan-antonio-urruela",
      "ana-maria-urruela"
    ]
  },
  "tomas-maria-urruela": {
    "id": "tomas-maria-urruela",
    "firstName": "Tomás María",
    "lastName": "de Urruela y Angulo",
    "gender": "male",
    "birthPlace": "Retes de Tudela, España",
    "parentIds": [
      "jose-urruela-barcena",
      "maria-santos-angulo"
    ],
    "spouseIds": [],
    "childIds": []
  },
  "juan-antonio-urruela": {
    "id": "juan-antonio-urruela",
    "firstName": "Juan Antonio",
    "lastName": "de Urruela y Angulo",
    "gender": "male",
    "birthPlace": "Retes de Tudela, España",
    "parentIds": [
      "jose-urruela-barcena",
      "maria-santos-angulo"
    ],
    "spouseIds": [],
    "childIds": []
  },
  "ana-maria-urruela": {
    "id": "ana-maria-urruela",
    "firstName": "Ana María",
    "lastName": "de Urruela y Angulo",
    "gender": "female",
    "birthPlace": "Retes de Tudela, España",
    "parentIds": [
      "jose-urruela-barcena",
      "maria-santos-angulo"
    ],
    "spouseIds": [],
    "childIds": []
  },
  "gregorio-ignacio-urruela": {
    "id": "gregorio-ignacio-urruela",
    "firstName": "Gregorio Ignacio",
    "lastName": "de Urruela y Angulo",
    "gender": "male",
    "birthDate": "1742-03-12",
    "birthPlace": "Retes de Tudela, España",
    "notes": "Hermano de don José Damián. Fundador de la Rama Segunda en Guatemala.",
    "parentIds": [
      "jose-urruela-barcena",
      "maria-santos-angulo"
    ],
    "spouseIds": [],
    "childIds": []
  },
  "jose-damian-urruela": {
    "id": "jose-damian-urruela",
    "firstName": "José Damián",
    "lastName": "de Urruela y Angulo",
    "gender": "male",
    "birthDate": "1739-09-27",
    "birthPlace": "Retes de Tudela, Álava, España",
    "deathDate": "1802-05-14",
    "deathPlace": "Nueva Guatemala de la Asunción",
    "notes": "VI Generación. Litigó hidalguía en la Real Chancillería de Valladolid (1792) y fundó la rama principal en Guatemala.",
    "parentIds": [
      "jose-urruela-barcena",
      "maria-santos-angulo"
    ],
    "spouseIds": [
      "manuela-valle"
    ],
    "childIds": [
      "jose-eleuterio-urruela",
      "catalina-maria-urruela",
      "juan-francisco-urruela"
    ]
  },
  "manuela-valle": {
    "id": "manuela-valle",
    "firstName": "Manuela Norberta",
    "lastName": "de Valle y Luengas",
    "gender": "female",
    "birthDate": "1748-06-06",
    "birthPlace": "Retes de Tudela, España",
    "notes": "Hija de don Prudencio de Valle y doña Margarita Luengas.",
    "parentIds": [],
    "spouseIds": [
      "jose-damian-urruela"
    ],
    "childIds": [
      "jose-eleuterio-urruela",
      "catalina-maria-urruela",
      "juan-francisco-urruela"
    ]
  },
  "jose-eleuterio-urruela": {
    "id": "jose-eleuterio-urruela",
    "firstName": "José Eleuterio",
    "lastName": "de Urruela y Valle",
    "gender": "male",
    "birthDate": "1772-02-20",
    "birthPlace": "Retes de Tudela, España",
    "parentIds": [
      "jose-damian-urruela",
      "manuela-valle"
    ],
    "spouseIds": [],
    "childIds": []
  },
  "catalina-maria-urruela": {
    "id": "catalina-maria-urruela",
    "firstName": "Catalina María",
    "lastName": "de Urruela y Valle",
    "gender": "female",
    "birthPlace": "Retes de Tudela / Guatemala",
    "notes": "Rama Tercera: familias Angulo y Urruela, Zirión y Urruela.",
    "parentIds": [
      "jose-damian-urruela",
      "manuela-valle"
    ],
    "spouseIds": [],
    "childIds": []
  },
  "juan-francisco-urruela": {
    "id": "juan-francisco-urruela",
    "firstName": "Juan Francisco",
    "lastName": "de Urruela y Urruela",
    "gender": "male",
    "birthDate": "1774-08-15",
    "birthPlace": "Guatemala",
    "notes": "VII Generación. Comandante y regidor en el Reino de Guatemala.",
    "parentIds": [
      "jose-damian-urruela",
      "manuela-valle"
    ],
    "spouseIds": [
      "maria-carmen-palomo"
    ],
    "childIds": [
      "maria-soledad-urruela"
    ]
  },
  "maria-carmen-palomo": {
    "id": "maria-carmen-palomo",
    "firstName": "María del Carmen",
    "lastName": "Palomo de Ribera y Valdés",
    "gender": "female",
    "birthDate": "1780-07-16",
    "birthPlace": "Antigua Guatemala",
    "parentIds": [],
    "spouseIds": [
      "juan-francisco-urruela"
    ],
    "childIds": [
      "maria-soledad-urruela"
    ]
  },
  "maria-soledad-urruela": {
    "id": "maria-soledad-urruela",
    "firstName": "María Soledad Mariana de Jesús Josefa",
    "lastName": "de Urruela y Palomo de Ribera",
    "gender": "female",
    "birthDate": "1838-04-17",
    "birthPlace": "Antigua Guatemala",
    "deathDate": "1883-09-30",
    "deathPlace": "Ciudad de Guatemala",
    "notes": "VIII Generación. Sus restos descansan en el mausoleo de la familia Delgado Echeverría en el Cementerio General.",
    "parentIds": [
      "juan-francisco-urruela",
      "maria-carmen-palomo"
    ],
    "spouseIds": [
      "juan-emeterio-echeverria"
    ],
    "childIds": [
      "emeterio-echeverria-urruela",
      "carmen-echeverria-urruela"
    ]
  },
  "juan-emeterio-echeverria": {
    "id": "juan-emeterio-echeverria",
    "firstName": "Juan Emeterio",
    "lastName": "de Echeverría y Abella",
    "gender": "male",
    "birthDate": "1833-06-22",
    "birthPlace": "Ciudad de Guatemala",
    "deathDate": "1865-09-24",
    "deathPlace": "Puntarenas, Costa Rica",
    "notes": "Licenciado. Hijo de don Juan Emeterio de Echeverría y López de Alda (Álava) y de doña María Marta Ángela Abella y del Valle (Petén).",
    "parentIds": [],
    "spouseIds": [
      "maria-soledad-urruela"
    ],
    "childIds": [
      "emeterio-echeverria-urruela",
      "carmen-echeverria-urruela"
    ]
  },
  "emeterio-echeverria-urruela": {
    "id": "emeterio-echeverria-urruela",
    "firstName": "Emeterio",
    "lastName": "de Echeverría y Urruela",
    "gender": "male",
    "birthDate": "1864-03-03",
    "birthPlace": "Ciudad de Guatemala",
    "parentIds": [
      "juan-emeterio-echeverria",
      "maria-soledad-urruela"
    ],
    "spouseIds": [
      "mercedes-lizarralde"
    ],
    "childIds": [
      "juan-francisco-echeverria-lizarralde",
      "jorge-antonio-echeverria-lizarralde",
      "luis-fernando-echeverria-castillo",
      "jose-rodolfo-echeverria-castillo"
    ]
  },
  "mercedes-lizarralde": {
    "id": "mercedes-lizarralde",
    "firstName": "María de las Mercedes",
    "lastName": "de Lizarralde y Cepeda",
    "gender": "female",
    "birthDate": "1878-01-31",
    "birthPlace": "Sevilla / Guatemala",
    "deathDate": "1956-11-11",
    "deathPlace": "Ciudad de Guatemala",
    "notes": "Hija de don Juan Luis de Lizarralde y Torres (Sevilla) y de doña Dolores Cepeda y Arribillaga.",
    "parentIds": [],
    "spouseIds": [
      "emeterio-echeverria-urruela"
    ],
    "childIds": [
      "juan-francisco-echeverria-lizarralde",
      "jorge-antonio-echeverria-lizarralde",
      "luis-fernando-echeverria-castillo",
      "jose-rodolfo-echeverria-castillo"
    ]
  },
  "juan-francisco-echeverria-lizarralde": {
    "id": "juan-francisco-echeverria-lizarralde",
    "firstName": "Juan Francisco",
    "lastName": "Echeverría y Lizarralde",
    "gender": "male",
    "birthDate": "1899-12-10",
    "birthPlace": "Ciudad de Guatemala",
    "deathDate": "1979-08-28",
    "deathPlace": "Ciudad de Guatemala",
    "notes": "Ilustre historiador y autor de la monumental 'Historia Genealógica de la Familia Urruela'. Fallecido sin sucesión.",
    "parentIds": [
      "emeterio-echeverria-urruela",
      "mercedes-lizarralde"
    ],
    "spouseIds": [],
    "childIds": []
  },
  "jorge-antonio-echeverria-lizarralde": {
    "id": "jorge-antonio-echeverria-lizarralde",
    "firstName": "Jorge Antonio",
    "lastName": "Echeverría y Lizarralde",
    "gender": "male",
    "birthDate": "1901-06-14",
    "birthPlace": "Ciudad de Guatemala",
    "parentIds": [
      "emeterio-echeverria-urruela",
      "mercedes-lizarralde"
    ],
    "spouseIds": [
      "cecilia-klep"
    ],
    "childIds": []
  },
  "cecilia-klep": {
    "id": "cecilia-klep",
    "firstName": "Cecilia Paulina",
    "lastName": "Klep van Liebergen",
    "gender": "female",
    "birthPlace": "Venlo, Holanda",
    "notes": "Viuda del ingeniero y diplomático don Francisco Cáceres de la Cerda.",
    "parentIds": [],
    "spouseIds": [
      "jorge-antonio-echeverria-lizarralde"
    ],
    "childIds": []
  },
  "luis-fernando-echeverria-castillo": {
    "id": "luis-fernando-echeverria-castillo",
    "firstName": "Luis Fernando",
    "lastName": "Echeverría Castillo",
    "gender": "male",
    "birthDate": "1928-04-01",
    "parentIds": [
      "emeterio-echeverria-urruela",
      "mercedes-lizarralde"
    ],
    "spouseIds": [
      "victoria-morales-montiel"
    ],
    "childIds": [
      "maria-luz-echeverria-morales",
      "carlos-rafael-echeverria-morales",
      "gerardo-alfonso-echeverria-morales",
      "maria-pilar-echeverria-morales",
      "ricardo-echeverria-morales",
      "victoria-eugenia-echeverria-morales"
    ]
  },
  "victoria-morales-montiel": {
    "id": "victoria-morales-montiel",
    "firstName": "Victoria Eugenia",
    "lastName": "Morales y Montiel",
    "gender": "female",
    "birthPlace": "Ciudad de Guatemala",
    "notes": "Hija del Lic. Julio Morales Arriola y de doña María Victoria Montiel Ardón.",
    "parentIds": [],
    "spouseIds": [
      "luis-fernando-echeverria-castillo"
    ],
    "childIds": [
      "maria-luz-echeverria-morales",
      "carlos-rafael-echeverria-morales",
      "gerardo-alfonso-echeverria-morales",
      "maria-pilar-echeverria-morales",
      "ricardo-echeverria-morales",
      "victoria-eugenia-echeverria-morales"
    ]
  },
  "maria-luz-echeverria-morales": {
    "id": "maria-luz-echeverria-morales",
    "firstName": "María de la Luz",
    "lastName": "Echeverría Morales",
    "gender": "female",
    "birthDate": "1957-04-08",
    "parentIds": [
      "luis-fernando-echeverria-castillo",
      "victoria-morales-montiel"
    ],
    "spouseIds": [
      "raul-monzon-saenz"
    ],
    "childIds": [
      "pedro-monzon-echeverria",
      "pablo-monzon-echeverria"
    ]
  },
  "raul-monzon-saenz": {
    "id": "raul-monzon-saenz",
    "firstName": "Raúl",
    "lastName": "Monzón Sáenz",
    "gender": "male",
    "parentIds": [],
    "spouseIds": [
      "maria-luz-echeverria-morales"
    ],
    "childIds": [
      "pedro-monzon-echeverria",
      "pablo-monzon-echeverria"
    ]
  },
  "pedro-monzon-echeverria": {
    "id": "pedro-monzon-echeverria",
    "firstName": "Pedro",
    "lastName": "Monzón Echeverría",
    "gender": "male",
    "parentIds": [
      "raul-monzon-saenz",
      "maria-luz-echeverria-morales"
    ],
    "spouseIds": [],
    "childIds": []
  },
  "pablo-monzon-echeverria": {
    "id": "pablo-monzon-echeverria",
    "firstName": "Pablo",
    "lastName": "Monzón Echeverría",
    "gender": "male",
    "parentIds": [
      "raul-monzon-saenz",
      "maria-luz-echeverria-morales"
    ],
    "spouseIds": [],
    "childIds": []
  },
  "carlos-rafael-echeverria-morales": {
    "id": "carlos-rafael-echeverria-morales",
    "firstName": "Carlos Rafael",
    "lastName": "Echeverría Morales",
    "gender": "male",
    "parentIds": [
      "luis-fernando-echeverria-castillo",
      "victoria-morales-montiel"
    ],
    "spouseIds": [],
    "childIds": [
      "mateo-echeverria-roman",
      "esteban-echeverria-roman",
      "ximena-echeverria-roman"
    ]
  },
  "mateo-echeverria-roman": {
    "id": "mateo-echeverria-roman",
    "firstName": "Mateo Andrés",
    "lastName": "Echeverría Román",
    "gender": "male",
    "parentIds": [
      "carlos-rafael-echeverria-morales"
    ],
    "spouseIds": [],
    "childIds": []
  },
  "esteban-echeverria-roman": {
    "id": "esteban-echeverria-roman",
    "firstName": "Esteban",
    "lastName": "Echeverría Román",
    "gender": "male",
    "parentIds": [
      "carlos-rafael-echeverria-morales"
    ],
    "spouseIds": [],
    "childIds": []
  },
  "ximena-echeverria-roman": {
    "id": "ximena-echeverria-roman",
    "firstName": "Ximena",
    "lastName": "Echeverría Román",
    "gender": "female",
    "parentIds": [
      "carlos-rafael-echeverria-morales"
    ],
    "spouseIds": [],
    "childIds": []
  },
  "gerardo-alfonso-echeverria-morales": {
    "id": "gerardo-alfonso-echeverria-morales",
    "firstName": "Gerardo Alfonso",
    "lastName": "Echeverría Morales",
    "gender": "male",
    "parentIds": [
      "luis-fernando-echeverria-castillo",
      "victoria-morales-montiel"
    ],
    "spouseIds": [
      "militza-langle"
    ],
    "childIds": [
      "militza-andrea-echeverria-langle",
      "gerardo-andres-echeverria-langle"
    ]
  },
  "militza-langle": {
    "id": "militza-langle",
    "firstName": "Militza",
    "lastName": "Langle Serovic",
    "gender": "female",
    "parentIds": [],
    "spouseIds": [
      "gerardo-alfonso-echeverria-morales"
    ],
    "childIds": [
      "militza-andrea-echeverria-langle",
      "gerardo-andres-echeverria-langle"
    ]
  },
  "militza-andrea-echeverria-langle": {
    "id": "militza-andrea-echeverria-langle",
    "firstName": "Militza Andrea",
    "lastName": "Echeverría Langle",
    "gender": "female",
    "parentIds": [
      "gerardo-alfonso-echeverria-morales",
      "militza-langle"
    ],
    "spouseIds": [],
    "childIds": []
  },
  "gerardo-andres-echeverria-langle": {
    "id": "gerardo-andres-echeverria-langle",
    "firstName": "Gerardo Andrés",
    "lastName": "Echeverría Langle",
    "gender": "male",
    "parentIds": [
      "gerardo-alfonso-echeverria-morales",
      "militza-langle"
    ],
    "spouseIds": [],
    "childIds": []
  },
  "maria-pilar-echeverria-morales": {
    "id": "maria-pilar-echeverria-morales",
    "firstName": "María Pilar",
    "lastName": "Echeverría Morales",
    "gender": "female",
    "parentIds": [
      "luis-fernando-echeverria-castillo",
      "victoria-morales-montiel"
    ],
    "spouseIds": [],
    "childIds": []
  },
  "ricardo-echeverria-morales": {
    "id": "ricardo-echeverria-morales",
    "firstName": "Ricardo",
    "lastName": "Echeverría Morales",
    "gender": "male",
    "parentIds": [
      "luis-fernando-echeverria-castillo",
      "victoria-morales-montiel"
    ],
    "spouseIds": [
      "cathalinje-aerts"
    ],
    "childIds": [
      "martin-gabriel-echeverria-aerts"
    ]
  },
  "cathalinje-aerts": {
    "id": "cathalinje-aerts",
    "firstName": "Cathalinje",
    "lastName": "Aerts van Loy",
    "gender": "female",
    "parentIds": [],
    "spouseIds": [
      "ricardo-echeverria-morales"
    ],
    "childIds": [
      "martin-gabriel-echeverria-aerts"
    ]
  },
  "martin-gabriel-echeverria-aerts": {
    "id": "martin-gabriel-echeverria-aerts",
    "firstName": "Martín Gabriel",
    "lastName": "Echeverría Aerts",
    "gender": "male",
    "parentIds": [
      "ricardo-echeverria-morales",
      "cathalinje-aerts"
    ],
    "spouseIds": [],
    "childIds": []
  },
  "victoria-eugenia-echeverria-morales": {
    "id": "victoria-eugenia-echeverria-morales",
    "firstName": "Victoria Eugenia",
    "lastName": "Echeverría Morales",
    "gender": "female",
    "parentIds": [
      "luis-fernando-echeverria-castillo",
      "victoria-morales-montiel"
    ],
    "spouseIds": [
      "jose-fernando-mendez"
    ],
    "childIds": [
      "jose-andres-mendez-echeverria",
      "jose-ignacio-mendez-echeverria"
    ]
  },
  "jose-fernando-mendez": {
    "id": "jose-fernando-mendez",
    "firstName": "José Fernando",
    "lastName": "Méndez López",
    "gender": "male",
    "parentIds": [],
    "spouseIds": [
      "victoria-eugenia-echeverria-morales"
    ],
    "childIds": [
      "jose-andres-mendez-echeverria",
      "jose-ignacio-mendez-echeverria"
    ]
  },
  "jose-andres-mendez-echeverria": {
    "id": "jose-andres-mendez-echeverria",
    "firstName": "José Andrés",
    "lastName": "Méndez Echeverría",
    "gender": "male",
    "parentIds": [
      "jose-fernando-mendez",
      "victoria-eugenia-echeverria-morales"
    ],
    "spouseIds": [],
    "childIds": []
  },
  "jose-ignacio-mendez-echeverria": {
    "id": "jose-ignacio-mendez-echeverria",
    "firstName": "José Ignacio",
    "lastName": "Méndez Echeverría",
    "gender": "male",
    "parentIds": [
      "jose-fernando-mendez",
      "victoria-eugenia-echeverria-morales"
    ],
    "spouseIds": [],
    "childIds": []
  },
  "jose-rodolfo-echeverria-castillo": {
    "id": "jose-rodolfo-echeverria-castillo",
    "firstName": "José Rodolfo",
    "lastName": "Echeverría Castillo",
    "gender": "male",
    "birthDate": "1934-07-16",
    "parentIds": [
      "emeterio-echeverria-urruela",
      "mercedes-lizarralde"
    ],
    "spouseIds": [
      "maria-teresa-madrid",
      "aura-barillas"
    ],
    "childIds": [
      "ana-maria-mercedes-echeverria-madrid",
      "ana-maria-teresa-echeverria-madrid",
      "ana-maria-rosario-echeverria-madrid",
      "carmen-rosa-echeverria-barillas",
      "rodolfo-echeverria-barillas"
    ]
  },
  "maria-teresa-madrid": {
    "id": "maria-teresa-madrid",
    "firstName": "María Teresa",
    "lastName": "Madrid Molina",
    "gender": "female",
    "notes": "Hija de don Joaquín Madrid Valenzuela y de doña Marta Molina Llardén.",
    "parentIds": [],
    "spouseIds": [
      "jose-rodolfo-echeverria-castillo"
    ],
    "childIds": [
      "ana-maria-mercedes-echeverria-madrid",
      "ana-maria-teresa-echeverria-madrid",
      "ana-maria-rosario-echeverria-madrid"
    ]
  },
  "aura-barillas": {
    "id": "aura-barillas",
    "firstName": "Aura",
    "lastName": "Barillas",
    "gender": "female",
    "parentIds": [],
    "spouseIds": [
      "jose-rodolfo-echeverria-castillo"
    ],
    "childIds": [
      "carmen-rosa-echeverria-barillas",
      "rodolfo-echeverria-barillas"
    ]
  },
  "ana-maria-mercedes-echeverria-madrid": {
    "id": "ana-maria-mercedes-echeverria-madrid",
    "firstName": "Ana María Mercedes",
    "lastName": "Echeverría Madrid",
    "gender": "female",
    "birthDate": "1958-08-28",
    "parentIds": [
      "jose-rodolfo-echeverria-castillo",
      "maria-teresa-madrid"
    ],
    "spouseIds": [],
    "childIds": []
  },
  "ana-maria-teresa-echeverria-madrid": {
    "id": "ana-maria-teresa-echeverria-madrid",
    "firstName": "Ana María Teresa",
    "lastName": "Echeverría Madrid",
    "gender": "female",
    "birthDate": "1960-08-20",
    "parentIds": [
      "jose-rodolfo-echeverria-castillo",
      "maria-teresa-madrid"
    ],
    "spouseIds": [],
    "childIds": []
  },
  "ana-maria-rosario-echeverria-madrid": {
    "id": "ana-maria-rosario-echeverria-madrid",
    "firstName": "Ana María del Rosario",
    "lastName": "Echeverría Madrid",
    "gender": "female",
    "birthDate": "1962-10-03",
    "parentIds": [
      "jose-rodolfo-echeverria-castillo",
      "maria-teresa-madrid"
    ],
    "spouseIds": [],
    "childIds": []
  },
  "carmen-rosa-echeverria-barillas": {
    "id": "carmen-rosa-echeverria-barillas",
    "firstName": "Carmen Rosa",
    "lastName": "Echeverría Barillas",
    "gender": "female",
    "parentIds": [
      "jose-rodolfo-echeverria-castillo",
      "aura-barillas"
    ],
    "spouseIds": [],
    "childIds": []
  },
  "rodolfo-echeverria-barillas": {
    "id": "rodolfo-echeverria-barillas",
    "firstName": "Rodolfo",
    "lastName": "Echeverría Barillas",
    "gender": "male",
    "parentIds": [
      "jose-rodolfo-echeverria-castillo",
      "aura-barillas"
    ],
    "spouseIds": [],
    "childIds": []
  },
  "carmen-echeverria-urruela": {
    "id": "carmen-echeverria-urruela",
    "firstName": "María del Carmen",
    "lastName": "Echeverría y Urruela",
    "gender": "female",
    "birthDate": "1865-05-10",
    "birthPlace": "Ciudad de Guatemala",
    "parentIds": [
      "juan-emeterio-echeverria",
      "maria-soledad-urruela"
    ],
    "spouseIds": [
      "miguel-delgado-padre"
    ],
    "childIds": [
      "miguel-delgado-echeverria",
      "carmen-isabel-delgado",
      "madre-murillo-delgado"
    ]
  },
  "miguel-delgado-padre": {
    "id": "miguel-delgado-padre",
    "firstName": "Miguel",
    "lastName": "Delgado",
    "gender": "male",
    "birthPlace": "Guatemala",
    "parentIds": [],
    "spouseIds": [
      "carmen-echeverria-urruela"
    ],
    "childIds": [
      "miguel-delgado-echeverria",
      "carmen-isabel-delgado",
      "madre-murillo-delgado"
    ]
  },
  "carmen-isabel-delgado": {
    "id": "carmen-isabel-delgado",
    "firstName": "María del Carmen Isabel",
    "lastName": "Delgado y Echeverría",
    "gender": "female",
    "birthDate": "1898-11-19",
    "birthPlace": "Ciudad de Guatemala",
    "deathDate": "1954-06-02",
    "parentIds": [
      "miguel-delgado-padre",
      "carmen-echeverria-urruela"
    ],
    "spouseIds": [
      "mariano-leporowsky"
    ],
    "childIds": []
  },
  "mariano-leporowsky": {
    "id": "mariano-leporowsky",
    "firstName": "Mariano",
    "lastName": "Leporowsky",
    "gender": "male",
    "birthDate": "1895-07-15",
    "birthPlace": "Polonia",
    "deathDate": "1941-07-03",
    "deathPlace": "Ciudad de Guatemala",
    "parentIds": [],
    "spouseIds": [
      "carmen-isabel-delgado"
    ],
    "childIds": []
  },
  "madre-murillo-delgado": {
    "id": "madre-murillo-delgado",
    "firstName": "Doña",
    "lastName": "Delgado y Echeverría",
    "gender": "female",
    "birthPlace": "Ciudad de Guatemala",
    "parentIds": [
      "miguel-delgado-padre",
      "carmen-echeverria-urruela"
    ],
    "spouseIds": [
      "enrique-murillo-cuadra"
    ],
    "childIds": [
      "enrique-murillo-delgado",
      "pedro-adolfo-murillo-delgado"
    ]
  },
  "enrique-murillo-cuadra": {
    "id": "enrique-murillo-cuadra",
    "firstName": "Enrique",
    "lastName": "Murillo y Cuadra",
    "gender": "male",
    "parentIds": [],
    "spouseIds": [
      "madre-murillo-delgado"
    ],
    "childIds": [
      "enrique-murillo-delgado",
      "pedro-adolfo-murillo-delgado"
    ]
  },
  "enrique-murillo-delgado": {
    "id": "enrique-murillo-delgado",
    "firstName": "Enrique",
    "lastName": "Murillo y Delgado",
    "gender": "male",
    "birthDate": "1933-10-06",
    "notes": "Ingeniero civil.",
    "parentIds": [
      "enrique-murillo-cuadra",
      "madre-murillo-delgado"
    ],
    "spouseIds": [
      "silvia-crespo-castillo"
    ],
    "childIds": [
      "roberto-enrique-murillo-crespo",
      "ana-cristina-murillo-crespo"
    ]
  },
  "silvia-crespo-castillo": {
    "id": "silvia-crespo-castillo",
    "firstName": "Silvia",
    "lastName": "Crespo Castillo",
    "gender": "female",
    "notes": "Hija de don Joaquín Crespo Estefani y de doña Marina Castillo Cofiño.",
    "parentIds": [],
    "spouseIds": [
      "enrique-murillo-delgado"
    ],
    "childIds": [
      "roberto-enrique-murillo-crespo",
      "ana-cristina-murillo-crespo"
    ]
  },
  "roberto-enrique-murillo-crespo": {
    "id": "roberto-enrique-murillo-crespo",
    "firstName": "Roberto Enrique",
    "lastName": "Murillo Crespo",
    "gender": "male",
    "birthDate": "1961-10-31",
    "parentIds": [
      "enrique-murillo-delgado",
      "silvia-crespo-castillo"
    ],
    "spouseIds": [],
    "childIds": []
  },
  "ana-cristina-murillo-crespo": {
    "id": "ana-cristina-murillo-crespo",
    "firstName": "Ana Cristina",
    "lastName": "Murillo Crespo",
    "gender": "female",
    "birthDate": "1963-04-17",
    "parentIds": [
      "enrique-murillo-delgado",
      "silvia-crespo-castillo"
    ],
    "spouseIds": [],
    "childIds": []
  },
  "pedro-adolfo-murillo-delgado": {
    "id": "pedro-adolfo-murillo-delgado",
    "firstName": "Pedro Adolfo",
    "lastName": "Murillo y Delgado",
    "gender": "male",
    "birthDate": "1938-06-30",
    "parentIds": [
      "enrique-murillo-cuadra",
      "madre-murillo-delgado"
    ],
    "spouseIds": [
      "beatriz-azurdia"
    ],
    "childIds": [
      "pedro-bernal-murillo-azurdia"
    ]
  },
  "beatriz-azurdia": {
    "id": "beatriz-azurdia",
    "firstName": "Beatriz",
    "lastName": "Azurdia y Azurdia",
    "gender": "female",
    "notes": "Hija de don Enrique Azurdia Olaverri y de doña Josefina Azurdia Valenzuela.",
    "parentIds": [],
    "spouseIds": [
      "pedro-adolfo-murillo-delgado"
    ],
    "childIds": [
      "pedro-bernal-murillo-azurdia"
    ]
  },
  "pedro-bernal-murillo-azurdia": {
    "id": "pedro-bernal-murillo-azurdia",
    "firstName": "Pedro Bernal Blas",
    "lastName": "Murillo y Azurdia",
    "gender": "male",
    "birthDate": "1966-02-03",
    "parentIds": [
      "pedro-adolfo-murillo-delgado",
      "beatriz-azurdia"
    ],
    "spouseIds": [
      "marta-maselli-ortiz"
    ],
    "childIds": [
      "maria-fernanda-murillo-maselli"
    ]
  },
  "marta-maselli-ortiz": {
    "id": "marta-maselli-ortiz",
    "firstName": "Marta",
    "lastName": "Maselli Ortiz",
    "gender": "female",
    "parentIds": [],
    "spouseIds": [
      "pedro-bernal-murillo-azurdia"
    ],
    "childIds": [
      "maria-fernanda-murillo-maselli"
    ]
  },
  "maria-fernanda-murillo-maselli": {
    "id": "maria-fernanda-murillo-maselli",
    "firstName": "María Fernanda",
    "lastName": "Murillo Maselli",
    "gender": "female",
    "birthDate": "1998-04-02",
    "parentIds": [
      "pedro-bernal-murillo-azurdia",
      "marta-maselli-ortiz"
    ],
    "spouseIds": [],
    "childIds": []
  },
  "miguel-delgado-echeverria": {
    "id": "miguel-delgado-echeverria",
    "firstName": "Miguel",
    "lastName": "Delgado y Echeverría",
    "gender": "male",
    "birthPlace": "Ciudad de Guatemala",
    "deathDate": "1974-06-16",
    "deathPlace": "Ciudad de Guatemala",
    "parentIds": [
      "miguel-delgado-padre",
      "carmen-echeverria-urruela"
    ],
    "spouseIds": [
      "dolores-izquierdo-josue"
    ],
    "childIds": [
      "roberto-stelio-delgado",
      "oscar-alfredo-delgado",
      "samayoa-delgado-madre"
    ]
  },
  "dolores-izquierdo-josue": {
    "id": "dolores-izquierdo-josue",
    "firstName": "Dolores",
    "lastName": "Izquierdo y Josué",
    "gender": "female",
    "birthDate": "1892-09-17",
    "birthPlace": "Teruel / Estella, Navarra, España",
    "deathDate": "1979-06-16",
    "deathPlace": "Ciudad de Guatemala",
    "notes": "Hija de don Bienvenido Izquierdo (Teruel) y de doña Balvina Josué (Estella, Navarra).",
    "parentIds": [],
    "spouseIds": [
      "miguel-delgado-echeverria"
    ],
    "childIds": [
      "roberto-stelio-delgado",
      "oscar-alfredo-delgado",
      "samayoa-delgado-madre"
    ]
  },
  "oscar-alfredo-delgado": {
    "id": "oscar-alfredo-delgado",
    "firstName": "Oscar Alfredo",
    "lastName": "Delgado e Izquierdo",
    "gender": "male",
    "birthDate": "1920-11-07",
    "birthPlace": "Ciudad de Guatemala",
    "deathDate": "1983-12-19",
    "parentIds": [
      "miguel-delgado-echeverria",
      "dolores-izquierdo-josue"
    ],
    "spouseIds": [
      "blanca-dardon"
    ],
    "childIds": [
      "alfredo-raul-delgado-dardon",
      "margarita-lucrecia-delgado-wyld"
    ]
  },
  "blanca-dardon": {
    "id": "blanca-dardon",
    "firstName": "Blanca",
    "lastName": "Dardón e Ibargüen",
    "gender": "female",
    "notes": "Hija del Lic. Luis Dardón y Valenzuela y de doña Valentina Ibargüen y Uribe.",
    "parentIds": [],
    "spouseIds": [
      "oscar-alfredo-delgado"
    ],
    "childIds": [
      "alfredo-raul-delgado-dardon",
      "margarita-lucrecia-delgado-wyld"
    ]
  },
  "alfredo-raul-delgado-dardon": {
    "id": "alfredo-raul-delgado-dardon",
    "firstName": "Alfredo Raúl Estuardo",
    "lastName": "Delgado Dardón",
    "gender": "male",
    "birthDate": "1955-02-26",
    "deathDate": "1982-04-18",
    "parentIds": [
      "oscar-alfredo-delgado",
      "blanca-dardon"
    ],
    "spouseIds": [
      "ana-maria-castillo"
    ],
    "childIds": [
      "clara-regina-delgado-castillo"
    ]
  },
  "ana-maria-castillo": {
    "id": "ana-maria-castillo",
    "firstName": "Ana María",
    "lastName": "Castillo",
    "gender": "female",
    "parentIds": [],
    "spouseIds": [
      "alfredo-raul-delgado-dardon"
    ],
    "childIds": [
      "clara-regina-delgado-castillo"
    ]
  },
  "clara-regina-delgado-castillo": {
    "id": "clara-regina-delgado-castillo",
    "firstName": "Clara Regina",
    "lastName": "Delgado Castillo",
    "gender": "female",
    "birthDate": "1989-04-15",
    "parentIds": [
      "alfredo-raul-delgado-dardon",
      "ana-maria-castillo"
    ],
    "spouseIds": [],
    "childIds": []
  },
  "margarita-lucrecia-delgado-wyld": {
    "id": "margarita-lucrecia-delgado-wyld",
    "firstName": "Margarita Lucrecia",
    "lastName": "Delgado y Wyld",
    "gender": "female",
    "birthDate": "1943-11-11",
    "parentIds": [
      "oscar-alfredo-delgado",
      "blanca-dardon"
    ],
    "spouseIds": [
      "carlos-bruderer"
    ],
    "childIds": [
      "carlos-andres-bruderer",
      "christian-marc-bruderer"
    ]
  },
  "carlos-bruderer": {
    "id": "carlos-bruderer",
    "firstName": "Carlos Ernesto",
    "lastName": "Bruderer Jeanrenaud",
    "gender": "male",
    "parentIds": [],
    "spouseIds": [
      "margarita-lucrecia-delgado-wyld"
    ],
    "childIds": [
      "carlos-andres-bruderer",
      "christian-marc-bruderer"
    ]
  },
  "carlos-andres-bruderer": {
    "id": "carlos-andres-bruderer",
    "firstName": "Carlos Andrés",
    "lastName": "Bruderer Delgado",
    "gender": "male",
    "birthDate": "1967-01-06",
    "parentIds": [
      "carlos-bruderer",
      "margarita-lucrecia-delgado-wyld"
    ],
    "spouseIds": [
      "jill-webb"
    ],
    "childIds": [
      "tomas-alberto-bruderer",
      "madeleine-grace-bruderer"
    ]
  },
  "jill-webb": {
    "id": "jill-webb",
    "firstName": "Jill Anne",
    "lastName": "Webb Oinhausen",
    "gender": "female",
    "parentIds": [],
    "spouseIds": [
      "carlos-andres-bruderer"
    ],
    "childIds": [
      "tomas-alberto-bruderer",
      "madeleine-grace-bruderer"
    ]
  },
  "tomas-alberto-bruderer": {
    "id": "tomas-alberto-bruderer",
    "firstName": "Tomás Alberto",
    "lastName": "Bruderer Webb",
    "gender": "male",
    "birthDate": "1998-04-30",
    "parentIds": [
      "carlos-andres-bruderer",
      "jill-webb"
    ],
    "spouseIds": [],
    "childIds": []
  },
  "madeleine-grace-bruderer": {
    "id": "madeleine-grace-bruderer",
    "firstName": "Madeleine Grace",
    "lastName": "Bruderer Webb",
    "gender": "female",
    "birthDate": "1999-11-08",
    "parentIds": [
      "carlos-andres-bruderer",
      "jill-webb"
    ],
    "spouseIds": [],
    "childIds": []
  },
  "christian-marc-bruderer": {
    "id": "christian-marc-bruderer",
    "firstName": "Christian Marc",
    "lastName": "Bruderer Delgado",
    "gender": "male",
    "birthDate": "1968-12-10",
    "parentIds": [
      "carlos-bruderer",
      "margarita-lucrecia-delgado-wyld"
    ],
    "spouseIds": [],
    "childIds": []
  },
  "samayoa-delgado-madre": {
    "id": "samayoa-delgado-madre",
    "firstName": "Doña",
    "lastName": "Delgado e Izquierdo",
    "gender": "female",
    "birthPlace": "Ciudad de Guatemala",
    "parentIds": [
      "miguel-delgado-echeverria",
      "dolores-izquierdo-josue"
    ],
    "spouseIds": [
      "padre-samayoa"
    ],
    "childIds": [
      "luis-fernando-samayoa-delgado",
      "juan-carlos-samayoa-delgado",
      "jorge-samayoa-delgado"
    ]
  },
  "padre-samayoa": {
    "id": "padre-samayoa",
    "firstName": "Don",
    "lastName": "Samayoa Martínez",
    "gender": "male",
    "deathDate": "1965-05-25",
    "parentIds": [],
    "spouseIds": [
      "samayoa-delgado-madre"
    ],
    "childIds": [
      "luis-fernando-samayoa-delgado",
      "juan-carlos-samayoa-delgado",
      "jorge-samayoa-delgado"
    ]
  },
  "luis-fernando-samayoa-delgado": {
    "id": "luis-fernando-samayoa-delgado",
    "firstName": "Luis Fernando",
    "lastName": "Samayoa Delgado",
    "gender": "male",
    "birthDate": "1953-05-13",
    "parentIds": [
      "padre-samayoa",
      "samayoa-delgado-madre"
    ],
    "spouseIds": [],
    "childIds": []
  },
  "juan-carlos-samayoa-delgado": {
    "id": "juan-carlos-samayoa-delgado",
    "firstName": "Juan Carlos",
    "lastName": "Samayoa Delgado",
    "gender": "male",
    "birthDate": "1958-01-01",
    "parentIds": [
      "padre-samayoa",
      "samayoa-delgado-madre"
    ],
    "spouseIds": [],
    "childIds": [
      "juan-carlos-samayoa-escobar",
      "javier-samayoa-escobar",
      "maria-sofia-samayoa-escobar",
      "maiella-samayoa-escobar"
    ]
  },
  "juan-carlos-samayoa-escobar": {
    "id": "juan-carlos-samayoa-escobar",
    "firstName": "Juan Carlos",
    "lastName": "Samayoa Escobar",
    "gender": "male",
    "birthDate": "1985-01-16",
    "parentIds": [
      "juan-carlos-samayoa-delgado"
    ],
    "spouseIds": [],
    "childIds": []
  },
  "javier-samayoa-escobar": {
    "id": "javier-samayoa-escobar",
    "firstName": "Javier",
    "lastName": "Samayoa Escobar",
    "gender": "male",
    "birthDate": "1986-07-12",
    "parentIds": [
      "juan-carlos-samayoa-delgado"
    ],
    "spouseIds": [],
    "childIds": []
  },
  "maria-sofia-samayoa-escobar": {
    "id": "maria-sofia-samayoa-escobar",
    "firstName": "María Sofía",
    "lastName": "Samayoa Escobar",
    "gender": "female",
    "birthDate": "1989-10-10",
    "parentIds": [
      "juan-carlos-samayoa-delgado"
    ],
    "spouseIds": [],
    "childIds": []
  },
  "maiella-samayoa-escobar": {
    "id": "maiella-samayoa-escobar",
    "firstName": "Maiella",
    "lastName": "Samayoa Escobar",
    "gender": "female",
    "birthDate": "1991-06-29",
    "parentIds": [
      "juan-carlos-samayoa-delgado"
    ],
    "spouseIds": [],
    "childIds": []
  },
  "jorge-samayoa-delgado": {
    "id": "jorge-samayoa-delgado",
    "firstName": "Jorge",
    "lastName": "Samayoa Delgado",
    "gender": "male",
    "birthDate": "1963-11-20",
    "parentIds": [
      "padre-samayoa",
      "samayoa-delgado-madre"
    ],
    "spouseIds": [
      "irene-montes"
    ],
    "childIds": [
      "maria-sara-samayoa-montes",
      "diana-samayoa-montes"
    ]
  },
  "irene-montes": {
    "id": "irene-montes",
    "firstName": "Irene",
    "lastName": "Montes Beltranena",
    "gender": "female",
    "parentIds": [],
    "spouseIds": [
      "jorge-samayoa-delgado"
    ],
    "childIds": [
      "maria-sara-samayoa-montes",
      "diana-samayoa-montes"
    ]
  },
  "maria-sara-samayoa-montes": {
    "id": "maria-sara-samayoa-montes",
    "firstName": "María Sara",
    "lastName": "Samayoa Montes",
    "gender": "female",
    "birthDate": "1991-12-12",
    "parentIds": [
      "jorge-samayoa-delgado",
      "irene-montes"
    ],
    "spouseIds": [],
    "childIds": []
  },
  "diana-samayoa-montes": {
    "id": "diana-samayoa-montes",
    "firstName": "Diana",
    "lastName": "Samayoa Montes",
    "gender": "female",
    "birthDate": "1995-09-05",
    "parentIds": [
      "jorge-samayoa-delgado",
      "irene-montes"
    ],
    "spouseIds": [],
    "childIds": []
  },
  "roberto-stelio-delgado": {
    "id": "roberto-stelio-delgado",
    "firstName": "Roberto Stelio",
    "lastName": "Delgado e Izquierdo",
    "gender": "male",
    "birthDate": "1916-06-20",
    "birthPlace": "Ciudad de Guatemala",
    "notes": "Abuelo de Roberto Delgado Rüegg.",
    "parentIds": [
      "miguel-delgado-echeverria",
      "dolores-izquierdo-josue"
    ],
    "spouseIds": [
      "carmen-garcia-rendueles"
    ],
    "childIds": [
      "roberto-delgado-padre",
      "fernando-delgado-garcia"
    ]
  },
  "carmen-garcia-rendueles": {
    "id": "carmen-garcia-rendueles",
    "firstName": "Carmen",
    "lastName": "García-Rendueles",
    "gender": "female",
    "birthPlace": "Guatemala / España",
    "parentIds": [],
    "spouseIds": [
      "roberto-stelio-delgado"
    ],
    "childIds": [
      "roberto-delgado-padre",
      "fernando-delgado-garcia"
    ]
  },
  "fernando-delgado-garcia": {
    "id": "fernando-delgado-garcia",
    "firstName": "Fernando",
    "lastName": "Delgado García-Rendueles",
    "gender": "male",
    "birthDate": "1956-02-18",
    "birthPlace": "Ciudad de Guatemala",
    "parentIds": [
      "roberto-stelio-delgado",
      "carmen-garcia-rendueles"
    ],
    "spouseIds": [],
    "childIds": []
  },
  "roberto-delgado-padre": {
    "id": "roberto-delgado-padre",
    "firstName": "Roberto",
    "lastName": "Delgado García-Rendueles",
    "gender": "male",
    "birthDate": "1950-01-01",
    "birthPlace": "Ciudad de Guatemala",
    "notes": "Padre de Roberto Delgado Rüegg.",
    "parentIds": [
      "roberto-stelio-delgado",
      "carmen-garcia-rendueles"
    ],
    "spouseIds": [
      "senora-ruegg"
    ],
    "childIds": [
      "roberto-delgado-ruegg",
      "pablo-delgado-ruegg",
      "diego-delgado-ruegg"
    ]
  },
  "senora-ruegg": {
    "id": "senora-ruegg",
    "firstName": "Sra.",
    "lastName": "Rüegg",
    "gender": "female",
    "birthPlace": "Guatemala / Suiza",
    "notes": "Madre de Roberto Delgado Rüegg.",
    "parentIds": [],
    "spouseIds": [
      "roberto-delgado-padre"
    ],
    "childIds": [
      "roberto-delgado-ruegg",
      "pablo-delgado-ruegg",
      "diego-delgado-ruegg"
    ]
  },
  "roberto-delgado-ruegg": {
    "id": "roberto-delgado-ruegg",
    "firstName": "Roberto",
    "lastName": "Delgado Rüegg",
    "gender": "male",
    "birthDate": "1978-04-26",
    "birthPlace": "Ciudad de Guatemala",
    "notes": "Centro del Árbol Genealógico Familiar.",
    "parentIds": [
      "roberto-delgado-padre",
      "senora-ruegg"
    ],
    "spouseIds": [],
    "childIds": []
  },
  "pablo-delgado-ruegg": {
    "id": "pablo-delgado-ruegg",
    "firstName": "Pablo",
    "lastName": "Delgado Rüegg",
    "gender": "male",
    "birthDate": "1984-02-15",
    "birthPlace": "Ciudad de Guatemala",
    "notes": "Hermano de Roberto Delgado Rüegg.",
    "parentIds": [
      "roberto-delgado-padre",
      "senora-ruegg"
    ],
    "spouseIds": [],
    "childIds": []
  },
  "diego-delgado-ruegg": {
    "id": "diego-delgado-ruegg",
    "firstName": "Diego",
    "lastName": "Delgado Rüegg",
    "gender": "male",
    "birthDate": "1985-05-14",
    "birthPlace": "Ciudad de Guatemala",
    "notes": "Hermano de Roberto Delgado Rüegg.",
    "parentIds": [
      "roberto-delgado-padre",
      "senora-ruegg"
    ],
    "spouseIds": [],
    "childIds": []
  }
},
};
