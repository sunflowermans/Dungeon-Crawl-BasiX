export const lantern = () => {

  let resources = window.pr.api.get('resource_list') || [];
  let torchNumber = 1;

  resources.forEach((r)=> {
    if(r.startsWith("lantern")) {
      torchNumber++; // TODO: bug if other lanterns lit before all expire
    }
  });

  let name = "lantern_" + torchNumber;

  console.log(name);

  resources.push(name)
  window.pr.api.set('resource_list', resources)

  window.pr.api.register_resource(name);

  window.pr.api.set(name, 24);
  window.pr.api.set(name.concat('_name'), name);
  window.pr.api.set(name.concat('_visible'), true);
  window.pr.api.set(name.concat('_max'), 24);
  window.pr.api.set(name.concat('_min'), 0);
  window.pr.api.set(name.concat('_player_managed'), false);
  window.pr.api.set(name.concat('_notify_chat'), false);
}