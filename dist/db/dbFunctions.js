"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addBooking = void 0;
const db_1 = require("./db");
const mongodb_1 = require("mongodb");
const addBooking = (userId, fullName, day, time) => __awaiter(void 0, void 0, void 0, function* () {
    const db = db_1.client.db('botdb');
    const bookings = db.collection('bookings');
    try {
        const result = yield bookings.insertOne({
            userId,
            fullName,
            day,
            time,
            createdAt: new Date(),
        });
        // Use the insertedId to retrieve the inserted document
        const insertedBooking = yield bookings.findOne({ _id: new mongodb_1.ObjectId(result.insertedId) });
        return insertedBooking; // Возвращаем добавленный документ
    }
    catch (err) {
        console.error('Error adding booking:', err);
        throw err;
    }
});
exports.addBooking = addBooking;
