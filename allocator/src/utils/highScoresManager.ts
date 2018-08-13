import { TiledLayout, LayoutDirection } from './layout';
import { SCORE_CONST } from '../const/const';

export class HighScoresManager extends Phaser.GameObjects.Container {
    private HIGHEST_SCORES_STORAGE_KEY = "highest_scores";
    private highestScores: Array<Array<string>>;
    private layout: TiledLayout;

    constructor(scene: Phaser.Scene) {
        super(scene);
        this.layout = new TiledLayout(
            scene, 
            LayoutDirection.Vertical, 
            20,
            false,
            this.scene.sys.canvas.height);

        this.readFromLocalStorage();
    }

    createView() {
      var title = this.scene.make.text({}, false);
      this.createText(title, "High Scores");
      this.layout.addItem(title);

      this.highestScores.forEach((value, index) => {
        var score = this.scene.make.text({}, false);
        this.createText(score, value[0] + ": " + value[1]);
        this.layout.addItem(score);
      });

      //this.scene.add(this.layout);
    }

    addEntry(name: string, score: number) {
        var array = new Array<string>();
        array.push(name);
        array.push(score.toString());
        this.highestScores.push(array);
        this.internalSort();
    }

    private createText(textBox: Phaser.GameObjects.Text, text: string) {
        textBox.setText(text);
        textBox.setStyle({
          fontSize: SCORE_CONST.FONT_SIZE,
          fill: SCORE_CONST.TEXT_FILL
        });
        textBox.setColor(SCORE_CONST.TEXT_COLOR);
    }

    private internalSort() {
        this.highestScores = this.highestScores.sort((entry1, entry2) => {
            if (+entry1[1] > +entry2[1]) {
                return -1;
            }
            else if (+entry1[1] < +entry2[1]) {
                return 1;
            }
            return 0;
        });
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
            this.serialize());
    }
}
