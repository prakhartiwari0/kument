<template>
    <nav class="basic_flexbox">


        <div class="navLeftPart basic_flexbox">
            <img src="../../assets/k_logos/k_logo-transparent.png"
                 alt="">
        </div>


        <div class="basic_flexbox navRightPart">

            <div class="navLinksDiv basic_flexbox">
                <a href="#"
                   class="general_links">What is it?</a>
                <a href="#"
                   class="general_links">How it Works?</a>
            </div>

            <template v-if="!user">
                <button class="general_btns logInBtn"
                        @click="loginWithGoogleClicked">Google Login</button>
            </template>
            <template v-else>
                <div class="basic_flexbox profilePicDiv">
                    <img :src="user.photoURL"
                         alt="Profile_Pic"
                         @click="pfpClicked">
                    <button class="general_btns logOutBtn"
                            ref="logOutBtn"
                            @click="logOutButtonClicked">Logout</button>
                </div>
            </template>


        </div>

    </nav>
</template>

<script>

import { auth, providerGoogle, db, storage } from '@/firebase/firebase'
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import { collection, addDoc, doc, setDoc, getDoc } from "firebase/firestore";
// import { getStorage, ref, uploadBytes } from "firebase/storage";

export default {
    data() {
        return {
            user: null,
            showLogOutBtn: false,


        };
    },
    mounted() {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.user = user
            } else {
                this.user = null
            }
        });
    },
    methods: {

        // async uploadProfilePhoto(photoURL, userID) {
        //     const storage = getStorage();
        //     const storageRef = ref(storage, `usersFiles/${userID}/profile_pic`);

        //     try {
        //         const response = await fetch(photoURL);
        //         const blob = await response.blob();

        //         await uploadBytes(storageRef, blob);

        //         console.log("Profile photo uploaded successfully!");
        //     } catch (error) {
        //         console.error("Error uploading profile photo:", error);
        //     }
        // },

        loginWithGoogleClicked() {

            signInWithPopup(auth, providerGoogle)
                .then((result) => {
                    const user = result.user;
                    const userRef = doc(db, "users", user.uid, "userDetails", "userBasicInfo");

                    // Check if the user document exists
                    getDoc(userRef)
                        .then((docSnapshot) => {
                            if (docSnapshot.exists()) {
                                // console.log("User already exists, logging in...");
                            } else {
                                const displayName = user.displayName;

                                const userBasicInfo = {
                                    displayName,
                                    // email: user.email,
                                    userProfilePic: user.photoURL
                                }
                                // Create a new document with user data
                                setDoc(userRef, userBasicInfo)
                                    .then(() => {
                                    })
                                    .catch((error) => {
                                        console.error("Error creating user document:", error);
                                    });
                            }
                        })
                        .catch((error) => {
                            console.error("Error checking user document:", error);
                        });
                })
                .catch((error) => {
                    const errorMessage = error.message;
                    console.log(errorMessage);
                });
        },
        logOutButtonClicked() {
            signOut(auth).then(() => {
                console.log("Signed Out");
                // Sign-out successful.
            }).catch((error) => {
                console.log(error);
                // An error happened.
            });

        },
        pfpClicked() {
            if (this.showLogOutBtn == false) {
                this.$refs.logOutBtn.style.display = 'flex'
                this.showLogOutBtn = true
            }
            else {
                this.$refs.logOutBtn.style.display = 'none'
                this.showLogOutBtn = false

            }
        }
    },
};
</script>

<style>
nav {
    margin: 1rem;
    padding-block: .5rem;
    padding-inline: 2rem;
    border-radius: 2rem;
    justify-content: space-between;
    align-items: center;
}

nav>div {
    flex: 1;
}

.navLeftPart {
    padding: .5rem;
    max-width: 5rem;
    cursor: pointer;
}

.navLeftPart img {
    width: 100%;
}

.navRightPart {
    align-items: center;
}

.navLinksDiv {
    margin-left: auto;
}

.navLinksDiv a {
    margin-inline: 3rem;
}


.logInBtn {
    height: fit-content;
    padding: 1rem;
}


.profilePicDiv {
    max-width: 5rem;
    border-radius: 100%;
    position: relative;
    justify-content: center;
    align-items: center;
}

.profilePicDiv:hover {
    background-color: hsla(var(--k-pink-hue), var(--k-pink-saturation), var(--k-pink-lightness), 0.1);
}

.logOutBtn {
    display: none;
    position: absolute;
    bottom: -2.5rem;
    right: .7rem;

}

.profilePicDiv img {
    cursor: pointer;
    aspect-ratio: 1/1;
    padding: .5rem;
    border-radius: 100%;
    width: 100%;
}</style>