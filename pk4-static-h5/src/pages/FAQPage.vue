<template>
  <div class="q-pa-md">
    <q-list>
      <q-expansion-item
        v-for="(faq, index) in faqList"
        :key="index"
        :label="faq.question"
        default-opened
        header-class="bg-brandgrey text-white rounded-borders q-mt-sm"
      >
        <q-card class="bg-brandgrey text-brandgrey">
          <q-card-section>
            {{ faq.answer }}
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

import { api } from "boot/axios";
const faqPage = ref("");
const faqList = ref([]); // This will store the structured FAQ data

// Function to parse the HTML and extract questions & answers
const parseFAQ = () => {
  if (!faqPage.value) return;

  const parser = new DOMParser();
  const doc = parser.parseFromString(faqPage.value, "text/html");

  const faqItems = [];
  const divs = doc.body.children;

  let currentQuestion = "";
  for (const div of divs) {
    const firstChild = div.children[0];
    const secondChild = div.children[1];

    if (firstChild && secondChild) {
      currentQuestion = firstChild.innerText.trim();
      faqItems.push({
        question: currentQuestion,
        answer: secondChild.innerText.trim(),
      });
    }
  }

  faqList.value = faqItems;
};

const getFAQDetails = () => {

  const platformApiUrl = "/opt-session/promo/page";
  api
    .get(platformApiUrl)
    .then((res) => {
      if (res.code === 0) { 
        var promoItems = res.data;
        console.log(promoItems)
        promoItems.forEach(element => {
          console.log(element)
          if (element.promoCode === 'pak-faq') {
            faqPage.value = element.pageContent
            console.log(faqPage.value)
            parseFAQ();
          }
        });
      }
    })
    .catch((e) => {
    });
};
onMounted(() => {
  getFAQDetails();
})
</script>

<style lang="scss" scoped>
:deep(.q-expansion-item__container .q-item__label) {
  font-weight: 700;
}
:deep(.q-expansion-item__toggle-icon) {
    font-size: 14px;
    padding: 5px;
    background: #252C46;
    border-radius: 6px;
    fill: #B3BEC0;
}
:deep(.q-expansion-item__content > .q-card) {
  border-radius: 6px;margin: 10px 0;
  font-weight: 400;
    padding: 15px;
    
}
</style>
