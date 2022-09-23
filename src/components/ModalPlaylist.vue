<template>
    <input ref="playlistModalElement" type="checkbox" id="my-modal-3" class="modal-toggle" />
    <div class="modal">
        <div class="modal-box relative h-full p-4 pt-16">
            <label for="my-modal-3" class="bg-primary btn btn-sm btn-circle absolute right-4 top-4">✕</label>
            <div class="flex">
                <input v-model="playlistUrl" placeholder="Youtube playlist url" type="text" class="w-full font-mono rounded-lg bg-secondary bg-opacity-30 p-2" />
                <button v-if="!store.playlistIsLoading" @click="loadPlaylist()" class="ml-4"><PlusIcon class="h-10 w-10 bg-secondary bg-opacity-30 btn-circle p-2" /></button>
                <Loader v-else />
            </div>
            <div class="mt-8">
                <div v-for="(playlist, index) in store.savedPlaylists" :key="index" class="flex justify-between items-center bg-secondary rounded-lg bg-opacity-30 p-4 my-4">
                    <div class="font-bold txt-lg">{{ playlist.name }}</div>
                    <PlayIcon class="w-8 h-8" @click="playlistClicked(playlist)" />
                </div>
            </div>
        </div>
    </div>
    <label for="my-modal-3" class="modal-button">
        <MusicalNoteIcon class="h-6 w-6 mx-4 text-primary" />
    </label>
</template>

<script lang="ts" setup>
import { store } from "../store";
import { ref } from "vue";
import { Playlist } from "../types";
import Loader from "./Loader.vue";
import { PlusIcon } from "@heroicons/vue/24/solid";
import axios from "axios";
import { PlayIcon } from "@heroicons/vue/24/solid";
import { MusicalNoteIcon } from "@heroicons/vue/24/solid";

const playlistModalElement = ref<HTMLInputElement | null>(null);
const playlistUrl = ref("");
// const playlistUrl = ref("https://www.youtube.com/playlist?list=PLY80CRqvcxEXtmbMSJDqIK4uk_FB3j5I8");

const playlistClicked = async (playlist: Playlist) => {
    let updatedPlaylist = await store.loadPlaylist(playlist.url);
    if (updatedPlaylist) {
        if (playlistModalElement.value) playlistModalElement.value.checked = false;
        store.currentPlaylist = updatedPlaylist;
        store.loadSong(updatedPlaylist.playlist[0]);
    }
};

const loadPlaylist = async () => {
    let playlist = await store.loadPlaylist(playlistUrl.value);
    if (playlist) {
        store.savedPlaylists.push(playlist);
        localStorage.setItem("playlists", JSON.stringify(store.savedPlaylists));
        playlistUrl.value = "";
    }
};
</script>
