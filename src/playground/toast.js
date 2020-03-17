export default class Toast {
    static instance;
    constructor(board) {
        if (Toast.instance) {
            return Toast.instance;
        }
        this.board = board;
        this.$boardView = $(board.view);
        this.generateView();
        Toast.instance = this;
    }

    generateView() {
        const template = `
            <div class="entryMobileToast hideToast">
                <div class="content"/>
            </div>
        `;
        this.$view = $('<div class="entryMobileToastWrapper">').append(template);
        this.$toast = this.$view.find('.entryMobileToast');
        this.$content = this.$view.find('.content');
        if (!this.$boardView.has(this.$view).length) {
            this.$boardView.append(this.$view);
        }
    }

    show(message) {
        this.$content.text(message);
        this.$toast.removeClass('fadeToast');
        $(this.$toast).width();
        this.$toast.addClass('fadeToast');
        this.removeToast(this);
    }

    // 애니메이션 Debounce 처리
    removeToast = _.debounce((toast) => {
        toast.$toast.removeClass('fadeToast');
    }, 3000);

    destroy() {
        this.removeToast.cancel();
        delete this.$boardView;
        delete this.board;
        delete this.$view;
        delete this.$toast;
        delete this.$content;
        delete Toast.instance;
    }
}
