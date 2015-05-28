// assign collection to the `messages` helper in `chatBox` template
Template.chatBox.helpers({
  "messages": function() {
    return chatCollection.find();
  }
});

// generate a value for the `user` helper in `chatMessage` template
Template.chatMessage.helpers({
  "user": function() {
    if(this.userId == 'me') {
      return this.userId;
    } else if(this.userId) {
      getUsername(this.userId);
      return Session.get('user-' + this.userId);
    } else {
      return 'anonymous-' + this.subscriptionId;
    }
  }
});

Template.chatBox.events({
  "click #send": function() {
    var message = $('#chat-message').val();
    chatCollection.insert({
      userId: 'me',
      message: message
    });
    $('#chat-message').val('');

    // == HERE COMES THE CHANGE ==
    //add the message to the stream
    chatStream.emit('chat', message);
  }
});

chatStream.on('chat', function(message) {
  chatCollection.insert({
    userId: this.userId, //this is the userId of the sender
    subscriptionId: this.subscriptionId, //this is the subscriptionId of the sender
    message: message
  });
});
