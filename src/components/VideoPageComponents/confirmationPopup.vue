<template>
    <dialog ref="confirmationPopup"
            class="confirmationPopupDialog general_modal">
        <span>{{ msg }}</span>
        <div class="yesnobuttonsdiv">
            <button class="yesbutton general_btns "
                    @click="$emit('yesClicked')">Yes</button>
            <button class="nobutton general_btns"
                    ref="nobutton"
                    @click="$emit('noClicked')">No</button>

        </div>
    </dialog>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    mounted() {
        this.$refs.confirmationPopup.showModal()
        this.$refs.nobutton.focus()
    },
    beforeUnmount(){
        this.$refs.confirmationPopup.close()

    },
    props: {
        msg: {
            type: String,
            required: true,
        },
    }
}

</script>

<style>
.confirmationPopupDialog {
    overflow-x: hidden;
    max-width: 30%;
    padding: 3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
}

.confirmationPopupDialog span {
    font-size: 1.5rem;
    font-weight: 500;
}

.yesnobuttonsdiv {
    margin: 1rem;
    display: flex;
    flex-direction: row;
    justify-content: center;
    --confirmation-red: rgb(204, 18, 18);
    --confirmation-green: rgb(9, 141, 24);

}

.yesnobuttonsdiv button {
    font-size: 1.3rem;
    min-width: 5rem;
    margin-inline: 1.3rem;
    /* transition: none; */
}

.yesbutton {
    color: white;
    border: var(--confirmation-red) solid 2px;
    background: none;
    background-color: var(--confirmation-red);
}

.yesbutton:hover {
    color: var(--confirmation-red);
    background-color: transparent;
    
}

.nobutton {
    color: white;
    border: var(--confirmation-green) solid 2px;
    background: none;
    background-color: var(--confirmation-green);
}

.nobutton:hover {
    color: var(--confirmation-green);
    background-color: transparent;

}</style>