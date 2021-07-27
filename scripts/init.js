import { MODULE_NAME } from './constants.js';
import ModuleSettings from "./settings.js";

console.log("Hello World! This code runs immediately when the file is loaded.");

Hooks.once('init', function() {
    console.log("Doing a thing, yeah! " + MODULE_NAME);
    window.dcbx = {
      version: game.modules.get(MODULE_NAME).data.version,
    }
  
    ModuleSettings.register();
    
  })

Hooks.on("ready", function() {
  console.log("This code runs once core initialization is ready and game data is available.");
});