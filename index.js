const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql");
const bcrypt = require("bcrypt");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "12345",
  database: "covid19",
  connectionLimit: 100,
});

app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// api member
app.get("/api/member", (req, res) => {
  const query = "SELECT * FROM member";
  db.query(query, (err, result) => {
    res.send(result);
  });
});

app.get("/api/member/:id", (req, res) => {
  const id = req.params.id;
  const query = "SELECT * FROM member WHERE id_member = ?";
  db.query(query, id, (err, result) => {
    res.send(result);
  });
});

app.post("/api/member/add", async (req, res) => {
  const { name, password, phone, gender, place, date, address, email, status } =
    req.body;
  const hash = await bcrypt.hash(password, 10);
  const query =
    "INSERT INTO member (nama_member, password, jenis_kelamin, tempat_lahir, tanggal_lahir, alamat, email, nomor_hp, status) VALUES (?,?,?,?,?,?,?,?,?)";
  db.query(
    query,
    [name, hash, gender, place, date, address, email, phone, status],
    (err, result) => {
      res.send(result);
    }
  );
});

app.delete("/api/member/delete/:id", (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM member WHERE id_member = ?";
  db.query(query, id, (err, result) => {
    res.send(result);
  });
});

app.put("/api/member/edit/:id", async (req, res) => {
  const { name, phone, gender, place, date, address, email } = req.body;
  const id = req.params.id;
  const query =
    "UPDATE member SET nama_member = ?, jenis_kelamin = ?, tempat_lahir = ?, tanggal_lahir = ?, alamat = ?, email = ?, nomor_hp = ? WHERE id_member = '" +
    id +
    "'";
  db.query(
    query,
    [name, gender, place, date, address, email, phone],
    (err, result) => {
      res.send(result);
    }
  );
});

app.put("/api/member/status/:id", (req, res) => {
  const { status } = req.body;
  const id = req.params.id;
  const query = "UPDATE member SET status = ? WHERE id_member = '" + id + "'";
  db.query(query, status, (err, result) => {
    res.send(result);
  });
});

app.put("/api/member/img-profile/:id", (req, res) => {
  const { image } = req.body;
  const id = req.params.id;
  const query = "UPDATE member SET foto_profil = ? WHERE id_member = ?";
  db.query(query, [image, id], (err, result) => {
    res.send(result);
  });
});

app.put("/api/admin/img-profile/:id", (req, res) => {
  const { image } = req.body;
  const id = req.params.id;
  const query = "UPDATE admin SET foto_profil = ? WHERE id_admin = ?";
  db.query(query, [image, id], (err, result) => {
    res.send(result);
  });
});

// api riwayat
app.get("/api/history", (req, res) => {
  const query = "SELECT * FROM riwayat";
  db.query(query, (err, result) => {
    res.send(result);
  });
});

app.get("/api/history/:id", (req, res) => {
  const id = req.params.id;
  const query = "SELECT * FROM riwayat WHERE id_member = ?";
  db.query(query, id, (err, result) => {
    res.send(result);
  });
});

app.delete("/api/history/delete/:id", (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM riwayat WHERE id_riwayat = ?";
  db.query(query, id, (err, result) => {
    res.send(result);
  });
});

app.put("/api/history/edit/:id", (req, res) => {
  const { date, result, percent, status } = req.body;
  const id = req.params.id;
  const query =
    "UPDATE riwayat SET tanggal_diagnosis = ?, hasil_diagnosis = ?, persentase_diagnosis = ?, status_pasien = ? WHERE id_riwayat = '" +
    id +
    "'";
  db.query(query, [date, result, percent, status], (err, result) => {
    res.send(result);
  });
});

app.post("/api/history/add", (req, res) => {
  const { id_member, diagnosa, date, id_diagnosis } = req.body;

  const query =
    "INSERT INTO riwayat (tanggal_diagnosis, diagnosa, id_member, id_diagnosis) VALUES (?,?,?,?)";
  db.query(query, [date, diagnosa, id_member, id_diagnosis], (err, result) => {
    res.send(result);
  });
});

// api diagnosis
app.get("/api/diagnosis", (req, res) => {
  const query = "SELECT * FROM diagnosis";
  db.query(query, (err, result) => {
    res.send(result);
  });
});

app.get("/api/diagnosis/:id", (req, res) => {
  const id = req.params.id;
  const query = "SELECT * FROM diagnosis WHERE id_diagnosis = ?";
  db.query(query, id, (err, result) => {
    res.send(result);
  });
});

