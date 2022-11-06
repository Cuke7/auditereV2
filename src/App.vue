<template>
    <div data-theme="halloween" class="bg-slate-800 flex-col flex h-screen" id="app">
        <!-- <img class="absolute blur-xl h-full scale-100 -z-1" src="/bird.png" alt="" /> -->
        <!-- <div class="p-4 flex">
            <div class="text-2xl">Auditere 🎧</div>
            <div class="flex"> -->
        <!-- <modal-search></modal-search>
                <modal-queue></modal-queue> -->
        <!-- </div>
        </div> -->
        <!-- <div class="text-2xl flex">Auditere 🎧</div> -->
        <Player class="flex flex-1 py-4" />

        <div class="bg-transparent shadow-lg shadow-white p-6 flex justify-around">
            <label for="my-modal-1" class="modal-button">
                <MagnifyingGlassIcon class="h-6 w-6 mx-4 text-primary" />
            </label>
            <label v-if="store.currentPlaylist.playlist.length > 0" for="queueModal" class="modal-button">
                <QueueListIcon class="h-6 w-6 mx-4 text-primary" />
            </label>
            <label for="my-modal-4" class="modal-button"> <MusicalNoteIcon class="h-6 w-6 mx-4 text-primary" /></label>
        </div>
        <audio @ended="nextSong(true)" class="hidden" ref="audio" controls @canplaythrough="onCanplaythrough" @timeupdate="timeUpdate" @durationchange="durationUpdate"></audio>
        <modal-search></modal-search>
        <modal-queue></modal-queue>
        <modal-playlist></modal-playlist>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, toRef } from "vue";
import { store } from "./store";
import ModalPlaylist from "./components/ModalPlaylist.vue";
import ModalQueue from "./components/ModalQueue.vue";
import ModalSearch from "./components/ModalSearch.vue";
import Player from "./components/Player.vue";
import { MusicalNoteIcon } from "@heroicons/vue/24/solid";
import { MagnifyingGlassIcon } from "@heroicons/vue/24/solid";
import { QueueListIcon } from "@heroicons/vue/24/solid";

const audio = ref<HTMLAudioElement | null>(null);
watch(
    () => store.audioSrc,
    (newSrc) => {
        if (audio.value) audio.value.src = newSrc;
    }
);
watch(
    () => store.isPlaying,
    (setPlay) => {
        if (setPlay) if (audio.value) audio.value.play();
        if (!setPlay) if (audio.value) audio.value.pause();
    }
);

let localData = localStorage.getItem("playlists");
if (localData) {
    store.savedPlaylists = JSON.parse(localData);
}

const play = (setPlay: boolean) => {
    store.isPlaying = setPlay;
    if (setPlay) if (audio.value) audio.value.play();
    if (!setPlay) if (audio.value) audio.value.pause();
};

const currentTime = toRef(store, "currentTime");
watch(currentTime, (newVal) => {
    if (audio.value) {
        if (Math.abs(newVal - audio.value.currentTime) > 0.5) {
            audio.value.currentTime = newVal;
        }
    }
});

const onCanplaythrough = () => {
    store.songIsLoading = false;
    play(true);
};

const nextSong = (forward: boolean) => {
    if (forward) {
        if (store.songIndex < store.currentPlaylist.playlist.length - 1) {
            store.loadSong(store.currentPlaylist.playlist[store.songIndex + 1]);
            store.songIndex++;
        }
    } else {
        if (store.songIndex > 0) {
            store.loadSong(store.currentPlaylist.playlist[store.songIndex - 1]);
            store.songIndex--;
        }
    }
};

const timeUpdate = (event: any) => {
    store.currentTime = event.target.currentTime;
};

const durationUpdate = (event: any) => {
    store.duration = event.target.duration;
};

function formatTime(seconds: any) {
    let minutes = Math.floor(seconds / 60);
    minutes = Number(minutes >= 10 ? minutes : "0" + minutes);
    seconds = Math.floor(seconds % 60);
    seconds = seconds >= 10 ? seconds : "0" + seconds;
    return minutes + ":" + seconds;
}
</script>

<style>
input {
    outline: none;
}

#app {
    background-image: radial-gradient(circle, #1e293b, #201f2c, #1c161e, #130d11, #000000);
}
</style>
