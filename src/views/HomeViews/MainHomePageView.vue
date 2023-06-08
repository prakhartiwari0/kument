<template>
    <div class="homePageDiv basic_flexbox">
        <NavBar></NavBar>


        <div class="firstSection basic_flexbox">

            <div class="openVideoDiv basic_flexbox">

                <input type="text"
                       ref="ytVideoURLInput"
                       class="ytVideoURLInput general_textInput"
                       placeholder="Paste the YouTube Video Link"

                v-model="ytVideoURLInputValue"
                       >
                <button 
                :disabled="!isValidYouTubeVideoURL"
                @click="openVideoBtnClicked"
                        class="general_btns openVideoButton">Open</button>
            </div>

        </div>

    </div>
</template>

<script>
import axios from 'axios';

import NavBar from '../../components/HomePageComps/NavBar.vue';
import KUMENT_GOOGLE_API_KEY from '@/apikey.js'


export default {
    components: { NavBar },
    data() {
        return {
            ytVideoURLInputValue: '',
        };
    },
    mounted() {
        this.$refs.ytVideoURLInput.focus()
    },
    computed: {
        isValidYouTubeVideoURL() {
            if (this.ytVideoURLInputValue) {
                const pattern = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/|youtube\.com\/user\/\S+|youtube\.com\/channel\/\S+\/)([\w-]{11})(?:\S+)?$/;
                return pattern.test(this.ytVideoURLInputValue);
            }
        },
    },
    methods: {
        checkCommentsDisabled(videoID) {
            const apiKey = KUMENT_GOOGLE_API_KEY;
            const videoId = videoID;

            const url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${apiKey}`;
            
            return axios
                .get(url)
                .then((response) => {
                    // Check if comments are not disabled
                    if (response.data && response.data.items && response.data.items.length > 0) {
                        return false;
                    }
                })
                .catch((error) => {
                    if (error.response && error.response.data && error.response.data.error) {
                        const reasonOfError = error.response.data.error.errors[0].reason;
                        if (reasonOfError.toLowerCase() === 'commentsdisabled') {
                            return true;
                        }
                    } else {
                        const errorMessage = 'An error occurred while fetching comments.';
                        alert(this.errorMessage);
                    }
                });
        },
        extractYouTubeVideoId(url) {
            const pattern = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/|youtube\.com\/user\/\S+|youtube\.com\/channel\/\S+\/)([\w-]{11})(?:\S+)?$/;
            const match = url.match(pattern);
            return match && match[1];
        },

        openVideoBtnClicked() {
            let videoid = this.extractYouTubeVideoId(this.ytVideoURLInputValue);
            this.checkCommentsDisabled(videoid)
                .then((commentsDisabled) => {
                    console.log(commentsDisabled);
                });
    }


},
};
</script>



<!-- This repo gave me the idea that I need to use commentsThread and not comments - https://github.com/Username070/youtube-simple -->


<style>

.homePageDiv{
    flex-direction: column;

    background-color: var(--white);

}


.firstSection {
    /* min-height: 100vh; */
    justify-content: center;
    align-items: center;
    padding-block: 40vh;
}

.openVideoDiv {
    width: 60%;
    padding: 1rem;
}

.ytVideoURLInput {
    width: 100%;
    margin-inline: .5rem;
}
.openVideoButton {}
</style>