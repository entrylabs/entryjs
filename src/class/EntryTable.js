import { DataAnalytics } from '@entrylabs/tool';

class EntryTable {
    constructor(view) {
        this.view = view;
        this.generateView();
        console.log('c');
    }

    generateView() {
        this.dataAnalytics = new DataAnalytics({ container: this.view });
    }
}

export default EntryTable;
