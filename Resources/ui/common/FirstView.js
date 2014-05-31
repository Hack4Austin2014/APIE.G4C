//FirstView Component Constructor
function FirstView() {
		
	//load question data array
	var questions = require('ui/common/QuestionData');
	
	//create object instance, a parasitic subclass of Observable
	var self = Ti.UI.createView();

	//label using localization-ready strings from <app dir>/i18n/en/strings.xml
	var cards = Ti.UI.createLabel({
		//color:'#000000',
		text: "Flashcards!",
		backgroundColor: "#F66",
		//backgroundImage: "/images/bg_old_wood_frame_4_4.png",
		//backgroundRepeat: true,
		textAlign: "center",
		borderRadius: 4,
		//top: 100,
		// left: 10,
		width: Ti.UI.FILL,
		height: Ti.UI.FILL
	});
	self.add(cards);

	var count = 0;
	var answer;
	var player = Ti.Media.createSound();
	
	//Add behavior for UI
	cards.addEventListener('click', function(e) {
		count++;
		if (count % 2 == 1){
			//display question, randomly
			var tempData = questions.getData();
			var data = tempData[Math.floor(Math.random() * tempData.length)];
			this.text = 'How many syllables?\n\n' + Ti.Locale.getString(data.q);
			this.backgroundColor = "#777";
			answer = Ti.Locale.getString(data.a) + "\n\n" + Ti.Locale.getString(data.s);
			
			//play audio of the word
			player = Ti.Media.createSound({url:Ti.Locale.getString(data.v)}); // url:'/db/tts/en/v_01.mp3'
			player.play();
			//player.reset();
			//player.release();
		} else {
			//display answer
			this.text = answer;
			this.backgroundColor = "#F66";
		}
	});
	return self;
}

module.exports = FirstView;