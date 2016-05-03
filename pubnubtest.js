(function() {

  var output = document.querySelector('#output');
  var input = document.querySelector('#input'),
    button = document.querySelector('#button'),
    avatar = document.querySelector('#avatar'),
    presence = document.querySelector('#presence');

  console.log(output);
  var channel = 'Test';

  // Assign a random avatar in random color
  avatar.className = 'face-' + ((Math.random() * 13 + 1) >>> 0) + ' color-' + ((Math.random() * 10 + 1) >>> 0);

  // Hey, when you fork this and try by yourself, please use your own keys! Get your keys at http://admin.pubnub.com
  var p = PUBNUB.init({
    subscribe_key: 'sub-c-d5bdef46-1133-11e6-b422-0619f8945a4f',
    publish_key: 'pub-c-819608a6-ebde-4a7f-8bef-c34fdac8ffae'
  });

  // PubNub Playback to fetch past messages
  p.history({
    channel: channel,
    count: 50,
    callback: function(messages) {
      p.each(messages[0], function(m) {
        var content = '<p><i class="' + m.avatar + '"></i><span>';

        if (m.text) {
          content += m.text.replace(/[<>]/ig, '');
        }
        if (m.gif) {
          console.log('giphy added...');
          content += '<img src="' + m.gif + '">'
        }
        content += '</span></p>';

        output.innerHTML = content + output.innerHTML;
      });
    }
  });

  var actionUser = '';

  // PubNub Subscribe API
  // with Presence API to see how many people are online
  p.subscribe({
    channel: channel,
    callback: function(m, e, c) {
      console.log(m, e, c);
      console.log(m);
      actionUser = m.avatar;
      var content = '<p><i class="' + m.avatar + '"></i><span>';

      if (m.text) {
        content += m.text.replace(/[<>]/ig, '');
      }
      if (m.gif) {
        console.log('giphy added...');
        content += '<img src="' + m.gif + '">'
      }
      content += '</span></p>';

      output.innerHTML = content + output.innerHTML;
    },
    presence: function(m) {
      console.log(m);
      if (m.occupancy > 1) {
        presence.textContent = m.occupancy + ' people online';
      } else {
        presence.textContent = 'Only you are online';
      }
    }
  });

  p.bind('keyup', input, function(e) {
    if ((e.keyCode || e.charCode) === 13) {
      publish();
    }
  });

  p.bind('click', button, publish);

  function publish() {
    var text = input.value;

    if (!text) return;

     // PubNub Publish API
    p.publish({
      channel: channel,
      message: {
        avatar: avatar.className,
        text: text
      },
      callback: function(m) {
        input.value = '';
        console.log(m);
        if (['\giphy'].some(function(v) {
            return text.toLowerCase().indexOf(v) > 0;
          })) {
          console.log('hi');
          var query = text.replace('\\giphy ', '').split(' ').join('+');
          console.log(query);
          getGiphy(query);
        }
      }
    });
  }

  function publishGif(gif) {
    p.publish({
      channel: channel,
      message: {
        avatar: avatar.className,
        gif: gif
      }
    });
  }

  // Giphy API
  function getGiphy(q) {
    var url = 'http://api.giphy.com/v1/gifs/translate?api_key=dc6zaTOxFJmzC&s=' + q;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = function() {
      var json = JSON.parse(xhr.response);
      var gif = json.data.images.fixed_height.url;
      console.log(gif);
      publishGif(gif);
    };
    xhr.onerror = function() {
      console.log(e);
    };
    xhr.send();
  }

})();