<template>
    <div class="commentSectionDiv basic_flexbox"
         ref="commentsArea">

        <!-- comments are here -->
        <div class="commentsHeader basic_flexbox">
            <span class="commentsCountSpan"> Total Comments: {{ commentsData.commentsDetails.totalCommentsCount }}</span>
        </div>
        <div class="commentInputAreaDiv basic_flexbox">

            <template v-if="user">
                <img :src="user.photoURL"
                     alt=""
                     class="commentInputUserProfilePic">
            </template>

            <template v-else>
                <img src="src/assets/videoPageAssets/blank_user.png"
                     alt=""
                     class="commentInputUserProfilePic">
            </template>

            <!-- <input type="text" class="general_textInput commentTextInput"> -->
            <div class="commentInputDiv basic_flexbox">
                <textarea :disabled="!canComment"
                          v-model="userInputCommentText"
                          rows="5"
                          :placeholder="user ? commentInputPlaceholder : 'Wanna comment? Please Login!'"
                          class="general_textInput commentTextInput"></textarea>
                <button :disabled="!canComment || userInputCommentText.length < 1"
                        class="general_btns commentButton"
                        @click="commentButtonClicked">Comment</button>
            </div>
        </div>

        <div class="commentsAreaDiv basic_flexbox">
            <div class="eachCommentByUserDiv eachCommentDiv basic_flexbox"
                 v-for="(comment, index) in userComments"
                 
                 >


                 <Comment :currentUserID="user.uid" :comment="comment" :user="user"  :otherData="{youtubeVideoID}"
                 @commentDeleted="deleteComment(userComments, index)"
                 />

            </div>


            <div class="eachFetchedCommentDiv eachCommentDiv basic_flexbox"
                 v-for="(comment, index) in fetchedComments">

                 <Comment :currentUserID="user.uid" :comment="comment" :user="null" :otherData="{ youtubeVideoID }"
                 
                 @commentDeleted="deleteComment(fetchedComments, index)"
                 
                 />
                 

                <!-- <button class="editCommentButton" @click="editCommentClicked(comment.commentID)">edit</button> -->
            </div>


        </div>

    </div>
</template>

<script>
import { auth, providerGoogle, db, storage } from '@/firebase/firebase'
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import { collection, addDoc, doc, setDoc, getDoc, getDocs, updateDoc, arrayUnion, query, orderBy, limit, startAfter} from "firebase/firestore";


import Comment from './Comment.vue'

