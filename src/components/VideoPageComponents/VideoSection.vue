<template>
    <div class="videoSectionDiv basic_flexbox">
        <div class="player_container_Div basic_flexbox">
            <YouTubePlayerComp :videoId="youtubeVideoID" />
        </div>

        <div class="videoDetailsDiv basic_flexbox">
            <span class="videoAddedSpan">
                Added by {{ videoInfo.addedByUserName }} on {{ videoInfo.addedAt }}
            </span>

            <div class="videoDescriptionDiv basic_flexbox">
                <p :class="showFullDescription ? 'videoFullDescription' : 'videoLessDescription'"  v-html="descriptionTextToShow"></p>

                <!-- <button class="showMoreDescriptionButton">Show More</button> -->

        <button class="showMoreDescriptionButton" @click="showFullDescription = !showFullDescription">
          {{ showFullDescription ? 'Show Less' : 'Show More' }}
        </button>
            </div>


        </div>

    </div>
</template>

<script>
import axios from 'axios';
import KUMENT_GOOGLE_API_KEY from '@/apikey.js'

import { auth, providerGoogle, db, storage } from '@/firebase/firebase'
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import { collection, addDoc, doc, setDoc, getDoc } from "firebase/firestore";


import YouTubePlayerComp from './YouTubePlayer.vue';


export default {
    data() {
        return {
            user: '',
            showFullDescription:false,
        }
    },
    components: {
        YouTubePlayerComp,
    },
    props: {
        youtubeVideoID: {
            type: String,
            required: true,
        },
        videoInfo: {
            type: Object,
            required: true,
        }
    },
    computed: {
        descriptionTextToShow(){
                if (this.videoInfo && this.videoInfo.description) {
                    const maxChars = 200; // Maximum number of characters to display
                    const description = this.formattedDescription;
                    if (!this.showFullDescription && description.length > maxChars) {
                        return description.slice(0, maxChars) + "...";
                    }
                    return description;
                }
                return "";
        },

        formattedDescription() {
            if (this.videoInfo && this.videoInfo.description) {
                const timelineRegex = /(\d{2}:\d{2}:\d{2}|\d{2}:\d{2})/g;
                const urlRegex = /https:[^\s]+/g;
                const hashtagRegex = /#(\w+)/g;

                let descriptionWithTimelines = this.videoInfo.description.replace(
                    timelineRegex,
                    '<span class="timeline" onclick="console.log(\'$&\')">$&</span>'
                );

                descriptionWithTimelines = descriptionWithTimelines.replace(
                    urlRegex,
                    '<a class="url-hashtag" target="_blank" href="$&">$&</a>'
                );

                descriptionWithTimelines = descriptionWithTimelines.replace(
                    hashtagRegex,
                    '<a class="url-hashtag" target="_blank" href="https://www.youtube.com/hashtag/$1">#$1</a>'
                );

                return descriptionWithTimelines;
            }

            return "";
        }
    },

    methods: {



        // Functions not in use as of now, to be included in future
        skipToTime(timeline) {
            const timeParts = timeline.split(":");
            const hours = parseInt(timeParts[0]) || 0;
            const minutes = parseInt(timeParts[1]) || 0;
            const seconds = parseInt(timeParts[2]) || 0;
            const totalTime = hours * 3600 + minutes * 60 + seconds;

            // this.player.seekTo(totalTime);

        },
    },



}


</script>

<style>
.timeline,
.url-hashtag {
    text-decoration: none;
    color: hsl(180, 78%, 31%);
    cursor: pointer;
}

.timeline:hover,
.url-hashtag:hover {
    color: hsl(180, 78%, 41%);

}

.videoSectionDiv {
    flex-direction: column;
    flex: 1;
    padding: 1rem;
    margin: 1rem;
    min-height: 480px;
    justify-content: center;
    align-items: center;

    color: var(--black);
}

.player_container_Div {
    /* flex: 1; */
    /* flex-grow: 1 2; */
    height: 35rem;
    min-width: 80%;
    padding: 1rem;

}

/*

.youtubeVideoEmbediframe {
    width: 71%;
    flex: 1;
    border-radius: 1rem;
} */

.videoDetailsDiv {
    flex: 1;
    padding: 1rem;
    margin: 1rem;
    justify-content: center;
    align-items: center;
    flex-direction: column;

}

.videoAddedSpan {
    margin-bottom: 1rem;
}

.videoDescriptionDiv {
    /* flex: 1; */
    /* height: fit-content; */
    width: 60%;
    flex-direction: column;
    position: relative;
    padding: 2rem;
    justify-content: center;
    align-items: center;
}
.videoDescriptionDiv p{
    white-space: pre-line;
    background-color: var(--transparent-contrast-background);
    border-radius: 1rem;
    padding:2rem;

}

.videoLessDescription{
    pointer-events: none;   
    user-select: none;
}
.videoMoreDescription{

}

.showMoreDescriptionButton{
    background-color: transparent;
    border: none;
    color: var(--black);
    cursor: pointer;
    position: absolute;
    bottom: 0;
    right: 2rem;
    font-weight: 500;
    border-radius: .5rem;
    padding: .3rem;
}
.showMoreDescriptionButton:hover{
    background-color: var(--transparent-contrast-background);

}

.videoDescription {
    white-space: pre-line;
}</style>