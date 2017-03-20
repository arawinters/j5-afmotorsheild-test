const Raspi = require('raspi-io');
var five = require("johnny-five");
var rpi;

/* new rasperry pi board */
rpi = new five.Board({
  io: new Raspi()
});


rpi.on("ready", function() {
  console.log('board ready');
  // ------------ initialize motors ------------
  let motors = [
    new five.Motor({
      pins: {
        pwm: 8,
        dir: 9,
        cdir: 10
      },
      address: 0x60,
      controller: 'PCA9685'
    }),
    new five.Motor({
      pins: {
        pwm: 13,
        dir: 12,
        cdir: 11
      },
      address: 0x60,
      controller: 'PCA9685'
    })
  ];
  let sequences = {
    'motor1': [
      function(){ motors[0].start(150); },
      function(){ motors[0].stop(); },
      function(){ motors[0].start(150); },
      function(){ motors[0].stop(); },
    ],
    'motor2': [
      function(){ motors[1].start(150); },
      function(){ motors[1].stop(); },
      function(){ motors[1].start(150); },
      function(){ motors[1].stop(); },
    ]
  }

  // Inject the `motor` hardware into
  // the Repl instance's context;
  // allows direct command line access
  let _inject = {};
  motors.forEach(function(mref, mind){
    _inject['motor'+(mind+1)] = mref;
  });
  board.repl.inject(_inject);


  // ------------ diagnostic logging ------------
  motors.forEach(function(mref, mind){
    mref.on("start", function() {
      console.log("motor #"+ (mind+1) +" start", Date.now());
    });
    mref.on("stop", function() {
      console.log("motor #"+ (mind+1) +" stop", Date.now());
    });
  });
  // ------------ diagnostic logging ------------


  /*
  TODO: refactor junk below to be driven by motors array
  */

  var doStep = function(fn, duration){
    setTimeout(fn, duration);
  }


  // yabba-daaaba-dooooo
  for( motorName in sequences){
      let sequence = sequences[motorName];
      // for now just hardcode steps
      doStep(sequence[0],0);
      doStep(sequence[1],5000);
      doStep(sequence[2],6000);
      doStep(sequence[3],10000);
  }

});
