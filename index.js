import inquirer from "inquirer";
import fs from 'fs';
import { setupConnection, eventEmitter, eTracker, setupDatabase } from "./config/connection.js";

setupConnection();
setupDatabase();
