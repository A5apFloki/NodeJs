const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

// Création du serveur Express
const app = express();

// Configuration du serveur
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

// Connexion à la base de donnée SQlite
const db_name = path.join(__dirname, "data", "apptest.db");
const db = new sqlite3.Database(db_name, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connexion réussie à la base de données 'apptest.db'");
});

// Création de la table Livres (Livre_ID, Titre, Auteur, Commentaires)
const sql_create = `CREATE TABLE IF NOT EXISTS Livres (
  Livre_ID INTEGER PRIMARY KEY AUTOINCREMENT,
  Titre VARCHAR(100) NOT NULL,
  Auteur VARCHAR(100) NOT NULL,
  NbrExemplaire INTEGER,
  Commentaires TEXT
);`;

const sql_createAbn = `CREATE TABLE IF NOT EXISTS Abn (
  Abn_ID INTEGER PRIMARY KEY AUTOINCREMENT,
  Nom VARCHAR(100) NOT NULL,
  Prenom VARCHAR(100) NOT NULL,
  Numero VARCHAR(100) NOT NULL,
  Commentaires VARCHAR(100) NOT NULL,
  Addresse VARCHAR(100) NOT NULL
);`;
// Table Pret

const sql_createPrets = `CREATE TABLE IF NOT EXISTS Prets (
  Pret_ID INTEGER PRIMARY KEY AUTOINCREMENT,
  Abn_ID INTEGER NOT NULL,
  Livre_ID INTEGER NOT NULL,
  DatePret DATE NOT NULL,
  FOREIGN KEY (Abn_ID) REFERENCES Abn (Abn_ID),
  FOREIGN KEY (Livre_ID) REFERENCES Livres (Livre_ID)
);`;

db.run(sql_createPrets, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Création réussie de la table 'Prets'");
});

db.run(sql_create, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Création réussie de la table 'Livres'");
  // Alimentation de la table
  const sql_insert = `INSERT INTO Livres (Livre_ID, Titre, Auteur, NbrExemplaire, Commentaires) VALUES
  (1, 'Mrs. Bridge', 'Evan S. Connell', 11,'Premier de la série'),
  (2, 'Mr. Bridge', 'Evan S. Connell', 20,'Second de la série'),
  (3, 'L''ingénue libertine', 'Colette', 2, 'Minne + Les égarements de Minne');`;
  db.run(sql_insert, err => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Alimentation réussie de la table 'Livres'");
  });
});

db.run(sql_createAbn, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Création réussie de la table 'Abn'");
  const sql_insert = ``;
  db.run(sql_insert, err => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Alimentation réussie de la table 'Abn'");
  });
});




// Démarrage du serveur
app.listen(3000, () => {
    console.log("Serveur démarré (http://localhost:3000/) !");
});

// GET /
app.get("/", (req, res) => {
  // res.send("Bonjour le monde...");
  res.render("index");
});

// GET /about
app.get("/about", (req, res) => {
  res.render("about");
});
app.get("/livrend", (req, res) => {
  res.render("livrend");
});

// GET /data
app.get("/data", (req, res) => {
  const sql = "SELECT * FROM Abn ORDER BY Nom";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("data", { model: rows });
  });
});

// GET /create
app.get("/create", (req, res) => {
  res.render("create", { model: {} });
});


app.get("/createAbn", (req, res) => {
  res.render("createAbn", { model: {} });
});



// POST /create
app.post("/create", (req, res) => {
  const sql = "INSERT INTO Livres (Titre, Auteur, NbrExemplaire, Commentaires) VALUES (?, ?, ?, ?)";
  const book = [req.body.Titre, req.body .Auteur, req.body.NbrExemplaire, req.body.Commentaires];
  db.run(sql, book, err => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect("/livres");
  });
});

// GET /edit/5
app.get("/edit/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM Livres WHERE Livre_ID = ?";
  db.get(sql, id, (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("edit", { model: row });
  });
});

