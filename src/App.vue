<template>
    <div data-theme="halloween" class="bg-black flex-col flex h-screen">
        <div class="p-4 flex items-center justify-between">
            <div class="text-2xl">Auditere 🎧</div>
            <div class="flex">
                <modal-search></modal-search>
                <modal-queue></modal-queue>
                <modal-playlist></modal-playlist>
            </div>
        </div>
        <div class="flex-1 flex mt-8 flex-col items-center">
            <div class="flex justify-center">
                <img :src="store.currentSong.artwork" class="max-h-[225px] rounded-lg" />
            </div>
            <div class="w-[300px] text-white font-bold mt-8">{{ store.currentSong.title }}</div>
            <div class="w-[300px] text-gray-400 font-bold">{{ store.currentSong.artist }}</div>
            <div class="w-4/5" v-if="!store.songIsLoading">
                <input v-model="currentTime" type="range" min="0" :max="store.duration" class="range-primary range range-xs mt-8" />
                <div class="flex justify-between">
                    <div class="font-mono">{{ formatTime(currentTime) }}</div>
                    <div class="font-mono">{{ formatTime(store.duration) }}</div>
                </div>
            </div>
            <div class="w-4/5 mt-8 flex justify-around" v-if="!store.songIsLoading">
                <BackwardIcon v-if="store.songIndex == 0" class="h-12 w-12 bg-secondary rounded-full p-3 opacity-40" />
                <BackwardIcon v-else @click="nextSong(false)" class="h-12 w-12 bg-secondary rounded-full p-3" />

                <PlayIcon @click="play(true)" v-if="!store.isPlaying" class="h-12 w-12 bg-primary rounded-full p-3" />
                <PauseIcon @click="play(false)" v-else class="h-12 w-12 bg-primary rounded-full p-3" />

                <ForwardIcon v-if="store.songIndex == store.currentPlaylist.playlist.length - 1" class="h-12 w-12 bg-secondary rounded-full p-3 opacity-40" />
                <ForwardIcon v-else @click="nextSong(true)" class="h-12 w-12 bg-secondary rounded-full p-3" />
            </div>
            <Loader v-else class="mt-16" />
            <audio @ended="nextSong(true)" class="hidden" ref="audio" controls @canplaythrough="onCanplaythrough" @timeupdate="timeUpdate" @durationchange="durationUpdate"></audio>
        </div>
    </div>
</template>

<script setup lang="ts">
import { PlayIcon } from "@heroicons/vue/24/solid";
import { PauseIcon } from "@heroicons/vue/24/solid";
import { ForwardIcon } from "@heroicons/vue/24/solid";
import { BackwardIcon } from "@heroicons/vue/24/solid";
import { ref, watch, toRef } from "vue";
import Loader from "./components/Loader.vue";
import { store } from "./store";
import { Playlist, Song } from "./types";
import ModalPlaylist from "./components/ModalPlaylist.vue";
import ModalQueue from "./components/ModalQueue.vue";
import ModalSearch from "./components/ModalSearch.vue";

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
</style>
