const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const db = require("./connection");
const response = require("./response");

app.use(bodyParser.json());

app.get("/", (req, res) => {
  response(200, "Latian api expresjs", "Berhasil", res);
});

app.get("/siswa", (req, res) => {
  const sql = "SELECT * FROM siswa";
  db.query(sql, (err, fields) => {
    if (err) throw err;
    response(200, fields, "berhasil mendapatkan tabel siswa", res);
  });
});

app.get("/siswa/:nisn", (req, res) => {
  const nisn = req.params.nisn;
  const sql = `SELECT * FROM siswa WHERE nisn = ${nisn} `;
  db.query(sql, (err, fields) => {
    if (err) throw err;
    response(
      200,
      fields,
      `berhasil mendapatkan siswa dengan nisn = ${nisn} `,
      res
    );
  });
});

app.post("/siswa", (req, res) => {
  const { nisn, nama, kelas, alamat } = req.body;
  const sql = `INSERT INTO siswa (nisn, nama, kelas, alamat) VALUES(${nisn}, '${nama}', '${kelas}', '${alamat}')`;
  db.query(sql, (err, fields) => {
    if (err) {
      response(500, "data gagal ditambahkan", "internal server error", res);
    }
    if (fields?.affectedRows) {
      const data = {
        isSuscses: fields.affectedRows,
        id: fields.insertId,
      };
      response(200, data, "data berhasil ditambahkan", res);
    }
  });
});

app.put("/siswa", (req, res) => {
  const { nisn, nama, kelas, alamat } = req.body;
  const sql = `UPDATE siswa SET nama = '${nama}', kelas = '${kelas}', alamat =  '${alamat}' WHERE nisn = ${nisn}`;
  db.query(sql, (err, fields) => {
    if (err) throw response(500, "invalid", "error", res);
    if (fields?.affectedRows) {
      const data = {
        isSuscses: fields.affectedRows,
        message: fields.message,
      };
      response(200, data, "data berhasil di update", res);
    } else {
      response(404, "not found", "data tidak ditemukan", res);
    }
  });
});

app.delete("/siswa", (req, res) => {
  const { nisn } = req.body;
  const sql = `DELETE FROM siswa WHERE nisn = ${nisn}`;
  db.query(sql, (err, fields) => {
    if (err) response(500, "invalid", "error", res);
    if (fields?.affectedRows) {
      response(200, fields.affectedRows, "data berhasil di hapus", res);
    } else {
      response(404, "not found", "error", res);
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
