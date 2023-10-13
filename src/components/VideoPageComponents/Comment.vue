<template>


        <template v-if="showConfirmationPopup">
            <confirmationPopup :msg="confirmationMsg"
            @noClicked="this.showConfirmationPopup = false"
            @yesClicked="commentFunctionToRun" />
        </template>
        
        
        <div class="commentInfoDiv basic_flexbox">
            
            <img :src="user ? user.photoURL : comment.addedByUserProfilePic"
            alt=""
            class="commentProfilePic">
            
            <span class="commentUserName">
                {{ user ? user.displayName : comment.addedByUserName }}
            </span>
        <span class="commentDateTime">
            {{ comment.dateTime.day + "-" + comment.dateTime.month + "-" + comment.dateTime.year + " " +
                comment.dateTime.hour + ":" + comment.dateTime.minute }}
        </span>
    </div>
    
    
    <div class="commentTextDiv basic_flexbox">

        <template v-if="canEdit">

            <div class="editingCommentDiv basic_flexbox">

                
                
                <textarea minlength="1" type="text" class="general_textInput commentEditingInput"
                 v-model="editedCommentText"></textarea>

                <div class="saveCancelButtons basic_flexbox">
                    <button class="general_btns" @click="saveEditedComment" :disabled="editedCommentText == previousCommentText || editedCommentText.length<1">Save</button>
                    <button class="general_btns" @click="canEdit=false">Cancel</button>
                </div>
            </div>
        </template>

        <span v-if="!canEdit"
        class="commentText basic_flexbox">
        {{ editedCommentText }}
    </span>
</div>



<button class="commentOptionsButton material-symbols-outlined"
@click="showCommentOptions = !showCommentOptions">more_vert</button>

<div class="commentOptionsDiv basic_flexbox" v-if="showCommentOptions">
    <template v-if="thisCommentIsOfTheCurrentUser">
        <button @click="editCommentButtonClicked()">Edit</button>
        <button @click="deleteCommentButtonClicked()">Delete</button>
    </template>

    
    <template v-else>
            <button>Report</button>
            
        </template>
    </div>
</template>

<script>
import { auth, providerGoogle, db, storage } from '@/firebase/firebase'
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import { collection, addDoc, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, arrayUnion, query, orderBy, limit, } from "firebase/firestore";

import confirmationPopup from './confirmationPopup.vue'

export default {
    components: { confirmationPopup },
    data() {
        return {

            
            showConfirmationPopup: false,
            confirmationMsg: "Are you Sure?",

            commentorID: this.comment.commentID.split("*#*")[1].split("#")[0],

            commentFunctionToRun: null,
            canEdit: false,


            showCommentOptions:false,

            thisCommentIsOfTheCurrentUser: this.currentUserID == this.comment.commentID.split("*#*")[1].split("#")[0],

            previousCommentText:"",
            editedCommentText:"",
        }
    },
    props: {
        comment: {
            type: Object,
            required: true,
        },
        user: {
            // type: Object,
            required: true,
        },
        currentUserID: {
            // type: Object,
            required: true,
        },
        otherData: {
            type: Object,
            required: false,
        },
    },
    mounted() {
        this.editedCommentText = this.comment.commentText
        this.previousCommentText = this.comment.commentText
        // console.log(this.otherData)
        // console.log(this.user.uid);
        // this.commentorID = this.comment.commentID.split("*#*")[1].split("#")[0]
        // if (this.currentUserID == this.commentorID) {
        //     this.thisCommentIsOfTheCurrentUser = true
        //     console.log(this.thisCommentIsOfTheCurrentUser);
        // }
        // else {
        //     console.log(this.thisCommentIsOfTheCurrentUser);

        // }
    },
    methods: {
        commentOptionsClicked() {
            console.log("clicked");
        },




        deleteCommentButtonClicked() {
            this.showConfirmationPopup = true
            this.commentFunctionToRun = this.deleteComment

        },
        editCommentButtonClicked() {
            // this.showConfirmationPopup = true
            // this.commentFunctionToRun = this.editComment
            this.editComment()
        },
        editComment() {
            this.showConfirmationPopup = false
            console.log("Editing comment", this.comment.commentID);
            this.canEdit = true

            

        },

        async saveEditedComment(){
            // console.log(this.otherData.youtubeVideoID);
            const commentRef = doc(db, "youtubeVideos", this.otherData.youtubeVideoID, "comments", this.comment.commentID)
            // console.log(commentRef);
            
            if (this.editedCommentText!=this.comment.commentText){
                await updateDoc(commentRef, {commentText:this.editedCommentText});
                
                this.previousCommentText = this.editedCommentText
                console.log(this.previousCommentText);
                console.log("value changed");
            }
            else{
                console.log("not changed");
                
            }
            
            
            this.canEdit = false
            
            
            console.log("Saved!");

        },
        async deleteComment() {
            this.showConfirmationPopup = false
            
            const commentRef = doc(db, "youtubeVideos", this.otherData.youtubeVideoID, "comments", this.comment.commentID)

            await deleteDoc(commentRef);
            this.$emit('commentDeleted')
        },
    },
}


</script>

<style>
.commentInfoDiv {
    justify-content: flex-start;
    align-items: center;
    margin-bottom: .5rem;

}


.commentProfilePic {
    width: 2rem;
    height: 2rem;
    border-radius: 100%;

}

.commentInfoDiv span {
    margin-inline: .5rem;

}

.commentUserName {
    font-size: 1rem;
    font-weight: 500;
}

.commentDateTime {
    font-size: .7rem;
    opacity: .7;
}


.commentTextDiv {
    margin: .5rem;
    /* flex-wrap: wrap; */
}

.commentText {
    word-break: break-word;
    font-size: 1rem;
}

.commentOptionsButton {
    background-color: transparent;
    cursor: pointer;
    padding: .3rem;
    border-radius: 100%;
    border: none;
    color: var(--black);
    position: absolute;
    right: 0;
    top: 0;
    margin-block: auto;

    user-select: none;
    opacity: .3;

}

.commentOptionsButton:hover {
    opacity: 1;
    background-color: hsl(var(--black-hue), var(--black-saturation), var(--black-lightness), 0.05);

}

.commentOptionsDiv {
    background-color: hsl(var(--white-hue), var(--white-saturation), calc(var(--white-lightness)*2));
    flex-direction: column;
    border-radius: .5rem;
    position: absolute;
    right: -5rem;
    top: 0rem;
}
.commentOptionsDiv button{
    border-radius: .5rem ;
    color: var(--black);
    background-color: transparent;
    border: none;
    padding: 1rem;
}
.commentOptionsDiv button:hover{
    /* opacity: .7; */
    cursor: pointer;
    background-color: hsl(var(--white-hue), var(--white-saturation), calc(var(--white-lightness)*.7));
}



.editingCommentDiv{
    flex-direction: column;
    align-items: flex-end;
    width: 100%;
}
.commentEditingInput{
    resize: vertical;
    white-space: pre-line;
    width: 100%;
    font-size: 1rem;

/* padding: 0; */
}

.saveCancelButtons{
    margin-block: .5rem;
    
}
.saveCancelButtons button{
    font-size: .7rem;
    margin-left: .5rem;
}
</style>