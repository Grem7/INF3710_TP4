CREATE TABLE IF NOT EXISTS Fournisseur(
	numerofournisseur SERIAL PRIMARY KEY,
	nomfournisseur VARCHAR(20),
	adressefournisseur VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS Client(
	numeroclient SERIAL PRIMARY KEY,
	nomclient VARCHAR(20),
	prenomclient VARCHAR(20),
	adressecourrielclient VARCHAR(50),
	rueclient VARCHAR(20),
	villeclient VARCHAR(20),
	codepostalclient CHAR(6)
);

CREATE TABLE IF NOT EXISTS Telephone(
	numeroclient SERIAL REFERENCES Client,
	numerodetelephone INTEGER,
	PRIMARY KEY (numeroclient, numerodetelephone)
);

CREATE TABLE IF NOT EXISTS Planrepas(
	numeroplan SERIAL PRIMARY KEY, 
	categorie VARCHAR(20) CHECK (categorie IN ('Famille','Pescetarien','Vegetarian', 'Divers')),
	frequence VARCHAR(20) CHECK (frequence IN ('Hebdomadaire', 'Mensuel', 'Bihebdomadaire','Quotidien')),
	nbpersonnes INTEGER CHECK (nbpersonnes > 0),
	nbcalories INTEGER CHECK (nbcalories > 0),
	prix DECIMAL(6,2),
	numerofournisseur INTEGER REFERENCES Fournisseur NOT NULL
);

CREATE TABLE IF NOT EXISTS Abonner(
	numeroclient SERIAL REFERENCES Client,
	numeroplan INTEGER REFERENCES Planrepas,
	duree INTEGER CHECK (duree IN (1,3,6,12)) NOT NULL,
	PRIMARY KEY (numeroclient, numeroplan)
);

CREATE TABLE IF NOT EXISTS Vegetarian(
	numeroplan INTEGER PRIMARY KEY REFERENCES Planrepas,
	typederepas VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS Pescetarien(
	numeroplan INTEGER PRIMARY KEY REFERENCES Planrepas,
	typepoisson VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS Famille(
	numeroplan INTEGER PRIMARY KEY REFERENCES Planrepas
);

CREATE TABLE IF NOT EXISTS Rapide(
	numeroplan INTEGER PRIMARY KEY REFERENCES Famille,
	tempsdepreparation INTEGER CHECK (tempsdepreparation > 0)
);

CREATE TABLE IF NOT EXISTS Facile(
	numeroplan INTEGER PRIMARY KEY REFERENCES Famille,
	nbingredients INTEGER CHECK (nbingredients > 0)
);

CREATE TABLE IF NOT EXISTS Kitrepas(
	numerokitrepas SERIAL PRIMARY KEY,
	description VARCHAR(100),
	numeroplan INTEGER REFERENCES Planrepas NOT NULL
);

CREATE TABLE IF NOT EXISTS Image(
	numeroimage SERIAL PRIMARY KEY,
	donnees VARCHAR(150),
	numerokitrepas INTEGER REFERENCES Kitrepas NOT NULL
);

CREATE TABLE IF NOT EXISTS Ingredient(
	numeroingredient SERIAL PRIMARY KEY,
	nomingredient VARCHAR(20),
	paysingredient VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS Contenir(
	numerokitrepas INTEGER REFERENCES Kitrepas,
	numeroingredient INTEGER REFERENCES Ingredient,
	PRIMARY KEY (numerokitrepas, numeroingredient)
);

CREATE TABLE IF NOT EXISTS Etape(
	numerokitrepas INTEGER REFERENCES Kitrepas,
	numeroetape INTEGER,
	descriptionetape VARCHAR(250),
	dureeetape INTEGER CHECK (dureeetape > 0),
	numeroetapefairepartie INTEGER,
	PRIMARY KEY (numerokitrepas, numeroetape)
);