app.delete("/api/diagnosis/delete/:id", (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM diagnosis WHERE id_diagnosis = ?";
  db.query(query, id, (err, result) => {
    res.send(result);
  });
});

app.put("/api/diagnosis/edit/:id", (req, res) => {
  const { date, result, percent, status } = req.body;
  const id = req.params.id;
  const query =
    "UPDATE diagnosis SET pertanyaan = ?, hasil_diagnosis = ? WHERE id_diagnosis = '" +
    id +
    "'";
  db.query(query, [date, result, percent, status], (err, result) => {
    res.send(result);
  });
});

app.post("/api/diagnosis/add", (req, res) => {
  const {
    indikasi,
    batuk,
    demam,
    sakitTenggorokan,
    sesakNafas,
    sakitKepala,
    result,
  } = req.body;

  const query =
    "INSERT INTO diagnosis (indikasi, batuk, demam, sakitTenggorokan, sesakNafas, sakitKepala, hasil_diagnosis) VALUES (?,?,?,?,?,?,?)";
  db.query(
    query,
    [indikasi, batuk, demam, sakitTenggorokan, sesakNafas, sakitKepala, result],
    (err, result) => {
      res.send(result);
    }
  );
});

app.get("/api/diagnosis/id", (req, res) => {
  const query =
    "SELECT id_diagnosis FROM diagnosis ORDER BY id_diagnosis DESC LIMIT 1";
  db.query(query, (err, result) => {
    res.send(result);
  });
});

// dashboard
app.get("/api/dashboard", (req, res) => {
  const query = "SELECT * FROM member ORDER BY id_member DESC LIMIT 5";
  db.query(query, (err, result) => {
    res.send(result);
  });
});

// api admin
app.get("/api/admin", (req, res) => {
  const query = "SELECT * FROM admin";
  db.query(query, (err, result) => {
    res.send(result);
  });
});

app.get("/api/admin/:id", (req, res) => {
  const id = req.params.id;
  const query = "SELECT * FROM admin WHERE id_admin = ?";
  db.query(query, id, (err, result) => {
    res.send(result);
  });
});

app.delete("/api/admin/delete/:id", (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM diagnosis WHERE id_diagnosis = ?";
  db.query(query, id, (err, result) => {
    res.send(result);
  });
});

app.put("/api/admin/edit/:id", (req, res) => {
  const { name, phone, gender, place, date, address, email } = req.body;
  const id = req.params.id;
  const query =
    "UPDATE admin SET nama_admin = ?, jenis_kelamin = ?, tempat_lahir = ?, tanggal_lahir = ?, alamat = ?, email = ?, nomor_hp = ? WHERE id_admin = '" +
    id +
    "'";
  db.query(
    query,
    [name, gender, place, date, address, email, phone],
    (err, result) => {
      res.send(result);
    }
  );
});

// api auth
app.post("/api/auth/register", async (req, res) => {
  try {
    const body = req.body;
    if (!(body.email && body.password)) {
      return res.status(400).send({ error: "Data not formatted properly" });
    }
    if (body.image) {
      const query = "INSERT INTO member (foto_profil) VALUES ? WHERE email = ?";
      db.query(query, [body.email, body.image], (err, result) => {
        console.log(result);
      });
    }
    const checkUser = "SELECT * FROM member WHERE email = ?";
    db.query(checkUser, body.email, async (err, result) => {
      if (result[0]) {
        res.status(409).json({ message: "User already exist" });
      } else {
        // generate salt to hash password
        const hash = await bcrypt.hash(body.password, 10);
        const query =
          "INSERT INTO member (nama_member, email, password) VALUES (?,?,?)";
        db.query(query, [body.name, body.email, hash], (err, result) => {
          res.send(result);
        });
      }
    });
  } catch {
    res.status(500).send();
  }
});

app.post("/api/auth/social", async (req, res) => {
  try {
    const body = req.body;
    if (!body.email) {
      return res.status(400).send({ error: "Data not formatted properly" });
    }
    if (body.image) {
      const query = "INSERT INTO member (foto_profil) VALUES ? WHERE email = ?";
      db.query(query, [body.email, body.image], (err, result) => {
        console.log(result);
      });
    }
    const checkUser = "SELECT * FROM member WHERE email = ?";
    db.query(checkUser, body.email, (err, result) => {
      // res.status(200).json({
      //   user: result[0],
      // });
      if (result[0]) {
        const data =
          "SELECT id_member, email, nama_member FROM member WHERE email = ?";
        db.query(data, [body.email], async (err, result) => {
          res.status(200).json({
            authUser: { ...result[0], role: "user" },
            message: "Success",
          });
        });
      } else {
        const query =
          "INSERT INTO member (nama_member, email,foto_profil) VALUES (?,?,?)";
        db.query(query, [body.name, body.email, body.image], (err, result) => {
          if (result[0]) {
            const data =
              "SELECT id_member, email, nama_member FROM member WHERE email = ?";
            db.query(data, [body.email], async (err, result) => {
              res.status(200).json({
                authUser: { ...result[0], role: "user" },
                message: "Success",
              });
            });
          }
        });
      }
    });
  } catch {
    res.status(500).send();
  }
});

