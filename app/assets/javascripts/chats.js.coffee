# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

class @ChatApp

  messageTemplate: (message, channelName = 'broadcast') ->
    """
    <div>
      <span>
        <label class='label label-#{if channelName == 'broadcast' then 'warning' else 'info'}'>
          [#{channelName}]
        </label> #{message}
      </span>
    </div>
    """
  joinTemplate: (channelName) ->
    """
    <div>
      <span>
        <label class='label label-'>
          [Joined Channel]
        </label> #{channelName}
      </span>
    </div>
    """

  constructor: (@currentChannel = undefined, @username = undefined) ->
    @dispatcher = new WebSocketRails(window.location.host + "/websocket")
    @bindEvents()

  bindEvents: ->
    @dispatcher.bind 'new_message', @new_message
    $('#send_message').click @sendMessage

  new_message: (message) =>
    $('#chat_history').append @messageTemplate(message.text)


  sendMessage: (e) =>
    e.preventDefault()
    message = $('#new_message').val()
    if @currentChannel?
      @currentChannel.trigger 'new_message', text: message, username: @username
    else
      @dispatcher.trigger 'new_message', text: message, username: @username
    $('#new_message').val('')

$(document).ready ->
  window.chatApp = new ChatApp