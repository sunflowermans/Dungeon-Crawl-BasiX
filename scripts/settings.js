import { MODULE_NAME } from './constants.js';

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
      game.settings.register(
        'dungeon-crawl-basixs',
        'first-time-startup-notification-shown',
        { scope: "client", config: false, type: Boolean, default: false }
      )
  
      this.add('toggle_actors_button_for_players', {
        name: 'testSetting',
        hint: 'Its a hint!',
        default: true,
        type: Boolean,
        onChange: value => ActorDirectory.collection.render('actors')
      });

    }
  }
  