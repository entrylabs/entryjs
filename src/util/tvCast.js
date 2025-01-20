Entry.TvCast = class TvCast {
    constructor(tvCast) {
        this.generateView(tvCast);
    }
    init(tvCastHash) {
        this.tvCastHash = tvCastHash;
    }

    generateView(tvCastHash) {
        const movieContainer = Entry.createElement('div');
        movieContainer.addClass('entryContainerMovieWorkspace');
        movieContainer.addClass('entryRemove');

        const iframe = Entry.createElement('iframe');
        iframe.setAttribute('id', 'tvCastIframe');
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('frameborder', 0);
        iframe.setAttribute('src', tvCastHash);
        this.movieFrame = iframe;

        movieContainer.appendChild(this.movieFrame);
        this.movieContainer = movieContainer;
    }

    getView() {
        return this.movieContainer;
    }

    resize() {
        const iframe = document.getElementById('tvCastIframe');
        const w = this.movieContainer.offsetWidth;
        iframe.width = `${w}px`;
        iframe.height = `${(w * 9) / 16}px`;
    }
};
