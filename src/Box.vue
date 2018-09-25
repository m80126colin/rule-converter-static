<template>
<span :id="index" class="ui floating dropdown"><span :class="`char ${state}${clear ? ' clear' : ''}${(content !== result) ? ' diff': ''}`">{{ result }}</span><div class="menu">
  <div class="header">
    <i class="hand point right outline icon"></i>
    {{ table[state] }}
  </div>
  <div class="divider"></div>
  <div class="header">
    <i class="tags icon"></i>
    候選轉換字
  </div>
  <div class="scrolling menu">
    <div class="item" :data-value="box.content">
      <span class="ui basic label">原文字</span>{{ box.content }}
    </div>
    <div class="item" v-for="(rule, idx) in list" :key="`rule${idx}`" :data-value="rule.derived">
      <span class="ui basic label">{{ rule.origin }}<i class="arrow right icon" style="margin-left: 9px;"></i>{{ rule.derived }}</span>
      {{ rule.derived }}
    </div>
  </div>
</div></span>
</template>

<script>
import _ from 'lodash';

export default {
  name: 'box',
  props: [ 'box', 'clear', 'converter', 'table', 'index' ],
  data() {
    return {
      state:   'none',
      content: '',
      result:  ''
    }
  },
  mounted() {
    const app = this
    app.renew()
  },
  updated() {
    const app = this
    $(`#${app.index}.ui.dropdown`).dropdown({
      action: (text, value) => {
        app.state  = 'manual'
        app.result = value
      },
      on: 'hover'
    })
  },
  watch: {
    box() {
      this.renew()
    }
  },
  computed: {
    list() {
      const app = this
      return app.converter.table[app.content] || []
    }
  },
  methods: {
    renew() {
      const app = this
      _.map(['state', 'content', 'result'], field => app[field] = app.box[field])
    }
  }
}
</script>

<style>
</style>