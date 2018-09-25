<template>
<div class="ui segment" v-if="isModify">
  <div class="ui form">
      <div class="field"><label>原字詞</label><input type="text" v-model="origin" /></div>
      <div class="field"><label>轉換字詞</label><input type="text" v-model="derived" /></div>
    <h4 class="ui dividing header">排除規則</h4>
      <div class="ui basic label" v-for="(don, jdx) in dont" :key="`label${index}-${jdx}`">
        {{ don }}
        <i class="delete icon" @click="dontDelete(jdx)"></i>
      </div>
      <div class="ui transparent icon input">
        <input type="text" placeholder="新增" v-model.trim="buffer">
        <i class="add link icon" @click="dontAppend"></i>
      </div>
      <div class="ui pointing above red basic label" v-show="isValid === false">排除規則須包含原字詞</div>
    <div class="ui divider"></div>
      <div class="ui circular button" @click="changeCancel">取消</div>
      <div class="ui green circular button" @click="changeComplete">完成</div>
  </div>
</div>
<div class="ui card" v-else>
  <div class="content">
    <div class="header" v-if="origin === ''">[無規則]</div>
    <div class="header" v-else>{{ origin }}<i class="arrow right icon" style="margin-left: 9px"></i>{{ derived }}</div>
  </div>
  <div class="content" v-if="dont.length > 0">
    <h4 class="ui sub header">排除規則</h4>
    <div class="ui basic label" v-for="(don, jdx) in dont" :key="`label${index}-${jdx}`">{{ don }}</div>
  </div>
  <div class="extra content">
    <div class="ui blue circular button" @click="visibleModify">修改</div>
    <div class="ui fluid popup">
      <div class="ui basic segment">
        <div class="ui form">
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import _ from 'lodash';

export default {
  name: 'rule',
  props: [ 'rule', 'index' ],
  data() {
    return {
      origin:  '',
      derived: '',
      dont: [],
      buffer: '',
      isModify: false
    }
  },
  created() {
    this.setInitial()
  },
  computed: {
    isValid() {
      const app = this
      if (app.buffer.length === 0)
        return true
      return app.buffer.includes(app.origin)
    }
  },
  methods: {
    visibleModify() {
      this.isModify = !this.isModify
    },
    setInitial() {
      const app = this
      app.origin  = app.rule[0]
      app.derived = app.rule[1]
      app.dont    = app.rule[2]
    },
    changeCancel() {
      const app = this
      app.setInitial()
      app.visibleModify()
    },
    changeComplete() {
      const app = this
      app.visibleModify()
      app.$emit('updateRule', app.index, [app.origin, app.derived, app.dont])
    },
    dontAppend() {
      const app = this
      if (app.buffer.length > 0 && app.isValid) {
        app.dont   = _.concat(app.dont, app.buffer)
        app.buffer = ''
      }
    },
    dontDelete(jdx) {
      const app = this
      app.dont = _.remove(app.dont, (d, i) => i !== jdx)
    }
  }
}
</script>
