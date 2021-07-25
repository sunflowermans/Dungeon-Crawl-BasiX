let unitsPassing = 10;
let timeGone = false;
let maxTime = 60;
let encounterUnits = 20;
let encounterRoll = false;
let needRest = false;
let expiringResources = [];
let expiringMessage = "";
let makeRest = true;
let makeEncounter = true;
let makeHour = true;

let resource_list = window.pr.api.get('resource_list') || [];

//todo: update the resource_list once per script execution. Group all adds and removes.

let removeResources = function(expiringList, list) {
    expiringList.forEach((name)=>{
      if(!list.includes(name)) return
      list.splice(list.indexOf(name), 1)
    });
    window.pr.api.set('resource_list', list)
}

let addResource = function(name, options, list) {
list.push(name)
window.pr.api.set('resource_list', list)

window.pr.api.register(name);
window.pr.api.register(name.concat('_name'));
window.pr.api.register(name.concat('_visible'), { default: true });
window.pr.api.register(name.concat('_max'));
window.pr.api.register(name.concat('_min'));
window.pr.api.register(name.concat('_player_managed'), { default: false });

window.pr.api.set(name, options.value);
window.pr.api.set(name.concat('_name'), name);
window.pr.api.set(name.concat('_visible'), options.visible);
window.pr.api.set(name.concat('_max'), options.max);
window.pr.api.set(name.concat('_min'), options.min);
window.pr.api.set(name.concat('_player_managed'), options.player_managed);

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
visible: false
}

let restOptions = {
value: 60,
max: 60,
min: 0,
player_managed: false,
visible: true
}

let hourOptions = {
value: 60,
max: 60,
min: 0,
player_managed: false,
visible: true
}

if(makeEncounter) {
addResource('encounter', encounterOptions, window.pr.api.get('resource_list'))
}

if(makeRest) {
addResource('rest', restOptions, window.pr.api.get('resource_list'))
}

if(makeHour) {
addResource('hour', hourOptions, window.pr.api.get('resource_list'))
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

let list = window.pr.api.get('resource_list') || [];
removeResources(expiringResources, list);

let timeRemaining = window.pr.api.get("hour");
if(timeRemaining <= unitsPassing){
  timeGone = true;
  window.pr.api.set("hour", maxTime);
 timeRemaining -= unitsPassing
} else {
  window.pr.api.decrement("hour", unitsPassing);
  timeRemaining -= unitsPassing; //api too slow not to do this
}

let message = "<span style='color:green'>10 minutes have passed... " + timeRemaining + " minutes left in the hour</span>";
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