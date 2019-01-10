export default class Toast {
    static instance;
    constructor(board) {
        if (Toast.instance) {
            return Toast.instance;
        }
        this.board = board;
        this.generateView();
        Toast.instance = this;
    }

    get TOAST_WIDTH() {
        return 88;
    }

    get TOAST_HEIGHT() {
        return 44;
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
    }

    show(message) {
        $('#entryWorkspaceBoard').append(this.$view);
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
        delete this.board;
        delete Toast.instance;
    }
}
