window.pr.api.set("rest", 60);

let chatData = {
    user: game.user._id,
    speaker: ChatMessage.getSpeaker(),
    content: "<span style='color:OliveDrab'>The party rests...</span>"
};
ChatMessage.create(chatData, {});