<template>
  <div class="config">
    <div v-show="conf === null">Loading...</div>
    <div v-show="conf !== null">
      <ul>
        <li v-for="key in Object.keys(conf)" :key=key>
          <label>{{key}}:
            <input v-if="typeof conf[key] === 'boolean'"
              type="checkbox"
              :checked="conf[key]"
              @change="updateConf({ [key]: conf[key] })"
              >
            <input v-else
              :type="typeof conf[key] === 'number' ? 'number' : 'text'"
              :value="conf[key]"
              @change="updateConf({ [key]: conf[key] })"
              >
          </label>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { useChannelConfig } from '../firebase/hooks';

export default defineComponent({
  name: 'Config',
  setup() {
    const testData = {
      guildID: '595255890685198376',
      channelID: '595255890685198378',
    };
    const [conf, updateConf] = useChannelConfig(testData);

    return {
      conf,
      updateConf,
    };
  },
});
</script>

<style scoped>
ul {
  list-style: none;
}
</style>
