export async function advanceTurn() {
  let unitsPassing = 1;
  let timeGone = false;
  let maxTime = 6;
  let encounterUnits = 2;
  let encounterRoll = false;
  let needRest = false;
  let expiringResources = [];
  let expiringMessage = "";
  let makeRest = true;
  let makeEncounter = true;
  let makeHour = true;

  let resource_list = window.pr.api.get('resource_list') || [];
  let timeRemaining = maxTime; // could be left over value and was deleted

  //todo: update the resource_list once per script execution. Group all adds and removes.

  function removeResources(expiringList, list) {
      expiringList.forEach((name)=>{
        if(!list.includes(name)) return
        list.splice(list.indexOf(name), 1)
      });
      // window.pr.api.set('resource_list', list)
  }

  async function addResource(name, options, list) {
    list.push(name)

    window.pr.api.register_resource(name);
    
    window.pr.api.set(name, options.value);
    window.pr.api.set(name.concat('_name'), name);
    window.pr.api.set(name.concat('_visible'), options.visible);
    window.pr.api.set(name.concat('_max'), options.max);
    window.pr.api.set(name.concat('_min'), options.min);
    window.pr.api.set(name.concat('_player_managed'), options.player_managed);
    window.pr.api.set(name.concat('_notify_chat'), options.notify_chat);
  }

  resource_list.forEach((rName)=>{
    if(rName.startsWith("encounter")){
      makeEncounter = false;
    } else if(rName.startsWith("rest")) {
      makeRest = false;
    } else if(rName.startsWith("hour")) {
      makeHour = false;
    }
  });

  let encounterOptions = {
  value: encounterUnits,
  max: encounterUnits,
  min: 0,
  player_managed: false,
  visible: false,
  notify_chat: false
  }

  let restOptions = {
  value: 6,
  max: 6,
  min: 0,
  player_managed: false,
  visible: true,
  notify_chat: false
  }

  let hourOptions = {
  value: maxTime,
  max: maxTime,
  min: 0,
  player_managed: false,
  visible: true,
  notify_chat: false
  }

  if(makeEncounter) {
    await addResource('encounter', encounterOptions, resource_list);
  }

  if(makeRest) {
    await addResource('rest', restOptions, resource_list);
  }

  if(makeHour) {
    await addResource('hour', hourOptions, resource_list)
  } else {
    timeRemaining = window.pr.api.get('hour');
  }

  let resources = window.pr.api.resources().resources;

  resources.forEach((r)=> {
    console.log(r.name);
    let resourceValue = window.pr.api.get(r.name);
    window.pr.api.decrement(r.name, unitsPassing);
    if(resourceValue <= unitsPassing){
      if(r.name == "rest") {
        needRest = true;
      }
      else if(r.name == "encounter") {
        encounterRoll = true;
        window.pr.api.set(r.name, encounterUnits);
      }
      else if(r.name == "hour"){
      } else {
          expiringResources.push(r.name);
          expiringMessage += r.name + ", ";
      }
    }
  });

  removeResources(expiringResources, resource_list);

  await window.pr.api.set('resource_list', resource_list);

  if(timeRemaining <= unitsPassing){
    timeGone = true;
    window.pr.api.set("hour", maxTime);
  timeRemaining -= unitsPassing
  } else {
    window.pr.api.decrement("hour", unitsPassing);
    timeRemaining -= unitsPassing; //api too slow not to do this
  }

  let message = "<span style='color:green'>10 minutes have passed... " + timeRemaining + " turns left in the hour</span>";
  if(timeGone) {
    message = "<span style='color:blue'>One hour has passed...</span>"
    AudioHelper.play({src: "sounds/lock.wav", volume: 0.8, autoplay: true, loop: false}, true);
  }

  if(needRest) {
    message += " <br><span style='color:red'>Party is needs to rest or incur penalties.</span>"
  }

  if(expiringMessage != ""){
    message += " <br><br><span style='color:red'>" + expiringMessage + " expired</span>";
  }

  let chatData = {
      user: game.user._id,
      speaker: ChatMessage.getSpeaker(),
      content: message
  };
  ChatMessage.create(chatData, {});

  let chatDataHidden = {
      user: game.user._id,
      speaker: ChatMessage.getSpeaker(),
      content: "Roll for encounter @Macro[OverloadedEncounterDie]",
      whisper: game.users.entities.filter(u => u.isGM).map(u => u._id)
  };
  if(encounterRoll) {
    ChatMessage.create(chatDataHidden , {});
  }
}