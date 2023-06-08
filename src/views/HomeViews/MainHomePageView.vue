<template>
    <div>
        <button @click="loginWithGoogleClicked">Login</button>

        <button @click="checkCommentsEnabled">Check Comments</button>
        <!-- <p v-if="commentsEnabled !== null">
            Comments are {{ commentsEnabled ? 'enabled' : 'disabled' }} on the video.
        </p> -->
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            message: 'Hello, Vue!',
            commentsDisabled: null,
        };
    },
    methods: {
        loginWithGoogleClicked() {
            console.log('logged in');
        },
        checkCommentsEnabled() {
            const apiKey = 'AIzaSyBnVlBkVdxtMxxqjLuVYrwuvbgxNU6uyT8';
            const videoId = 'TX9qSaGXFyg';
            // const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${K9G3Yc0pw9g}&key=${apiKey}`;

            // const url = `https://www.googleapis.com/youtube/v3/comments?part=snippet&maxResults=1&videoId=${videoId}&parentId=''&key=${apiKey}`;
            const url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${apiKey}`;

            axios
                .get(url)
                .then((response) => {
                    console.log('Response', response.data);
                })
                .catch((error) => {
                    console.error('Error', error);
                    if (error.response && error.response.data && error.response.data.error) {
                        // this.errorMessage = error.response.data.error.message;
                        // console.log(error.response);
                        // console.log(error.response.data);
                        // console.log(error.response.data.error);
                        console.log(error.response.data.error.errors[0].reason);
                    } else {
                        this.errorMessage = 'An error occurred while fetching comments.'
                        console.log(this.errorMessage);
                    }
                });
        },
    },
};
</script>



<!-- This fucking repo gave me the idea that I need to use commentsThread and not comments - https://github.com/Username070/youtube-simple -->