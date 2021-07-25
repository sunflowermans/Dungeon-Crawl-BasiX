let resources = window.pr.api.get('resource_list') || [];
let torchNumber = 1;

resources.forEach((r)=> {
  if(r.startsWith("torch")) {
    torchNumber++;
   }
});

let torchName = "torch_" + torchNumber;

console.log(torchName);

resources.push(torchName)
window.pr.api.set('resource_list', resources)

window.pr.api.register_setting(torchName);
window.pr.api.register_setting(torchName.concat('_name'));
window.pr.api.register_setting(torchName.concat('_visible'), { default: true });
window.pr.api.register_setting(torchName.concat('_max'));
window.pr.api.register_setting(torchName.concat('_min'));
window.pr.api.register_setting(torchName.concat('_player_managed'), { default: false });
window.pr.api.register_setting(torchName.concat('_notify_chat'), { default: false })

window.pr.api.set(torchName, 60);
window.pr.api.set(torchName.concat('_name'), torchName);
window.pr.api.set(torchName.concat('_visible'), true);
window.pr.api.set(torchName.concat('_max'), 60);
window.pr.api.set(torchName.concat('_min'), 0);
window.pr.api.set(torchName.concat('_player_managed'), false);
window.pr.api.set(torchName.concat('_notify_chat'), false);