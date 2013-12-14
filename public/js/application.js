var ws;
var my_id = '';

window.onload = function(){
  (function(){
    var show = function(el){
      return function(msg){ el.innerHTML = msg + '<br />' + el.innerHTML; }
    }(document.getElementById('msgs'));


    ws = new WebSocket('ws://' + window.location.host + window.location.pathname);
    ws.onopen = function()  {
      show('websocket opened');
    };
    ws.onclose   = function()  { show('websocket closed'); }
    ws.onmessage = function(m) {
      var json = JSON.parse(m.data);
      switch(json.action)
      {
      case 'enter-room':
        enter_room(json.id, json.member_ids)
        break;
      case 'new-connection':
        new_connection(json.id)
        break;
      case 'user-out':
        break;
      case 'card-change':
        show(id + ' card-change: ' + json.data);
        break;
      case 'story-change':
        break;
      default:
      }
    };
  })();

  create_cards();
};

function change_card (num) {
  ws.send(JSON.stringify({
    'action': 'card-change',
    'id':     id,
    'data':   num,
  }));
}

function create_cards () {
  $cards = $('#cards')
  values = [1, 3, 5, 8]
  $.each(values, function (i, val) {
    $('<a>', {
      text: val,
      class: 'btn btn-primary',
      click: function(e) {
        e.preventDefault();
        e.stopPropagation();
        change_card(val);
      }
    }).appendTo($cards);
  })
}

function enter_room (id, member_ids) {
  my_id = id;
  $.each(member_ids, function (i, vav) {
    add_card(vav);
  });
}

function new_connection (id) {
  add_card(id);
}

function add_card (id) {
  $connections = $('#connections')
  $('<a>', {
    data: { id: id },
    text: id,
    class: 'btn btn-info'
  }).appendTo($connections);
}