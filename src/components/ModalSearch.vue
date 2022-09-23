<template>
    <input ref="searchModalElement" type="checkbox" id="my-modal-1" class="modal-toggle" />
    <div class="modal">
        <div class="modal-box relative h-full p-4 pt-16">
            <label for="my-modal-1" class="bg-primary btn btn-sm btn-circle absolute right-4 top-4">✕</label>
            <div class="overflow-scroll mt-4">
                <div class="flex">
                    <input v-model="search" placeholder="Search on youtube" type="text" class="h-10 w-full p-2 bg-secondary bg-opacity-30 rounded-lg full font-mono" />
                    <button @click="getSearch(search)" :disabled="search.length < 2" class="ml-4" v-if="!store.searchIsLoading">
                        <MagnifyingGlassIcon v-if="search.length < 2" class="h-10 w-10 bg-secondary btn-circle p-2 opacity-20" />
                        <MagnifyingGlassIcon v-else class="h-10 w-10 bg-secondary btn-circle p-2 bg-opacity-30" />
                    </button>
                    <Loader v-else />
                </div>

                <!-- <div class="mx-1" v-for="(suggestion, index) in suggestions" :key="index">
                    <div class="my-2 text-gray-400" @click="getSearch(suggestion)">
                        {{ suggestion }}
                    </div>
                    <hr />
                </div> -->
                <div @click="songClicked(song, index)" v-for="(song, index) in searchResults" :key="index" class="flex my-4">
                    <img class="w-24 rounded" :src="song.artwork" alt="" />
                    <div class="ml-4">
                        <div class="text-sm">
                            {{ song.title }}
                        </div>
                        <div class="text-sm text-gray-400">
                            {{ song.artist }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <label for="my-modal-1" class="modal-button">
        <MagnifyingGlassIcon class="h-6 w-6 mx-4 text-primary" />
    </label>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { MagnifyingGlassIcon } from "@heroicons/vue/24/solid";
import axios from "axios";
import { Song } from "../types";
import { store } from "../store";
import Loader from "./Loader.vue";

const searchModalElement = ref<HTMLInputElement | null>(null);
const search = ref("Cascada");
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

const getSearch = async (searchValue: string) => {
    store.searchIsLoading = true;
    search.value = searchValue;
    suggestions.value = [];
    let { data } = await axios.get("/.netlify/functions/getSearch?search=" + searchValue);
    console.log(data);
    searchResults.value = data;
    store.searchIsLoading = false;
};

const songClicked = (song: Song, index: number) => {
    store.songIndex = index;
    if (searchModalElement.value) searchModalElement.value.checked = false;
    store.loadSong(song);
    store.currentPlaylist = { name: search.value, playlist: [song] };
    store.songIndex = 0;
};
</script>
