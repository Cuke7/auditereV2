<template>
    <input type="checkbox" id="my-modal-1" class="modal-toggle" v-model="open" />

    <label for="my-modal-1" class="modal cursor-pointer">
        <label class="modal-box relative bg-black" for="">
            <div class="flex flex-col justify-center items-center">
                <input @keyup.enter="getSearch" ref="input" v-model="search" placeholder="Search on youtube" type="text" class="h-10 w-full p-2 border-2 border-white bg-black rounded-lg full font-mono" />

                <Loader class="mt-4" v-if="store.searchIsLoading" />
            </div>

            <div @click="songClicked(song, index)" v-for="(song, index) in searchResults" :key="index" class="flex my-4">
                <song-component :song="song" />
            </div>
        </label>
    </label>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import axios from "axios";
import { Song } from "../types";
import { store } from "../store";
import Loader from "./Loader.vue";
import SongComponent from "./SongComponent.vue";

const open = ref(false);
const input = ref<HTMLInputElement | null>(null);

watch(open, () => {
    input.value?.focus();
});

const searchModalElement = ref<HTMLInputElement | null>(null);
const search = ref("");
const suggestions = ref([]);
const searchResults = ref([] as Song[]);

// watch(search, async (newSearch) => {
//     searchResults.value = [];
//     if (newSearch.length > 3) {
//         try {
//             let { data } = await axios.get("/.netlify/functions/getSuggestions?search=" + newSearch);
//             suggestions.value = data.slice(0, 5);
//         } catch (error) {
//             console.log(error);
//         }
//     } else {
//         suggestions.value = [];
//     }
// });

const getSearch = async () => {
    store.searchIsLoading = true;
    suggestions.value = [];
    let { data } = await axios.get("/.netlify/functions/getSearch?search=" + search.value);
    searchResults.value = data;
    store.searchIsLoading = false;
};

const songClicked = (song: Song, index: number) => {
    open.value = false;
    store.songIndex = index;
    if (searchModalElement.value) searchModalElement.value.checked = false;
    store.loadSong(song);
    store.currentPlaylist = { name: search.value, playlist: [song], url: "" };
    store.songIndex = 0;
    search.value = "";
};
</script>
