Entry.TvCast = class TvCast {
    constructor(tvCast) {
        this.generateView(tvCast);
    }
    init(tvCastHash) {
        this.tvCastHash = tvCastHash;
    }

    generateView(tvCastHash) {
        var movieContainer = Entry.createElement('div');
        movieContainer.addClass('entryContainerMovieWorkspace');
        movieContainer.addClass('entryRemove');

        this.movieContainer = movieContainer;

        var movieContainer = this.movieContainer;
        const iframe = Entry.createElement('iframe');
        iframe.setAttribute('id', 'tvCastIframe');
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('frameborder', 0);
        iframe.setAttribute('src', tvCastHash);
        this.movieFrame = iframe;

        this.movieContainer.appendChild(this.movieFrame);
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
