let resources = window.pr.api.get('resource_list') || [];
let torchNumber = 1;

resources.forEach((r)=> {
  if(r.startsWith("torch")) {
    torchNumber++;
   }
});

let name = "torch_" + torchNumber;

console.log(name);

resources.push(name)
window.pr.api.set('resource_list', resources)

window.pr.api.register(name);
window.pr.api.register(name.concat('_name'));
window.pr.api.register(name.concat('_visible'), { default: true });
window.pr.api.register(name.concat('_max'));
window.pr.api.register(name.concat('_min'));
window.pr.api.register(name.concat('_player_managed'), { default: false });

window.pr.api.set(name, 60);
window.pr.api.set(name.concat('_name'), name);
window.pr.api.set(name.concat('_visible'), true);
window.pr.api.set(name.concat('_max'), 60);
window.pr.api.set(name.concat('_min'), 0);
window.pr.api.set(name.concat('_player_managed'), false);