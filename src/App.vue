<template>
<div class="ui grid" id="app">
<div class="one wide column"></div>
<div class="fourteen wide column">
  <div class="ui top attached icon menu">
    <a :class="((visible.filter) ? 'active ' : '') + 'link item'" @click="visibleFilter">
      <i class="filter icon"></i>
    </a>
    <a :class="((visible.input) ? 'active ' : '') + 'link item'"  @click="visibleInput">
      <i class="font icon"></i>
    </a>
  </div>
  <div class="ui attached segment" :hidden="!visible.filter">
    <h2 class="ui header">轉換規則</h2>
    <div class="ui right aligned basic segment">
      <div class="ui green icon button" @click="appendRule">
        新增規則
        <i class="ui add icon"></i>
      </div>
    </div>
    <div class="ui left aligned grid">
    <div class="four wide column" v-for="(r, idx) in rules" :key="`rule${idx}`">
      <rule :rule="r" :index="idx" @updateRule="updateRule" style="width: 100%"></rule>
    </div>
    </div>
  </div>
  <div class="ui bottom attached segment">
    <div :class="`ui ${(visible.input) ? 'two' : 'one'} column divided grid`">
      <div class="row">
        <div class="column">
          <div class="ui basic segment" :hidden="!visible.input" style="padding: 0; height: 100%">
            <textarea class="ui basic content segment" v-model="content" placeholder="輸入區域"></textarea>
          </div>
        </div>
        <div class="column">
          <div class="ui basic left aligned segment">
            <span v-for="p in example" :key="p[0]">
              <span :class="`ui char ${p[0]} empty circular label`"></span>
              {{ p[1] }}
            </span>
            <div class="ui right aligned basic segment">
              <div class="ui toggle checkbox">
                <input type="checkbox" name="clear" v-model="clear">
                <label>隱藏格式</label>
              </div>
            </div>
            <p v-for="(r, idx) in result" :key="`line${idx}`">
              <box v-for="(b, jdx) in r"
                :index="`obj${idx}-${jdx}`"
                :box="b"
                :clear="clear"
                :converter="converter"
                :table="state_table"
                :key="`obj${idx}-${jdx}`"></box>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
</template>

<script>
import _ from 'lodash';
import jQuery from 'jquery';
import { RuleConverter } from 'rule-converter';

import Store from './store';

import Rule from './Rule';
import Box  from './Box';

window.jQuery = window.$ = jQuery

export default {
  name: 'app',
  components: { Rule, Box },
  data () {
    return {
      visible: {
        filter: true,
        input: true
      },
      clear: false,
      rules: Store.fetch(),
      content:  '',
      state_table: {
        none:      '無',
        plain:     '無轉換',
        ambiguous: '歧義',
        auto:      '自動轉換',
        manual:    '手工轉換'
      }
    }
  },
  computed: {
    example() {
      const app = this
      console.log(app.state_table)
      return _.chain(app.state_table).toPairs().drop(2).value()
    },
    converter() {
      const app = this
      return new RuleConverter(JSON.stringify(app.rules))
    },
    result() {
      const app = this
      return _.map(app.converter.convert(app.content), cs => _.flatMap(cs, c => {
        if (c.state !== 'plain')
          return [c]
        return _.chain(c.content)
          .split('')
          .chunk(3)
          .map(cs => {
            const str = _.join(cs, '')
            return {
              state: 'plain',
              content: str,
              result: str
            }
          })
          .value()
      }))
    }
  },
  watch: {
    rules: {
      handler(newRules) {
        Store.save(newRules)
      },
      deep: true
    }
  },
  methods: {
    visibleFilter() {
      this.visible.filter = !this.visible.filter
    },
    visibleInput() {
      this.visible.input  = !this.visible.input
    },
    updateRule(index, rule) {
      const app = this
      app.rules = _.map(app.rules, (r, idx) => {
        if (idx !== index)
          return r
        return rule
      })
    },
    appendRule() {
      const app = this
      app.rules = _.concat(app.rules, [['', '', []]])
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

textarea.content {
  width: 100%;
  height: 100%;
  resize: none;
}

span.char {
  display: inline-block;
  border-radius: 1rem;
  margin: 0 0.1rem 0 0.1rem;
  padding: 0.1rem 0.25rem 0.1rem 0.25rem;
  font-size: 1.5rem;
  line-height: 2rem;
}
span.char.auto {
  background-color: lightblue;
}
span.char.ambiguous {
  background-color: lightpink;
}
span.char.manual {
  background-color: mediumseagreen;
}
span.char.diff {
  color: red;
}
span.char.clear {
  background-color: transparent;
  margin: 0 0 0 0;
  padding: 0 0 0 0;
}
</style>
