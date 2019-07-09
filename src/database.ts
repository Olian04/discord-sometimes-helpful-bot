import path from 'path';
import { Database, verbose } from 'sqlite3';

const Sqlite3 = verbose();
const db = new Sqlite3.Database(path.join(__dirname, '..', 'database.db'));

/**
 * Internal helper function for creating & executing prepared statements in a promise like way
 * @param {string} statement - An SQL statement with question marks representing dynamic values
 * @param {any[]} values - An array of values to inject into the SQL statement in place of the questions marks
 */
const prepared = <IRow>(statement: string, values: any[]) => new Promise<IRow[]>((resolve, reject) => {
  db.serialize(() => {
    try {
      const stmt = db.prepare(statement, ...values, (_, err) => {
        if (err) {
          console.warn(err);
          reject(err);
          return;
        }
      });
      stmt.run((err) => {
        if (err) {
          console.warn(err);
          reject(err);
          return;
        }
      });
      stmt.all((err, rows: IRow[]) => {
        if (err) {
          resolve([]);
        } else {
          resolve(rows);
        }
      });
      stmt.finalize((err) => {
        if (err) {
          console.warn(err);
          reject(err);
          return;
        }
      });
    } catch (err) {
      console.warn(err);
      reject(err);
    }
  });
});

export const addEvent = async (args: { message_id: string, channel_id: string, title: string; }) => prepared(
  'INSERT INTO event ( title, message_id, channel_id ) VALUES ( ?, ?, ? )',
  [ args.title, args.message_id, args.channel_id ],
);

export const getEvent = async (args: { message_id: string, channel_id: string }) =>
  prepared<{ message_id: string, title: string }>(
    'SELECT * FROM event WHERE message_id = ? AND channel_id = ?',
    [ args.message_id, args.channel_id ],
  ).then((events) => {
    if (events.length === 0) {
      throw new Error(`Unable to find event with message_id = ${args.message_id}`);
    }
    return events[0];
  });

export const getAllEventInChannel = async (args: { channel_id: string }) =>
  prepared<{ message_id: string, channel_id: string, title: string }>(
    'SELECT * FROM event WHERE channel_id = ?',
    [ args.channel_id ],
  );

export const getAllEvents = async () =>
  prepared<{ message_id: string, channel_id: string, title: string }>('SELECT * FROM event', []);

export const addParticipant = async (args: {
    event_id: string, username: string, attendance: 'yes' | 'no' | 'maybe',
  }) => prepared(
    'INSERT INTO participant ( username, event_id, attendance ) VALUES ( ?, ?, ? )',
    [ args.username, args.event_id, args.attendance],
  );

export const updateAttendance = async (args: {
  newAttendance: 'yes' | 'no' | 'maybe', event_id: string, username: string,
}) => prepared(
  'UPDATE participant SET attendance = ? WHERE event_id = ? AND username =  ?',
  [ args.newAttendance, args.event_id, args.username ],
);

export const getParticipants = async (args: { message_id: string }) =>
  prepared<{event_id: string, username: string, attendance: 'yes' | 'no' | 'maybe'}>(
    'SELECT * FROM participant WHERE event_id = ?',
    [ args.message_id ],
  );

process.on('beforeExit', () => {
  db.close();
});
