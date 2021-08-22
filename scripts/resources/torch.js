import { SETTINGS } from "../constants/settings.js";
import ModuleSettings from "../ModuleSettings.js";

export const torch = () => {
  console.log(SETTINGS.TORCH_TURNS.settingName);
  const torchTurns = ModuleSettings.get(SETTINGS.TORCH_TURNS.settingName);
  let resources = window.pr.api.get('resource_list') || [];
  let torchNumber = 1;

  resources.forEach((r)=> {
    if(r.startsWith("torch")) {
      torchNumber++;
    }
  });

  let torchName = "torch_" + torchNumber;

  console.log(torchName);

  window.pr.api.register_resource(torchName);

  window.pr.api.set(torchName, torchTurns);
  window.pr.api.set(torchName.concat('_name'), torchName);
  window.pr.api.set(torchName.concat('_visible'), true);
  window.pr.api.set(torchName.concat('_max'), torchTurns);
  window.pr.api.set(torchName.concat('_min'), 0);
  window.pr.api.set(torchName.concat('_player_managed'), false);
  window.pr.api.set(torchName.concat('_notify_chat'), false);

  resources.push(torchName)
  window.pr.api.set('resource_list', resources)
}