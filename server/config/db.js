const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '../local_db.json');

const readDB = () => {
    try {
        if (!fs.existsSync(dbPath)) {
            fs.writeFileSync(dbPath, JSON.stringify({
                users: [],
                quizzes: [],
                gamesessions: [],
                results: []
            }, null, 2));
        }
        return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    } catch (e) {
        return { users: [], quizzes: [], gamesessions: [], results: [] };
    }
};

const writeDB = (data) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// Collection name override: model 'Quiz' stores in 'quizzes' (not 'quizs')
const collectionName = (modelName) => {
    const lower = modelName.toLowerCase();
    if (lower === 'quiz') return 'quizzes';
    return lower + 's';
};

const getCollection = (modelName) => {
    const name = collectionName(modelName);
    const db = readDB();
    // fallback: migrate legacy 'quizs' key to 'quizzes' on the fly
    if (name === 'quizzes' && !db.quizzes && db.quizs) {
        db.quizzes = db.quizs;
    }
    return db[name] || [];
};

const saveCollection = (modelName, docs) => {
    const name = collectionName(modelName);
    const db = readDB();
    db[name] = docs;
    writeDB(db);
};

const matchQuery = (item, query) => {
    if (!query) return true;
    for (const key of Object.keys(query)) {
        let qVal = query[key];
        let itemVal = item[key];

        // If the document field is missing/undefined and query expects true,
        // treat the absence as the truthy default (e.g. isActive not stored → treat as true)
        if (itemVal === undefined && qVal === true) continue;
        
        if (qVal && typeof qVal === 'object' && !Array.isArray(qVal)) {
            if ('$ne' in qVal) {
                if (itemVal === qVal['$ne']) return false;
            } else if ('$in' in qVal) {
                if (!qVal['$in'].includes(itemVal)) return false;
            }
        } else {
            if (qVal && itemVal && (typeof qVal === 'object' || typeof itemVal === 'object')) {
                if (qVal.toString() !== itemVal.toString()) return false;
            } else if (itemVal !== qVal) {
                return false;
            }
        }
    }
    return true;
};

class MockQuery {
    constructor(modelName, data, isArray) {
        this.modelName = modelName;
        this.data = JSON.parse(JSON.stringify(data));
        this.isArray = isArray;
    }

    populate(pathName, fields) {
        if (!this.data) return this;
        
        const populateItem = (item) => {
            if (pathName === 'createdBy' && item.createdBy) {
                const userId = item.createdBy.toString();
                const users = getCollection('User');
                const user = users.find(u => u._id === userId);
                if (user) {
                    const cleanUser = { ...user };
                    delete cleanUser.password;
                    item.createdBy = cleanUser;
                }
            } else if (pathName === 'quizId' && item.quizId) {
                const quizId = item.quizId.toString();
                const quizzes = getCollection('Quiz');
                const quiz = quizzes.find(q => q._id === quizId);
                if (quiz) {
                    item.quizId = { ...quiz };
                }
            } else if (pathName === 'hostId' && item.hostId) {
                const hostId = item.hostId.toString();
                const users = getCollection('User');
                const user = users.find(u => u._id === hostId);
                if (user) {
                    const cleanUser = { ...user };
                    delete cleanUser.password;
                    item.hostId = cleanUser;
                }
            }
        };

        if (this.isArray) {
            this.data.forEach(populateItem);
        } else {
            populateItem(this.data);
        }
        return this;
    }

    select(fields) {
        if (!this.data) return this;
        if (typeof fields !== 'string') return this;
        
        const fieldsArr = fields.split(' ').filter(Boolean);
        if (fieldsArr.length === 0) return this;

        const exclude = fieldsArr.some(f => f.startsWith('-'));
        const filterItem = (item) => {
            const newItem = {};
            if (exclude) {
                const excludedKeys = fieldsArr.map(f => f.replace('-', ''));
                Object.keys(item).forEach(k => {
                    if (!excludedKeys.includes(k)) {
                        newItem[k] = item[k];
                    }
                });
            } else {
                fieldsArr.forEach(f => {
                    if (item[f] !== undefined) {
                        newItem[f] = item[f];
                    }
                });
                newItem._id = item._id;
            }
            return newItem;
        };

        if (this.isArray) {
            this.data = this.data.map(filterItem);
        } else {
            this.data = filterItem(this.data);
        }
        return this;
    }

