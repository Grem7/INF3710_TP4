-- 4.1
SELECT cl.numeroclient, cl.nomclient 
FROM client cl, abonner ab, planrepas rp
WHERE cl.numeroclient = ab.numeroclient 
AND ab.numeroplan = rp.numeroplan
AND rp.prix BETWEEN 20 AND 40;

-- 4.2
SELECT rp.numeroplan
FROM planrepas rp, fournisseur f
WHERE rp.numerofournisseur = f.numerofournisseur
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
FROM fournisseur f, planrepas rp
WHERE f.numerofournisseur = rp.numerofournisseur
AND rp.prix > (SELECT MAX(rp.prix)
				FROM fournisseur f, planrepas rp
				WHERE f.numerofournisseur = rp.numerofournisseur
				AND f.nomfournisseur = 'AB Transport');

-- 4.6
-- 4.7
-- 4.8
-- 4.9
-- 4.10