// POST /edit/5
app.post("/edit/:id", (req, res) => {
  const id = req.params.id;
  const book = [req.body.Titre, req.body.Auteur, req.body.NbrExemplaire, req.body.Commentaires, id];
  const sql = "UPDATE Livres SET Titre = ?, Auteur = ?, NbrExemplaire = ?, Commentaires = ? WHERE (Livre_ID = ?)";
  db.run(sql, book, err => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect("/livres");
  });
});

// GET /delete/5
app.get("/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM Livres WHERE Livre_ID = ?";
  db.get(sql, id, (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("delete", { model: row });
  });
});

// POST /delete/5
app.post("/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM Livres WHERE Livre_ID = ?";
  db.run(sql, id, err => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect("/livres");
  });
});





// POST /create
app.post("/createAbn", (req, res) => {
  const sql = "INSERT INTO Abn (Nom, Prenom, Commentaires, Numero, Addresse) VALUES (?, ?, ?, ?, ?)";
  const book = [req.body.Nom, req.body.Prenom, req.body.Commentaires, req.body.Numero, req.body.Addresse];
  db.run(sql, book, err => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect("/data");
  });
});


app.get("/editAbn/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM Abn WHERE Abn_ID = ?";
  db.get(sql, id, (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("editAbn", { model: row });
  });
});

// POST /edit/5
app.post("/editAbn/:id", (req, res) => {
  const id = req.params.id;
  const book = [req.body.Nom, req.body.Prenom, req.body.Commentaires, req.body.Numero, req.body.Addresse, id];
  const sql = "UPDATE Abn SET Nom = ?, Prenom = ?, Commentaires = ? ,Numero= ?,Addresse= ? WHERE (Abn_ID = ?)";
  db.run(sql, book, err => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect("/data");
  });
});


app.get("/deleteAbn/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM Abn WHERE Abn_ID = ?";
  db.get(sql, id, (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("deleteAbn", { model: row });
  });
});
app.post("/deleteAbn/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM Abn WHERE Abn_ID = ?";
  db.run(sql, id, err => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect("/data");
  });
});


app.get("/prets", (req, res) => {
  // Récupérer et afficher la liste des prêts
  const sql_fetchPrets = `
    SELECT Prets.Pret_ID, Prets.Abn_ID, Abn.Nom AS Abn_Nom, Abn.Prenom AS Abn_Prenom,
           Prets.Livre_ID, Livres.Titre AS Livre_Titre, Prets.DatePret
    FROM Prets
    LEFT JOIN Abn ON Prets.Abn_ID = Abn.Abn_ID
    LEFT JOIN Livres ON Prets.Livre_ID = Livres.Livre_ID;
  `;

  db.all(sql_fetchPrets, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Erreur serveur");
    }
    res.render("prets", { model: rows });
  });
});

app.get("/createPret", (req, res) => {
  // Afficher le formulaire pour enregistrer un nouveau prêt

  // Fetch available Abns and Livres for dropdown menus
  const sql_fetchAbns = `SELECT Abn_ID, Nom, Prenom FROM Abn;`;
  const sql_fetchLivres = `SELECT Livre_ID, Titre FROM Livres;`;

  db.all(sql_fetchAbns, [], (err, abns) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Erreur serveur");
    }

    db.all(sql_fetchLivres, [], (err, livres) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send("Erreur serveur");
      }

      res.render("createPret", { model: {}, availableAbns: abns, availableLivres: livres });
    });
  });
});



// GET /editPret/1
app.get("/editPret/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM Prets WHERE (Pret_ID = ?)";
  db.get(sql, id, (err, row) => {
    if (err) {c
      return console.error(err.message);
    }
    res.render("editPret", { model: row });
  });
});

// POST /editPret/1
app.post("/editPret/:id", (req, res) => {
  const id = req.params.id;
  const pret = [req.body.Abn_ID, req.body.Livre_ID, req.body.DatePret,  id];
  const sql = "UPDATE Prets SET Abn_ID = ?, Livre_ID = ?, DatePret = ?  WHERE (Pret_ID = ?)";
  db.run(sql, pret, err => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect("/prets");
  });
});


