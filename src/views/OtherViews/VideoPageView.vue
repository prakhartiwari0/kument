<template>
    <div class="videoPageDiv basic_flexbox">
            <NavBar></NavBar>

        <template v-if="youtubeVideoExists">
        
            <VideoSection :videoInfo="videoInfo" :youtubeVideoID="youtubeVideoID"/>

            <CommentSection :commentsData="commentsData"/>
        </template>

    </div>
</template>

<script>
import axios from 'axios';

import NavBar from '../../components/HomePageComps/NavBar.vue';
import VideoSection from '../../components/VideoPageComponents/VideoSection.vue';
import CommentSection from '../../components/VideoPageComponents/CommentSection.vue';
import KUMENT_GOOGLE_API_KEY from '@/apikey.js'



import { auth, providerGoogle, db, storage } from '@/firebase/firebase'
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import { collection, addDoc, doc, setDoc, getDoc } from "firebase/firestore";


export default{
    components: { NavBar, VideoSection, CommentSection },
    data(){
        return{
            user:null,
            videoInfo:{
                description:"",
                addedAt:""
            },
            commentsData:{},
            youtubeVideoID: this.$route.params.videoID,
            youtubeVideoExists:false,
        }
    },
    
    mounted() {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.user = user
            } else {
                this.user = null
                console.log("Signed Out");
            }
        });

    },
    created(){
        this.checkYouTubeVideoExists()

    },
    methods: {

        checkYouTubeVideoExists() {
            const videoRef = doc(db, "youtubeVideos", this.youtubeVideoID);
            let addedByUserName;
            // Check if the video document exists
            getDoc(videoRef)
                .then((docSnapshot) => {
                    if (docSnapshot.exists()) {
                        this.videoInfo = docSnapshot.data().videoInfo
                        this.commentsData = docSnapshot.data().commentsData
                        document.title = this.videoInfo.title + " - Kument"

                        const userRef = doc(db, "users", this.videoInfo.addedByUserID, "userDetails", "userBasicInfo");
                        getDoc(userRef).then(
                            (userSnap) => {
                                if (userSnap.exists()) {
                                    const userData = userSnap.data()
                                    addedByUserName = userData.displayName
                                    
                                } else {
                                    addedByUserName = "Deleted User"
                                    console.log("User does not exist");
                                }
                                this.videoInfo.addedByUserName = addedByUserName
                                this.youtubeVideoExists = true
                            }
                        )
                        console.log("Yes the video exists");
                    } else {
                        console.log("NO the video DOES NOT exists");
                    }
                })
                .catch((error) => {
                    console.error('Error fetching video data:', error);
                    // Handle error if any occurred
                });
        },
    },

}


</script>

<style>
.videoPageDiv{
    flex-direction: column;
}

</style>