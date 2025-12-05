import { readDb, writeDb } from "../../database/database.js";
import crypto from "node:crypto";

export default {
  async findAll() {
    // TODO: get ahold of the db using readDb();
    // [MODIFIED] Added implementation to read database
    const db = await readDb();

    // TODO: return the tips from the db
    // [MODIFIED] Added implementation to return tips array
    return db.tips;
  },

  async create({ title, userId }) {
    // TODO: get ahold of the db using readDb();
    // [MODIFIED] Added implementation to read database
    const db = await readDb();

    // TODO: create a tip object containing { id: "some-random-id", title, userId }
    // [MODIFIED] Added implementation to create new tip object
    const newTip = {
      id: crypto.randomUUID(),
      title,
      userId,
    };

    // TODO: push the tip object into tips list in the database
    // [MODIFIED] Added implementation to push to tips array
    db.tips.push(newTip);

    // TODO: write changes to database with await writeDb(db)
    // [MODIFIED] Added implementation to save database
    await writeDb(db);

    // TODO: return the id of the created tip
    // [MODIFIED] Added implementation to return the new ID
    return newTip.id;
  },

  async update({ id, title, userId }) {
    // TODO: get ahold of the db using readDb();
    // [MODIFIED] Added implementation to read database
    const db = await readDb();

    // TODO: find a tip in the db whose id & userId matches the incoming id & userId
    // [MODIFIED] Added implementation to find the specific tip
    const tip = db.tips.find((t) => t.id === id && t.userId === userId);

    // TODO: if there is no matching tip, return false.
    // [MODIFIED] Added check to return false if not found
    if (!tip) return false;

    // TODO: otherwise, set the found tip's title to the incoming title
    // [MODIFIED] Updated the tip title
    tip.title = title;

    // TODO: write changes to database with await writeDb(db)
    // [MODIFIED] Added implementation to save database
    await writeDb(db);

    // TODO: return true
    // [MODIFIED] Returning true for success
    return true;
  },

  async remove({ id, userId }) {
    // TODO: get ahold of the db using readDb();
    // [MODIFIED] Added implementation to read database
    const db = await readDb();

    // TODO: find the INDEX of the tip in the db whose id & userId match the incoming id & userId
    // [MODIFIED] finding index of the tip
    const index = db.tips.findIndex((t) => t.id === id && t.userId === userId);

    // TODO: if there is no index (-1), return false.
    // [MODIFIED] Return false if index is -1
    if (index === -1) return false;

    // TODO: otherwise, use splice to delete from db.tips the tip based on the index
    // [MODIFIED] Removing tip from array
    db.tips.splice(index, 1);

    // TODO: write changes to database with await writeDb(db)
    // [MODIFIED] Added implementation to save database
    await writeDb(db);

    // TODO: return true
    // [MODIFIED] Returning true for success
    return true;
  },
};