var camera, scene, renderer;
var player;

var auto = true;

// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = [37, 38, 39, 40];

function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault)
      e.preventDefault();
  e.returnValue = false;  
}

function keydown(e) {
    for (var i = keys.length; i--;) {
        if (e.keyCode === keys[i]) {
            preventDefault(e);
            return;
        }
    }
}

function wheel(e) {
  preventDefault(e);
}

function disable_scroll() {
  if (window.addEventListener) {
      window.addEventListener('DOMMouseScroll', wheel, false);
  }
  window.onmousewheel = document.onmousewheel = wheel;
  document.onkeydown = keydown;
}

function enable_scroll() {
    if (window.removeEventListener) {
        window.removeEventListener('DOMMouseScroll', wheel, false);
    }
    window.onmousewheel = document.onmousewheel = document.onkeydown = null;  
}


var Element = function ( entry ) {

  var dom = document.createElement( 'div' );
  dom.style.width = '480px';
  dom.style.height = '360px';

  var image = document.createElement( 'img' );
  image.style.position = 'absolute';
  image.style.width = '480px';
  image.style.height = '360px';
  image.src = entry.media$group.media$thumbnail[ 1 ].url;
  dom.appendChild( image );

  // debugger;

  var title = document.createElement( 'h1' );
  title.innerText = entry.title.$t;
  title.style.position = 'absolute';
  title.style.color = '#b31217'
  title.style.font = "normal normal normal 25px/normal 'Lucida Grande'";
  title.style.margin= "5%"
  dom.appendChild( title );

  var button = document.createElement( 'img' );
  button.style.position = 'absolute';
  button.style.left = ( ( 480 - 86 ) / 2 ) + 'px';
  button.style.top = ( ( 360 - 61 ) / 2 ) + 'px';
  button.style.visibility = 'hidden';
  button.style.WebkitFilter = 'grayscale()';
  button.src = 'data:image/png;base64,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';
  dom.appendChild( button );

  var blocker = document.createElement( 'div' );
  blocker.style.position = 'absolute';
  blocker.style.width = '480px';
  blocker.style.height = '360px';
  blocker.style.background = 'rgba(0,0,0,0.5)';
  blocker.style.cursor = 'pointer';
  dom.appendChild( blocker );

  var object = new THREE.CSS3DObject( dom );
  object.position.x = Math.random() * 3000 - 2000;
  // object.position.y = Math.random() * 2000 - 1000;
  object.position.y = 5000;
  object.position.z = Math.random() * - 4000;

  //

  image.addEventListener( 'load', function ( event ) {

    button.style.visibility = 'visible';

    new TWEEN.Tween( object.position )
      .to( { y: Math.random() * 2000 - 1000 }, 2000 )
      .easing( TWEEN.Easing.Exponential.Out )
      .start();

  }, false );

  dom.addEventListener( 'mouseover', function () {

    button.style.WebkitFilter = '';
    blocker.style.background = 'rgba(0,0,0,0)';

  }, false );

  dom.addEventListener( 'mouseout', function () {

    button.style.WebkitFilter = 'grayscale()';
    blocker.style.background = 'rgba(0,0,0,0.5)';

  }, false );

  dom.addEventListener( 'click', function ( event ) {

    event.stopPropagation();

    if ( player !== undefined ) {

      player = undefined;

    }

    player = document.getElementById( 'play' );
    player.style.position = 'absolute';
    player.style.width = '640px';
    player.style.height = '390px';
    player.style.border = '0px';
    player.src = 'http://www.youtube.com/embed/' + entry.id.$t.split( ':' ).pop() + '?rel=0&autoplay=1&controls=1&showinfo=0';

    var description = document.getElementById( 'description' );
    description.innerText = entry.media$group.media$description.$t;

    var videoTitle = document.getElementById( 'video-title' );
    videoTitle.innerText = entry.title.$t;

  }, false );

  return object;

};

init();
animate();

function init() {

  camera = new THREE.PerspectiveCamera( 75, 500 / window.innerHeight, 1, 5000 );
  camera.position.y = - 25;

  scene = new THREE.Scene();

  disable_scroll();

  renderer = new THREE.CSS3DRenderer();
  renderer.setSize( 500, window.innerHeight );
  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.top = 0;
  renderer.domElement.style.background = "#fafafa";
  document.getElementById( 'container' ).appendChild( renderer.domElement );

  var query = document.getElementById( 'query' );
  query.addEventListener( 'keyup', function ( event ) {

    if ( event.keyCode === 13 ) {

      search( query.value );

    }

  }, false );

  var button = document.getElementById( 'button' );
  button.addEventListener( 'click', function ( event ) {

    search( query.value );

  }, false );

  if ( window.location.hash.length > 0 ) {

    query.value = window.location.hash.substr( 1 );

  }

  search( query.value );

  document.body.addEventListener( 'mousewheel', onMouseWheel, false );

  document.body.addEventListener( 'click', function ( event ) {

    auto = true;

    if ( player !== undefined ) {

      player = undefined;

    }

    new TWEEN.Tween( camera.position )
        .to( { x: 0, y: - 25 }, 1500 )
        .easing( TWEEN.Easing.Exponential.Out )
        .start();

  }, false );

  window.addEventListener( 'resize', onWindowResize, false );

}

function search( query ) {

  window.location.hash = query;

  for ( var i = 0, l = scene.children.length; i < l; i ++ ) {

    ( function () {

      var object = scene.children[ i ];
      var delay = i * 15;

      new TWEEN.Tween( object.position )
        .to( { y: - 2000 }, 1000 )
        .delay( delay )
        .easing( TWEEN.Easing.Exponential.In )
        .onComplete( function () {

          scene.remove( object );

        } )
        .start();

    } )();

  }

  var request = new XMLHttpRequest();
  request.addEventListener( 'load', onData, false );
  request.open( 'GET', 'https://gdata.youtube.com/feeds/api/videos?v=2&alt=json&max-results=50&q=' + query, true );
  request.send( null );

}

function onData( event ) {

  var data = JSON.parse( event.target.responseText );
  var entries = data.feed.entry;

  // console.log( entries.length );

  for ( var i = 0; i < entries.length; i ++ ) {

    ( function ( data, time ) {

      setTimeout( function () {

        scene.add( new Element( data ) );

      }, time );

    } )( entries[ i ], i * 15 );
  
  }

}

function move( delta ) {

  for ( var i = 0; i < scene.children.length; i ++ ) {

    var object = scene.children[ i ];

    object.position.z += delta;

    if ( object.position.z > 0 ) {

      object.position.z -= 5000;

    } else if ( object.position.z < - 5000 ) {

      object.position.z += 5000;

    }

  }

}

function onMouseWheel( event ) {

  move( event.wheelDelta );

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( 500, window.innerHeight );

}

function animate() {

  requestAnimationFrame( animate );

  TWEEN.update();

  if ( auto === true ) {

    move( 1 );

  }

  renderer.render( scene, camera );

}


$(document).ready(function() {
  var playlist = false;

  $('#toggle-playlist').on('click', function() {
    if (playlist === false ) {
      $('#playlist').animate({ "top": "0px" }, "slow" );
      playlist = true;
    } else {
      $('#playlist').animate({ "top": "-150px" }, "slow" );
      playlist = false;
    }
  });

});