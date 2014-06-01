//FirstView Component Constructor
function FirstView() {
		
	//load question data array
	var questions = require('ui/common/QuestionData');
	
	//create object instance, a parasitic subclass of Observable
	var self = Ti.UI.createView({
		backgroundColor: '#f7fc9c'
	});

	//label using localization-ready strings from <app dir>/i18n/en/strings.xml
	var header = Ti.UI.createLabel({
		//color:'#000',
		//text: '\n\n' + L('title'),
		//backgroundColor: '#ccc',
		textAlign: 'center',
		top: 0,
		width: Ti.UI.FILL,
		height: 30
	});
	self.add(header);

	//label using localization-ready strings from <app dir>/i18n/en/strings.xml	
	var cBoardImage = Ti.UI.createLabel({
		backgroundImage: '/images/bg_chalkboard.png',
		top: 30,
		width: 300,
		height: 195
	});
	self.add(cBoardImage);

	var cBoard = Ti.UI.createLabel({
		color:'#fff',
		text: L('touchplay'),
		font: {
			fontSize: '20pt',
			fontFamily: 'Helvetica Neue'
		},
		//backgroundColor: '#fff',
		textAlign: 'center',
		top: 20,
		width: 300,
		height: 150
	});
	self.add(cBoard);

	var sylCount = 0;
	//Ti.API.info('init sylCount: '+sylCount);

	var syllables = Ti.UI.createLabel({
		color:'#Fff',
		text: '',
		font: {
			fontSize: '30pt',
			fontWeight: 'bold',
			fontFamily: 'Helvetica Neue'
		},
		//backgroundColor: '#fff', //'#ccc',
		textAlign: 'center',
		top: 150,
		width: '50%',
		height: 50
	});
	self.add(syllables);

	var message = Ti.UI.createLabel({
		color:'#Fff',
		text: '',
		font: {
			fontSize: '30pt',
			fontWeight: 'bold',
			fontFamily: 'Helvetica Neue'
		},
		//backgroundColor: '#fff', //'#ccc',
		textAlign: 'center',
		top: 150,
		width: '50%',
		height: 50
	});
	self.add(message);

	var subBtn = Ti.UI.createButton({
		backgroundImage: '/images/icon_eraser.png',
		//backgroundColor: '#fff',
		top: 250,
		left: '10%',
		width: '15%',
		height: 50
	});
	self.add(subBtn);

	var playBtn = Ti.UI.createButton({
		backgroundImage: '/images/icon_headphones.png',
		//backgroundColor: '#fff',	
		top: 250,
		width: '15%',
		height: 50, 
	});
	self.add(playBtn);

	var addBtn = Ti.UI.createButton({
		backgroundImage: '/images/icon_pencil.png',
		//backgroundColor: '#fff',	
		top: 250,
		right: '10%',
		width: '15%',
		height: 50
	});
	self.add(addBtn);

	var footer = Ti.UI.createLabel({
		//backgroundColor: '#ccc',
		backgroundImage: '/images/bg_footer.png',
		// top: 390,
		bottom: 0,
		width: 480,
		height: 150
	});
	self.add(footer);	
	
	var cardCount = 0;
	//Ti.API.info('init cardCount: '+cardCount);
	
	var answer;
	var answerText;
	
	var correctRow = 0;
	var wrongRow = 0;
	
	var dialogA = Ti.UI.createAlertDialog({
		title: L('goodjob'),
		buttonNames: ['OK']
	});
	var dialogB = Ti.UI.createAlertDialog({
		title: L('tryagainoncemore'),
		buttonNames: ['OK']
	});
	
	var tts = Ti.Media.createSound();
	var sfxCorrect = Ti.Media.createSound({url: '/db/sfx/correct.wav'});
	var sfxWrong = Ti.Media.createSound({url: '/db/sfx/wrong.wav'});
	var sfxClick = Ti.Media.createSound({url: '/db/sfx/click.wav'});
	var sfxWarp = Ti.Media.createSound({url: '/db/sfx/warp.wav'});
	
	function updateCard(arg) {
		
		cardCount++;
		
		syllables.setText(sylCount);
		
		var tempData = questions.getData();
		
		//select data randomly from QuestionData obj
		var data = tempData[Math.floor(Math.random() * tempData.length)];
		
		playBtn.addEventListener('touchend', function(e) {
			//play audio of the word
			playAudio();
		});
		
		if (cardCount % 2 == 1){
			
			playBtn.show();
			
			Ti.App.Properties.setString('audioStr', L(data.v));
			
			//display question
			cBoard.setText(L('howmany') + '\n\n' + L(data.q));

			//update answer to this question
			answer = L(data.a);
			answerText = L('answerwas') + ' '+ L(data.a) + '\n\n' + L(data.s);
						
			function playAudio(){
				tts = Ti.Media.createSound({url: Ti.App.Properties.getString('audioStr')});
				
				setTimeout(function(){
					tts.play();
				}, 500);
			}			
		} else {

			if(arg == answer){
				
				//update text
				message.setText(L('correct'));

				if(correctRow < 2){
					correctRow++;
					wrongRow--;	
				} else {
					dialogA.show();
					correctRow = 0;
					wrongRow = 0;
				}
				sfxCorrect.play();
			} else {
				
				//update text
				message.setText(L('tryagain'));
				
				if(wrongRow < 2){
					correctRow--;
					wrongRow++;	
				} else {
					dialogB.show();
					correctRow = 0;
					wrongRow = 0;
				}
				sfxWrong.play();
			}

			//play audio of the word
			//playAudio();
			
			//display answer
			cBoard.setText(answerText);
			
			syllables.setText('');
		}
	}

	//Add behavior for UI
	addBtn.addEventListener('click', function(e){
		if(cardCount !== 0 && syllables.text !== ''){
			sfxClick.play();
			sylCount++;
			syllables.setText(sylCount);			
		}
	});

	subBtn.addEventListener('click', function(e){
		if(cardCount !== 0 && syllables.text !== '' && sylCount !== 0){
			sfxClick.play();
			sylCount--;
			syllables.setText(sylCount);
		}
	});

	cBoard.addEventListener('swipe', function(e) {
		//execute when swipe direction is 'left' or 'right' 
		if(cardCount == 0 && (e.direction == 'up' || e.direction == 'down' || e.direction == 'left' || e.direction == 'right')){ //
			sfxWarp.play();
			updateCard();
		} else if (cardCount !== 0 && syllables.text !== '' && (e.direction == 'up')) {
			sfxClick.play();
			sylCount++;
			syllables.setText(sylCount); 
		} else if (cardCount !== 0 && syllables.text !== '' && (e.direction == 'down')) {
			if(sylCount !== 0){
				sfxClick.play();
				sylCount--;
				syllables.setText(sylCount);
			}
		} else if (cardCount !== 0 && sylCount !== 0 && syllables.text !== 0 && syllables.text !== '' && (e.direction == 'left' || e.direction == 'right')) {
			//Ti.API.info('display answer');
			updateCard(sylCount);
		} else if((cardCount !== 0 && sylCount !== 0) && syllables.text == '' && (e.direction == 'left' || e.direction == 'right')) {
			message.setText('');
			sfxWarp.play();
			//Ti.API.info('next question');
			sylCount = 0;
			updateCard();
		}
	});
	
	syllables.addEventListener('click', function(){
		if(cardCount !== 0 && sylCount !== 0 && syllables.text !== 0 && syllables.text !== ''){
			//Ti.API.info('display answer');
			updateCard(sylCount);
		}else if((cardCount !== 0 && sylCount !== 0) && syllables.text == ''){
			message.setText('');
			sfxWarp.play();
			//Ti.API.info('next question');
			sylCount = 0;
			updateCard();
		}
	});
	
	return self;
}

module.exports = FirstView;
