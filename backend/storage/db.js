const sqlite3 = require('sqlite3').verbose();

const path = require('node:path');
const db = new sqlite3.Database(path.join(__dirname, 'bmi_database.db'), (err) => {
  if (err) {
    console.error('Could not connect to database', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS slots (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            time TEXT NOT NULL,
            booked INTEGER DEFAULT 0
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS appointments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_name TEXT NOT NULL,
            user_email TEXT NOT NULL,
            slot_id INTEGER NOT NULL,
            paid INTEGER DEFAULT 0,
            FOREIGN KEY(slot_id) REFERENCES slots(id)
        )
    `);
});

function addSlot(time, callback) {
    db.run("INSERT INTO slots (time) VALUES (?)", [time], callback);
};

function getAvailableSlots(callback){
  db.all('SELECT * FROM slots WHERE booked = 0', [], callback);
}

function bookAppointment(user_name, user_email, slot_id, callback) {
  db.run(
    'INSERT INTO appointments (user_name, user_email, slot_id) VALUES(?,?,?)',
    [user_name, user_email, slot_id],
    function(err) {
      if (err) {
        return callback(err);
      }
      db.run(
        'UPDATE slots SET booked = 1 WHERE id = ?',
        [slot_id],
        callback
      );
    }
  );
}

module.exports = {
  db,
  addSlot,
  getAvailableSlots,
  bookAppointment
};

