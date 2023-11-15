// COMMENT: Required modules
import { setupConnection, setupDatabase } from "./config/connection.js";
import { optionsHandler, prompt } from "./utils/promptSwitchCases.js";
import q from "./utils/promptQuestions.js";

// COMMENT: Sets up the connection to the database and creates the database if it doesn't exist
await setupConnection();
await setupDatabase();

// COMMENT: Init function
async function init() {
     try {
          const answers = await prompt(q.options);
          await optionsHandler(answers.optionChoices);

          init();
     } catch (err) {
          console.error(err);
     }
}

init();