    sort(criteria) {
        if (!this.data || !this.isArray) return this;
        let field = '';
        let direction = 1;
        if (typeof criteria === 'string') {
            if (criteria.startsWith('-')) {
                field = criteria.substring(1);
                direction = -1;
            } else {
                field = criteria;
                direction = 1;
            }
        } else if (typeof criteria === 'object') {
            const keys = Object.keys(criteria);
            if (keys.length > 0) {
                field = keys[0];
                direction = criteria[field] === -1 ? -1 : 1;
            }
        }

        if (field) {
            this.data.sort((a, b) => {
                const valA = a[field];
                const valB = b[field];
                if (valA < valB) return -1 * direction;
                if (valA > valB) return 1 * direction;
                return 0;
            });
        }
        return this;
    }

    limit(n) {
        if (this.data && this.isArray) {
            this.data = this.data.slice(0, n);
        }
        return this;
    }

    async then(onFulfilled, onRejected) {
        try {
            const wrapped = this.isArray
                ? this.data.map(item => wrapDocument(item, this.modelName))
                : (this.data ? wrapDocument(this.data, this.modelName) : null);
            return Promise.resolve(wrapped).then(onFulfilled, onRejected);
        } catch (err) {
            return Promise.reject(err).catch(onRejected);
        }
    }
}

function wrapDocument(doc, modelName) {
    if (!doc) return null;
    const wrapped = JSON.parse(JSON.stringify(doc));
    wrapped.id = wrapped._id;
    wrapped._id = {
        toString: () => wrapped.id,
        valueOf: () => wrapped.id,
        toJSON: () => wrapped.id
    };
    wrapped.isModified = () => false;

    if (modelName === 'User') {
        wrapped.comparePassword = async function(enteredPassword) {
            return await bcrypt.compare(enteredPassword, this.password);
        };
    }

    wrapped.save = async function() {
        if (modelName === 'User' && this.password && !this.password.startsWith('$2a$')) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
        
        const collection = getCollection(modelName);
        const idx = collection.findIndex(item => item._id === this.id);
        
        const plainData = {};
        Object.keys(this).forEach(k => {
            if (k === '_id') {
                plainData._id = this.id;
            } else if (typeof this[k] !== 'function') {
                plainData[k] = this[k];
            }
        });
        
        if (idx !== -1) {
            collection[idx] = plainData;
        } else {
            collection.push(plainData);
        }
        
        saveCollection(modelName, collection);
        return this;
    };

    return wrapped;
}

