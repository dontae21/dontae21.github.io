// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBOLVoKlPqq18K1TJ5lDmNZCNE9JWDZfBA",
  authDomain: "flannel-collision.firebaseapp.com",
  databaseURL: "https://flannel-collision.firebaseio.com",
  projectId: "flannel-collision",
  storageBucket: "flannel-collision.appspot.com",
  messagingSenderId: "464220201807",
  appId: "1:464220201807:web:6595d1f54a2f0971"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let database = firebase.database()
let scoreboard = {}
let snack= document.getElementById("snack")
let x
let y
let x2
let y2
let direction_h
let direction_v
let direction_h2
let direction_v2
let lives
let damage
let x5
let y5
let monster
let level
let time

function setup() {
  createCanvas(windowWidth,windowHeight);
  s=width/928
  x=700
  y=600
  x2=600
  y2=600
  x5=[610, 210, 400,538,500,450,300,500,322,670]
  y5=[600, 300, 450,200,345,430,400,654,468,623]
  direction_h=1
  direction_v=1
  direction_h2=[1,1,1,1,1,1,1,1,1,1]
  direction_v2=[1,1,1,1,1,1,1,1,1,1]
  lives= 10
  time=100
  damage= 5
  monster= 4
  level= 1
}

function draw(){
  if (touches.length == 0)   {
	  if (keyIsDown(LEFT_ARROW)) {
	      x = x - 16
	  }
	  if (keyIsDown(RIGHT_ARROW)) {
	      x = x + 16
	  }
	  if (keyIsDown(UP_ARROW)) {
	      y = y - 16
	  }
	  if (keyIsDown(DOWN_ARROW)) {
	      y = y + 16
  	  }
     }
  else { 
        x = touches[0].x
	y = touches[0].y
}

  if (time > 0) {
  background(180,200,220);
  circle(x*s,y,20*s)
  fill(210,145,200)
  
  circle(x2*s,y2,40*s)

  fill(200,220,80)
  
  x2 = x2 + 10*direction_h

  y2 = y2 + 10*direction_v
  


 if ( y2 > height || y2 < 0) {
	direction_v = direction_v * -1
}
  if ( x2*s > width || x2*s < 0) {
	direction_h = direction_h * -1
}
   if (dist( x*s, y, x2*s, y2) < 40*s + 30*s) {
	lives = lives + 1
     
   
   }

  
for (i=0; i<monster; i=i+1) {
  fill(240,120,250)
  
  circle(x5[i]*s,y5[i],60*s)
  
  x5[i] = x5[i] + 8*direction_h2[i]
  
  y5[i] = y5[i] + 8*direction_v2[i]  
  if ( x5[i]*s > width || x5[i]*s < 0) {
	direction_h2[i] = direction_h2[i] * -1
}
  if ( y5[i] > height || y5[i] < 0) {
	direction_v2[i] = direction_v2[i] * -1
}
  if (dist( x*s, y, x5[i]*s, y5[i]) < 20*s + 60*s) {
	lives = lives - 1
  }
}
   
  textSize(30)
text("Score: " + lives,50,50)
text("Time: " + time.toFixed(1),50,100)
time = time -.05

  if ( lives> 10 && level == 1) {
    monster = monster + 2
    level = 2
    x5.push.apply(x5, [500, 450])
    y5.push.apply(y5, [345, 430])
    direction_v2.push.apply(direction_v2,[1,1])
    direction_h2.push.apply(direction_h2,[1,1])
}
  if ( lives> 20 && level == 2) {
    monster = monster + 3
    level = 3
    x5.push.apply(x5, [300,500 ])
    y5.push.apply(y5, [400, 654])
    direction_v2.push.apply(direction_v2,[1,1])
    direction_h2.push.apply(direction_h2,[1,1])
  }
   if ( lives> 35 && level == 3) {
    monster = monster + 4
    level = 4
    x5.push.apply(x5, [322,670])
    y5.push.apply(y5, [468,623])
    direction_v2.push.apply(direction_v2,[1,1])
    direction_h2.push.apply(direction_h2,[1,1])
  }
  }
  else{
    snack.innerHTML = "Name? <input id=cap><button onclick='restart()'>Restart</button><button onclick='generate_alltime_leaderboard()'>alltime leaderboard</button>"
    noLoop()

    } 
} 

function restart() { 
        let cap= document.getElementById("cap")
		name =cap.value 
		database.ref(name).set(lives)
		if (name != "") { 
			scoreboard[name] = lives
		}
        alert("Scoreboard: " + JSON.stringify(scoreboard,null,1)) 
		time = 100
		lives = 0
        monster= 4
        level= 1
		loop()
		snack.innerHTML = ""
        generate_leaderboard() 
}

function generate_leaderboard() {
  scores = Object.values(scoreboard)
  names = Object.keys(scoreboard)
  
  if (scores.length >= 3) {
    let leaderboard = { }
    for (i=0; i<3; i=i+1) {
      max = Math.max(...scores)
      index = scores.indexOf(max)
      leaderboard[names[index]] = max
      names.splice(index,1)
      scores.splice(index,1)
    }
    alert("Leaderboard: " + JSON.stringify(leaderboard,null,1))
  }
}

function generate_alltime_leaderboard() {
	let alltime_leaderboard = { }
	database.ref().orderByValue().limitToLast(3).on("value", function(snapshot) {
		snapshot.forEach(function(data) {
		alltime_leaderboard[data.key] = data.val()
		});
    	});
	if (Object.values(alltime_leaderboard).length > 0) {
	  alert("All-time leaderboard: " + JSON.stringify(alltime_leaderboard,null,1))
    	}
}

generate_alltime_leaderboard()

