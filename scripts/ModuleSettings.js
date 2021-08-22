import { MODULE_NAME } from './constants/names.js';
import { SETTINGS } from './constants/settings.js';

export default class ModuleSettings {
    static add(key, data = {}) {
      const defaults = {
        scope: 'world',
        config: true
      }
  
      game.settings.register(MODULE_NAME, key, Object.assign(defaults, data))
    }
  
    static get(key) {
      return game.settings.get(MODULE_NAME, key)
    }
  
    static register() {
        for (const [key, setting] of Object.entries(SETTINGS)) {
            this.add(setting.settingName, setting);
        };        
    }
}