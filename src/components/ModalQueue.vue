<template>
    <input type="checkbox" id="queueModal" class="modal-toggle" v-model="open" />

    <label for="checkbox" class="modal cursor-pointer modal-bottom">
        <label class="modal-box relative bg-black" for="">
            <div class="text-lg font-bold">{{ store.currentPlaylist.name }}</div>
            <div class="overflow-scroll mt-4">
                <div @click="songClicked(song, index)" v-for="(song, index) in store.currentPlaylist.playlist" :key="index" class="flex my-4">
                    <song-component :song="song" />
                </div>
            </div>
        </label>
    </label>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { store } from "../store";
import { Song } from "../types";
import SongComponent from "./SongComponent.vue";
const open = ref(false);

const queueModal = ref<HTMLInputElement | null>(null);

const songClicked = (song: Song, index: number) => {
    open.value = false;
    store.songIndex = index;
    if (queueModal.value) queueModal.value.checked = false;
    store.loadSong(song);
};
</script>
