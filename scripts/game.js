class Game{
    constructor(word, maxCount){
        this.word = word;
        this.letters = word.split('');
        this.correctKeys = [];
        this.errorCount = 0;
        this.maxCount = maxCount;
    }
    getLetters(){
        let letters = [];
        this.letters.forEach(element => {
            if(this.correctKeys.includes(element)){
                letters.push(element);
            }else{
                letters.push(" ");
            }
        });
        return letters;
    }
    checkKey(userKey){
        if(this.letters.includes(userKey)){
            this.correctKeys.push(userKey);
            return true;
        }
        this.errorCount += 1;
        return false;
    }
    checkStatus(){
        if(! this.getLetters().includes(" ")){
            // win
            return 'You win!';
        }else if(this.errorCount >= this.maxCount){
            // lose
            return 'You lose!';
        }else{
            // in game
            return 'inGame'
        }
    }
}