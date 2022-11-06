<template>
    <!-- Put this part before </body> tag -->
    <input type="checkbox" id="my-modal-4" class="modal-toggle" />
    <label for="my-modal-4" class="modal cursor-pointer modal-bottom">
        <label class="modal-box relative bg-black" for="">
            <!-- <label for="my-modal-3" class="bg-primary btn btn-sm btn-circle absolute right-4 top-4">✕</label> -->
            <div class="flex flex-col items-center">
                <input v-model="playlistUrl" @keyup.enter="loadPlaylist" placeholder="Youtube playlist url" type="text" class="w-full font-mono bg-black border-white border-2 bg-opacity-20 rounded-lg p-2" />
                <!-- <button v-if="!store.playlistIsLoading" @click="loadPlaylist()" class="ml-4"><PlusIcon class="h-10 w-10 bg-primary btn-circle p-2" /></button> -->
                <Loader class="mt-8" v-if="store.playlistIsLoading" />
            </div>
            <div class="mt-8">
                <div v-for="(playlist, index) in store.savedPlaylists" :key="index" class="flex justify-between items-center rounded-lg p-4">
                    <div class="font-bold txt-lg">{{ playlist.name }}</div>
                    <div class="flex items-center">
                        <TrashIcon class="w-6 h-6 mr-8" @click="store.removePlaylist(playlist)" />
                        <PlayIcon class="w-8 h-8" @click="playlistClicked(playlist)" />
                    </div>
                </div>
            </div>
        </label>
    </label>
</template>

<script lang="ts" setup>
import { store } from "../store";
import { ref } from "vue";
import { Playlist } from "../types";
import Loader from "./Loader.vue";
import { PlusIcon } from "@heroicons/vue/24/solid";
import { PlayIcon } from "@heroicons/vue/24/solid";
import { TrashIcon } from "@heroicons/vue/24/solid";

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
