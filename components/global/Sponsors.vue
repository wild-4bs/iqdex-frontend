<template>
    <div class="sponsors">
        <div class="wrapper grid grid-cols-2 gap-6">
            <div class="sponsor" v-for="(category, i) in logoCategories" :key="i">
                <div class="title mb-3">
                    <h3 class="capitalize font-medium">{{ category.category }}</h3>
                </div>
                <div class="logos grid gap-4 grid-cols-2">
                    <div class="logo" v-for="(logo, i) in category.logos" :key="i">
                        <img :src="logo" alt="Logo" width="50px" height="auto">
                    </div>
                </div>
            </div>
        </div>
        <div class="contacts mt-4">
            <div class="phone flex items-center gap-2">
                <div class="icon">
                    <Icon name="ic:outline-phone" class="text-gray-500 text-2xl" />
                </div>
                <div class="value text-sm text-gray-200">
                    <span>+964 7806 666 661 - +964 7702 444 844</span>
                </div>
            </div>
            <div class="phone flex items-center gap-2">
                <div class="icon">
                    <Icon name="ic:twotone-mail-outline" class="text-gray-500 text-2xl" />
                </div>
                <div class="value text-sm text-gray-200">
                    <span>info@unitedevents.iq - ATSO@unitedevents.iq</span>
                </div>
            </div>
        </div>
        <div class="social flex items-center gap-3 mt-2">
            <div class="icon">
                <a href="https://www.facebook.com/share/15kGcCBb7c/?mibextid=wwXIfr" target="_blank">
                    <img src="@/assets/home/icons/facebook.png" alt="">
                </a>
            </div>
            <div class="icon">
                <a href="https://www.instagram.com/iqdex.iq?igsh=ZTMzeHlmenp5cTV6" target="_blank">
                    <img src="~/assets/home/icons/instagram.png" alt="">
                </a>
            </div>
            <div class="icon">
                <a href="https://www.linkedin.com/showcase/iraq-defense-exhibition-iqdex/" target="_blank">
                    <img src="@/assets/home/icons/linkedin.png" alt="">
                </a>
            </div>
        </div>
    </div>
</template>

<script setup>
import sponsor1 from "~/assets/home/logos/Sponsors/1.png"

import association1 from "~/assets/home/logos/Association/1.png"
import association2 from "~/assets/home/logos/Association/2.png"
import association3 from "~/assets/home/logos/Association/3.png"
import association4 from "~/assets/home/logos/Association/4.png"

import host1 from "~/assets/home/logos/Host/1.png"

import organized1 from "~/assets/home/logos/Organized/1.png"

import certificate1 from "~/assets/home/logos/Certificate/1.png"
import certificate2 from "~/assets/home/logos/Certificate/2.png"

import member1 from "~/assets/home/logos/Member/1.png"
import member2 from "~/assets/home/logos/Member/2.png"
import member3 from "~/assets/home/logos/Member/3.png"
import member4 from "~/assets/home/logos/Member/4.png"

const logoCategories = [
    {
        category: "sponsored by",
        logos: [sponsor1]
    },
    {
        category: "in association with",
        logos: [association1, association2, association3, association4],
    },
    {
        category: "host venue",
        logos: [host1],
    },
    {
        category: "Organized by",
        logos: [organized1],
    },
    {
        category: "ISO certificate",
        logos: [certificate1, certificate2],
    },
    {
        category: "Member of",
        logos: [member1, member2, member3, member4],
    },
]

</script>

<style scoped lang="scss">
.sponsors {
    padding: 20px;
    border-radius: 10px;
    background-color: rgba(49, 49, 49, 0.87);
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    color: white;

    @media (max-width: 1080px) {
        width: 100%;
        height: unset;
    }
}
</style>