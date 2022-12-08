-- 4.1
SELECT cl.numeroclient, cl.nomclient 
FROM client cl, abonner ab, planrepas pr
WHERE cl.numeroclient = ab.numeroclient 
AND ab.numeroplan = pr.numeroplan
AND pr.prix BETWEEN 20 AND 40;

-- 4.2
SELECT pr.numeroplan
FROM planrepas pr, fournisseur f
WHERE pr.numerofournisseur = f.numerofournisseur
AND f.nomfournisseur <> 'QC Transport';

-- 4.3
SELECT numeroplan
FROM planrepas
WHERE categorie = 'cétogène';

-- 4.4
SELECT COUNT(f.numerofournisseur)
FROM fournisseur f
WHERE f.nomfournisseur IS NULL;

-- 4.5
SELECT f.nomfournisseur
FROM fournisseur f, planrepas pr
WHERE f.numerofournisseur = pr.numerofournisseur
AND pr.prix > (SELECT MAX(pr.prix)
				FROM fournisseur f, planrepas pr
				WHERE f.numerofournisseur = pr.numerofournisseur
				AND f.nomfournisseur = 'AB Transport');

-- 4.6
SELECT f.nomfournisseur, f.adressefournisseur, SUM(pr.prix)
FROM fournisseur f, planrepas pr, abonner ab
WHERE f.numerofournisseur = pr.numerofournisseur
AND ab.numeroplan = pr.numeroplan
GROUP BY f.nomfournisseur, f.adressefournisseur
ORDER BY COUNT(ab.numeroplan) DESC 
LIMIT 2;

-- 4.7
SELECT COUNT(DISTINCT kr.numerokitrepas)
FROM kitrepas kr, abonner ab
WHERE kr.numeroplan NOT IN (SELECT ab.numeroplan from abonner ab);

-- 4.8
SELECT cl.numeroclient, cl.nomclient, cl.prenomclient
FROM client cl, fournisseur f
WHERE LEFT(cl.prenomclient, 1) NOT IN ('A','a','E','e','I','i','O','o','U','u','Y','y')
AND cl.villeclient = f.adressefournisseur
AND f.nomfournisseur = 'Benjamin'
ORDER BY cl.nomclient;

-- 4.9
SELECT i.paysingredient, COUNT(i.numeroingredient)
FROM ingredient i 
WHERE i.paysingredient NOT LIKE '%g__'
GROUP BY i.paysingredient
ORDER BY i.paysingredient DESC;

-- 4.10
CREATE OR REPLACE VIEW V_fournisseur (V_categorie, V_adresse, V_tot) AS
	SELECT pr.categorie, f.adressefournisseur, SUM(pr.prix)
	FROM fournisseur f, planrepas pr
	WHERE f.numerofournisseur = pr.numerofournisseur
	GROUP BY f.numerofournisseur, pr.categorie
	HAVING SUM(pr.prix) > 12500
	AND (pr.categorie LIKE '%e__' OR pr.categorie LIKE '%o__')
	ORDER BY pr.categorie ASC, SUM(pr.prix) DESC;
	
SELECT * FROM V_fournisseur;