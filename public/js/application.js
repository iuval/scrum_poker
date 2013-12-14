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
      case 'lost-connection':
        lost_connection(json.id);
        break;
      case 'card-ready':
        card_ready(json.id);
        break;
      case 'reveal':
        card_ready(json.id);
        break;
      case 'story-change':
        break;
      default:
      }
    };
  })();

  create_cards();
};

function card_ready (id) {
  $conn = $("#connections a[data-id='" + id + "']");
  $conn.data('done', true);
  $conn.removeClass('btn-warning');
  $conn.addClass('btn-success');
}

function card_change (card_index) {
  ws.send(JSON.stringify({
    'action': 'card-change',
    'id':     my_id,
    'data':   card_index,
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
        card_change(i);
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
    'data-id':   id,
    'data-done': false,
    'text':      '...',
    'class':     'btn btn-warning'
  }).appendTo($connections);
}

function lost_connection (id) {
  $("#connections a[data-id='" + id + "']").remove();
}

function reveal (cards) {
  $.each(cards, function (i, card) {
    $("#connections a[data-id='" + card.id + "']").text(card.value);
  });
}