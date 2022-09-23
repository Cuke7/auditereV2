<template>
    <input ref="queueModal" type="checkbox" id="queueModal" class="modal-toggle" />
    <div class="modal">
        <div class="modal-box relative h-full p-4 flex flex-col">
            <div class="text-lg font-bold">{{ store.currentPlaylist.name }}</div>
            <label for="queueModal" class="bg-primary btn btn-sm btn-circle absolute right-4 top-4">✕</label>
            <div class="overflow-scroll mt-4">
                <div @click="songClicked(song, index)" v-for="(song, index) in store.currentPlaylist.playlist" :key="index" class="flex my-4">
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
    <label v-if="store.currentPlaylist.playlist.length > 0" for="queueModal" class="modal-button">
        <QueueListIcon class="h-6 w-6 mx-4 text-primary" />
    </label>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { QueueListIcon } from "@heroicons/vue/24/solid";
import { store } from "../store";
import { Song } from "../types";

const queueModal = ref<HTMLInputElement | null>(null);

const songClicked = (song: Song, index: number) => {
    store.songIndex = index;
    if (queueModal.value) queueModal.value.checked = false;
    store.loadSong(song);
};
</script>
