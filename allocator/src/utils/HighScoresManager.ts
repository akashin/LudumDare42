export class HighScoresManager {
    private HIGHEST_SCORES_STORAGE_KEY = "highest_scores";
    private highestScores: Array<Array<string>>;

    constructor(scene: Phaser.Scene) {
        this.readFromLocalStorage();
    }

    addEntry(name: string, score: number) {
        var array = new Array<string>();
        array.push(name);
        array.push(score.toString());

        this.highestScores.push(array);
    }

    private readFromLocalStorage() {
        this.highestScores = new Array<Array<string>>();
        var storageList = JSON.parse(window.localStorage.getItem(this.HIGHEST_SCORES_STORAGE_KEY));
        if (storageList == null) {
            return;
        }

        for (var i = 0; i < storageList["records"]; ++i) {
            var pair = storageList[i];
            this.highestScores.push(pair);
        }
    }

    serialize() : string {
        this.highestScores = this.highestScores.sort((entry1, entry2) => {
            if (+entry1[1] > +entry2[1]) {
                return -1;
            }
            else if (+entry1[1] < +entry2[1]) {
                return 1;
            }
            return 0;
        })
        
        var serializedScores = new Object();
        serializedScores["version"] = 1;
        serializedScores["records"] = Math.min(10, this.highestScores.length);
        for (var i = 0; i < Math.min(10, this.highestScores.length); ++i) {
            serializedScores[i] = [this.highestScores[i][0], this.highestScores[i][1]];
        }

        return JSON.stringify(serializedScores); 
    }

    writeToLocalStorage() {
        window.localStorage.setItem(
            this.HIGHEST_SCORES_STORAGE_KEY,
            this.serialize()
            );
    }
}