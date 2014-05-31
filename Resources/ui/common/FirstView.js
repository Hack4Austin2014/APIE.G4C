//FirstView Component Constructor
function FirstView() {
		
	//load question data array
	var questions = require('ui/common/QuestionData');
	
	//create object instance, a parasitic subclass of Observable
	var self = Ti.UI.createView();

	//label using localization-ready strings from <app dir>/i18n/en/strings.xml
	var cards = Ti.UI.createLabel({
		//color:'#000000',
		text: Ti.Locale.getString('title') + '\n\n' + Ti.Locale.getString('touchplay'),
		backgroundColor: '#F66',
		//backgroundImage: '/images/bg_old_wood_frame_4_4.png',
		//backgroundRepeat: true,
		textAlign: 'center',
		//borderRadius: 10,
		width: Ti.UI.FILL,
		height: Ti.UI.FILL
	});
	self.add(cards);

	var sylCount = 0;
	Ti.API.info('init sylCount: '+sylCount);

	var syllables = Ti.UI.createLabel({
		//color:'#000000',
		text: '',
		backgroundColor: '#F66',
		textAlign: 'center',
		bottom: 20,
		width: Ti.UI.FILL,
		height: 'auto'
	});
	self.add(syllables);

	var cardCount = 0;
	Ti.API.info('init cardCount: '+cardCount);
	
	var answer;
	var player = Ti.Media.createSound();
	
	function updateCard() {
		
		cardCount++;
		
		syllables.setText(sylCount);
		
		var tempData = questions.getData();
		
		//select data randomly from QuestionData obj
		var data = tempData[Math.floor(Math.random() * tempData.length)];
		
		if (cardCount % 2 == 1){
			
			Ti.App.Properties.setString('audioStr', Ti.Locale.getString(data.v));
			
			//display question
			cards.setText('How many syllables?\n\n' + Ti.Locale.getString(data.q));
			
			cards.backgroundColor = '#777';
			
			//update answer to this question
			answer = Ti.Locale.getString(data.a) + '\n\n' + Ti.Locale.getString(data.s);
			
			function playAudio(){
				player = Ti.Media.createSound({url: Ti.App.Properties.getString('audioStr')});
				
				setTimeout(function(){
					player.play();
				}, 500);
				//player.reset();
				//player.release();
			}
			
			//play audio of the word
			playAudio();
			
		} else {

			//play audio of the word
			playAudio();
			
			//display answer
			cards.setText(answer);
			cards.backgroundColor = '#F66';
			syllables.setText('');
		}
	}

	//Add behavior for UI
	cards.addEventListener('swipe', function(e) {
		
		//execute when swipe direction is 'left' or 'right' 
		if(cardCount == 0 && (e.direction == 'up' || e.direction == 'down')){ //
			
			updateCard();
			
		} else if (cardCount !== 0 && syllables.text !== '' && (e.direction == 'up')) {

			sylCount++;
			syllables.setText(sylCount); 

		} else if (cardCount !== 0 && syllables.text !== '' && (e.direction == 'down')) {
			
			if(sylCount !== 0){
				
				sylCount--;
				syllables.setText(sylCount);
					
			}
		} else if (cardCount !== 0 && sylCount !== 0 && syllables.text !== 0 && syllables.text !== '' && (e.direction == 'left' || e.direction == 'right')) {

			Ti.API.info('display answer');
			updateCard();

		} else if((cardCount !== 0 && sylCount !== 0) && syllables.text == '' && (e.direction == 'left' || e.direction == 'right')) {

			Ti.API.info('next question');
			sylCount = 0;
			updateCard();

		}
	});
	
	return self;
}

module.exports = FirstView;
