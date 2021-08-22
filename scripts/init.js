import { advanceTurn } from './advanceTurn.js';
import { rest } from './actions/rest.js';
import { MODULE_NAME } from './constants/names.js';
import { RESOURCES_FUNCS } from "./constants/resources.js";
import ModuleSettings from "./ModuleSettings.js";

Hooks.once('init', function() {
    console.log(MODULE_NAME + ' initialized!');
    window.dcbx = {
      version: game.modules.get(MODULE_NAME).data.version,
      add: RESOURCES_FUNCS,
      advanceTurn,
      rest,
    }
  
    ModuleSettings.register();
  })

Hooks.on("ready", function() {
  console.log(MODULE_NAME + ' and game data ready!');
});