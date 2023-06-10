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




import { auth, providerGoogle, db, storage } from '@/firebase/firebase'
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import { collection, addDoc, doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";



export default {
    components: { NavBar },
    data() {
        return {
            user:null,
            ytVideoURLInputValue: '',
        };
    },
    mounted() {
        this.$refs.ytVideoURLInput.focus()

        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.user = user
                console.log(this.user);
                console.log(this.user.uid);
                // console.log(this.user.fullName);
            } else {
                this.user = null
                console.log("Signed Out");
            }
        });
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
        getVideoDetails(videoID){
            const apiKey = KUMENT_GOOGLE_API_KEY;
            const videoId = videoID;

            
            
            let videoInfo = {}
            // Get current date and time
            const dateObject = new Date();
            // Extract individual components
            const year = dateObject.getFullYear();
            const month = dateObject.getMonth() + 1; // Months are zero-based (0 - 11)
            const day = dateObject.getDate();
            const currentDate = `${year}-${month}-${day}`


            const url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${apiKey}`;

            return axios
                .get(url)
                .then((response) => {
                    // Check if comments are not disabled
                    if (response) {
                        console.log(response);

                        // Main Details
                        videoInfo.title = response.data.items[0].snippet.title
                        videoInfo.description = response.data.items[0].snippet.description
                        videoInfo.channelTitle = response.data.items[0].snippet.channelTitle
                        

                        // Other Info
                        videoInfo.publishedAt = response.data.items[0].snippet.publishedAt
                        videoInfo.addedAt = currentDate
                        videoInfo.addedByUserID = this.user.uid

                        // Video Stats
                        videoInfo.likeCount = response.data.items[0].statistics.likeCount
                        videoInfo.viewCount = response.data.items[0].statistics.viewCount



                        console.log(videoInfo);
                        return videoInfo
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        openVideoBtnClicked() {
            let videoid = this.extractYouTubeVideoId(this.ytVideoURLInputValue);

            
            const videoRef = doc(db, "youtubeVideos", videoid);
            const userRef = doc(db, "users", this.user.uid);

            // Check if the video document exists
            getDoc(videoRef)
                .then((docSnapshot) => {
                    if (docSnapshot.exists()) {
                        this.$router.push(`/${videoid}`);
                        // redirect user to the video page

                    } else {
                        this.checkCommentsDisabled(videoid)
                            .then((commentsDisabled) => {
                                if (commentsDisabled) {
                                    this.getVideoDetails(videoid).then((videoInfo) =>{
                                        setDoc(videoRef, videoInfo);

                                        // Add the videoID to the addedVideosByUser in the user doc
                                        updateDoc(userRef, {addedVideosByUser: arrayUnion(videoid)})
                                        .then(() => { this.$router.push(`/${videoid}`); })
                                            .catch((error) => {
                                                console.error("Error creating user document:", error);
                                            });
                                    }
                                    )
                                }
                                else {
                                    alert("Comment Are Enabled on this Video");
                                }

                            });

                    }
                })
            
            
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
.openVideoButton {

    
}
</style>