// GET /deletePret/1
app.get("/deletePret/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM Prets WHERE Pret_ID = ?";
  db.get(sql, id, (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("deletePret", { model: row });
  });
});
// POST /deletePret/1
app.post("/deletePret/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM Prets WHERE Pret_ID = ?";
  db.run(sql, id, err => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect("/prets");
  });
});


// GET /livresEmpruntes
app.get("/livresEmpruntes", (req, res) => {
  const sql = `
    SELECT Prets.*, Livres.Titre, Abn.Nom AS NomAbonne, Abn.Prenom AS PrenomAbonne
    FROM Prets
    JOIN Livres ON Prets.Livre_ID = Livres.Livre_ID
    JOIN Abn ON Prets.Abn_ID = Abn.Abn_ID
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Erreur serveur");
    }
    res.render("livresEmpruntes", { model: rows });
  });
});


// GET /emprunteurs
app.get("/emprunteurs", (req, res) => {
  const sql = `
    SELECT Abn.*, GROUP_CONCAT(Livres.Titre, ', ') AS LivresEmpruntes
    FROM Abn
    LEFT JOIN Prets ON Abn.Abn_ID = Prets.Abn_ID
    LEFT JOIN Livres ON Prets.Livre_ID = Livres.Livre_ID
    GROUP BY Abn.Abn_ID
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Erreur serveur");
    }
    res.render("emprunteurs", { model: rows });
  });
});

// GET /livres
app.get("/livres", (req, res) => {
  const sql = `
    SELECT Livres.*, 
           COUNT(Prets.Pret_ID) AS NbrEmpruntes,
           Livres.NbrExemplaire - COUNT(Prets.Pret_ID) AS NombreDisponibles
    FROM Livres
    LEFT JOIN Prets ON Livres.Livre_ID = Prets.Livre_ID
    GROUP BY Livres.Livre_ID
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Erreur serveur");
    }
    res.render("livres", { model: rows });
  });
});


app.get("/createPret", (req, res) => {
  // Afficher le formulaire pour enregistrer un nouveau prêt

  // Fetch available Abns and Livres for dropdown menus
  const sql_fetchAbns = `SELECT Abn_ID, Nom, Prenom FROM Abn;`;
  const sql_fetchLivres = `SELECT Livre_ID, Titre FROM Livres;`;

  db.all(sql_fetchAbns, [], (err, abns) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Erreur serveur");
    }

    db.all(sql_fetchLivres, [], (err, livres) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send("Erreur serveur");
      }

      res.render("createPret", { model: {}, availableAbns: abns, availableLivres: livres });
    });
  });
});

app.post("/createPret", (req, res) => {
  const livreID = req.body.Livre_ID;

  // Vérifie si le livre est disponible
  const checkDisponibilite = `
    SELECT (Livres.NbrExemplaire - COUNT(Prets.Pret_ID)) AS NombreDisponibles
    FROM Livres
    LEFT JOIN Prets ON Livres.Livre_ID = Prets.Livre_ID
    WHERE Livres.Livre_ID = ? AND Prets.Pret_ID IS NULL
  `;

  db.get(checkDisponibilite, [livreID], (err, row) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Erreur serveur");
    }

    const nombreDisponibles = row ? row.NombreDisponibles : 0;

    if (nombreDisponibles > 0) {
      // Le livre est disponible, procéder à l'emprunt
      const sql_insertPret = "INSERT INTO Prets (Abn_ID, Livre_ID, DatePret) VALUES (?, ?, ?)";
      const pret = [req.body.Abn_ID, req.body.Livre_ID, req.body.DatePret];
      
      db.run(sql_insertPret, pret, (err) => {
        if (err) {
          console.error(err.message);
          return res.status(500).send("Erreur serveur");
        }

        res.redirect("/prets");
      });
    } else {
        res.redirect("/livrend");
    }
  });
});



