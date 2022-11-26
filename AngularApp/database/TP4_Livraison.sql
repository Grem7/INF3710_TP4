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
	numerodetelephone VARCHAR(12),
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

-- Insertion de tuple dans la BD

INSERT INTO fournisseur VALUES(0, 'AB Transport', '123 rue du chemin');
INSERT INTO fournisseur VALUES(1, 'QC Transport', '345 boulevard de la monte');

INSERT INTO client VALUES(0, 'Galibois', 'Leonard', 'leonard.galibois@polymtl.ca', 'Boulevard feuilles' , 'Montreal', 'E9K9P0');
INSERT INTO client VALUES(1, 'Gregoire', 'Matis', 'matis.gregoire@polymtl.ca', 'Rue de la maison', 'Gaspe', 'B3A5Y5');

INSERT INTO telephone VALUES(0, 4504449089);
INSERT INTO telephone VALUES(1, 9658701250);

INSERT INTO planrepas VALUES(0, 'Famille', 'Mensuel', 4, 1000, 119.99, 0);
INSERT INTO planrepas VALUES(1, 'Pescetarien', 'Bihebdomadaire', 2, 750, 49.99, 1);

INSERT INTO abonner VALUES(0, 0, 3);
INSERT INTO abonner VALUES(1, 1, 12);

INSERT INTO vegetarian VALUES(0, 'dessert tofu');
INSERT INTO vegetarian VALUES(1, 'patate douce frit');

INSERT INTO pescetarien VALUES(0, 'truite');
INSERT INTO pescetarien VALUES(1, 'saumon');

INSERT INTO famille VALUES(0);
INSERT INTO famille VALUES(1);

INSERT INTO rapide VALUES(0, 10);
INSERT INTO rapide VALUES(1, 25);

INSERT INTO facile VALUES(0, 4);
INSERT INTO facile VALUES(1, 7);

INSERT INTO kitrepas VALUES(0, 'lasagne a la sauce bolognese', 0);
INSERT INTO kitrepas VALUES(1, 'salade cesar', 1);

INSERT INTO image VALUES(0, 'lasagne sortant du four', 0);
INSERT INTO image VALUES(1, 'personne melangant les ingredients', 1);

INSERT INTO ingredient VALUES(0, 'cacao' , 'perou');
INSERT INTO ingredient VALUES(1, 'truffle', 'france');

INSERT INTO contenir VALUES(0, 0);
INSERT INTO contenir VALUES(1, 1);

INSERT INTO etape VALUES(0, 0, 'Brunir la viande hache avec les ognions', 5,null);
INSERT INTO etape VALUES(1,1, 'ajoute sauce tomate a la cuisson', 10, 0);