const express = require("express");
const router = express.Router();
const pool = require("../config/db");

const USE_MOCK = true;

const productosMock = [
  { id: 1, titulo: "Thriller", artista: "Michael Jackson", precio: 24.99, imagen: "https://placehold.co/400x400/1b1b1b/ffffff?text=Thriller" },
  { id: 2, titulo: "Back in Black", artista: "AC/DC", precio: 22.50, imagen: "https://placehold.co/400x400/1b1b1b/ffffff?text=Back+in+Black" },
  { id: 3, titulo: "The Dark Side of the Moon", artista: "Pink Floyd", precio: 27.99, imagen: "https://placehold.co/400x400/1b1b1b/ffffff?text=Dark+Side+of+the+Moon" },
  { id: 4, titulo: "Abbey Road", artista: "The Beatles", precio: 26.00, imagen: "https://placehold.co/400x400/1b1b1b/ffffff?text=Abbey+Road" },
  { id: 5, titulo: "Rumours", artista: "Fleetwood Mac", precio: 23.75, imagen: "https://placehold.co/400x400/1b1b1b/ffffff?text=Rumours" },
  { id: 6, titulo: "Nevermind", artista: "Nirvana", precio: 21.99, imagen: "https://placehold.co/400x400/1b1b1b/ffffff?text=Nevermind" },
  { id: 7, titulo: "Purple Rain", artista: "Prince", precio: 25.50, imagen: "https://placehold.co/400x400/1b1b1b/ffffff?text=Purple+Rain" },
  { id: 8, titulo: "Hotel California", artista: "Eagles", precio: 24.00, imagen: "https://placehold.co/400x400/1b1b1b/ffffff?text=Hotel+California" },
  { id: 9, titulo: "Born to Run", artista: "Bruce Springsteen", precio: 22.99, imagen: "https://placehold.co/400x400/1b1b1b/ffffff?text=Born+to+Run" },
  { id: 10, titulo: "Legend", artista: "Bob Marley & The Wailers", precio: 20.99, imagen: "https://placehold.co/400x400/1b1b1b/ffffff?text=Legend" },
  { id: 11, titulo: "Led Zeppelin IV", artista: "Led Zeppelin", precio: 26.50, imagen: "https://placehold.co/400x400/1b1b1b/ffffff?text=Led+Zeppelin+IV" },
  { id: 12, titulo: "The Wall", artista: "Pink Floyd", precio: 29.99, imagen: "https://placehold.co/400x400/1b1b1b/ffffff?text=The+Wall" },
  { id: 13, titulo: "Appetite for Destruction", artista: "Guns N Roses", precio: 23.99, imagen: "https://placehold.co/400x400/1b1b1b/ffffff?text=Appetite+for+Destruction" },
  { id: 14, titulo: "Songs in the Key of Life", artista: "Stevie Wonder", precio: 25.00, imagen: "https://placehold.co/400x400/1b1b1b/ffffff?text=Songs+in+the+Key+of+Life" },
  { id: 15, titulo: "Blue", artista: "Joni Mitchell", precio: 22.25, imagen: "https://placehold.co/400x400/1b1b1b/ffffff?text=Blue" },
  { id: 16, titulo: "Ok Computer", artista: "Radiohead", precio: 24.50, imagen: "https://placehold.co/400x400/1b1b1b/ffffff?text=OK+Computer" },
  { id: 17, titulo: "Rumours of Glory", artista: "Bruce Cockburn", precio: 19.99, imagen: "https://placehold.co/400x400/1b1b1b/ffffff?text=Rumours+of+Glory" },
  { id: 18, titulo: "Like a Prayer", artista: "Madonna", precio: 21.50, imagen: "https://placehold.co/400x400/1b1b1b/ffffff?text=Like+a+Prayer" },
  { id: 19, titulo: "Graceland", artista: "Paul Simon", precio: 23.00, imagen: "https://placehold.co/400x400/1b1b1b/ffffff?text=Graceland" },
  { id: 20, titulo: "The Chronic", artista: "Dr. Dre", precio: 24.99, imagen: "https://placehold.co/400x400/1b1b1b/ffffff?text=The+Chronic" },
  { id: 21, titulo: "Automatic for the People", artista: "R.E.M.", precio: 22.75, imagen: "https://placehold.co/400x400/1b1b1b/ffffff?text=Automatic+for+the+People" },
  { id: 22, titulo: "Kind of Blue", artista: "Miles Davis", precio: 26.99, imagen: "https://placehold.co/400x400/1b1b1b/ffffff?text=Kind+of+Blue" },
  { id: 23, titulo: "Random Access Memories", artista: "Daft Punk", precio: 27.50, imagen: "https://placehold.co/400x400/1b1b1b/ffffff?text=Random+Access+Memories" },
  { id: 24, titulo: "21", artista: "Adele", precio: 23.50, imagen: "https://placehold.co/400x400/1b1b1b/ffffff?text=21" },
  { id: 25, titulo: "Currents", artista: "Tame Impala", precio: 22.00, imagen: "https://placehold.co/400x400/1b1b1b/ffffff?text=Currents" }
];

router.get("/productos", async (req, res) => {
  if (USE_MOCK) {
    return res.json(productosMock);
  }

  try {
    const [rows] = await pool.query("SELECT id, titulo, artista, precio, imagen FROM vinilos");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al obtener los productos" });
  }
});

module.exports = router;