export default {
    data() {
        return {
            user: null,
            youtubeVideoID: this.$route.params.videoID,
            canComment: false,
            userInputCommentText: "",
            commentInputPlaceholder: "You know what? I am gonna comment here RIGHT NOW!",
            youtubeVideoID: this.$route.params.videoID,
            fetchedComments: [],
            userComments: [],
            lastFetchedCommentID: null,
        }
    },
    components:{
        Comment
    },
    props: {
        commentsData: {
            type: Object,
            required: true,
        }
    },

    mounted() {
        this.fetchComments()
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.user = user
                this.canComment = true
                // console.log(this.user.fullName);
            } else {
                this.user = null
                console.log("Signed Out");
            }
        });
    },
    created() {
        window.addEventListener('scroll', this.handleScroll);
    },
    unmounted() {
        window.removeEventListener('scroll', this.handleScroll);
    },
    methods: {
        splittingDateTimeAndTimezone(currentDateTime) {

            const DateTimeAndTimeZoneArray = currentDateTime.split(' ')

            // Data separation
            const dateArray = DateTimeAndTimeZoneArray[0]
            const splittedDateArray = dateArray.split('-')
            const day = splittedDateArray[0]
            const month = splittedDateArray[1]
            const year = splittedDateArray[2]


            // Time separation
            const timeArray = DateTimeAndTimeZoneArray[1]
            const splittedTimeArray = timeArray.split(':')
            const hours = splittedTimeArray[0]
            const mins = splittedTimeArray[1]

            // TimeZone
            const timeZone = DateTimeAndTimeZoneArray[2]

            return { day, month, year, hours, mins, timeZone }

        },
        commentsEnableDisable(trueOrFalse) {
            if (trueOrFalse == 'disable') {
                console.log("Comments shall be disabled");
                this.canComment = false
                this.commentInputPlaceholder = "Please wait a minute to comment again"
            }
            else if (trueOrFalse == 'enable') {
                console.log("Comments shall be enabled");
                this.canComment = true
                this.commentInputPlaceholder = "You know what? I am gonna comment here RIGHT NOW!"
            }

        },
        addCommentIDtoUserDatabase(commentID) {
            console.log(commentID);
            console.log(this.user.uid);
            const userRef = doc(db, "users", this.user.uid);
            console.log(userRef);
            // Add the videoID to the addedVideosByUser in the user doc
            updateDoc(userRef, { commentsByUser: arrayUnion(commentID) })
                .then(() => { console.log("Comment Added in User Database"); })
                .catch((error) => {
                    console.error("Error updating value:", error);
                });

        },
        async addCommentIDtoVideoDatabase(commentID, commentObject) {
            const newCommentRef = doc(db, "youtubeVideos", this.youtubeVideoID, 'comments', commentID);
    

            await setDoc(newCommentRef, commentObject)
                .then(() => {
                    console.log("Comment Added in Video Database with ID", commentID);
                })
                .catch((error) => {
                    console.error("Error adding comment:", error);
                });
        },

        handleScroll() {
            const scrollPosition = window.scrollY + window.innerHeight;
            const totalHeight = document.documentElement.scrollHeight;

            if (scrollPosition >= totalHeight) {
                // User has reached the bottom
                console.log("User reached the bottom");
                // User has reached the bottom, fetch the next batch of comments
                // this.fetchComments();
                // Call your function or perform any action here
                // this.myFunction();
            }
        },

        async fetchComments() {
            // const querySnapshot = await getDocs(collection(db, "youtubeVideos", this.youtubeVideoID, "comments"));

            let queryRef;

            if (this.lastFetchedCommentID) {
                queryRef = query(
                    collection(db, "youtubeVideos", this.youtubeVideoID, "comments"),
                    orderBy("likesCount"),
                    // startAfter(this.lastFetchedCommentID),
                    // limit(2)
                );
            } else {
                queryRef = query(
                    collection(db, "youtubeVideos", this.youtubeVideoID, "comments"),
                    orderBy("createdAt"),
                    // limit(2)
                );
            }

            const querySnapshot = await getDocs(queryRef);

            if (querySnapshot.empty) {
                return;
            }

            const processedComments = []; // Temporary array for storing processed comments

            await Promise.all(
                querySnapshot.docs.map(async (commentDoc) => {
                    const commentObject = commentDoc.data();

                    const commentorRef = doc(
                        db,
                        "users",
                        commentObject.commentorID,
                        "userDetails",
                        "userBasicInfo"
                    );

                    const commentorBasicInfoSnapshot = await getDoc(commentorRef);
                    const commentorData = commentorBasicInfoSnapshot.data();

                    if (commentorBasicInfoSnapshot.exists()) {
                        commentObject.addedByUserName = commentorData.displayName.split(" ")[0] + " " + commentorData.displayName.split(" ")[commentorData.displayName.split(" ").length-1];
                        commentObject.addedByUserProfilePic = commentorData.userProfilePic;
                    } else {
                        commentObject.addedByUserName = "Deleted User";
                        commentObject.addedByUserProfilePic =
                            "src/assets/videoPageAssets/blank_user.png";
                    }

                    processedComments.push(commentObject);
                })
            );

            this.fetchedComments = processedComments; // Assign the processed comments to the fetchedComments property
        },
        
        commentButtonClicked() {
            // this.commentsEnableDisable('disable')
            // setTimeout(() => { this.commentsEnableDisable('enable') }, 60000);

            let newComment =
            {
                commentID: null,
                commentorID: null,
                commentText: "",
                likesCount: 0,
                dateTime: { day: 9 },
                edited: false,
                reportCount: 0,
            }



            newComment.commentorID = this.user.uid
            newComment.commentText = this.userInputCommentText
            this.userInputCommentText = ""

            const dateObject = new Date();
            const createdAt = dateObject.getTime()
            const year = dateObject.getUTCFullYear();
            const month = dateObject.getUTCMonth() + 1
            const day = dateObject.getUTCDate()
            const hour = dateObject.getUTCHours()
            const minute = dateObject.getUTCMinutes()

            newComment.commentID = `${this.youtubeVideoID}*#*${this.user.uid}#${crypto.randomUUID().replace(/-/g, '')}`;

            newComment.dateTime = { day, month, year, hour, minute, timeZone: 'UTC'}
            newComment.createdAt = createdAt
            this.userComments.unshift(newComment)



            this.addCommentIDtoUserDatabase(newComment.commentID)
            this.addCommentIDtoVideoDatabase(newComment.commentID, newComment)



            // Retrieve and Format the Date
            // commentDateTime will be the property name storing an object of the data
            // const locale = Intl.DateTimeFormat().resolvedOptions().locale; // "en-GB" and other 
            // const timeOptions = {
            //     day: '2-digit',
            //     month: '2-digit',
            //     year: 'numeric',
            //     hour: '2-digit',
            //     minute: '2-digit',
            //     timezone: 'UTC' };
            //     const localDateTime = new Date(Date.UTC(year, month - 1, day, hours, minutes)).toLocaleString(locale, timeOptions);
            // const formattedLocalDateTime = localDateTime.replace(/[/]/g, '-')
            //     console.log(formattedLocalDateTime);

        },


        deleteComment(theArray, index){
            console.log('Deleted Comment Index: ', index)
            theArray.splice(index, 1)
        },
    },
}


</script>

<style>
.commentSectionDiv {
    margin: 1rem;
    min-height: 50vh;
    color: var(--black);
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 15rem;
}

.commentsHeader {
    /* flex: 1; */
    /* justify-content: center; */
    margin-block: 2rem;
}


/* COMMENT INPUT  */
.commentInputAreaDiv {
    width: 100%;
    flex: 1;
    justify-content: center;
}

.commentInputUserProfilePic {
    margin-inline: 1rem;
    width: 2rem;
    height: 2rem;
    border-radius: 100%;
}

.commentInputDiv {
    flex-direction: column;
    align-items: flex-end;
    width: 45%;
}

.commentTextInput {
    width: 100%;
    max-height: 7rem;
    font-size: 1rem;
    resize: none;
}

.commentButton {
    margin-block: 1rem;
    width: 40%;

}




/* COMMENTS AREA */

.commentsAreaDiv {
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    max-width: 50%;
}

.eachCommentDiv {
    flex-direction: column;
    margin-block: 1rem;
    width: 100%;

    position: relative;

    padding-right: 2rem;
}


</style>