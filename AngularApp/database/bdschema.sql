CREATE TABLE IF NOT EXISTS Fournisseur(
	numerofournisseur INTEGER PRIMARY KEY,
	nomfournisseur VARCHAR(20),
	adressefournisseur VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS Client(
	numeroclient INTEGER PRIMARY KEY,
	nomclient VARCHAR(20),
	prenomclient VARCHAR(20),
	adressecourrielclient VARCHAR(50),
	rueclient VARCHAR(20),
	villeclient VARCHAR(20),
	codepostalclient CHAR(6)
);

CREATE TABLE IF NOT EXISTS Telephone(
	numeroclient INTEGER REFERENCES Client ON UPDATE CASCADE ON DELETE CASCADE,
	numerodetelephone VARCHAR(12),
	PRIMARY KEY (numeroclient, numerodetelephone)
);

CREATE TABLE IF NOT EXISTS Planrepas(
	numeroplan INTEGER PRIMARY KEY, 
	categorie VARCHAR(20) CHECK (categorie IN ('Famille','Pescetarien','Vegetarien', 'Divers')),
	frequence VARCHAR(20) CHECK (frequence IN ('Hebdomadaire', 'Mensuel', 'Bihebdomadaire','Quotidien')),
	nbpersonnes INTEGER CHECK (nbpersonnes > 0),
	nbcalories INTEGER CHECK (nbcalories > 0),
	prix DECIMAL(6,2),
	numerofournisseur INTEGER REFERENCES Fournisseur ON UPDATE CASCADE ON DELETE CASCADE NOT NULL
);

CREATE TABLE IF NOT EXISTS Abonner(
	numeroclient INTEGER REFERENCES Client ON UPDATE CASCADE ON DELETE CASCADE,
	numeroplan INTEGER REFERENCES Planrepas ON UPDATE CASCADE ON DELETE CASCADE,
	duree INTEGER CHECK (duree IN (1,3,6,12)) NOT NULL,
	PRIMARY KEY (numeroclient, numeroplan)
);

CREATE TABLE IF NOT EXISTS Vegetarien(
	numeroplan INTEGER PRIMARY KEY REFERENCES Planrepas ON UPDATE CASCADE ON DELETE CASCADE,
	typederepas VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS Pescetarien(
	numeroplan INTEGER PRIMARY KEY REFERENCES Planrepas ON UPDATE CASCADE ON DELETE CASCADE,
	typepoisson VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS Famille(
	numeroplan INTEGER PRIMARY KEY REFERENCES Planrepas ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Rapide(
	numeroplan INTEGER PRIMARY KEY REFERENCES Famille ON UPDATE CASCADE ON DELETE CASCADE,
	tempsdepreparation INTEGER CHECK (tempsdepreparation > 0)
);

CREATE TABLE IF NOT EXISTS Facile(
	numeroplan INTEGER PRIMARY KEY REFERENCES Famille ON UPDATE CASCADE ON DELETE CASCADE,
	nbingredients INTEGER CHECK (nbingredients > 0)
);

CREATE TABLE IF NOT EXISTS Kitrepas(
	numerokitrepas INTEGER PRIMARY KEY,
	description VARCHAR(100),
	numeroplan INTEGER REFERENCES Planrepas ON UPDATE CASCADE ON DELETE CASCADE NOT NULL
);

CREATE TABLE IF NOT EXISTS Image(
	numeroimage INTEGER PRIMARY KEY,
	donnees VARCHAR(150),
	numerokitrepas INTEGER REFERENCES Kitrepas ON UPDATE CASCADE ON DELETE CASCADE NOT NULL
);

CREATE TABLE IF NOT EXISTS Ingredient(
	numeroingredient INTEGER PRIMARY KEY,
	nomingredient VARCHAR(20),
	paysingredient VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS Contenir(
	numerokitrepas INTEGER REFERENCES Kitrepas ON UPDATE CASCADE ON DELETE CASCADE,
	numeroingredient INTEGER REFERENCES Ingredient ON UPDATE CASCADE ON DELETE CASCADE,
	PRIMARY KEY (numerokitrepas, numeroingredient)
);

CREATE TABLE IF NOT EXISTS Etape(
	numerokitrepas INTEGER REFERENCES Kitrepas ON UPDATE CASCADE ON DELETE CASCADE,
	numeroetape INTEGER,
	descriptionetape VARCHAR(250),
	dureeetape INTEGER CHECK (dureeetape > 0),
	numeroetapefairepartie INTEGER,
	PRIMARY KEY (numerokitrepas, numeroetape)
);