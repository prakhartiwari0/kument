<template>
        <iframe id="player" type="text/html"
      :src="videoEmbedLink"
      frameborder="0"></iframe>
</template>

<script>
// import YouTubePlayer from 'youtube-player';

// import { youtubePlayer } from 'youtube-player';

export default {
    props: {
        videoId: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            player: '',
            videoEmbedLink: `http://www.youtube.com/embed/${this.videoId}?enablejsapi=1`,
            done:false,

        };
    },
    mounted() {

        const tag = document.createElement('script');

        tag.src = "https://www.youtube.com/iframe_api";
        tag.async = true
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        // this.initializePlayer();
        // this.onYouTubeIframeAPIReady()

        window.onYouTubeIframeAPIReady = this.onYouTubeIframeAPIReady;
    },
    beforeUnmount() {
        // this.destroyPlayer();
    },
    methods: {
        onYouTubeIframeAPIReady() {
            this.player = new YT.Player('player', {
                videoId: this.videoId,
                playerVars: {
                    'playsinline': 1
                },
                events: {
                    'onReady': this.onPlayerReady,
                    'onStateChange': this.onPlayerStateChange
                }
            });
        },
        onPlayerReady(event) {
            // event.target.playVideo();
            // console.log("All Set sir");
        },
        onPlayerStateChange(event) {
            // this.player.seekTo(1000, true)
            console.log(event);
        },
        stopVideo() {
            this.player.stopVideo
        }

    },
};
</script>

<style>

#player {
    /* min-width: 71%; */
    flex: 1;
    border-radius: 1rem;
}


</style>
