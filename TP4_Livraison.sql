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

-- Insertion de tuple dans la BD

INSERT INTO fournisseur VALUES(0, 'AB Transport', '123 rue du chemin');
INSERT INTO fournisseur VALUES(1, 'QC Transport', '345 boulevard de la monte');

INSERT INTO client VALUES(0, 'Galibois', 'Leonard', 'leonard.galibois@polymtl.ca', 'Boulevard feuilles' , 'Montreal', 'E9K9P0');
INSERT INTO client VALUES(1, 'Gregoire', 'Matis', 'matis.gregoire@polymtl.ca', 'Rue de la maison', 'Gaspe', 'B3A5Y5');

INSERT INTO telephone VALUES(0, 4504449089);
INSERT INTO telephone VALUES(1, 9658701250);

INSERT INTO planrepas VALUES(0, 'Vegetarien', 'Mensuel', 4, 1000, 119.99, 0);
INSERT INTO planrepas VALUES(1, 'Vegetarien', 'Bihebdomadaire', 2, 750, 49.99, 1);
INSERT INTO planrepas VALUES(2, 'Pescetarien', 'Mensuel', 2, 750, 49.99, 0);
INSERT INTO planrepas VALUES(3, 'Pescetarien', 'Hebdomadaire', 3, 900, 69.99, 1);
INSERT INTO planrepas VALUES(4, 'Famille', 'Quotidien', 4, 750, 59.99, 0);
INSERT INTO planrepas VALUES(5, 'Famille', 'Hebdomadaire', 4, 850, 69.99, 1);
INSERT INTO planrepas VALUES(6, 'Famille', 'Bihebdomadaire', 4, 950, 79.99, 0);
INSERT INTO planrepas VALUES(7, 'Famille', 'Mensuel', 4, 1050, 99.99, 1);


INSERT INTO abonner VALUES(0, 0, 3);
INSERT INTO abonner VALUES(1, 1, 12);

INSERT INTO vegetarien VALUES(0, 'dessert tofu');
INSERT INTO vegetarien VALUES(1, 'patate douce frit');

INSERT INTO pescetarien VALUES(2, 'truite');
INSERT INTO pescetarien VALUES(3, 'saumon');

INSERT INTO famille VALUES(4);
INSERT INTO famille VALUES(5);
INSERT INTO famille VALUES(6);
INSERT INTO famille VALUES(7);

INSERT INTO rapide VALUES(4, 10);
INSERT INTO rapide VALUES(5, 25);

INSERT INTO facile VALUES(6, 4);
INSERT INTO facile VALUES(7, 7);

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