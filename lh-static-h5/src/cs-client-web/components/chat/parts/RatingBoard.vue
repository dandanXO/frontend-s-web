<template>
  <div class="rating-section-board">
    <p>{{ props.t('rate_customer_experience') }}</p>
    <div class="row text-left flex-center" style="justify-content: flex-start;gap:8px;align-items: center;">
      <q-rating
          :class="((rating_num <= 1) ? 'red-star' : (rating_num <=3) ? 'normal-star' : (rating_num >= 4) ? 'good-star' : '' )"
          v-model="rating_num"
          size="2.4em"
          :color-selected="rating_color"
          color="grey"
          @click="updateRatingModel"
      />

      <div class="rating-score" style="align-items: center;display:flex;">
        {{ rating_num }}/5
      </div>
    </div>
    <div class=" row justify-start  text-center" style="margin-bottom:12px; margin-top:16px;">
      <label>{{ props.t('your_comment') }}</label>
      <textarea v-model="rating_comment" :placeholder="props.t('your_rating_label')"
                style="width: 100%;"
                maxlength="200"
                @blur="updateRatingModel"
                rows="5" cols="35">
            </textarea>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import {computed, ref} from "vue";

export default {
  name: 'RatingBoard',
  props: {
    rating_model: {
      type: Number,
    },
    t: {}
  },
  emits: ["updateRatingModel"],
  setup(props, {emit}) {
    const rating_num = ref(0);
    const rating_comment = ref("");

    const rating_color = computed(() => {
      if (rating_num.value >= 4) {
        return 'green';
      } else if (rating_num.value >= 3) {
        return 'yellow'
      } else if (rating_num.value >= 1) {
        return 'red'
      }
      return 'grey';
    })

    const updateRatingModel = () => {
      // console.log("updateRatingModel");
      emit("updateRatingModel", rating_num.value, rating_comment.value);
    }


    return {
      props,
      rating_color,
      updateRatingModel,
      rating_num,
      rating_comment
    }
  }
}
</script>
<style lang="scss">

.q-rating {

  &.red-star {
    color: red !important;
  }

  &.normal-star {
    color: yellow !important;
  }

  &.good-star {
    color: forestgreen !important;
  }

}
</style>
