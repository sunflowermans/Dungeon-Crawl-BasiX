export async function rest() {
    window.pr.api.set("rest", 6);

    let chatData = {
        user: game.user._id,
        speaker: ChatMessage.getSpeaker(),
        content: "<span style='color:OliveDrab'>The party rests...</span>"
    };
    chatData.speaker.alias = 'Turn tracker';
    ChatMessage.create(chatData, {});
}