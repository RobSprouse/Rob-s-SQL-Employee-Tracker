import { setupConnection, setupDatabase } from "./config/connection.js";
import { optionsHandler, prompt } from "./config/optionsHandler.js";
import q from "./config/questions.js";

// TODO: Complete the following tasks:
// [x] Separate the code into separate modules
// [ ] See if there can be any more refactoring done to the code for better readability, efficiency, and/or performance
// [ ] Create code to handle deletion errors based on foreign key constraints
// [ ] Challenge the application to take in values that it shouldn't be able to handle
// [ ] Insert exits to option choices
// [ ] Add comments to the code
// [ ] Complete the README.md file

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