app.put("/api/auth/change-password", async (req, res) => {
  try {
    const { password, id } = req.body;
    // generate salt to hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const query =
      "UPDATE member SET password = ? WHERE id_member = '" + id + "'";
    db.query(query, hash, (err, result) => {
      res.send(result);
    });
  } catch {
    res.status(500).send();
  }
});

app.put("/api/auth/forgot-password", async (req, res) => {
  try {
    const { password, email } = req.body;
    // generate salt to hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const query = "UPDATE member SET password = ? WHERE email = ?";
    db.query(query, [hash, email], (err, result) => {
      res.send(result);
    });
  } catch {
    res.status(500).send();
  }
});

app.put("/api/auth/admin/change-password", async (req, res) => {
  try {
    const { password, id } = req.body;
    // generate salt to hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const query = "UPDATE admin SET password = ? WHERE id_admin = '" + id + "'";
    db.query(query, hash, (err, result) => {
      res.send(result);
    });
  } catch {
    res.status(500).send();
  }
});

app.put("/api/auth/admin/forgot-password", async (req, res) => {
  try {
    const { password, email } = req.body;
    // generate salt to hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const query = "UPDATE admin SET password = ? WHERE email = '" + email + "'";
    db.query(query, hash, (err, result) => {
      res.send(result);
    });
  } catch {
    res.status(500).send();
  }
});

app.post("/api/auth/admin/register", async (req, res) => {
  try {
    const body = req.body;
    if (!(body.email && body.password)) {
      return res.status(400).send({ error: "Data not formatted properly" });
    }
    if (body.image) {
      const query = "INSERT INTO admin (foto_profil) VALUES ? WHERE email = ?";
      db.query(query, [body.email, body.image], (err, result) => {
        res.send(result);
      });
    }
    const checkUser = "SELECT * FROM admin WHERE email = ?";
    db.query(checkUser, body.email, async (err, result) => {
      if (result[0]) {
        res.status(409).json({ message: "Admin already exist" });
      } else {
        // generate salt to hash password
        const hash = await bcrypt.hash(body.password, 10);
        const query =
          "INSERT INTO admin (nama_admin, email, password) VALUES (?,?,?)";
        db.query(query, [body.name, body.email, hash], (err, result) => {
          res.send(result);
        });
      }
    });
  } catch {
    res.status(500).send();
  }
});

// login
app.post("/api/auth/login", (req, res) => {
  const body = req.body;
  const query =
    "SELECT id_member, email, nama_member FROM member WHERE email = ?";
  const userQuery = "SELECT password FROM member WHERE email = ?";
  db.query(userQuery, [body.email], async (err, result) => {
    try {
      if (await bcrypt.compare(body.password, result[0].password)) {
        db.query(query, [body.email], async (err, result) => {
          res.status(200).json({
            authUser: { ...result[0], role: "user" },
            message: "Success",
          });
        });
      } else {
        res.status(401).json({ message: "Invalid Password" });
      }
    } catch {
      res.status(401).json({ message: "User does not exist" });
    }
  });
});

app.post("/api/auth/admin/login", async (req, res) => {
  const body = req.body;
  const query = "SELECT id_admin, email, nama_admin FROM admin WHERE email = ?";
  const userQuery = "SELECT password FROM admin WHERE email = ?";
  db.query(userQuery, [body.email], async (err, result) => {
    try {
      if (await bcrypt.compare(body.password, result[0].password)) {
        db.query(query, [body.email], async (err, result) => {
          res.status(200).json({
            authUser: { ...result[0], role: "admin" },
            message: "Success",
          });
        });
      } else {
        res.status(401).json({ message: "Invalid Password" });
      }
    } catch {
      res.status(401).json({ message: "User does not exist" });
    }
  });
});

app.listen(3001, () => {
  console.log("running on port 3001");
});