const setupMockMongoose = () => {
    readDB();

    mongoose.Types = mongoose.Types || {};
    mongoose.Types.ObjectId = function() {
        const id = Math.random().toString(36).substring(2, 11) + Math.random().toString(36).substring(2, 11);
        return {
            toString: () => id,
            valueOf: () => id,
            toJSON: () => id
        };
    };
    mongoose.Types.ObjectId.isValid = (id) => typeof id === 'string';

    mongoose.connect = async () => {
        return { connection: { host: 'local-file-db' } };
    };

    mongoose.Model.find = function(query) {
        const collection = getCollection(this.modelName);
        const results = collection.filter(item => matchQuery(item, query));
        return new MockQuery(this.modelName, results, true);
    };

    mongoose.Model.findOne = function(query) {
        const collection = getCollection(this.modelName);
        const result = collection.find(item => matchQuery(item, query)) || null;
        return new MockQuery(this.modelName, result, false);
    };

    mongoose.Model.findById = function(id) {
        const collection = getCollection(this.modelName);
        const result = collection.find(item => item._id === (id ? id.toString() : '')) || null;
        return new MockQuery(this.modelName, result, false);
    };

    mongoose.Model.create = async function(data) {
        const collection = getCollection(this.modelName);
        const plainData = Array.isArray(data) ? data : [data];
        const createdDocs = [];

        for (const item of plainData) {
            const doc = { 
                _id: Math.random().toString(36).substring(2, 11) + Math.random().toString(36).substring(2, 11),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                ...item 
            };
            
            if (this.modelName === 'User' && doc.password) {
                const salt = await bcrypt.genSalt(10);
                doc.password = await bcrypt.hash(doc.password, salt);
            }
            
            collection.push(doc);
            createdDocs.push(doc);
        }

        saveCollection(this.modelName, collection);
        
        const wrappedDocs = createdDocs.map(d => wrapDocument(d, this.modelName));
        return Array.isArray(data) ? wrappedDocs : wrappedDocs[0];
    };

    mongoose.Model.updateMany = async function(query, update) {
        const collection = getCollection(this.modelName);
        let matchedCount = 0;
        
        const updatedCollection = collection.map(item => {
            if (matchQuery(item, query)) {
                matchedCount++;
                const newItem = { ...item };
                if (update.$set) {
                    Object.assign(newItem, update.$set);
                } else {
                    Object.assign(newItem, update);
                }
                newItem.updatedAt = new Date().toISOString();
                return newItem;
            }
            return item;
        });

        saveCollection(this.modelName, updatedCollection);
        return { matchedCount, modifiedCount: matchedCount };
    };

    mongoose.Model.findByIdAndUpdate = async function(id, update, options) {
        const collection = getCollection(this.modelName);
        const idx = collection.findIndex(item => item._id === (id ? id.toString() : ''));
        if (idx === -1) return null;

        const item = collection[idx];
        const newItem = { ...item };
        
        if (update.$set) {
            Object.assign(newItem, update.$set);
        } else {
            Object.assign(newItem, update);
        }
        newItem.updatedAt = new Date().toISOString();
        collection[idx] = newItem;
        saveCollection(this.modelName, collection);

        return wrapDocument(options?.new ? newItem : item, this.modelName);
    };

    mongoose.Model.findOneAndUpdate = async function(query, update, options) {
        const collection = getCollection(this.modelName);
        let idx = -1;
        
        if (this.modelName === 'GameSession') {
            const pinVal = query.pin;
            const statusVal = query.status;
            
            idx = collection.findIndex(item => {
                if (item.pin !== pinVal) return false;
                if (statusVal && item.status !== statusVal) return false;
                
                if ('players.name' in query) {
                    const notCond = query['players.name'];
                    if (notCond && notCond.$not instanceof RegExp) {
                        const hasMatchingPlayer = item.players.some(p => notCond.$not.test(p.name));
                        if (hasMatchingPlayer) return false;
                    }
                }
                
                if (query.players && query.players.$elemMatch) {
                    const match = query.players.$elemMatch;
                    const nameRegex = match.name?.$regex;
                    const neVal = match['answers.questionIndex']?.$ne;
                    
                    const hasPlayer = item.players.some(p => {
                        const nameMatches = nameRegex ? nameRegex.test(p.name) : true;
                        const notAnswered = neVal !== undefined 
                            ? !p.answers.some(ans => ans.questionIndex === neVal) 
                            : true;
                        return nameMatches && notAnswered;
                    });
                    if (!hasPlayer) return false;
                }
                
                return true;
            });
        } else {
            idx = collection.findIndex(item => matchQuery(item, query));
        }

        if (idx === -1) return null;

        const item = collection[idx];
        const newItem = JSON.parse(JSON.stringify(item));

        if (update.$push) {
            for (const key of Object.keys(update.$push)) {
                const pushVal = update.$push[key];
                if (key === 'players') {
                    newItem.players = newItem.players || [];
                    newItem.players.push(pushVal);
                } else if (key.startsWith('players.$.')) {
                    let playerName = '';
                    if (query.players && query.players.$elemMatch && query.players.$elemMatch.name) {
                        const nameObj = query.players.$elemMatch.name;
                        if (nameObj.$regex instanceof RegExp) {
                            const pattern = nameObj.$regex.source;
                            playerName = pattern.replace(/^\^|\$$/g, '').replace(/\\(.)/g, '$1');
                        } else if (typeof nameObj === 'string') {
                            playerName = nameObj;
                        }
                    }
                    
                    const playerIdx = newItem.players.findIndex(p => p.name.toLowerCase() === playerName.toLowerCase());
                    if (playerIdx !== -1) {
                        const subKey = key.replace('players.$.', '');
                        if (subKey === 'answers') {
                            newItem.players[playerIdx].answers = newItem.players[playerIdx].answers || [];
                            newItem.players[playerIdx].answers.push(pushVal);
                        }
                    }
                }
            }
        }
        
        if (update.$inc) {
            for (const key of Object.keys(update.$inc)) {
                const incVal = update.$inc[key];
                if (key.startsWith('players.$.')) {
                    let playerName = '';
                    if (query.players && query.players.$elemMatch && query.players.$elemMatch.name) {
                        const nameObj = query.players.$elemMatch.name;
                        if (nameObj.$regex instanceof RegExp) {
                            const pattern = nameObj.$regex.source;
                            playerName = pattern.replace(/^\^|\$$/g, '').replace(/\\(.)/g, '$1');
                        } else if (typeof nameObj === 'string') {
                            playerName = nameObj;
                        }
                    }
                    
                    const playerIdx = newItem.players.findIndex(p => p.name.toLowerCase() === playerName.toLowerCase());
                    if (playerIdx !== -1) {
                        const subKey = key.replace('players.$.', '');
                        if (subKey === 'totalScore') {
                            newItem.players[playerIdx].totalScore = (newItem.players[playerIdx].totalScore || 0) + incVal;
                        }
                    }
                }
            }
        }

        if (update.$set) {
            Object.assign(newItem, update.$set);
        } else if (!update.$push && !update.$inc) {
            Object.assign(newItem, update);
        }

        newItem.updatedAt = new Date().toISOString();
        collection[idx] = newItem;
        saveCollection(this.modelName, collection);

        return wrapDocument(options?.new ? newItem : item, this.modelName);
    };

    mongoose.Model.findByIdAndDelete = async function(id) {
        const collection = getCollection(this.modelName);
        const idx = collection.findIndex(item => item._id === (id ? id.toString() : ''));
        if (idx === -1) return null;

        const item = collection[idx];
        collection.splice(idx, 1);
        saveCollection(this.modelName, collection);
        return wrapDocument(item, this.modelName);
    };

    mongoose.Model.prototype.save = async function() {
        const modelName = this.constructor.modelName;
        
        if (modelName === 'User' && this.password && !this.password.startsWith('$2a$')) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }

        const collection = getCollection(modelName);
        const idStr = this._id ? this._id.toString() : '';
        const idx = collection.findIndex(item => item._id === idStr);
        
        const plainData = {};
        Object.keys(this.toObject ? this.toObject() : this).forEach(k => {
            if (k === '_id') {
                plainData._id = idStr;
            } else if (typeof this[k] !== 'function') {
                plainData[k] = this[k];
            }
        });
        
        if (idx !== -1) {
            collection[idx] = plainData;
        } else {
            collection.push(plainData);
        }
        
        saveCollection(modelName, collection);
        return this;
    };
};

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 3000
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`MongoDB Connection Error: ${error.message}`);
        console.log(`⚠️ Falling back to Local File Database (local_db.json) to ensure the server works properly!`);
        setupMockMongoose();
    }
};

module.exports = connectDB;